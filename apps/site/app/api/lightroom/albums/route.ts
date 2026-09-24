import { NextResponse } from "next/server";
import { lightroom } from "../../../../src/composition";
import { LightroomApiError } from "@clubi/infrastructure";

export async function GET() {
  try {
    return NextResponse.json({ albums: await lightroom.listAlbums() });
  } catch (error) {
    const status = error instanceof LightroomApiError ? error.status : 502;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Lightroom unavailable" }, { status });
  }
}