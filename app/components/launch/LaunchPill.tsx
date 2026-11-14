"use client";

import { motion } from "framer-motion";
import { ArrowRightIcon } from "@solar-icons/react/linear";
import LiquidGlass from "../LiquidGlass";
import { useLang } from "../../lib/i18n";

/**
 * Hero announcement pill. Sits above the headline (which is untouched) and
 * jumps to the launch section.
 */
export default function LaunchPill() {
  const { t } = useLang();

  const jump = () => {
    const el = document.getElementById("new-era");
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    history.replaceState(null, "", "#new-era");
  };

  return (
    <LiquidGlass
      as={motion.button}
      variant="floating"
      radius={999}
      className="launch-pill"
      type="button"
      onClick={jump}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="launch-dot" aria-hidden="true" />
      <span>{t("Introducing the new MEGA Devs")}</span>
      <ArrowRightIcon size={14} className="icon-mirror" />
    </LiquidGlass>
  );
}
