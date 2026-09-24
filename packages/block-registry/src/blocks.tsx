import type { Asset, Block, BlockLayout, ImageContent, TextContent } from "@clubi/domain";
import { AssetImg, tokenColor } from "./primitives";
import { LightroomEmbed } from "./LightroomEmbed";
import type { LightroomEmbedContent } from "@clubi/domain";

type Props = {
  block: Block;
  layout: BlockLayout;
  assets: Map<string, Asset>;
  isOpening?: boolean;
};

export function HeadingBlock({ block }: Props) {
  const content = block.content as TextContent;
  const Tag = content.level === 2 ? "h2" : content.level === 3 ? "h3" : "h1";
  const color = tokenColor(block.style?.tokenRefs.color);
  return (
    <Tag className="clubi-heading" style={{ color }}>
      {content.text}
    </Tag>
  );
}

export function SubheadingBlock({ block }: Props) {
  const content = block.content as TextContent;
  return <p className="clubi-subheading">{content.text}</p>;
}

export function TextBlock({ block }: Props) {
  const content = block.content as TextContent;
  // tokenRefs.lead marca o primeiro paragrafo do artigo (ganha capitular)
  const lead = block.style?.tokenRefs?.lead === "true";
  return <p className={`clubi-body${lead ? " clubi-body--lead" : ""}`}>{content.text}</p>;
}

export function QuoteBlock({ block }: Props) {
  const content = block.content as TextContent;
  // o demo usa <blockquote>texto<cite>fonte</cite></blockquote>, com uma
  // barra de 3px em --signal. Nada de ponto.
  const cite = block.style?.tokenRefs?.cite;
  return (
    <blockquote className="clubi-quote">
      {content.text}
      {cite ? <cite>{cite}</cite> : null}
    </blockquote>
  );
}

export function CaptionBlock({ block }: Props) {
  const content = block.content as TextContent;
  // label -> mono caixa alta vermelho (rotulo de galeria)
  // cap   -> mono cinza (legenda de foto)
  const variant = block.style?.tokenRefs?.variant;
  // nota: o par "esquerda / direita" das legendas do demo, que ficam
  // alinhadas nas duas pontas — <span>…</span><span>P&B · Cor</span>
  const note = block.style?.tokenRefs?.note;
  if (note) {
    return (
      <p className="clubi-meta" data-variant={variant}>
        <span>{content.text}</span>
        <span>{note}</span>
      </p>
    );
  }
  return (
    <p className="clubi-meta" data-variant={variant}>
      {content.text}
    </p>
  );
}

export function ImageBlock({ block, layout, assets, isOpening }: Props) {
  const content = block.content as ImageContent;
  const asset = assets.get(content.assetId);
  if (!asset) return null;
  const position = content.focalPoint
    ? `${content.focalPoint.x * 100}% ${content.focalPoint.y * 100}%`
    : layout.objectPosition;
  return (
    <AssetImg
      asset={asset}
      alt={content.alt}
      objectFit={layout.objectFit}
      objectPosition={position}
      priority={Boolean(isOpening)}
    />
  );
}

export function GalleryBlock({ block, assets }: Props) {
  const content = block.content as {
    items: ImageContent[];
    layout: "mosaic" | "stack" | "contact-sheet" | "diptych";
  };
  return (
    <div className={`clubi-gallery clubi-gallery--${content.layout}`}>
      {content.items.map((item) => {
        const asset = assets.get(item.assetId);
        if (!asset) return null;
        return (
          <AssetImg
            key={item.assetId + item.alt}
            asset={asset}
            alt={item.alt}
            objectFit="cover"
          />
        );
      })}
    </div>
  );
}

export function LightroomEmbedBlock({ block }: Props) {
  const content = block.content as LightroomEmbedContent;
  return (
    <figure className="clubi-lightroom-figure">
      <LightroomEmbed
        url={content.embedUrl}
        title={content.title}
        aspectRatio={content.aspectRatio}
      />
      {content.caption ? <figcaption className="clubi-meta">{content.caption}</figcaption> : null}
    </figure>
  );
}

export function SpacerBlock({ block }: Props) {
  const content = block.content as { height?: string };
  return <div className="clubi-spacer" style={{ height: content.height ?? "3rem" }} />;
}

export function DividerBlock({ block }: Props) {
  const content = block.content as { variant?: string };
  if (content.variant === "dot") {
    return <div className="clubi-dot clubi-dot--lone" />;
  }
  return <hr className="clubi-divider" />;
}
