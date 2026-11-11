"use client";

import { useEffect, useRef, useState } from "react";
import { Sun2Icon, MoonIcon, MonitorIcon } from "@solar-icons/react/linear";
import { useLang } from "../../lib/i18n";
import {
  PREF_CYCLE,
  applyResolved,
  currentResolved,
  getPref,
  resolvePref,
  storePref,
  systemTheme,
  type ThemePref,
} from "../../lib/theme";

const ICONS: Record<ThemePref, React.ReactNode> = {
  light: <Sun2Icon size={16} />,
  dark: <MoonIcon size={16} />,
  system: <MonitorIcon size={16} />,
};

/**
 * Three-state theme control: light → dark → system. The resolved theme is
 * swapped mid-dissolve (cheap cross-fade, no React re-render during it) —
 * same technique as the original two-state toggle.
 */
export default function ThemeToggle({ className = "mnav-icon" }: { className?: string }) {
  const { t } = useLang();
  const [pref, setPref] = useState<ThemePref>("system");
  const switching = useRef(false);

  useEffect(() => {
    setPref(getPref());
  }, []);

  // Follow live OS changes while on "system".
  useEffect(() => {
    if (pref !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => applyResolved(systemTheme());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [pref]);

  const applyPref = (next: ThemePref) => {
    const resolved = resolvePref(next);
    const el = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    storePref(next);
    setPref(next);
    if (resolved === currentResolved()) return;
    if (reduce || !("animate" in Element.prototype) || switching.current) {
      applyResolved(resolved);
      return;
    }
    switching.current = true;
    el.classList.add("theming");
    const dissolve = el.animate([{ opacity: 1 }, { opacity: 0.5 }, { opacity: 1 }], {
      duration: 260,
      easing: "ease-in-out",
    });
    window.setTimeout(() => applyResolved(resolved), 95);
    dissolve.onfinish = () => {
      el.classList.remove("theming");
      switching.current = false;
    };
  };

  const cycle = () => {
    const next = PREF_CYCLE[(PREF_CYCLE.indexOf(pref) + 1) % PREF_CYCLE.length];
    applyPref(next);
  };

  const label =
    pref === "light" ? t("Theme: light") : pref === "dark" ? t("Theme: dark") : t("Theme: system");

  return (
    <button onClick={cycle} className={className} aria-label={label} title={label}>
      {ICONS[pref]}
    </button>
  );
}
