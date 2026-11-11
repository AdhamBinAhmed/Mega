"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Central framer-motion policy: every motion component in the tree honours the
 * user's prefers-reduced-motion setting (transform/layout animations are
 * skipped, opacity-only where possible).
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
