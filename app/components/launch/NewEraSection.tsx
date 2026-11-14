"use client";

import Link from "next/link";
import {
  PaletteIcon,
  CommandIcon,
  Widget5Icon,
  TranslationIcon,
} from "@solar-icons/react/bold-duotone";
import LiquidGlass from "../LiquidGlass";
import Reveal from "../Reveal";
import LaunchLine from "./LaunchLine";
import StartProjectButton from "../hero/StartProjectButton";
import { useLang } from "../../lib/i18n";

/**
 * Launch section — "A New Era. A New MEGA."
 *
 * Every tile describes a change that actually shipped in this redesign (or, for
 * the builder, a real live feature). Nothing here is aspirational: no numbers,
 * no dates, no unreleased work.
 */
export default function NewEraSection() {
  const { t } = useLang();

  const tiles = [
    {
      Icon: PaletteIcon,
      title: t("New design"),
      body: t("A glass interface with light and dark themes."),
      href: null,
    },
    {
      Icon: CommandIcon,
      title: t("Command palette"),
      body: t("Jump anywhere with ⌘K — search, navigate, run actions."),
      href: null,
    },
    {
      Icon: Widget5Icon,
      title: t("Free portfolio builder"),
      body: t("Claim a subdomain and publish your profile."),
      href: "/login",
    },
    {
      Icon: TranslationIcon,
      title: t("Arabic & English"),
      body: t("Every page, fully translated and right-to-left."),
      href: null,
    },
  ];

  return (
    <section id="new-era" className="section alt">
      <div className="wrap">
        <Reveal>
          <div className="sec-head">
            <div className="sec-head-r">
              <div className="sec-head-top">
                <span className="kicker">
                  <span className="launch-dot" aria-hidden="true" />
                  {t("Introducing the new MEGA Devs")}
                </span>
                <div className="rule" />
              </div>
              <h2 className="sec-title new-era-title">
                <LaunchLine />
              </h2>
              <p className="new-era-dek">
                {t("Same two engineers from Cairo. A faster, sharper studio — rebuilt from the ground up.")}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal stagger={0.08} className="new-era-bento">
          {tiles.map(({ Icon, title, body, href }) => {
            const inner = (
              <>
                <span className="new-era-tile-icon" aria-hidden="true">
                  <Icon size={40} />
                </span>
                <span className="new-era-tile-title">{title}</span>
                <span className="new-era-tile-body">{body}</span>
              </>
            );
            return href ? (
              <LiquidGlass
                key={title}
                as={Link}
                href={href}
                variant="primary"
                radius={18}
                className="new-era-tile is-link"
              >
                {inner}
              </LiquidGlass>
            ) : (
              <LiquidGlass key={title} variant="primary" radius={18} className="new-era-tile">
                {inner}
              </LiquidGlass>
            );
          })}
        </Reveal>

        <Reveal className="new-era-cta">
          <StartProjectButton target="services" label={t("See what's new")} />
          <Link href="/works" className="btn-line">
            <span>{t("Our Works")}</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
