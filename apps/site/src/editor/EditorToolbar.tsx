"use client";

import type { BlockType } from "@clubi/domain";
import type { useEditorState } from "./useEditorState";

const BLOCKS: { type: BlockType; label: string }[] = [
  { type: "heading", label: "Título" },
  { type: "subheading", label: "Subtítulo" },
  { type: "text", label: "Texto" },
  { type: "quote", label: "Citação" },
  { type: "caption", label: "Legenda" },
  { type: "image", label: "Imagem" },
  { type: "gallery", label: "Galeria" },
  { type: "lightroom-embed", label: "Lightroom" },
  { type: "spacer", label: "Espaço" },
  { type: "divider", label: "Divisória" },
];

export function EditorToolbar({
  editor,
}: {
  editor: ReturnType<typeof useEditorState>;
}) {
  return (
    <div className="ed-toolbar">
      <a className="ed-wordmark" href="/editor">
        Clubi<span className="wordmark-dot" /> Editor
      </a>
      <div className="ed-breakpoints" role="tablist" aria-label="Preview">
        {(["desktop", "tablet", "mobile"] as const).map((item) => (
          <button
            key={item}
            type="button"
            data-active={editor.preview === item}
            onClick={() => editor.setPreview(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="ed-add">
        {BLOCKS.map((item) => (
          <button key={item.type} type="button" onClick={() => editor.addBlock(item.type)}>
            {item.label}
          </button>
        ))}
        <button type="button" onClick={() => editor.addSection("full")}>
          + Seção
        </button>
      </div>
      <div className="ed-actions">
        <button type="button" onClick={editor.undo} disabled={!editor.canUndo}>
          Desfazer
        </button>
        <button type="button" onClick={editor.redo} disabled={!editor.canRedo}>
          Refazer
        </button>
        <a href={`/materia/${editor.publication.slug}`} target="_blank" rel="noreferrer">
          Preview
        </a>
        <button type="button" onClick={() => void editor.save()} disabled={editor.saving}>
          {editor.saving ? "Salvando…" : editor.dirty ? "Salvar" : "Salvo"}
        </button>
        <button type="button" className="ed-publish" onClick={() => void editor.publish()}>
          Publicar
        </button>
      </div>
    </div>
  );
}
