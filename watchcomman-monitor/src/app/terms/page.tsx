import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DISCLAIMER } from "@/lib/editorial";

export const metadata = {
  title: "Terms of Use",
  description: "The terms governing use of Watchcomman Monitor, including data accuracy, acceptable use, and liability.",
};

const h2Style: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 300,
  fontSize: 26,
  margin: "36px 0 12px",
  letterSpacing: "-0.01em",
};
const pStyle: React.CSSProperties = { color: "var(--ink-1)", fontSize: 15.5, lineHeight: 1.8, marginTop: 14 };
const CONTACT = "smstratagem@gmail.com";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="wm-shell" style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 760 }}>
        <div className="wm-eyebrow">Legal</div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(36px, 5vw, 60px)",
            margin: "10px 0 20px",
            letterSpacing: "-0.01em",
            lineHeight: 1.05,
          }}
        >
          Terms of Use
        </h1>
        <p style={{ ...pStyle, color: "var(--ink-2)", fontSize: 13 }}>Last updated: 16 July 2026</p>

        <p style={pStyle}>
          By accessing Watchcomman Monitor at <strong>monitor-info.app</strong> (the &ldquo;Service&rdquo;) you
          agree to these terms. If you do not agree, please do not use the Service.
        </p>

        <h2 style={h2Style}>The Service</h2>
        <p style={pStyle}>
          Watchcomman Monitor is an independent open-source-intelligence aggregation platform that collects,
          normalises, and ranks publicly available signals for situational awareness. We provide it on an
          &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis, and we may change, suspend, or discontinue
          any part of it at any time.
        </p>

        <h2 style={h2Style}>Not official advice</h2>
        <p style={pStyle}>{DISCLAIMER}</p>

        <h2 style={h2Style}>Data accuracy</h2>
        <p style={pStyle}>
          Signals shown on the Service originate from third-party sources and are aggregated automatically.
          While we take reasonable care in collecting and ranking them, we do not warrant that any signal is
          accurate, complete, current, or fit for any particular purpose. You are responsible for verifying
          information against primary sources before acting on it.
        </p>

        <h2 style={h2Style}>Acceptable use</h2>
        <p style={pStyle}>You agree not to:</p>
        <ul style={{ color: "var(--ink-1)", fontSize: 15, lineHeight: 1.85, paddingLeft: 18, marginTop: 10 }}>
          <li>use the Service for any unlawful purpose or in violation of any applicable regulation;</li>
          <li>attempt to disrupt, overload, or gain unauthorised access to the Service or its infrastructure;</li>
          <li>scrape or reproduce the Service&apos;s content at a scale that burdens our systems, other than through the documented <a href="/api-docs">public API</a> within any stated limits;</li>
          <li>misrepresent the Service as an official emergency, government, or medical source.</li>
        </ul>

        <h2 style={h2Style}>Intellectual property</h2>
        <p style={pStyle}>
          The design, original written content, and software of the Service belong to SM Stratagem. Underlying
          data and links remain the property of their respective sources and are used for informational and
          reference purposes. Our original editorial text may not be republished wholesale without attribution.
        </p>

        <h2 style={h2Style}>Third-party sources and advertising</h2>
        <p style={pStyle}>
          The Service links to and displays data from third parties and may display third-party advertising.
          We are not responsible for the content, accuracy, or practices of those third parties. See our{" "}
          <a href="/privacy">Privacy Policy</a> for how advertising and cookies are handled.
        </p>

        <h2 style={h2Style}>Limitation of liability</h2>
        <p style={pStyle}>
          To the fullest extent permitted by law, SM Stratagem shall not be liable for any indirect,
          incidental, or consequential damages, or for any decision made or action taken in reliance on
          information provided by the Service.
        </p>

        <h2 style={h2Style}>Contact</h2>
        <p style={pStyle}>
          Questions about these terms can be sent to <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
        </p>
      </main>
      <Footer lastIngestAt={null} />
    </>
  );
}
