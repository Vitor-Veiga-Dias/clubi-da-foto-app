import type { Asset, Publication } from "@clubi/domain";
import { PublicationShell } from "./core";

export function PublicationRenderer({
  publication,
  assets,
  mode = "read",
}: {
  publication: Publication;
  assets: Asset[];
  mode?: "read" | "edit";
}) {
  return (
    <PublicationShell publication={publication} assets={assets} mode={mode} />
  );
}
