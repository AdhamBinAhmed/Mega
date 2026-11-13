"use client";

import { useEffect, useRef } from "react";

/**
 * Global custom cursor.
 *
 * Design: a small solid accent dot that tracks the pointer 1:1, plus a larger
 * outlined ring that trails it with spring easing. The ring expands and picks
 * up an accent tint over interactive targets, contracts on press, and both
 * parts fade out when the pointer leaves the window.
 *
 * Why this is global: `cursor: none` lives in a stylesheet that Next bundles
 * app-wide, so a homepage-only cursor element left every other route with no
 * visible pointer at all. The native cursor is now hidden *only* while this
 * component is mounted and active (it sets `data-cursor="custom"` on <html>),
 * so touch devices, reduced-motion users and JS-off all keep the real cursor.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || still.matches) return;

    const root = document.documentElement;
    root.setAttribute("data-cursor", "custom");

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let frame = 0;
    let visible = false;

    const INTERACTIVE = 'a,button,input,textarea,select,label,summary,[role="button"],[contenteditable="true"]';

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        rx = x;
        ry = y;
        root.setAttribute("data-cursor-on", "");
      }
      const over = (e.target as Element | null)?.closest?.(INTERACTIVE);
      ring.toggleAttribute("data-hot", !!over);
    };

    const onDown = () => ring.toggleAttribute("data-press", true);
    const onUp = () => ring.toggleAttribute("data-press", false);
    const onLeave = () => {
      visible = false;
      root.removeAttribute("data-cursor-on");
    };

    const tick = () => {
      // Ring lags the dot — simple exponential follow, no library needed.
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      root.removeAttribute("data-cursor");
      root.removeAttribute("data-cursor-on");
    };
  }, []);

  return (
    <div aria-hidden="true">
      <div ref={ringRef} className="mcursor-ring" />
      <div ref={dotRef} className="mcursor-dot" />
    </div>
  );
}
