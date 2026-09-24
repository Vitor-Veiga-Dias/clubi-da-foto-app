"use client";

import type { Asset, Block, BlockLayout, Breakpoint, ImageContent, Section } from "@clubi/domain";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useRef, useState } from "react";
import { blockStyle, isBleed } from "./core";

const COLUMNS: Record<Breakpoint, number> = {
  desktop: 12,
  tablet: 8,
  mobile: 4,
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function snapColumn(clientX: number, section: HTMLElement, columns: number) {
  const rect = section.getBoundingClientRect();
  const x = clientX - rect.left;
  const raw = Math.round((x / rect.width) * columns) + 1;
  return clamp(raw, 1, columns + 1);
}

function freeformGeometry(block: Block): NonNullable<BlockLayout["freeform"]> {
  const layout = block.layout.desktop;
  return (
    layout.freeform ?? {
      x: ((layout.colStart - 1) / 12) * 100,
      y: 0,
      width: (layout.colSpan / 12) * 100,
      height: 24,
    }
  );
}

export function EditChrome({
  section,
  block,
  selected,
  breakpoint,
  children,
  assets,
  onSelect,
  onLayoutChange,
  onContentChange,
  onAssetImported,
}: {
  section: Section;
  block: Block;
  selected: boolean;
  breakpoint: Breakpoint;
  children: ReactNode;
  assets: Asset[];
  onSelect: () => void;
  onLayoutChange: (patch: Partial<BlockLayout>, recordHistory?: boolean) => void;
  onContentChange: (content: Block["content"]) => void;
  onAssetImported: (asset: Asset) => void;
}) {
  const bleed = isBleed(block);
  const host = useRef<HTMLDivElement>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [pickerError, setPickerError] = useState<string | null>(null);
  const [albums, setAlbums] = useState<Array<{ id: string; name: string }>>([]);
  const [lightroomAssets, setLightroomAssets] = useState<Array<{ id: string; name: string; thumbnailUrl: string }>>([]);
  const [albumId, setAlbumId] = useState("");
  const [assetSearch, setAssetSearch] = useState("");
  const [capturedAfter, setCapturedAfter] = useState("");
  const [capturedBefore, setCapturedBefore] = useState("");
  const imageContent = block.type === "image" ? (block.content as ImageContent) : null;
  const [cropPoint, setCropPoint] = useState(
    imageContent?.focalPoint ?? { x: 0.5, y: 0.5 },
  );

  async function openPicker() {
    setPickerOpen(true);
    setPickerLoading(true);
    setPickerError(null);
    try {
      const response = await fetch("/api/lightroom/albums");
      if (!response.ok) throw new Error("Não foi possível carregar os álbuns");
      const data = (await response.json()) as { albums: Array<{ id: string; name: string }> };
      setAlbums(data.albums);
      if (data.albums[0]) {
        setAlbumId(data.albums[0].id);
        await loadAlbum(data.albums[0].id);
      }
    } catch (error) {
      setPickerError(error instanceof Error ? error.message : "Lightroom indisponível");
    } finally {
      setPickerLoading(false);
    }
  }

  async function loadAlbum(nextAlbumId: string) {
    setPickerLoading(true);
    try {
      const params = new URLSearchParams();
      if (capturedAfter) params.set("capturedAfter", capturedAfter);
      if (capturedBefore) params.set("capturedBefore", capturedBefore);
      const response = await fetch(`/api/lightroom/albums/${nextAlbumId}/assets?${params}`);
      if (!response.ok) throw new Error("Não foi possível carregar as fotos");
      const data = (await response.json()) as { assets: Array<{ id: string; name: string; thumbnailUrl: string }> };
      setLightroomAssets(data.assets);
    } catch (error) {
      setPickerError(error instanceof Error ? error.message : "Lightroom indisponível");
    } finally {
      setPickerLoading(false);
    }
  }

  async function importFromLightroom(sourceId: string) {
    setPickerLoading(true);
    setPickerError(null);
    try {
      const response = await fetch("/api/lightroom/imports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceId }),
      });
      if (!response.ok) throw new Error("Não foi possível importar a foto");
      const data = (await response.json()) as { asset: Asset };
      onAssetImported(data.asset);
      onContentChange({ ...imageContent!, assetId: data.asset.id });
      setPickerOpen(false);
    } catch (error) {
      setPickerError(error instanceof Error ? error.message : "Falha na importação");
    } finally {
      setPickerLoading(false);
    }
  }

  function currentLayout(): BlockLayout {
    if (breakpoint === "mobile") {
      return { ...block.layout.desktop, ...block.layout.mobile };
    }
    if (breakpoint === "tablet") {
      return { ...block.layout.desktop, ...block.layout.tablet };
    }
    return block.layout.desktop;
  }

  function onResize(edge: "start" | "end", event: ReactPointerEvent) {
    event.preventDefault();
    event.stopPropagation();
    const sectionEl = host.current?.closest(".clubi-section");
    if (!(sectionEl instanceof HTMLElement)) return;
    const grid = sectionEl;
    if (section.mode === "freeform") {
      const rect = grid.getBoundingClientRect();
      const start = freeformGeometry(block);
      const pointerId = event.pointerId;
      (event.target as HTMLElement).setPointerCapture(pointerId);

      function patch(clientX: number, recordHistory: boolean) {
        const pointer = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
        if (edge === "end") {
          onLayoutChange(
            { freeform: { ...start, width: clamp(pointer - start.x, 5, 100 - start.x) } },
            recordHistory,
          );
        } else {
          const end = start.x + start.width;
          const x = clamp(pointer, 0, end - 5);
          onLayoutChange({ freeform: { ...start, x, width: end - x } }, recordHistory);
        }
      }

      function move(ev: PointerEvent) {
        patch(ev.clientX, false);
      }

      function up(ev: PointerEvent) {
        patch(ev.clientX, true);
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      }

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      return;
    }
    const columns = COLUMNS[breakpoint];
    const pointerId = event.pointerId;
    (event.target as HTMLElement).setPointerCapture(pointerId);

    function move(ev: PointerEvent) {
      const layout = currentLayout();
      const col = snapColumn(ev.clientX, grid, columns);
      if (edge === "end") {
        const span = clamp(col - layout.colStart, 1, columns - layout.colStart + 1);
        onLayoutChange({ colSpan: span }, false);
      } else {
        const end = layout.colStart + layout.colSpan;
        const start = clamp(col, 1, end - 1);
        onLayoutChange({ colStart: start, colSpan: end - start }, false);
      }
    }

    function up(ev: PointerEvent) {
      const layout = currentLayout();
      const col = snapColumn(ev.clientX, grid, columns);
      if (edge === "end") {
        const span = clamp(col - layout.colStart, 1, columns - layout.colStart + 1);
        onLayoutChange({ colSpan: span }, true);
      } else {
        const end = layout.colStart + layout.colSpan;
        const start = clamp(col, 1, end - 1);
        onLayoutChange({ colStart: start, colSpan: end - start }, true);
      }
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function onMove(event: ReactPointerEvent) {
    if (section.mode !== "freeform") return;
    if ((event.target as HTMLElement).closest("button")) return;
    event.preventDefault();
    event.stopPropagation();
    const sectionEl = host.current?.closest(".clubi-section");
    if (!(sectionEl instanceof HTMLElement)) return;
    const rect = sectionEl.getBoundingClientRect();
    const start = freeformGeometry(block);
    const startX = event.clientX;
    const startY = event.clientY;

    function patch(clientX: number, clientY: number, recordHistory: boolean) {
      const x = clamp(start.x + ((clientX - startX) / rect.width) * 100, 0, 100 - start.width);
      const y = clamp(start.y + ((clientY - startY) / rect.height) * 100, 0, 100 - start.height);
      onLayoutChange({ freeform: { ...start, x, y } }, recordHistory);
    }

    function move(ev: PointerEvent) {
      patch(ev.clientX, ev.clientY, false);
    }

    function up(ev: PointerEvent) {
      patch(ev.clientX, ev.clientY, true);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  return (
    <div
      ref={host}
      className="clubi-block clubi-block--edit"
      data-type={block.type}
      data-bleed={bleed ? "true" : "false"}
      data-selected={selected ? "true" : "false"}
      style={blockStyle(block, bleed)}
      onPointerDown={onMove}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
    >
      {children}
      {selected ? (
        <>
          {block.type === "image" && imageContent ? (
            <div className="ed-photo-toolbar" onPointerDown={(event) => event.stopPropagation()}>
              <label className="ed-photo-replace">
                <span>Trocar</span>
                <select
                  aria-label="Trocar foto"
                  value={imageContent.assetId}
                  onChange={(event) =>
                    onContentChange({ ...imageContent, assetId: event.target.value })
                  }
                >
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.id}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" onClick={() => void openPicker()}>
                Lightroom
              </button>
              {(["16/10", "3/4", "1/1", "4/5"] as const).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  aria-label={`Proporção ${ratio}`}
                  onClick={() => onLayoutChange({ aspectRatio: ratio })}
                >
                  {ratio}
                </button>
              ))}
              <button type="button" onClick={() => setCropOpen((open) => !open)}>
                Recortar
              </button>
            </div>
          ) : null}
          {cropOpen && imageContent ? (
            <div className="ed-crop-overlay" onPointerDown={(event) => event.stopPropagation()}>
              <strong>Recorte</strong>
              <label>
                Foco horizontal
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={cropPoint.x}
                  onChange={(event) => setCropPoint({ ...cropPoint, x: Number(event.target.value) })}
                />
              </label>
              <label>
                Foco vertical
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={cropPoint.y}
                  onChange={(event) => setCropPoint({ ...cropPoint, y: Number(event.target.value) })}
                />
              </label>
              <div className="ed-inline">
                <button
                  type="button"
                  onClick={() => {
                    onContentChange({ ...imageContent, focalPoint: cropPoint });
                    setCropOpen(false);
                  }}
                >
                  Aplicar
                </button>
                <button type="button" onClick={() => setCropOpen(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          ) : null}
          {pickerOpen && imageContent ? (
            <div className="ed-lightroom-picker" onPointerDown={(event) => event.stopPropagation()}>
              <div className="ed-lightroom-picker__header">
                <strong>Selecionar no Lightroom</strong>
                <button type="button" onClick={() => setPickerOpen(false)}>Fechar</button>
              </div>
              {albums.length > 0 ? (
                <select aria-label="Álbum Lightroom" value={albumId} onChange={(event) => { setAlbumId(event.target.value); void loadAlbum(event.target.value); }}>
                  {albums.map((album) => <option key={album.id} value={album.id}>{album.name}</option>)}
                </select>
              ) : null}
              <input aria-label="Buscar foto" placeholder="Buscar por nome" value={assetSearch} onChange={(event) => setAssetSearch(event.target.value)} />
              <div className="ed-lightroom-dates">
                <input aria-label="Fotos a partir de" type="date" value={capturedAfter} onChange={(event) => setCapturedAfter(event.target.value)} />
                <input aria-label="Fotos até" type="date" value={capturedBefore} onChange={(event) => setCapturedBefore(event.target.value)} />
                <button type="button" onClick={() => void loadAlbum(albumId)}>Filtrar</button>
              </div>
              {pickerLoading ? <p>Carregando...</p> : null}
              {pickerError ? <p role="alert">{pickerError}</p> : null}
              <div className="ed-lightroom-grid">
                {lightroomAssets.filter((item) => item.name.toLowerCase().includes(assetSearch.toLowerCase())).map((item) => (
                  <button key={item.id} type="button" onClick={() => void importFromLightroom(item.id)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.thumbnailUrl} alt={item.name} />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <button
            type="button"
            className="clubi-handle clubi-handle--start"
            aria-label="Redimensionar início"
            onPointerDown={(event) => onResize("start", event)}
          />
          <button
            type="button"
            className="clubi-handle clubi-handle--end"
            aria-label="Redimensionar fim"
            onPointerDown={(event) => onResize("end", event)}
          />
        </>
      ) : null}
    </div>
  );
}
