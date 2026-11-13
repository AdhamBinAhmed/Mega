"use client";

import Link from "next/link";
import { HamburgerMenuIcon, CloseCircleIcon } from "@solar-icons/react/linear";
import LiquidGlass from "../LiquidGlass";
import ThemeToggle from "./ThemeToggle";
import { useLang } from "../../lib/i18n";

/**
 * Phone dock (< 768px) — replaces the top bar entirely.
 *
 * Layout:  [menu] [theme]  ( logo )  [Works] [History]
 * The menu button is pinned to the screen edge and doubles as the panel's
 * close control, so the dock stays above the open menu.
 * The centre logo sits in a raised "popped" frame that breaks the dock's top
 * edge, and opens the command palette (the ⌘K surface) on tap.
 */
export default function MobileDock({
  onOpenPalette,
  menuOpen,
  onToggleMenu,
}: {
  onOpenPalette: () => void;
  menuOpen: boolean;
  onToggleMenu: (open: boolean) => void;
}) {
  const { t } = useLang();

  return (
    <LiquidGlass as="nav" variant="nav" radius={999} className="mdock" aria-label={t("Menu")}>
      <div className="mdock-side">
        {/* Menu sits at the very edge; it becomes the panel's close control. */}
        <button
          type="button"
          className="mdock-btn"
          onClick={() => onToggleMenu(!menuOpen)}
          aria-label={menuOpen ? t("Close") : t("Menu")}
          aria-expanded={menuOpen}
          aria-controls="staggered-menu-panel"
        >
          {menuOpen ? <CloseCircleIcon size={22} /> : <HamburgerMenuIcon size={20} />}
        </button>
        <ThemeToggle className="mdock-btn" />
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
        <Link href="/history" className="mdock-link">{t("History")}</Link>
      </div>
    </LiquidGlass>
  );
}
