// scripts/drive_sync.mjs
import fs from "node:fs";
import path from "node:path";
import { google } from "googleapis";
import { execFileSync } from "node:child_process";

const {
  GDRIVE_CREDENTIALS_PATH = "creds.json", // NHỚ: trong workflow phải truyền path ở $RUNNER_TEMP
  GDRIVE_FILE_ID,
  GDRIVE_FOLDER_ID,
  REPO_TARGET_DIR = "",
  DRIVE_FOLDER_MODE = "latest", // latest | all
  STRIP_TOP_DIR = "0",
} = process.env;

function log(...args) {
  console.log("[drive-sync]", ...args);
}

async function getAuth() {
  const creds = JSON.parse(fs.readFileSync(GDRIVE_CREDENTIALS_PATH, "utf8"));
  const scopes = ["https://www.googleapis.com/auth/drive.readonly"];
  const auth = new google.auth.GoogleAuth({ credentials: creds, scopes });
  return await auth.getClient();
}

async function resolveFileId(drive, fileId) {
  const meta = await drive.files.get({
    fileId,
    fields: "id,name,mimeType,shortcutDetails",
    supportsAllDrives: true,
  });
  const f = meta.data;
  if (f.mimeType === "application/vnd.google-apps.shortcut") {
    return f.shortcutDetails?.targetId;
  }
  return fileId;
}

async function getFileMeta(drive, fileId) {
  const { data } = await drive.files.get({
    fileId,
    fields: "id,name,mimeType,size,md5Checksum,driveId",
    supportsAllDrives: true,
  });
  return data;
}

async function downloadFile(drive, fileId, outPath) {
  const dest = fs.createWriteStream(outPath);
  const { data } = await drive.files.get(
    { fileId, alt: "media", supportsAllDrives: true },
    { responseType: "stream" }
  );
  await new Promise((resolve, reject) => {
    data.on("error", reject);
    dest.on("finish", resolve);
    data.pipe(dest);
  });
  const stat = fs.statSync(outPath);
  log(`Downloaded ${outPath} (${stat.size} bytes)`);
}

async function listArchivesInFolder(drive, folderId) {
  const q = [
    `'${folderId}' in parents`,
    "(name contains '.zip' or name contains '.7z')",
    "trashed = false",
  ].join(" and ");

  const res = await drive.files.list({
    q,
    fields: "files(id, name, modifiedTime, size)",
    pageSize: 1000,
    orderBy: "modifiedTime desc",
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
  });

  return res.data.files || [];
}

function looksLikeZip(filePath) {
  const fd = fs.openSync(filePath, "r");
  const buf = Buffer.alloc(4);
  fs.readSync(fd, buf, 0, 4, 0);
  fs.closeSync(fd);
  return buf[0] === 0x50 && buf[1] === 0x4b && buf[2] === 0x03 && buf[3] === 0x04;
}

function extractArchive(archivePath, targetDir, { stripTopDir = false } = {}) {
  fs.mkdirSync(targetDir || ".", { recursive: true });
  const ext = path.extname(archivePath).toLowerCase();

  if (ext === ".zip") {
    if (!looksLikeZip(archivePath)) {
      throw new Error(`File ${archivePath} is not a valid ZIP (missing PK signature)`);
    }
    execFileSync("unzip", ["-o", archivePath, "-d", targetDir], { stdio: "inherit" });
  } else if (ext === ".7z") {
    execFileSync("7z", ["x", "-y", archivePath, `-o${targetDir}`], { stdio: "inherit" });
  } else {
    throw new Error(`Unsupported archive type: ${ext}`);
  }

  if (stripTopDir) {
    const items = fs.readdirSync(targetDir);
    if (items.length === 1) {
      const only = path.join(targetDir, items[0]);
      if (fs.statSync(only).isDirectory()) {
        for (const f of fs.readdirSync(only)) {
          fs.renameSync(path.join(only, f), path.join(targetDir, f));
        }
        fs.rmSync(only, { recursive: true, force: true });
      }
    }
  }
}

async function main() {
  const auth = await getAuth();
  const drive = google.drive({ version: "v3", auth });

  const tmpDir = "/tmp/drive-sync";
  fs.rmSync(tmpDir, { recursive: true, force: true });
  fs.mkdirSync(tmpDir, { recursive: true });

  const targetDir = REPO_TARGET_DIR ? REPO_TARGET_DIR.replace(/\/+$/, "") : ".";
  fs.mkdirSync(targetDir || ".", { recursive: true });

  const stripTopDir = STRIP_TOP_DIR === "1";

  if (GDRIVE_FILE_ID) {
    let realId = await resolveFileId(drive, GDRIVE_FILE_ID);
    const meta = await getFileMeta(drive, realId);
    if (meta.mimeType?.startsWith("application/vnd.google-apps")) {
      throw new Error(`File ${meta.name} is a Google Doc type, not a binary archive`);
    }
    const out = path.join(tmpDir, meta.name);
    await downloadFile(drive, realId, out);
    extractArchive(out, targetDir, { stripTopDir });
  } else if (GDRIVE_FOLDER_ID) {
    const files = await listArchivesInFolder(drive, GDRIVE_FOLDER_ID);
    if (!files.length) {
      log("No archive found in folder.");
      return;
    }
    const pickList = DRIVE_FOLDER_MODE === "all" ? files : [files[0]];
    for (const f of pickList) {
      const out = path.join(tmpDir, f.name);
      log(`Processing: ${f.name} (${f.id}) modified ${f.modifiedTime}`);
      await downloadFile(drive, f.id, out);
      extractArchive(out, targetDir, { stripTopDir });
    }
  } else {
    throw new Error("Missing GDRIVE_FILE_ID or GDRIVE_FOLDER_ID");
  }

  log("Done extracting. Files are staged in repo working directory.");
}

main().catch((e) => {
  console.error(e);
  if (e.response && e.response.data) {
    console.error("Drive API error body:", e.response.data);
  }
  process.exit(1);
});
