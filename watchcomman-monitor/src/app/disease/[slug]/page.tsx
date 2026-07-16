import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SignalRowItem } from "@/components/SignalRow";
import { Sparkline } from "@/components/Sparkline";
import { getDashboardSnapshot, getSignalsFiltered, getTimeBuckets } from "@/lib/dashboard";
import { CATEGORY_LABELS, severityColor } from "@/lib/format";
import { CATEGORY_EDITORIAL, METHODOLOGY, DISCLAIMER } from "@/lib/editorial";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const CATS = Object.keys(CATEGORY_LABELS);

export function generateStaticParams() {
  return CATS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const label = CATEGORY_LABELS[slug] ?? slug;
  return {
    title: `${label} — Watchcomman Monitor`,
    description: `Live signals, trend, and country distribution for ${label.toLowerCase()} tracked by Watchcomman Monitor.`,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!CATS.includes(slug)) notFound();
  const label = CATEGORY_LABELS[slug];
  const article = CATEGORY_EDITORIAL[slug];

  const [rows, buckets, snap] = await Promise.all([
    getSignalsFiltered({ category: slug, sinceHours: 24 * 30, limit: 100 }),
    getTimeBuckets({ category: slug, buckets: 21 }),
    getDashboardSnapshot(500),
  ]);

  const byCountry = new Map<string, { count: number; high: number }>();
  for (const s of rows) {
    if (!s.country) continue;
    const e = byCountry.get(s.country) ?? { count: 0, high: 0 };
    e.count++;
    if (s.severity === "high" || s.severity === "critical") e.high++;
    byCountry.set(s.country, e);
  }
  const countries = Array.from(byCountry.entries())
    .map(([country, v]) => ({ country, ...v }))
    .sort((a, b) => b.high - a.high || b.count - a.count)
    .slice(0, 12);

  const totalCount = rows.length;
  const highCount = rows.filter((r) => r.severity === "high" || r.severity === "critical").length;

  return (
    <>
      <Header />
      <main style={{ paddingTop: 72, paddingBottom: 40 }}>
        <div className="wm-shell">
          <a href="/signals" className="wm-mono" style={{ fontSize: 11, color: "var(--ink-2)", letterSpacing: "0.2em" }}>
            ← BACK TO STREAM
          </a>
          <div className="wm-eyebrow" style={{ marginTop: 18 }}>Category</div>
          <h1 className="wm-display" style={{ fontSize: "clamp(36px, 5vw, 64px)", margin: "8px 0 18px" }}>
            {label}
          </h1>
          {article ? (
            <p style={{ color: "var(--ink-1)", fontSize: 18, maxWidth: 720, lineHeight: 1.6, fontFamily: "var(--font-display)", fontWeight: 300 }}>
              {article.summary}
            </p>
          ) : null}

          {article ? (
            <article style={{ maxWidth: 720, marginTop: 30 }}>
              {article.body.map((para, i) => (
                <p key={i} style={{ color: "var(--ink-1)", fontSize: 16, lineHeight: 1.8, marginTop: i === 0 ? 0 : 18 }}>
                  {para}
                </p>
              ))}

              <h2 className="wm-display" style={{ fontSize: 24, fontWeight: 300, margin: "34px 0 12px", letterSpacing: "-0.01em" }}>
                What to watch for
              </h2>
              <ul style={{ color: "var(--ink-1)", fontSize: 15, lineHeight: 1.75, paddingLeft: 18, margin: 0 }}>
                {article.watchFor.map((w, i) => <li key={i} style={{ marginTop: i === 0 ? 0 : 6 }}>{w}</li>)}
              </ul>

              <h2 className="wm-display" style={{ fontSize: 24, fontWeight: 300, margin: "34px 0 12px", letterSpacing: "-0.01em" }}>
                Where this data comes from
              </h2>
              <p style={{ color: "var(--ink-1)", fontSize: 15, lineHeight: 1.75, margin: 0 }}>{article.sourcing}</p>

              <h2 className="wm-display" style={{ fontSize: 24, fontWeight: 300, margin: "34px 0 12px", letterSpacing: "-0.01em" }}>
                How we rank and refresh signals
              </h2>
              {METHODOLOGY.map((para, i) => (
                <p key={i} style={{ color: "var(--ink-2)", fontSize: 14, lineHeight: 1.75, marginTop: i === 0 ? 0 : 14 }}>{para}</p>
              ))}
            </article>
          ) : null}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18, marginTop: 28 }}>
            <div className="wm-glass" style={{ padding: 18 }}>
              <div className="wm-eyebrow">Active (30d)</div>
              <div className="wm-display" style={{ fontSize: 40, marginTop: 8 }}>{totalCount}</div>
            </div>
            <div className="wm-glass" style={{ padding: 18 }}>
              <div className="wm-eyebrow">High / critical</div>
              <div className="wm-display" style={{ fontSize: 40, marginTop: 8, color: severityColor("high") }}>{highCount}</div>
            </div>
            <div className="wm-glass" style={{ padding: 18 }}>
              <div className="wm-eyebrow">Trend · 21d</div>
              <div style={{ marginTop: 8 }}>
                <Sparkline data={buckets} width={260} height={50} color="var(--accent)" />
              </div>
            </div>
            <div className="wm-glass" style={{ padding: 18 }}>
              <div className="wm-eyebrow">RSS / API</div>
              <div style={{ marginTop: 10, display: "flex", gap: 8, flexDirection: "column" }}>
                <a className="wm-mono" style={{ fontSize: 12, color: "var(--accent)" }} href={`/api/v1/signals?category=${slug}&limit=50`}>JSON ↗</a>
                <a className="wm-mono" style={{ fontSize: 12, color: "var(--accent)" }} href={`/api/v1/signals.rss?category=${slug}`}>RSS ↗</a>
              </div>
            </div>
          </div>

          <section style={{ marginTop: 40 }}>
            <div className="wm-eyebrow">Top countries · {label}</div>
            <ul style={{ listStyle: "none", margin: "14px 0 0", padding: 0, borderTop: "1px solid var(--line)" }}>
              {countries.length === 0 ? (
                <li style={{ padding: "14px 0", color: "var(--ink-2)", fontSize: 14 }}>No country-tagged signals in window.</li>
              ) : (
                countries.map((c) => (
                  <li key={c.country} style={{
                    display: "grid", gridTemplateColumns: "1fr 80px 80px", gap: 14,
                    padding: "12px 0", borderBottom: "1px solid var(--line)", alignItems: "center",
                  }}>
                    <span style={{ fontSize: 14 }}>{c.country}</span>
                    <span className="wm-mono" style={{ fontSize: 11, color: "var(--ink-2)", textAlign: "right" }}>{c.count} total</span>
                    <span className="wm-mono" style={{ fontSize: 11, color: severityColor("high"), textAlign: "right" }}>{c.high} high+</span>
                  </li>
                ))
              )}
            </ul>
          </section>

          <section style={{ marginTop: 40 }}>
            <div className="wm-eyebrow">Recent {label.toLowerCase()}</div>
            <ul style={{ listStyle: "none", margin: "14px 0 0", padding: 0, borderTop: "1px solid var(--line)" }}>
              {rows.slice(0, 40).map((s) => <SignalRowItem key={s.id} s={s} />)}
            </ul>
          </section>

          <p style={{ marginTop: 44, maxWidth: 720, color: "var(--ink-3)", fontSize: 12.5, lineHeight: 1.7, borderTop: "1px solid var(--line)", paddingTop: 18 }}>
            {DISCLAIMER}
          </p>
        </div>
      </main>
      <Footer lastIngestAt={snap.totals.lastIngestAt} />
    </>
  );
}
