"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ShieldCheckIcon,
  Widget5Icon,
  SmartphoneIcon,
  UsersGroupRoundedIcon,
  ArrowRightUpIcon,
  PlayCircleIcon,
  MagnifierIcon,
  BugIcon,
  UserCheckRoundedIcon,
  Code2Icon,
  ServerIcon,
  LockKeyholeIcon,
  PaletteIcon,
  TransferHorizontalIcon,
  CalculatorIcon,
  QrCodeIcon,
} from "@solar-icons/react/linear";
import LiquidGlass from "../components/LiquidGlass";
import Reveal from "../components/Reveal";
import ChapterCard from "../components/new-era/ChapterCard";
import { useLang } from "../lib/i18n";
import { NEW_ERA, type ChapterId } from "./content";

const TOOL_ICONS: Record<string, React.ComponentType<{ size?: number | string }>> = {
  MagnifierIcon,
  BugIcon,
  UserCheckRoundedIcon,
  Code2Icon,
  ServerIcon,
  LockKeyholeIcon,
  PaletteIcon,
  TransferHorizontalIcon,
  CalculatorIcon,
  QrCodeIcon,
};

const CHAPTER_ICONS: Record<ChapterId, React.ComponentType<{ size?: number | string }>> = {
  cyber: ShieldCheckIcon,
  tools: Widget5Icon,
  megaos: SmartphoneIcon,
  team: UsersGroupRoundedIcon,
};

/** Title with the serif-italic accent word, matching the site's sec-title pattern. */
function EraTitle({ className = "" }: { className?: string }) {
  const { t } = useLang();
  return (
    <span className={className}>
      {t("New Era").replace(t("Era"), "")}
      <em>{t("Era")}</em>.
    </span>
  );
}

/** External link with the "opens in a new tab" affordance and announcement. */
function ExternalCta({ href, label }: { href: string; label: string }) {
  const { t } = useLang();
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-solid"
      aria-label={`${label} (${t("opens in a new tab")})`}
    >
      <span>{label}</span>
      <ArrowRightUpIcon size={16} className="icon-mirror" />
    </a>
  );
}

/* ── 1. Hero ─────────────────────────────────────────────────────────────── */
export function NeHero({ onReplay }: { onReplay: () => void }) {
  const { t } = useLang();
  return (
    <header className="ne-hero" id="top">
      <div className="wrap">
        <div className="kicker ne-hero-kicker">
          <span className="launch-dot" aria-hidden="true" />
          {t(NEW_ERA.kicker)}
        </div>
        <h1 className="ne-title">
          <EraTitle />
        </h1>
        <p className="ne-headline">{t(NEW_ERA.headline)}</p>
        <p className="ne-dek">{t(NEW_ERA.dek)}</p>
        <div className="ne-hero-cta">
          <a href="#chapters" className="btn-solid">
            <span>{t("Explore the chapters")}</span>
          </a>
          <button type="button" className="btn-line" onClick={onReplay}>
            <PlayCircleIcon size={18} />
            <span>{t("Replay the introduction")}</span>
          </button>
        </div>
      </div>
      <div className="ne-hero-rule" aria-hidden="true">
        <span>2026</span>
        <i />
        <span>2027</span>
      </div>
    </header>
  );
}

/* ── 2. Chapter overview ─────────────────────────────────────────────────── */
export function NeChapters() {
  const { t } = useLang();
  return (
    <section id="chapters" className="section">
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <div className="sec-head-r">
              <div className="sec-head-top">
                <span className="kicker">{t("The chapters")}</span>
                <div className="rule" />
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal stagger={0.08} className="ne-bento">
          {NEW_ERA.chapters.map((c) => {
            const Icon = CHAPTER_ICONS[c.id];
            return (
              <a key={c.id} href={`#${c.id}`} className={`ne-bento-item is-${c.id}`}>
                <ChapterCard chapter={c} icon={<Icon size={30} />} />
              </a>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

/* ── 3. MEGA Cyber ───────────────────────────────────────────────────────── */
export function NeCyber() {
  const { t } = useLang();
  const c = NEW_ERA.chapters[0];
  return (
    <section id="cyber" className="section alt ne-chapter">
      <div className="wrap ne-split">
        <Reveal>
          <div>
            <div className="sec-head-top">
              <span className="kicker">{c.n} — {t(c.label)}</span>
              <div className="rule" />
            </div>
            <h2 className="sec-title">
              MEGA <em>Cyber</em>
            </h2>
            <p className="ne-body">{t(c.summary)}</p>
            <div className="ne-cta-row">
              <ExternalCta href={c.href!} label={t("Visit MEGA Cyber")} />
            </div>
          </div>
        </Reveal>
        {/* Abstract scan-line over a wireframe browser — CSS only. */}
        <Reveal>
          <div className="ne-scan" aria-hidden="true">
            <div className="ne-scan-bar">
              <i /><i /><i />
            </div>
            <div className="ne-scan-body">
              <span className="ne-scan-row" /><span className="ne-scan-row short" />
              <span className="ne-scan-row" /><span className="ne-scan-row short" />
              <span className="ne-scan-row" />
              <span className="ne-scan-line" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 4. MEGA Tools ───────────────────────────────────────────────────────── */
export function NeTools() {
  const { t } = useLang();
  const c = NEW_ERA.chapters[1];
  return (
    <section id="tools" className="section ne-chapter">
      <div className="wrap">
        <Reveal>
          <div className="sec-head-top">
            <span className="kicker">{c.n} — {t(c.label)}</span>
            <div className="rule" />
          </div>
          <div className="ne-tools-head">
            <h2 className="sec-title">
              MEGA <em>Tools</em>
            </h2>
            <div className="ne-stat">
              <span className="ne-stat-n">10+</span>
              <span className="ne-stat-l">
                {t("free developer tools")}
                <br />
                {t("one platform, just sign in")}
              </span>
            </div>
          </div>
          <p className="ne-body">{t(c.summary)}</p>
        </Reveal>

        <Reveal stagger={0.06} className="ne-tools-grid">
          {NEW_ERA.tools.map((tool) => {
            const Icon = TOOL_ICONS[tool.icon] ?? Widget5Icon;
            return (
              <LiquidGlass key={tool.name} variant="subtle" radius={14} className="ne-tool">
                <span className="ne-tool-icon" aria-hidden="true"><Icon size={22} /></span>
                <span className="ne-tool-name">{tool.name}</span>
                <span className="ne-tool-blurb">{t(tool.blurb)}</span>
              </LiquidGlass>
            );
          })}
        </Reveal>

        <Reveal className="ne-cta-row">
          <ExternalCta href={c.href!} label={t("Open MEGA Tools")} />
        </Reveal>
      </div>
    </section>
  );
}

/* ── 5. Redesign & MegaOS ────────────────────────────────────────────────── */
function Countdown() {
  const { t } = useLang();
  // Starts null so SSR and the first client render agree.
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    const ms = new Date(NEW_ERA.returnsAt).getTime() - Date.now();
    setDays(Math.max(0, Math.ceil(ms / 86_400_000)));
  }, []);
  if (days === null) return <span className="ne-count" aria-hidden="true" />;
  if (days === 0) return <span className="ne-count">{t("MegaOS is back")}</span>;
  return (
    <span className="ne-count">
      <b>{days.toLocaleString()}</b> {t("days until MegaOS returns")}
    </span>
  );
}

export function NeMegaOS() {
  const { t } = useLang();
  const c = NEW_ERA.chapters[2];
  return (
    <section id="megaos" className="section alt ne-chapter">
      <div className="wrap">
        <Reveal>
          <div className="sec-head-top">
            <span className="kicker">{c.n} — {t(c.label)}</span>
            <div className="rule" />
          </div>
          <h2 className="sec-title">
            Mega<em>OS</em>
          </h2>
          <p className="ne-body">{t(c.summary)}</p>
        </Reveal>

        <Reveal className="ne-revival">
          {NEW_ERA.revival.map((step) => (
            <div key={step.when} className={`ne-revival-step${step.highlight ? " is-on" : ""}`}>
              <span className="ne-revival-dot" aria-hidden="true" />
              <span className="ne-revival-when">{t(step.when)}</span>
              <span className="ne-revival-what">{t(step.what)}</span>
            </div>
          ))}
        </Reveal>

        <Reveal className="ne-cta-row">
          <Countdown />
          <ExternalCta href={c.href!} label={t("See the new MegaOS")} />
        </Reveal>
      </div>
    </section>
  );
}

/* ── 6. Team restructuring ───────────────────────────────────────────────── */
export function NeTeam() {
  const { t } = useLang();
  const c = NEW_ERA.chapters[3];
  return (
    <section id="team" className="section ne-chapter">
      <div className="wrap">
        <Reveal>
          <div className="sec-head-top">
            <span className="kicker">{c.n} — {t(c.label)}</span>
            <div className="rule" />
          </div>
          <h2 className="sec-title">
            A new <em>structure</em>
          </h2>
          <p className="ne-body">{t(c.summary)}</p>
        </Reveal>

        {/* Units only — no names or roles. */}
        <Reveal stagger={0.08} className="ne-org">
          {NEW_ERA.units.map((u) => (
            <LiquidGlass key={u.name} variant="subtle" radius={14} className="ne-org-unit">
              <span className="ne-org-name">{u.name}</span>
              <span className="ne-org-note">{t(u.note)}</span>
            </LiquidGlass>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ── 7. Closing vision ───────────────────────────────────────────────────── */
export function NeVision() {
  const { t } = useLang();
  return (
    <section id="vision" className="section alt ne-vision">
      <div className="wrap">
        <Reveal>
          <h2 className="ne-vision-title">
            <span className="launch-line">{t("A New Era.")}</span>
            <span className="launch-line">
              A New <em>MEGA</em>.
            </span>
          </h2>
          <div className="ne-vision-links">
            {NEW_ERA.chapters
              .filter((c) => c.href)
              .map((c) => (
                <a
                  key={c.id}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ne-vision-link"
                  aria-label={`${t(c.name)} (${t("opens in a new tab")})`}
                >
                  {t(c.name)}
                  <ArrowRightUpIcon size={14} className="icon-mirror" />
                </a>
              ))}
          </div>
          <div className="ne-cta-row">
            <Link href="/" className="btn-solid">
              <span>{t("Back to MEGA Devs")}</span>
            </Link>
            <Link href="/#contact" className="btn-line">
              <span>{t("Start a Project")}</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
