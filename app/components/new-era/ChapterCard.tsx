"use client";

import type { ReactNode } from "react";
import LiquidGlass from "../LiquidGlass";
import { useLang } from "../../lib/i18n";
import type { Chapter } from "../../new-era/content";

/**
 * The chapter motif, shared by the intro (Scene 4) and the /new-era bento so
 * both experiences read as one story.
 */
export default function ChapterCard({
  chapter,
  icon,
  as,
  className = "",
  compact = false,
}: {
  chapter: Chapter;
  icon?: ReactNode;
  /** Render as a link/section wrapper when the caller needs one. */
  as?: React.ElementType;
  className?: string;
  compact?: boolean;
}) {
  const { t } = useLang();
  // The distinctive word gets the serif italic accent, as elsewhere on the site.
  const accent = chapter.accent;
  const name = t(chapter.name);
  const idx = accent ? name.indexOf(accent) : -1;

  return (
    <LiquidGlass
      as={as ?? "div"}
      variant="primary"
      radius={18}
      className={`ne-card${compact ? " is-compact" : ""} ${className}`.trim()}
    >
      <div className="ne-card-top">
        <span className="ne-num" aria-hidden="true">{chapter.n}</span>
        <span className="ne-label">{t(chapter.label)}</span>
      </div>

      {icon ? <span className="ne-card-icon" aria-hidden="true">{icon}</span> : null}

      <span className="ne-card-name">
        {idx >= 0 ? (
          <>
            {name.slice(0, idx)}
            <em>{name.slice(idx, idx + accent!.length)}</em>
            {name.slice(idx + accent!.length)}
          </>
        ) : (
          name
        )}
      </span>

      <span className="ne-card-summary">{t(chapter.summary)}</span>

      {chapter.chip ? <span className="ne-chip">{t(chapter.chip)}</span> : null}
    </LiquidGlass>
  );
}
