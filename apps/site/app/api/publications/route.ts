import { NextResponse } from "next/server";
import { createPublication, listPublications } from "../../../src/composition";

export async function GET() {
  const publications = await listPublications.execute();
  return NextResponse.json(publications);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { title?: string };
  const publication = await createPublication.execute(body.title);
  return NextResponse.json(publication);
}
