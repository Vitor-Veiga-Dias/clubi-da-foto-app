export const LIGHTROOM_ALLOWED_HOSTS = ["lightroom.adobe.com"] as const;

export type LightroomEmbedContent = {
  embedUrl: string;
  title?: string;
  aspectRatio?: number;
  caption?: string;
};

function readIframeSource(input: string) {
  const iframe = input.match(/<iframe\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/i);
  return iframe?.[1] ?? input.trim();
}

export function normalizeLightroomEmbedInput(input: string): string {
  const source = readIframeSource(input);
  const url = new URL(source);

  if (url.protocol !== "https:") {
    throw new Error("O embed do Lightroom precisa usar HTTPS.");
  }
  if (!LIGHTROOM_ALLOWED_HOSTS.includes(url.hostname.toLowerCase() as (typeof LIGHTROOM_ALLOWED_HOSTS)[number])) {
    throw new Error("Apenas URLs oficiais do Lightroom são permitidas.");
  }

  return url.toString();
}

export function isLightroomEmbedUrl(input: string) {
  try {
    normalizeLightroomEmbedInput(input);
    return true;
  } catch {
    return false;
  }
}
