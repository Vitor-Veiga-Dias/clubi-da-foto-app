import Link from "next/link";
import { getCurrentIssue, resolveAssets } from "../../src/composition";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const current = await getCurrentIssue.execute();
  if (!current) return null;

  const coverId = current.issue.coverAssetId;
  const [cover] = await resolveAssets.execute([coverId]);
  const lead = current.publications[0];
  const issueNo = String(current.issue.number).padStart(2, "0");

  return (
    <main className="cover">
      <section className="cover-photo">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover.originalUrl}
            alt={lead ? `${lead.title}, capa da edição ${issueNo}` : current.issue.title}
          />
        ) : null}
        <p className="cover-kicker">
          {lead?.meta.kicker ?? "Revista"} · {current.issue.publishedAt?.replaceAll("-", ".") ?? "edição corrente"}
        </p>
        <h1 className="cover-title">{lead?.title ?? current.issue.title}</h1>
      </section>
      <aside className="cover-index">
        <p className="folio">
          <span className="clubi-dot" aria-hidden />
          Clubi da Foto
        </p>
        <p className="cover-issue">{issueNo}</p>
        <h2>Sumário da edição</h2>
        <ol className="toc">
          {current.publications.map((publication, index) => (
            <li key={publication.id}>
              <span className="toc-num">{String(index + 1).padStart(2, "0")}</span>
              <span className="toc-type">{publication.meta.kicker ?? publication.type}</span>
              <Link className="toc-title" href={`/materia/${publication.slug}`}>
                {publication.title}
              </Link>
              <span className="toc-time">{publication.meta.readingTime ?? "—"} min · {publication.meta.author}</span>
            </li>
          ))}
        </ol>
      </aside>
    </main>
  );
}
