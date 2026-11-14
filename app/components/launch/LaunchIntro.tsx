"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CloseCircleIcon } from "@solar-icons/react/linear";
import LiquidGlass from "../LiquidGlass";
import LaunchLine from "./LaunchLine";
import { useLang } from "../../lib/i18n";
import { isSubdomainHost } from "../../lib/appRoutes";
import { isFirstEverVisit } from "../../lib/firstVisit";

/** Hard ceiling — the overlay may never hold the page longer than this. */
const FULL_MS = 2400;
const REDUCED_MS = 900;
/** Marketing surfaces only: never over the app, the builder or user content. */
const INTRO_SEGMENTS = new Set(["", "works", "history"]);

export default function LaunchIntro() {
  const { t } = useLang();
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [still, setStill] = useState(false);
  const skipRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const seg = pathname.split("/")[1] || "";
    if (!INTRO_SEGMENTS.has(seg)) return;
    if (isSubdomainHost(window.location.hostname)) return;

    if (!isFirstEverVisit()) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStill(reduce);
    setShow(true);

    const id = window.setTimeout(() => setShow(false), reduce ? REDUCED_MS : FULL_MS);
    return () => window.clearTimeout(id);
  }, [pathname]);

  // Dialog behaviour: lock scroll, move focus to Skip, restore it on exit.
  useEffect(() => {
    if (!show) return;
    openerRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => skipRef.current?.focus({ preventScroll: true }), 60);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setShow(false);
      }
      // Single control: keep focus on Skip for the short time it is up.
      if (e.key === "Tab") e.preventDefault();
    };
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = prevOverflow;
      openerRef.current?.focus?.({ preventScroll: true });
    };
  }, [show]);

  // Reduced motion: no movement or blur anywhere, opacity only.
  const rise = still
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 24, filter: "blur(6px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
      };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="launch-intro"
          role="dialog"
          aria-modal="true"
          aria-label={t("Introducing the new MEGA Devs")}
          initial={{ opacity: 1 }}
          exit={still ? { opacity: 0 } : { opacity: 0, y: -16, filter: "blur(8px)" }}
          transition={{ duration: still ? 0.3 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Reuses the homepage ambient glow rather than a second mesh system. */}
          <motion.div
            className="paper-glow launch-intro-mesh"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: still ? 0.2 : 0.4 }}
            aria-hidden="true"
          />

          <div className="launch-intro-body">
            <motion.img
              src="/dark_mode_img.jpg"
              alt=""
              aria-hidden="true"
              className="launch-intro-logo"
              initial={still ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              animate={still ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              transition={{ duration: still ? 0.2 : 0.5, delay: still ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            />

            <motion.div
              className="launch-intro-kicker"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: still ? 0.2 : 0.4, delay: still ? 0 : 0.6 }}
            >
              <span className="launch-dot" aria-hidden="true" />
              {t("Introducing the new MEGA Devs")}
            </motion.div>

            <motion.div
              className="launch-intro-line"
              initial={rise.initial}
              animate={rise.animate}
              transition={{ duration: still ? 0.2 : 0.6, delay: still ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <LaunchLine className={still ? "" : "launch-line-sweep"} />
            </motion.div>
          </div>

          <LiquidGlass
            as={motion.button}
            variant="interactive"
            radius={999}
            className="launch-skip"
            ref={skipRef}
            type="button"
            onClick={() => setShow(false)}
            aria-label={t("Skip")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: still ? 0 : 0.5, duration: 0.3 }}
          >
            <CloseCircleIcon size={16} />
            <span>{t("Skip")}</span>
          </LiquidGlass>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
