export type FireflyStorage = "external" | "azure" | "dropbox";

export type FireflyAssetLink = {
  href: string;
  storage: FireflyStorage;
};

export type FireflyOutput = FireflyAssetLink & {
  type: "image/jpeg" | "image/png" | "image/x-adobe-dng" | "application/rdf+xml";
  quality?: number;
  overwrite?: boolean;
};

export type FireflyEditRequest = {
  inputs: { source: FireflyAssetLink };
  options: Record<string, number | string>;
  outputs: FireflyOutput[];
};

export type FireflyJob = {
  jobId?: string;
  created?: string;
  modified?: string;
  outputs?: Array<{
    input?: string;
    status?: "pending" | "running" | "succeeded" | "failed";
    details?: string;
    _links?: { self?: { href?: string; storage?: FireflyStorage } };
  }>;
  _links?: { self?: { href?: string } };
};

export class FireflyLightroomClient {
  private readonly base = process.env.FIREFLY_LIGHTROOM_API_BASE ?? "https://image.adobe.io";
  private readonly apiKey = process.env.ADOBE_CLIENT_ID ?? process.env.LIGHTROOM_API_KEY;
  private readonly accessToken = process.env.ADOBE_ACCESS_TOKEN ?? process.env.LIGHTROOM_ACCESS_TOKEN;

  private headers() {
    if (!this.apiKey || !this.accessToken) {
      throw new Error("Adobe Firefly credentials are not configured");
    }
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.accessToken}`,
      "x-api-key": this.apiKey,
    };
  }

  async applyEdits(input: FireflyEditRequest) {
    const response = await fetch(`${this.base}/lrService/edit`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error(`Firefly Lightroom API error ${response.status}`);
    return response.json() as Promise<{ _links?: { self?: { href?: string } } }>;
  }

  async getJob(jobId: string) {
    const response = await fetch(`${this.base}/lrService/status/${encodeURIComponent(jobId)}`, {
      headers: this.headers(),
    });
    if (!response.ok) throw new Error(`Firefly Lightroom status error ${response.status}`);
    return response.json() as Promise<FireflyJob>;
  }
}
