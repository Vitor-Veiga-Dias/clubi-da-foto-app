import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ mode: process.env.LIGHTROOM_MODE === "adobe" ? "adobe" : "mock" });
}