import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { Asset, Publication } from "@clubi/domain";
import { parsePublication } from "@clubi/schema";
import { configuracoes } from "./seed";

export type StoreFile = { publications: Publication[]; assets?: Asset[] };

function storePath() {
  return (
    process.env.CLUBI_DATA_PATH ??
    path.join(process.cwd(), "data", "store.json")
  );
}

export function loadStore(seed: Publication[]): Publication[] {
  const file = storePath();
  if (!existsSync(file)) {
    persistStore(seed);
    return seed.map((item) => structuredClone(item));
  }
  const parsed = JSON.parse(readFileSync(file, "utf8")) as StoreFile;
  return parsed.publications.map((item) => parsePublication(item) as Publication);
}

export function persistStore(publications: Publication[]) {
  const file = storePath();
  mkdirSync(path.dirname(file), { recursive: true });
  const existing = existsSync(file)
    ? (JSON.parse(readFileSync(file, "utf8")) as StoreFile)
    : {};
  const payload: StoreFile = { ...existing, publications };
  writeFileSync(file, JSON.stringify(payload, null, 2), "utf8");
}

export function loadAssets(seed: Asset[]): Asset[] {
  const file = storePath();
  if (!existsSync(file)) return seed.map((item) => structuredClone(item));
  const parsed = JSON.parse(readFileSync(file, "utf8")) as StoreFile;
  return [...seed, ...(parsed.assets ?? [])].reduce<Asset[]>((items, asset) => {
    if (!items.some((item) => item.id === asset.id)) items.push(asset);
    return items;
  }, []);
}

export function persistAsset(asset: Asset) {
  const file = storePath();
  mkdirSync(path.dirname(file), { recursive: true });
  const existing = existsSync(file)
    ? (JSON.parse(readFileSync(file, "utf8")) as StoreFile)
    : { publications: [] };
  const assets = [...(existing.assets ?? []).filter((item) => item.id !== asset.id), asset];
  writeFileSync(file, JSON.stringify({ ...existing, assets }, null, 2), "utf8");
}

export const seedPublications = [parsePublication(configuracoes) as Publication];
