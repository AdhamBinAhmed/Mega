"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const works = [
  {
    num: "01",
    title: "MEGA ROM",
    category: "Android ROM",
    year: "2023",
    desc: "Custom Android ROM built from AOSP with performance patches, a debloated system image, and minimal UI. Deployed on Xiaomi & Samsung.",
    tags: ["Android", "C++", "Kernel", "AOSP"],
    status: "Live",
    link: "https://megaroms.ggff.net/",
  },
  {
    num: "02",
    title: "Kira Store",
    category: "Web App",
    year: "2024",
    desc: "Full-stack e-commerce platform with real-time inventory, Arabic/English i18n, payment gateway integration, and a custom admin dashboard.",
    tags: ["Next.js", "PostgreSQL", "Redis", "Stripe"],
    status: "Live",
    link: "https://kiradecoration.vercel.app/",
  },
  {
    num: "03",
    title: "SentinelAI",
    category: "AI System",
    year: "2024",
    desc: "ML-powered threat detection trained on real network traffic. Sub-10ms inference, 94%+ accuracy, running in production across two enterprise clients.",
    tags: ["Python", "PyTorch", "FastAPI", "Docker"],
    status: "Private",
    link: "#",
  },
  {
    num: "04",
    title: "DevPanel",
    category: "Backend",
    year: "2024",
    desc: "Internal server management dashboard with live metrics, SSH tunneling, log streaming, and smart alerting. 847+ days without downtime.",
    tags: ["Node.js", "WebSockets", "Linux", "Nginx"],
    status: "Private",
    link: "#",
  },
];

export default function WorksPage() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [hoveredWork, setHoveredWork] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const initial = saved || "dark";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
    
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  return (
    <div className="works-root" data-theme={theme}>
      <style>{`
        /* ── TOKENS ── */
        .works-root, .works-root [data-theme="dark"] {
          --bg:       #050507;
          --surface:  #0d0d10;
          --surface2: #131318;
          --border:   rgba(255,255,255,0.06);
          --border2:  rgba(255,255,255,0.12);
          --text:     #f0f0f2;
          --muted:    #6b6b7a;
          --green:    #22c55e;
          --accent:   #e84545;
          --accent2:  #ff7043;
          --accent3:  #ffd166;
          --ease-out: cubic-bezier(0.16,1,0.3,1);
          --font-display: var(--font-outfit,'Outfit'),sans-serif;
          --font-mono:    var(--font-jetbrains,'JetBrains Mono'),monospace;
          --font-logo:    var(--font-logo,'Orbitron'),sans-serif;
          --glow:     rgba(232,69,69,0.15);
        }
        .works-root[data-theme="light"] {
          --bg:       #faf8f5;
          --surface:  #ffffff;
          --surface2: #f0ede8;
          --border:   rgba(0,0,0,0.07);
          --border2:  rgba(0,0,0,0.14);
          --text:     #111111;
          --muted:    #7a7570;
          --green:    #14532d;
          --accent:   #c8392b;
          --accent2:  #e8571a;
          --accent3:  #c08b20;
          --glow:     rgba(200,57,43,0.08);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .works-root {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-display);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
          transition: background 0.3s, color 0.3s;
          position: relative;
        }

        /* ── BG EFFECTS ── */
        .bg-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .bg-glow {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 50% at 10% 20%, rgba(232,69,69,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 90% 80%, rgba(255,112,67,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 50% 50%, rgba(255,209,102,0.04) 0%, transparent 70%);
        }
        .noise {
          position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }
        
        .works-root[data-theme="light"] .bg-grid {
          background-image:
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
        }
        .works-root[data-theme="light"] .bg-glow {
          background:
            radial-gradient(ellipse 60% 50% at 10% 20%, rgba(200,57,43,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 90% 80%, rgba(232,87,26,0.05) 0%, transparent 70%);
        }
        .works-root[data-theme="light"] .noise { opacity: 0.02; }

        @media (hover: none) and (pointer: coarse) {
          .noise { display: none; }
          .bg-glow { display: none; }
        }

        /* ── NAV ── */
        .w-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 0 56px; height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid var(--border);
          background: rgba(5,5,7,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: background 0.3s;
        }
        .works-root[data-theme="light"] .w-nav {
          background: rgba(250,248,245,0.85);
        }
        .w-logo {
          font-family: var(--font-logo); font-size: 1.1rem; font-weight: 700;
          color: var(--text); text-decoration: none; letter-spacing: 0.12em;
          display: flex; align-items: center; gap: 6px; cursor: pointer;
        }
        .w-logo-accent { color: var(--accent); }
        .w-logo-dot {
          width: 6px; height: 6px; border-radius: 50%; background: var(--accent);
          animation: pulse 2s ease-in-out infinite;
        }
        .w-nav-right { display: flex; align-items: center; gap: 20px; }
        .w-back {
          font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted);
          border: 1px solid var(--border2); padding: 8px 16px; text-decoration: none;
          letter-spacing: 0.08em; text-transform: uppercase;
          transition: all 0.2s; display: flex; align-items: center; gap: 8px;
          cursor: pointer; -webkit-tap-highlight-color: transparent;
          min-height: 44px;
        }
        .w-back:hover { color: var(--text); border-color: var(--accent); }
        .w-theme-btn {
          font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted);
          border: 1px solid var(--border2); padding: 8px 12px;
          background: none; letter-spacing: 0.08em; text-transform: uppercase;
          transition: all 0.2s; cursor: pointer; min-height: 44px;
          -webkit-tap-highlight-color: transparent;
        }
        .w-theme-btn:hover { color: var(--text); border-color: var(--border2); }

        /* ── SCROLL BAR ── */
        .w-scroll-bar {
          position: fixed; top: 0; left: 0; height: 2px; z-index: 200;
          background: linear-gradient(90deg, var(--accent), var(--accent2), var(--accent3));
          pointer-events: none; transform-origin: left;
          transform: scaleX(0);
          animation: w-scroll-progress linear both;
          animation-timeline: scroll(root block);
        }
        @keyframes w-scroll-progress { to { transform: scaleX(1); } }

        /* ── MAIN CONTENT ── */
        .w-content {
          position: relative; z-index: 2;
          padding: 140px 56px 100px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ── HERO HEADLINE ── */
        .w-eyebrow {
          font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted);
          letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 20px;
          display: flex; align-items: center; gap: 12px;
        }
        .w-eyebrow::before {
          content: ''; width: 32px; height: 1px; background: var(--muted);
        }
        .w-headline {
          font-size: clamp(2.8rem, 7vw, 6rem); font-weight: 800;
          letter-spacing: -0.04em; line-height: 1;
          margin-bottom: 24px; color: var(--text);
        }
        .w-headline em {
          font-style: normal; color: var(--accent);
        }
        .w-subhead {
          font-size: 1.1rem; color: var(--muted); line-height: 1.7;
          max-width: 540px; margin-bottom: 80px;
        }

        /* ── WORKS LIST ── */
        .w-works-list { display: flex; flex-direction: column; gap: 4px; margin-bottom: 80px; }
        .w-work-row {
          display: grid; grid-template-columns: 80px 1fr 120px 120px;
          align-items: center; gap: 32px;
          padding: 32px 40px; background: var(--surface); border: 1px solid transparent;
          text-decoration: none; transition: all 0.3s var(--ease-out); position: relative; overflow: hidden;
        }
        .w-work-row::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
          background: var(--accent); transform: scaleY(0); transform-origin: bottom;
          transition: transform 0.3s var(--ease-out);
        }
        .w-work-row:hover { background: var(--surface2); border-color: var(--border2); padding-left: 56px; }
        .w-work-row:hover::before { transform: scaleY(1); }
        .w-row-num { font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted); letter-spacing: 0.1em; }
        .w-row-info { min-width: 0; }
        .w-row-cat { font-family: var(--font-mono); font-size: 0.6rem; color: var(--accent); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; }
        .w-row-title { font-size: 1.4rem; font-weight: 800; color: var(--text); letter-spacing: -0.03em; margin-bottom: 8px; }
        .w-row-tags { display: flex; gap: 6px; flex-wrap: wrap; }
        .w-tag { font-family: var(--font-mono); font-size: 0.55rem; color: var(--muted); border: 1px solid var(--border2); padding: 3px 8px; letter-spacing: 0.06em; }
        .w-row-year { font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted); text-align: right; }
        .w-status {
          font-family: var(--font-mono); font-size: 0.6rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase; padding: 5px 12px;
          border: 1px solid; text-align: center;
        }
        .w-status.live { color: var(--green); border-color: rgba(34,197,94,0.3); background: rgba(34,197,94,0.05); }
        .w-status.private { color: var(--accent); border-color: rgba(232,69,69,0.3); background: var(--glow); }
        .w-expand {
          position: absolute; inset: 0; pointer-events: none;
          display: flex; align-items: flex-end; padding: 16px 40px;
          font-size: 0.8rem; color: var(--muted); opacity: 0; transition: opacity 0.2s;
          background: linear-gradient(90deg, transparent 0%, rgba(5,5,7,0.8) 60%);
        }
        .works-root[data-theme="light"] .w-expand {
          background: linear-gradient(90deg, transparent 0%, rgba(250,248,245,0.9) 60%);
        }
        .w-work-row:hover .w-expand { opacity: 1; }

        /* ── FOOTER ── */
        .w-footer {
          position: relative; z-index: 2;
          border-top: 1px solid var(--border);
          padding: 32px 56px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px;
        }
        .w-footer-copy {
          font-family: var(--font-mono); font-size: 0.6rem; color: var(--muted);
          letter-spacing: 0.08em; text-transform: uppercase;
        }
        .w-footer-links { display: flex; gap: 24px; }
        .w-footer-link {
          font-family: var(--font-mono); font-size: 0.6rem; color: var(--muted);
          text-decoration: none; letter-spacing: 0.08em; text-transform: uppercase;
          transition: color 0.2s; cursor: pointer;
        }
        .w-footer-link:hover { color: var(--text); }

        /* ── ANIMATIONS ── */
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(0.85); }
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .w-nav { padding: 0 20px; }
          .w-content { padding: 100px 20px 80px; }
          .w-work-row { grid-template-columns: 48px 1fr auto; gap: 16px; padding: 20px 16px; }
          .w-row-year { display: none; }
          .w-status { font-size: 0.55rem; padding: 4px 8px; }
          .w-work-row:hover { padding-left: 20px; }
          .w-footer { padding: 24px 20px; flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 480px) {
          .w-headline { letter-spacing: -0.03em; }
          .w-work-row { padding: 16px 12px; }
          .w-row-title { font-size: 1.1rem; }
          .w-tag { font-size: 0.5rem; }
          .w-back span { display: none; }
          .w-nav-right { gap: 10px; }
        }

        /* Disable backdrop-filter and hover states on touch */
        @media (hover: none) and (pointer: coarse) {
          .w-nav {
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            background: var(--bg);
          }
          .w-work-row:hover { padding-left: 12px; }
          .w-work-row:hover .w-expand { opacity: 0; }
        }

        ::selection { background: var(--accent); color: #fff; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--border2); }
      `}</style>

      {/* BG LAYERS */}
      <div className="bg-grid" />
      <div className="bg-glow" />
      <div className="noise" />
      <div className="w-scroll-bar" />

      {/* NAV */}
      <nav className="w-nav">
        <a href="/" className="w-logo">
          <span className="w-logo-dot" />
          MEGA<span className="w-logo-accent">Devs</span>
        </a>
        <div className="w-nav-right">
          <button className="w-theme-btn" onClick={toggleTheme}>
            {theme === "dark" ? "☀" : "◑"}
          </button>
          <a href="/" className="w-back">
            <span>←</span>
            <span>Back</span>
          </a>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="w-content">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 24, stiffness: 120 }}
        >
          <div className="w-eyebrow">Portfolio</div>
          <h1 className="w-headline">
            Things we&apos;ve<br /><em>shipped</em>
          </h1>
          <p className="w-subhead">
            A selection of projects ranging from high-performance web applications and custom Android ROMs to intelligent AI systems.
          </p>
        </motion.div>

        {/* WORKS LIST */}
        <div className="w-works-list">
          {works.map((w, i) => (
            <motion.a
              key={w.num}
              href={w.link}
              target={w.link !== "#" ? "_blank" : undefined}
              rel={w.link !== "#" ? "noopener noreferrer" : undefined}
              className="w-work-row"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              initial={{ opacity: 0, y: isMobile ? 16 : 0, x: isMobile ? 0 : -40 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              whileHover={isMobile ? {} : { scale: 1.01, x: 10 }}
              transition={{ type: "spring", damping: 24, stiffness: 130, delay: i * 0.06 }}
              onMouseEnter={() => setHoveredWork(i)}
              onMouseLeave={() => setHoveredWork(null)}
            >
              <span className="w-row-num">{w.num}</span>
              <div className="w-row-info">
                <div className="w-row-cat">{w.category}</div>
                <div className="w-row-title">{w.title}</div>
                <div className="w-row-tags">
                  {w.tags.map((t) => <span key={t} className="w-tag">{t}</span>)}
                </div>
              </div>
              <div className="w-row-year">{w.year}</div>
              <span className={`w-status ${w.status.toLowerCase()}`}>{w.status}</span>
              <div className="w-expand">{w.desc}</div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-footer">
        <span className="w-footer-copy">© {new Date().getFullYear()} Mega Devs. All rights reserved.</span>
        <div className="w-footer-links">
          <a href="/" className="w-footer-link">Home</a>
          <a href="/history" className="w-footer-link">History</a>
          <a href="/#contact" className="w-footer-link">Contact</a>
        </div>
      </footer>
    </div>
  );
}
