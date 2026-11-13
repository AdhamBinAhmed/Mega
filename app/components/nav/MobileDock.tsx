"use client";

import Link from "next/link";
import { HamburgerMenuIcon } from "@solar-icons/react/linear";
import LiquidGlass from "../LiquidGlass";
import ThemeToggle from "./ThemeToggle";
import { useLang } from "../../lib/i18n";

/**
 * Phone dock (< 768px) — replaces the top bar entirely.
 *
 * Layout:  [theme] [menu]  ( logo )  [Works] [History]
 * The centre logo sits in a raised "popped" frame that breaks the dock's top
 * edge, and opens the command palette (the ⌘K surface) on tap.
 */
export default function MobileDock({
  onOpenPalette,
  onOpenMenu,
}: {
  onOpenPalette: () => void;
  onOpenMenu: () => void;
}) {
  const { t } = useLang();

  return (
    <LiquidGlass as="nav" variant="nav" radius={999} className="mdock" aria-label={t("Menu")}>
      <div className="mdock-side">
        <ThemeToggle className="mdock-btn" />
        <button type="button" className="mdock-btn" onClick={onOpenMenu} aria-label={t("Menu")}>
          <HamburgerMenuIcon size={20} />
        </button>
      </div>

      <button
        type="button"
        className="mdock-logo"
        onClick={onOpenPalette}
        aria-label={t("Navigate or run a command...")}
      >
        <span className="mdock-logo-frame">
          <img src="/icon.png" alt="" width={34} height={34} />
        </span>
      </button>

      <div className="mdock-side">
        <Link href="/works" className="mdock-link">{t("Works")}</Link>
        <Link href="/history" className="mdock-link">{t("Our Story")}</Link>
      </div>
    </LiquidGlass>
  );
}
