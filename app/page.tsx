"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import Scene from "./components/Scene";
import MouseTracker from "./components/MouseTracker";

const developers = [
  {
    name: "Adham Ahmed",
    role: "Frontend, ROM & Web Developer",
    telegram: "https://t.me/AdhamBinAhmed",
    github: "https://github.com/llxcd",
    image: "/developers/ahmed.jpg",
    tag: "Founder",
  },
  {
    name: "Seif El-Din Ismail",
    role: "Full Stack & Root Developer",
    telegram: "https://t.me/X_oEG",
    github: "https://github.com/QOS3",
    image: "/developers/seif.jpg",
    tag: "CTO",
  },
];

const techStack = [
  "Next.js", "React", "Python", "C++", "Arch Linux", "Android ROMs", "TailwindCSS"
];

const services = [
  { cmd: "01", title: "Web Engineering", desc: "High-performance frontends that load instantly.", output: "> deploying to edge... done in 47ms" },
  { cmd: "02", title: "Android ROMs", desc: "Custom kernels, system modifications, vanilla builds.", output: "> kernel patched... boot time: 12s" },
  { cmd: "03", title: "Backend Architecture", desc: "Server-side systems that handle real traffic.", output: "> uptime: 847 days... zero downtime" },
  { cmd: "04", title: "AI & ML", desc: "Models that run in production, not demo environments.", output: "> accuracy: 94.2%... latency: 8ms" },
];

const works = [
  {
    num: "01",
    title: "MEGA ROM",
    category: "Android ROM",
    desc: "A custom Android ROM built from AOSP with performance patches, debloated system, and minimal UI. Deployed on Xiaomi & Samsung devices.",
    tags: ["Android", "C++", "Kernel", "AOSP"],
    status: "Live",
    link: "https://megaroms.ggff.net/",
  },
  {
    num: "02",
    title: "Kira Store",
    category: "Web App",
    desc: "Full-stack e-commerce platform with real-time inventory, Arabic/English i18n, payment gateway integration, and a custom admin dashboard.",
    tags: ["Next.js", "PostgreSQL", "Redis", "Stripe"],
    status: "Live",
    link: "https://kiradecoration.vercel.app/",
  },
  {
    num: "03",
    title: "SentinelAI",
    category: "AI System",
    desc: "ML-powered threat detection system trained on network traffic data. Runs inference at under 10ms with 94%+ accuracy in production.",
    tags: ["Python", "PyTorch", "FastAPI", "Docker"],
    status: "Private",
    link: "#works",
  },
  {
    num: "04",
    title: "DevPanel",
    category: "Backend",
    desc: "Internal server management dashboard with live metrics, SSH tunneling, log streaming, and alerting. Zero downtime for 847+ days.",
    tags: ["Node.js", "WebSockets", "Linux", "Nginx"],
    status: "Private",
    link: "#works",
  },
];

export default function Home() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdVal, setCmdVal] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const cairoTime = now.toLocaleString("en-GB", {
        timeZone: "Africa/Cairo",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setCurrentTime(cairoTime);
    };
    updateTime();
    const iv = setInterval(updateTime, 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => setScrollPct(v));
    return () => unsubscribe();
  }, [scrollYProgress]);

  useEffect(() => {
    const kd = (e: KeyboardEvent) => {
      if (e.key === "/" && !cmdOpen) { e.preventDefault(); setCmdOpen(true); }
      if (e.key === "Escape") { setCmdOpen(false); setMenuOpen(false); }
    };
    window.addEventListener("keydown", kd);
    return () => window.removeEventListener("keydown", kd);
  }, [cmdOpen]);

  const nav = [
    { l: "services", h: "#services" },
    { l: "works", h: "#works" },
    { l: "stack", h: "#stack" },
    { l: "developers", h: "#developers" },
    { l: "contact", h: "#contact" },
  ];

  return (
    <div className="page-wrapper" data-theme={theme}>

      <style>{`
        :root, [data-theme="light"] {
          --font-main: var(--font-outfit), sans-serif;
          --font-display: var(--font-outfit), sans-serif;
          --font-mono: var(--font-jetbrains), monospace;
          --font-logo: var(--font-logo), sans-serif;
          --text-xs: 0.75rem;
          --text-sm: 0.875rem;
          --text-base: 1rem;
          --text-lg: 1.25rem;
          --text-xl: 2rem;
          --text-2xl: 3rem;
          --text-display: clamp(3.5rem, 10vw, 12rem);
          --lh-tight: 0.95;
          --lh-normal: 1.6;
          --color-bg: #faf8f5;
          --color-surface: #ffffff;
          --color-warm: #f5f0eb;
          --color-border: #e8e2d9;
          --color-text: #1a1a1a;
          --color-muted: #8a8580;
          --color-accent: #c8553d;
          --color-accent-light: rgba(200, 85, 61, 0.08);
          --color-coral: #ff6b4a;
          --color-sage: #2d5a27;
          --color-gold: #d4a24e;
          --color-nav: rgba(250, 248, 245, 0.95);
        }

        [data-theme="dark"] {
          --color-bg: #0a0a0a;
          --color-surface: #0f0f0f;
          --color-warm: #111111;
          --color-border: #1a1a1a;
          --color-text: #fafafa;
          --color-muted: #52525b;
          --color-accent: #e05940;
          --color-accent-light: rgba(224, 89, 64, 0.08);
          --color-coral: #ff8a6f;
          --color-sage: #3d7a37;
          --color-gold: #e4b25e;
          --color-nav: rgba(10, 10, 10, 0.95);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        :focus-visible { outline: 2px solid var(--color-accent); outline-offset: 4px; }

        body {
          font-family: var(--font-main);
          font-size: var(--text-base);
          line-height: var(--lh-normal);
          background: var(--color-bg);
          color: var(--color-text);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
          transition: background 0.3s, color 0.3s;
        }

        .page-wrapper { position: relative; min-height: 100vh; }

        .scroll-bar {
          position: fixed; top: 0; left: 0; height: 3px;
          background: linear-gradient(90deg, var(--color-accent), var(--color-coral), var(--color-gold));
          z-index: 200; transition: width 0.1s linear;
        }

        .mesh-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; transition: opacity 0.3s; }
        [data-theme="light"] .mesh-bg {
          background:
            radial-gradient(ellipse at 20% 50%, rgba(255, 107, 74, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(212, 162, 78, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(45, 90, 39, 0.08) 0%, transparent 50%),
            var(--color-bg);
        }
        [data-theme="dark"] .mesh-bg {
          background:
            radial-gradient(ellipse at 20% 50%, rgba(255, 107, 74, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(212, 162, 78, 0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(45, 90, 39, 0.04) 0%, transparent 50%),
            var(--color-bg);
        }
        .grid-overlay {
          position: fixed; inset: 0; z-index: 1; pointer-events: none;
          background-image:
            linear-gradient(to right, var(--color-accent-light) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-accent-light) 1px, transparent 1px);
          background-size: 80px 80px;
        }

        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          padding: 20px 64px; display: flex; justify-content: space-between; align-items: center;
          backdrop-filter: blur(10px); background: var(--color-nav); transition: background 0.3s;
          border-bottom: 1px solid var(--color-border);
        }
        .logo {
          font-size: var(--text-xl); font-weight: 800; color: var(--color-text);
          font-family: var(--font-display);
          text-decoration: none; letter-spacing: -0.04em; transition: color 0.3s; flex-shrink: 0;
        }
        .logo span { color: var(--color-accent); }
        .nav-links { display: flex; gap: 32px; align-items: center; }
        .nav-link {
          color: var(--color-muted); font-size: var(--text-sm); text-decoration: none;
          font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1); position: relative;
        }
        .nav-link::after {
          content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 2px;
          background: var(--color-coral); transition: width 0.2s ease-out;
        }
        .nav-link:hover { color: var(--color-text); }
        .nav-link:hover::after { width: 100%; }

        .cmd-hint-badge {
          font-size: 0.65rem; color: var(--color-muted); border: 1px solid var(--color-border);
          padding: 2px 7px; font-family: var(--font-mono); letter-spacing: 0.05em; cursor: default;
        }
        .theme-toggle {
          background: transparent; border: 1px solid var(--color-border); color: var(--color-muted);
          padding: 8px 12px; cursor: pointer; font-size: var(--text-sm);
          display: flex; align-items: center; gap: 6px; transition: all 0.3s;
          min-height: 44px; min-width: 44px; justify-content: center; font-family: inherit; flex-shrink: 0;
        }
        .theme-toggle:hover { border-color: var(--color-accent); color: var(--color-accent); }
        .cmd-btn {
          background: transparent; border: 1px solid var(--color-border); color: var(--color-muted);
          padding: 8px 16px; cursor: pointer; font-family: var(--font-mono);
          font-size: var(--text-xs); letter-spacing: 0.1em; text-transform: uppercase;
          font-weight: 400; transition: all 0.3s; min-height: 44px; flex-shrink: 0;
          display: flex; align-items: center; gap: 6px;
        }
        .cmd-btn:hover { border-color: var(--color-coral); color: var(--color-coral); }

        .hamburger {
          display: none; flex-direction: column; gap: 5px; background: transparent;
          border: none; cursor: pointer; padding: 8px; min-width: 44px; min-height: 44px;
          align-items: center; justify-content: center;
        }
        .hamburger span { display: block; width: 22px; height: 2px; background: var(--color-text); transition: all 0.3s; }
        .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

        .mobile-menu {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 49;
          background: var(--color-nav); backdrop-filter: blur(16px);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 40px; padding: 80px 24px 40px;
        }
        .mobile-menu a {
          font-size: 2rem; font-weight: 800; letter-spacing: -0.03em;
          color: var(--color-text); text-decoration: none; text-transform: uppercase; transition: color 0.2s;
        }
        .mobile-menu a:hover { color: var(--color-accent); }
        .mobile-menu-footer { margin-top: auto; display: flex; gap: 16px; align-items: center; }

        .cmd-overlay {
          position: fixed; inset: 0; background: rgba(250, 248, 245, 0.98); z-index: 100;
          display: flex; align-items: flex-start; justify-content: center;
          padding: 80px 16px 0; backdrop-filter: blur(10px);
        }
        [data-theme="dark"] .cmd-overlay { background: rgba(10, 10, 10, 0.98); }
        .cmd-palette {
          width: 100%; max-width: 600px; background: var(--color-surface);
          border: 1px solid var(--color-border); padding: 24px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.1);
        }
        [data-theme="dark"] .cmd-palette { box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        .cmd-input-wrap {
          display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
          padding-bottom: 16px; border-bottom: 2px solid var(--color-border);
        }
        .cmd-input {
          background: transparent; border: none; color: var(--color-text);
          font-size: var(--text-lg); font-family: var(--font-main); outline: none; width: 100%; font-weight: 600;
        }
        .cmd-hint-label { font-size: var(--text-xs); color: var(--color-muted); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.1em; font-family: var(--font-mono); }
        .cmd-item {
          color: var(--color-accent); font-size: var(--text-base); text-decoration: none;
          padding: 8px 0; display: flex; gap: 12px; font-weight: 600;
          transition: transform 0.2s; min-height: 44px; align-items: center;
        }
        .cmd-item:hover { transform: translateX(8px); }

        .hero {
          min-height: 100vh; display: flex; flex-direction: column; justify-content: center;
          padding: 120px 64px 48px; position: relative; z-index: 2;
        }
        .hero-inner { width: 100%; }
        .hero-label {
          font-size: var(--text-sm); text-transform: uppercase; letter-spacing: 0.15em;
          color: var(--color-accent); margin-bottom: 24px; font-weight: 600; font-family: var(--font-mono);
        }
        .hero-title {
          font-size: var(--text-display); font-weight: 800; line-height: var(--lh-tight);
          font-family: var(--font-display);
          letter-spacing: -0.05em; color: var(--color-text); margin-bottom: 32px;
          max-width: 14ch; transition: color 0.3s;
        }
        .hero-title .accent {
          background: linear-gradient(135deg, var(--color-accent), var(--color-coral), var(--color-gold));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .hero-meta { font-size: var(--text-lg); color: var(--color-muted); margin-bottom: 48px; max-width: 50ch; line-height: 1.8; }
        .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 10px; padding: 16px 32px;
          min-height: 48px; background: var(--color-text); color: var(--color-bg);
          font-weight: 700; font-size: var(--text-base); text-decoration: none;
          font-family: inherit; border: none; cursor: pointer; transition: all 0.2s ease-out; letter-spacing: -0.01em;
        }
        .btn-primary:hover { background: var(--color-accent); transform: scale(1.02); }
        .btn-secondary {
          display: inline-flex; align-items: center; gap: 10px; padding: 16px 32px;
          min-height: 48px; color: var(--color-text); font-size: var(--text-base);
          border: 2px solid var(--color-border); text-decoration: none;
          font-family: inherit; font-weight: 700; background: transparent; cursor: pointer;
          transition: all 0.2s ease-out; letter-spacing: -0.01em;
        }
        .btn-secondary:hover { border-color: var(--color-accent); color: var(--color-accent); transform: scale(1.02); }
        .hero-footer {
          position: absolute; bottom: 48px; left: 64px; font-size: var(--text-xs);
          color: var(--color-muted); letter-spacing: 0.08em; font-family: var(--font-mono);
          font-variant-numeric: tabular-nums;
        }

        .section { padding: 120px 64px; position: relative; z-index: 2; }
        .section-inner { width: 100%; }
        .section-header { margin-bottom: 80px; }
        .section-label {
          font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.15em;
          color: var(--color-accent); margin-bottom: 16px; font-weight: 600;
          display: flex; align-items: center; gap: 12px; font-family: var(--font-mono);
        }
        .section-label::before { content: ''; width: 40px; height: 1px; background: var(--color-accent); }
        .section-title {
          font-size: var(--text-2xl); font-weight: 800; letter-spacing: -0.04em;
          font-family: var(--font-display);
          color: var(--color-text); line-height: var(--lh-tight); max-width: 15ch; transition: color 0.3s;
        }

        .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2px; background: var(--color-border); }
        .service-card {
          background: var(--color-bg); padding: 48px 40px; text-decoration: none;
          display: block; transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
          position: relative; border: 1px solid transparent;
        }
        .service-card:hover { transform: translateY(-2px); border-color: var(--color-border); box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
        [data-theme="dark"] .service-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
        .service-number { font-size: var(--text-sm); color: var(--color-accent); font-weight: 700; margin-bottom: 24px; display: block; font-family: var(--font-mono); }
        .service-card h3 { font-size: var(--text-xl); font-weight: 700; color: var(--color-text); margin-bottom: 16px; letter-spacing: -0.03em; font-family: var(--font-display); }
        .service-card p { color: var(--color-muted); font-size: var(--text-base); line-height: 1.7; margin-bottom: 20px; }
        .service-output { font-size: var(--text-xs); color: var(--color-sage); padding-left: 16px; border-left: 2px solid var(--color-sage); line-height: 1.6; font-family: var(--font-mono); }

        .works-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
        .work-card {
          background: var(--color-surface); border: 1px solid var(--color-border);
          padding: 40px; text-decoration: none; display: block;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1); position: relative; overflow: hidden;
        }
        .work-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--color-accent), var(--color-coral));
          transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease-out;
        }
        .work-card:hover::before { transform: scaleX(1); }
        .work-card:hover { border-color: var(--color-accent); transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.08); }
        [data-theme="dark"] .work-card:hover { box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        .work-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .work-num { font-size: var(--text-xs); color: var(--color-accent); font-weight: 700; letter-spacing: 0.1em; font-family: var(--font-mono); }
        .work-status { font-size: var(--text-xs); padding: 4px 10px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; font-family: var(--font-mono); }
        .work-status.live { background: rgba(45, 90, 39, 0.12); color: var(--color-sage); border: 1px solid rgba(45, 90, 39, 0.25); }
        .work-status.private { background: var(--color-accent-light); color: var(--color-accent); border: 1px solid rgba(200, 85, 61, 0.25); }
        .work-category { font-size: var(--text-xs); color: var(--color-coral); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; margin-bottom: 12px; font-family: var(--font-mono); }
        .work-card h3 { font-size: var(--text-xl); font-weight: 700; color: var(--color-text); letter-spacing: -0.03em; margin-bottom: 16px; line-height: 1.1; font-family: var(--font-display); }
        .work-card p { color: var(--color-muted); font-size: var(--text-sm); line-height: 1.7; margin-bottom: 24px; }
        .work-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .work-tag { font-size: 0.7rem; padding: 4px 10px; border: 1px solid var(--color-border); color: var(--color-muted); font-weight: 500; letter-spacing: 0.04em; font-family: var(--font-mono); }

        .stack-section { background: var(--color-warm); transition: background 0.3s; }
        [data-theme="dark"] .stack-section { background: #111111; }
        .stack-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
        .stack-title { font-size: var(--text-2xl); font-weight: 800; letter-spacing: -0.04em; margin-bottom: 40px; line-height: var(--lh-tight); color: var(--color-text); font-family: var(--font-display); }
        .stack-meta { display: flex; flex-direction: column; gap: 12px; font-size: var(--text-sm); color: var(--color-muted); }
        .stack-meta-item { display: flex; gap: 8px; }
        .stack-meta-label { color: var(--color-coral); font-weight: 600; min-width: 80px; font-family: var(--font-mono); }
        .terminal-window { background: var(--color-surface); border: 1px solid var(--color-border); overflow: hidden; transition: all 0.3s; }
        .terminal-bar { display: flex; gap: 8px; padding: 16px 20px; border-bottom: 1px solid var(--color-border); align-items: center; }
        .terminal-dot { width: 10px; height: 10px; border-radius: 50%; }
        .terminal-dot:nth-child(1) { background: #ef4444; }
        .terminal-dot:nth-child(2) { background: #f59e0b; }
        .terminal-dot:nth-child(3) { background: #22c55e; }
        .terminal-title { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-muted); margin-left: auto; }
        .terminal-body { padding: 24px; }
        .terminal-line { font-family: var(--font-mono); font-size: var(--text-xs); margin-bottom: 8px; color: var(--color-muted); }
        .terminal-line.command { color: var(--color-coral); }
        .tech-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
        .tech-tag { padding: 8px 16px; font-size: var(--text-sm); color: var(--color-muted); border: 1px solid var(--color-border); font-weight: 400; transition: all 0.3s; font-family: var(--font-mono); }
        .tech-tag:hover { border-color: var(--color-coral); color: var(--color-coral); transform: translateY(-2px); }

        .dev-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; }
        .dev-card {
          background: var(--color-surface); padding: 40px; border: 1px solid var(--color-border);
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .dev-card:hover { border-color: var(--color-accent); box-shadow: 0 20px 60px rgba(0,0,0,0.08); transform: translateY(-4px); }
        [data-theme="dark"] .dev-card:hover { box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        .dev-header { display: flex; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 8px; }
        .dev-tag { font-size: var(--text-xs); color: var(--color-accent); letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; font-family: var(--font-mono); }
        .dev-status { font-size: var(--text-xs); color: var(--color-sage); display: flex; align-items: center; gap: 6px; font-family: var(--font-mono); }
        .status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--color-sage); animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.5); } }
        .dev-avatar {
          width: 80px; height: 80px; margin-bottom: 20px; display: block;
          border: 2px solid var(--color-border);
          clip-path: polygon(0 0, 88% 0, 100% 12%, 100% 100%, 12% 100%, 0 88%);
          transition: border-color 0.3s;
        }
        .dev-card:hover .dev-avatar { border-color: var(--color-accent); }
        .dev-card h3 { font-size: var(--text-lg); font-weight: 700; color: var(--color-text); margin-bottom: 8px; letter-spacing: -0.02em; font-family: var(--font-display); }
        .dev-role { font-size: var(--text-sm); color: var(--color-muted); margin-bottom: 24px; line-height: 1.6; }
        .dev-socials { display: flex; gap: 12px; flex-wrap: wrap; }
        .dev-social-link {
          font-size: var(--text-xs); color: var(--color-muted); display: flex; align-items: center;
          gap: 6px; font-weight: 400; text-decoration: none; padding: 6px 12px;
          border: 1px solid var(--color-border); transition: all 0.2s; font-family: var(--font-mono);
        }
        .dev-social-link:hover { border-color: var(--color-accent); color: var(--color-accent); }

        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
        .contact-desc { font-size: var(--text-lg); color: var(--color-muted); line-height: 1.8; margin-bottom: 40px; max-width: 40ch; }
        .contact-email {
          color: var(--color-text); font-size: clamp(1.1rem, 3vw, var(--text-xl)); font-weight: 700;
          text-decoration: none; display: inline-flex; align-items: center; gap: 12px;
          transition: all 0.3s; word-break: break-all;
        }
        .contact-email:hover { color: var(--color-accent); transform: translateX(8px); }
        .contact-phone {
          display: inline-flex; align-items: center; gap: 12px; color: var(--color-text);
          font-size: clamp(1.1rem, 3vw, var(--text-xl)); font-weight: 700; text-decoration: none;
          margin-top: 16px; transition: all 0.3s;
        }
        .contact-phone:hover { color: var(--color-accent); transform: translateX(8px); }
        .contact-ways { display: flex; flex-direction: column; gap: 0; margin-bottom: 40px; }
        .contact-stats { margin-top: 48px; padding: 32px; background: var(--color-surface); border: 1px solid var(--color-border); }
        .stat-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--color-border); font-size: var(--text-sm); gap: 16px; }
        .stat-row:last-child { border-bottom: none; }
        .stat-label { color: var(--color-muted); flex-shrink: 0; font-family: var(--font-mono); }
        .stat-value { color: var(--color-text); font-weight: 700; text-align: right; font-family: var(--font-mono); }
        .contact-code {
          background: var(--color-surface); color: var(--color-text); padding: 32px;
          font-family: var(--font-mono); font-size: var(--text-sm); line-height: 2;
          border: 1px solid var(--color-border); overflow-x: auto;
        }
        .contact-code .comment { color: var(--color-muted); }
        .contact-code .string { color: var(--color-coral); }
        .contact-code .keyword { color: var(--color-gold); }

        footer { padding: 32px 64px; border-top: 1px solid var(--color-border); position: relative; z-index: 2; }
        .footer-inner {
          width: 100%; display: flex; justify-content: space-between;
          font-size: var(--text-xs); color: var(--color-muted); font-family: var(--font-mono);
          font-variant-numeric: tabular-nums; gap: 16px; flex-wrap: wrap; align-items: center;
        }
        .footer-links { display: flex; gap: 24px; }
        .footer-link { color: var(--color-muted); text-decoration: none; transition: color 0.2s; }
        .footer-link:hover { color: var(--color-accent); }

        @media (max-width: 900px) {
          nav { padding: 16px 24px; }
          .nav-links { display: none; }
          .hamburger { display: flex; }
          .hero { padding: 100px 24px 80px; }
          .hero-footer { left: 24px; bottom: 24px; }
          .section { padding: 80px 24px; }
          .section-header { margin-bottom: 48px; }
          .service-card { padding: 32px 24px; }
          .stack-grid { grid-template-columns: 1fr; gap: 48px; }
          .contact-grid { grid-template-columns: 1fr; gap: 48px; }
          footer { padding: 24px; }
          .footer-inner { flex-direction: column; gap: 8px; }
        }
        @media (max-width: 480px) {
          .hero-title { font-size: clamp(2.5rem, 13vw, 5rem); }
          .section-title { font-size: clamp(1.8rem, 8vw, 3rem); }
          .work-card { padding: 28px 20px; }
          .dev-card { padding: 28px 20px; }
          .contact-stats { padding: 20px; }
          .contact-code { padding: 20px 16px; font-size: 0.75rem; }
          .btn-primary, .btn-secondary { padding: 14px 24px; font-size: 0.9rem; width: 100%; justify-content: center; }
          .hero-actions { flex-direction: column; }
          .works-grid { grid-template-columns: 1fr; }
          .dev-grid { grid-template-columns: 1fr; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* SCROLL PROGRESS BAR */}
      <div className="scroll-bar" style={{ width: `${scrollPct * 100}%` }} />

      <div className="mesh-bg" />
      <div className="grid-overlay" />
      <Scene theme={theme} />
      <MouseTracker />

      {/* NAV */}
      <motion.nav style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0.9]) }}>
        <a href="#" className="logo">MEGA<span>Devs</span></a>
        <div className="nav-links">
          {nav.map(n => (
            <a key={n.l} href={n.h} className="nav-link">{n.l}</a>
          ))}
          <span className="cmd-hint-badge" title="Press / to open command palette">/ cmd</span>
          <button onClick={() => setCmdOpen(true)} className="cmd-btn">
            <span>⌘</span> CMD
          </button>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="theme-toggle" aria-label="Toggle theme">
            {theme === "light" ? "☀" : "☾"}
          </button>
          <button className={`hamburger${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </motion.nav>

      {menuOpen && (
        <motion.div className="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          {nav.map((n, i) => (
            <motion.a key={n.l} href={n.h} onClick={() => setMenuOpen(false)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              {n.l}
            </motion.a>
          ))}
          <div className="mobile-menu-footer">
            <button onClick={() => { setMenuOpen(false); setCmdOpen(true); }} className="cmd-btn">CMD</button>
          </div>
        </motion.div>
      )}

      {cmdOpen && (
        <div className="cmd-overlay" onClick={() => setCmdOpen(false)}>
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="cmd-palette" onClick={e => e.stopPropagation()}>
            <div className="cmd-input-wrap">
              <span style={{ color: 'var(--color-accent)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>&gt;</span>
              <input
                autoFocus value={cmdVal} onChange={e => setCmdVal(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Escape") setCmdOpen(false);
                  if (e.key === "Enter" && cmdVal.trim()) {
                    const m = nav.find(n => n.l.includes(cmdVal.trim().toLowerCase()));
                    if (m) { window.location.href = m.h; setCmdOpen(false); setCmdVal(""); }
                  }
                }}
                placeholder="Type a command..." className="cmd-input"
              />
              <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>ESC</span>
            </div>
            <div className="cmd-hint-label">Available Commands</div>
            <div>
              {nav.filter(n => n.l.includes(cmdVal.toLowerCase())).map(n => (
                <a key={n.l} href={n.h} onClick={() => setCmdOpen(false)} className="cmd-item">
                  <span>&gt;</span><span>{n.l}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* HERO */}
      <motion.section className="hero" style={{ opacity: heroOpacity, scale: heroScale }}>
        <div className="hero-inner">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="hero-label">
            MEGA Devs — Engineering Studio · Cairo, EG
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <h1 className="hero-title">
              We Ship.<br /><span className="accent">Fast.</span><br />Always.
            </h1>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.15 }} className="hero-meta">
            Two-person dev shop crafting high-performance web apps, Android ROMs, and AI systems. Zero bloat, full delivery.
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 }} className="hero-actions">
            <a href="#contact" className="btn-primary">Start a Project →</a>
            <a href="#works" className="btn-secondary">Our Works</a>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.25 }} className="hero-footer">
            Cairo · {currentTime}
          </motion.div>
        </div>
      </motion.section>

      {/* SERVICES */}
      <section id="services" className="section">
        <div className="section-inner">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="section-header">
            <div className="section-label">What We Do</div>
            <h2 className="section-title">Services that scale with your ambition</h2>
          </motion.div>
          <div className="services-grid">
            {services.map((s, i) => (
              <motion.a key={s.cmd} href="#contact" className="service-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}>
                <span className="service-number">{s.cmd}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="service-output">{s.output}</div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* WORKS */}
      <section id="works" className="section" style={{ background: 'var(--color-warm)', transition: 'background 0.3s' }}>
        <div className="section-inner">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="section-header">
            <div className="section-label">Portfolio</div>
            <h2 className="section-title">Things we&apos;ve shipped</h2>
          </motion.div>
          <div className="works-grid">
            {works.map((w, i) => (
              <motion.a key={w.num} href={w.link} target={w.link.startsWith("http") ? "_blank" : undefined} rel={w.link.startsWith("http") ? "noopener noreferrer" : undefined} className="work-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} whileHover={{ y: -5, scale: 1.02, rotateX: 2, rotateY: -2, transition: { type: "spring", stiffness: 300 } }} style={{ transformPerspective: 1000 }}>
                <div className="work-meta">
                  <span className="work-num">{w.num}</span>
                  <span className={`work-status ${w.status.toLowerCase()}`}>{w.status}</span>
                </div>
                <div className="work-category">{w.category}</div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
                <div className="work-tags">{w.tags.map(tag => <span key={tag} className="work-tag">{tag}</span>)}</div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* STACK */}
      <section id="stack" className="section stack-section">
        <div className="section-inner">
          <div className="stack-grid">
            <div>
              <h2 className="stack-title">Built for<br />modern<br />stacks</h2>
              <div className="stack-meta">
                <div className="stack-meta-item"><span className="stack-meta-label">Lang:</span><span>JavaScript, Python, C++</span></div>
                <div className="stack-meta-item"><span className="stack-meta-label">Runtime:</span><span>Linux, Android</span></div>
                <div className="stack-meta-item"><span className="stack-meta-label">Framework:</span><span>Next.js, React</span></div>
                <div className="stack-meta-item"><span className="stack-meta-label">Status:</span><span style={{ color: 'var(--color-sage)', fontWeight: 700 }}>● Nominal</span></div>
              </div>
            </div>
            <div>
              <div className="terminal-window">
                <div className="terminal-bar">
                  <span className="terminal-dot" /><span className="terminal-dot" /><span className="terminal-dot" />
                  <span className="terminal-title">mega-devs ~ tech_stack</span>
                </div>
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="terminal-body">
                  <div className="terminal-line command">$ cat tech_stack.txt</div>
                  <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }} className="tech-tags">
                    {techStack.map((t) => <span key={t} className="tech-tag">{t}</span>)}
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEVELOPERS */}
      <section id="developers" className="section">
        <div className="section-inner">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="section-header">
            <div className="section-label">The Team</div>
            <h2 className="section-title">Meet the<br />developers</h2>
          </motion.div>
          <div className="dev-grid">
            {developers.map((d, i) => (
              <motion.div key={d.name} className="dev-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} whileHover={{ y: -5, scale: 1.02, rotateX: 2, rotateY: 2, transition: { type: "spring", stiffness: 300 } }} style={{ transformPerspective: 1000 }}>
                <div className="dev-header">
                  <span className="dev-tag">{d.tag}</span>
                  <span className="dev-status"><span className="status-dot" />Available</span>
                </div>
                <Image src={d.image} alt={`Photo of ${d.name}`} width={80} height={80} className="dev-avatar" priority />
                <h3>{d.name}</h3>
                <p className="dev-role">{d.role}</p>
                <div className="dev-socials">
                  <a href={d.telegram} target="_blank" rel="noopener noreferrer" className="dev-social-link">✈ Telegram</a>
                  <a href={d.github} target="_blank" rel="noopener noreferrer" className="dev-social-link">⌥ GitHub</a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section">
        <div className="section-inner">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="section-header">
            <div className="section-label">Get in Touch</div>
            <h2 className="section-title">Let&apos;s build<br />something<br />great</h2>
          </motion.div>
          <div className="contact-grid">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}>
              <p className="contact-desc">Have a project in mind? We&apos;re ready to help you build something extraordinary.</p>
              <div className="contact-ways">
                <a href="mailto:megatrondevs@gmail.com" className="contact-email">megatrondevs@gmail.com →</a>
                <a href="tel:+201509916991" className="contact-phone">+20 150 991 6991 →</a>
              </div>
              <div className="contact-stats">
                <div className="stat-row"><span className="stat-label">Response Time</span><span className="stat-value">&lt; 24h</span></div>
                <div className="stat-row"><span className="stat-label">Timezone</span><span className="stat-value">UTC+3 (Cairo)</span></div>
                <div className="stat-row"><span className="stat-label">Languages</span><span className="stat-value">Arabic · English</span></div>
                <div className="stat-row"><span className="stat-label">Availability</span><span className="stat-value" style={{ color: 'var(--color-sage)' }}>● Open to work</span></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="contact-code">
              <div><span className="comment"># Send us a message</span></div>
              <div><span className="keyword">email:</span> <span className="string">&quot;megatrondevs@gmail.com&quot;</span></div>
              <div><span className="keyword">phone:</span> <span className="string">&quot;+20 150 991 6991&quot;</span></div>
              <div><span className="keyword">subject:</span> <span className="string">&quot;Project Inquiry&quot;</span></div>
              <div><span className="keyword">priority:</span> <span style={{ color: 'var(--color-coral)' }}>&quot;high&quot;</span></div>
              <div><span className="comment"># Status: awaiting your input_</span></div>
            </motion.div>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-inner">
          <span>MEGA Devs © {new Date().getFullYear()} — All rights reserved</span>
          <div className="footer-links">
            <a href="https://github.com/mega-devs" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
            <a href="mailto:megatrondevs@gmail.com" className="footer-link">Email</a>
            <a href="#" className="footer-link">Back to top ↑</a>
          </div>
          <span>{currentTime}</span>
        </div>
      </footer>
    </div>
  );
}
