"use client";

import { useEffect } from "react";
import { reportWebVitals, getRating } from "@/lib/web-vitals";

export function WebVitalsReporter() {
  useEffect(() => {
    // Track Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      reportWebVitals({
        name: "LCP",
        value: lastEntry.startTime,
        rating: "good",
        delta: 0,
        id: (lastEntry as any).id || "",
      });
    });

    try {
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch (e) {
      console.warn("LCP observer not supported");
    }

    // Track Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if ((entry as any).hadRecentInput) continue;
        clsValue += (entry as any).value;
        reportWebVitals({
          name: "CLS",
          value: clsValue,
          rating: getRating({ name: "CLS", value: clsValue } as any),
          delta: (entry as any).value,
          id: (entry as any).id || "",
        });
      }
    });

    try {
      clsObserver.observe({ entryTypes: ["layout-shift"] });
    } catch (e) {
      console.warn("CLS observer not supported");
    }

    // Track First Input Delay (FID) / Interaction to Next Paint (INP)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        reportWebVitals({
          name: "FID",
          value: (entry as any).processingDuration,
          rating: "good",
          delta: 0,
          id: (entry as any).id || "",
        });
      });
    });

    try {
      fidObserver.observe({ entryTypes: ["first-input"] });
    } catch (e) {
      console.warn("FID observer not supported");
    }

    return () => {
      lcpObserver.disconnect();
      clsObserver.disconnect();
      fidObserver.disconnect();
    };
  }, []);

  return null;
}
