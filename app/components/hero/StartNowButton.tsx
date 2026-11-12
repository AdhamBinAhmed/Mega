"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@solar-icons/react/linear";
import SpecularButton from "../reactbits/SpecularButton";
import { useLang } from "../../lib/i18n";
import { useBrandColors } from "../../lib/useBrandColors";

/**
 * Hero "Start Now" CTA (5B.2.9). Rendered as a real <Link> wrapping the
 * SpecularButton (button tabIndex=-1) so there is exactly one focusable
 * element and it keeps link semantics. Signed-in users land on /dashboard
 * via the /login redirect, same as before.
 */
export default function StartNowButton() {
  const { t } = useLang();
  const brand = useBrandColors();

  return (
    <Link href="/login" className="contents" aria-label={t("Start Now")}>
      <SpecularButton
        tabIndex={-1}
        size="md"
        radius={999}
        intensity={1}
        idleIntensity={0.35}
        shineSize={10}
        shineFade={34}
        thickness={1.2}
        glow={1}
        followMouse
        proximity={220}
        blur={0}
        /* Resolved hex only — the shader converts colors through canvas fillStyle. */
        lineColor={brand?.accent || "#ef4444"}
        baseColor={brand?.rule2 || "rgba(244,242,236,0.18)"}
        textColor={brand?.ink || "#f4f2ed"}
        tint={brand?.accent || "#ef4444"}
        tintOpacity={0.08}
        className="promo-specular"
      >
        {t("Start Now")}
        <ArrowRightIcon size={16} className="icon-mirror" />
      </SpecularButton>
    </Link>
  );
}
