"use client";

import type { SignalReport } from "@/lib/reports/types";
import type { SortMode } from "@/lib/reports/report-filters";
import { EmptyState, FeedToolbar, Panel, SignalCard } from "../parts";

export function SignalFeedTab({ 
  reports, 
  sort, 
  setSort, 
  onOpen 
}: { 
  reports: SignalReport[]; 
  sort: SortMode; 
  setSort: (sort: SortMode) => void; 
  onOpen: (report: SignalReport) => void;
}) {
  return (
    <Panel
      title="Signal Feed"
      subtitle="Chronological signal stream with sorting by recency, severity, credibility, source, or country."
      actions={<FeedToolbar sort={sort} setSort={setSort} />}
    >
      {!reports.length ? (
        <EmptyState title="No signals match filters" description="Try resetting filters or widening the date range." />
      ) : (
        <div className="feed-list">
          {reports.map((report) => (
            <SignalCard key={report.id} report={report} onOpen={onOpen} />
          ))}
        </div>
      )}
    </Panel>
  );
}
