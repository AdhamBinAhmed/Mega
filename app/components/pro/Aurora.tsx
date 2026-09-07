"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";

export default function Aurora() {
  const rootRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 40, damping: 20 });
  const sy = useSpring(my, { stiffness: 40, damping: 20 });

  const x1 = useTransform(sx, [0, 1], [24, -24]);
  const y1 = useTransform(sy, [0, 1], [24, -24]);
  const x2 = useTransform(sx, [0, 1], [-30, 30]);
  const y2 = useTransform(sy, [0, 1], [-30, 30]);

  useEffect(() => {
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const px = e.clientX / window.innerWidth;
      const py = e.clientY / window.innerHeight;
      mx.set(px);
      my.set(py);
      // update CSS torch/spotlight position (throttled to a frame)
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          const el = rootRef.current;
          if (el) {
            el.style.setProperty("--mx", `${px * 100}%`);
            el.style.setProperty("--my", `${py * 100}%`);
          }
        });
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mx, my]);

  return (
    <>
      <div ref={rootRef} className="ambient">
        <div className="aurora">
          <motion.div className="aurora-blob blob-a" style={{ x: x1, y: y1 }} />
          <motion.div className="aurora-blob blob-b" style={{ x: x2, y: y2 }} />
          <motion.div className="aurora-blob blob-c" style={{ x: x1, y: y2 }} />
        </div>
        <div className="starfield" />
        <div className="torch" />
        <div className="spotlight" />
        <div className="vignette" />
      </div>
      <div className="grain" />
    </>
  );
}
