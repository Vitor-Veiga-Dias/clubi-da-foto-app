"use client";

import type { ReactNode } from "react";
import type {
  BlockLayout,
  ImageContent,
  LightroomEmbedContent,
  SectionMode,
  TextContent,
} from "@clubi/domain";
import { isLightroomEmbedUrl, normalizeLightroomEmbedInput } from "@clubi/domain";
import type { useEditorState } from "./useEditorState";

const MODES: SectionMode[] = [
  "full",
  "split",
  "grid",
  "carousel",
  "freeform",
  "opening",
];

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="ed-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function PropsPanel({ editor }: { editor: ReturnType<typeof useEditorState> }) {
  const { publication, selected, preview } = editor;
  const block = selected.block;
  const layout: BlockLayout | undefined = block
    ? preview === "desktop"
      ? block.layout.desktop
      : { ...block.layout.desktop, ...block.layout[preview] }
    : undefined;

  return (
    <aside className="ed-props">
      <p className="ed-panel-label">Propriedades</p>
      {!block ? (
        <>
          <Field label="Título">
            <input
              value={publication.title}
              onChange={(event) => editor.patchPublication({ title: event.target.value })}
            />
          </Field>
          <Field label="Slug">
            <input
              value={publication.slug}
              onChange={(event) => editor.patchPublication({ slug: event.target.value })}
            />
          </Field>
          <Field label="Linha fina">
            <textarea
              rows={3}
              value={publication.dek ?? ""}
              onChange={(event) => editor.patchPublication({ dek: event.target.value })}
            />
          </Field>
          <Field label="Capa Lightroom (URL ou iframe oficial)">
            <textarea
              rows={4}
              value={publication.coverEmbedUrl ?? ""}
              onChange={(event) => {
                const value = event.target.value.trim();
                if (!value) {
                  editor.patchPublication({ coverEmbedUrl: undefined });
                  return;
                }
                try {
                  editor.patchPublication({ coverEmbedUrl: normalizeLightroomEmbedInput(value) });
                } catch {
                  editor.patchPublication({ coverEmbedUrl: value });
                }
              }}
            />
            {publication.coverEmbedUrl && !isLightroomEmbedUrl(publication.coverEmbedUrl) ? (
              <small>Use uma URL https://lightroom.adobe.com ou o iframe oficial.</small>
            ) : null}
          </Field>
          {selected.section ? (
            <Field label="Modo da seção">
              <select
                value={selected.section.mode}
                onChange={(event) => editor.setSectionMode(event.target.value as SectionMode)}
              >
                {MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </Field>
          ) : null}
        </>
      ) : (
        <>
          <p className="ed-kicker">{block.type}</p>
          {"text" in block.content ? (
            <Field label="Texto">
              <textarea
                rows={6}
                value={(block.content as TextContent).text}
                onChange={(event) =>
                  editor.patchContent(block.id, {
                    ...(block.content as TextContent),
                    text: event.target.value,
                  })
                }
              />
            </Field>
          ) : null}
          {block.type === "image" ? (
            <>
              <Field label="Asset">
                <select
                  value={(block.content as ImageContent).assetId}
                  onChange={(event) =>
                    editor.patchContent(block.id, {
                      ...(block.content as ImageContent),
                      assetId: event.target.value,
                    })
                  }
                >
                  {editor.assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.id}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Alt">
                <input
                  value={(block.content as ImageContent).alt}
                  onChange={(event) =>
                    editor.patchContent(block.id, {
                      ...(block.content as ImageContent),
                      alt: event.target.value,
                    })
                  }
                />
              </Field>
              <Field label="Proporção">
                <select
                  value={layout?.aspectRatio ?? "3/4"}
                  onChange={(event) =>
                    editor.patchLayout(selected.section!.id, block.id, {
                      aspectRatio: event.target.value,
                    })
                  }
                >
                  <option value="16/10">16:10 abertura</option>
                  <option value="3/4">3:4 editorial</option>
                  <option value="1/1">1:1 miniatura</option>
                  <option value="4/5">4:5</option>
                </select>
              </Field>
            </>
          ) : null}
          {block.type === "lightroom-embed" ? (
            <>
              <Field label="URL ou código de embed">
                <textarea
                  rows={4}
                  value={(block.content as LightroomEmbedContent).embedUrl}
                  onChange={(event) => {
                    const value = event.target.value;
                    let embedUrl = value;
                    try {
                      embedUrl = normalizeLightroomEmbedInput(value);
                    } catch {
                      // Keep the input editable until the user finishes pasting.
                    }
                    editor.patchContent(block.id, {
                      ...(block.content as LightroomEmbedContent),
                      embedUrl,
                    });
                  }}
                />
                {!isLightroomEmbedUrl((block.content as LightroomEmbedContent).embedUrl) ? (
                  <small>Use uma URL https://lightroom.adobe.com ou o iframe oficial.</small>
                ) : null}
              </Field>
              <Field label="Título do embed">
                <input
                  value={(block.content as LightroomEmbedContent).title ?? ""}
                  onChange={(event) =>
                    editor.patchContent(block.id, {
                      ...(block.content as LightroomEmbedContent),
                      title: event.target.value,
                    })
                  }
                />
              </Field>
              <Field label="Legenda">
                <input
                  value={(block.content as LightroomEmbedContent).caption ?? ""}
                  onChange={(event) =>
                    editor.patchContent(block.id, {
                      ...(block.content as LightroomEmbedContent),
                      caption: event.target.value,
                    })
                  }
                />
              </Field>
              <Field label="Proporção">
                <input
                  type="number"
                  min={0.25}
                  max={10}
                  step={0.01}
                  value={(block.content as LightroomEmbedContent).aspectRatio ?? 16 / 9}
                  onChange={(event) =>
                    editor.patchContent(block.id, {
                      ...(block.content as LightroomEmbedContent),
                      aspectRatio: Number(event.target.value),
                    })
                  }
                />
              </Field>
            </>
          ) : null}
          {layout ? (
            <>
              <Field label={`Col start (${preview})`}>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={layout.colStart}
                  onChange={(event) =>
                    editor.patchLayout(selected.section!.id, block.id, {
                      colStart: Number(event.target.value),
                    })
                  }
                />
              </Field>
              <Field label="Col span">
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={layout.colSpan}
                  onChange={(event) =>
                    editor.patchLayout(selected.section!.id, block.id, {
                      colSpan: Number(event.target.value),
                    })
                  }
                />
              </Field>
              <Field label="Bleed">
                <input
                  type="checkbox"
                  checked={Boolean(layout.bleed)}
                  onChange={(event) =>
                    editor.patchLayout(selected.section!.id, block.id, {
                      bleed: event.target.checked,
                    })
                  }
                />
              </Field>
              <Field label="Order (mobile)">
                <input
                  type="number"
                  value={layout.order ?? 0}
                  onChange={(event) =>
                    editor.patchLayout(selected.section!.id, block.id, {
                      order: Number(event.target.value),
                    })
                  }
                />
              </Field>
            </>
          ) : null}
          <div className="ed-inline">
            <button type="button" onClick={() => editor.moveBlock(-1)}>
              Subir
            </button>
            <button type="button" onClick={() => editor.moveBlock(1)}>
              Descer
            </button>
            <button type="button" onClick={editor.duplicateBlock}>
              Duplicar
            </button>
            <button type="button" onClick={editor.removeBlock}>
              Apagar
            </button>
          </div>
        </>
      )}
      {editor.message ? <p className="ed-message">{editor.message}</p> : null}
    </aside>
  );
}
