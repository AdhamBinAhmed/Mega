"use client";

import { useEffect, useState } from "react";

export interface BrandColors {
  accent: string;
  ink: string;
  rule2: string;
  /** Accent mixed 25% toward white — the hairline on filled brand buttons. */
  accentSoft: string;
}

/** Dark-theme values. Used for SSR and the first client render so the markup
 *  React hydrates matches exactly; the effect then syncs the real theme. */
const FALLBACK: BrandColors = {
  accent: "#ef4444",
  ink: "#f4f2ed",
  rule2: "rgba(244,242,236,0.18)",
  accentSoft: "#f47c7c",
};

/** Mix a hex color toward white by `amount` (0..1). */
function lighten(hex: string, amount: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function read(): BrandColors {
  const cs = getComputedStyle(document.documentElement);
  const accent = cs.getPropertyValue("--accent").trim() || FALLBACK.accent;
  return {
    accent,
    ink: cs.getPropertyValue("--ink").trim() || FALLBACK.ink,
    rule2: cs.getPropertyValue("--rule-2").trim() || FALLBACK.rule2,
    accentSoft: lighten(accent, 0.25),
  };
}

/**
 * Canvas/WebGL components resolve colors through a canvas `fillStyle`, so CSS
 * variables cannot be passed to them. This hook reads the computed values off
 * :root and re-reads whenever `data-theme` flips (MutationObserver).
 *
 * It intentionally starts from the dark-theme FALLBACK rather than reading
 * during render: the values land in inline `style` attributes, so reading the
 * live theme on the first client render would differ from the server HTML and
 * trip a hydration mismatch. The effect corrects the colors immediately after.
 */
export function useBrandColors(): BrandColors {
  const [colors, setColors] = useState<BrandColors>(FALLBACK);

  useEffect(() => {
    const sync = () => setColors(read());
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return colors;
}
