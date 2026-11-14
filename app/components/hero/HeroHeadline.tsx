"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TechText from "../reactbits/TechText";
import { useLang } from "../../lib/i18n";
import { useBrandColors } from "../../lib/useBrandColors";

const line = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, damping: 22, stiffness: 120 } },
};

const wrapper = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

/**
 * Hero headline (5B.2.3).
 *  EN: lines 1–2 are TechText canvases (same font/weight/tracking/colors as the
 *      CSS headline); line 3 keeps the CSS outline treatment TechText can't draw.
 *  AR: all three lines stay real text (TechText splits per character, which
 *      breaks Arabic letter joining) and get an equivalent CSS outline→ink
 *      reveal that animates the whole run, so shaping is preserved.
 * The real headline text always exists for SEO/screen readers in an sr-only span.
 * Each canvas wrapper is aria-hidden, which also removes TechText's internal
 * role="img"/aria-label from the a11y tree (no duplicate headline announced),
 * so the component needs no source edit.
 */
export default function HeroHeadline() {
  const { t, lang, dir } = useLang();
  const brand = useBrandColors();
  const [canCanvas, setCanCanvas] = useState(false);
  const [phone, setPhone] = useState(false);

  useEffect(() => {
    // Canvas text is an enhancement: only swap in after mount (never during SSR).
    setCanCanvas(true);
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setPhone(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Phones get the CSS outline→ink reveal instead: two full-width canvases
  // with the autonomous lens sweep repaint continuously and are the single
  // biggest frame cost on mid-range phones.
  const useTech = canCanvas && lang !== "ar" && !phone;

  return (
    <motion.h1 className="hero-title" variants={wrapper} initial="hidden" animate="show">
      <span className="sr-only">
        {t("We Ship.")} {t("Fast.")} {t("Always.")}
      </span>

      {useTech ? (
        <>
          <motion.span variants={line} className="hero-tt hero-tt--ink" aria-hidden="true">
            <TechText
              /* .hero-title is uppercase; a canvas cannot inherit text-transform. */
              text={t("We Ship.").toUpperCase()}
              color="currentColor"
              accentColor="currentColor"
              fontFamily=""
              fontWeight={700}
              fontSize={208}
              letterSpacing={-0.055}
              align={dir === "rtl" ? "right" : "left"}
              reveal="letter"
              dashLength={4}
              dashGap={2}
              specks={15}
              intro="none"
              clickKick
              draggable
              guides={false}
              sweep
              labels={false}
              selection={false}
            />
          </motion.span>
          <motion.span variants={line} className="hero-tt hero-tt--accent" aria-hidden="true">
            <TechText
              text={t("Fast.").toUpperCase()}
              color="currentColor"
              /* Frame/specks must read against the red fill → use ink. */
              accentColor={brand.ink}
              fontFamily=""
              fontWeight={700}
              fontSize={208}
              letterSpacing={-0.055}
              align={dir === "rtl" ? "right" : "left"}
              reveal="letter"
              dashLength={4}
              dashGap={2}
              specks={15}
              intro="none"
              clickKick
              draggable
              guides={false}
              sweep
              labels={false}
              selection={false}
            />
          </motion.span>
        </>
      ) : (
        <>
          {/* Arabic + phones: same entrance + outline→ink reveal on real text
              (keeps Arabic shaping; saves two live canvases on phones). */}
          <motion.span variants={line} className="hero-ar" aria-hidden="true">{t("We Ship.")}</motion.span>
          <motion.span variants={line} className="hero-ar hero-ar--accent" aria-hidden="true">{t("Fast.")}</motion.span>
        </>
      )}

      {/* Line 3 is an outline treatment TechText cannot draw — CSS stays. */}
      <motion.span variants={line} className="outline" aria-hidden="true">{t("Always.")}</motion.span>
    </motion.h1>
  );
}
