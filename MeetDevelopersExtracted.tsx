"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const developers = [
  {
    name: "Adham Ahmed",
    role: "Frontend, ROM & Web Developer",
    telegram: "https://t.me/AdhamBinAhmed",
    github: "https://github.com/llxcd",
    image: "/developers/ahmed.jpg",
    tag: "Founder",
    index: "01",
  },
  {
    name: "Seif El-Din Ismail",
    role: "Full Stack & Root Developer",
    telegram: "https://t.me/X_oEG",
    github: "https://github.com/QOS3",
    image: "/developers/seif.jpg",
    tag: "CTO",
    index: "02",
  },
];

export default function MeetDevelopers() {
  return (
    <>
      <style>{`
        /* ── THEME TOKENS (Modify these as needed for your new project) ── */
        :root {
          --surface:  #0d0d10;
          --border:   rgba(255,255,255,0.06);
          --border2:  rgba(255,255,255,0.12);
          --text:     #f0f0f2;
          --muted:    #6b6b7a;
          --faint:    #2a2a32;
          --accent:   #e84545;
          --green:    #22c55e;
          --glow:     rgba(232,69,69,0.15);
          
          /* Fallback fonts if CSS variables are not set in the parent */
          --font-display: 'Outfit', sans-serif;
          --font-mono:    'JetBrains Mono', monospace;
        }

        /* ── GLASSMORPHISM ── */
        .glass-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01));
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-left: 1px solid rgba(255, 255, 255, 0.08);
        }
        @media (prefers-color-scheme: light) {
          .glass-card {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.4));
            border: 1px solid rgba(255, 255, 255, 0.5);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
          }
        }

        /* ── SECTION CORE ── */
        .section { padding: 140px 56px; position: relative; z-index: 2; background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .section-inner { max-width: 1200px; margin: 0 auto; }
        .section-eyebrow {
          display: flex; align-items: center; gap: 16px; margin-bottom: 20px;
        }
        .section-tag {
          font-family: var(--font-mono); font-size: 0.6rem; color: var(--accent);
          letter-spacing: 0.2em; text-transform: uppercase; font-weight: 600;
        }
        .section-line { height: 1px; width: 40px; background: var(--accent); }
        .section-num { font-family: var(--font-mono); font-size: 0.6rem; color: var(--faint); letter-spacing: 0.1em; }
        .section-title {
          font-family: var(--font-display); font-size: clamp(2.5rem, 5vw, 5rem);
          font-weight: 900; letter-spacing: -0.04em; color: var(--text);
          line-height: 1; margin-bottom: 80px; max-width: 16ch;
        }
        .section-title em { font-style: normal; color: var(--accent); }

        /* ── STATUS INDICATOR ── */
        .status-live { width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: pulse 2s ease-in-out infinite; display: inline-block; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }

        /* ── TEAM ── */
        .team-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
        .dev-card {
          padding: 48px; position: relative; overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s;
          border-radius: 24px;
        }
        .dev-card::after {
          content: attr(data-index);
          position: absolute; bottom: -20px; right: -10px;
          font-family: var(--font-display); font-size: 8rem; font-weight: 900;
          color: var(--faint); pointer-events: none; line-height: 1; letter-spacing: -0.05em;
          transition: color 0.3s;
        }
        .dev-card:hover { border-color: var(--border2); transform: translateY(-4px); box-shadow: 0 32px 80px rgba(0,0,0,0.4); }
        .dev-card:hover::after { color: rgba(232,69,69,0.1); }
        .dev-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; flex-wrap: wrap; gap: 12px; }
        .dev-tag { font-family: var(--font-mono); font-size: 0.6rem; color: var(--accent); letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700; }
        .dev-online { display: flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 0.6rem; color: var(--green); }
        .dev-avatar {
          width: 72px; height: 72px; object-fit: cover; display: block;
          margin-bottom: 24px; border: 2px solid var(--border2); position: relative; z-index: 1;
          clip-path: polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%, 0 85%);
          transition: border-color 0.3s;
        }
        .dev-card:hover .dev-avatar { border-color: var(--accent); }
        .dev-name { font-size: 1.6rem; font-weight: 800; color: var(--text); letter-spacing: -0.03em; margin-bottom: 6px; position: relative; z-index: 1; }
        .dev-role { font-size: 0.85rem; color: var(--muted); margin-bottom: 32px; line-height: 1.6; position: relative; z-index: 1; }
        .dev-links { display: flex; gap: 10px; position: relative; z-index: 1; flex-wrap: wrap; }
        .dev-link {
          font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted);
          border: 1px solid var(--border2); padding: 8px 16px; text-decoration: none;
          transition: all 0.2s; display: flex; align-items: center; gap: 6px;
        }
        .dev-link:hover { border-color: var(--accent); color: var(--accent); background: var(--glow); }

        /* ── RESPONSIVE ── */
        @media (max-width: 960px) {
          .section { padding: 100px 24px; }
          .team-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .section-title { font-size: clamp(2rem, 8vw, 3rem); }
          .dev-card { padding: 32px 24px; }
        }
      `}</style>

      <section id="developers" className="section">
        <div className="section-inner">
          <div className="section-eyebrow">
            <div className="section-line" />
            <span className="section-tag">The Team</span>
            <span className="section-num">§04</span>
          </div>
          <h2 className="section-title">Meet the <em>engineers</em></h2>
          <div className="team-grid">
            {developers.map((d, i) => (
              <motion.div
                key={d.name} className="dev-card glass-card" data-index={d.index}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -5 }}
                viewport={{ once: true }} transition={{ type: "spring", damping: 20, stiffness: 100, delay: i * 0.1 }}
              >
                <div className="dev-top">
                  <span className="dev-tag">{d.tag}</span>
                  <span className="dev-online"><span className="status-live" />Available</span>
                </div>
                <Image src={d.image} alt={`Photo of ${d.name}`} width={72} height={72} className="dev-avatar" priority />
                <div className="dev-name">{d.name}</div>
                <div className="dev-role">{d.role}</div>
                <div className="dev-links">
                  <a href={d.telegram} target="_blank" rel="noopener noreferrer" className="dev-link">✈ Telegram</a>
                  <a href={d.github} target="_blank" rel="noopener noreferrer" className="dev-link">⌥ GitHub</a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
