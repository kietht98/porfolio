// scripts/drive_sync.mjs
import fs from "node:fs";
import path from "node:path";
import { google } from "googleapis";
import AdmZip from "adm-zip";

const {
  GDRIVE_CREDENTIALS_PATH = "creds.json",
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

async function downloadFile(drive, fileId, outPath) {
  const dest = fs.createWriteStream(outPath);
  const { data } = await drive.files.get(
    { fileId, alt: "media" },
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

async function listZipInFolder(drive, folderId) {
  // Tìm các file .zip trực tiếp trong folder
  const q = [
    `'${folderId}' in parents`,
    "mimeType = 'application/zip' or name contains '.zip'",
    "trashed = false",
  ].join(" and ");

  const res = await drive.files.list({
    q,
    fields: "files(id, name, modifiedTime, size)",
    pageSize: 1000,
    orderBy: "modifiedTime desc",
  });

  return res.data.files || [];
}

function unzipToTarget(archivePath, targetDir, { stripTopDir = false } = {}) {
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
    // Mode: 1 file cụ thể
    const out = path.join(tmpDir, "source.zip");
    await downloadFile(drive, GDRIVE_FILE_ID, out);
    unzipToTarget(out, targetDir, { stripTopDir });
  } else if (GDRIVE_FOLDER_ID) {
    const files = await listZipInFolder(drive, GDRIVE_FOLDER_ID);
    if (!files.length) {
      log("No .zip found in folder.");
      return;
    }

    const pickList =
      DRIVE_FOLDER_MODE === "all" ? files : [files[0]]; // files đã sort desc theo modifiedTime

    for (const f of pickList) {
      const out = path.join(tmpDir, `${f.id}.zip`);
      log(`Processing: ${f.name} (${f.id}) modified ${f.modifiedTime}`);
      await downloadFile(drive, f.id, out);
      unzipToTarget(out, targetDir, { stripTopDir });
    }
  } else {
    throw new Error(
      "Missing GDRIVE_FILE_ID or GDRIVE_FOLDER_ID. Set one via repo secrets."
    );
  }

  log("Done unzip. Files are staged in repo working directory.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
