"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useLang } from "../lib/i18n";

export default function HistoryPage() {
  const { t } = useLang();
  const [activeYear, setActiveYear] = useState("2023");
  const rootRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  const timeline = [
    {
      year: "2023",
      tag: "Inception",
      title: "Establishing the Foundation",
      body: "Mega ROM was founded under the leadership of Adham Ahmed, beginning as a specialized software development studio. Supported by a dedicated core engineering team, the company established the technical standards and disciplined delivery model that continue to define its work today.",
      accent: "var(--accent)",
      stat: "Founding Team",
    },
    {
      year: "2024",
      tag: "Rebrand & Growth",
      title: "Strategic Rebranding & Expansion",
      body: "To broaden its technical scope, the company rebranded as MegaOS and strengthened its leadership with the appointment of Seif as Co-Founder. As demand grew, operations expanded into multiple specialized teams, each structured to deliver against increasingly complex project requirements.",
      accent: "var(--accent2)",
      stat: "Co-Founder Appointed",
    },
    {
      year: "2025",
      tag: "Scaling Operations",
      title: "Building a Scalable Structure",
      body: "A pivotal year marked the transition toward a comprehensive corporate structure. New teams were established across engineering, innovation, and systems optimization — laying the operational foundation required to scale reliably and sustain long-term growth.",
      accent: "var(--accent3)",
      stat: "Multi-Team Operations",
    },
    {
      year: "2026",
      tag: "Maturity",
      title: "The Formation of Mega Devs",
      body: "The company's evolution culminated in the launch of Mega Devs as the parent organization. Today, Mega Devs serves as the governing body overseeing MegaOS and coordinating a network of specialized professional teams across a growing technology ecosystem.",
      accent: "var(--accent)",
      stat: "Parent Organization",
    },
    {
      year: "2027",
      tag: "Strategic Pause",
      title: "Temporary Suspension of MegaOS",
      body: "The MegaDevs management has decided to temporarily suspend MegaOS until 2028 due to its high resource consumption without a sufficient return.",
      accent: "var(--accent2)",
      stat: "MegaOS Paused",
    },
  ];

  const stats = [
    { k: "2023", v: "Year Established" },
    { k: "4", v: "Years of Growth" },
    { k: "3×", v: "Strategic Rebrands" },
    { k: "Multi", v: "Specialized Teams" },
  ];

  const pillars = [
    {
      title: "Global Technology Leadership",
      body: "We aim to establish Mega Devs as a recognized benchmark in the technology sector — extending our capabilities beyond regional markets to deliver enterprise-grade solutions to clients worldwide.",
      icon: "◎",
      span: "wide",
    },
    {
      title: "Innovation & AI Integration",
      body: "We are committed to advancing the next generation of software by embedding artificial intelligence and machine learning into the core of the MegaOS platform.",
      icon: "⬡",
      span: "tall",
    },
    {
      title: "Ecosystem Expansion",
      body: "We are building Mega Devs into a multi-disciplinary technology group, developing a portfolio of products designed to redefine how people interact with technology.",
      icon: "⊞",
      span: "normal",
    },
    {
      title: "Developing Future Talent",
      body: "Beyond delivery, we invest in people — cultivating talent and sustaining an environment where engineering excellence and innovation can thrive.",
      icon: "◈",
      span: "normal",
    },
  ];

  return (
    <div className="history-root" ref={rootRef}>
      <style>{`
        /* ── TOKENS (mirror main site exactly) ── */
        .history-root {
          --bg:       #0c0b0f;
          --surface:  #111015;
          --surface2: #18171e;
          --border:   rgba(255,255,255,0.06);
          --border2:  rgba(255,255,255,0.12);
          --text:     #f4f2ed;
          --muted:    #6a6862;
          --green:    #22c55e;
          --accent:   #ef4444;
          --accent2:  #ff7043;
          --accent3:  #ffd166;
          --ghost:    rgba(255,255,255,0.03);
          --ease-out: cubic-bezier(0.16,1,0.3,1);
          --font-display: var(--font-outfit,'Outfit'),sans-serif;
          --font-mono:    var(--font-jetbrains,'JetBrains Mono'),monospace;
          --font-logo:    var(--font-logo,'Sora'),sans-serif;
          --font-accent:  var(--font-serif,'DM Serif Display'),serif;
        }
        [data-theme="light"] .history-root {
          --bg:       #f6f3ec;
          --surface:  #faf8f2;
          --surface2: #ece7db;
          --border:   rgba(0,0,0,0.07);
          --border2:  rgba(0,0,0,0.14);
          --text:     #111010;
          --muted:    #7a7570;
          --green:    #14532d;
          --accent:   #d92b1f;
          --accent2:  #e8571a;
          --accent3:  #c08b20;
          --ghost:    rgba(0,0,0,0.03);
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

        /* ── BG GLOW ── */
        .h-bg-glow {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 50% at 20% 20%, rgba(232,69,69,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 85% 65%, rgba(255,112,67,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 50% 105%, rgba(255,209,102,0.05) 0%, transparent 70%);
        }
        [data-theme="light"] .history-root .h-bg-glow {
          background:
            radial-gradient(ellipse 60% 50% at 20% 20%, rgba(200,57,43,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 85% 65%, rgba(232,87,26,0.05) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 50% 105%, rgba(192,139,32,0.05) 0%, transparent 70%);
        }
        .h-grid-overlay {
          display: none; /* removed: grid overlay is an AI template cliché */
        }

        /* ── SCROLL PROGRESS ── */
        .h-scroll-bar {
          position: fixed; top: 0; left: 0; right: 0; height: 2px; z-index: 200;
          background: linear-gradient(90deg, var(--accent), var(--accent2), var(--accent3));
          pointer-events: none; transform-origin: left;
        }

        /* NAV — uses global navbar now */
        .h-nav { display: none !important; }
        [data-theme="light"] .history-root .h-nav { background: rgba(250,248,245,0.72); }
        .h-logo {
          font-family: var(--font-logo); font-size: 1.15rem; font-weight: 800;
          color: var(--text); text-decoration: none; letter-spacing: -0.01em;
          display: flex; align-items: center; gap: 8px; cursor: pointer;
        }
        .h-logo-accent { color: var(--accent); }
        .h-logo-dot {
          width: 6px; height: 6px; border-radius: 50%; background: var(--accent);
          animation: pulse 2s ease-in-out infinite;
        }
        .h-nav-right { display: flex; align-items: center; gap: 14px; }
        .h-back, .h-theme-btn {
          font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted);
          border: 1px solid var(--border2); padding: 8px 16px; background: none;
          letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none;
          transition: all 0.2s; display: flex; align-items: center; gap: 8px;
          cursor: pointer; -webkit-tap-highlight-color: transparent; min-height: 40px;
        }
        .h-back:hover, .h-theme-btn:hover { color: var(--text); border-color: var(--accent); }

        /* ── SIDE YEAR RAIL ── */
        .h-rail {
          position: fixed; left: 40px; top: 50%; transform: translateY(-50%);
          z-index: 90; display: flex; flex-direction: column; gap: 18px;
        }
        .h-rail-item {
          display: flex; align-items: center; gap: 10px; cursor: pointer;
          background: none; border: none; padding: 0; color: var(--muted);
          font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.12em;
          transition: color 0.25s;
        }
        .h-rail-dot {
          width: 8px; height: 8px; border-radius: 50%;
          border: 1px solid var(--border2); transition: all 0.25s var(--ease-out);
        }
        .h-rail-item.active { color: var(--text); }
        .h-rail-item.active .h-rail-dot {
          background: var(--accent); border-color: var(--accent);
          box-shadow: 0 0 0 4px rgba(232,69,69,0.15); transform: scale(1.2);
        }
        .h-rail-label { opacity: 0; transform: translateX(-6px); transition: all 0.25s; }
        .h-rail-item:hover .h-rail-label, .h-rail-item.active .h-rail-label {
          opacity: 1; transform: translateX(0);
        }

        /* ── CONTENT ── */
        .h-content { position: relative; z-index: 2; max-width: 1080px; margin: 0 auto; padding: 0 56px; }

        /* ── HERO ── */
        .h-hero { padding: 150px 0 60px; position: relative; }
        .h-eyebrow {
          font-family: var(--font-mono); font-size: 0.68rem; color: var(--accent);
          letter-spacing: 0.24em; text-transform: uppercase; margin-bottom: 28px;
          display: flex; align-items: center; gap: 14px;
        }
        .h-eyebrow::before { content: ''; width: 40px; height: 1px; background: var(--accent); }
        .h-headline {
          font-size: clamp(3rem, 9vw, 7rem); font-weight: 800;
          letter-spacing: -0.045em; line-height: 0.92; margin-bottom: 32px;
        }
        .h-headline em{font-family:var(--font-accent);font-style:italic;font-weight:400;color:var(--accent);}
        .h-headline em::after{display:none;}
        .h-subhead {
          font-size: 1.15rem; color: var(--muted); line-height: 1.7;
          max-width: 560px; margin-bottom: 56px;
        }

        /* ── STATS STRIP ── */
        .h-stats {
          display: grid; grid-template-columns: repeat(4, 1fr);
          border: 1px solid var(--border); border-radius: 16px; overflow: hidden;
          background: var(--surface);
        }
        .h-stat { padding: 28px 24px; border-right: 1px solid var(--border); position: relative; }
        .h-stat:last-child { border-right: none; }
        .h-stat-k {
          font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 800; letter-spacing: -0.03em;
          line-height: 1; margin-bottom: 8px;
          background: linear-gradient(135deg, var(--text), var(--muted));
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
        }
        .h-stat-v {
          font-family: var(--font-mono); font-size: 0.6rem; color: var(--muted);
          letter-spacing: 0.12em; text-transform: uppercase;
        }

        /* ── SECTION HEADS ── */
        .h-sec-head { margin: 130px 0 60px; }
        .h-sec-label {
          font-family: var(--font-mono); font-size: 0.66rem; color: var(--muted);
          letter-spacing: 0.22em; text-transform: uppercase; margin-bottom: 18px;
          display: flex; align-items: center; gap: 12px;
        }
        .h-sec-label::before { content: ''; width: 32px; height: 1px; background: var(--muted); }
        .h-sec-title {
          font-size: clamp(2rem, 5vw, 3.4rem); font-weight: 800;
          letter-spacing: -0.04em; line-height: 1.02;
        }

        /* ── TIMELINE ── */
        .h-timeline { position: relative; }
        .h-titem {
          position: relative; display: grid; grid-template-columns: 140px 1fr;
          gap: 40px; padding-bottom: 8px; margin-bottom: 24px;
        }
        .h-titem-left { position: relative; }
        .h-titem-year {
          font-family: var(--font-logo); font-size: 1.5rem; font-weight: 700;
          letter-spacing: 0.04em; position: sticky; top: 100px;
        }
        .h-titem-tag {
          font-family: var(--font-mono); font-size: 0.58rem; color: var(--muted);
          letter-spacing: 0.16em; text-transform: uppercase; margin-top: 6px;
          position: sticky; top: 132px;
        }
        .h-titem-card {
          position: relative; border: 1px solid var(--border); border-radius: 18px;
          background: var(--surface); padding: 40px 40px 40px 44px; overflow: hidden;
          transition: border-color 0.35s var(--ease-out), transform 0.35s var(--ease-out), background 0.35s;
        }
        .h-titem-card::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: var(--card-accent); opacity: 0.85;
        }
        .h-titem-card:hover { border-color: var(--border2); transform: translateY(-4px); background: var(--surface2); }
        .h-ghost-year {
          position: absolute; right: 24px; top: -14px;
          font-family: var(--font-logo); font-weight: 700;
          font-size: clamp(5rem, 10vw, 8rem); line-height: 1;
          color: var(--ghost); letter-spacing: -0.02em; pointer-events: none; user-select: none;
        }
        .h-ttitle {
          font-size: clamp(1.4rem, 3vw, 2.1rem); font-weight: 800;
          letter-spacing: -0.03em; margin-bottom: 18px; line-height: 1.08;
          position: relative; z-index: 1; max-width: 80%;
        }
        .h-tbody {
          font-size: 1rem; color: var(--muted); line-height: 1.78;
          max-width: 620px; position: relative; z-index: 1;
        }
        .h-tchip {
          display: inline-flex; align-items: center; gap: 8px; margin-top: 24px;
          font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--card-accent);
          border: 1px solid var(--border2); border-radius: 999px; padding: 7px 14px;
          position: relative; z-index: 1;
        }
        .h-tchip::before {
          content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--card-accent);
        }

        /* ── VISION BENTO ── */
        .h-bento {
          display: grid; grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: minmax(200px, auto); gap: 16px;
        }
        .h-pillar {
          background: var(--surface); border: 1px solid var(--border); border-radius: 18px;
          padding: 36px; transition: border-color 0.3s, background 0.3s, transform 0.3s var(--ease-out);
          position: relative; overflow: hidden; display: flex; flex-direction: column;
        }
        .h-pillar:hover { border-color: var(--border2); background: var(--surface2); transform: translateY(-4px); }
        .h-pillar.wide { grid-column: span 2; }
        .h-pillar.tall { grid-row: span 2; }
        .h-pillar-glow {
          position: absolute; width: 220px; height: 220px; border-radius: 50%;
          filter: blur(60px); opacity: 0.14; top: -60px; right: -60px; pointer-events: none;
        }
        .h-pillar-icon {
          font-size: 1.9rem; margin-bottom: 22px; display: block; line-height: 1;
        }
        .h-pillar-title {
          font-size: 1.15rem; font-weight: 800; letter-spacing: -0.02em;
          margin-bottom: 14px; line-height: 1.2;
        }
        .h-pillar-body { font-size: 0.9rem; color: var(--muted); line-height: 1.72; }

        /* ── CTA ── */
        .h-cta {
          margin: 130px 0 40px; border: 1px solid var(--border); border-radius: 24px;
          background: linear-gradient(135deg, var(--surface), var(--surface2));
          padding: 72px 56px; text-align: center; position: relative; overflow: hidden;
        }
        .h-cta::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 60% 100% at 50% 0%, rgba(232,69,69,0.12), transparent 70%);
        }
        .h-cta-title {
          font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 800; letter-spacing: -0.04em;
          line-height: 1.05; margin-bottom: 18px; position: relative;
        }
        .h-cta-sub { color: var(--muted); font-size: 1.02rem; max-width: 460px; margin: 0 auto 32px; position: relative; }
        .h-cta-btn {
          display: inline-flex; align-items: center; gap: 10px; position: relative;
          background: var(--accent); color: #fff; text-decoration: none;
          font-weight: 700; font-size: 0.95rem; padding: 15px 32px; border-radius: 999px;
          transition: transform 0.25s var(--ease-out), box-shadow 0.25s;
          box-shadow: 0 8px 30px rgba(232,69,69,0.3);
        }
        .h-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(239,68,68,0.3); }

        /* ── FOOTER ── */
        .h-footer {
          position: relative; z-index: 2; border-top: 1px solid var(--border);
          padding: 32px 56px; max-width: 1080px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
        }
        .h-footer-copy {
          font-family: var(--font-mono); font-size: 0.6rem; color: var(--muted);
          letter-spacing: 0.08em; text-transform: uppercase;
        }
        .h-footer-links { display: flex; gap: 24px; }
        .h-footer-link {
          font-family: var(--font-mono); font-size: 0.6rem; color: var(--muted);
          text-decoration: none; letter-spacing: 0.08em; text-transform: uppercase;
          transition: color 0.2s;
        }
        .h-footer-link:hover { color: var(--text); }

        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.5; transform: scale(0.85); }
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1160px) { .h-rail { display: none; } }
        @media (max-width: 860px) {
          .h-nav { padding: 0 20px; }
          .h-content { padding: 0 20px; }
          .h-footer { padding: 24px 20px; flex-direction: column; align-items: flex-start; }
          .h-stats { grid-template-columns: repeat(2, 1fr); }
          .h-stat:nth-child(2) { border-right: none; }
          .h-stat:nth-child(1), .h-stat:nth-child(2) { border-bottom: 1px solid var(--border); }
          .h-titem { grid-template-columns: 1fr; gap: 14px; }
          .h-titem-year, .h-titem-tag { position: static; }
          .h-titem-year { font-size: 1.2rem; }
          .h-titem-card { padding: 30px 26px; }
          .h-ttitle { max-width: 100%; }
          .h-bento { grid-template-columns: 1fr; grid-auto-rows: auto; }
          .h-pillar.wide, .h-pillar.tall { grid-column: auto; grid-row: auto; }
          .h-cta { padding: 52px 28px; }
        }
        @media (max-width: 480px) {
          .h-stats { grid-template-columns: 1fr; }
          .h-stat { border-right: none; border-bottom: 1px solid var(--border); }
          .h-stat:last-child { border-bottom: none; }
          .h-back span:last-child { display: none; }
        }
        @media (hover: none) and (pointer: coarse) {
          .h-nav { backdrop-filter: none; -webkit-backdrop-filter: none; background: var(--bg); }
        }

        ::selection { background: var(--accent); color: #fff; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--border2); }
      `}</style>

      {/* BG */}
      <div className="h-bg-glow" />
      <div className="h-grid-overlay" />
      <motion.div className="h-scroll-bar" style={{ scaleX: progress }} />

      {/* SIDE RAIL */}
      <div className="h-rail">
        {timeline.map((y) => (
          <button
            key={y.year}
            className={`h-rail-item${activeYear === y.year ? " active" : ""}`}
            onClick={() => {
              document.getElementById(`year-${y.year}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
          >
            <span className="h-rail-dot" />
            <span className="h-rail-label">{y.year}</span>
          </button>
        ))}
      </div>

      <div className="h-content">
        {/* HERO */}
        <section className="h-hero">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 120 }}
          >
            <div className="h-eyebrow">{t("Our Story")}</div>
            <h1 className="h-headline">
              {t("The Evolution")}<br />{t("of ")}<em>Mega Devs</em>
            </h1>
            <p className="h-subhead">
              {t("From a specialized software studio to a multi-team technology organization — a four-year journey defined by disciplined engineering, strategic growth, and a commitment to building at scale.")}
            </p>
          </motion.div>

          <motion.div
            className="h-stats"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 130, delay: 0.15 }}
          >
            {stats.map((s) => (
              <div className="h-stat" key={s.v}>
                <div className="h-stat-k">{s.k}</div>
                <div className="h-stat-v">{t(s.v)}</div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* TIMELINE */}
        <div className="h-sec-head">
          <div className="h-sec-label">{t("Company Timeline")}</div>
          <h2 className="h-sec-title">{t("Five defining milestones.")}</h2>
        </div>

        <div className="h-timeline">
          {timeline.map((item, i) => (
            <motion.div
              key={item.year}
              id={`year-${item.year}`}
              className="h-titem"
              style={{ ["--card-accent" as string]: item.accent }}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-45% 0px -45% 0px" }}
              onViewportEnter={() => setActiveYear(item.year)}
              transition={{ type: "spring", damping: 24, stiffness: 130, delay: i * 0.05 }}
            >
              <div className="h-titem-left">
                <div className="h-titem-year" style={{ color: item.accent }}>{item.year}</div>
                <div className="h-titem-tag">{t(item.tag)}</div>
              </div>
              <div className="h-titem-card">
                <span className="h-ghost-year">{item.year}</span>
                <h3 className="h-ttitle">{t(item.title)}</h3>
                <p className="h-tbody">{t(item.body)}</p>
                <span className="h-tchip">{t(item.stat)}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* VISION */}
        <div className="h-sec-head">
          <div className="h-sec-label">{t("Looking Ahead · 2026 – 2036")}</div>
          <h2 className="h-sec-title">{t("Our vision for")}<br />{t("the decade ahead.")}</h2>
        </div>

        <div className="h-bento">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              className={`h-pillar ${p.span}`}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", damping: 24, stiffness: 130, delay: i * 0.06 }}
            >
              <div
                className="h-pillar-glow"
                style={{ background: i % 2 === 0 ? "var(--accent)" : "var(--accent3)" }}
              />
              <span className="h-pillar-icon" style={{ color: i % 2 === 0 ? "var(--accent)" : "var(--accent3)" }}>
                {p.icon}
              </span>
              <div className="h-pillar-title">{t(p.title)}</div>
              <p className="h-pillar-body">{t(p.body)}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="h-cta"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 24, stiffness: 130 }}
        >
          <h2 className="h-cta-title">{t("The next chapter")}<br />{t("is already underway.")}</h2>
          <p className="h-cta-sub">{t("Interested in building with us? We'd welcome the opportunity to discuss your project.")}</p>
          <a href="/#contact" className="h-cta-btn">{t("Start a Project →")}</a>
        </motion.div>
      </div>

      {/* FOOTER */}
      <footer className="h-footer">
        <span className="h-footer-copy">{t("© 2026 Mega Devs. All rights reserved.")}</span>
        <div className="h-footer-links">
          <a href="/" className="h-footer-link">{t("Home")}</a>
          <a href="/works" className="h-footer-link">{t("Work")}</a>
          <a href="/#contact" className="h-footer-link">{t("Contact")}</a>
        </div>
      </footer>
    </div>
  );
}
