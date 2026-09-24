import { z } from "zod";
import { isLightroomEmbedUrl } from "@clubi/domain";

export const publicationStatusSchema = z.enum(["draft", "published"]);
export const publicationTypeSchema = z.enum([
  "article",
  "essay",
  "interview",
  "column",
  "gallery",
]);
export const sectionModeSchema = z.enum([
  "full",
  "split",
  "grid",
  "carousel",
  "freeform",
  // abertura editorial: foto full-bleed com o titulo sobreposto em overlay,
  // como o <figure class="opening"> da direcao visual.
  "opening",
]);
export const blockTypeSchema = z.enum([
  "heading",
  "subheading",
  "text",
  "quote",
  "caption",
  "image",
  "gallery",
  "carousel",
  "video",
  "lightroom-embed",
  "spacer",
  "divider",
]);

export const blockLayoutSchema = z.object({
  colStart: z.number().int().min(1).max(12),
  colSpan: z.number().int().min(1).max(12),
  freeform: z
    .object({
      x: z.number().min(0).max(100),
      y: z.number().min(0).max(100),
      width: z.number().positive().max(100),
      height: z.number().positive().max(100),
      rotation: z.number().min(-15).max(15).optional(),
    })
    .optional(),
  rowStart: z.number().int().positive().optional(),
  rowSpan: z.number().int().positive().optional(),
  bleed: z.boolean().optional(),
  offset: z
    .object({
      x: z.number().optional(),
      y: z.number().optional(),
    })
    .optional(),
  zIndex: z.number().int().optional(),
  order: z.number().int().optional(),
  aspectRatio: z.string().optional(),
  objectFit: z.enum(["cover", "contain"]).optional(),
  objectPosition: z.string().optional(),
  visibility: z.enum(["visible", "hidden"]).optional(),
});

export const responsiveLayoutSchema = z.object({
  desktop: blockLayoutSchema,
  tablet: blockLayoutSchema.partial().optional(),
  mobile: blockLayoutSchema.partial().optional(),
});

export const textContentSchema = z.object({
  text: z.string(),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
});

export const imageContentSchema = z.object({
  assetId: z.string(),
  alt: z.string(),
  focalPoint: z
    .object({
      x: z.number().min(0).max(1),
      y: z.number().min(0).max(1),
    })
    .optional(),
});

export const galleryContentSchema = z.object({
  items: z.array(imageContentSchema),
  layout: z.enum(["mosaic", "stack", "contact-sheet", "diptych"]),
});

export const carouselContentSchema = z.object({
  items: z.array(imageContentSchema),
});

export const videoContentSchema = z.object({
  assetId: z.string(),
  alt: z.string(),
});

export const lightroomEmbedContentSchema = z.object({
  embedUrl: z.string().refine(isLightroomEmbedUrl, "URL oficial do Lightroom inválida"),
  title: z.string().max(200).optional(),
  aspectRatio: z.number().positive().max(10).optional(),
  caption: z.string().max(500).optional(),
});

export const spacerContentSchema = z.object({
  height: z.string(),
});

export const dividerContentSchema = z.object({
  variant: z.enum(["line", "dot", "shutter"]),
});

export const blockSchema = z.object({
  id: z.string(),
  type: blockTypeSchema,
  content: z.record(z.unknown()),
  layout: responsiveLayoutSchema,
  style: z
    .object({
      tokenRefs: z.record(z.string()),
    })
    .optional(),
});

export const sectionSchema = z.object({
  id: z.string(),
  mode: sectionModeSchema,
  columns: z.object({
    desktop: z.number().int().min(1).max(12),
    tablet: z.number().int().min(1).max(12).optional(),
    mobile: z.number().int().min(1).max(12).optional(),
  }),
  blocks: z.array(blockSchema),
});

export const publicationSchema = z.object({
  id: z.string(),
  slug: z.string().min(1),
  title: z.string().min(1),
  dek: z.string().optional(),
  status: publicationStatusSchema,
  type: publicationTypeSchema,
  coverAssetId: z.string().optional(),
  coverEmbedUrl: z.string().refine(isLightroomEmbedUrl, "URL oficial do Lightroom inválida").optional(),
  issueId: z.string().optional(),
  sections: z.array(sectionSchema),
  meta: z.object({
    author: z.string(),
    photographer: z.string().optional(),
    editor: z.string().optional(),
    model: z.string().optional(),
    publishedAt: z.string().optional(),
    readingTime: z.number().optional(),
    tags: z.array(z.string()),
    kicker: z.string().optional(),
  }),
});

export const assetSchema = z.object({
  id: z.string(),
  source: z.enum(["upload", "lightroom", "placeholder"]),
  sourceRef: z.string().optional(),
  originalUrl: z.string(),
  width: z.number().positive(),
  height: z.number().positive(),
  blurhash: z.string().optional(),
  metadata: z
    .object({
      camera: z.string().optional(),
      lens: z.string().optional(),
      capturedAt: z.string().optional(),
    })
    .optional(),
});

export const issueSchema = z.object({
  id: z.string(),
  number: z.number().int().positive(),
  title: z.string(),
  slug: z.string(),
  coverAssetId: z.string(),
  publicationIds: z.array(z.string()),
  publishedAt: z.string().optional(),
});

export function parsePublication(input: unknown) {
  const publication = publicationSchema.parse(input);
  for (const section of publication.sections) {
    for (const block of section.blocks) {
      if (block.type === "lightroom-embed") {
        lightroomEmbedContentSchema.parse(block.content);
      }
    }
  }
  return publication;
}
