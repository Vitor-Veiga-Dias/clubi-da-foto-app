import type {
  Asset,
  AssetRepository,
  IssueRepository,
  Publication,
  PublicationRepository,
} from "@clubi/domain";
import { createPublication } from "@clubi/domain";
import { parsePublication } from "@clubi/schema";

export class GetPublishedBySlug {
  constructor(private readonly publications: PublicationRepository) {}

  async execute(slug: string): Promise<Publication | null> {
    const publication = await this.publications.getBySlug(slug);
    if (!publication || publication.status !== "published") return null;
    return publication;
  }
}

export class GetPublication {
  constructor(private readonly publications: PublicationRepository) {}

  execute(slug: string) {
    return this.publications.getBySlug(slug);
  }
}

export class ListPublishedPublications {
  constructor(private readonly publications: PublicationRepository) {}

  execute() {
    return this.publications.listPublished();
  }
}

export class ListPublications {
  constructor(private readonly publications: PublicationRepository) {}

  execute() {
    return this.publications.listAll();
  }
}

export class GetCurrentIssue {
  constructor(
    private readonly issues: IssueRepository,
    private readonly publications: PublicationRepository,
  ) {}

  async execute() {
    const issue = await this.issues.getCurrent();
    if (!issue) return null;

    const items = await Promise.all(
      issue.publicationIds.map((id) => this.publications.getById(id)),
    );

    return {
      issue,
      publications: items.filter((item): item is Publication => Boolean(item)),
    };
  }
}

export class ResolveAssets {
  constructor(private readonly assets: AssetRepository) {}

  execute(ids: string[]) {
    return this.assets.getByIds(ids);
  }
}

export class ListAssets {
  constructor(private readonly assets: AssetRepository) {}

  execute(): Promise<Asset[]> {
    return this.assets.listAll();
  }
}

export class CreatePublication {
  constructor(private readonly publications: PublicationRepository) {}

  async execute(title?: string) {
    const publication = createPublication(title);
    await this.publications.save(publication);
    return publication;
  }
}

export class SavePublication {
  constructor(private readonly publications: PublicationRepository) {}

  async execute(input: unknown) {
    const publication = parsePublication(input) as Publication;
    await this.publications.save(publication);
    return publication;
  }
}

export class PublishPublication {
  constructor(private readonly publications: PublicationRepository) {}

  async execute(id: string) {
    const current =
      (await this.publications.getById(id)) ??
      (await this.publications.getBySlug(id));
    if (!current) return null;
    const next: Publication = {
      ...current,
      status: "published",
      meta: {
        ...current.meta,
        publishedAt: current.meta.publishedAt ?? new Date().toISOString().slice(0, 10),
      },
    };
    await this.publications.save(next);
    return next;
  }
}

export { GetPublishedBySlug as GetPublicationBySlug };
