"use client";

import type {
  Asset,
  Block,
  BlockLayout,
  BlockType,
  Breakpoint,
  Publication,
  SectionMode,
} from "@clubi/domain";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createBlock, createSection } from "./factory";

type History = { past: Publication[]; future: Publication[] };

function clone(publication: Publication): Publication {
  return structuredClone(publication);
}

function mapBlock(
  publication: Publication,
  blockId: string,
  mapper: (block: Block) => Block,
): Publication {
  return {
    ...publication,
    sections: publication.sections.map((section) => ({
      ...section,
      blocks: section.blocks.map((block) =>
        block.id === blockId ? mapper(block) : block,
      ),
    })),
  };
}

export function useEditorState(initial: Publication, assets: Asset[]) {
  const [availableAssets, setAvailableAssets] = useState(() => assets);
  const [publication, setPublication] = useState(() => clone(initial));
  const [history, setHistory] = useState<History>({ past: [], future: [] });
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    initial.sections[0]?.id ?? null,
  );
  const [preview, setPreview] = useState<Breakpoint>("desktop");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const selected = useMemo(() => {
    for (const section of publication.sections) {
      const block = section.blocks.find((item) => item.id === selectedBlockId);
      if (block) return { section, block };
    }
    const section = publication.sections.find((item) => item.id === selectedSectionId);
    return { section, block: undefined };
  }, [publication, selectedBlockId, selectedSectionId]);

  const commit = useCallback((next: Publication) => {
    setHistory((current) => ({
      past: [...current.past, publication].slice(-50),
      future: [],
    }));
    setPublication(next);
    setDirty(true);
  }, [publication]);

  const undo = useCallback(() => {
    setHistory((current) => {
      const previous = current.past.at(-1);
      if (!previous) return current;
      setPublication(previous);
      setDirty(true);
      return {
        past: current.past.slice(0, -1),
        future: [publication, ...current.future],
      };
    });
  }, [publication]);

  const redo = useCallback(() => {
    setHistory((current) => {
      const next = current.future[0];
      if (!next) return current;
      setPublication(next);
      setDirty(true);
      return {
        past: [...current.past, publication],
        future: current.future.slice(1),
      };
    });
  }, [publication]);

  function select(sectionId: string, blockId: string | null) {
    setSelectedSectionId(sectionId || selectedSectionId);
    setSelectedBlockId(blockId);
  }

  function patchPublication(partial: Partial<Publication>) {
    commit({ ...publication, ...partial });
  }

  function patchLayout(
    sectionId: string,
    blockId: string,
    patch: Partial<BlockLayout>,
    recordHistory = true,
  ) {
    const apply = (current: Publication) =>
      mapBlock(current, blockId, (block) => {
        if (preview === "desktop") {
          return {
            ...block,
            layout: {
              ...block.layout,
              desktop: { ...block.layout.desktop, ...patch },
            },
          };
        }
        const key = preview;
        return {
          ...block,
          layout: {
            ...block.layout,
            [key]: { ...block.layout[key], ...patch },
          },
        };
      });

    if (recordHistory) commit(apply(publication));
    else {
      setPublication(apply);
      setDirty(true);
    }
    setSelectedSectionId(sectionId);
    setSelectedBlockId(blockId);
  }

  function patchBlock(blockId: string, patch: Partial<Block>) {
    commit(mapBlock(publication, blockId, (block) => ({ ...block, ...patch })));
  }

  function patchContent(blockId: string, content: Block["content"]) {
    commit(mapBlock(publication, blockId, (block) => ({ ...block, content })));
  }

  function addAsset(asset: Asset) {
    setAvailableAssets((current) =>
      current.some((item) => item.id === asset.id) ? current : [...current, asset],
    );
  }

  function addBlock(type: BlockType) {
    const sectionId = selectedSectionId ?? publication.sections.at(-1)?.id;
    if (!sectionId) return;
    const block = createBlock(type, availableAssets[0]?.id);
    commit({
      ...publication,
      sections: publication.sections.map((section) =>
        section.id === sectionId
          ? { ...section, blocks: [...section.blocks, block] }
          : section,
      ),
    });
    setSelectedBlockId(block.id);
  }

  function addSection(mode: SectionMode = "full") {
    const section = createSection(mode);
    commit({ ...publication, sections: [...publication.sections, section] });
    setSelectedSectionId(section.id);
    setSelectedBlockId(null);
  }

  function duplicateBlock() {
    if (!selected.block || !selected.section) return;
    const copy = { ...structuredClone(selected.block), id: `blk-${crypto.randomUUID().slice(0, 8)}` };
    commit({
      ...publication,
      sections: publication.sections.map((section) => {
        if (section.id !== selected.section?.id) return section;
        const index = section.blocks.findIndex((item) => item.id === selected.block?.id);
        const blocks = [...section.blocks];
        blocks.splice(index + 1, 0, copy);
        return { ...section, blocks };
      }),
    });
    setSelectedBlockId(copy.id);
  }

  function removeBlock() {
    if (!selected.block || !selected.section) return;
    commit({
      ...publication,
      sections: publication.sections.map((section) =>
        section.id === selected.section?.id
          ? {
              ...section,
              blocks: section.blocks.filter((item) => item.id !== selected.block?.id),
            }
          : section,
      ),
    });
    setSelectedBlockId(null);
  }

  function moveBlock(direction: -1 | 1) {
    if (!selected.block || !selected.section) return;
    commit({
      ...publication,
      sections: publication.sections.map((section) => {
        if (section.id !== selected.section?.id) return section;
        const index = section.blocks.findIndex((item) => item.id === selected.block?.id);
        const next = index + direction;
        if (next < 0 || next >= section.blocks.length) return section;
        const blocks = [...section.blocks];
        const [item] = blocks.splice(index, 1);
        blocks.splice(next, 0, item);
        return { ...section, blocks };
      }),
    });
  }

  function setSectionMode(mode: SectionMode) {
    if (!selectedSectionId) return;
    commit({
      ...publication,
      sections: publication.sections.map((section) =>
        section.id === selectedSectionId ? { ...section, mode } : section,
      ),
    });
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/publications/${publication.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(publication),
      });
      if (!response.ok) throw new Error("Falha ao salvar");
      setDirty(false);
      setMessage("Salvo");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro");
    } finally {
      setSaving(false);
    }
  }

  async function publish() {
    await save();
    const response = await fetch(`/api/publications/${publication.id}/publish`, {
      method: "POST",
    });
    if (!response.ok) {
      setMessage("Não foi possível publicar");
      return;
    }
    const next = (await response.json()) as Publication;
    setPublication(next);
    setDirty(false);
    setMessage("Publicado");
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const meta = event.metaKey || event.ctrlKey;
      if (meta && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void save();
      }
      if (meta && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      }
      if (meta && event.key.toLowerCase() === "d") {
        event.preventDefault();
        duplicateBlock();
      }
      if (event.key === "Delete" || event.key === "Backspace") {
        const tag = (event.target as HTMLElement | null)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
        event.preventDefault();
        removeBlock();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return {
    publication,
    assets: availableAssets,
    selected,
    selectedBlockId,
    selectedSectionId,
    preview,
    dirty,
    saving,
    message,
    setPreview,
    select,
    patchPublication,
    patchLayout,
    patchBlock,
    patchContent,
    addAsset,
    addBlock,
    addSection,
    duplicateBlock,
    removeBlock,
    moveBlock,
    setSectionMode,
    undo,
    redo,
    save,
    publish,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
}
