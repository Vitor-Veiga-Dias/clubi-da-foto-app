import type {
  Asset,
  AssetRepository,
  Issue,
  IssueRepository,
  Publication,
  PublicationRepository,
} from "@clubi/domain";
import { assets, issue01 } from "./seed";
import { loadAssets, loadStore, persistAsset, persistStore, seedPublications } from "./store";

export class InMemoryPublicationRepository implements PublicationRepository {
  constructor(private items: Publication[]) {}

  async getBySlug(slug: string) {
    return this.items.find((item) => item.slug === slug) ?? null;
  }

  async getById(id: string) {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async listPublished() {
    return this.items.filter((item) => item.status === "published");
  }

  async listAll() {
    return [...this.items];
  }

  async save(publication: Publication) {
    const index = this.items.findIndex((item) => item.id === publication.id);
    if (index >= 0) this.items[index] = publication;
    else this.items.push(publication);
    persistStore(this.items);
  }
}

export class InMemoryAssetRepository implements AssetRepository {
  constructor(private readonly items: Asset[]) {}

  async getById(id: string) {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async getByIds(ids: string[]) {
    const set = new Set(ids);
    return this.items.filter((item) => set.has(item.id));
  }

  async listAll() {
    return [...this.items];
  }

  async save(asset: Asset) {
    const index = this.items.findIndex((item) => item.id === asset.id);
    if (index >= 0) this.items[index] = asset;
    else this.items.push(asset);
    persistAsset(asset);
  }
}

export class InMemoryIssueRepository implements IssueRepository {
  constructor(private readonly items: Issue[]) {}

  async getCurrent() {
    return this.items[0] ?? null;
  }

  async getBySlug(slug: string) {
    return this.items.find((item) => item.slug === slug) ?? null;
  }
}

export const publicationRepository = new InMemoryPublicationRepository(
  loadStore(seedPublications),
);
export const assetRepository = new InMemoryAssetRepository(loadAssets(assets));
export const issueRepository = new InMemoryIssueRepository([issue01]);
export * from "./lightroom";
export * from "./firefly";
