"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import MagneticButton from "./components/MagneticButton";
import { useLang } from "./lib/i18n";
import "./page.css";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const developers = [
  {
    name: "Adham Ahmed",
    role: "Frontend, ROM & Web Developer",
    telegram: "https://t.me/llxcd_EG",
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
  },
  {
    num: "02",
    title: "Android ROMs",
    sub: "Kernel · AOSP · OEM",
    desc: "Custom kernels with hand-tuned governors, debloated system images, and minimal UI overlays. Real performance, not benchmarks.",
    metric: "12s",
    metricLabel: "cold boot time",
  },
  {
    num: "03",
    title: "Backend Architecture",
    sub: "APIs · Infra · Databases",
    desc: "Systems engineered to grow. From 10 users to 10 million — horizontal scaling, zero-downtime deploys, and 99.9% uptime SLAs.",
    metric: "847d",
    metricLabel: "longest uptime",
  },
  {
    num: "04",
    title: "AI & ML Systems",
    sub: "Training · Inference · Pipelines",
    desc: "Models that ship to production, not stay in notebooks. Fast inference, clean pipelines, and accuracy numbers that mean something.",
    metric: "94.2%",
    metricLabel: "production accuracy",
  },
];

const works = [
  {
    num: "01",
    title: "MEGA ROM",
    category: "Android ROM",
    year: "2023",
    tags: ["Android", "C++", "Kernel", "AOSP"],
    status: "Live",
    link: "https://roms.megadevs.site/",
  },
  {
    num: "02",
    title: "Kira Store",
    category: "Web App",
    year: "2024",
    tags: ["Next.js", "PostgreSQL", "Redis", "Stripe"],
    status: "Live",
    link: "https://kiradecoration.vercel.app/",
  },
  {
    num: "03",
    title: "SentinelAI",
    category: "AI System",
    year: "2024",
    tags: ["Python", "PyTorch", "FastAPI", "Docker"],
    status: "Private",
    link: "#works",
  },
  {
    num: "04",
    title: "DevPanel",
    category: "Backend",
    year: "2024",
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
  { num: "01", title: "Discover", desc: "A technical audit that maps your requirements, constraints, and existing systems before we write a line of code." },
  { num: "02", title: "Build", desc: "Tight sprints, daily commits, and a shared staging environment so you watch the product take shape in real time." },
  { num: "03", title: "Ship", desc: "Zero-downtime deploys, automated rollbacks, and a launch checklist covering performance, security, and monitoring." },
  { num: "04", title: "Support", desc: "Post-launch we stay on-call for bug fixes, scaling advice, and whatever's next on your roadmap." },
];

const faqs = [
  { q: "How fast can you start a new project?", a: "Most engagements kick off within 48 hours of a signed scope — we keep our roster small on purpose so there's no queue." },
  { q: "Do you work with existing codebases?", a: "Yes. We regularly inherit legacy stacks, audit them first, then plan incremental refactors instead of risky rewrites." },
  { q: "What's your typical engagement length?", a: "Anywhere from a two-week sprint to an open-ended retainer. We scope in phases so you're never locked into more than you need." },
  { q: "Can you handle both the app and the infrastructure?", a: "Yes — frontend, backend, deployment, CI/CD, and monitoring. One team, one point of contact." },
];

// Full index — powers the ⌘ command palette and the mobile drawer.
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
  const { t } = useLang();
  const [currentTime, setCurrentTime] = useState("");
  const [scrollPct, setScrollPct] = useState(0);
  const [activeService, setActiveService] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 750, damping: 38 });
  const springY = useSpring(cursorY, { stiffness: 750, damping: 38 });
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacityRaw = useTransform(scrollYProgress, [0, 0.16], [1, 0]);
  const heroYRaw = useTransform(scrollYProgress, [0, 0.16], [0, -50]);
  const heroOpacity = isMobile ? 1 : heroOpacityRaw;
  const heroY = isMobile ? 0 : heroYRaw;

  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

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
          hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
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
    const t = setInterval(() => setActiveService(s => (s + 1) % services.length), 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const ids = nav.filter((n) => n.h.startsWith("#")).map((n) => n.h.slice(1));
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.id); });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const sectionLabels: Record<string, string> = {
    services: "§01 · Services",
    process: "§02 · Process",
    works: "§03 · Works",
    stack: "§04 · Stack",
    faq: "§05 · FAQ",
    developers: "§06 · Team",
    contact: "§07 · Contact",
  };
  const activeLabel = sectionLabels[activeSection] ?? "MEGA · Devs";

  return (
    <div className="root">
      <motion.div className="cursor" style={{ x: springX, y: springY }} />
      <div className="scroll-bar" style={isMobile ? undefined : { width: `${scrollPct * 100}%` }} />

      {/* FIXED SIDE-RAIL */}
      <div className="side-rail" aria-hidden="true">
        <span className="side-rail-txt mark">{t(activeLabel)}</span>
        <div className="side-rail-line" />
        <span className="side-rail-txt side-rail-scroll">{t("Scroll ↓")}</span>
      </div>

      {/* BG */}
      <div className="paper-lines" />
      <div className="paper-glow" />
      <div className="paper-vignette" />
      <div className="noise" />

      {/* ═══ HERO ═══ */}
      <motion.section className="hero" ref={heroRef} style={{ opacity: heroOpacity, y: heroY }}>
        <div className="hero-year" aria-hidden="true">&rsquo;22</div>
        <div className="hero-top">
          <div className="hero-issue">
            <span className="kicker">MEGA Devs</span>
            <span className="meta">{t("Issue №01")}</span>
            <span className="meta">{t("Cairo · Egypt")}</span>
          </div>
          <span className="meta">{t("Est. 2022")}</span>
        </div>

        <motion.h1 className="hero-title"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
          initial="hidden" animate="show">
          <motion.span variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { type: "spring", damping: 22, stiffness: 120 } } }}>{t("We Ship.")}</motion.span>
          <motion.span variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { type: "spring", damping: 22, stiffness: 120 } } }} className="accent">{t("Fast.")}</motion.span>
          <motion.span variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { type: "spring", damping: 22, stiffness: 120 } } }} className="outline">{t("Always.")}</motion.span>
        </motion.h1>

        <div className="hero-mid">
          <motion.p className="hero-dek" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}>
            {t("Two engineers from Cairo building ")}<strong>{t("high-performance web apps")}</strong>{t(", custom Android ROMs, and production-grade AI systems for clients across the Middle East and beyond.")}
          </motion.p>
          <motion.div className="hero-cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
            <MagneticButton href="#contact" className="btn-solid"><span>{t("Start a Project →")}</span></MagneticButton>
            <a href="/works" className="btn-line"><span>{t("Our Works")}</span></a>
          </motion.div>
        </div>

        <motion.div className="hero-tags" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.45 }}>
          {["Web Apps", "Android ROMs", "AI Systems", "Backends", "Edge"].map((chip) => (
            <span key={chip} className="hero-chip">{t(chip)}</span>
          ))}
        </motion.div>

        <motion.div className="hero-promo" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
          <span className="hero-promo-text">{t("Make your first free portfolio website online")}</span>
          <a href="https://megadevs.site/login" className="btn-solid">{t("Start Now →")}</a>
        </motion.div>

        <div className="hero-status">
          <div className="meta"><span className="status-live" />{t("Systems Nominal")}</div>
          <div className="meta">{t("Cairo · Egypt").split(" · ")[0]} · {currentTime}</div>
          <div className="meta">{t("UTC+3 · Available")}</div>
        </div>
      </motion.section>

      {/* ═══ TICKER ═══ */}
      <div className="ticker">
        <div className="ticker-track">
          {[...techStack, ...techStack].map((t, i) => (
            <span key={`${t.name}-${i}`} className="ticker-item">{t.name}</span>
          ))}
        </div>
      </div>

      {/* ═══ STATS ═══ */}
      <div className="stats">
        {stats.map((s, i) => (
          <motion.div key={s.label} className="stat" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
            <div className="stat-num">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* ═══ SERVICES ═══ */}
      <section id="services" className="section">
        <div className="wrap">
          <div className="sec-head">
            <div className="sec-index">§01</div>
            <div className="sec-head-r">
              <div className="sec-head-top"><span className="kicker">{t("What We Do")}</span><div className="rule" /></div>
              <h2 className="sec-title">{t("Services that ")}<em>{t("scale")}</em></h2>
            </div>
          </div>
          <div className="svc-list">
            {services.map((s, i) => (
              <motion.a key={s.num} href="#contact" className={`svc${activeService === i ? " active" : ""}`}
                onMouseEnter={() => setActiveService(i)}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ type: "spring", damping: 24, stiffness: 130, delay: i * 0.05 }}>
                <span className="svc-num">{s.num}</span>
                <div>
                  <div className="svc-name">{t(s.title)}</div>
                  <div className="svc-sub">{t(s.sub)}</div>
                </div>
                <div className="svc-desc">{t(s.desc)}</div>
                <div className="svc-metric">
                  <span className="svc-metric-val">{s.metric}</span>
                  <span className="svc-metric-lab">{t(s.metricLabel)}</span>
                  <span className="svc-arrow">↗</span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROCESS ═══ */}
      <section id="process" className="section alt">
        <div className="wrap">
          <div className="sec-head">
            <div className="sec-index">§02</div>
            <div className="sec-head-r">
              <div className="sec-head-top"><span className="kicker">{t("How We Work")}</span><div className="rule" /></div>
              <h2 className="sec-title">{t("Built for ")}<em>{t("momentum")}</em></h2>
            </div>
          </div>
          <div className="proc-grid">
            {process.map((p, i) => (
              <motion.div key={p.num} className="proc" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", damping: 24, stiffness: 130, delay: i * 0.06 }}>
                <div className="proc-num">{p.num}</div>
                <div className="proc-title">{t(p.title)}</div>
                <div className="proc-desc">{t(p.desc)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WORKS ═══ */}
      <section id="works" className="section">
        <div className="wrap">
          <div className="sec-head">
            <div className="sec-index">§03</div>
            <div className="sec-head-r">
              <div className="sec-head-top"><span className="kicker">{t("Portfolio")}</span><div className="rule" /></div>
              <h2 className="sec-title">{t("Things we've ")}<em>{t("shipped")}</em></h2>
            </div>
          </div>
          <div>
            {works.map((w, i) => (
              <motion.a key={w.num} href={w.link}
                target={w.link.startsWith("http") ? "_blank" : undefined}
                rel={w.link.startsWith("http") ? "noopener noreferrer" : undefined}
                className="work"
                initial={{ opacity: 0, x: isMobile ? 0 : -30, y: isMobile ? 16 : 0 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true }}
                transition={{ type: "spring", damping: 26, stiffness: 140, delay: i * 0.05 }}>
                <span className="work-num">{w.num}</span>
                <div>
                  <div className="work-cat">{t(w.category)}</div>
                  <div className="work-title">{w.title}</div>
                  <div className="work-tags">{w.tags.map((tag) => <span key={tag} className="work-tag">{tag}</span>)}</div>
                </div>
                <span className="work-year">{w.year}</span>
                <span className={`work-status ${w.status.toLowerCase()}`}>{t(w.status)}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STACK ═══ */}
      <section id="stack" className="section alt">
        <div className="wrap">
          <div className="sec-head">
            <div className="sec-index">§04</div>
            <div className="sec-head-r">
              <div className="sec-head-top"><span className="kicker">{t("Tech Stack")}</span><div className="rule" /></div>
              <h2 className="sec-title">{t("Modern ")}<em>{t("arsenal")}</em></h2>
            </div>
          </div>
          <div className="stack">
            <div>
              <h3 className="stack-title">{t("Built for modern stacks")}</h3>
              <div className="stack-meta">
                {[
                  { k: "Languages", v: "JavaScript, Python, C++" },
                  { k: "Runtime", v: "Linux, Android, Edge" },
                  { k: "Frameworks", v: "Next.js, React, FastAPI" },
                  { k: "Databases", v: "PostgreSQL, Redis, SQLite" },
                  { k: "Status", v: "● All systems nominal" },
                ].map((m) => (
                  <div key={m.k} className="stack-meta-row">
                    <span className="stack-meta-k">{t(m.k)}</span>
                    <span className="stack-meta-v">{t(m.v)}</span>
                  </div>
                ))}
              </div>
            </div>
            <motion.div className="stack-grid" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              {techStack.map((tech, i) => (
                <div key={tech.name} className="stack-cell">
                  <span className="stack-cell-idx">{String(i + 1).padStart(2, "0")}</span>
                  <span className="stack-cell-name">{tech.name}</span>
                  <span className="stack-cell-cat">{t(tech.cat)}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="section">
        <div className="wrap">
          <div className="sec-head">
            <div className="sec-index">§05</div>
            <div className="sec-head-r">
              <div className="sec-head-top"><span className="kicker">{t("Questions")}</span><div className="rule" /></div>
              <h2 className="sec-title">{t("Frequently ")}<em>{t("asked")}</em></h2>
            </div>
          </div>
          <div className="faq">
            {faqs.map((f, i) => (
              <div key={f.q} className="faq-item">
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                  <span className="faq-q-num">0{i + 1}</span>
                  <span>{t(f.q)}</span>
                  <span className={`faq-icon${openFaq === i ? " open" : ""}`}>+</span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div className="faq-a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                      <div className="faq-a-inner">{t(f.a)}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TEAM ═══ */}
      <section id="developers" className="section alt">
        <div className="wrap">
          <div className="sec-head">
            <div className="sec-index">§06</div>
            <div className="sec-head-r">
              <div className="sec-head-top"><span className="kicker">{t("The Team")}</span><div className="rule" /></div>
              <h2 className="sec-title">{t("Meet the ")}<em>{t("engineers")}</em></h2>
            </div>
          </div>
          <div className="team-grid">
            {developers.map((d, i) => (
              <motion.div key={d.name} className="dev" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", damping: 24, stiffness: 130, delay: i * 0.08 }}>
                <div className="dev-idx">{d.index}</div>
                <div className="dev-top">
                  <span className="dev-tag">{t(d.tag)}</span>
                  <span className="dev-avail"><span className="status-live" />{t("Available")}</span>
                </div>
                <Image src={d.image} alt={`Photo of ${d.name}`} width={76} height={76} className="dev-avatar" loading="lazy" />
                <div className="dev-name">{d.name}</div>
                <div className="dev-role">{t(d.role)}</div>
                <div className="dev-links">
                  <a href={d.telegram} target="_blank" rel="noopener noreferrer" className="dev-link">{t("✈ Telegram")}</a>
                  <a href={d.github} target="_blank" rel="noopener noreferrer" className="dev-link">⌥ GitHub</a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MARQUEE DIVIDER ═══ */}
      <div className="mq-divider">
        <div className="mq-divider-track">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="mq-divider-item">
              {t("Let's Build Something Great ")}<b>✦</b> {t("Available for Work ")}<b>✦</b>
            </span>
          ))}
        </div>
      </div>

      {/* ═══ CONTACT ═══ */}
      <section id="contact" className="section">
        <div className="wrap">
          <div className="sec-head">
            <div className="sec-index">§07</div>
            <div className="sec-head-r">
              <div className="sec-head-top"><span className="kicker">{t("Get in Touch")}</span><div className="rule" /></div>
              <h2 className="sec-title">{t("Let's build something ")}<em>{t("great")}</em></h2>
            </div>
          </div>
          <div className="contact">
            <div>
              <p className="contact-lead">{t("Have a project? We're two engineers ready to turn your idea into production-grade software — from first commit to live deploy.")}</p>
              <div className="contact-links">
                <a href="mailto:megatrondevs@gmail.com" className="contact-link">
                  <span>megatrondevs@gmail.com</span><span className="contact-link-arrow">→</span>
                </a>
                <a href="tel:+201509916991" className="contact-link">
                  <span>+20 150 991 6991</span><span className="contact-link-arrow">→</span>
                </a>
              </div>
              <div className="contact-meta">
                {[
                  { k: "Response Time", v: "< 24h" },
                  { k: "Timezone", v: "UTC+3 (Cairo)" },
                  { k: "Languages", v: "Arabic · English" },
                  { k: "Availability", v: "● Open to Work", cls: "green" },
                ].map((r) => (
                  <div key={r.k} className="contact-meta-row">
                    <span className="contact-meta-k">{t(r.k)}</span>
                    <span className={`contact-meta-v${r.cls ? ` ${r.cls}` : ""}`}>{t(r.v)}</span>
                  </div>
                ))}
              </div>
            </div>
            <motion.div className="contact-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", damping: 24, stiffness: 130 }}>
              <div><span className="c-comment">{t("# Project inquiry template")}</span></div>
              <div>&nbsp;</div>
              <div><span className="c-key">email</span>: <span className="c-val">&quot;megatrondevs@gmail.com&quot;</span></div>
              <div><span className="c-key">phone</span>: <span className="c-val">&quot;+20 150 991 6991&quot;</span></div>
              <div><span className="c-key">subject</span>: <span className="c-val">&quot;New Project Inquiry&quot;</span></div>
              <div><span className="c-key">priority</span>: <span className="c-val">&quot;high&quot;</span></div>
              <div>&nbsp;</div>
              <div><span className="c-key">status</span>: <span className="c-val">&quot;awaiting_your_message&quot;</span><span className="c-cursor">_</span></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ HISTORY CTA ═══ */}
      <div className="history">
        <div className="history-eyebrow">{t("The Origin Story")}</div>
        <h2 className="history-title">{t("Curious how ")}<em>MEGA Devs</em>{t(" started?")}</h2>
        <a href="/history" className="btn-solid">{t("Read Our Story →")}</a>
      </div>

      {/* ═══ COLOPHON / FOOTER ═══ */}
      <footer className="colophon">
        <div className="colophon-top">
          <div className="colophon-word">MEGA<b>·</b>DEVS</div>
          <div className="colophon-cols">
            <div className="colophon-col">
              <h4>{t("Navigate")}</h4>
              <a href="#services">{t("Services")}</a>
              <a href="#works">{t("Works")}</a>
              <a href="/history">{t("Our Story")}</a>
              <a href="#contact">{t("Contact")}</a>
            </div>
            <div className="colophon-col">
              <h4>{t("Connect")}</h4>
              <a href="mailto:megatrondevs@gmail.com">{t("Email")}</a>
              <a href="https://github.com/AdhamBinAhmed" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="/palestine">{t("🇵🇸 Palestine")}</a>
              <a href="#">{t("↑ Back to Top")}</a>
            </div>
            <div className="colophon-col">
              <h4>{t("Studio Time")}</h4>
              <span>{t("Cairo · Egypt").split(" · ")[0]} · {currentTime}</span>
              <span>{t("UTC+3")}</span>
              <span>{t("● Open to Work")}</span>
            </div>
          </div>
        </div>
        <div className="colophon-bottom">
          <span className="colophon-copy">© {new Date().getFullYear()} {t("MEGA Devs · Cairo, Egypt · All rights reserved")}</span>
          <span className="colophon-copy">{t("Designed & built in-house — press / for commands")}</span>
        </div>
      </footer>
    </div>
  );
}
