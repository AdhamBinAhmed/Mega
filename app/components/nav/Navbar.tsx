"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CommandIcon } from "@solar-icons/react/linear";
import LiquidGlass from "../LiquidGlass";
import CommandPalette from "./CommandPalette";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "./ThemeToggle";
import LangToggle from "./LangToggle";
import Toast from "./Toast";
import { useLang } from "../../lib/i18n";
import { APP_SEGMENTS, essentials, isSubdomainHost } from "../../lib/appRoutes";
import { useLazyAuth } from "../../lib/useLazyAuth";
import { applyResolved, currentResolved } from "../../lib/theme";
import "../navbar.css";

export default function Navbar() {
  const pathname = usePathname();
  const [host, setHost] = useState<string | null>(null);
  useEffect(() => setHost(window.location.hostname), []);
  const { t } = useLang();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  // Firebase loads only after the palette or menu is first used.
  const [authWanted, setAuthWanted] = useState(false);
  const { signedIn } = useLazyAuth(authWanted);
  const [isApple, setIsApple] = useState(false);

  useEffect(() => {
    setIsApple(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
  }, []);

  // Close overlays on route change.
  useEffect(() => {
    setCmdOpen(false);
  }, [pathname]);

  // ⌘K / Ctrl+K / "/" open the palette; Esc closes (palette traps its own keys).
  useEffect(() => {
    const kd = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = /^(input|textarea|select)$/i.test(target?.tagName) || target?.isContentEditable;
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setAuthWanted(true);
        setCmdOpen((v) => !v);
        return;
      }
      if (e.key === "/" && !cmdOpen && !typing) {
        e.preventDefault();
        setAuthWanted(true);
        setCmdOpen(true);
      }
      if (e.key === "Escape") setCmdOpen(false);
    };
    window.addEventListener("keydown", kd);
    return () => window.removeEventListener("keydown", kd);
  }, [cmdOpen]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  // Palette "Toggle Theme" action: flip the resolved theme (pref untouched —
  // the 3-state control lives on the ThemeToggle button).
  const quickToggleTheme = () => {
    applyResolved(currentResolved() === "light" ? "dark" : "light");
  };

  // Hide the MEGA Devs nav on user-owned pages: the builder (full-screen
  // editor), published sites (/site/...), profile pages (/[subdomain]), and
  // any real subdomain host — so it only shows on the app's own pages.
  const seg = pathname.split("/")[1] || "";
  const hideNav = !APP_SEGMENTS.has(seg) || (host !== null && isSubdomainHost(host));
  if (hideNav) return null;

  return (
    <div className="mega-nav">
      {/* ── FLOATING GLASS PILL ── */}
      <LiquidGlass as="header" variant="nav" radius={999} className="mnav-bar">
        <div className="mnav-inner">
          <Link href="/" className="mnav-logo" aria-label="MEGA Devs — home">
            {/* Light logo asset pending from the user — dark mark used in both themes for now. */}
            <img src="/dark_mode_img.jpg" alt="MEGA Devs" className="mnav-logo-img" />
            <span className="mnav-dot" />
          </Link>
          <nav className="mnav-links" aria-label="Primary">
            {essentials.map((n) => {
              const ext = n.h.startsWith("http");
              return ext ? (
                <a key={n.l} href={n.h} className="mnav-link" target="_blank" rel="noopener noreferrer">
                  {t(n.l)}
                </a>
              ) : (
                <Link key={n.l} href={n.h} className={`mnav-link${pathname === n.h ? " active" : ""}`}>
                  {t(n.l)}
                </Link>
              );
            })}
          </nav>
          <div className="mnav-actions">
            <button
              onClick={() => {
                setAuthWanted(true);
                setCmdOpen(true);
              }}
              className="mnav-index cmd-trigger"
              aria-label="Open command palette"
            >
              <span className="mnav-key">
                <CommandIcon size={13} /> {isApple ? "K" : "Ctrl K"}
              </span>
            </button>
            <LangToggle />
            <ThemeToggle />
          </div>
        </div>
      </LiquidGlass>

      {/* ── PHONE MENU (StaggeredMenu, <768px) ── */}
      <MobileMenu signedIn={signedIn} onFirstOpen={() => setAuthWanted(true)} />

      {/* ── COMMAND PALETTE ── */}
      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onToast={setToast}
        onToggleTheme={quickToggleTheme}
        signedIn={signedIn}
      />

      {/* ── TOAST ── */}
      <Toast message={toast} />
    </div>
  );
}
