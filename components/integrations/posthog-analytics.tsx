"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

export function PostHogAnalytics() {
  useEffect(() => {
    if (!key || !host || posthog.__loaded) return;
    posthog.init(key, {
      api_host: host,
      // 2025-05-24 defaults: history-based pageviews (needed for client-side
      // navigation), pageleave events, and autocaptured clicks/heatmap data.
      defaults: "2025-05-24",
    });
  }, []);

  return null;
}
