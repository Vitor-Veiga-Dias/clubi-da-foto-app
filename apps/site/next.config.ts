import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@clubi/domain",
    "@clubi/schema",
    "@clubi/application",
    "@clubi/infrastructure",
    "@clubi/design-tokens",
    "@clubi/block-registry",
  ],
};

export default nextConfig;
