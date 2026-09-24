import Link from "next/link";
import { getCurrentIssue, resolveAssets } from "../../../src/composition";

export const dynamic = "force-dynamic";

export default async function IssuePage() {
  const current = await getCurrentIssue.execute();
  if (!current) return null;
  const assets = await resolveAssets.execute(
    current.publications
      .map((item) => item.coverAssetId)
      .filter((id): id is string => Boolean(id)),
  );
  const byId = new Map(assets.map((asset) => [asset.id, asset]));
  const issueNo = String(current.issue.number).padStart(2, "0");

  return (
    <main className="issue">
      <header className="issue-head">
        <p className="folio">
          <span className="clubi-dot" aria-hidden />
          Edição {issueNo} · {current.issue.publishedAt?.replaceAll("-", ".")}
        </p>
        <h1>Índice.</h1>
        <p className="clubi-subheading">
          Uma foto pequena, a rubrica, o tempo de leitura. Como o sumário de uma revista impressa.
        </p>
      </header>
      <ol className="toc">
        {current.publications.map((publication, index) => {
          const cover = publication.coverAssetId
            ? byId.get(publication.coverAssetId)
            : undefined;
          return (
            <li key={publication.id}>
              <span className="toc-num">{String(index + 1).padStart(2, "0")}</span>
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="thumb" src={cover.originalUrl} alt="" />
              ) : (
                <span />
              )}
              <div>
                <p className="toc-type">{publication.meta.kicker}</p>
                <Link className="toc-title" href={`/materia/${publication.slug}`}>
                  {publication.title}
                </Link>
              </div>
              <span className="toc-time">{publication.meta.readingTime} min</span>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
