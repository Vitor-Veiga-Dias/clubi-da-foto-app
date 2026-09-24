"use client";

import type { useEditorState } from "./useEditorState";

export function LayersPanel({ editor }: { editor: ReturnType<typeof useEditorState> }) {
  return (
    <aside className="ed-layers">
      <p className="ed-panel-label">Estrutura</p>
      <ul>
        {editor.publication.sections.map((section, sectionIndex) => (
          <li key={section.id}>
            <button
              type="button"
              className="ed-layer-section"
              data-active={editor.selectedSectionId === section.id && !editor.selectedBlockId}
              onClick={() => editor.select(section.id, null)}
            >
              {String(sectionIndex + 1).padStart(2, "0")} · {section.mode}
            </button>
            <ul>
              {section.blocks.map((block) => (
                <li key={block.id}>
                  <button
                    type="button"
                    className="ed-layer-block"
                    data-active={editor.selectedBlockId === block.id}
                    onClick={() => editor.select(section.id, block.id)}
                  >
                    {block.type}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </aside>
  );
}
