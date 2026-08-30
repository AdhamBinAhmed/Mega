"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useMemo } from "react";
import MagneticButton from "./components/MagneticButton";
import "./page.css";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const developers = [
  {
    name: "Adham Ahmed",
    role: "Frontend, ROM & Web Developer",
    telegram: "https://t.me/llxcd_EGy",
    github: "https://github.com/AdhamBinAhmed",
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

const process = [
  {
    num: "01",
    title: "Discover",
    desc: "A technical audit that maps your requirements, constraints, and existing systems before we write a line of code.",
  },
  {
    num: "02",
    title: "Build",
    desc: "Tight sprints, daily commits, and a shared staging environment so you watch the product take shape in real time.",
  },
  {
    num: "03",
    title: "Ship",
    desc: "Zero-downtime deploys, automated rollbacks, and a launch checklist covering performance, security, and monitoring.",
  },
  {
    num: "04",
    title: "Support",
    desc: "Post-launch we stay on-call for bug fixes, scaling advice, and whatever's next on your roadmap.",
  },
];

const faqs = [
  {
    q: "How fast can you start a new project?",
    a: "Most engagements kick off within 48 hours of a signed scope — we keep our roster small on purpose so there's no queue.",
  },
  {
    q: "Do you work with existing codebases?",
    a: "Yes. We regularly inherit legacy stacks, audit them first, then plan incremental refactors instead of risky rewrites.",
  },
  {
    q: "What's your typical engagement length?",
    a: "Anywhere from a two-week sprint to an open-ended retainer. We scope in phases so you're never locked into more than you need.",
  },
  {
    q: "Can you handle both the app and the infrastructure?",
    a: "Yes — frontend, backend, deployment, CI/CD, and monitoring. One team, one point of contact.",
  },
];

const nav = [
  { l: "Services", h: "#services" },
  { l: "Process", h: "#process" },
  { l: "Works", h: "/works" },
  { l: "Our Story", h: "/history" },
  { l: "Stack", h: "#stack" },
  { l: "FAQ", h: "#faq" },
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
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [toast, setToast] = useState<string | null>(null);

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

  // Scroll-spy: highlight the nav link for the section currently in view
  useEffect(() => {
    const ids = nav.filter((n) => n.h.startsWith("#")).map((n) => n.h.slice(1));
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const cmdActions = [
    { l: "Toggle Theme", icon: "◐", run: () => setTheme((t) => (t === "light" ? "dark" : "light")) },
    {
      l: "Copy Email",
      icon: "✉",
      run: () => {
        navigator.clipboard?.writeText("megatrondevs@gmail.com");
        setToast("Email copied to clipboard");
      },
    },
    { l: "Scroll to Top", icon: "↑", run: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    { l: "Open GitHub", icon: "⌥", run: () => window.open("https://github.com/AdhamBinAhmed", "_blank") },
    { l: "Stand with Palestine", icon: "🇵🇸", run: () => { window.location.href = "/palestine"; } },
  ];

  return (
    <div className="root" data-theme={theme}>

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
          <img src="/light_mode_img.jpg" alt="MEGADevs" className="logo-img logo-img-light" />
          <img src="/dark_mode_img.jpg" alt="MEGADevs" className="logo-img logo-img-dark" />
          <span className="logo-dot" />
        </a>
        <div className="nav-links">
          {nav.map((n) => (
            <a
              key={n.l} href={n.h}
              className={`nav-link${n.h === `#${activeSection}` ? " active" : ""}`}
            >{n.l}</a>
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
                      const q = cmdVal.trim().toLowerCase();
                      const m = nav.find((n) => n.l.toLowerCase().includes(q));
                      if (m) { window.location.href = m.h; setCmdOpen(false); setCmdVal(""); return; }
                      const a = cmdActions.find((a) => a.l.toLowerCase().includes(q));
                      if (a) { a.run(); setCmdOpen(false); setCmdVal(""); }
                    }
                  }}
                  placeholder="Navigate or run a command..." className="cmd-input"
                />
                <span className="cmd-esc">ESC</span>
              </div>
              {nav.filter((n) => n.l.toLowerCase().includes(cmdVal.toLowerCase())).length > 0 && (
                <>
                  <div className="cmd-label">Sections</div>
                  {nav.filter((n) => n.l.toLowerCase().includes(cmdVal.toLowerCase())).map((n) => (
                    <a key={n.l} href={n.h} onClick={() => setCmdOpen(false)} className="cmd-item">
                      <span className="cmd-arrow">&gt;</span>
                      <span>{n.l}</span>
                    </a>
                  ))}
                </>
              )}
              {cmdActions.filter((a) => a.l.toLowerCase().includes(cmdVal.toLowerCase())).length > 0 && (
                <>
                  <div className="cmd-label">Actions</div>
                  {cmdActions.filter((a) => a.l.toLowerCase().includes(cmdVal.toLowerCase())).map((a) => (
                    <button
                      key={a.l}
                      onClick={() => { a.run(); setCmdOpen(false); setCmdVal(""); }}
                      className="cmd-item cmd-item-btn"
                    >
                      <span className="cmd-arrow">{a.icon}</span>
                      <span>{a.l}</span>
                    </button>
                  ))}
                </>
              )}
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

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            style={{ marginTop: "32px", display: "flex" }}
          >
            <div className="glass-card" style={{ padding: "12px 16px 12px 24px", display: "inline-flex", alignItems: "center", gap: "20px", borderRadius: "999px", border: "1px solid var(--border)", background: "rgba(255, 255, 255, 0.03)", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text)" }}>
                Make your first free portfolio online website
              </span>
              <a href="https://megadevs.site/login" className="btn-primary" style={{ padding: "10px 24px", fontSize: "0.85rem" }}>
                Start Now &rarr;
              </a>
            </div>
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

      {/* ── TECH TICKER ── */}
      <div className="tech-marquee">
        <div className="tech-marquee-track">
          {[...techStack, ...techStack].map((t, i) => (
            <span key={`${t.name}-${i}`} className="tech-marquee-item">
              <span className="tech-marquee-dot" />
              {t.name}
            </span>
          ))}
        </div>
      </div>

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

      {/* ── PROCESS ── */}
      <section id="process" className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="section-inner">
          <div className="section-eyebrow">
            <div className="section-line" />
            <span className="section-tag">How We Work</span>
            <span className="section-num">§02</span>
          </div>
          <h2 className="section-title">A process built for <em>momentum</em></h2>
          <div className="process-grid">
            {process.map((p, i) => (
              <motion.div
                key={p.num} className="process-card"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ type: "spring", damping: 22, stiffness: 120, delay: i * 0.08 }}
              >
                <div className="process-num">{p.num}</div>
                <div className="process-title">{p.title}</div>
                <div className="process-desc">{p.desc}</div>
              </motion.div>
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
                <span className="section-num">§03</span>
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
            <span className="section-num">§04</span>
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

      {/* ── FAQ ── */}
      <section id="faq" className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="section-inner">
          <div className="section-eyebrow">
            <div className="section-line" />
            <span className="section-tag">Questions</span>
            <span className="section-num">§05</span>
          </div>
          <h2 className="section-title">Frequently <em>asked</em></h2>
          <div className="faq-list">
            {faqs.map((f, i) => (
              <div key={f.q} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{f.q}</span>
                  <span className={`faq-icon${openFaq === i ? " open" : ""}`}>+</span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      className="faq-answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="faq-answer-inner">{f.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section id="developers" className="section-devs">
        <div className="section-inner-devs">
          <div className="section-eyebrow">
            <div className="section-line" />
            <span className="section-tag">The Team</span>
            <span className="section-num">§06</span>
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
                <Image src={d.image} alt={`Photo of ${d.name}`} width={72} height={72} className="dev-avatar-extracted" loading="lazy" />
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
            <span className="section-num">§07</span>
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

      {/* ── TOAST ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast glass-panel"
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            transition={{ type: "spring", damping: 24, stiffness: 200 }}
          >
            <span className="toast-dot" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
