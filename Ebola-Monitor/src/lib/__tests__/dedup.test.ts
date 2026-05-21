import { describe, it, expect } from "vitest";
import { normalizeTitle } from "@/lib/ingest";

describe("normalizeTitle", () => {
  it("lowercases the title", () => {
    expect(normalizeTitle("EBOLA Outbreak")).toBe("ebola outbreak");
  });

  it("strips punctuation", () => {
    expect(normalizeTitle("Ebola: outbreak confirmed!")).toBe("ebola outbreak confirmed");
  });

  it("collapses whitespace", () => {
    expect(normalizeTitle("Ebola   outbreak   confirmed")).toBe("ebola outbreak confirmed");
  });

  it("removes stop words", () => {
    expect(normalizeTitle("The ebola in the Americas")).toBe("ebola americas");
  });

  it("truncates to 120 chars", () => {
    const long = "A".repeat(200);
    expect(normalizeTitle(long).length).toBe(120);
  });

  it("handles empty string", () => {
    expect(normalizeTitle("")).toBe("");
  });

  it("normalizes similar titles to same key", () => {
    const t1 = normalizeTitle("Ebola Cases in DRC Rise");
    const t2 = normalizeTitle("Ebola: Cases in DRC Rise!");
    expect(t1).toBe(t2);
  });

  it("differentiates truly different titles", () => {
    const t1 = normalizeTitle("Ebola Cases Rise in DRC");
    const t2 = normalizeTitle("Ebola Deaths Reported in Uganda");
    expect(t1).not.toBe(t2);
  });
});
