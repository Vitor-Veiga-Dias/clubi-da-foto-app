import { notFound } from "next/navigation";
import { getPublication, listAssets } from "../../../src/composition";
import { EditorShell } from "../../../src/editor/EditorShell";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function EditorPage({ params }: Props) {
  const { slug } = await params;
  const publication = await getPublication.execute(slug);
  if (!publication) notFound();
  const assets = await listAssets.execute();
  return <EditorShell publication={publication} assets={assets} />;
}
