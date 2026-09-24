import { NextResponse } from "next/server";
import { publishPublication } from "../../../../../src/composition";

type Context = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Context) {
  const { id } = await params;
  const publication = await publishPublication.execute(id);
  if (!publication) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(publication);
}
