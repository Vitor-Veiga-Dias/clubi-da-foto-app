import type { Publication } from "./entities";

export function collectAssetIds(publication: Publication): string[] {
  const ids = new Set<string>();
  if (publication.coverAssetId) ids.add(publication.coverAssetId);
  for (const section of publication.sections) {
    for (const block of section.blocks) {
      const content = block.content as Record<string, unknown>;
      if (typeof content.assetId === "string") ids.add(content.assetId);
      if (Array.isArray(content.items)) {
        for (const item of content.items) {
          if (item && typeof item === "object" && "assetId" in item) {
            ids.add(String((item as { assetId: string }).assetId));
          }
        }
      }
    }
  }
  return [...ids];
}
