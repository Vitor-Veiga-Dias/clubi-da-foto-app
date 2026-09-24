"use client";

import type { Asset, Block, BlockLayout, Breakpoint, Publication } from "@clubi/domain";
import { PublicationShell } from "./core";
import { EditChrome } from "./EditChrome";

export function EditablePublication({
  publication,
  assets,
  selectedBlockId,
  preview,
  onSelect,
  onLayoutChange,
  onContentChange,
  onAssetImported,
}: {
  publication: Publication;
  assets: Asset[];
  selectedBlockId: string | null;
  preview: Breakpoint;
  onSelect: (sectionId: string, blockId: string | null) => void;
  onLayoutChange: (
    sectionId: string,
    blockId: string,
    patch: Partial<BlockLayout>,
    recordHistory?: boolean,
  ) => void;
  onContentChange: (blockId: string, content: Block["content"]) => void;
  onAssetImported: (asset: Asset) => void;
}) {
  return (
    <div
      onClick={() => onSelect(publication.sections[0]?.id ?? "", null)}
    >
      <PublicationShell
        publication={publication}
        assets={assets}
        mode="edit"
        preview={preview}
        chrome={({ section, block, children }) => (
          <EditChrome
            key={block.id}
            section={section}
            block={block}
            selected={selectedBlockId === block.id}
            breakpoint={preview}
            assets={assets}
            onSelect={() => onSelect(section.id, block.id)}
            onLayoutChange={(patch, recordHistory) =>
            onLayoutChange(section.id, block.id, patch, recordHistory)
          }
            onContentChange={(content) => onContentChange(block.id, content)}
            onAssetImported={onAssetImported}
          >
            {children}
          </EditChrome>
        )}
      />
    </div>
  );
}
