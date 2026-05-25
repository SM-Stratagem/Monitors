"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdSenseUnitProps = {
  label?: string;
  slot?: string;
  className?: string;
};

export function AdSenseUnit({ label = "Advertisement", slot, className = "" }: AdSenseUnitProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || "ca-pub-2896982474245057";
  const resolvedSlot = slot?.trim() || process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP?.trim();

  useEffect(() => {
    if (!client) return;

    if (resolvedSlot) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // Ignore blocked or unavailable AdSense runtime cases.
      }
    }
  }, [client, resolvedSlot]);

  if (!client) return null;

  return (
    <aside className={`ad-slot ${className}`.trim()} aria-label={label}>
      <div className="ad-slot__label">{label}</div>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      {resolvedSlot ? (
        <ins
          className="adsbygoogle ad-slot__frame"
          style={{ display: "block" }}
          data-ad-client={client}
          data-ad-slot={resolvedSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="ad-slot__note">Auto ads enabled for this content page.</div>
      )}
    </aside>
  );
}
