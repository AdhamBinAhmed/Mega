"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@solar-icons/react/linear";
import LiquidGlass from "../LiquidGlass";
import { useLang } from "../../lib/i18n";
import { NEW_ERA } from "../../new-era/content";

/**
 * Hero announcement pill. Sits above the headline (which is untouched) and
 * leads to the full New Era story.
 */
export default function LaunchPill() {
  const { t } = useLang();

  return (
    <LiquidGlass
      as={motion(Link)}
      href="/new-era"
      variant="floating"
      radius={999}
      className="launch-pill"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="launch-dot" aria-hidden="true" />
      <span>{t(NEW_ERA.kicker)} {t(NEW_ERA.title)}</span>
      <ArrowRightIcon size={14} className="icon-mirror" />
    </LiquidGlass>
  );
}
