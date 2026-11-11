// Theme model: the stored *preference* is light | dark | system (missing =
// system); the *resolved* theme on <html data-theme> is always light | dark.
// A blocking script in layout.tsx applies the resolved theme before paint.

export type ThemePref = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export function getPref(): ThemePref {
  try {
    const v = localStorage.getItem("theme");
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

export function systemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function resolvePref(pref: ThemePref): ResolvedTheme {
  return pref === "system" ? systemTheme() : pref;
}

export function storePref(pref: ThemePref) {
  try {
    if (pref === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", pref);
  } catch {
    /* private mode */
  }
}

export function applyResolved(theme: ResolvedTheme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function currentResolved(): ResolvedTheme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

export const PREF_CYCLE: ThemePref[] = ["light", "dark", "system"];
