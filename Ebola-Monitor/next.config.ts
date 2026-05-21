import type { NextConfig } from "next";

const allowedDevOrigins = (process.env.NEXT_ALLOWED_DEV_ORIGINS ?? "")
  .split(",")
  .map((v) => v.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: { unoptimized: true },
  compress: true,
  serverExternalPackages: ["rss-parser", "cheerio", "drizzle-orm", "pg"],
  allowedDevOrigins: allowedDevOrigins.length ? allowedDevOrigins : ["10.12.251.183"],
};

export default nextConfig;
