"use client";

import React, { useState, useMemo } from "react";

type NewsItem = {
  id: number;
  title: string;
  source: string;
  url: string;
  summary: string;
  severity: string;
  region: string;
  country: string;
  publishedAt: string;
  aiRiskNote: string | null;
  advisoryType: string;
};

type Props = {
  items: NewsItem[];
};

const SEV_COLORS: Record<string, string> = {
  critical: "#FF1744",
  high: "#FF6600",
  moderate: "#FFD700",
  low: "#00FF41",
};

export function NewsFeed({ items }: Props) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = items;
    if (filter !== "all") result = result.filter(i => i.severity === filter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.source.toLowerCase().includes(q) ||
        i.country.toLowerCase().includes(q) ||
        i.summary.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, filter, search]);

  const sevCounts = useMemo(() => {
    const counts: Record<string, number> = { all: items.length };
    items.forEach(i => { counts[i.severity] = (counts[i.severity] || 0) + 1; });
    return counts;
  }, [items]);

  return (
    <div className="news-feed-tab">
      <div className="news-header">
        <h2>📰 News Feed — Live Signals</h2>
        <div className="news-search">
          <input
            type="text"
            placeholder="Search signals..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="news-search-input"
          />
        </div>
      </div>

      <div className="news-filters">
        {["all", "critical", "high", "moderate", "low"].map(s => (
          <button
            key={s}
            className={`news-filter-btn ${filter === s ? "active" : ""}`}
            onClick={() => setFilter(s)}
            style={filter === s && s !== "all" ? { borderColor: SEV_COLORS[s], color: SEV_COLORS[s] } : {}}
          >
            {s === "all" ? `All (${sevCounts.all || 0})` : `${s} (${sevCounts[s] || 0})`}
          </button>
        ))}
      </div>

      <div className="news-list">
        {filtered.length === 0 ? (
          <div className="news-empty">No signals match your filters</div>
        ) : (
          filtered.map((item, idx) => {
            const newsArticleSchema = {
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              "@id": `${item.url}#article`,
              headline: item.title,
              description: item.summary,
              url: item.url,
              datePublished: item.publishedAt,
              dateModified: item.publishedAt,
              author: {
                "@type": "Organization",
                name: item.source,
                url: new URL(item.url).origin,
              },
              publisher: {
                "@type": "Organization",
                name: item.source,
              },
              image: {
                "@type": "ImageObject",
                url: `${typeof window !== "undefined" ? window.location.origin : "https://www.ebolamonitorapp.com"}/opengraph-image`,
              },
              articleSection: "Health",
              keywords: ["ebola", "EVD", item.country, item.severity],
              about: {
                "@type": "Thing",
                name: "Ebola virus disease outbreak — 2026",
              },
              inLanguage: "en",
            };

            return (
              <React.Fragment key={item.id}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`news-card stagger-card card-glow-${item.severity}`}
                  style={{ "--i": idx } as React.CSSProperties}
                  data-news-id={item.id}
                  data-severity={item.severity}
                  data-country={item.country}
                >
                  <div className="news-card-top">
                    <span className="news-severity" style={{ background: SEV_COLORS[item.severity] || "#666" }}>
                      {item.severity}
                    </span>
                    <span className="news-source">{item.source}</span>
                    <span className="news-date">
                      {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <h4 className="news-title">{item.title}</h4>
                  <p className="news-summary">{item.summary}</p>
                  <div className="news-card-bottom">
                    <span className="news-country">{item.country || "Unknown"}</span>
                    <span className="news-type">{item.advisoryType}</span>
                    {item.aiRiskNote && (
                      <span className="news-ai-badge" title={item.aiRiskNote}>AI</span>
                    )}
                  </div>
                </a>
                <script
                  type="application/ld+json"
                  suppressHydrationWarning
                  dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }}
                />
              </React.Fragment>
            );
          })
        )}
      </div>
    </div>
  );
}
