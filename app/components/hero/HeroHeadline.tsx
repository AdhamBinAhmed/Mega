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
 *  AR: all three lines render as the original spans — TechText splits text per
 *      character, which breaks Arabic letter joining.
 * The real headline text always exists for SEO/screen readers in an sr-only span.
 * Each canvas wrapper is aria-hidden, which also removes TechText's internal
 * role="img"/aria-label from the a11y tree (no duplicate headline announced),
 * so the component needs no source edit.
 */
export default function HeroHeadline() {
  const { t, lang, dir } = useLang();
  const brand = useBrandColors();
  const [canCanvas, setCanCanvas] = useState(false);

  useEffect(() => {
    // Canvas text is an enhancement: only swap in after mount (never during SSR).
    setCanCanvas(true);
  }, []);

  const useTech = canCanvas && lang !== "ar";

  return (
    <motion.h1 className="hero-title" variants={wrapper} initial="hidden" animate="show">
      <span className="sr-only">
        {t("We Ship.")} {t("Fast.")} {t("Always.")}
      </span>

      {useTech ? (
        <>
          <motion.span variants={line} className="hero-tt hero-tt--ink" aria-hidden="true">
            <TechText
              text={t("We Ship.")}
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
              labels
            />
          </motion.span>
          <motion.span variants={line} className="hero-tt hero-tt--accent" aria-hidden="true">
            <TechText
              text={t("Fast.")}
              color="currentColor"
              /* Frame/specks must read against the red fill → use ink. */
              accentColor={brand?.ink || "#f4f2ed"}
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
              labels
            />
          </motion.span>
        </>
      ) : (
        <>
          <motion.span variants={line} aria-hidden="true">{t("We Ship.")}</motion.span>
          <motion.span variants={line} className="accent" aria-hidden="true">{t("Fast.")}</motion.span>
        </>
      )}

      {/* Line 3 is an outline treatment TechText cannot draw — CSS stays. */}
      <motion.span variants={line} className="outline" aria-hidden="true">{t("Always.")}</motion.span>
    </motion.h1>
  );
}
