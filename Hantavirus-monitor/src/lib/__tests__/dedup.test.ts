import { describe, it, expect } from "vitest";
import { normalizeTitle } from "@/lib/ingest";

describe("normalizeTitle", () => {
  it("lowercases the title", () => {
    expect(normalizeTitle("HANTAVIRUS Outbreak")).toBe("hantavirus outbreak");
  });

  it("strips punctuation", () => {
    expect(normalizeTitle("Hantavirus: outbreak confirmed!")).toBe("hantavirus outbreak confirmed");
  });

  it("collapses whitespace", () => {
    expect(normalizeTitle("Hantavirus   outbreak   confirmed")).toBe("hantavirus outbreak confirmed");
  });

  it("removes stop words", () => {
    expect(normalizeTitle("The hantavirus in the Americas")).toBe("hantavirus americas");
  });

  it("truncates to 120 chars", () => {
    const long = "A".repeat(200);
    expect(normalizeTitle(long).length).toBe(120);
  });

  it("handles empty string", () => {
    expect(normalizeTitle("")).toBe("");
  });

  it("normalizes similar titles to same key", () => {
    const t1 = normalizeTitle("Hantavirus Cases in Chile Rise");
    const t2 = normalizeTitle("Hantavirus: Cases in Chile Rise!");
    expect(t1).toBe(t2);
  });

  it("differentiates truly different titles", () => {
    const t1 = normalizeTitle("Hantavirus Cases Rise in Argentina");
    const t2 = normalizeTitle("Hantavirus Deaths Reported in Chile");
    expect(t1).not.toBe(t2);
  });
});
