"use client";

import Link from "next/link";

export default function SupportPage() {
  return (
    <main>
      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Inter', sans-serif;
          background: #0a0a0f;
          color: #e2e8f0;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .card {
          background: #13131a;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 40px 36px;
          max-width: 480px;
          width: 100%;
          text-align: center;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          text-decoration: none;
          margin-bottom: 28px;
          letter-spacing: 0.04em;
          transition: color 0.15s;
        }
        .back-link:hover { color: rgba(255,255,255,0.6); }

        .brand {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 12px;
        }

        h1 {
          font-size: 22px;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 10px;
          line-height: 1.3;
        }

        .sub {
          font-size: 14px;
          color: rgba(255,255,255,0.45);
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .divider {
          height: 1px;
          background: rgba(255,255,255,0.07);
          margin: 0 0 28px;
        }

        .options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .option-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 14px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          text-decoration: none;
          color: inherit;
          transition: background 0.15s, border-color 0.15s;
        }

        .option-btn:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.14);
        }

        .option-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .icon-bmac { background: rgba(245,158,11,0.15); color: rgba(245,158,11,0.9); }
        .icon-venmo { background: rgba(59,130,246,0.15); color: rgba(59,130,246,0.9); }
        .icon-paypal { background: rgba(14,165,233,0.15); color: rgba(14,165,233,0.9); }

        .option-label { text-align: left; }
        .option-label span {
          display: block;
          font-size: 11px;
          font-weight: 400;
          color: rgba(255,255,255,0.35);
          margin-top: 2px;
        }

        .footer-note {
          margin-top: 28px;
          font-size: 12px;
          color: rgba(255,255,255,0.2);
          line-height: 1.6;
        }
      `}</style>

      <div className="card">
        <Link href="/" className="back-link">← Back to tracker</Link>

        <div className="brand">EpiTrace · Outbreak Tracker</div>
        <h1>Support the Tracker</h1>
        <p className="sub">
          This tracker is built and maintained by one person, updated around the clock from public sources. If it&apos;s been useful to you, a tip goes a long way.
        </p>

        <div className="divider" />

        <div className="options">
          <a href="https://buymeacoffee.com/breroz" target="_blank" rel="noopener" className="option-btn">
            <div className="option-icon icon-bmac">☕</div>
            <div className="option-label">
              Buy Me a Coffee
              <span>buymeacoffee.com/breroz</span>
            </div>
          </a>

          <a href="https://venmo.com/BreRoz" target="_blank" rel="noopener" className="option-btn">
            <div className="option-icon icon-venmo">💙</div>
            <div className="option-label">
              Venmo
              <span>@BreRoz</span>
            </div>
          </a>

          <a href="https://paypal.me/breroz" target="_blank" rel="noopener" className="option-btn">
            <div className="option-icon icon-paypal">🅿</div>
            <div className="option-label">
              PayPal
              <span>paypal.me/breroz</span>
            </div>
          </a>
        </div>

        <p className="footer-note">No account needed for Venmo or PayPal. Any amount is appreciated and helps keep this running 24/7.</p>
      </div>
    </main>
  );
}
