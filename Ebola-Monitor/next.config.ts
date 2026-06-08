import type { NextConfig } from "next";

const allowedDevOrigins = (process.env.NEXT_ALLOWED_DEV_ORIGINS ?? "")
  .split(",")
  .map((v) => v.trim())
  .filter(Boolean);

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
  allowedDevOrigins: allowedDevOrigins.length ? allowedDevOrigins : ["10.12.251.183"],
};

export default nextConfig;
