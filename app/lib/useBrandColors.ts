"use client";

import { useEffect, useState } from "react";

export interface BrandColors {
  accent: string;
  ink: string;
  rule2: string;
}

/**
 * Canvas/WebGL components resolve colors through fillStyle — CSS variables
 * don't work there. This hook reads the real computed values off :root and
 * re-reads whenever data-theme flips (MutationObserver), per spec 5B.2.9.
 */
export function useBrandColors(): BrandColors | null {
  const [colors, setColors] = useState<BrandColors | null>(null);

  useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      setColors({
        accent: cs.getPropertyValue("--accent").trim() || "#ef4444",
        ink: cs.getPropertyValue("--ink").trim() || "#f4f2ed",
        rule2: cs.getPropertyValue("--rule-2").trim() || "rgba(244,242,236,0.18)",
      });
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return colors;
}
