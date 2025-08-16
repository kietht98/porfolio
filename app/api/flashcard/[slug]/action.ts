import {
  writeFileSync,
  readFileSync,
  existsSync,
  mkdirSync,
  unlink,
  writeFile,
} from "fs";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

async function getFile(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const type = formData.get("type") as string;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);
  return { buffer, file, type };
}

async function uploadFile({
  buffer,
  file,
  path,
  type,
}: {
  buffer: Uint8Array;
  file: File;
  path: string;
  type: string;
}) {
  writeFileSync(path, buffer); // write in server
  writeFileSync(`./public/uploads/${type}.json`, buffer); // write in folder source
  const fileJson = readFileSync(path, "utf-8");
  return fileJson;
}

async function existsOrCreateSyncFolder(path: string) {
  if (!existsSync(path)) {
    mkdirSync(path);
  }
}

async function uploadFiles(request: NextRequest) {
  const { buffer, file, type } = await getFile(request);
  const pathFolder = `${__dirname}/upload`;
  const pathFileUpload = `${__dirname}/upload/${uuid()}-${file.name}`;
  const pathFileSync = `${__dirname}/${type}.json`;
  await existsOrCreateSyncFolder(pathFolder);
  const fileJson = await uploadFile({
    buffer: buffer,
    file: file,
    path: pathFileUpload,
    type: type,
  });
  unlink(pathFileUpload, () => {});
  if (existsSync(pathFileSync)) {
    const dataJson = readFileSync(pathFileSync, "utf-8");
    const parseDataJson = JSON.parse(dataJson);
    const parseFileJson = JSON.parse(fileJson);
    let mapJson = parseDataJson.concat(parseFileJson);
    const uniqueKeys = new Set(mapJson.map((obj: any) => obj.phrase));
    const uniqueObjectsArray = Array.from(uniqueKeys).map((key) =>
      mapJson.find((obj: any) => obj.phrase === key)
    );
    writeFileSync(
      pathFileSync,
      new Uint8Array(Buffer.from(JSON.stringify(uniqueObjectsArray)))
    );
    return NextResponse.json({
      data: uniqueObjectsArray,
    });
  } else {
    writeFileSync(pathFileSync, buffer);
    return NextResponse.json({
      data: JSON.parse(fileJson),
    });
  }
}

async function exportFile(type: string) {
  // Define the path to the file
  const filePath = `${__dirname}/${type}.json`;
  // Read the file from the filesystem
  const fileBuffer = readFileSync(filePath);

  // Create a response with the file
  const response = new NextResponse(fileBuffer as any, {
    headers: {
      "Content-Type": "text/plain",
      "Content-Disposition": `attachment; filename="${__dirname}/${type}.json"`,
    },
  });

  return response;
}

function getFileLocal(pathFileSync: string, pathFileSource: string) {
  const dataJson = readFileSync(pathFileSync, "utf-8");
  writeFileSync(pathFileSource, dataJson); // write in folder source
  const uniqueKeys = new Set(
    JSON.parse(dataJson).map((obj: any) => obj.phrase)
  );
  const uniqueObjectsArray = Array.from(uniqueKeys).map((key) =>
    JSON.parse(dataJson).find((obj: any) => obj.phrase === key)
  );
  return uniqueObjectsArray;
}

function getFileSource(pathFileSync: string, type?: string) {
  const dataJson = require(`../../../../public/uploads/${type}.json`);
  writeFileSync(pathFileSync, Buffer.from(JSON.stringify(dataJson)) as any);
  const uniqueKeys = new Set(dataJson.map((obj: any) => obj.phrase));
  const uniqueObjectsArray = Array.from(uniqueKeys).map((key) =>
    dataJson.find((obj: any) => obj.phrase === key)
  );
  console.log("uniqueObjectsArray", uniqueObjectsArray);
  return uniqueObjectsArray;
}

export {
  existsOrCreateSyncFolder,
  existsSync,
  exportFile,
  getFile,
  uploadFile,
  uploadFiles,
  getFileLocal,
  getFileSource,
};
