import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: { unoptimized: true },
  compress: true,
  serverExternalPackages: ["rss-parser", "cheerio", "drizzle-orm", "pg"],
};

export default nextConfig;
