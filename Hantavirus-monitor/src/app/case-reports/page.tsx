"use client";

import { generateBreadcrumbSchema, breadcrumbs } from "@/lib/breadcrumb-schema";

export default function CaseReportsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs.caseReports);

  return (
    <main className="case-reports-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} suppressHydrationWarning />

      <article className="content-wrapper">
        <h1>MV Hondius Hantavirus Case Reports 2026</h1>

        <section>
          <h2>Case Summary Statistics</h2>
          <div className="stats-grid">
            <div className="stat">
              <div className="number">35</div>
              <div className="label">Total Confirmed Cases</div>
            </div>
            <div className="stat">
              <div className="number">3</div>
              <div className="label">Deaths</div>
            </div>
            <div className="stat">
              <div className="number">8.6%</div>
              <div className="label">Case Fatality Rate</div>
            </div>
            <div className="stat">
              <div className="number">14</div>
              <div className="label">Countries Affected</div>
            </div>
          </div>
        </section>

        <section>
          <h2>Clinical Presentation Summary</h2>
          <table>
            <thead>
              <tr>
                <th>Clinical Feature</th>
                <th>Frequency</th>
                <th>Timeline</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Fever</td>
                <td>100%</td>
                <td>Day 1-5 of illness</td>
              </tr>
              <tr>
                <td>Myalgia (muscle pain)</td>
                <td>88%</td>
                <td>Day 1-4</td>
              </tr>
              <tr>
                <td>Cough</td>
                <td>71%</td>
                <td>Day 3-5</td>
              </tr>
              <tr>
                <td>Dyspnea (shortness of breath)</td>
                <td>66%</td>
                <td>Day 4-6</td>
              </tr>
              <tr>
                <td>Headache</td>
                <td>80%</td>
                <td>Day 1-3</td>
              </tr>
              <tr>
                <td>Nausea/Vomiting</td>
                <td>51%</td>
                <td>Day 2-4</td>
              </tr>
              <tr>
                <td>Hypoxemia (low blood oxygen)</td>
                <td>57%</td>
                <td>Day 4-7</td>
              </tr>
              <tr>
                <td>Pulmonary Edema</td>
                <td>48%</td>
                <td>Day 5-8</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2>Outcomes</h2>
          <ul>
            <li>Recovered: 32 (91%)</li>
            <li>Died: 3 (9%)</li>
          </ul>
        </section>

        <section className="related-pages">
          <h2>Related Pages</h2>
          <ul>
            <li>
              <a href="/hantavirus-101">Hantavirus 101</a> — Disease biology
            </li>
            <li>
              <a href="/outbreak-timeline">Outbreak Timeline</a> — Case progression
            </li>
            <li>
              <a href="/prevention-guide">Prevention Guide</a> — Reduce risk
            </li>
          </ul>
        </section>
      </article>

      <style jsx>{`
        .case-reports-page {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem;
          background: linear-gradient(135deg, #0a1628 0%, #1a2744 100%);
          color: #e0e0e0;
        }

        h1 {
          color: #00ff41;
          text-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
        }

        h2 {
          color: #00d4ff;
          border-left: 4px solid #00d4ff;
          padding-left: 1rem;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          background: rgba(0, 0, 0, 0.3);
        }

        th, td {
          padding: 1rem;
          text-align: left;
          border: 1px solid #444;
        }

        th {
          background: rgba(0, 212, 255, 0.1);
          color: #00d4ff;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .stat {
          background: rgba(0, 212, 255, 0.1);
          border-left: 4px solid #00d4ff;
          padding: 1rem;
          text-align: center;
        }

        .related-pages {
          background: rgba(0, 255, 65, 0.05);
          border-left: 4px solid #00ff41;
          padding: 1rem;
          margin-top: 2rem;
        }

        a {
          color: #00d4ff;
        }
      `}</style>
    </main>
  );
}
