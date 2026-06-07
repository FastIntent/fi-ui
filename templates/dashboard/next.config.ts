import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Transpile the workspace package so Next bundles its TS/CSS correctly.
  transpilePackages: ["@atomizeui/core"],
  experimental: {
    optimizePackageImports: ["@atomizeui/core"],
  },
};

export default nextConfig;
