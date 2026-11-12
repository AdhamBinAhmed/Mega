"use client";

import { useEffect, useState } from "react";
import CircularText from "./reactbits/CircularText";
import { useLang } from "../lib/i18n";

/**
 * Fixed top-right rotating wordmark badge (5B.2.5). Pure decoration: sits
 * BEHIND content (z 0), below the navbar, never intercepts the pointer.
 * Hidden <768px (would collide with the phone menu toggle).
 */
export default function BackgroundBadge() {
  const { t, lang } = useLang();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setShow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!show) return null;

  // CircularText splits by character, which breaks Arabic letter joining —
  // the Latin wordmark is used for both languages (i18n key kept for parity).
  const text = lang === "ar" ? "MEGA DEVS • WE SHIP FAST • " : t("MEGA DEVS • WE SHIP FAST • ");

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 96,
        insetInlineEnd: 24,
        zIndex: "var(--z-badge, 0)" as unknown as number,
        pointerEvents: "none",
        opacity: 0.55,
        fontFamily: "var(--font-mono)",
        textTransform: "uppercase",
      }}
    >
      <CircularText
        text={text}
        spinDuration={24}
        onHover="speedUp"
        size={150}
        fontSize={14}
        fontWeight={600}
        color="var(--ink-mute)"
        ring
        ringColor="var(--rule-2)"
      >
        <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--accent)" }} />
      </CircularText>
    </div>
  );
}
