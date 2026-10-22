"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent, type AnalyticsProps } from "@/lib/analytics";

/** Mide los clics en elementos con data-track (ver trackAttrs). Un solo listener para toda la página. */
export function AnalyticsClicks() {
  useEffect(() => {
    const on = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-track]");
      if (!el) return;
      const props: AnalyticsProps = {};
      for (const [k, v] of Object.entries(el.dataset)) {
        if (k.startsWith("track") && k !== "track") props[k.slice(5, 6).toLowerCase() + k.slice(6)] = v;
      }
      track(el.dataset.track as AnalyticsEvent, props);
    };
    document.addEventListener("click", on, { capture: true });
    return () => document.removeEventListener("click", on, { capture: true });
  }, []);
  return null;
}
