import { NextResponse } from "next/server";
import { fireflyLightroom } from "../../../../../../src/composition";

type Context = { params: Promise<{ jobId: string }> };

export async function GET(_: Request, { params }: Context) {
  const { jobId } = await params;
  try {
    return NextResponse.json(await fireflyLightroom.getJob(jobId));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Firefly status failed" },
      { status: 502 },
    );
  }
}