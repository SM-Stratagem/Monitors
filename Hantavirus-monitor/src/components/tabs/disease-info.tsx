"use client";

type StrainInfo = {
  name: string;
  region: string;
  transmission: string;
  severity: string;
};

type DiseaseData = {
  name: string;
  synonyms: string[];
  transmission: string[];
  symptoms: string[];
  incubationPeriod: string;
  mortalityRate: string;
  prevention: string[];
  treatment: string;
  strains: StrainInfo[];
  currentOutbreak: {
    vessel: string;
    cases: number;
    deaths: number;
    countries: number;
    strain: string;
    source: string;
    lastUpdated: string;
  };
};

type FeedItem = {
  source: string;
  title: string;
  url: string;
  summary: string;
  publishedAt: string;
  credibility: number;
};

type Props = {
  disease: DiseaseData;
  feedItems: FeedItem[];
};

export function DiseaseInfo({ disease, feedItems }: Props) {
  return (
    <div className="disease-info-tab">
      <div className="disease-header">
        <h2>🔬 {disease.name}</h2>
        <div className="disease-synonyms">
          {disease.synonyms.map((s, i) => (
            <span key={i} className="disease-synonym">{s}</span>
          ))}
        </div>
      </div>

      <div className="disease-grid">
        <div className="disease-panel">
          <h3>🦠 Transmission</h3>
          <ul className="disease-list">
            {disease.transmission.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>

        <div className="disease-panel">
          <h3>🩺 Symptoms</h3>
          <ul className="disease-list">
            {disease.symptoms.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>

        <div className="disease-panel">
          <h3>📊 Key Facts</h3>
          <div className="disease-facts">
            <div className="fact-row"><label>Incubation</label><span>{disease.incubationPeriod}</span></div>
            <div className="fact-row"><label>Mortality</label><span>{disease.mortalityRate}</span></div>
            <div className="fact-row"><label>Treatment</label><span>{disease.treatment}</span></div>
          </div>
        </div>

        <div className="disease-panel">
          <h3>🛡️ Prevention</h3>
          <ul className="disease-list">
            {disease.prevention.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>

        <div className="disease-panel outbreak-panel">
          <h3>🔴 Current Outbreak — {disease.currentOutbreak.vessel}</h3>
          <div className="outbreak-stats">
            <div className="outbreak-stat"><span className="os-value">{disease.currentOutbreak.cases}</span><span className="os-label">Cases</span></div>
            <div className="outbreak-stat"><span className="os-value">{disease.currentOutbreak.deaths}</span><span className="os-label">Deaths</span></div>
            <div className="outbreak-stat"><span className="os-value">{disease.currentOutbreak.countries}</span><span className="os-label">Countries</span></div>
          </div>
          <div className="outbreak-meta">
            <span>Strain: {disease.currentOutbreak.strain}</span>
            <span>Source: {disease.currentOutbreak.source}</span>
            <span>Last Updated: {disease.currentOutbreak.lastUpdated}</span>
          </div>
        </div>

        <div className="disease-panel strains-panel">
          <h3>🧬 Hantavirus Strains</h3>
          <div className="strains-table">
            <div className="strains-header">
              <span>Strain</span><span>Region</span><span>Transmission</span><span>Severity</span>
            </div>
            {disease.strains.map((s, i) => (
              <div key={i} className="strain-row">
                <span className="strain-name">{s.name}</span>
                <span>{s.region}</span>
                <span>{s.transmission}</span>
                <span className="strain-severity">{s.severity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {feedItems.length > 0 && (
        <div className="disease-panel">
          <h3>📰 Related WHO/CDC/ProMED Feed Items</h3>
          <div className="disease-feed-list">
            {feedItems.map((item, i) => (
              <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="disease-feed-item">
                <div className="dfi-header">
                  <span className="dfi-source">{item.source}</span>
                  <span className="dfi-credibility">Credibility: {item.credibility}</span>
                </div>
                <div className="dfi-title">{item.title}</div>
                <div className="dfi-summary">{item.summary}</div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
