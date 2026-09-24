"use client";

import { useState } from "react";
import { isLightroomEmbedUrl } from "@clubi/domain";

export function LightroomEmbed({
  url,
  title = "Conteúdo do Lightroom",
  aspectRatio = 16 / 9,
}: {
  url: string;
  title?: string;
  aspectRatio?: number;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const valid = isLightroomEmbedUrl(url);

  if (!valid || failed) {
    return (
      <div className="clubi-lightroom clubi-lightroom--fallback" role="status">
        <strong>Lightroom</strong>
        <span>{failed ? "Não foi possível carregar este embed." : "URL oficial do Lightroom inválida."}</span>
      </div>
    );
  }

  return (
    <div
      className={`clubi-lightroom${loaded ? " clubi-lightroom--loaded" : ""}`}
      style={{ aspectRatio }}
    >
      {!loaded ? <span className="clubi-lightroom__loading">Carregando Lightroom...</span> : null}
      <iframe
        src={url}
        title={title}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className="clubi-lightroom__frame"
        allow="fullscreen"
      />
    </div>
  );
}
