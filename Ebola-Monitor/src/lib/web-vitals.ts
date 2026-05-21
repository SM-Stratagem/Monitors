// Web Vitals monitoring for Core Web Vitals optimization
// Tracks: LCP (Largest Contentful Paint), FID (First Input Delay), CLS (Cumulative Layout Shift)

export type WebVitalsMetric = {
  name: "LCP" | "FID" | "CLS" | "TTFB" | "FCP";
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
};

export const WEB_VITALS_THRESHOLDS = {
  LCP: { good: 2500, "needs-improvement": 4000 }, // milliseconds
  FID: { good: 100, "needs-improvement": 300 }, // milliseconds
  CLS: { good: 0.1, "needs-improvement": 0.25 }, // unitless
  TTFB: { good: 300, "needs-improvement": 600 }, // milliseconds
  FCP: { good: 1800, "needs-improvement": 3000 }, // milliseconds
};

export function getRating(metric: WebVitalsMetric): "good" | "needs-improvement" | "poor" {
  const thresholds = WEB_VITALS_THRESHOLDS[metric.name];

  if (!thresholds) return "poor";

  const value = metric.value;
  const goodThreshold = thresholds.good;
  const needsImprovementThreshold = thresholds["needs-improvement"];

  if (value <= goodThreshold) return "good";
  if (value <= needsImprovementThreshold) return "needs-improvement";
  return "poor";
}

export function reportWebVitals(metric: WebVitalsMetric) {
  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    const value = typeof metric.value === "number" ? metric.value : 0;
    const delta = typeof metric.delta === "number" ? metric.delta : 0;
    const rating = getRating(metric);
    console.group(`📊 Web Vitals: ${metric.name}`);
    console.log(`Value: ${value.toFixed(2)}`);
    console.log(`Rating: ${rating}`);
    console.log(`Delta: ${delta.toFixed(2)}`);
    console.groupEnd();
  }

  // Send to analytics in production (e.g., Google Analytics, Vercel Analytics)
  // This could be extended to send to your own analytics endpoint
  if (process.env.NODE_ENV === "production") {
    // Example: Send to analytics
    if (typeof gtag !== "undefined") {
      gtag("event", "page_view", {
        [`${metric.name}_value`]: metric.value,
        [`${metric.name}_rating`]: getRating(metric),
      });
    }
  }
}

declare let gtag: Function;
