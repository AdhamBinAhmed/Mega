"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ReactNode, useRef } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** max tilt in degrees */
  max?: number;
  /** lift toward viewer on hover, in px */
  lift?: number;
};

export default function TiltCard({
  children,
  className,
  max = 12,
  lift = 40,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const sx = useSpring(px, { stiffness: 220, damping: 20 });
  const sy = useSpring(py, { stiffness: 220, damping: 20 });

  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);

  // subtle magnetic pull toward the cursor
  const tx = useTransform(sx, [0, 1], [-8, 8]);
  const ty = useTransform(sy, [0, 1], [-8, 8]);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    px.set(x);
    py.set(y);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, x: tx, y: ty, transformStyle: "preserve-3d" }}
      whileHover={{ z: lift }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className={`group/tilt relative preserve-3d ${className ?? ""}`}
    >
      {children}
      <span className="glare" />
      <span className="card-ring" />
    </motion.div>
  );
}
