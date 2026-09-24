import Link from "next/link";
import { listPublications } from "../../src/composition";
import { NewPublicationButton } from "./NewPublicationButton";
import "../globals.css";
import "../../src/editor/editor.css";

export const dynamic = "force-dynamic";

export default async function EditorIndexPage() {
  const publications = await listPublications.execute();
  return (
    <main className="ed-list">
      <p className="toc-type">
        <span className="clubi-dot" aria-hidden />
        Editorial Layout Engine
      </p>
      <h1 className="clubi-heading" style={{ fontSize: "3rem" }}>
        Publicações
      </h1>
      <NewPublicationButton />
      <ul>
        {publications.map((publication) => (
          <li key={publication.id}>
            <div>
              <Link className="toc-title" href={`/editor/${publication.slug}`}>
                {publication.title}
              </Link>
              <p className="toc-type">
                {publication.status} · {publication.type} · /{publication.slug}
              </p>
            </div>
            {publication.status === "published" ? (
              <Link href={`/materia/${publication.slug}`}>ver no site</Link>
            ) : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
