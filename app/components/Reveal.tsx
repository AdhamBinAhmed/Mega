"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import AnimatedContent from "./reactbits/AnimatedContent";

/**
 * House scroll-reveal (5B.2.8). Wraps AnimatedContent with the brand motion
 * settings so every section on /, /history, /works, /palestine reveals the
 * same way — calmer than the component's demo defaults.
 */
export default function Reveal({
  children,
  stagger,
  calm = false,
  className,
}: {
  children: ReactNode;
  /** Set for grids/lists so children cascade (0.08 house value). */
  stagger?: number;
  /** /palestine: no blur, shorter travel, slower. */
  calm?: boolean;
  className?: string;
}) {
  return (
    <AnimatedContent
      distance={calm ? 24 : 40}
      direction="vertical"
      duration={calm ? 1 : 0.8}
      ease="power3.out"
      blur={calm ? 0 : 6}
      threshold={0.15}
      once
      stagger={stagger}
      className={className}
    >
      {children}
    </AnimatedContent>
  );
}

/**
 * ScrollTrigger measures layout once; webfont swaps and client-side route
 * changes move everything, so positions must be recomputed afterwards.
 */
export function RevealRefresher() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (!cancelled) ScrollTrigger.refresh();
    };
    // After route change (next paint) and after fonts settle.
    const id = window.setTimeout(refresh, 120);
    document.fonts?.ready.then(refresh).catch(() => {});
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [pathname]);

  return null;
}
