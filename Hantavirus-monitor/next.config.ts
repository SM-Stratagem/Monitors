import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  // Pin tracing root to this package dir. Otherwise Next auto-detects the parent
  // monorepo as the workspace root and emits server.js at
  // .next/standalone/<monorepo>/<app>/server.js, breaking `node .next/standalone/server.js`.
  outputFileTracingRoot: process.cwd(),
  images: { unoptimized: true },
  compress: true,
  serverExternalPackages: ["rss-parser", "cheerio", "drizzle-orm", "pg"],
};

export default nextConfig;
