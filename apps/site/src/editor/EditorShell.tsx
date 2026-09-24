"use client";

import type { Asset, Publication } from "@clubi/domain";
import { EditablePublication } from "@clubi/block-registry";
import { EditorToolbar } from "./EditorToolbar";
import { LayersPanel } from "./LayersPanel";
import { PropsPanel } from "./PropsPanel";
import { useEditorState } from "./useEditorState";
import "./editor.css";

export function EditorShell({
  publication,
  assets,
}: {
  publication: Publication;
  assets: Asset[];
}) {
  const editor = useEditorState(publication, assets);

  return (
    <div className="ed-shell">
      <EditorToolbar editor={editor} />
      <LayersPanel editor={editor} />
      <main className="ed-canvas">
        <EditablePublication
          publication={editor.publication}
          assets={editor.assets}
          selectedBlockId={editor.selectedBlockId}
          preview={editor.preview}
          onSelect={editor.select}
          onLayoutChange={editor.patchLayout}
          onContentChange={editor.patchContent}
          onAssetImported={editor.addAsset}
        />
      </main>
      <PropsPanel editor={editor} />
    </div>
  );
}
