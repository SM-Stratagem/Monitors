import { NextResponse } from "next/server";
import Parser from "rss-parser";

export const runtime = "nodejs";

const REDDIT_SUBS = [
  { name: "hantavirus", credibility: 75, query: "" },
  { name: "worldnews", credibility: 70, query: "hantavirus OR hanta virus OR hemorrhagic fever cruise" },
];

const RSS_PARSER = new Parser({
  headers: {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  },
});
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

interface RedditPost {
  title: string;
  author: string;
  subreddit: string;
  score: number;
  numComments: number;
  url: string;
  permalink: string;
  selftext: string;
  created: string;
  flair: string | null;
  thumbnail: string | null;
  isSelf: boolean;
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = 15000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

type CachedPayload = {
  posts: RedditPost[];
  total: number;
  subreddits: string[];
  fetchedAt: string;
  errors?: string[];
};

function getCache(): { at: number; payload: CachedPayload } | null {
  const g = globalThis as unknown as { __redditCache?: { at: number; payload: CachedPayload } };
  return g.__redditCache ?? null;
}

function setCache(value: { at: number; payload: CachedPayload }) {
  const g = globalThis as unknown as { __redditCache?: { at: number; payload: CachedPayload } };
  g.__redditCache = value;
}

async function fetchFromRss(subreddit: string): Promise<RedditPost[]> {
  try {
    const feed = await RSS_PARSER.parseURL(`https://old.reddit.com/r/${subreddit}/.rss`);
    const items = (feed.items ?? []).slice(0, 25);
    return items.map((item) => {
      const title = (item.title ?? "").trim();
      const link = (item.link ?? "").trim();
      const author = String((item as any).author ?? (item as any).creator ?? "[unknown]");
      const created = item.isoDate ? new Date(item.isoDate).toISOString() : new Date().toISOString();
      return {
        title,
        author: author.replace(/^u\//i, ""),
        subreddit,
        score: 0,
        numComments: 0,
        url: link,
        permalink: link,
        selftext: "",
        created,
        flair: null,
        thumbnail: null,
        isSelf: true,
      };
    }).filter((p) => Boolean(p.title) && Boolean(p.url));
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  const cache = getCache();
  const url = new URL(request.url);
  const forceRefresh = url.searchParams.get("refresh") === "1";
  if (!forceRefresh && cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return NextResponse.json(cache.payload, {
      headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" },
    });
  }

  const allPosts: RedditPost[] = [];
  const errors: string[] = [];

  for (const sub of REDDIT_SUBS) {
    try {
      const searchUrl = sub.query
        ? `https://www.reddit.com/r/${sub.name}/search.json?q=${encodeURIComponent(sub.query)}&restrict_sr=1&sort=new&t=month&limit=50`
        : `https://www.reddit.com/r/${sub.name}/new.json?limit=50&restrict_sr=1`;

      const response = await fetchWithTimeout(searchUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          "Accept": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        errors.push(`${sub.name}: HTTP ${response.status} (trying RSS fallback)`);
        const rssPosts = await fetchFromRss(sub.name);
        allPosts.push(...rssPosts);
        continue;
      }

      const text = await response.text();

      // Reddit sometimes returns HTML instead of JSON when rate limiting
      if (text.trimStart().startsWith("<")) {
        errors.push(`${sub.name}: Got HTML instead of JSON (rate limited?) (trying RSS fallback)`);
        const rssPosts = await fetchFromRss(sub.name);
        allPosts.push(...rssPosts);
        continue;
      }

      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        errors.push(`${sub.name}: Invalid JSON response (trying RSS fallback)`);
        const rssPosts = await fetchFromRss(sub.name);
        allPosts.push(...rssPosts);
        continue;
      }

      const children = data?.data?.children ?? [];

      for (const child of children) {
        const p = child.data;
        if (!p || !p.title) continue;

        const postText = `${p.title} ${p.selftext || ""}`.toLowerCase();
        // For hantavirus sub, take everything. For worldnews, only hantavirus-related
        if (sub.name === "worldnews" && !/hantavirus|hanta\s*virus|hemorrhagic\s*fever|cruise.*virus|virus.*cruise/.test(postText)) continue;

        const created = p.created_utc ? new Date(p.created_utc * 1000).toISOString() : new Date().toISOString();

        const permalink = `https://reddit.com${p.permalink}`;
        const externalUrl = p.url && p.url.startsWith("http") && !p.url.includes("reddit.com") ? p.url : null;

        allPosts.push({
          title: p.title,
          author: p.author || "[deleted]",
          subreddit: p.subreddit || sub.name,
          score: p.score ?? 0,
          numComments: p.num_comments ?? 0,
          url: externalUrl ?? permalink,
          permalink,
          selftext: (p.selftext || "").replace(/\s+/g, " ").trim().slice(0, 1000),
          created,
          flair: p.link_flair_text || null,
          thumbnail: p.thumbnail && p.thumbnail.startsWith("http") ? p.thumbnail : null,
          isSelf: p.is_self === true,
        });
      }
    } catch (e) {
      errors.push(`${sub.name}: ${e instanceof Error ? e.message : String(e)} (trying RSS fallback)`);
      const rssPosts = await fetchFromRss(sub.name);
      allPosts.push(...rssPosts);
    }
  }

  // Sort by score descending
  allPosts.sort((a, b) => (b.score - a.score) || (new Date(b.created).getTime() - new Date(a.created).getTime()));

  const payload: CachedPayload = {
    posts: allPosts,
    total: allPosts.length,
    subreddits: REDDIT_SUBS.map(s => s.name),
    fetchedAt: new Date().toISOString(),
    errors: errors.length > 0 ? errors : undefined,
  };

  setCache({ at: Date.now(), payload });

  return NextResponse.json(payload, {
    headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" },
  });
}
