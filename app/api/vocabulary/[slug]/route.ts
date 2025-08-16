import { existsSync, readFileSync, writeFile } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { getTotalCounts, getGrammar, exportFile, updateFile } from "./action";
import { writeLog } from "@/app/utils/writeLog";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (slug === "getTotals") {
    return getTotalCounts();
  }
  return getGrammar(slug);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const param = await request.json();
  if (slug === "export") {
    return exportFile(param.type, slug);
  }
  updateFile(slug, param);
  return NextResponse.json({
    data: {
      message: "write success",
    },
  });
}
