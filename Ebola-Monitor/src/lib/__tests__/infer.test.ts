import { describe, it, expect } from "vitest";
import {
  detectSeverity,
  inferCases,
  inferCountry,
  inferRegion,
  isEbolaRelated,
  scoreSourceCredibility,
} from "@/lib/ingest";

describe("detectSeverity", () => {
  it("returns critical for death reports with ebola", () => {
    expect(detectSeverity("3 deaths from ebola outbreak")).toBe("critical");
  });

  it("returns critical for fatality reports", () => {
    expect(detectSeverity("Ebola fatality confirmed in DRC")).toBe("critical");
  });

  it("returns critical for outbreak declared", () => {
    expect(detectSeverity("Ebola outbreak declared by WHO")).toBe("critical");
  });

  it("returns critical for biocontainment mentions", () => {
    expect(detectSeverity("Patient moved to biocontainment unit")).toBe("critical");
  });

  it("returns high for confirmed cases", () => {
    expect(detectSeverity("Confirmed case of ebola infection detected")).toBe("high");
  });

  it("returns high for confirmed patient pattern", () => {
    expect(detectSeverity("Confirmed patient with ebola admitted")).toBe("high");
  });

  it("returns high for hospitalization", () => {
    expect(detectSeverity("Patient hospitalized with ebola infection")).toBe("high");
  });

  it("returns high for evacuation", () => {
    expect(detectSeverity("Evacuation of ebola patients underway")).toBe("high");
  });

  it("returns high for travel advisory", () => {
    expect(detectSeverity("Travel advisory issued for ebola")).toBe("high");
  });

  it("returns moderate for monitoring", () => {
    expect(detectSeverity("Authorities monitoring ebola situation")).toBe("moderate");
  });

  it("returns moderate for investigation", () => {
    expect(detectSeverity("Investigating possible ebola case")).toBe("moderate");
  });

  it("returns moderate for generic ebola mention", () => {
    expect(detectSeverity("New research on ebola transmission")).toBe("moderate");
  });

  it("returns low for non-ebola content", () => {
    expect(detectSeverity("Weather update for South America")).toBe("low");
  });

  it("does not mark non-fatal numbers as critical", () => {
    expect(detectSeverity("Ebola vaccine shows promise in 50 patients")).not.toBe("critical");
  });
});

describe("inferCases", () => {
  it("extracts case count from standard phrasing", () => {
    expect(inferCases("12 confirmed cases of ebola")).toBe(12);
  });

  it("extracts case count with patients keyword", () => {
    expect(inferCases("5 patients infected with ebola")).toBe(5);
  });

  it("extracts case count with confirmed prefix", () => {
    expect(inferCases("confirmed: 8 cases")).toBe(8);
  });

  it("returns null for no match", () => {
    expect(inferCases("No ebola cases reported")).toBeNull();
  });

  it("ignores numbers over 9999 (noise)", () => {
    expect(inferCases("12345 cases reported worldwide")).toBeNull();
  });

  it("ignores phone-number-like patterns", () => {
    expect(inferCases("Call 5551234567 for information")).toBeNull();
  });
});

describe("inferCountry", () => {
  it("detects Argentina", () => {
    expect(inferCountry("Ebola outbreak in Argentina")).toBe("Argentina");
  });

  it("detects Chile", () => {
    expect(inferCountry("Cases of ebola reported in Chile region")).toBe("Chile");
  });

  it("detects United States from 'usa'", () => {
    expect(inferCountry("CDC issues guidance for USA travelers")).toBe("United States");
  });

  it("detects United States from 'united states'", () => {
    expect(inferCountry("Cases in the United States reported today")).toBe("United States");
  });

  it("does not match 'us' inside words", () => {
    expect(inferCountry("Research focused on ebola")).toBeNull();
  });

  it("detects cities", () => {
    expect(inferCountry("Outbreak reported in Buenos Aires")).toBe("Argentina");
  });

  it("returns null for short text", () => {
    expect(inferCountry("Short")).toBeNull();
  });
});

describe("inferRegion", () => {
  it("returns North America for US", () => {
    expect(inferRegion("United States")).toBe("North America");
  });

  it("returns South America for Argentina", () => {
    expect(inferRegion("Argentina")).toBe("South America");
  });

  it("returns Europe for UK", () => {
    expect(inferRegion("United Kingdom")).toBe("Europe");
  });

  it("returns Global for null", () => {
    expect(inferRegion(null)).toBe("Global");
  });
});

describe("isEbolaRelated", () => {
  it("returns true for ebola", () => {
    expect(isEbolaRelated("New ebola cases")).toBe(true);
  });

  it("returns true for filovirus", () => {
    expect(isEbolaRelated("Filovirus outbreak detected")).toBe(true);
  });

  it("returns true for hemorrhagic fever", () => {
    expect(isEbolaRelated("Hemorrhagic fever cases rise")).toBe(true);
  });

  it("returns true for EVD", () => {
    expect(isEbolaRelated("EVD outbreak in DRC")).toBe(true);
  });

  it("returns false for unrelated content", () => {
    expect(isEbolaRelated("Weather update for Europe")).toBe(false);
  });
});

describe("scoreSourceCredibility", () => {
  it("returns 98 for WHO", () => {
    expect(scoreSourceCredibility("WHO Disease Outbreak News")).toBe(98);
  });

  it("returns 96 for CDC", () => {
    expect(scoreSourceCredibility("CDC Health Alert")).toBe(96);
  });

  it("returns 92 for Reuters", () => {
    expect(scoreSourceCredibility("Reuters Health")).toBe(92);
  });

  it("returns 70 for unknown sources", () => {
    expect(scoreSourceCredibility("Unknown Blog")).toBe(70);
  });
});