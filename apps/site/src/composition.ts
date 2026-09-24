import {
  CreatePublication,
  GetCurrentIssue,
  GetPublication,
  GetPublicationBySlug,
  ListAssets,
  ListPublications,
  ListPublishedPublications,
  PublishPublication,
  ResolveAssets,
  SavePublication,
} from "@clubi/application";
import {
  assetRepository,
  issueRepository,
  publicationRepository,
} from "@clubi/infrastructure";
import { lightroomProvider } from "@clubi/infrastructure";
import { FireflyLightroomClient } from "@clubi/infrastructure";

export const getPublicationBySlug = new GetPublicationBySlug(
  publicationRepository,
);
export const getPublication = new GetPublication(publicationRepository);
export const listPublishedPublications = new ListPublishedPublications(
  publicationRepository,
);
export const listPublications = new ListPublications(publicationRepository);
export const getCurrentIssue = new GetCurrentIssue(
  issueRepository,
  publicationRepository,
);
export const resolveAssets = new ResolveAssets(assetRepository);
export const listAssets = new ListAssets(assetRepository);
export const savePublication = new SavePublication(publicationRepository);
export const publishPublication = new PublishPublication(publicationRepository);
export const createPublication = new CreatePublication(publicationRepository);
export const lightroom = lightroomProvider();
export const fireflyLightroom = new FireflyLightroomClient();
