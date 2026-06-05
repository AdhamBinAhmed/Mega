"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HistoryPage() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const initial = saved || "dark";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  const timeline = [
    {
      year: "2023",
      title: "The Foundation",
      body: "The journey began with the establishment of Mega ROM, founded and led by Adham Ahmed. During this initial phase, the company focused on specialized software development, supported by its first dedicated technical team.",
      accent: "var(--accent)",
    },
    {
      year: "2024",
      title: "Strategic Rebranding & Expansion",
      body: "In a move to broaden its technical scope, the company rebranded to MegaOS. The leadership structure evolved with Seif joining as Co-Founder. As operations grew, the company began forming multiple specialized teams to handle increasing project demands.",
      accent: "var(--accent2)",
    },
    {
      year: "2025",
      title: "A Scalable Vision",
      body: "This year marked a turning point as the vision expanded toward a more comprehensive corporate structure. To support this growth, several new teams were established, each focusing on different facets of innovation and system optimization.",
      accent: "var(--accent3)",
    },
    {
      year: "2026",
      title: "The Era of Mega Devs",
      body: "The evolution culminated in 2026 with the official launch of Mega Devs as the parent organization. Today, Mega Devs acts as the primary governing body, overseeing MegaOS and managing a robust network of multiple professional teams across its expanding technology ecosystem.",
      accent: "var(--accent)",
    },
  ];

  const pillars = [
    {
      title: "Global Tech Leadership",
      body: "We aspire to establish Mega Devs as a global benchmark in the technology sector, expanding our influence far beyond regional borders to provide cutting-edge solutions for international markets.",
      icon: "◎",
    },
    {
      title: "Innovation & AI Integration",
      body: "Our goal is to be at the forefront of the next technological revolution — integrating advanced AI and machine learning into the core of MegaOS, creating smarter, more intuitive ecosystems for users worldwide.",
      icon: "⬡",
    },
    {
      title: "Diverse Ecosystem Expansion",
      body: "We envision Mega Devs growing into a multi-disciplinary tech hub. By fostering dozens of specialized teams, we aim to launch a suite of diverse digital products that redefine how people interact with technology.",
      icon: "⊞",
    },
    {
      title: "Empowering the Next Generation",
      body: "Beyond code, we aim to build a community. In the coming decade, Mega Devs will focus on nurturing talent and creating a sustainable environment where innovation thrives.",
      icon: "◈",
    },
  ];

  return (
    <div className="history-root" data-theme={theme}>
      <style>{`
        /* ── TOKENS (mirror main site exactly) ── */
        .history-root, .history-root [data-theme="dark"] {
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
        }
        .history-root[data-theme="light"] {
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
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .history-root {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-display);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
          transition: background 0.3s, color 0.3s;
          position: relative;
        }

        /* ── BG GLOW (matches main site) ── */
        .h-bg-glow {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 50% at 20% 30%, rgba(232,69,69,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 80% 70%, rgba(255,112,67,0.05) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 50% 10%, rgba(255,209,102,0.04) 0%, transparent 70%);
        }
        .history-root[data-theme="light"] .h-bg-glow {
          background:
            radial-gradient(ellipse 60% 50% at 20% 30%, rgba(200,57,43,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 80% 70%, rgba(232,87,26,0.04) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 50% 10%, rgba(192,139,32,0.04) 0%, transparent 70%);
        }

        /* ── NAV (mirrors main site nav exactly) ── */
        .h-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 0 56px; height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid var(--border);
          background: rgba(5,5,7,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: background 0.3s;
        }
        .history-root[data-theme="light"] .h-nav {
          background: rgba(250,248,245,0.85);
        }
        .h-logo {
          font-family: var(--font-logo); font-size: 1.1rem; font-weight: 700;
          color: var(--text); text-decoration: none; letter-spacing: 0.12em;
          display: flex; align-items: center; gap: 6px; cursor: pointer;
        }
        .h-logo-accent { color: var(--accent); }
        .h-logo-dot {
          width: 6px; height: 6px; border-radius: 50%; background: var(--accent);
          animation: pulse 2s ease-in-out infinite;
        }
        .h-nav-right { display: flex; align-items: center; gap: 20px; }
        .h-back {
          font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted);
          border: 1px solid var(--border2); padding: 8px 16px; text-decoration: none;
          letter-spacing: 0.08em; text-transform: uppercase;
          transition: all 0.2s; display: flex; align-items: center; gap: 8px;
          cursor: pointer; -webkit-tap-highlight-color: transparent;
          min-height: 44px;
        }
        .h-back:hover { color: var(--text); border-color: var(--accent); }
        .h-theme-btn {
          font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted);
          border: 1px solid var(--border2); padding: 8px 12px;
          background: none; letter-spacing: 0.08em; text-transform: uppercase;
          transition: all 0.2s; cursor: pointer; min-height: 44px;
          -webkit-tap-highlight-color: transparent;
        }
        .h-theme-btn:hover { color: var(--text); border-color: var(--border2); }

        /* ── SCROLL BAR ── */
        .h-scroll-bar {
          position: fixed; top: 0; left: 0; height: 2px; z-index: 200;
          background: linear-gradient(90deg, var(--accent), var(--accent2), var(--accent3));
          pointer-events: none; transform-origin: left;
          transform: scaleX(0);
          animation: h-scroll-progress linear both;
          animation-timeline: scroll(root block);
        }
        @keyframes h-scroll-progress { to { transform: scaleX(1); } }

        /* ── MAIN CONTENT ── */
        .h-content {
          position: relative; z-index: 2;
          padding: 120px 56px 100px;
          max-width: 900px;
          margin: 0 auto;
        }

        /* ── HERO HEADLINE ── */
        .h-eyebrow {
          font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted);
          letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 20px;
          display: flex; align-items: center; gap: 12px;
        }
        .h-eyebrow::before {
          content: ''; width: 32px; height: 1px; background: var(--muted);
        }
        .h-headline {
          font-size: clamp(2.8rem, 7vw, 6rem); font-weight: 800;
          letter-spacing: -0.04em; line-height: 1;
          margin-bottom: 24px; color: var(--text);
        }
        .h-headline em {
          font-style: normal; color: var(--accent);
        }
        .h-subhead {
          font-size: 1.1rem; color: var(--muted); line-height: 1.7;
          max-width: 540px; margin-bottom: 80px;
        }

        /* ── TIMELINE ── */
        .h-timeline { position: relative; margin-bottom: 100px; }
        .h-timeline-line {
          position: absolute; left: 0; top: 0; bottom: 0; width: 1px;
          background: linear-gradient(to bottom, transparent, var(--border2) 10%, var(--border2) 90%, transparent);
        }
        .h-titem {
          padding: 0 0 56px 48px;
          position: relative;
        }
        .h-titem-dot {
          position: absolute; left: -5px; top: 6px;
          width: 11px; height: 11px; border-radius: 50%;
          border: 2px solid var(--bg);
          box-shadow: 0 0 0 1px var(--border2);
          transition: transform 0.3s var(--ease-out);
        }
        .h-titem:hover .h-titem-dot { transform: scale(1.4); }
        .h-tyear {
          font-family: var(--font-mono); font-size: 0.65rem;
          letter-spacing: 0.15em; text-transform: uppercase;
          margin-bottom: 12px;
        }
        .h-ttitle {
          font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 800;
          letter-spacing: -0.03em; margin-bottom: 16px; line-height: 1.1;
        }
        .h-tbody {
          font-size: 1rem; color: var(--muted); line-height: 1.75;
          max-width: 620px;
        }

        /* ── VISION SECTION ── */
        .h-vision-label {
          font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted);
          letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 20px;
          display: flex; align-items: center; gap: 12px;
        }
        .h-vision-label::before { content: ''; width: 32px; height: 1px; background: var(--muted); }
        .h-vision-title {
          font-size: clamp(2rem, 5vw, 4rem); font-weight: 800;
          letter-spacing: -0.04em; line-height: 1; margin-bottom: 16px;
        }
        .h-vision-sub {
          font-size: 1rem; color: var(--muted); line-height: 1.7;
          max-width: 520px; margin-bottom: 56px;
        }
        .h-pillars { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
        .h-pillar {
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 40px 36px;
          transition: border-color 0.3s, background 0.3s;
          cursor: default;
        }
        .h-pillar:hover { border-color: var(--border2); background: var(--surface2); }
        .h-pillar-icon {
          font-size: 1.6rem; margin-bottom: 20px;
          display: block; line-height: 1;
        }
        .h-pillar-title {
          font-size: 1.05rem; font-weight: 800;
          letter-spacing: -0.02em; margin-bottom: 12px;
          line-height: 1.2;
        }
        .h-pillar-body {
          font-size: 0.88rem; color: var(--muted); line-height: 1.7;
        }

        /* ── FOOTER ── */
        .h-footer {
          position: relative; z-index: 2;
          border-top: 1px solid var(--border);
          padding: 32px 56px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px;
        }
        .h-footer-copy {
          font-family: var(--font-mono); font-size: 0.6rem; color: var(--muted);
          letter-spacing: 0.08em; text-transform: uppercase;
        }
        .h-footer-links { display: flex; gap: 24px; }
        .h-footer-link {
          font-family: var(--font-mono); font-size: 0.6rem; color: var(--muted);
          text-decoration: none; letter-spacing: 0.08em; text-transform: uppercase;
          transition: color 0.2s; cursor: pointer;
        }
        .h-footer-link:hover { color: var(--text); }

        /* ── ANIMATIONS ── */
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(0.85); }
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .h-nav { padding: 0 20px; }
          .h-content { padding: 100px 20px 80px; }
          .h-pillars { grid-template-columns: 1fr; }
          .h-footer { padding: 24px 20px; flex-direction: column; align-items: flex-start; }
          .h-pillar { padding: 32px 24px; }
        }
        @media (max-width: 480px) {
          .h-headline { letter-spacing: -0.03em; }
          .h-titem { padding: 0 0 40px 32px; }
          .h-ttitle { font-size: 1.3rem; }
          .h-back span { display: none; }
          .h-nav-right { gap: 10px; }
        }

        /* Disable backdrop-filter on touch */
        @media (hover: none) and (pointer: coarse) {
          .h-nav {
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            background: var(--bg);
          }
        }

        ::selection { background: var(--accent); color: #fff; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--border2); }
      `}</style>

      {/* BG */}
      <div className="h-bg-glow" />
      <div className="h-scroll-bar" />

      {/* NAV */}
      <nav className="h-nav">
        <a href="/" className="h-logo">
          <span className="h-logo-dot" />
          MEGA<span className="h-logo-accent">Devs</span>
        </a>
        <div className="h-nav-right">
          <button className="h-theme-btn" onClick={toggleTheme}>
            {theme === "dark" ? "☀" : "◑"}
          </button>
          <a href="/" className="h-back">
            <span>←</span>
            <span>Back</span>
          </a>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="h-content">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 24, stiffness: 120 }}
        >
          <div className="h-eyebrow">Our Story</div>
          <h1 className="h-headline">
            The Evolution of<br /><em>Mega Devs</em>
          </h1>
          <p className="h-subhead">
            From a focused software studio to a multi-team technology organization — four years of building, rebranding, and scaling.
          </p>
        </motion.div>

        {/* TIMELINE */}
        <div className="h-timeline">
          <div className="h-timeline-line" />
          {timeline.map((item, i) => (
            <motion.div
              key={item.year}
              className="h-titem"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", damping: 24, stiffness: 130, delay: i * 0.07 }}
            >
              <div className="h-titem-dot" style={{ background: item.accent }} />
              <div className="h-tyear" style={{ color: item.accent }}>{item.year}</div>
              <div className="h-ttitle">{item.title}</div>
              <p className="h-tbody">{item.body}</p>
            </motion.div>
          ))}
        </div>

        {/* VISION */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 24, stiffness: 130 }}
        >
          <div className="h-vision-label">2026 – 2036</div>
          <h2 className="h-vision-title">Our Vision:<br />The Next Decade</h2>
          <p className="h-vision-sub">
            Our roadmap is built on four pillars that will define the next chapter of Mega Devs.
          </p>

          <div className="h-pillars">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                className="h-pillar"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", damping: 24, stiffness: 130, delay: i * 0.06 }}
              >
                <span className="h-pillar-icon" style={{ color: i % 2 === 0 ? "var(--accent)" : "var(--accent3)" }}>
                  {p.icon}
                </span>
                <div className="h-pillar-title">{p.title}</div>
                <p className="h-pillar-body">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* FOOTER */}
      <footer className="h-footer">
        <span className="h-footer-copy">© 2026 Mega Devs. All rights reserved.</span>
        <div className="h-footer-links">
          <a href="/" className="h-footer-link">Home</a>
          <a href="/#work" className="h-footer-link">Work</a>
          <a href="/#contact" className="h-footer-link">Contact</a>
        </div>
      </footer>
    </div>
  );
}
