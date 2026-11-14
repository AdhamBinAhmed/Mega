"use client";

import { useEffect, useState } from "react";
import { useLang } from "../lib/i18n";
import { NEW_ERA } from "./content";

/**
 * Sticky chapter rail (desktop). Tracks the section in view and doubles as a
 * reading-progress indicator for chapters 01–04.
 */
export default function ChapterIndex() {
  const { t } = useLang();
  const [active, setActive] = useState<string>(NEW_ERA.chapters[0].id);

  useEffect(() => {
    const sections = NEW_ERA.chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const activeIndex = NEW_ERA.chapters.findIndex((c) => c.id === active);

  return (
    <nav className="ne-index" aria-label={t("The chapters")}>
      {NEW_ERA.chapters.map((c, i) => (
        <a
          key={c.id}
          href={`#${c.id}`}
          className={`ne-index-item${c.id === active ? " is-on" : ""}`}
          aria-current={c.id === active ? "true" : undefined}
        >
          <span className="ne-index-n">{c.n}</span>
          <span className="ne-index-label">{t(c.name)}</span>
          {i <= activeIndex ? <span className="ne-index-fill" aria-hidden="true" /> : null}
        </a>
      ))}
    </nav>
  );
}
