"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Interactive spotlight (mandatory enhancement #2): a soft radial highlight
 * that follows the cursor across the wrapped region's cards.
 *
 * Implementation notes
 *  - one delegated pointermove per region (not per card), rAF-throttled;
 *  - writes CSS custom properties only — no React state, no re-renders;
 *  - listeners are never attached on coarse pointers or under reduced motion;
 *  - alpha is capped low (see --spot-strength in page CSS) so text contrast
 *    over the highlight is unchanged.
 */
export default function Spotlight({
  children,
  selector = ":scope > *",
  className,
}: {
  children: ReactNode;
  /** Which descendants receive the --mx/--my vars. */
  selector?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || still) return;

    let frame = 0;
    let pending: { el: HTMLElement; x: number; y: number } | null = null;

    const flush = () => {
      frame = 0;
      if (!pending) return;
      const { el, x, y } = pending;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      pending = null;
    };

    const onMove = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest<HTMLElement>(selector === ":scope > *" ? "*" : selector);
      const card =
        selector === ":scope > *"
          ? (Array.from(root.children) as HTMLElement[]).find((c) => c.contains(e.target as Node))
          : target && root.contains(target)
            ? target
            : undefined;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      pending = { el: card, x: e.clientX - rect.left, y: e.clientY - rect.top };
      card.setAttribute("data-spot", "");
      if (!frame) frame = requestAnimationFrame(flush);
    };

    const onLeave = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest<HTMLElement>("[data-spot]");
      card?.removeAttribute("data-spot");
    };

    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [selector]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
