"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloseCircleIcon,
  PauseIcon,
  PlayIcon,
  AltArrowLeftIcon,
  AltArrowRightIcon,
} from "@solar-icons/react/linear";
import LiquidGlass from "../LiquidGlass";
import ChapterCard from "./ChapterCard";
import { useLang } from "../../lib/i18n";
import { NEW_ERA } from "../../new-era/content";
import { markSeen } from "../../lib/newEraIntro";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * Scene timings in ms. Mobile and reduced-motion variants derive from this one
 * table so the three versions can never drift apart.
 */
const TIMELINE = {
  ident: 600,     // scene 1 starts
  title: 2200,    // scene 2
  message: 4000,  // scene 3
  chapters: 5400, // scene 4 starts
  perChapter: 1000,
  resolve: 9400,  // scene 5
  end: 10500,
};
const MOBILE_SCALE = 0.78; // ≈ 8s total

type Scene = 0 | 1 | 2 | 3 | 4 | 5;

export default function NewEraIntro({ onDone }: { onDone: () => void }) {
  const { t, dir } = useLang();
  const [scene, setScene] = useState<Scene>(0);
  const [chapter, setChapter] = useState(0);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [announce, setAnnounce] = useState("");
  const [visible, setVisible] = useState(true);

  const skipRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const timers = useRef<number[]>([]);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setScene(5);
    // Let the dissolve play before handing the page back.
    window.setTimeout(() => {
      setVisible(false);
      onDone();
    }, 420);
  }, [onDone]);

  useEffect(() => {
    markSeen();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    setStill(reduce);
    setMobile(isMobile);

    if (reduce) {
      // One static composition, auto-dismissed only if untouched.
      setScene(4);
      const id = window.setTimeout(finish, 4000);
      timers.current.push(id);
      return () => timers.current.forEach(clearTimeout);
    }

    const k = isMobile ? MOBILE_SCALE : 1;
    const at = (ms: number, fn: () => void) => {
      timers.current.push(window.setTimeout(fn, ms * k));
    };
    at(TIMELINE.ident, () => setScene(1));
    at(TIMELINE.title, () => setScene(2));
    at(TIMELINE.message, () => setScene(3));
    at(TIMELINE.chapters, () => setScene(4));
    NEW_ERA.chapters.forEach((_, i) => {
      if (i === 0) return;
      at(TIMELINE.chapters + i * TIMELINE.perChapter, () => setChapter(i));
    });
    at(TIMELINE.resolve, () => setScene(5));
    at(TIMELINE.end, finish);

    return () => timers.current.forEach(clearTimeout);
  }, [finish]);

  // Announce each chapter once.
  useEffect(() => {
    if (scene === 4) setAnnounce(NEW_ERA.chapters[chapter].name);
  }, [scene, chapter]);

  // Pause: freeze the remaining schedule.
  const togglePause = useCallback(() => {
    setPaused((p) => {
      if (!p) timers.current.forEach(clearTimeout);
      return !p;
    });
  }, []);

  const step = useCallback((delta: number) => {
    timers.current.forEach(clearTimeout);
    setPaused(true);
    setScene(4);
    setChapter((c) => Math.min(NEW_ERA.chapters.length - 1, Math.max(0, c + delta)));
  }, []);

  // Dialog behaviour: scroll lock, focus trap, Esc from the very first frame.
  useEffect(() => {
    openerRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => skipRef.current?.focus({ preventScroll: true }), 50);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); finish(); return; }
      if (e.key === " " || e.key === "Spacebar") { e.preventDefault(); togglePause(); return; }
      const forward = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
      const back = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
      if (e.key === forward) { e.preventDefault(); step(1); return; }
      if (e.key === back) { e.preventDefault(); step(-1); return; }
      if (e.key === "Tab") {
        const nodes = panelRef.current?.querySelectorAll<HTMLElement>("button");
        if (!nodes?.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = prevOverflow;
      openerRef.current?.focus?.({ preventScroll: true });
    };
  }, [finish, togglePause, step, dir]);

  const pct = Math.round(((chapter + 1) / NEW_ERA.chapters.length) * 100);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="ne-intro"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ne-intro-title"
          initial={{ opacity: 1 }}
          exit={still ? { opacity: 0 } : { opacity: 0, scale: 1.02, filter: "blur(8px)" }}
          transition={{ duration: still ? 0.16 : 0.42, ease: EASE_OUT }}
          ref={panelRef}
        >
          <div className="ne-intro-mesh paper-glow" aria-hidden="true" />

          <div className="ne-intro-stage">
            {/* Scene 1 — ident */}
            <motion.div
              className={`ne-intro-ident${scene >= 2 ? " is-corner" : ""}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: still ? 0.16 : 0.5, ease: EASE_OUT }}
            >
              <span className="launch-dot" aria-hidden="true" />
              <motion.img
                src="/dark_mode_img.jpg"
                alt=""
                aria-hidden="true"
                className="ne-intro-logo"
                initial={still ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: scene >= 1 ? 1 : 0, scale: 1 }}
                transition={{ duration: still ? 0.16 : 0.5, ease: EASE_OUT }}
              />
              {scene < 2 && <span className="ne-intro-kicker">{t(NEW_ERA.kicker)}</span>}
            </motion.div>

            {/* Scene 2 — title */}
            <AnimatePresence>
              {scene >= 2 && (
                <motion.h1
                  id="ne-intro-title"
                  className="ne-intro-title"
                  initial={still ? { opacity: 0 } : { opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: still ? 0.16 : 0.7, ease: EASE_OUT }}
                >
                  {t("New Era").replace(t("Era"), "")}
                  <em>{t("Era")}</em>.
                </motion.h1>
              )}
            </AnimatePresence>

            {/* Scene 3 — message */}
            <AnimatePresence>
              {scene >= 3 && (
                <motion.p
                  className="ne-intro-message"
                  initial={still ? { opacity: 0 } : { opacity: 0, filter: "blur(6px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: still ? 0.16 : 0.6, ease: EASE_OUT }}
                >
                  {t(NEW_ERA.headline)}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Scene 4 — chapters */}
            <AnimatePresence>
              {scene === 4 && (
                <motion.div
                  className="ne-intro-chapters"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: still ? 0.16 : 0.4 }}
                >
                  {still ? (
                    // Reduced motion: the whole story at once, no movement.
                    <ul className="ne-intro-list">
                      {NEW_ERA.chapters.map((c) => (
                        <li key={c.id}>
                          <span className="ne-num">{c.n}</span> {t(c.name)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    NEW_ERA.chapters.map((c, i) => {
                      const offset = i - chapter;
                      if (offset > 0 || offset < -2) return null;
                      return (
                        <motion.div
                          key={c.id}
                          className="ne-intro-chapter"
                          initial={{ opacity: 0, y: 28, scale: 0.97 }}
                          animate={{
                            opacity: offset === 0 ? 1 : 0.35,
                            y: mobile ? 0 : offset * -14,
                            scale: 1 + offset * 0.03,
                          }}
                          transition={{ duration: 0.55, ease: EASE_OUT }}
                          style={{ zIndex: 10 + offset }}
                        >
                          <ChapterCard chapter={c} compact />
                        </motion.div>
                      );
                    })
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scene 5 — resolve */}
            <AnimatePresence>
              {scene >= 5 && (
                <motion.div
                  className="ne-intro-resolve"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  {NEW_ERA.chapters.map((c) => t(c.name)).join(" · ")}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="sr-only" aria-live="polite">{announce}</p>

          {/* Controls */}
          <LiquidGlass variant="interactive" radius={999} className="ne-intro-controls">
            <button ref={skipRef} type="button" onClick={finish} aria-label={t("Skip")}>
              <CloseCircleIcon size={16} />
              <span>{t("Skip")}</span>
            </button>
            {!still && (
              <>
                <button type="button" onClick={togglePause} aria-label={paused ? t("Play") : t("Pause")}>
                  {paused ? <PlayIcon size={16} /> : <PauseIcon size={16} />}
                </button>
                <button type="button" onClick={() => step(-1)} aria-label={`${t("Chapter")} −`}>
                  <AltArrowLeftIcon size={16} className="icon-mirror" />
                </button>
                <button type="button" onClick={() => step(1)} aria-label={`${t("Chapter")} +`}>
                  <AltArrowRightIcon size={16} className="icon-mirror" />
                </button>
              </>
            )}
          </LiquidGlass>

          {!still && (
            <div
              className="ne-intro-progress"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={scene >= 4 ? pct : 0}
              aria-label={t("The chapters")}
            >
              {NEW_ERA.chapters.map((c, i) => (
                <span key={c.id} className={scene > 4 || (scene === 4 && i <= chapter) ? "is-on" : ""} />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
