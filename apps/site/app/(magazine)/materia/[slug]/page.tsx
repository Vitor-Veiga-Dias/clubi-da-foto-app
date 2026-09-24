import { collectAssetIds } from "@clubi/domain";
import type { PublicationType } from "@clubi/domain";
import { notFound } from "next/navigation";
import { PublicationRenderer } from "@clubi/block-registry";
import { getPublicationBySlug, resolveAssets } from "../../../../src/composition";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

const TYPE_LABEL: Record<PublicationType, string> = {
  article: "matéria",
  essay: "ensaio",
  interview: "entrevista",
  column: "coluna",
  gallery: "galeria",
};

function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getUTCFullYear()}`;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const publication = await getPublicationBySlug.execute(slug);
  if (!publication) return {};
  return {
    title: publication.title,
    description: publication.dek,
  };
}

export default async function MatterPage({ params }: Props) {
  const { slug } = await params;
  const publication = await getPublicationBySlug.execute(slug);
  if (!publication) notFound();

  const assets = await resolveAssets.execute(collectAssetIds(publication));
  // topbar do demo: "Encontro 01 · 09/04/2026"
  const tag = [publication.meta.kicker, formatDate(publication.meta.publishedAt)]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <header className="article-topbar">
        <div className="article-topbar-inner">
          <Link href="/">
            <b>Clubi</b> — {TYPE_LABEL[publication.type]}
          </Link>
          {tag ? <span className="article-topbar-tag">{tag}</span> : null}
        </div>
      </header>
      <PublicationRenderer publication={publication} assets={assets} />
      <Link href="/edicao" className="next-matter">
        <span>A seguir</span>
        <strong>Sumário do encontro 01 →</strong>
      </Link>
    </>
  );
}
