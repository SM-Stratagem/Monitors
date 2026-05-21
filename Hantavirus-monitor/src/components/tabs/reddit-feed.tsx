"use client";

import React, { useEffect, useState } from "react";

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

type SubFilter = "all" | "hantavirus" | "worldnews";

export function RedditFeed() {
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SubFilter>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [now, setNow] = useState<number>(0);
  const [errors, setErrors] = useState<string[] | null>(null);

  useEffect(() => {
    fetch("/api/reddit")
      .then(r => r.json())
      .then(d => { setPosts(d.posts || []); setErrors(Array.isArray(d.errors) ? d.errors : null); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const updateNow = () => setNow(Date.now());
    const t = setTimeout(updateNow, 0);
    const id = setInterval(updateNow, 60_000);
    return () => {
      clearTimeout(t);
      clearInterval(id);
    };
  }, []);

  const filtered = filter === "all" ? posts : posts.filter(p => p.subreddit.toLowerCase() === filter);

  const formatScore = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
  };

  const timeAgo = (date: string) => {
    if (!now) return "just now";
    const diff = now - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return <div className="reddit-loading">Loading Reddit posts...</div>;
  }

  return (
    <div className="reddit-tab">
      <div className="reddit-header">
        <h2>🟠 Reddit — Community Intel</h2>
        <div className="reddit-header-meta">
          <span>{filtered.length} posts from r/hantavirus + r/worldnews</span>
          <span className="reddit-live-dot">● Live</span>
        </div>
      </div>

      <div className="reddit-filters">
        {(["all", "hantavirus", "worldnews"] as SubFilter[]).map(s => (
          <button
            key={s}
            className={`reddit-filter-btn ${filter === s ? "active" : ""}`}
            onClick={() => setFilter(s)}
          >
            {s === "all" ? "All Subs" : `r/${s}`}
            <span className="filter-count">{s === "all" ? posts.length : posts.filter(p => p.subreddit.toLowerCase() === s).length}</span>
          </button>
        ))}
      </div>

      <div className="reddit-list">
        {errors && errors.length > 0 && (
          <div className="reddit-empty" style={{ marginBottom: 12 }}>
            Reddit fetch warnings: {errors.join(" | ")}
          </div>
        )}
        {filtered.length === 0 ? (
          <div className="reddit-empty">No Reddit posts found for this filter</div>
        ) : (
          filtered.map((post, i) => (
            <div key={post.permalink} className="reddit-card stagger-card" style={{ "--i": i } as React.CSSProperties}>
              <div className="reddit-card-vote">
                <div className="vote-arrow">▲</div>
                <div className="vote-score">{formatScore(post.score)}</div>
                <div className="vote-label">votes</div>
              </div>

              <div className="reddit-card-content">
                <div className="reddit-card-meta">
                  <span className="reddit-sub">r/{post.subreddit}</span>
                  <span className="reddit-author">u/{post.author}</span>
                  <span className="reddit-time">{timeAgo(post.created)}</span>
                  {post.flair && <span className="reddit-flair">{post.flair}</span>}
                </div>

                <a href={post.url} target="_blank" rel="noopener noreferrer" className="reddit-card-title">
                  {post.title}
                </a>

                {post.selftext && post.isSelf && expanded === post.permalink && (
                  <div className="reddit-card-body">
                    {post.selftext}
                  </div>
                )}

                {post.selftext && post.isSelf && (
                  <button
                    className="reddit-expand-btn"
                    onClick={() => setExpanded(expanded === post.permalink ? null : post.permalink)}
                  >
                    {expanded === post.permalink ? "▲ Hide text" : "▼ Show text"}
                  </button>
                )}

                <div className="reddit-card-actions">
                  <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="reddit-action">
                    💬 {post.numComments} comments
                  </a>
                  <a href={post.url} target="_blank" rel="noopener noreferrer" className="reddit-action">
                    🔗 source
                  </a>
                  <span className="reddit-action">
                    ⏱ {new Date(post.created).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
