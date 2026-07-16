import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Contact",
  description: "Get in touch with the team behind Watchcomman Monitor — questions, corrections, and source suggestions.",
};

const pStyle: React.CSSProperties = { color: "var(--ink-1)", fontSize: 16, lineHeight: 1.8, marginTop: 16 };
const CONTACT = "smstratagem@gmail.com";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="wm-shell" style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 720 }}>
        <div className="wm-eyebrow">Contact</div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(36px, 5vw, 60px)",
            margin: "10px 0 24px",
            letterSpacing: "-0.01em",
            lineHeight: 1.05,
          }}
        >
          Get in touch.
        </h1>

        <p style={pStyle}>
          Watchcomman Monitor is built and operated by <strong>SM Stratagem</strong>. We welcome questions
          about the platform, corrections to any signal, suggestions for new data sources, and partnership or
          press enquiries.
        </p>

        <div className="wm-glass" style={{ padding: 24, borderRadius: 14, marginTop: 28 }}>
          <div className="wm-eyebrow">Email</div>
          <a
            href={`mailto:${CONTACT}`}
            style={{ display: "inline-block", marginTop: 8, fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 300, color: "var(--ink-0)" }}
          >
            {CONTACT}
          </a>
          <p style={{ ...pStyle, fontSize: 14, color: "var(--ink-2)" }}>
            We aim to respond to genuine enquiries within a few business days. For corrections, please include
            a link to the signal and, where possible, an authoritative source.
          </p>
        </div>

        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: 26, margin: "40px 0 12px", letterSpacing: "-0.01em" }}>
          Before you write
        </h2>
        <p style={pStyle}>
          Much of what people ask is already covered: how the platform collects and ranks data is described on
          the <a href="/about">About &amp; Methodology</a> page, the full list of feeds is on{" "}
          <a href="/sources">Sources</a>, machine access is documented under the{" "}
          <a href="/api-docs">public API</a>, and how we handle data is set out in our{" "}
          <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms of Use</a>.
        </p>
      </main>
      <Footer lastIngestAt={null} />
    </>
  );
}
