"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@solar-icons/react/linear";
import Reveal from "../Reveal";
import { useLang } from "../../lib/i18n";
import { NEW_ERA } from "../../new-era/content";

/**
 * Compact New Era band on the homepage.
 *
 * Deliberately a teaser, not a second copy of /new-era: the title, the four
 * chapter names in one line, and a link through to the full story.
 */
export default function NewEraSection() {
  const { t } = useLang();

  return (
    <section id="new-era" className="section alt ne-band">
      <div className="wrap">
        <Reveal>
          <Link href="/new-era" className="ne-band-inner">
            <div className="ne-band-copy">
              <span className="kicker ne-band-kicker">
                <span className="launch-dot" aria-hidden="true" />
                {t(NEW_ERA.kicker)}
              </span>
              <h2 className="sec-title ne-band-title">
                {t("New Era").replace(t("Era"), "")}
                <em>{t("Era")}</em>.
              </h2>
              <p className="ne-band-headline">{t(NEW_ERA.headline)}</p>
            </div>

            <ol className="ne-band-list">
              {NEW_ERA.chapters.map((c) => (
                <li key={c.id}>
                  <span className="ne-num">{c.n}</span>
                  <span className="ne-band-name">{t(c.name)}</span>
                </li>
              ))}
            </ol>

            <span className="ne-band-cta">
              {t("Explore the chapters")}
              <ArrowRightIcon size={16} className="icon-mirror" />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
