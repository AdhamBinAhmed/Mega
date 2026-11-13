"use client";

import { useEffect, useState } from "react";

export interface BrandColors {
  accent: string;
  ink: string;
  rule2: string;
}

const FALLBACK: BrandColors = {
  accent: "#ef4444",
  ink: "#f4f2ed",
  rule2: "rgba(244,242,236,0.18)",
};

function read(): BrandColors {
  if (typeof window === "undefined") return FALLBACK;
  const cs = getComputedStyle(document.documentElement);
  return {
    accent: cs.getPropertyValue("--accent").trim() || FALLBACK.accent,
    ink: cs.getPropertyValue("--ink").trim() || FALLBACK.ink,
    rule2: cs.getPropertyValue("--rule-2").trim() || FALLBACK.rule2,
  };
}

/**
 * Canvas/WebGL components resolve colors through fillStyle — CSS variables
 * don't work there. This hook reads the real computed values off :root and
 * re-reads whenever data-theme flips (MutationObserver), per spec 5B.2.9.
 *
 * The initial read happens in the state initializer rather than in an effect:
 * the blocking theme script in layout.tsx has already set `data-theme` before
 * hydration, so the very first client paint gets the *correct* theme's colors
 * instead of one frame of the dark-theme fallback.
 */
export function useBrandColors(): BrandColors {
  const [colors, setColors] = useState<BrandColors>(read);

  useEffect(() => {
    const sync = () => setColors(read());
    sync(); // covers the SSR pass, where read() returned FALLBACK
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return colors;
}
