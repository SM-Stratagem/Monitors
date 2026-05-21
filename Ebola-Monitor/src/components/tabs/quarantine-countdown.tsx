"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";

type QuarantineEntry = {
  id: number;
  country: string;
  flag: string;
  passengers: number;
  quarantineStart: string;
  quarantineEnd: string;
  durationDays: number;
  protocol: string;
  status: string;
  notes: string;
  daysRemaining: number | null;
  daysElapsed: number | null;
  progress: number;
  isComplete: boolean;
};

type Props = {
  quarantine: QuarantineEntry[];
};

function useCountdown(endDate: string) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const end = new Date(endDate).getTime();
  const diff = Math.max(0, end - now);
  const totalSec = Math.floor(diff / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { days, hours, minutes, seconds, done: diff <= 0 };
}

function CountdownTimer({ endDate }: { endDate: string }) {
  const { days, hours, minutes, seconds, done } = useCountdown(endDate);

  if (done) return <div className="countdown-done">✅ Quarantine Complete</div>;

  return (
    <div className="countdown-numbers">
      <div className="countdown-unit">
        <span className="countdown-value">{days}</span>
        <span className="countdown-label">Days</span>
      </div>
      <div className="countdown-separator">:</div>
      <div className="countdown-unit">
        <span className="countdown-value">{String(hours).padStart(2, "0")}</span>
        <span className="countdown-label">Hours</span>
      </div>
      <div className="countdown-separator">:</div>
      <div className="countdown-unit">
        <span className="countdown-value">{String(minutes).padStart(2, "0")}</span>
        <span className="countdown-label">Min</span>
      </div>
      <div className="countdown-separator">:</div>
      <div className="countdown-unit">
        <span className="countdown-value countdown-seconds">{String(seconds).padStart(2, "0")}</span>
        <span className="countdown-label">Sec</span>
      </div>
    </div>
  );
}

export function QuarantineCountdown({ quarantine }: Props) {
  const sorted = [...quarantine].sort((a, b) => {
    if (a.isComplete && !b.isComplete) return 1;
    if (!a.isComplete && b.isComplete) return -1;
    return (a.daysRemaining ?? 999) - (b.daysRemaining ?? 999);
  });

  const totalPassengers = quarantine.reduce((sum, q) => sum + (q.passengers || 0), 0);
  const activeCount = quarantine.filter(q => !q.isComplete).length;

  return (
    <div className="quarantine-tab">
      <div className="quarantine-header">
        <h2>🏥 Quarantine Countdown</h2>
        <p>{activeCount} active quarantines · {totalPassengers} passengers monitored</p>
      </div>

      <div className="quarantine-grid">
        {sorted.map((q) => {
          const end = dayjs(q.quarantineEnd);
          const start = dayjs(q.quarantineStart);

          return (
            <div key={q.id} className={`quarantine-card ${q.isComplete ? "complete" : "active"}`}>
              <div className="quar-card-header">
                <span className="quar-flag">{q.flag}</span>
                <span className="quar-country">{q.country}</span>
                {q.isComplete ? (
                  <span className="quar-badge complete">COMPLETE</span>
                ) : (
                  <span className="quar-badge active">ACTIVE</span>
                )}
              </div>

              <div className="quar-countdown">
                <CountdownTimer endDate={q.quarantineEnd} />
              </div>

              <div className="quar-progress-bar">
                <div className="quar-progress-fill" style={{ width: `${q.progress}%` }} />
              </div>
              <div className="quar-progress-label">{q.progress}% complete · {q.daysElapsed || 0} of {q.durationDays} days</div>

              <div className="quar-details">
                <div className="quar-detail"><label>Passengers</label><span>{q.passengers}</span></div>
                <div className="quar-detail"><label>Duration</label><span>{q.durationDays} days</span></div>
                <div className="quar-detail"><label>Start</label><span>{start.format("MMM D, YYYY")}</span></div>
                <div className="quar-detail"><label>End</label><span>{end.format("MMM D, YYYY")}</span></div>
              </div>

              <div className="quar-protocol">{q.protocol}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
