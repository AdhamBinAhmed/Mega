"use client";

import { useLang } from "../../lib/i18n";

/**
 * The launch line: "A New Era." / "A New MEGA." with MEGA in the site's
 * serif-italic accent (the same `sec-title` + <em> pattern used elsewhere).
 *
 * The two languages order the words differently, so the line is composed
 * per-language rather than by concatenating translated fragments.
 */
export default function LaunchLine({ className = "" }: { className?: string }) {
  const { t, lang } = useLang();
  return (
    <span className={className}>
      <span className="launch-line">{t("A New Era.")}</span>
      <span className="launch-line">
        {lang === "ar" ? (
          <>
            <em>MEGA</em> جديدة.
          </>
        ) : (
          <>
            A New <em>MEGA</em>.
          </>
        )}
      </span>
    </span>
  );
}
