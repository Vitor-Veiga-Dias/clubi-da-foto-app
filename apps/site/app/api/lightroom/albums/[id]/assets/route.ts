import { NextResponse } from "next/server";
import { lightroom } from "../../../../../../src/composition";
import { LightroomApiError } from "@clubi/infrastructure";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Context) {
  const { id } = await params;
  const query = new URL(request.url).searchParams;
  try {
    const assets = await lightroom.listAssets(id, {
      capturedAfter: query.get("capturedAfter") ?? undefined,
      capturedBefore: query.get("capturedBefore") ?? undefined,
    });
    return NextResponse.json({ assets });
  } catch (error) {
    const status = error instanceof LightroomApiError ? error.status : 502;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Lightroom unavailable" }, { status });
  }
}