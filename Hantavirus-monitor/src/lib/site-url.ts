export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    const cleaned = explicit
      .replace(/^NEXT_PUBLIC_SITE_URL\s*=\s*/i, "")
      .split(",")[0]!
      .trim()
      .replace(/\/+$/, "");
    const lower = cleaned.toLowerCase();
    // Ignore placeholder values that should not ship to production.
    if (!lower.includes("your-deployment-url.com") && !lower.includes("example.com")) {
      try {
        // Validate; if a scheme is missing, assume https.
        const candidate = cleaned.startsWith("http://") || cleaned.startsWith("https://") ? cleaned : `https://${cleaned}`;
        if (!URL.canParse(candidate)) throw new Error("Invalid URL");
        return candidate;
      } catch {
        // fall through to Railway/Vercel detection
      }
    }
  }

  const railwayDomain = process.env.RAILWAY_PUBLIC_DOMAIN?.trim();
  if (railwayDomain) return `https://${railwayDomain.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;

  const fallback = "http://localhost:3000";
  return fallback;
}
