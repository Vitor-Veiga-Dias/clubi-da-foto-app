import { NextResponse } from "next/server";
import { fireflyLightroom } from "../../../../../src/composition";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "A Firefly edit request is required" }, { status: 400 });
  }
  try {
    const job = await fireflyLightroom.applyEdits(body);
    return NextResponse.json(job, { status: 202 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Firefly edit failed" },
      { status: 502 },
    );
  }
}