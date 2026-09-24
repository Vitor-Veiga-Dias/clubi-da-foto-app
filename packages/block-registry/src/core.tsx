import type {
  Asset,
  Block,
  ImageContent,
  Publication,
  PublicationType,
  Section,
  TextContent,
} from "@clubi/domain";
import type { CSSProperties, ReactNode } from "react";
import {
  CaptionBlock,
  DividerBlock,
  GalleryBlock,
  HeadingBlock,
  ImageBlock,
  LightroomEmbedBlock,
  QuoteBlock,
  SpacerBlock,
  SubheadingBlock,
  TextBlock,
} from "./blocks";
import { LightroomEmbed } from "./LightroomEmbed";

/** Tipos que usam a casca editorial de 680px em modo de leitura. */
const EDITORIAL_TYPES: readonly PublicationType[] = [
  "essay",
  "article",
  "column",
  "interview",
];

export function isEditorial(type: PublicationType) {
  return EDITORIAL_TYPES.includes(type);
}

export const blockRegistry = {
  heading: HeadingBlock,
  subheading: SubheadingBlock,
  text: TextBlock,
  quote: QuoteBlock,
  caption: CaptionBlock,
  image: ImageBlock,
  gallery: GalleryBlock,
  carousel: GalleryBlock,
  video: ImageBlock,
  "lightroom-embed": LightroomEmbedBlock,
  spacer: SpacerBlock,
  divider: DividerBlock,
} as const;

export type RenderMode = "read" | "edit";

export function blockStyle(block: Block, isBleed: boolean): CSSProperties {
  const d = block.layout.desktop;
  const m = { ...d, ...block.layout.mobile };
  const t = { ...d, ...block.layout.tablet };
  const freeform = d.freeform;
  return {
    ["--col-start" as string]: d.colStart,
    ["--col-span" as string]: d.colSpan,
    ["--col-start-t" as string]: t.colStart,
    ["--col-span-t" as string]: t.colSpan,
    ["--col-start-m" as string]: m.colStart,
    ["--col-span-m" as string]: m.colSpan,
    ["--order" as string]: d.order ?? 0,
    ["--order-m" as string]: m.order ?? d.order ?? 0,
    ["--z" as string]: d.zIndex ?? 0,
    ["--aspect" as string]: d.aspectRatio ?? "auto",
    ["--aspect-m" as string]: m.aspectRatio ?? d.aspectRatio ?? "auto",
    ["--freeform-x" as string]: `${freeform?.x ?? ((d.colStart - 1) / 12) * 100}%`,
    ["--freeform-y" as string]: `${freeform?.y ?? 0}%`,
    ["--freeform-width" as string]: `${freeform?.width ?? (d.colSpan / 12) * 100}%`,
    ["--freeform-height" as string]: `${freeform?.height ?? 24}%`,
    ["--freeform-rotation" as string]: `${freeform?.rotation ?? 0}deg`,
    transform:
      d.offset?.x || d.offset?.y
        ? `translate(${d.offset.x ?? 0}%, ${d.offset.y ?? 0}%)`
        : undefined,
    ...(isBleed
      ? {
          width: "100vw",
          maxWidth: "100vw",
          position: "relative" as const,
          left: "50%",
          marginLeft: "-50vw",
        }
      : {}),
  };
}

export function BlockInner({
  block,
  assets,
  isOpening,
}: {
  block: Block;
  assets: Map<string, Asset>;
  isOpening?: boolean;
}) {
  const layout = { ...block.layout.desktop, ...block.layout.mobile };
  const Component = blockRegistry[block.type];
  return (
    <Component
      block={block}
      layout={layout}
      assets={assets}
      isOpening={isOpening}
    />
  );
}

export function isBleed(block: Block) {
  return Boolean(block.layout.desktop.bleed || block.layout.mobile?.bleed);
}

export type BlockChrome = (props: {
  section: Section;
  block: Block;
  isOpening?: boolean;
  children: ReactNode;
}) => ReactNode;

export function SectionBlocks({
  section,
  assets,
  isFirst,
  chrome,
  leading,
  trailing,
}: {
  section: Section;
  assets: Map<string, Asset>;
  isFirst: boolean;
  chrome?: BlockChrome;
  /** Conteudo derivado de publication.meta (byline), antes dos blocos. */
  leading?: ReactNode;
  /** Conteudo derivado de publication.meta (creditos), depois dos blocos. */
  trailing?: ReactNode;
}) {
  return (
    <>
      {leading}
      {section.blocks.map((block) => {
        const inner = (
          <BlockInner
            block={block}
            assets={assets}
            isOpening={isFirst && block.type === "image"}
          />
        );
        if (chrome) {
          return chrome({
            section,
            block,
            isOpening: isFirst && block.type === "image",
            children: inner,
          });
        }
        const layout = { ...block.layout.desktop, ...block.layout.mobile };
        if (layout.visibility === "hidden") return null;
        const bleed = isBleed(block);
        return (
          <div
            key={block.id}
            className="clubi-block"
            data-type={block.type}
            data-variant={block.style?.tokenRefs?.variant}
            data-bleed={bleed ? "true" : "false"}
            style={blockStyle(block, bleed)}
          >
            {inner}
          </div>
        );
      })}
      {trailing}
    </>
  );
}

/**
 * A abertura editorial: foto full-bleed com o titulo sobreposto.
 * Equivale ao <figure class="opening"> + .opening-overlay da direcao visual:
 * um gradiente de 3 paradas garante o contraste do titulo sobre a foto.
 */
function EditorialOpening({
  section,
  assets,
  coverEmbedUrl,
  publicationTitle,
}: {
  section: Section;
  assets: Map<string, Asset>;
  coverEmbedUrl?: string;
  publicationTitle: string;
}) {
  const imageBlock = section.blocks.find((block) => block.type === "image");
  const headingBlock = section.blocks.find((block) => block.type === "heading");
  const kickerBlock = section.blocks.find((block) => block.type === "caption");
  const image = imageBlock?.content as ImageContent | undefined;
  const heading = headingBlock?.content as TextContent | undefined;
  const kicker = kickerBlock?.content as TextContent | undefined;
  const asset = image ? assets.get(image.assetId) : undefined;
  const HeadingTag = heading?.level === 2 ? "h2" : heading?.level === 3 ? "h3" : "h1";
  const extraBlocks = section.blocks.filter((block) => block.type === "lightroom-embed");

  return (
    <>
      {coverEmbedUrl ? (
        <div className="clubi-opening clubi-opening--lightroom">
          <LightroomEmbed url={coverEmbedUrl} title={publicationTitle} aspectRatio={16 / 9} />
          <div className="clubi-opening-lightroom-title">
            {kicker ? <p className="clubi-opening-kicker">{kicker.text}</p> : null}
            {heading ? <HeadingTag className="clubi-heading">{heading.text}</HeadingTag> : null}
          </div>
        </div>
      ) : (
        <div className="clubi-opening">
          {asset ? (
          // eslint-disable-next-line @next/next/no-img-element
            <img
              className="clubi-photo"
              src={asset.originalUrl}
              alt={image?.alt ?? ""}
              width={asset.width}
              height={asset.height}
              fetchPriority="high"
              decoding="async"
            />
          ) : null}
          <div className="clubi-opening-overlay">
            {kicker ? <p className="clubi-opening-kicker">{kicker.text}</p> : null}
            {heading ? <HeadingTag className="clubi-heading">{heading.text}</HeadingTag> : null}
          </div>
        </div>
      )}
      {extraBlocks.map((block) => (
        <div key={block.id} className="clubi-opening-extra" data-type={block.type}>
          <BlockInner block={block} assets={assets} />
        </div>
      ))}
    </>
  );
}

type MetaRow = { label: string; value: string };

function metaRows(publication: Publication): MetaRow[] {
  const { meta } = publication;
  const rows: MetaRow[] = [];
  const photographer = meta.photographer ?? meta.author;
  if (photographer) rows.push({ label: "Direção e fotografia", value: photographer });
  if (meta.model) rows.push({ label: "Modelo", value: meta.model });
  if (meta.editor) rows.push({ label: "Edição e diagramação", value: meta.editor });
  return rows;
}

/** Linha de credito com bordas topo/base, em mono — do demo. */
function Byline({ publication }: { publication: Publication }) {
  const rows = metaRows(publication);
  if (rows.length === 0) return null;
  return (
    <div className="clubi-byline">
      {rows.map((row) => (
        <span key={row.label}>
          {row.label}: <b>{row.value}</b>
        </span>
      ))}
    </div>
  );
}

/** Creditos em 3 colunas com rotulos vermelhos — do demo. */
function Credits({ publication }: { publication: Publication }) {
  const rows = metaRows(publication);
  if (rows.length === 0) return null;
  return (
    <div className="clubi-credits">
      {rows.map((row) => (
        <div key={row.label}>
          <h4>{row.label}</h4>
          <p>{row.value}</p>
        </div>
      ))}
    </div>
  );
}

export function PublicationShell({
  publication,
  assets,
  mode = "read",
  preview,
  chrome,
}: {
  publication: Publication;
  assets: Asset[];
  mode?: RenderMode;
  preview?: "desktop" | "tablet" | "mobile";
  chrome?: BlockChrome;
}) {
  const map = new Map(assets.map((asset) => [asset.id, asset]));
  // a casca editorial so vale na leitura: no editor o grid de 12 colunas
  // continua sendo a mecanica, porque o EditChrome depende dele
  const editorialRead = mode === "read" && isEditorial(publication.type);
  const firstArticle = publication.sections.findIndex((section) => section.mode !== "opening");
  const lastArticle = publication.sections.reduce(
    (acc, section, index) => (section.mode !== "opening" ? index : acc),
    -1,
  );

  return (
    <article
      className={`clubi-publication${editorialRead ? " clubi-publication--editorial" : ""}`}
      data-mode={mode}
      data-preview={preview ?? "desktop"}
      data-type={publication.type}
    >
      {publication.sections.map((section, index) => {
        const isOpening = editorialRead && section.mode === "opening";
        return (
          <section
            key={section.id}
            className="clubi-section"
            data-mode={section.mode}
            data-section-id={section.id}
          >
            {isOpening ? (
              <EditorialOpening
                section={section}
                assets={map}
                coverEmbedUrl={publication.coverEmbedUrl}
                publicationTitle={publication.title}
              />
            ) : (
              <SectionBlocks
                section={section}
                assets={map}
                isFirst={index === 0}
                chrome={chrome}
                leading={
                  editorialRead && index === firstArticle ? (
                    <>
                      {publication.dek ? (
                        <p className="clubi-dek">{publication.dek}</p>
                      ) : null}
                      <Byline publication={publication} />
                    </>
                  ) : undefined
                }
                trailing={
                  editorialRead && index === lastArticle ? (
                    <Credits publication={publication} />
                  ) : undefined
                }
              />
            )}
          </section>
        );
      })}
    </article>
  );
}
