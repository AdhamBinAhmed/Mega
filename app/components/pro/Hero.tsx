"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect } from "react";
import { FiArrowDown } from "react-icons/fi";
import type { Identity } from "./proData";

const ease = [0.22, 1, 0.36, 1] as const;

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "•"
  );
}

export default function Hero({ identity }: { identity: Identity }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });

  // layered depth — bigger range = closer to viewer
  const nameX = useTransform(sx, [0, 1], [26, -26]);
  const nameY = useTransform(sy, [0, 1], [18, -18]);
  const roleX = useTransform(sx, [0, 1], [14, -14]);
  const roleY = useTransform(sy, [0, 1], [10, -10]);
  const avaX = useTransform(sx, [0, 1], [-10, 10]);
  const avaY = useTransform(sy, [0, 1], [-8, 8]);
  const rotY = useTransform(sx, [0, 1], [8, -8]);
  const rotX = useTransform(sy, [0, 1], [-6, 6]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  return (
    <header className="scene relative min-h-[88vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY }}
        className="preserve-3d flex flex-col items-center"
      >
        {/* avatar */}
        <motion.div
          style={{ x: avaX, y: avaY }}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="relative mb-8"
        >
          <div className="absolute -inset-6 rounded-full bg-[var(--halo)] blur-3xl opacity-40 animate-pulse" />
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-[2px] bg-gradient-to-br from-[var(--violet)] via-[var(--indigo)] to-[var(--cyan)]">
            <div className="relative w-full h-full rounded-full overflow-hidden bg-[var(--bg-2)] grid place-items-center">
              {identity.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={identity.photoUrl}
                  alt={identity.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-display text-2xl font-bold text-[var(--text)]">
                  {initials(identity.name)}
                </span>
              )}
            </div>
          </div>
          <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[var(--bg)] grid place-items-center">
            <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
          </span>
        </motion.div>

        {/* eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease }}
          className="mb-4 text-xs sm:text-sm tracking-[0.35em] uppercase text-[var(--muted)] font-mono"
        >
          Hello, I&apos;m
        </motion.p>

        {/* name — the closest, most-parallaxed layer */}
        <motion.h1
          style={{ x: nameX, y: nameY }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          className="shimmer glow-violet font-display font-extrabold tracking-tight leading-[0.95]
            text-[clamp(2.75rem,12vw,7rem)]"
        >
          {identity.name}
        </motion.h1>

        {/* role */}
        {identity.role && (
          <motion.p
            style={{ x: roleX, y: roleY }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease }}
            className="mt-5 text-lg sm:text-2xl text-[var(--text)]/85 max-w-xl"
          >
            {identity.role}
          </motion.p>
        )}
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="absolute bottom-8 flex flex-col items-center gap-2 text-[var(--dim)]"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">Explore</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <FiArrowDown />
        </motion.span>
      </motion.div>
    </header>
  );
}
