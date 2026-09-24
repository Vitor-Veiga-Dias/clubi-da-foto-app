import { NextResponse } from "next/server";
import { assetRepository, LightroomApiError } from "@clubi/infrastructure";
import { lightroom } from "../../../../src/composition";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { sourceId?: string };
  if (!body.sourceId) return NextResponse.json({ error: "sourceId is required" }, { status: 400 });
  try {
    const asset = await lightroom.importAsset(body.sourceId);
    const existing = await assetRepository.getById(asset.id);
    if (!existing) await assetRepository.save(asset);
    return NextResponse.json({ asset: existing ?? asset, status: "completed" });
  } catch (error) {
    const status = error instanceof LightroomApiError ? error.status : 502;
    return NextResponse.json({ error: error instanceof Error ? error.message : "Import failed" }, { status });
  }
}