import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Asset } from "@clubi/domain";
import { assets as seedAssets } from "./seed";

export type LightroomAlbum = {
  id: string;
  name: string;
  parentId?: string;
  subtype: "project" | "project_set" | "collection";
};

export type LightroomAsset = {
  id: string;
  albumId: string;
  name: string;
  thumbnailUrl: string;
  capturedAt?: string;
  width: number;
  height: number;
  sourceRef?: string;
};

export interface LightroomProvider {
  listAlbums(): Promise<LightroomAlbum[]>;
  listAssets(albumId: string, filters?: { capturedAfter?: string; capturedBefore?: string }): Promise<LightroomAsset[]>;
  importAsset(sourceId: string): Promise<Asset>;
}

export class LightroomApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "LightroomApiError";
  }
}

const mockAlbums: LightroomAlbum[] = [
  { id: "mock-clubi", name: "Clubi da Foto", subtype: "project" },
  { id: "mock-2026", name: "2026", parentId: "mock-clubi", subtype: "project_set" },
];

function mockAssets(): LightroomAsset[] {
  return seedAssets.map((asset) => ({
    id: `mock-${asset.id}`,
    albumId: "mock-2026",
    name: asset.sourceRef ?? asset.id,
    thumbnailUrl: asset.originalUrl,
    capturedAt: asset.metadata?.capturedAt,
    width: asset.width,
    height: asset.height,
    sourceRef: asset.sourceRef,
  }));
}

export class MockLightroomProvider implements LightroomProvider {
  async listAlbums() {
    return mockAlbums;
  }

  async listAssets(albumId: string, filters?: { capturedAfter?: string; capturedBefore?: string }) {
    return mockAssets().filter((asset) => {
      if (asset.albumId !== albumId && !(albumId === "mock-clubi" && asset.albumId === "mock-2026")) return false;
      if (filters?.capturedAfter && (!asset.capturedAt || asset.capturedAt < filters.capturedAfter)) return false;
      if (filters?.capturedBefore && (!asset.capturedAt || asset.capturedAt > filters.capturedBefore)) return false;
      return true;
    });
  }

  async importAsset(sourceId: string) {
    const source = mockAssets().find((asset) => asset.id === sourceId);
    if (!source) throw new Error("Lightroom asset not found");
    const original = seedAssets.find((asset) => asset.sourceRef === source.sourceRef);
    if (!original) throw new Error("Mock rendition not found");
    return {
      ...original,
      id: `lr-${source.id}`,
      source: "lightroom",
      sourceRef: source.id,
    } satisfies Asset;
  }
}

export class AdobeLightroomProvider implements LightroomProvider {
  private readonly base = process.env.LIGHTROOM_API_BASE ?? "https://lr.adobe.io/v2";
  private readonly token = process.env.LIGHTROOM_ACCESS_TOKEN;
  private readonly apiKey = process.env.LIGHTROOM_API_KEY;
  private catalogId: string | null = process.env.LIGHTROOM_CATALOG_ID ?? null;

  private async request<T>(input: string, init?: RequestInit): Promise<T> {
    if (!this.apiKey) throw new LightroomApiError("Lightroom API key is not configured", 500);
    const response = await fetch(input, {
      ...init,
      headers: {
        Accept: "application/json",
        "X-API-Key": this.apiKey,
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
        ...init?.headers,
      },
    });
    if (!response.ok) throw new LightroomApiError(`Lightroom API error ${response.status}`, response.status);
    return response.json() as Promise<T>;
  }

  private async catalog() {
    if (this.catalogId) return this.catalogId;
    const document = await this.request<{ id?: string; payload?: { id?: string } }>(`${this.base}/catalog`);
    this.catalogId = document.id ?? document.payload?.id ?? null;
    if (!this.catalogId) throw new Error("Lightroom catalog id missing");
    return this.catalogId;
  }

  async listAlbums() {
    const catalogId = await this.catalog();
    const document = await this.request<{ resources?: Array<{ id: string; payload?: { name?: string; subtype?: LightroomAlbum["subtype"]; parent?: { id?: string } } }> }>(`${this.base}/catalogs/${catalogId}/albums`);
    return (document.resources ?? []).map((item) => ({
      id: item.id,
      name: item.payload?.name ?? item.id,
      subtype: item.payload?.subtype ?? "project",
      parentId: item.payload?.parent?.id,
    }));
  }

  async listAssets(albumId: string, filters?: { capturedAfter?: string; capturedBefore?: string }) {
    const catalogId = await this.catalog();
    const params = new URLSearchParams({ limit: "500", embed: "asset" });
    if (filters?.capturedAfter) params.set("captured_after", filters.capturedAfter);
    if (filters?.capturedBefore) params.set("captured_before", filters.capturedBefore);
    const document = await this.request<{ resources?: Array<{ id: string; payload?: { importSource?: { fileName?: string; width?: number; height?: number }; captureDate?: string }; links?: { thumbnail?: { href?: string } } }> }>(`${this.base}/catalogs/${catalogId}/albums/${albumId}/assets?${params}`);
    return (document.resources ?? []).map((item) => ({
      id: item.id,
      albumId,
      name: item.payload?.importSource?.fileName ?? item.id,
      thumbnailUrl: item.links?.thumbnail?.href ?? `${this.base}/catalogs/${catalogId}/assets/${item.id}/renditions/thumbnail2x`,
      capturedAt: item.payload?.captureDate,
      width: item.payload?.importSource?.width ?? 0,
      height: item.payload?.importSource?.height ?? 0,
    }));
  }

  async importAsset(sourceId: string) {
    const catalogId = await this.catalog();
    const metadata = await this.request<{ payload?: { captureDate?: string; importSource?: { fileName?: string; width?: number; height?: number; cameraModel?: string; lens?: string } } }>(`${this.base}/catalogs/${catalogId}/assets/${sourceId}`);
    const rendition = await fetch(`${this.base}/catalogs/${catalogId}/assets/${sourceId}/renditions/2048`, {
      headers: {
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
        "X-API-Key": this.apiKey ?? "",
      },
    });
    if (!rendition.ok) throw new LightroomApiError(`Lightroom rendition error ${rendition.status}`, rendition.status);
    const fileName = `${sourceId}.jpg`;
    const mediaRoot = process.env.CLUBI_MEDIA_PATH ?? path.join(process.cwd(), "apps", "site", "public", "assets", "imported");
    await mkdir(mediaRoot, { recursive: true });
    await writeFile(path.join(mediaRoot, fileName), Buffer.from(await rendition.arrayBuffer()));
    const source = metadata.payload;
    return {
      id: `lr-${sourceId}`,
      source: "lightroom",
      sourceRef: sourceId,
      originalUrl: `/assets/imported/${fileName}`,
      width: source?.importSource?.width ?? 2048,
      height: source?.importSource?.height ?? 2048,
      metadata: {
        capturedAt: source?.captureDate,
        camera: source?.importSource?.cameraModel,
        lens: source?.importSource?.lens,
      },
    } satisfies Asset;
  }
}

export function lightroomProvider(): LightroomProvider {
  return process.env.LIGHTROOM_MODE === "adobe"
    ? new AdobeLightroomProvider()
    : new MockLightroomProvider();
}
