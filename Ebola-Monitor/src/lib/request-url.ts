import { headers } from "next/headers";

async function firstHeader(name: string): Promise<string | null> {
  try {
    const h = await headers();
    const v = h.get(name);
    return v ? v.trim() : null;
  } catch {
    return null;
  }
}

export async function getBaseUrlFromRequest(): Promise<string | null> {
  const forwardedProto = await firstHeader("x-forwarded-proto");
  const forwardedHost = await firstHeader("x-forwarded-host");
  const host = forwardedHost ?? (await firstHeader("host"));
  if (!host) return null;

  const proto = forwardedProto ?? (host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https");
  const safeHost = host.replace(/\s+/g, "");
  return `${proto}://${safeHost}`;
}
