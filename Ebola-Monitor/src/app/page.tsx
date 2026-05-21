import { Dashboard } from "@/components/dashboard";

export default function HomePage() {
  return (
    <>
      <h1 className="sr-only">Ebola Outbreak Tracker — Ebola Virus Disease (EVD) live updates</h1>
      <p className="sr-only">
        Monitoring dashboard aggregating official public-health guidance and verified reporting on Ebola virus disease outbreaks, with timestamps, source links,
        and machine-readable snapshot exports.
      </p>
      <Dashboard />
    </>
  );
}
