"use client";

import { useLang } from "../lib/i18n";

/** Keyboard users jump straight past the fixed chrome to the page content. */
export default function SkipLink() {
  const { t } = useLang();
  return (
    <a href="#main-content" className="skip-link">
      {t("Skip to content")}
    </a>
  );
}
