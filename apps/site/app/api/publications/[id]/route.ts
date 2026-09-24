import { NextResponse } from "next/server";
import { savePublication } from "../../../../src/composition";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Context) {
  const body = await request.json();
  try {
    const publication = await savePublication.execute(body);
    return NextResponse.json(publication);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "invalid" },
      { status: 400 },
    );
  }
}
