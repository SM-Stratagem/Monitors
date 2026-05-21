import type { SignalReport } from "@/lib/reports/types";
import { EmptyState, Panel } from "../parts";

const keywords = ["cruise", "ship", "vessel", "flight", "airport", "port", "travel", "passenger", "crew", "border", "quarantine", "repatriation", "docked", "route", "airline"];

export function TravelExposureTab({ reports, onOpen }: { reports: SignalReport[]; onOpen: (report: SignalReport) => void }) {
  const travel = reports.filter((r) => r.travelLinked);
  return (
    <Panel title="Travel Exposure Intelligence" subtitle="Travel-linked signal monitoring with unverified movement context.">
      {!travel.length ? <EmptyState title="No travel-linked signals detected" description="No travel-linked signals detected in the current dataset." /> : <div className="travel-grid">{travel.slice(0, 30).map((report) => <button key={report.id} className="travel-card" onClick={() => onOpen(report)}><h4>{report.title}</h4><p>{report.summary}</p><small className="mono">{report.country} · {report.source}</small><span className="pill">Travel-related signal</span></button>)}</div>}
      <div className="keyword-bar mono">Detected keywords: {keywords.join(", ")}</div>
    </Panel>
  );
}
