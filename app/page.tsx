"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useMemo } from "react";
import MagneticButton from "./components/MagneticButton";

// ─── DATA ─────────────────────────────────────────────────────────────────────

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

const services = [
  {
    num: "01",
    title: "Web Engineering",
    sub: "Frontend · Backend · Edge",
    desc: "Pixel-perfect frontends backed by bulletproof APIs. We obsess over load times, core web vitals, and the details that separate good from great.",
    metric: "47ms",
    metricLabel: "avg. deploy time",
    output: "> deploying to edge... done in 47ms",
    icon: "◈",
  },
  {
    num: "02",
    title: "Android ROMs",
    sub: "Kernel · AOSP · OEM",
    desc: "Custom kernels with hand-tuned governors, debloated system images, and minimal UI overlays. Real performance, not benchmarks.",
    metric: "12s",
    metricLabel: "cold boot time",
    output: "> kernel patched... boot: 12s",
    icon: "◉",
  },
  {
    num: "03",
    title: "Backend Architecture",
    sub: "APIs · Infra · Databases",
    desc: "Systems engineered to grow. From 10 users to 10 million — horizontal scaling, zero-downtime deploys, and 99.9% uptime SLAs.",
    metric: "847d",
    metricLabel: "longest uptime",
    output: "> uptime: 847 days... nominal",
    icon: "◎",
  },
  {
    num: "04",
    title: "AI & ML Systems",
    sub: "Training · Inference · Pipelines",
    desc: "Models that ship to production, not stay in notebooks. Fast inference, clean pipelines, and accuracy numbers that mean something.",
    metric: "94.2%",
    metricLabel: "production accuracy",
    output: "> inference: 8ms... acc: 94.2%",
    icon: "◇",
  },
];

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
    link: "#works",
  },
  {
    num: "04",
    title: "DevPanel",
    category: "Backend",
    year: "2024",
    desc: "Internal server management dashboard with live metrics, SSH tunneling, log streaming, and smart alerting. 847+ days without downtime.",
    tags: ["Node.js", "WebSockets", "Linux", "Nginx"],
    status: "Private",
    link: "#works",
  },
];

const stats = [
  { value: "847d", label: "Max Uptime" },
  { value: "4+", label: "Live Products" },
  { value: "<24h", label: "Response Time" },
  { value: "2x", label: "Dev Team" },
];

const techStack = [
  { name: "Next.js", cat: "Framework" },
  { name: "React", cat: "UI" },
  { name: "Python", cat: "Lang" },
  { name: "C++", cat: "System" },
  { name: "Arch Linux", cat: "OS" },
  { name: "Android ROMs", cat: "Platform" },
  { name: "TailwindCSS", cat: "Styling" },
  { name: "PostgreSQL", cat: "DB" },
  { name: "Docker", cat: "Infra" },
  { name: "PyTorch", cat: "ML" },
  { name: "Node.js", cat: "Runtime" },
  { name: "Nginx", cat: "Server" },
];

const nav = [
  { l: "Services", h: "#services" },
  { l: "Works", h: "/works" },
  { l: "Stack", h: "#stack" },
  { l: "Team", h: "#developers" },
  { l: "Contact", h: "#contact" },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function Home() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdVal, setCmdVal] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [hoveredWork, setHoveredWork] = useState<number | null>(null);
  const [activeService, setActiveService] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 750, damping: 38 });
  const springY = useSpring(cursorY, { stiffness: 750, damping: 38 });
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacityRaw = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const heroYRaw = useTransform(scrollYProgress, [0, 0.18], [0, -60]);
  // On mobile, skip parallax entirely (saves a scroll listener + layout repaints)
  const heroOpacity = isMobile ? 1 : heroOpacityRaw;
  const heroY = isMobile ? 0 : heroYRaw;

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (isMobile) return;
    const move = (e: MouseEvent) => { cursorX.set(e.clientX); cursorY.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [cursorX, cursorY, isMobile]);

  useEffect(() => {
    const update = () => {
      setCurrentTime(
        new Date().toLocaleString("en-GB", {
          timeZone: "Africa/Cairo",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => setScrollPct(v));
    return () => unsub();
  }, [scrollYProgress]);

  useEffect(() => {
    const kd = (e: KeyboardEvent) => {
      if (e.key === "/" && !cmdOpen) { e.preventDefault(); setCmdOpen(true); }
      if (e.key === "Escape") { setCmdOpen(false); setMenuOpen(false); }
    };
    window.addEventListener("keydown", kd);
    return () => window.removeEventListener("keydown", kd);
  }, [cmdOpen]);

  // Auto-cycle services
  useEffect(() => {
    const t = setInterval(() => setActiveService(s => (s + 1) % services.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="root" data-theme={theme}>
      <style>{`
        /* ── THEME TOKENS ── */
        :root, [data-theme="dark"] {
          --bg:       #050507;
          --surface:  #0d0d10;
          --surface2: #131318;
          --border:   rgba(255,255,255,0.06);
          --border2:  rgba(255,255,255,0.12);
          --text:     #f0f0f2;
          --muted:    #6b6b7a;
          --faint:    #2a2a32;
          --accent:   #e84545;
          --accent2:  #ff7043;
          --accent3:  #ffd166;
          --green:    #22c55e;
          --glow:     rgba(232,69,69,0.15);
          --nav-bg:   rgba(5,5,7,0.85);
          --stats-bg: #0d0d10;
        }

        [data-theme="light"] {
          --bg:       #faf8f5;
          --surface:  #ffffff;
          --surface2: #f0ede8;
          --border:   rgba(0,0,0,0.07);
          --border2:  rgba(0,0,0,0.14);
          --text:     #111111;
          --muted:    #7a7570;
          --faint:    #e0dbd4;
          --accent:   #c8392b;
          --accent2:  #e8571a;
          --accent3:  #c08b20;
          --green:    #14532d;
          --glow:     rgba(200,57,43,0.08);
          --nav-bg:   rgba(250,248,245,0.9);
          --stats-bg: #ffffff;
        }

        [data-theme="light"] .bg-grid {
          background-image:
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
        }
        [data-theme="light"] .bg-glow {
          background:
            radial-gradient(ellipse 60% 50% at 10% 20%, rgba(200,57,43,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 90% 80%, rgba(232,87,26,0.05) 0%, transparent 70%);
        }
        [data-theme="light"] .noise { opacity: 0.02; }

        .theme-btn { font-size: 1rem !important; padding: 0 12px !important; }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        :root {
          --font-display: var(--font-outfit, 'Outfit'), sans-serif;
          --font-mono:    var(--font-jetbrains, 'JetBrains Mono'), monospace;
          --font-logo:    var(--font-logo, 'Orbitron'), sans-serif;
          --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
          --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-display);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
          cursor: auto;
          transition: background 0.3s, color 0.3s;
        }
        @media (hover: hover) and (pointer: fine) {
          body { cursor: none; }
        }

        ::selection { background: var(--accent); color: #fff; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--faint); border-radius: 2px; }
        :focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }

        @media (hover: hover) and (pointer: fine) {
          a { cursor: none; }
        }

        /* ── GLASSMORPHISM ── */
        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
        }
        [data-theme="light"] .glass-panel {
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.05);
        }
        
        .glass-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01));
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-left: 1px solid rgba(255, 255, 255, 0.08);
        }
        [data-theme="light"] .glass-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.4));
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
        }

        /* ── CUSTOM CURSOR ── */
        .cursor {
          position: fixed; z-index: 9999; top: 0; left: 0;
          width: 12px; height: 12px; background: var(--accent);
          border-radius: 50%; pointer-events: none;
          transform: translate(-50%, -50%);
          mix-blend-mode: difference;
          transition: width 0.2s, height 0.2s, background 0.2s;
        }

        /* ── SCROLL BAR ── */
        .scroll-bar {
          position: fixed; top: 0; left: 0; height: 2px;
          background: linear-gradient(90deg, var(--accent), var(--accent2), var(--accent3));
          z-index: 200; transition: width 0.1s linear; pointer-events: none;
        }
        @supports (animation-timeline: scroll()) {
          @media (hover: none) and (pointer: coarse) {
            .scroll-bar {
              width: 100% !important;
              transform-origin: left;
              transform: scaleX(0);
              animation: scroll-progress linear both;
              animation-timeline: scroll(root block);
              transition: none;
            }
            @keyframes scroll-progress { to { transform: scaleX(1); } }
          }
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
        /* Noise and heavy bg layers disabled on mobile — they paint every scroll frame */
        @media (hover: none) and (pointer: coarse) {
          .noise { display: none; }
          .bg-glow { display: none; }
        }

        /* ── NAV ── */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; justify-content: space-between; align-items: center;
          padding: 0 56px; height: 72px;
        }
        .logo {
          font-family: var(--font-logo); font-size: 1.1rem; font-weight: 700;
          color: var(--text); text-decoration: none; letter-spacing: 0.12em;
          display: flex; align-items: center; gap: 6px; cursor: pointer;
        }
        .logo-accent { color: var(--accent); }
        .logo-dot {
          width: 6px; height: 6px; border-radius: 50%; background: var(--accent);
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

        .nav-links { display: flex; align-items: center; gap: 36px; }
        .nav-link {
          color: var(--muted); font-size: 0.75rem; text-decoration: none;
          font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
          transition: color 0.2s; position: relative; padding: 4px 0; cursor: pointer;
        }
        .nav-link::after {
          content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 1px;
          background: var(--accent); transition: width 0.3s var(--ease-out);
        }
        .nav-link:hover { color: var(--text); }
        .nav-link:hover::after { width: 100%; }

        .nav-actions { display: flex; align-items: center; gap: 10px; }
        .nav-badge {
          font-family: var(--font-mono); font-size: 0.6rem; color: var(--muted);
          border: 1px solid var(--border2); padding: 4px 8px; letter-spacing: 0.08em;
          background: rgba(255,255,255,0.02);
        }
        .nav-btn {
          font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted);
          border: 1px solid var(--border2); padding: 8px 14px; background: transparent;
          cursor: pointer; letter-spacing: 0.1em; text-transform: uppercase;
          transition: all 0.2s; min-height: 36px; display: flex; align-items: center; gap: 6px;
        }
        .nav-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--glow); }
        .hamburger {
          display: none; flex-direction: column; gap: 5px;
          background: none; border: none; cursor: pointer; padding: 8px; align-items: center;
          -webkit-tap-highlight-color: transparent; min-width: 44px; min-height: 44px; justify-content: center;
        }
        .hamburger span { display: block; width: 20px; height: 1.5px; background: var(--muted); transition: all 0.3s; }
        .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(4px,4px); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(4px,-4px); }

        /* ── MOBILE MENU ── */
        .mobile-menu-overlay {
          position: fixed; inset: 0; z-index: 97;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(8px);
        }
        .mobile-menu {
          position: fixed; top: 0; right: 0; bottom: 0; width: 360px; max-width: 85vw; z-index: 98;
          background: linear-gradient(160deg, var(--surface), var(--surface2)); border-left: 1px solid var(--border); box-shadow: -30px 0 80px rgba(0,0,0,0.6);
          display: flex; flex-direction: column; align-items: flex-start; gap: 0; padding: 48px 40px;
        }
        .mobile-menu-header {
          font-family: var(--font-mono); font-size: 0.65rem; color: var(--accent);
          letter-spacing: 0.2em; text-transform: uppercase; padding-bottom: 24px; border-bottom: 1px solid var(--border); width: 100%;
        }
        .mobile-menu-footer {
          margin-top: auto; padding-top: 32px; border-top: 1px solid var(--border); width: 100%;
        }
        .mobile-menu a.nav-link-mobile {
          font-size: 2.2rem; font-weight: 800; color: var(--text); text-decoration: none;
          letter-spacing: -0.04em; text-transform: uppercase; transition: all 0.3s var(--ease-out); cursor: pointer;
          display: flex; align-items: center; position: relative;
        }
        .mobile-menu a.nav-link-mobile::before {
          content: ''; position: absolute; left: -24px; width: 12px; height: 2px; background: var(--accent);
          opacity: 0; transform: translateX(-10px); transition: all 0.3s var(--ease-out);
        }
        .mobile-menu a.nav-link-mobile:hover { color: var(--accent); transform: translateX(24px); }
        .mobile-menu a.nav-link-mobile:hover::before { opacity: 1; transform: translateX(0); }

        /* ── CMD PALETTE ── */
        .cmd-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(5,5,7,0.6); backdrop-filter: blur(16px);
          display: flex; align-items: flex-start; justify-content: center; padding: 80px 16px 16px;
        }
        .cmd-box {
          width: 100%; max-width: 560px; overflow: hidden;
          border-radius: 16px; margin: 0 auto;
        }
        .cmd-head {
          display: flex; align-items: center; gap: 12px;
          padding: 20px 24px; border-bottom: 1px solid var(--border);
        }
        .cmd-prompt { color: var(--accent); font-family: var(--font-mono); font-size: 0.875rem; font-weight: 700; }
        .cmd-input {
          background: transparent; border: none; color: var(--text);
          font-size: 1rem; font-family: var(--font-display); outline: none; width: 100%; font-weight: 600;
        }
        .cmd-esc { font-family: var(--font-mono); font-size: 0.6rem; color: var(--muted); border: 1px solid var(--border2); padding: 3px 7px; }
        .cmd-label { font-family: var(--font-mono); font-size: 0.6rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.12em; padding: 12px 24px 8px; }
        .cmd-item {
          display: flex; align-items: center; gap: 12px; padding: 12px 24px;
          color: var(--text); text-decoration: none; font-weight: 500; font-size: 0.875rem;
          border-left: 2px solid transparent; transition: all 0.15s;
        }
        .cmd-item:hover { background: var(--faint); border-left-color: var(--accent); color: var(--accent); }
        .cmd-arrow { color: var(--accent); font-family: var(--font-mono); }

        /* ── HERO ── */
        .hero {
          min-height: 100vh; min-height: 100svh; display: flex; flex-direction: column; justify-content: center;
          padding: 120px 56px 80px; position: relative; z-index: 2;
        }
        .hero-inner { max-width: 1200px; }
        .hero-eyebrow {
          display: flex; align-items: center; gap: 16px; margin-bottom: 36px;
        }
        .hero-tag {
          font-family: var(--font-mono); font-size: 0.65rem; color: var(--accent);
          letter-spacing: 0.2em; text-transform: uppercase; font-weight: 600;
        }
        .hero-line { flex: 1; height: 1px; background: linear-gradient(90deg, var(--accent), transparent); max-width: 120px; }
        .hero-title {
          font-family: var(--font-display); font-weight: 900;
          font-size: clamp(2.8rem, 9vw, 11rem); line-height: 1; letter-spacing: -0.05em;
          color: var(--text); margin-bottom: 40px;
          display: flex; flex-direction: column; gap: 0;
        }
        .hero-title-accent {
          display: block;
          background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 50%, var(--accent3) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .hero-sub {
          font-size: clamp(0.95rem, 1.5vw, 1.2rem); color: var(--muted);
          line-height: 1.75; max-width: 52ch; margin-bottom: 56px;
        }
        .hero-sub strong { color: var(--text); font-weight: 600; }
        .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; align-items: center; }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 16px 36px; background: var(--accent); color: #fff;
          font-weight: 700; font-size: 0.875rem; text-decoration: none; letter-spacing: 0.04em;
          transition: all 0.2s; position: relative; overflow: hidden;
        }
        .btn-primary {
          background: var(--text);
          color: var(--bg);
          border-radius: 9999px;
          padding: 16px 32px;
          border: none;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        }

        .btn-ghost {
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          padding: 16px 32px; color: var(--text); font-size: 0.95rem; font-weight: 600;
          border: 1px solid var(--border2); text-decoration: none;
          border-radius: 9999px; background: transparent;
          transition: all 0.2s ease;
        }
        .btn-ghost:hover { border-color: var(--text); transform: translateY(-2px); }
        .hero-status {
          position: absolute; bottom: 48px; right: 56px;
          font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted);
          display: flex; flex-direction: column; align-items: flex-end; gap: 6px;
        }
        @media (max-width: 480px) {
          .hero-status { right: 16px; bottom: 20px; font-size: 0.55rem; }
        }
        .hero-status-row { display: flex; align-items: center; gap: 8px; }
        .status-live { width: 6px; height: 6px; border-radius: 50%; background: var(--green); background: #14532d; animation: pulse 2s ease-in-out infinite; flex-shrink: 0; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }

        /* ── STATS BAR ── */
        .stats-bar {
          position: relative; z-index: 2; border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          display: grid; grid-template-columns: repeat(4, 1fr);
          background: var(--surface);
        }
        .stat-item {
          padding: 40px 48px; border-right: 1px solid var(--border);
          display: flex; flex-direction: column; gap: 6px;
        }
        .stat-item:last-child { border-right: none; }
        .stat-value {
          font-family: var(--font-display); font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 900; letter-spacing: -0.04em; color: var(--text);
          background: linear-gradient(135deg, var(--text), var(--muted));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .stat-label { font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted); letter-spacing: 0.12em; text-transform: uppercase; }

        /* ── SECTION CORE ── */
        .section { padding: 140px 56px; position: relative; z-index: 2; }
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

        /* ── SERVICES ── */
        .services-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; background: var(--border); }
        .service-card {
          padding: 56px 48px; text-decoration: none; display: block;
          position: relative; overflow: hidden; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s;
          border-radius: 24px;
          margin: 8px; /* space for the hover spring */
        }
        .service-card::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, var(--glow), transparent 60%);
          opacity: 0; transition: opacity 0.4s;
        }
        .service-card.active { background: var(--surface2); border-color: var(--border2); }
        .service-card.active::before { opacity: 1; }
        .service-card:hover { background: var(--surface2); }
        .service-card:hover::before { opacity: 1; }
        .service-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
        .service-icon { font-size: 1.5rem; color: var(--accent); line-height: 1; }
        .service-num-tag { font-family: var(--font-mono); font-size: 0.6rem; color: var(--muted); letter-spacing: 0.12em; }
        .service-title { font-size: clamp(1.4rem, 2.5vw, 2rem); font-weight: 800; color: var(--text); letter-spacing: -0.03em; margin-bottom: 6px; }
        .service-sub { font-family: var(--font-mono); font-size: 0.65rem; color: var(--accent); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 20px; }
        .service-desc { color: var(--muted); font-size: 0.925rem; line-height: 1.75; margin-bottom: 32px; }
        .service-metric { display: flex; align-items: baseline; gap: 8px; padding-top: 24px; border-top: 1px solid var(--border); }
        .service-metric-val { font-family: var(--font-display); font-size: 2rem; font-weight: 900; color: var(--accent); letter-spacing: -0.04em; }
        .service-metric-label { font-family: var(--font-mono); font-size: 0.6rem; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; }
        .service-output {
          position: absolute; bottom: 24px; right: 24px;
          font-family: var(--font-mono); font-size: 0.6rem; color: var(--muted);
          opacity: 0; transition: opacity 0.3s; pointer-events: none;
        }
        .service-card:hover .service-output,
        .service-card.active .service-output { opacity: 1; }

        /* ── WORKS ── */
        .works-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 80px; flex-wrap: wrap; gap: 32px; }
        .works-filter-hint { font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted); letter-spacing: 0.1em; }
        .works-list { display: flex; flex-direction: column; gap: 2px; }
        .work-row {
          display: grid; grid-template-columns: 80px 1fr 120px 120px;
          align-items: center; gap: 32px;
          padding: 32px 40px; background: var(--surface); border: 1px solid transparent;
          text-decoration: none; transition: all 0.3s var(--ease-out); position: relative; overflow: hidden;
        }
        .work-row::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
          background: var(--accent); transform: scaleY(0); transform-origin: bottom;
          transition: transform 0.3s var(--ease-out);
        }
        .work-row:hover { background: var(--surface2); border-color: var(--border2); padding-left: 56px; }
        .work-row:hover::before { transform: scaleY(1); }
        .work-row-num { font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted); letter-spacing: 0.1em; }
        .work-row-info { min-width: 0; }
        .work-row-cat { font-family: var(--font-mono); font-size: 0.6rem; color: var(--accent); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; }
        .work-row-title { font-size: 1.4rem; font-weight: 800; color: var(--text); letter-spacing: -0.03em; margin-bottom: 8px; }
        .work-row-tags { display: flex; gap: 6px; flex-wrap: wrap; }
        .work-tag { font-family: var(--font-mono); font-size: 0.55rem; color: var(--muted); border: 1px solid var(--border2); padding: 3px 8px; letter-spacing: 0.06em; }
        .work-row-year { font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted); text-align: right; }
        .work-status {
          font-family: var(--font-mono); font-size: 0.6rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase; padding: 5px 12px;
          border: 1px solid; text-align: center;
        }
        .work-status.live { color: var(--green); border-color: rgba(34,197,94,0.3); background: rgba(34,197,94,0.05); }
        .work-status.private { color: var(--accent); border-color: rgba(232,69,69,0.3); background: var(--glow); }
        .work-expand {
          position: absolute; inset: 0; pointer-events: none;
          display: flex; align-items: flex-end; padding: 16px 40px;
          font-size: 0.8rem; color: var(--muted); opacity: 0; transition: opacity 0.2s;
          background: linear-gradient(90deg, transparent 0%, rgba(5,5,7,0.8) 60%);
        }
        .work-row:hover .work-expand { opacity: 1; }

        /* ── STACK ── */
        .stack-layout { display: grid; grid-template-columns: 1fr 2fr; gap: 80px; align-items: start; }
        .stack-left-title {
          font-size: clamp(2rem, 4vw, 4rem); font-weight: 900; letter-spacing: -0.04em;
          color: var(--text); line-height: 1; margin-bottom: 32px;
        }
        .stack-meta-list { display: flex; flex-direction: column; gap: 16px; }
        .stack-meta-row { display: flex; flex-direction: column; gap: 4px; padding: 16px 0; border-bottom: 1px solid var(--border); }
        .stack-meta-key { font-family: var(--font-mono); font-size: 0.6rem; color: var(--accent); letter-spacing: 0.12em; text-transform: uppercase; }
        .stack-meta-val { font-size: 0.875rem; color: var(--muted); }
        .stack-tags { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 2px; background: var(--border); }
        .stack-tag {
          background: var(--surface); padding: 24px 28px; display: flex; flex-direction: column; gap: 6px;
          transition: all 0.2s; border: 1px solid transparent;
        }
        .stack-tag:hover { background: var(--surface2); border-color: var(--border2); transform: translateY(-2px); }
        .stack-tag-name { font-size: 0.95rem; font-weight: 700; color: var(--text); letter-spacing: -0.02em; }
        .stack-tag-cat { font-family: var(--font-mono); font-size: 0.55rem; color: var(--accent); letter-spacing: 0.1em; text-transform: uppercase; }

        /* ── TEAM ── */
        .team-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
        .dev-card {
          background: var(--surface); border: 1px solid var(--border);
          padding: 48px; position: relative; overflow: hidden;
          transition: all 0.4s var(--ease-out);
        }
        .dev-card::after {
          content: attr(data-index);
          position: absolute; bottom: -20px; right: -10px;
          font-family: var(--font-display); font-size: 8rem; font-weight: 900;
          color: var(--faint); pointer-events: none; line-height: 1; letter-spacing: -0.05em;
          transition: color 0.3s;
        }
        .dev-card:hover { border-color: var(--border2); transform: translateY(-4px); box-shadow: 0 32px 80px rgba(0,0,0,0.4); }
        @media (hover: none) { .dev-card { transition: none !important; } }
        .dev-card:hover::after { color: rgba(232,69,69,0.1); }
        .dev-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; flex-wrap: wrap; gap: 12px; }
        .dev-tag { font-family: var(--font-mono); font-size: 0.6rem; color: var(--accent); letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700; }
        .dev-online { display: flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 0.85rem; font-weight: 900; color: #14532d; }
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
          border: 1px solid var(--border2); padding: 10px 16px; text-decoration: none;
          transition: all 0.2s; display: flex; align-items: center; gap: 6px;
          min-height: 44px; cursor: pointer; -webkit-tap-highlight-color: transparent;
        }
        .dev-link:hover { border-color: var(--accent); color: var(--accent); background: var(--glow); }

        /* ── CONTACT ── */
        .contact-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
        .contact-desc { font-size: 1.1rem; color: var(--muted); line-height: 1.8; margin-bottom: 48px; max-width: 42ch; }
        .contact-links { display: flex; flex-direction: column; gap: 0; margin-bottom: 48px; }
        .contact-link {
          color: var(--text); font-size: clamp(1rem, 2.5vw, 1.6rem); font-weight: 800;
          text-decoration: none; letter-spacing: -0.02em; padding: 24px 0;
          border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between;
          transition: all 0.3s; group: true; cursor: pointer; -webkit-tap-highlight-color: transparent;
        }
        .contact-link:first-child { border-top: 1px solid var(--border); }
        .contact-link:hover { color: var(--accent); padding-left: 16px; }
        .contact-link-arrow { opacity: 0; transform: translateX(-8px); transition: all 0.3s; }
        .contact-link:hover .contact-link-arrow { opacity: 1; transform: translateX(0); }
        .contact-meta { display: flex; flex-direction: column; gap: 0; background: var(--surface); border: 1px solid var(--border); }
        .contact-meta-row { display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; border-bottom: 1px solid var(--border); }
        .contact-meta-row:last-child { border-bottom: none; }
        .contact-meta-key { font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; }
        .contact-meta-val { font-family: var(--font-mono); font-size: 0.75rem; color: var(--text); font-weight: 600; }
        .contact-meta-green { color: var(--green) !important; }
        .contact-code {
          background: var(--surface2); border: 1px solid var(--border);
          padding: 40px; font-family: var(--font-mono); font-size: 0.8rem; line-height: 2.2;
          position: relative; overflow: hidden;
        }
        .contact-code::before {
          content: 'SEND_REQUEST.sh'; position: absolute; top: 0; right: 0;
          font-size: 0.6rem; color: var(--muted); padding: 8px 16px;
          background: var(--faint); border-bottom: 1px solid var(--border); border-left: 1px solid var(--border);
          letter-spacing: 0.1em;
        }
        .code-comment { color: var(--muted); }
        .code-key { color: var(--accent3); }
        .code-val { color: var(--accent2); }
        .code-status { color: var(--green); }
        .code-cursor { animation: blink 1s step-end infinite; }

        /* ── FOOTER ── */
        footer {
          border-top: 1px solid var(--border); padding: 32px 56px;
          display: flex; justify-content: space-between; align-items: center;
          position: relative; z-index: 2; flex-wrap: wrap; gap: 16px;
        }
        .footer-logo { font-family: var(--font-logo); font-size: 0.85rem; color: var(--muted); letter-spacing: 0.12em; }
        .footer-logo span { color: var(--accent); }
        .footer-copy { font-family: var(--font-mono); font-size: 0.6rem; color: var(--muted); letter-spacing: 0.08em; }
        .footer-links { display: flex; gap: 24px; }
        .footer-link { font-family: var(--font-mono); font-size: 0.6rem; color: var(--muted); text-decoration: none; letter-spacing: 0.08em; transition: color 0.2s; }
        .footer-link:hover { color: var(--accent); }

        /* ── HISTORY SECTION ── */
        .history-section {
          position: relative; z-index: 2; padding: 100px 56px;
          background: var(--surface);
          border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
          text-align: center; display: flex; flex-direction: column; align-items: center; gap: 32px;
        }
        .history-title { font-size: clamp(1.5rem, 3vw, 2.5rem); font-weight: 900; letter-spacing: -0.04em; color: var(--text); }
        .history-title span { color: var(--accent); }

        /* ── RESPONSIVE ── */
        @media (max-width: 960px) {
          nav { padding: 0 20px; }
          .nav-links { display: none; }
          .hamburger { display: flex; }
          .hero { padding: 96px 20px 100px; min-height: 100svh; }
          .hero-status { right: 20px; bottom: 80px; }
          .section { padding: 80px 20px; }
          .stats-bar { grid-template-columns: repeat(2, 1fr); }
          .stat-item { padding: 28px 20px; border-right-color: transparent; }
          .stat-item:nth-child(odd) { border-right: 1px solid var(--border); }
          .services-layout { grid-template-columns: 1fr; gap: 0; }
          .service-card { margin: 4px; }
          .work-row { grid-template-columns: 48px 1fr auto; gap: 16px; padding: 20px 16px; }
          .work-row-year { display: none; }
          .work-status { font-size: 0.55rem; padding: 4px 8px; }
          .work-row:hover { padding-left: 20px; }
          .stack-layout { grid-template-columns: 1fr; gap: 40px; }
          .stack-tags { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); }
          .team-grid { grid-template-columns: 1fr; }
          .contact-layout { grid-template-columns: 1fr; gap: 40px; }
          footer { padding: 20px; flex-direction: column; align-items: flex-start; gap: 12px; }
          .footer-links { gap: 16px; }
          .history-section { padding: 60px 20px; }
          .contact-code { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        }
        @media (max-width: 480px) {
          .hero-title { font-size: clamp(2.6rem, 12vw, 4.5rem); letter-spacing: -0.04em; }
          .section-title { font-size: clamp(1.8rem, 7vw, 2.8rem); }
          .hero-actions { flex-direction: column; align-items: stretch; width: 100%; }
          .btn-primary, .btn-ghost { width: 100%; justify-content: center; padding: 18px 24px; }
          .service-card { padding: 28px 20px; border-radius: 16px; }
          .service-metric-val { font-size: 1.5rem; }
          .dev-card { padding: 28px 20px; }
          .contact-code { padding: 24px 16px; font-size: 0.7rem; }
          .contact-link { font-size: 0.95rem; padding: 18px 0; }
          .contact-desc { font-size: 0.95rem; }
          .stat-item { padding: 24px 16px; }
          .stat-value { font-size: clamp(1.6rem, 7vw, 2.4rem); }
          .work-row { padding: 16px 12px; }
          .work-row-title { font-size: 1.1rem; }
          .work-tag { font-size: 0.5rem; }
          .section-devs { padding: 80px 20px; }
          .stack-tag { padding: 18px 16px; }
          .nav-btn { padding: 8px 10px; font-size: 0.6rem; }
          .cmd-overlay { padding: 60px 12px 12px; }
        }
        /* Hide cursor on touch devices */
        @media (hover: none), (pointer: coarse) {
          .cursor { display: none; }
        }
        /* On mobile, backdrop-filter is very GPU-expensive — replace with solid bg */
        @media (hover: none) and (pointer: coarse) {
          .glass-panel {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            background: var(--surface) !important;
          }
          .glass-card {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            background: var(--surface2) !important;
          }
          .mobile-menu {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }
          .cmd-overlay {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            background: rgba(5,5,7,0.96) !important;
          }
          /* Disable CSS transitions on transform/box-shadow that cause repaints */
          .service-card, .work-row, .stack-tag, .dev-card-extracted {
            transition: opacity 0.2s ease !important;
          }
          /* Promote key animated elements to composite layer */
          .hero-title {
            will-change: opacity, transform;
          }
        }
        /* Improve tap targets */
        @media (hover: none) {
          .work-row:hover { padding-left: 12px; }
          .work-row:hover .work-expand { opacity: 0; }
          .nav-link::after { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* CURSOR — hidden on touch devices via CSS */}
      <motion.div className="cursor" style={{ x: springX, y: springY }} />

      {/* SCROLL PROGRESS */}
      <div className="scroll-bar" style={isMobile ? undefined : { width: `${scrollPct * 100}%` }} />

      {/* BG LAYERS */}
      <div className="bg-grid" />
      <div className="bg-glow" />
      <div className="noise" />

      {/* ── NAV ── */}
      <nav className="glass-panel">
        <a href="#" className="logo">
          MEGA<span className="logo-accent">Devs</span>
          <span className="logo-dot" />
        </a>
        <div className="nav-links">
          {nav.map((n) => (
            <a key={n.l} href={n.h} className="nav-link">{n.l}</a>
          ))}
          <span className="nav-badge">/ CMD</span>
        </div>
        <div className="nav-actions">
          <button onClick={() => setCmdOpen(true)} className="nav-btn" aria-label="Open command palette">
            <span>⌘</span> CMD
          </button>
          <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="nav-btn theme-btn" aria-label="Toggle theme">
            {theme === "light" ? "☾" : "☀"}
          </button>
          <button
            className={`hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div 
              className="mobile-menu-overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div className="mobile-menu" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}>
              <motion.div className="mobile-menu-header" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                Navigation
              </motion.div>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%", marginTop: "32px" }}>
                {nav.map((n, i) => (
                  <motion.a
                    key={n.l} href={n.h} className="nav-link-mobile" onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 + 0.15, type: "spring", stiffness: 300, damping: 25 }}
                  >{n.l}</motion.a>
                ))}
              </div>
              <motion.div className="mobile-menu-footer" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <a href="#contact" className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: "0.85rem" }} onClick={() => setMenuOpen(false)}>Start a Project</a>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── CMD PALETTE ── */}
      <AnimatePresence>
        {cmdOpen && (
          <motion.div className="cmd-overlay" onClick={() => setCmdOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <motion.div className="cmd-box glass-panel" onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}>
              <div className="cmd-head">
                <span className="cmd-prompt">&gt;</span>
                <input
                  autoFocus value={cmdVal} onChange={(e) => setCmdVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setCmdOpen(false);
                    if (e.key === "Enter" && cmdVal.trim()) {
                      const m = nav.find((n) => n.l.toLowerCase().includes(cmdVal.trim().toLowerCase()));
                      if (m) { window.location.href = m.h; setCmdOpen(false); setCmdVal(""); }
                    }
                  }}
                  placeholder="Navigate to..." className="cmd-input"
                />
                <span className="cmd-esc">ESC</span>
              </div>
              <div className="cmd-label">Sections</div>
              {nav.filter((n) => n.l.toLowerCase().includes(cmdVal.toLowerCase())).map((n) => (
                <a key={n.l} href={n.h} onClick={() => setCmdOpen(false)} className="cmd-item">
                  <span className="cmd-arrow">&gt;</span>
                  <span>{n.l}</span>
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <motion.section className="hero" ref={heroRef} style={{ opacity: heroOpacity, y: heroY }}>
        <div className="hero-inner">
          <motion.div className="hero-eyebrow" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <span className="hero-tag">MEGA Devs · Cairo, EG · Est. 2022</span>
            <div className="hero-line" />
          </motion.div>
          <motion.h1 className="hero-title"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
            }}
            initial="hidden" animate="show"
          >
            <motion.span variants={{ hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { type: "spring", damping: 22, stiffness: 120 } } }}>We Ship.</motion.span>
            <motion.span variants={{ hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { type: "spring", damping: 22, stiffness: 120 } } }} className="hero-title-accent">Fast.</motion.span>
            <motion.span variants={{ hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { type: "spring", damping: 22, stiffness: 120 } } }}>Always.</motion.span>
          </motion.h1>
          <motion.p className="hero-sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.25 }}>
            Two engineers from Cairo building <strong>high-performance web apps</strong>, custom Android ROMs, and production-grade AI systems for clients across the Middle East and beyond.
          </motion.p>
          <motion.div className="hero-actions" style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
  <MagneticButton href="#contact" className="btn-primary">
    Start a Project &rarr;
  </MagneticButton>
  <a href="/works" className="btn-ghost glass-panel">
    Our Works
  </a>
</motion.div>
        </div>
        <div className="hero-status">
          <div className="hero-status-row">
            <span className="status-live" />
            <span>Systems Nominal</span>
          </div>
          <div>Cairo · {currentTime}</div>
          <div>UTC+3 · Available</div>
        </div>
      </motion.section>

      {/* ── STATS BAR ── */}
      <motion.div className="stats-bar glass-panel" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", damping: 24, stiffness: 130 }}>
        {stats.map((s, i) => (
          <motion.div key={s.label} className="stat-item" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── SERVICES ── */}
      <section id="services" className="section">
        <div className="section-inner">
          <div className="section-eyebrow">
            <div className="section-line" />
            <span className="section-tag">What We Do</span>
            <span className="section-num">§01</span>
          </div>
          <h2 className="section-title">Services that <em>scale</em> with your ambition</h2>
          <div className="services-layout">
            {services.map((s, i) => (
              <motion.a
                key={s.num} href="#contact"
                className={`service-card glass-card${activeService === i ? " active" : ""}`}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                whileHover={isMobile ? {} : { scale: 1.02, y: -5 }}
                viewport={{ once: true }} transition={{ type: "spring", damping: 22, stiffness: 120, delay: i * 0.08 }}
                onMouseEnter={() => setActiveService(i)}
              >
                <div className="service-head">
                  <span className="service-icon">{s.icon}</span>
                  <span className="service-num-tag">{s.num}</span>
                </div>
                <div className="service-title">{s.title}</div>
                <div className="service-sub">{s.sub}</div>
                <div className="service-desc">{s.desc}</div>
                <div className="service-metric">
                  <span className="service-metric-val">{s.metric}</span>
                  <span className="service-metric-label">{s.metricLabel}</span>
                </div>
                <div className="service-output">{s.output}</div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKS ── */}
      <section id="works" className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="section-inner">
          <div className="works-header">
            <div>
              <div className="section-eyebrow">
                <div className="section-line" />
                <span className="section-tag">Portfolio</span>
                <span className="section-num">§02</span>
              </div>
              <h2 className="section-title">Things we&apos;ve <em>shipped</em></h2>
            </div>
            <div className="works-filter-hint">HOVER TO EXPLORE</div>
          </div>
          <div className="works-list">
            {works.map((w, i) => (
              <motion.a
                key={w.num}
                href={w.link}
                target={w.link.startsWith("http") ? "_blank" : undefined}
                rel={w.link.startsWith("http") ? "noopener noreferrer" : undefined}
                className="work-row glass-panel"
                initial={{ opacity: 0, y: isMobile ? 16 : 0, x: isMobile ? 0 : -40 }} whileInView={{ opacity: 1, y: 0, x: 0 }}
                whileHover={isMobile ? {} : { scale: 1.01, x: 10 }}
                viewport={{ once: true }} transition={{ type: "spring", damping: 24, stiffness: 130, delay: i * 0.06 }}
                onMouseEnter={() => setHoveredWork(i)}
                onMouseLeave={() => setHoveredWork(null)}
              >
                <span className="work-row-num">{w.num}</span>
                <div className="work-row-info">
                  <div className="work-row-cat">{w.category}</div>
                  <div className="work-row-title">{w.title}</div>
                  <div className="work-row-tags">
                    {w.tags.map((t) => <span key={t} className="work-tag">{t}</span>)}
                  </div>
                </div>
                <div className="work-row-year">{w.year}</div>
                <span className={`work-status ${w.status.toLowerCase()}`}>{w.status}</span>
                <div className="work-expand">{w.desc}</div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── STACK ── */}
      <section id="stack" className="section">
        <div className="section-inner">
          <div className="section-eyebrow">
            <div className="section-line" />
            <span className="section-tag">Tech Stack</span>
            <span className="section-num">§03</span>
          </div>
          <div className="stack-layout">
            <div>
              <h2 className="stack-left-title">Built for modern stacks</h2>
              <div className="stack-meta-list">
                {[
                  { k: "Languages", v: "JavaScript, Python, C++" },
                  { k: "Runtime", v: "Linux, Android, Edge" },
                  { k: "Frameworks", v: "Next.js, React, FastAPI" },
                  { k: "Databases", v: "PostgreSQL, Redis, SQLite" },
                  { k: "Status", v: "● All systems nominal" },
                ].map((m) => (
                  <motion.div key={m.k} className="stack-meta-row" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }}>
                    <span className="stack-meta-key">{m.k}</span>
                    <span className="stack-meta-val">{m.v}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div className="stack-tags" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              {techStack.map((t, i) => (
                <motion.div key={t.name} className="stack-tag glass-card" initial={{ opacity: 0, y: isMobile ? 0 : 20 }} whileInView={{ opacity: 1, y: 0 }} whileHover={isMobile ? {} : { scale: 1.05, y: -5 }} viewport={{ once: true }} transition={{ type: "spring", damping: 18, stiffness: 160, delay: isMobile ? i * 0.02 : i * 0.04 }}>
                  <span className="stack-tag-name">{t.name}</span>
                  <span className="stack-tag-cat">{t.cat}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <style>{`
        /* ── THEME TOKENS (Modify these as needed for your new project) ── */
        #developers {
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

        /* ── SECTION CORE ── */
        .section-devs { padding: 140px 56px; position: relative; z-index: 2; background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .section-inner-devs { max-width: 1200px; margin: 0 auto; }
        .section-eyebrow {
          display: flex; align-items: center; gap: 16px; margin-bottom: 20px;
        }
        .section-tag {
          font-family: var(--font-mono); font-size: 0.6rem; color: var(--accent);
          letter-spacing: 0.2em; text-transform: uppercase; font-weight: 600;
        }
        .section-line { height: 1px; width: 40px; background: var(--accent); }
        .section-num { font-family: var(--font-mono); font-size: 0.6rem; color: var(--faint); letter-spacing: 0.1em; }
        .section-title-devs {
          font-family: var(--font-display); font-size: clamp(2.5rem, 5vw, 5rem);
          font-weight: 900; letter-spacing: -0.04em; color: var(--text);
          line-height: 1; margin-bottom: 80px; max-width: 16ch;
        }
        .section-title-devs em { font-style: normal; color: var(--accent); }

        /* ── STATUS INDICATOR ── */
        .status-live { width: 6px; height: 6px; border-radius: 50%; background: var(--green); background: #14532d; animation: pulse 2s ease-in-out infinite; display: inline-block; flex-shrink: 0; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }

        /* ── TEAM ── */
        .team-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
        .dev-card-extracted {
          padding: 48px; position: relative; overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s;
          border-radius: 24px;
        }
        .dev-card-extracted::after {
          content: attr(data-index);
          position: absolute; bottom: -20px; right: -10px;
          font-family: var(--font-display); font-size: 8rem; font-weight: 900;
          color: var(--faint); pointer-events: none; line-height: 1; letter-spacing: -0.05em;
          transition: color 0.3s;
        }
        .dev-card-extracted:hover { border-color: var(--border2); transform: translateY(-4px); box-shadow: 0 32px 80px rgba(0,0,0,0.4); }
        .dev-card-extracted:hover::after { color: rgba(232,69,69,0.1); }
        .dev-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; flex-wrap: wrap; gap: 12px; }
        .dev-tag-extracted { font-family: var(--font-mono); font-size: 0.6rem; color: var(--accent); letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700; }
        .dev-online { display: flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 0.85rem; font-weight: 900; color: #14532d; }
        .dev-avatar-extracted {
          width: 72px; height: 72px; object-fit: cover; display: block;
          margin-bottom: 24px; border: 2px solid var(--border2); position: relative; z-index: 1;
          clip-path: polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%, 0 85%);
          transition: border-color 0.3s;
        }
        .dev-card-extracted:hover .dev-avatar-extracted { border-color: var(--accent); }
        .dev-name-extracted { font-size: 1.6rem; font-weight: 800; color: var(--text); letter-spacing: -0.03em; margin-bottom: 6px; position: relative; z-index: 1; }
        .dev-role-extracted { font-size: 0.85rem; color: var(--muted); margin-bottom: 32px; line-height: 1.6; position: relative; z-index: 1; }
        .dev-links-extracted { display: flex; gap: 10px; position: relative; z-index: 1; flex-wrap: wrap; }
        .dev-link-extracted {
          font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted);
          border: 1px solid var(--border2); padding: 10px 16px; text-decoration: none;
          transition: all 0.2s; display: flex; align-items: center; gap: 6px;
          min-height: 44px; cursor: pointer; -webkit-tap-highlight-color: transparent;
        }
        .dev-link-extracted:hover { border-color: var(--accent); color: var(--accent); background: var(--glow); }

        /* ── RESPONSIVE ── */
        @media (max-width: 960px) {
          .section-devs { padding: 100px 24px; }
          .team-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .section-title-devs { font-size: clamp(2rem, 8vw, 3rem); }
          .dev-card-extracted { padding: 32px 24px; }
        }
      `}</style>

      <section id="developers" className="section-devs">
        <div className="section-inner-devs">
          <div className="section-eyebrow">
            <div className="section-line" />
            <span className="section-tag">The Team</span>
            <span className="section-num">§04</span>
          </div>
          <h2 className="section-title-devs">Meet the <em>engineers</em></h2>
          <div className="team-grid">
            {developers.map((d, i) => (
              <motion.div
                key={d.name} className="dev-card-extracted glass-card" data-index={d.index}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                whileHover={isMobile ? {} : { scale: 1.02, y: -5 }}
                viewport={{ once: true }} transition={{ type: "spring", damping: 22, stiffness: 120, delay: i * 0.08 }}
              >
                <div className="dev-top">
                  <span className="dev-tag-extracted">{d.tag}</span>
                  <span className="dev-online"><span className="status-live" />Available</span>
                </div>
                <Image src={d.image} alt={`Photo of ${d.name}`} width={72} height={72} className="dev-avatar-extracted" priority />
                <div className="dev-name-extracted">{d.name}</div>
                <div className="dev-role-extracted">{d.role}</div>
                <div className="dev-links-extracted">
                  <a href={d.telegram} target="_blank" rel="noopener noreferrer" className="dev-link-extracted">✈ Telegram</a>
                  <a href={d.github} target="_blank" rel="noopener noreferrer" className="dev-link-extracted">⌥ GitHub</a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="section">
        <div className="section-inner">
          <div className="section-eyebrow">
            <div className="section-line" />
            <span className="section-tag">Get in Touch</span>
            <span className="section-num">§05</span>
          </div>
          <h2 className="section-title">Let&apos;s build something <em>great</em></h2>
          <div className="contact-layout">
            <motion.div initial={{ opacity: 0, x: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <p className="contact-desc">Have a project? We&apos;re two engineers ready to turn your idea into production-grade software — from first commit to live deploy.</p>
              <div className="contact-links">
                <a href="mailto:megatrondevs@gmail.com" className="contact-link">
                  <span>megatrondevs@gmail.com</span>
                  <span className="contact-link-arrow">→</span>
                </a>
                <a href="tel:+201509916991" className="contact-link">
                  <span>+20 150 991 6991</span>
                  <span className="contact-link-arrow">→</span>
                </a>
              </div>
              <div className="contact-meta glass-panel">
                {[
                  { k: "Response Time", v: "< 24h" },
                  { k: "Timezone", v: "UTC+3 (Cairo)" },
                  { k: "Languages", v: "Arabic · English" },
                  { k: "Availability", v: "● Open to Work", cls: "contact-meta-green" },
                ].map((r) => (
                  <div key={r.k} className="contact-meta-row">
                    <span className="contact-meta-key">{r.k}</span>
                    <span className={`contact-meta-val${r.cls ? ` ${r.cls}` : ""}`}>{r.v}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", damping: 24, stiffness: 130, delay: 0.1 }} className="contact-code glass-panel">
              <div><span className="code-comment"># Project inquiry template</span></div>
              <div>&nbsp;</div>
              <div><span className="code-key">email</span>: <span className="code-val">&quot;megatrondevs@gmail.com&quot;</span></div>
              <div><span className="code-key">phone</span>: <span className="code-val">&quot;+20 150 991 6991&quot;</span></div>
              <div><span className="code-key">subject</span>: <span className="code-val">&quot;New Project Inquiry&quot;</span></div>
              <div><span className="code-key">priority</span>: <span className="code-val">&quot;high&quot;</span></div>
              <div>&nbsp;</div>
              <div><span className="code-status">status</span>: <span className="code-val">&quot;awaiting_your_message&quot;</span><span className="code-cursor">_</span></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── HISTORY ── */}
      <div className="history-section glass-panel">
        <motion.h2 className="history-title" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          Curious how <span>MEGA Devs</span> started?
        </motion.h2>
        <a href="/history" className="btn-primary">Read Our Story →</a>
      </div>

      {/* ── FOOTER ── */}
      <footer>
        <span className="footer-logo">MEGA<span>Devs</span></span>
        <span className="footer-copy">© {new Date().getFullYear()} MEGA Devs · Cairo, Egypt · All rights reserved</span>
        <div className="footer-links">
          <a href="mailto:megatrondevs@gmail.com" className="footer-link">Email</a>
          <a href="#" className="footer-link">↑ Top</a>
          <span className="footer-link">{currentTime}</span>
        </div>
      </footer>
    </div>
  );
}
