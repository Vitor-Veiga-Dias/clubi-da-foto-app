import type { Asset, Issue, Publication } from "./entities";

export interface PublicationRepository {
  getBySlug(slug: string): Promise<Publication | null>;
  getById(id: string): Promise<Publication | null>;
  listPublished(): Promise<Publication[]>;
  listAll(): Promise<Publication[]>;
  save(publication: Publication): Promise<void>;
}

export interface AssetRepository {
  getById(id: string): Promise<Asset | null>;
  getByIds(ids: string[]): Promise<Asset[]>;
  listAll(): Promise<Asset[]>;
  save(asset: Asset): Promise<void>;
}

export interface IssueRepository {
  getCurrent(): Promise<Issue | null>;
  getBySlug(slug: string): Promise<Issue | null>;
}
