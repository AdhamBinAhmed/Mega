"use client";

import { useEffect, useRef, useState } from "react";
import { DESIGN_WIDTH, type CanvasElement } from "../lib/builderTypes";
import { ElementContent } from "./CanvasElementView";

// Read-only responsive stage for the public site: renders the fixed 1080px
// design canvas and scales it down to whatever width it's given, so a layout
// looks identical on every screen.
export default function CanvasStage({
  elements,
  canvasHeight,
}: {
  elements: CanvasElement[];
  canvasHeight: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / DESIGN_WIDTH);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const ordered = [...elements].sort((a, b) => a.z - b.z);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: DESIGN_WIDTH,
        margin: "0 auto",
        height: canvasHeight * scale,
      }}
    >
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
  );
}
