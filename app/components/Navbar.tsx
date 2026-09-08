"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "../lib/i18n";
import "./navbar.css";

// Full section index — powers the ⌘/Index palette and the mobile drawer.
const sections = [
  { l: "Services", h: "/#services" },
  { l: "Process", h: "/#process" },
  { l: "Works", h: "/works" },
  { l: "Our Story", h: "/history" },
  { l: "Stack", h: "/#stack" },
  { l: "FAQ", h: "/#faq" },
  { l: "Team", h: "/#developers" },
  { l: "Contact", h: "/#contact" },
  { l: "Palestine", h: "/palestine" },
];

// Only the essentials sit on the desktop bar.
const essentials = [
  { l: "Works", h: "/works" },
  { l: "Our Story", h: "/history" },
  { l: "Contact", h: "/#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { t, lang, toggle: toggleLang } = useLang();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdVal, setCmdVal] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const switching = useRef(false);

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as "light" | "dark" | null) || "dark";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  // Close overlays on route change
  useEffect(() => { setMenuOpen(false); setCmdOpen(false); }, [pathname]);

  useEffect(() => {
    const kd = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !cmdOpen && !/^(input|textarea)$/i.test(t?.tagName)) { e.preventDefault(); setCmdOpen(true); }
      if (e.key === "Escape") { setCmdOpen(false); setMenuOpen(false); }
    };
    window.addEventListener("keydown", kd);
    return () => window.removeEventListener("keydown", kd);
  }, [cmdOpen]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  // Smooth, cheap cross-dissolve theme switch — swaps <html> at the trough, no React mid-animation.
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    const el = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("animate" in Element.prototype) || switching.current) {
      el.setAttribute("data-theme", next);
      setTheme(next);
      return;
    }
    switching.current = true;
    el.classList.add("theming");
    const dissolve = el.animate([{ opacity: 1 }, { opacity: 0.5 }, { opacity: 1 }], { duration: 260, easing: "ease-in-out" });
    window.setTimeout(() => {
      el.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch {}
    }, 95);
    dissolve.onfinish = () => { el.classList.remove("theming"); switching.current = false; setTheme(next); };
  };

  const actions = [
    { l: "Toggle Theme", icon: "◐", run: () => toggleTheme() },
    { l: "Copy Email", icon: "✉", run: () => { navigator.clipboard?.writeText("megatrondevs@gmail.com"); setToast(t("Email copied to clipboard")); } },
    { l: "Scroll to Top", icon: "↑", run: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    { l: "Open GitHub", icon: "⌥", run: () => window.open("https://github.com/AdhamBinAhmed", "_blank") },
    { l: "Stand with Palestine", icon: "🇵🇸", run: () => { window.location.href = "/palestine"; } },
  ];

  const q = cmdVal.toLowerCase();
  const secMatches = sections.filter((n) => n.l.toLowerCase().includes(q));
  const actMatches = actions.filter((a) => a.l.toLowerCase().includes(q));

  return (
    <div className="mega-nav">
      {/* ── BAR ── */}
      <header className="mnav-bar">
        <div className="mnav-inner">
          <a href="/" className="mnav-logo" aria-label="MEGA Devs — home">
            <img src="/light_mode_img.jpg" alt="MEGA Devs" className="mnav-logo-img mnav-logo-light" />
            <img src="/dark_mode_img.jpg" alt="MEGA Devs" className="mnav-logo-img mnav-logo-dark" />
            <span className="mnav-dot" />
          </a>
          <nav className="mnav-links">
            {essentials.map((n) => (
              <a key={n.l} href={n.h} className={`mnav-link${pathname === n.h ? " active" : ""}`}>{t(n.l)}</a>
            ))}
          </nav>
          <div className="mnav-actions">
            <button onClick={() => setCmdOpen(true)} className="mnav-index cmd-trigger" aria-label="Open section index">
              {t("Index")} <span className="mnav-key">/</span>
            </button>
            <motion.button
              onClick={toggleLang}
              className="mnav-icon mnav-lang"
              aria-label="Switch language"
              title={lang === "ar" ? "English" : "العربية"}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.85, rotate: -8 }}
              style={{ perspective: 400, overflow: "hidden" }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={lang}
                  initial={{ rotateY: -90, opacity: 0, y: 4 }}
                  animate={{ rotateY: 0, opacity: 1, y: 0 }}
                  exit={{ rotateY: 90, opacity: 0, y: -4 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: "inline-block" }}
                >
                  {lang === "ar" ? "EN" : "ع"}
                </motion.span>
              </AnimatePresence>
            </motion.button>
            <button onClick={toggleTheme} className="mnav-icon" aria-label="Toggle theme">{theme === "light" ? "☾" : "☀"}</button>
            <button className={`mnav-burger${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div className="mnav-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenuOpen(false)} />
            <motion.div className="mnav-drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}>
              <div className="mnav-drawer-head">
                <span className="mnav-kicker">{t("Index")}</span>
                <button className="mnav-burger open" onClick={() => setMenuOpen(false)} aria-label="Close menu"><span /><span /><span /></button>
              </div>
              <div className="mnav-drawer-list">
                {sections.map((n, i) => (
                  <motion.a key={n.l} href={n.h} className="mnav-drawer-link" onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 + 0.08 }}>
                    <span>{String(i + 1).padStart(2, "0")}</span>{t(n.l)}
                  </motion.a>
                ))}
              </div>
              <div className="mnav-drawer-foot">
                <a href="/#contact" className="mnav-cta" onClick={() => setMenuOpen(false)}>{t("Start a Project →")}</a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── COMMAND PALETTE ── */}
      <AnimatePresence>
        {cmdOpen && (
          <motion.div className="mnav-cmd-overlay" onClick={() => setCmdOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <motion.div className="mnav-cmd" onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, scale: 0.96, y: -16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: -16 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}>
              <div className="mnav-cmd-head">
                <span className="mnav-cmd-prompt">&gt;</span>
                <input autoFocus value={cmdVal} onChange={(e) => setCmdVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setCmdOpen(false);
                    if (e.key === "Enter") {
                      if (secMatches[0]) { window.location.href = secMatches[0].h; setCmdOpen(false); setCmdVal(""); return; }
                      if (actMatches[0]) { actMatches[0].run(); setCmdOpen(false); setCmdVal(""); }
                    }
                  }}
                  placeholder={t("Navigate or run a command...")} className="mnav-cmd-input" />
                <span className="mnav-cmd-esc">{t("ESC")}</span>
              </div>
              <div className="mnav-cmd-body">
                {secMatches.length > 0 && (
                  <>
                    <div className="mnav-cmd-label">{t("Sections")}</div>
                    {secMatches.map((n) => (
                      <a key={n.l} href={n.h} onClick={() => setCmdOpen(false)} className="mnav-cmd-item">
                        <span className="mnav-cmd-ic">&gt;</span><span>{t(n.l)}</span>
                      </a>
                    ))}
                  </>
                )}
                {actMatches.length > 0 && (
                  <>
                    <div className="mnav-cmd-label">{t("Actions")}</div>
                    {actMatches.map((a) => (
                      <button key={a.l} onClick={() => { a.run(); setCmdOpen(false); setCmdVal(""); }} className="mnav-cmd-item">
                        <span className="mnav-cmd-ic">{a.icon}</span><span>{t(a.l)}</span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOAST ── */}
      <AnimatePresence>
        {toast && (
          <motion.div className="mnav-toast" initial={{ opacity: 0, y: 20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 20, x: "-50%" }} transition={{ type: "spring", damping: 24, stiffness: 200 }}>
            <span className="mnav-toast-dot" /><span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
