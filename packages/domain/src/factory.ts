import type { Block, BlockType, Publication, Section, SectionMode } from "./entities";

function id(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

const reading = {
  desktop: { colStart: 3, colSpan: 8 },
  mobile: { colStart: 1, colSpan: 4 },
};

export function createBlock(type: BlockType, assetId?: string): Block {
  const base = { id: id("blk"), type, layout: structuredClone(reading) };
  switch (type) {
    case "heading":
      return { ...base, content: { text: "Título", level: 1 as const } };
    case "subheading":
      return { ...base, content: { text: "Subtítulo em itálico." } };
    case "quote":
      return { ...base, content: { text: "Citação." } };
    case "caption":
      return { ...base, content: { text: "Legenda · metadado" } };
    case "text":
      return { ...base, content: { text: "Novo parágrafo." } };
    case "image":
      return {
        ...base,
        content: { assetId: assetId ?? "", alt: "" },
        layout: {
          desktop: { colStart: 1, colSpan: 12, aspectRatio: "3/4", objectFit: "cover" as const },
          mobile: { colStart: 1, colSpan: 4 },
        },
      };
    case "gallery":
      return {
        ...base,
        content: { items: [], layout: "contact-sheet" as const },
        layout: {
          desktop: { colStart: 1, colSpan: 12 },
          mobile: { colStart: 1, colSpan: 4 },
        },
      };
    case "spacer":
      return { ...base, content: { height: "3rem" } };
    case "divider":
      return { ...base, content: { variant: "line" as const } };
    case "carousel":
      return {
        ...base,
        content: { items: [] },
        layout: {
          desktop: { colStart: 1, colSpan: 12 },
          mobile: { colStart: 1, colSpan: 4 },
        },
      };
    case "video":
      return { ...base, content: { assetId: assetId ?? "", alt: "" } };
    case "lightroom-embed":
      return {
        ...base,
        content: {
          embedUrl: "",
          title: "Álbum do Lightroom",
          aspectRatio: 16 / 9,
        },
        layout: {
          desktop: { colStart: 1, colSpan: 12 },
          mobile: { colStart: 1, colSpan: 4 },
        },
      };
    default: {
      throw new Error(`Unknown block type: ${String(type)}`);
    }
  }
}

export function createSection(mode: SectionMode = "full"): Section {
  return {
    id: id("sec"),
    mode,
    columns: { desktop: 12, tablet: 8, mobile: 4 },
    blocks: [],
  };
}

export function slugify(title: string) {
  return (
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "nova-materia"
  );
}

export function createPublication(title = "Sem título"): Publication {
  return {
    id: id("pub"),
    slug: `${slugify(title)}-${crypto.randomUUID().slice(0, 4)}`,
    title,
    status: "draft",
    type: "essay",
    sections: [
      {
        ...createSection("full"),
        blocks: [createBlock("heading"), createBlock("text")],
      },
    ],
    meta: { author: "", tags: [], kicker: "Ensaio fotográfico" },
  };
}
