import { Dashboard } from "@/components/dashboard";

export default function HomePage() {
  return (
    <>
      <h1 className="sr-only">Hantavirus Outbreak Tracker — MV Hondius (Andes virus) live updates</h1>
      <p className="sr-only">
        Monitoring dashboard aggregating official public-health guidance and verified reporting, with timestamps, source links,
        and machine-readable snapshot exports.
      </p>
      <Dashboard />
    </>
  );
}
