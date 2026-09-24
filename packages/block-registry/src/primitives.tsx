import type { Asset } from "@clubi/domain";

export function tokenColor(ref?: string) {
  if (ref === "paper") return "var(--clubi-paper)";
  if (ref === "signal") return "var(--clubi-signal)";
  if (ref === "ink") return "var(--clubi-ink)";
  return undefined;
}

export function AssetImg({
  asset,
  alt,
  objectFit = "cover",
  objectPosition,
  priority = false,
}: {
  asset: Asset;
  alt: string;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="clubi-photo"
      src={asset.originalUrl}
      alt={alt}
      width={asset.width}
      height={asset.height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      style={{ objectFit, objectPosition }}
    />
  );
}
