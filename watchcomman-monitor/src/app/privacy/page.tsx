import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How Watchcomman Monitor handles visitor data, cookies, and third-party advertising, including Google AdSense.",
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

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="wm-shell" style={{ paddingTop: 64, paddingBottom: 80, maxWidth: 760 }}>
        <div className="wm-eyebrow">Privacy</div>
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
          Privacy Policy
        </h1>
        <p style={{ ...pStyle, color: "var(--ink-2)", fontSize: 13 }}>Last updated: 16 July 2026</p>

        <p style={pStyle}>
          This Privacy Policy explains what information Watchcomman Monitor (&ldquo;we&rdquo;, &ldquo;us&rdquo;,
          the &ldquo;Service&rdquo;) collects when you visit <strong>monitor-info.app</strong>, how it is used,
          and the choices you have. We have written it to be read, not skimmed past.
        </p>

        <h2 style={h2Style}>Information we collect</h2>
        <p style={pStyle}>
          The Service does not require an account to read, and we do not ask visitors for personally
          identifying information such as your name, address, or phone number. Pages are rendered server-side.
          Like almost all websites, our hosting infrastructure automatically logs standard technical request
          data — IP address, browser user-agent, requested path, response status, and timing — which we use
          only for security and operational health, and which is retained for a limited period.
        </p>
        <p style={pStyle}>
          If you choose to become a supporter or contact us by email, we process the information you provide
          (such as your email address) solely to respond to you or to deliver the feature you requested.
        </p>

        <h2 style={h2Style}>Cookies and local storage</h2>
        <p style={pStyle}>
          We use browser local storage to remember interface preferences — for example, which sources or
          watchlist entries you have toggled. This data stays in your browser and is not transmitted to us as
          a profile. Third parties described below may set their own cookies.
        </p>

        <h2 style={h2Style}>Advertising and Google AdSense</h2>
        <p style={pStyle}>
          We may display advertising served by Google, including through Google AdSense. Third-party vendors,
          including Google, use cookies to serve ads based on a user&apos;s prior visits to this and other
          websites.
        </p>
        <ul style={{ color: "var(--ink-1)", fontSize: 15, lineHeight: 1.85, paddingLeft: 18, marginTop: 12 }}>
          <li>
            Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on
            your visit to this site and/or other sites on the Internet.
          </li>
          <li>
            You may opt out of personalised advertising by visiting{" "}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
          </li>
          <li>
            You can also opt out of a third-party vendor&apos;s use of cookies for personalised advertising at{" "}
            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">aboutads.info/choices</a>{" "}
            and <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer">youronlinechoices.eu</a>.
          </li>
        </ul>
        <p style={pStyle}>
          For more detail on how Google uses information from sites that use its services, see{" "}
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
            How Google uses information from sites or apps that use our services
          </a>
          . Our advertising publisher manifest is published at <a href="/ads.txt">/ads.txt</a>.
        </p>

        <h2 style={h2Style}>Analytics</h2>
        <p style={pStyle}>
          We may use privacy-respecting analytics to understand aggregate, anonymous usage (such as which
          pages are viewed). This helps us improve the Service and is not used to identify individual
          visitors.
        </p>

        <h2 style={h2Style}>Third-party links and data</h2>
        <p style={pStyle}>
          The Service aggregates and links to public data from third-party sources such as USGS, NASA, WHO,
          ReliefWeb, and GDACS. When you follow a link to an external source, that site&apos;s own privacy
          policy governs your visit. We are not responsible for the content or practices of external sites.
        </p>

        <h2 style={h2Style}>Children&apos;s privacy</h2>
        <p style={pStyle}>
          The Service is intended for a general and professional audience and is not directed to children
          under 13. We do not knowingly collect personal information from children.
        </p>

        <h2 style={h2Style}>Your rights</h2>
        <p style={pStyle}>
          Depending on your location, you may have rights to access, correct, or request deletion of personal
          data we hold about you, and to object to certain processing. To exercise any of these rights, contact
          us at <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
        </p>

        <h2 style={h2Style}>Changes to this policy</h2>
        <p style={pStyle}>
          We may update this policy from time to time. Material changes will be reflected by the &ldquo;last
          updated&rdquo; date above.
        </p>

        <h2 style={h2Style}>Contact</h2>
        <p style={pStyle}>
          Questions about this policy can be sent to <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. See also our{" "}
          <a href="/contact">contact page</a> and <a href="/terms">terms of use</a>.
        </p>
      </main>
      <Footer lastIngestAt={null} />
    </>
  );
}
