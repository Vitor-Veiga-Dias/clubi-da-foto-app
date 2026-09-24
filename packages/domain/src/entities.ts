import type { LightroomEmbedContent } from "./external-media";

export type PublicationStatus = "draft" | "published";

export type PublicationType =
  | "article"
  | "essay"
  | "interview"
  | "column"
  | "gallery";

export type SectionMode =
  | "full"
  | "split"
  | "grid"
  | "carousel"
  | "freeform"
  /** Abertura editorial: foto full-bleed com titulo sobreposto em overlay. */
  | "opening";

export type BlockType =
  | "heading"
  | "subheading"
  | "text"
  | "quote"
  | "caption"
  | "image"
  | "gallery"
  | "carousel"
  | "video"
  | "lightroom-embed"
  | "spacer"
  | "divider";

export type Breakpoint = "desktop" | "tablet" | "mobile";

export type StyleTokenRef = Record<string, string>;

export type PublicationMeta = {
  author: string;
  photographer?: string;
  editor?: string;
  model?: string;
  publishedAt?: string;
  readingTime?: number;
  tags: string[];
  kicker?: string;
};

export type Publication = {
  id: string;
  slug: string;
  title: string;
  dek?: string;
  status: PublicationStatus;
  type: PublicationType;
  coverAssetId?: string;
  coverEmbedUrl?: string;
  issueId?: string;
  sections: Section[];
  meta: PublicationMeta;
};

export type SectionColumns = {
  desktop: number;
  tablet?: number;
  mobile?: number;
};

export type Section = {
  id: string;
  mode: SectionMode;
  columns: SectionColumns;
  blocks: Block[];
};

export type BlockLayout = {
  colStart: number;
  colSpan: number;
  /** Normalized Freeform geometry, expressed as percentages of the section. */
  freeform?: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
  };
  rowStart?: number;
  rowSpan?: number;
  bleed?: boolean;
  offset?: { x?: number; y?: number };
  zIndex?: number;
  order?: number;
  aspectRatio?: string;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
  visibility?: "visible" | "hidden";
};

export type ResponsiveLayout = {
  desktop: BlockLayout;
  tablet?: Partial<BlockLayout>;
  mobile?: Partial<BlockLayout>;
};

export type TextContent = {
  text: string;
  level?: 1 | 2 | 3;
};

export type ImageContent = {
  assetId: string;
  alt: string;
  focalPoint?: { x: number; y: number };
};

export type GalleryContent = {
  items: ImageContent[];
  layout: "mosaic" | "stack" | "contact-sheet" | "diptych";
};

export type CarouselContent = {
  items: ImageContent[];
};

export type VideoContent = {
  assetId: string;
  alt: string;
};

export type SpacerContent = {
  height: string;
};

export type DividerContent = {
  variant: "line" | "dot" | "shutter";
};

export type BlockContent =
  | TextContent
  | ImageContent
  | GalleryContent
  | CarouselContent
  | VideoContent
  | LightroomEmbedContent
  | SpacerContent
  | DividerContent
  | Record<string, never>;

export type Block = {
  id: string;
  type: BlockType;
  content: BlockContent;
  layout: ResponsiveLayout;
  style?: { tokenRefs: StyleTokenRef };
};

export type AssetSource = "upload" | "lightroom" | "placeholder";

export type Asset = {
  id: string;
  source: AssetSource;
  sourceRef?: string;
  originalUrl: string;
  width: number;
  height: number;
  blurhash?: string;
  metadata?: {
    camera?: string;
    lens?: string;
    capturedAt?: string;
  };
};

export type Issue = {
  id: string;
  number: number;
  title: string;
  slug: string;
  coverAssetId: string;
  publicationIds: string[];
  publishedAt?: string;
};
