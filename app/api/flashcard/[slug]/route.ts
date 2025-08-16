import { existsSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { uploadFiles, exportFile, getFileLocal, getFileSource } from "./action";
import { writeLog } from "@/app/utils/writeLog";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (slug === "upload") {
    return uploadFiles(request);
  }
  if (slug === "export") {
    const param = await request.json();
    return await exportFile(param.type);
  }

  return NextResponse.json({ data: "success" });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (slug === "getFile") {
    const type = request.nextUrl.searchParams.get("type") ?? "";
    const pathFileSync = `${__dirname}/${type}.json`;
    const pathFileSource = `./public/uploads/${type}.json`;

    if (existsSync(pathFileSync)) {
      console.log("pathFileSync");
      try {
        const uniqueObjectsArray = getFileLocal(pathFileSync, pathFileSource);
        return NextResponse.json({
          data: uniqueObjectsArray,
        });
      } catch (error) {
        return NextResponse.json(error);
      }
    }
    if (existsSync(pathFileSource)) {
      console.log("pathFileSource");

      try {
        const uniqueObjectsArray = getFileSource(pathFileSync, type);
        console.log("uniqueObjectsArray", uniqueObjectsArray);
        return NextResponse.json({ data: uniqueObjectsArray });
      } catch (error) {
        console.log("error", error);
        return NextResponse.json(error);
      }
    }
    return NextResponse.json({
      data: [],
    });
  }
  return NextResponse.json({
    data: [],
  });
}
