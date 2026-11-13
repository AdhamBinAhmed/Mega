"use client";

import { useEffect, useState } from "react";
import CircularText from "./reactbits/CircularText";
import { useLang } from "../lib/i18n";

/**
 * Fixed top-right rotating wordmark badge (5B.2.5). Pure decoration: sits
 * BEHIND content (z 0), never intercepts the pointer.
 *
 * It originally hid below 768px because it clashed with the old top-right
 * menu toggle. The phone chrome is a bottom dock now, so the top corner is
 * free — the badge shows at every width, just smaller on phones.
 */
export default function BackgroundBadge() {
  const { t, lang } = useLang();
  const [phone, setPhone] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setPhone(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // CircularText splits by character, which breaks Arabic letter joining —
  // the Latin wordmark is used for both languages (i18n key kept for parity).
  const text = lang === "ar" ? "MEGA DEVS • WE SHIP FAST • " : t("MEGA DEVS • WE SHIP FAST • ");

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: phone ? 20 : 96,
        insetInlineEnd: phone ? 10 : 24,
        zIndex: "var(--z-badge, 0)" as unknown as number,
        pointerEvents: "none",
        opacity: phone ? 0.4 : 0.55,
        fontFamily: "var(--font-mono)",
        textTransform: "uppercase",
      }}
    >
      <CircularText
        text={text}
        spinDuration={24}
        onHover="speedUp"
        size={phone ? 104 : 150}
        fontSize={phone ? 10 : 14}
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
