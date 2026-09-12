"use client";

import { useEffect, useRef, useState } from "react";
import { DESIGN_WIDTH, MOBILE_BREAKPOINT, type CanvasElement } from "../lib/builderTypes";
import { ElementContent, MobileFlow } from "./CanvasElementView";

// Responsive stage for the public site.
//   • Wide screens: render the exact 1080px design, scaled to fit (never upscaled).
//   • Phones (< MOBILE_BREAKPOINT): reflow into a readable vertical stack so
//     nothing overlaps or shrinks into unreadability.
export default function CanvasStage({
  elements,
  canvasHeight,
}: {
  elements: CanvasElement[];
  canvasHeight: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(DESIGN_WIDTH);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isMobile = width < MOBILE_BREAKPOINT;
  const scale = Math.min(width / DESIGN_WIDTH, 1);
  const ordered = [...elements].sort((a, b) => a.z - b.z);

  return (
    <div ref={wrapRef} style={{ width: "100%", margin: "0 auto", maxWidth: isMobile ? "100%" : DESIGN_WIDTH }}>
      {isMobile ? (
        <MobileFlow elements={elements} width={width || MOBILE_BREAKPOINT} />
      ) : (
        <div style={{ position: "relative", width: "100%", height: canvasHeight * scale }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: DESIGN_WIDTH,
              height: canvasHeight,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            {ordered.map((el) => (
              <div
                key={el.id}
                style={{
                  position: "absolute",
                  left: el.x,
                  top: el.y,
                  width: el.w,
                  height: el.h,
                  transform: `rotate(${el.rotation}deg)`,
                  zIndex: el.z,
                }}
              >
                <ElementContent el={el} live />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
