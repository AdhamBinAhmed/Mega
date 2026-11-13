"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@solar-icons/react/linear";
import SpecularButton from "../reactbits/SpecularButton";
import { useLang } from "../../lib/i18n";
import { useBrandColors } from "../../lib/useBrandColors";

/**
 * Hero primary CTA — the "Start a Project" button, now a SpecularButton:
 * the same solid brand-red pill as `.btn-solid`, with a white specular edge
 * that tracks the cursor within 250px.
 *
 * It scrolls to #contact rather than navigating, so it stays a <button>
 * (never a <button> nested in an <a>). The 5px magnetic pull from
 * MagneticButton is reproduced on a wrapper so the feel is unchanged.
 */
export default function StartProjectButton() {
  const { t } = useLang();
  const brand = useBrandColors();
  const ref = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none) and (pointer: coarse)").matches);
  }, []);

  const onMouseMove = (e: React.MouseEvent) => {
    if (isTouch || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `translate(${x * 5}px, ${y * 5}px)`;
  };

  const onMouseLeave = () => {
    if (isTouch || !ref.current) return;
    ref.current.style.transform = "translate(0, 0)";
  };

  const goToContact = () => {
    const target = document.getElementById("contact");
    if (!target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    history.replaceState(null, "", "#contact");
  };

  return (
    <motion.div
      className="inline-block"
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div ref={ref} className="magnetic" onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
        <SpecularButton
          type="button"
          onClick={goToContact}
          size="md"
          radius={10}
          /* Resolved hex only — the shader converts colors via canvas fillStyle. */
          tint={brand.accent}
          tintOpacity={1}
          textColor="#ffffff"
          lineColor="#ffffff"
          baseColor={brand.accentSoft}
          intensity={1}
          idleIntensity={0.35}
          shineSize={10}
          shineFade={34}
          thickness={1.2}
          glow={1}
          followMouse
          proximity={250}
          blur={0}
          autoAnimate={false}
          className="btn-specular"
        >
          {t("Start a Project")}
          <ArrowRightIcon size={20} className="icon-mirror" />
        </SpecularButton>
      </div>
    </motion.div>
  );
}
