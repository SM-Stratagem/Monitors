import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { METHODOLOGY, DISCLAIMER, SITE_DESCRIPTION } from "@/lib/editorial";

export const metadata = {
  title: "About & Methodology",
  description:
    "How Watchcomman Monitor collects, normalises, and ranks open-source-intelligence signals across disease, disaster, environmental, security, and defense feeds.",
};

const h1Style: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 300,
  fontSize: "clamp(36px, 5vw, 60px)",
  margin: "10px 0 24px",
  letterSpacing: "-0.01em",
  lineHeight: 1.05,
};

const h2Style: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 300,
  fontSize: 30,
  margin: "44px 0 14px",
  letterSpacing: "-0.01em",
};

const pStyle: React.CSSProperties = { color: "var(--ink-1)", fontSize: 16, lineHeight: 1.8, marginTop: 16 };

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="wm-shell" style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 760 }}>
        <div className="wm-eyebrow">About the platform</div>
        <h1 style={h1Style}>One editorial atlas for global open-source intelligence.</h1>

        <p style={{ ...pStyle, fontSize: 18, color: "var(--ink-0)" }}>{SITE_DESCRIPTION}</p>
        <p style={pStyle}>
          Watchcomman Monitor exists to solve a specific problem: the signals that tell you the world is
          changing are scattered across dozens of government portals, scientific feeds, and humanitarian
          reporting systems, each with its own format and update cadence. Following even a handful of them
          in real time is a full-time job. This platform does that collection work continuously and presents
          the result as a single, calm, continuously updated surface — the place a researcher, journalist,
          analyst, or operator opens when they want one honest look at what is happening right now.
        </p>

        <h2 style={h2Style}>What we monitor</h2>
        <p style={pStyle}>
          The atlas spans two broad domains. The first is natural-hazard and public-health monitoring:
          disease outbreaks and advisories, earthquakes, wildfires, storms, floods, environmental pressure,
          and declared humanitarian disasters. The second is open-source security and defense intelligence:
          international sanctions changes, cyber-threat indicators, defense-procurement contracts, and
          maritime and military movement drawn from public tracking data.
        </p>
        <ul style={{ color: "var(--ink-1)", fontSize: 15, lineHeight: 1.9, paddingLeft: 18, marginTop: 12 }}>
          <li><strong>Disease &amp; health</strong> — outbreak surveillance and official advisories, including live feeds from our dedicated Ebola and Hantavirus monitors.</li>
          <li><strong>Natural hazards</strong> — earthquakes (USGS), wildfires, storms, and floods (NASA EONET, GDACS).</li>
          <li><strong>Humanitarian</strong> — disaster declarations and response reporting (ReliefWeb / OCHA).</li>
          <li><strong>Security &amp; defense</strong> — sanctions deltas (OFAC, EU, UK, BIS), cyber threats (CISA KEV, NVD), defense contracts, and maritime/military movement.</li>
        </ul>

        <h2 style={h2Style}>How the platform works</h2>
        {METHODOLOGY.map((para, i) => (
          <p key={i} style={pStyle}>{para}</p>
        ))}

        <h2 style={h2Style}>Where the data comes from</h2>
        <p style={pStyle}>
          Every signal traces back to a public, authoritative source. Primary inputs include the{" "}
          <a href="https://earthquake.usgs.gov/" target="_blank" rel="noopener noreferrer">USGS Earthquake Hazards Program</a>,{" "}
          <a href="https://eonet.gsfc.nasa.gov/" target="_blank" rel="noopener noreferrer">NASA EONET</a>,{" "}
          <a href="https://reliefweb.int/" target="_blank" rel="noopener noreferrer">ReliefWeb (OCHA)</a>,{" "}
          <a href="https://www.gdacs.org/" target="_blank" rel="noopener noreferrer">GDACS</a>, and the{" "}
          <a href="https://www.who.int/emergencies/disease-outbreak-news" target="_blank" rel="noopener noreferrer">WHO Disease Outbreak News</a>{" "}
          feed, alongside official sanctions and cyber-advisory publications. A full, filterable catalogue of the
          news and OSINT sources we poll is on the <a href="/sources">Sources</a> page. The current rolling window
          is also available as machine-readable JSON at <a href="/api/dashboard">/api/dashboard</a> and through the
          documented <a href="/api-docs">public API</a>.
        </p>

        <h2 style={h2Style}>Editorial standards &amp; limitations</h2>
        <p style={pStyle}>
          We aggregate and rank; we do not invent. When sources disagree, we prefer the most authoritative and
          most recent. Severity is a weighting to help you sort attention, not an official threat level. Because
          the platform depends on third-party feeds, signals can be incomplete, delayed, or later revised — and
          we retire them from the active window when their upstream source does.
        </p>
        <p style={{ ...pStyle, color: "var(--ink-2)", fontSize: 14, borderTop: "1px solid var(--line)", paddingTop: 20, marginTop: 28 }}>
          {DISCLAIMER}
        </p>

        <h2 style={h2Style}>Who runs it</h2>
        <p style={pStyle}>
          Watchcomman Monitor is built and operated by SM Stratagem as an independent project. It is not
          affiliated with, endorsed by, or an official channel of any of the agencies whose public data it
          aggregates. Questions, corrections, and source suggestions are welcome via the{" "}
          <a href="/contact">contact page</a>.
        </p>
      </main>
      <Footer lastIngestAt={null} />
    </>
  );
}
