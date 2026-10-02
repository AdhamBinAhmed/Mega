"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useLang } from "../lib/i18n";

type Work = {
  num: string;
  title: string;
  category: string;
  year: string;
  desc: string;
  tags: string[];
  status: "Live" | "Private";
  link: string;
  accent: string;
  accent2: string;
  metrics: { k: string; v: string }[];
  window: "browser" | "terminal" | "mobile" | "dashboard";
  // Optional static screenshot served from /public. Present only for sites that
  // are live, public, and render without a stuck loader; the rest fall back to
  // the animated window below.
  shot?: string;
};

const works: Work[] = [
  {
    num: "01",
<<<<<<< HEAD
=======
    title: "DevMega",
    category: "Developer Tools",
    year: "2026",
    desc: "A curated suite of eight privacy-first developer utilities — live GitHub analysis, error debugging, a real regex IDE, API workspace, secret scanning, and more. Client-side, blazing fast, and free forever.",
    tags: ["Next.js", "TypeScript", "Privacy-first", "Client-side"],
    status: "Live",
    link: "https://dev.megadevs.site",
    accent: "#38bdf8",
    accent2: "#818cf8",
    metrics: [
      { k: "8", v: "Free Tools" },
      { k: "0ms", v: "Client Latency" },
      { k: "100%", v: "Private" },
    ],
    window: "dashboard",
  },
  {
    num: "02",
>>>>>>> 00202ba (this-website-limit-is-down-contact-owner-Megadevs.site)
    title: "MEGA ROM",
    category: "Android Platform",
    year: "2023",
    desc: "A custom Android distribution built on AOSP, featuring targeted performance optimizations, a streamlined system image, and a refined minimal interface. Deployed across Xiaomi and Samsung devices.",
    tags: ["Android", "C++", "Kernel", "AOSP"],
    status: "Live",
    link: "https://megaroms.ggff.net/",
    accent: "#22c55e",
    accent2: "#4ade80",
    metrics: [
      { k: "2", v: "OEM Families" },
      { k: "AOSP", v: "Built From Source" },
      { k: "< 60s", v: "Boot Time" },
    ],
    window: "mobile",
  },
  {
<<<<<<< HEAD
    num: "02",
=======
    num: "03",
>>>>>>> 00202ba (this-website-limit-is-down-contact-owner-Megadevs.site)
    title: "Kira Store",
    category: "Web Application",
    year: "2024",
    desc: "A full-stack e-commerce platform featuring real-time inventory management, bilingual Arabic and English support, integrated payment processing, and a purpose-built administrative dashboard.",
    tags: ["Next.js", "PostgreSQL", "Redis", "Stripe"],
    status: "Live",
    link: "https://kira.megadevs.site",
    shot: "/works/kira-store-v2.png",
    accent: "#e84545",
    accent2: "#ff7043",
    metrics: [
      { k: "2", v: "Languages" },
      { k: "Realtime", v: "Inventory" },
      { k: "Stripe", v: "Payments" },
    ],
    window: "browser",
  },
  {
<<<<<<< HEAD
    num: "03",
=======
    num: "04",
>>>>>>> 00202ba (this-website-limit-is-down-contact-owner-Megadevs.site)
    title: "Asseli",
    category: "Brand & E-Commerce",
    year: "2025",
    desc: "A warm, refined storefront and brand experience for Asseli — an artisan honey producer. Crafted with smooth motion and a clean product presentation to showcase small-batch, natural honey and turn visitors into loyal customers.",
    tags: ["Next.js", "Tailwind", "Framer Motion", "Vercel"],
    status: "Live",
    link: "https://asseli.vercel.app",
    accent: "#f4a01c",
    accent2: "#ffcf5c",
    metrics: [
      { k: "Craft", v: "Small-Batch" },
      { k: "100%", v: "Natural Product" },
      { k: "Live", v: "In Production" },
    ],
    window: "browser",
  },
  {
<<<<<<< HEAD
    num: "04",
=======
    num: "05",
>>>>>>> 00202ba (this-website-limit-is-down-contact-owner-Megadevs.site)
    title: "SentinelAI",
    category: "AI System",
    year: "2024",
    desc: "A machine learning threat-detection system trained on live network traffic, delivering sub-10ms inference at over 94% accuracy. Currently operating in production for two enterprise clients.",
    tags: ["Python", "PyTorch", "FastAPI", "Docker"],
    status: "Private",
    link: "#",
    accent: "#a855f7",
    accent2: "#c084fc",
    metrics: [
      { k: "94%+", v: "Accuracy" },
      { k: "< 10ms", v: "Inference" },
      { k: "2", v: "Enterprise Clients" },
    ],
    window: "terminal",
  },
  {
<<<<<<< HEAD
    num: "05",
=======
    num: "06",
>>>>>>> 00202ba (this-website-limit-is-down-contact-owner-Megadevs.site)
    title: "DevPanel",
    category: "Infrastructure",
    year: "2024",
    desc: "An internal server-management platform providing live performance metrics, secure SSH tunneling, real-time log streaming, and intelligent alerting — maintaining over 847 days of continuous uptime.",
    tags: ["Node.js", "WebSockets", "Linux", "Nginx"],
    status: "Private",
    link: "#",
    accent: "#ffd166",
    accent2: "#ff7043",
    metrics: [
      { k: "847+", v: "Days Uptime" },
      { k: "Live", v: "Log Streaming" },
      { k: "24/7", v: "Alerting" },
    ],
    window: "dashboard",
  },
  {
<<<<<<< HEAD
    num: "06",
=======
    num: "07",
>>>>>>> 00202ba (this-website-limit-is-down-contact-owner-Megadevs.site)
    title: "Kira Decoration",
    category: "Brand & Portfolio",
    year: "2024",
    desc: "The brand and portfolio site for Kira Decoration — a Cairo-based interior design and event studio. A polished digital storefront that showcases delivered projects and connects clients directly across Instagram, WhatsApp, and more.",
    tags: ["Next.js", "Tailwind", "Framer Motion", "Vercel"],
    status: "Live",
    link: "https://infokira.megadevs.site",
    accent: "#d98a6a",
    accent2: "#f0b9a0",
    metrics: [
      { k: "77+", v: "Projects Delivered" },
      { k: "2024", v: "Established" },
      { k: "Multi", v: "Social Channels" },
    ],
    window: "browser",
  },
  {
<<<<<<< HEAD
    num: "07",
=======
    num: "08",
>>>>>>> 00202ba (this-website-limit-is-down-contact-owner-Megadevs.site)
    title: "DevFolio",
    category: "Developer Tool",
    year: "2025",
    desc: "A developer portfolio generator that turns any GitHub account into a polished, shareable CV instantly. It detects skills from repo topics and language mix, aggregates real byte-count language analytics, ranks projects by recency-weighted activity, and scores repo health — no manual data entry required.",
    tags: ["Next.js", "GitHub API", "TypeScript", "Vercel"],
    status: "Live",
    link: "https://gitcv.megadevs.site/",
    shot: "/works/devfolio-v2.png",
    accent: "#38bdf8",
    accent2: "#818cf8",
    metrics: [
      { k: "Auto", v: "Skill Detection" },
      { k: "1yr", v: "Contribution Graph" },
      { k: "PDF", v: "Exportable CV" },
    ],
    window: "browser",
  },
];

const stats = [
  { k: "04", v: "Flagship Projects" },
  { k: "2023", v: "Building Since" },
  { k: "100%", v: "Shipped to Production" },
  { k: "847+", v: "Days Max Uptime" },
];

function WindowVisual({ work }: { work: Work }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  // Use a real screenshot only when we have a static image AND it actually
  // loaded; on any load error we fall through to the animated placeholder.
  const hasShot = !!work.shot && !failed;
  return (
    <div className="w-visual" style={{ ["--wa" as string]: work.accent, ["--wa2" as string]: work.accent2 }}>
      <div className="w-visual-glow" />
      <div className="w-window">
        <div className="w-window-bar">
          <span className="w-dot" style={{ background: "#ff5f57" }} />
          <span className="w-dot" style={{ background: "#febc2e" }} />
          <span className="w-dot" style={{ background: "#28c840" }} />
          <span className="w-window-label">
            {hasShot ? work.link.replace(/^https?:\/\//, "").replace(/\/$/, "") : work.title.toLowerCase().replace(/\s+/g, "")}
          </span>
        </div>
        <div className={`w-window-body wb-${work.window}`}>
          {hasShot && (
            <img
              className="w-shot"
              src={work.shot}
              alt={`Preview of ${work.title}`}
              loading="lazy"
              style={{ opacity: loaded ? 1 : 0 }}
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
            />
          )}
          {!hasShot && work.window === "terminal" && (
            <div className="wb-term">
              <p><span className="wb-prompt">$</span> sentinel --scan --live</p>
              <p className="wb-dim">initializing model · 12.4M params</p>
              <p className="wb-ok">✓ threat model loaded</p>
              <p><span className="wb-accent">▍</span> inference 8.2ms · confidence 96.4%</p>
              <div className="wb-bars">
                {[70, 90, 45, 80, 60, 95, 55].map((h, i) => (
                  <span key={i} style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          )}
          {!hasShot && work.window === "browser" && (
            <div className="wb-browser">
              <div className="wb-nav">
                <span className="wb-pill" />
                <span className="wb-pill wide" />
                <span className="wb-cart" />
              </div>
              <div className="wb-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="wb-card">
                    <span className="wb-thumb" />
                    <span className="wb-line" />
                    <span className="wb-line short" />
                  </div>
                ))}
              </div>
            </div>
          )}
          {!hasShot && work.window === "mobile" && (
            <div className="wb-mobile">
              <div className="wb-phone">
                <span className="wb-notch" />
                <span className="wb-status-row">
                  {Array.from({ length: 4 }).map((_, i) => <span key={i} className="wb-app" />)}
                </span>
                <span className="wb-status-row">
                  {Array.from({ length: 4 }).map((_, i) => <span key={i} className="wb-app" />)}
                </span>
                <span className="wb-dock" />
              </div>
              <div className="wb-specs">
                <span className="wb-spec" />
                <span className="wb-spec short" />
                <span className="wb-spec" />
                <span className="wb-spec short" />
              </div>
            </div>
          )}
          {!hasShot && work.window === "dashboard" && (
            <div className="wb-dash">
              <div className="wb-metric-row">
                <span className="wb-metric" />
                <span className="wb-metric" />
                <span className="wb-metric" />
              </div>
              <div className="wb-chart">
                <svg viewBox="0 0 200 70" preserveAspectRatio="none">
                  <polyline
                    points="0,55 25,40 50,48 75,25 100,32 125,15 150,22 175,10 200,18"
                    fill="none" stroke="var(--wa)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
                  />
                  <polyline
                    points="0,55 25,40 50,48 75,25 100,32 125,15 150,22 175,10 200,18"
                    fill="none" stroke="var(--wa)" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round"
                    opacity="0.12"
                  />
                </svg>
              </div>
              <div className="wb-logs">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} className="wb-log"><i /></span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WorksPage() {
  const { t } = useLang();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div className="works-root" ref={rootRef}>
      <style>{`
        .works-root {
          --bg:#0c0b0f; --surface:#111015; --surface2:#18171e;
          --border:rgba(255,255,255,0.06); --border2:rgba(255,255,255,0.12);
          --text:#f4f2ed; --muted:#6a6862; --green:#22c55e;
          --accent:#ef4444; --accent2:#ff7043; --accent3:#ffd166;
          --ghost:rgba(255,255,255,0.03);
          --ease-out:cubic-bezier(0.16,1,0.3,1);
          --font-display:var(--font-outfit,'Outfit'),sans-serif;
          --font-mono:var(--font-jetbrains,'JetBrains Mono'),monospace;
          --font-logo:var(--font-logo,'Sora'),sans-serif;
          --font-accent:var(--font-serif,'DM Serif Display'),serif;
        }
        [data-theme="light"] .works-root {
          --bg:#f6f3ec; --surface:#faf8f2; --surface2:#ece7db;
          --border:rgba(0,0,0,0.07); --border2:rgba(0,0,0,0.14);
          --text:#111010; --muted:#7a7570; --green:#14532d;
          --accent:#d92b1f; --accent2:#e8571a; --accent3:#c08b20;
          --ghost:rgba(0,0,0,0.03);
        }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        .works-root{
          min-height:100vh; background:var(--bg); color:var(--text);
          font-family:var(--font-display); -webkit-font-smoothing:antialiased;
          overflow-x:hidden; transition:background .3s,color .3s; position:relative;
        }

        /* BG — single soft glow, no grid overlay */
        .w-bg-glow{position:fixed;inset:0;z-index:0;pointer-events:none;
          background:
            radial-gradient(ellipse 55% 45% at 15% 15%,rgba(239,68,68,0.06),transparent 70%),
            radial-gradient(ellipse 50% 55% at 85% 60%,rgba(168,85,247,0.04),transparent 70%);}

        /* SCROLL PROGRESS */
        .w-scroll-bar{position:fixed;top:0;left:0;right:0;height:2px;z-index:200;transform-origin:left;
          background:var(--accent);pointer-events:none;}

        /* NAV — removed, uses global navbar now */
        .w-nav{display:none;}

        /* CONTENT */
        .w-content{position:relative;z-index:2;max-width:1160px;margin:0 auto;padding:0 48px;}

        /* HERO */
        .w-hero{padding:140px 0 60px;}
        .w-eyebrow{font-family:var(--font-mono);font-size:.64rem;color:var(--accent);
          letter-spacing:.22em;text-transform:uppercase;margin-bottom:24px;display:flex;align-items:center;gap:12px;}
        .w-eyebrow::before{content:'';width:32px;height:1px;background:var(--accent);}
        .w-headline{font-size:clamp(2.8rem,8vw,6rem);font-weight:800;letter-spacing:-.045em;line-height:.92;margin-bottom:28px;}
        .w-headline em{font-family:var(--font-accent);font-style:italic;font-weight:400;color:var(--accent);}
        .w-headline em::after{display:none;}
        .w-subhead{font-size:1.1rem;color:var(--muted);line-height:1.7;max-width:560px;margin-bottom:48px;}

        /* STATS */
        .w-stats{display:flex;justify-content:space-between;flex-wrap:wrap;gap:16px;
          padding:32px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);}
        .w-stat{display:flex;flex-direction:column;gap:4px;}
        .w-stat-k{font-size:clamp(1.4rem,3vw,2rem);font-weight:800;letter-spacing:-.03em;line-height:1;color:var(--text);}
        .w-stat-v{font-family:var(--font-mono);font-size:.56rem;color:var(--muted);letter-spacing:.1em;text-transform:uppercase;}

        /* SECTION HEAD */
        .w-sec-head{margin:80px 0 16px;display:flex;align-items:flex-end;justify-content:space-between;gap:20px;}
        .w-sec-label{font-family:var(--font-mono);font-size:.62rem;color:var(--muted);letter-spacing:.2em;
          text-transform:uppercase;display:flex;align-items:center;gap:10px;}
        .w-sec-label::before{content:'';width:24px;height:1px;background:var(--muted);}
        .w-sec-count{font-family:var(--font-mono);font-size:.62rem;color:var(--muted);letter-spacing:.1em;}

        /* PROJECT SHOWCASE */
        .w-projects{display:flex;flex-direction:column;gap:24px;margin-top:36px;}
        .w-project{
          --pa:var(--accent);
          display:grid;grid-template-columns:1fr 1fr;gap:0;
          border:1px solid var(--border);border-radius:16px;overflow:hidden;background:var(--surface);
          transition:border-color .4s var(--ease-out),transform .4s var(--ease-out);position:relative;
        }
        .w-project:hover{border-color:var(--border2);transform:translateY(-3px);}
        .w-project.rev .w-visual{order:2;}
        .w-project.rev .w-info{order:1;}

        /* INFO SIDE */
        .w-info{padding:44px 44px 40px;display:flex;flex-direction:column;justify-content:center;position:relative;}
        .w-info-top{display:flex;align-items:center;gap:12px;margin-bottom:20px;}
        .w-num{font-family:var(--font-accent);font-size:1.1rem;font-style:italic;color:var(--pa);letter-spacing:.04em;}
        .w-cat{font-family:var(--font-mono);font-size:.56rem;color:var(--muted);letter-spacing:.14em;text-transform:uppercase;
          border:1px solid var(--border2);padding:4px 10px;border-radius:6px;}
        .w-year{font-family:var(--font-mono);font-size:.58rem;color:var(--muted);margin-left:auto;letter-spacing:.08em;}
        .w-ptitle{font-size:clamp(1.6rem,3.2vw,2.4rem);font-weight:700;letter-spacing:-.035em;line-height:1.05;margin-bottom:16px;}
        .w-pdesc{font-size:.94rem;color:var(--muted);line-height:1.75;margin-bottom:24px;max-width:440px;}
        .w-pmetrics{display:flex;gap:24px;margin-bottom:24px;flex-wrap:wrap;}
        .w-pmetric-k{font-size:1.1rem;font-weight:800;letter-spacing:-.02em;color:var(--text);line-height:1;}
        .w-pmetric-v{font-family:var(--font-mono);font-size:.52rem;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;margin-top:5px;}
        .w-ptags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:28px;}
        .w-ptag{font-family:var(--font-mono);font-size:.54rem;color:var(--muted);border:1px solid var(--border);
          background:var(--ghost);padding:4px 9px;border-radius:5px;letter-spacing:.04em;}
        .w-pfoot{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:auto;}
        .w-plink{display:inline-flex;align-items:center;gap:8px;font-weight:700;font-size:.88rem;color:var(--text);
          text-decoration:none;transition:gap .25s var(--ease-out),color .25s;}
        .w-plink .arw{display:inline-flex;width:28px;height:28px;align-items:center;justify-content:center;
          border-radius:50%;background:var(--pa);color:#fff;font-size:.82rem;transition:transform .25s var(--ease-out);}
        .w-project:hover .w-plink .arw{transform:translateX(3px);}
        .w-plink.disabled{color:var(--muted);cursor:default;pointer-events:none;}
        .w-plink.disabled .arw{background:var(--border2);color:var(--muted);}
        .w-status{font-family:var(--font-mono);font-size:.54rem;font-weight:600;letter-spacing:.1em;
          text-transform:uppercase;padding:5px 11px;border-radius:999px;display:inline-flex;align-items:center;gap:6px;}
        .w-status::before{content:'';width:5px;height:5px;border-radius:50%;background:currentColor;}
        .w-status.live{color:var(--green);background:rgba(34,197,94,.08);}
        .w-status.private{color:var(--muted);background:var(--ghost);}

        /* VISUAL SIDE */
        .w-visual{position:relative;min-height:380px;display:flex;align-items:center;justify-content:center;
          padding:40px;overflow:hidden;background:
            radial-gradient(ellipse 90% 80% at 50% 20%,color-mix(in srgb,var(--wa) 10%,transparent),transparent 70%),
            linear-gradient(160deg,var(--surface2),var(--surface));
          border-left:1px solid var(--border);}
        .w-project.rev .w-visual{border-left:none;border-right:1px solid var(--border);}
        .w-visual-glow{position:absolute;width:240px;height:240px;border-radius:50%;filter:blur(70px);
          opacity:.2;background:var(--wa);top:-40px;right:-40px;pointer-events:none;}
        .w-window{width:100%;max-width:340px;border:1px solid var(--border2);border-radius:12px;overflow:hidden;
          background:var(--bg);box-shadow:0 24px 48px rgba(0,0,0,.35);position:relative;z-index:1;}
        .w-window-bar{height:32px;display:flex;align-items:center;gap:6px;padding:0 12px;
          border-bottom:1px solid var(--border);background:var(--surface);}
        .w-dot{width:9px;height:9px;border-radius:50%;}
        .w-window-label{font-family:var(--font-mono);font-size:.52rem;color:var(--muted);margin-left:8px;letter-spacing:.04em;}
        .w-window-body{padding:16px;height:240px;overflow:hidden;position:relative;}

        /* live screenshot — full-bleed, fades in once the image has loaded */
        .w-shot{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top center;
          display:block;transition:opacity .5s var(--ease-out);z-index:1;}
        /* shimmer placeholder shown behind the shot while it loads */
        .w-window-body::after{content:'';position:absolute;inset:0;pointer-events:none;
          background:linear-gradient(110deg,var(--surface2) 30%,var(--surface) 50%,var(--surface2) 70%);
          background-size:200% 100%;animation:shotShimmer 1.4s var(--ease-out) infinite;}
        .w-window-body:has(.w-shot)::after{z-index:0;}
        .w-window-body:not(:has(.w-shot))::after{display:none;}
        @keyframes shotShimmer{from{background-position:200% 0;}to{background-position:-200% 0;}}

        /* terminal */
        .wb-term{font-family:var(--font-mono);font-size:.64rem;line-height:1.9;color:var(--muted);}
        .wb-prompt{color:var(--wa);margin-right:6px;}
        .wb-dim{opacity:.6;}
        .wb-ok{color:var(--green);}
        .wb-accent{color:var(--wa);}
        .wb-bars{display:flex;align-items:flex-end;gap:5px;height:55px;margin-top:12px;}
        .wb-bars span{flex:1;background:linear-gradient(to top,var(--wa),var(--wa2));border-radius:3px 3px 0 0;opacity:.7;}

        /* browser */
        .wb-browser{display:flex;flex-direction:column;gap:10px;height:100%;}
        .wb-nav{display:flex;align-items:center;gap:7px;}
        .wb-pill{width:36px;height:9px;border-radius:999px;background:var(--border2);}
        .wb-pill.wide{flex:1;}
        .wb-cart{width:9px;height:9px;border-radius:3px;background:var(--wa);}
        .wb-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
        .wb-card{display:flex;flex-direction:column;gap:5px;}
        .wb-thumb{height:40px;border-radius:5px;background:linear-gradient(135deg,color-mix(in srgb,var(--wa) 25%,var(--surface2)),var(--surface2));}
        .wb-line{height:5px;border-radius:3px;background:var(--border2);}
        .wb-line.short{width:55%;}

        /* mobile */
        .wb-mobile{display:flex;gap:14px;height:100%;align-items:center;}
        .wb-phone{width:90px;height:190px;border:2px solid var(--border2);border-radius:16px;padding:12px 8px 8px;
          display:flex;flex-direction:column;gap:8px;position:relative;background:var(--surface);}
        .wb-notch{position:absolute;top:5px;left:50%;transform:translateX(-50%);width:30px;height:4px;border-radius:999px;background:var(--border2);}
        .wb-status-row{display:flex;gap:7px;margin-top:3px;}
        .wb-app{width:14px;height:14px;border-radius:4px;background:linear-gradient(135deg,var(--wa),var(--wa2));opacity:.8;}
        .wb-status-row:nth-child(3) .wb-app{opacity:.45;}
        .wb-dock{margin-top:auto;height:20px;border-radius:8px;background:var(--ghost);border:1px solid var(--border);}
        .wb-specs{flex:1;display:flex;flex-direction:column;gap:10px;justify-content:center;}
        .wb-spec{height:7px;border-radius:4px;background:var(--border2);}
        .wb-spec.short{width:50%;}

        /* dashboard */
        .wb-dash{display:flex;flex-direction:column;gap:12px;height:100%;}
        .wb-metric-row{display:flex;gap:8px;}
        .wb-metric{flex:1;height:36px;border-radius:6px;background:var(--ghost);border:1px solid var(--border);position:relative;overflow:hidden;}
        .wb-metric::after{content:'';position:absolute;left:8px;top:8px;width:40%;height:5px;border-radius:3px;background:var(--wa);opacity:.6;}
        .wb-chart{flex:1;border-radius:6px;background:var(--ghost);border:1px solid var(--border);padding:6px;min-height:70px;}
        .wb-chart svg{width:100%;height:100%;}
        .wb-logs{display:flex;flex-direction:column;gap:6px;}
        .wb-log{height:8px;border-radius:3px;background:var(--border2);display:flex;align-items:center;position:relative;}
        .wb-log i{position:absolute;left:0;top:0;bottom:0;width:5px;border-radius:3px;background:var(--wa);}

        /* CTA */
        .w-cta{margin:100px 0 36px;border:1px solid var(--border);border-radius:18px;
          background:var(--surface);padding:64px 48px;text-align:center;position:relative;overflow:hidden;}
        .w-cta::before{content:'';position:absolute;inset:0;pointer-events:none;
          background:radial-gradient(ellipse 60% 100% at 50% 0%,rgba(239,68,68,.08),transparent 70%);}
        .w-cta-title{font-size:clamp(1.6rem,3.5vw,2.6rem);font-weight:700;letter-spacing:-.04em;line-height:1.08;margin-bottom:16px;position:relative;}
        .w-cta-sub{color:var(--muted);font-size:.98rem;max-width:440px;margin:0 auto 28px;position:relative;}
        .w-cta-btn{display:inline-flex;align-items:center;gap:10px;position:relative;background:var(--accent);color:#fff;
          text-decoration:none;font-weight:700;font-size:.9rem;padding:14px 28px;border-radius:10px;
          transition:transform .25s var(--ease-out),box-shadow .25s;box-shadow:0 6px 24px rgba(239,68,68,.25);}
        .w-cta-btn:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(239,68,68,.35);}

        /* FOOTER */
        .w-footer{position:relative;z-index:2;border-top:1px solid var(--border);padding:28px 48px;max-width:1160px;margin:0 auto;
          display:flex;align-items:center;justify-content:space-between;gap:16px;}
        .w-footer-copy{font-family:var(--font-mono);font-size:.58rem;color:var(--muted);letter-spacing:.06em;}
        .w-footer-links{display:flex;gap:20px;}
        .w-footer-link{font-family:var(--font-mono);font-size:.58rem;color:var(--muted);text-decoration:none;
          letter-spacing:.06em;transition:color .2s;}
        .w-footer-link:hover{color:var(--text);}

        @keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.5;transform:scale(.85);}  }

        /* RESPONSIVE */
        @media(max-width:900px){
          .w-content{padding:0 20px;}
          .w-footer{padding:24px 20px;flex-direction:column;align-items:flex-start;}
          .w-stats{flex-wrap:wrap;}
          .w-project,.w-project.rev{grid-template-columns:1fr;}
          .w-project.rev .w-visual{order:0;border-right:none;border-bottom:1px solid var(--border);}
          .w-project.rev .w-info{order:1;}
          .w-visual{border-left:none;border-bottom:1px solid var(--border);min-height:300px;}
          .w-info{padding:32px 24px;}
          .w-cta{padding:48px 24px;}
        }
        @media(max-width:480px){
          .w-stats{gap:20px;}
          .w-pmetrics{gap:16px;}
        }
        ::selection{background:var(--accent);color:#fff;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:var(--bg);}
        ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px;}
      `}</style>

      <div className="w-bg-glow" />
      <motion.div className="w-scroll-bar" style={{ scaleX: progress }} />

      <div className="w-content">
        {/* HERO */}
        <section className="w-hero">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", damping: 24, stiffness: 120 }}>
            <div className="w-eyebrow">{t("Selected Work")}</div>
            <h1 className="w-headline">{t("Work we're")}<br /><em>{t("proud of")}</em></h1>
            <p className="w-subhead">
              {t("A selection of projects spanning high-performance web applications, custom Android platforms, and production-grade AI systems — each engineered to a standard we stand behind.")}
            </p>
          </motion.div>
          <motion.div className="w-stats" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", damping: 26, stiffness: 130, delay: 0.15 }}>
            {stats.map((s) => (
              <div className="w-stat" key={s.v}>
                <div className="w-stat-k">{s.k}</div>
                <div className="w-stat-v">{t(s.v)}</div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* SECTION HEAD */}
        <div className="w-sec-head">
          <div className="w-sec-label">{t("The Portfolio")}</div>
          <div className="w-sec-count">{works.length} {t("Projects")}</div>
        </div>

        {/* PROJECTS */}
        <div className="w-projects">
          {works.map((w, i) => {
            const isLive = w.status === "Live";
            return (
              <motion.article
                key={w.num}
                className={`w-project${i % 2 === 1 ? " rev" : ""}`}
                style={{ ["--pa" as string]: w.accent }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ type: "spring", damping: 26, stiffness: 120 }}
              >
                <WindowVisual work={w} />
                <div className="w-info">
                  <div className="w-info-top">
                    <span className="w-num">{w.num}</span>
                    <span className="w-cat">{t(w.category)}</span>
                    <span className="w-year">{w.year}</span>
                  </div>
                  <h2 className="w-ptitle">{w.title}</h2>
                  <p className="w-pdesc">{t(w.desc)}</p>
                  <div className="w-pmetrics">
                    {w.metrics.map((m) => (
                      <div key={m.v}>
                        <div className="w-pmetric-k" style={{ color: w.accent }}>{m.k}</div>
                        <div className="w-pmetric-v">{t(m.v)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="w-ptags">
                    {w.tags.map((tag) => <span key={tag} className="w-ptag">{tag}</span>)}
                  </div>
                  <div className="w-pfoot">
                    {isLive ? (
                      <a href={w.link} target="_blank" rel="noopener noreferrer" className="w-plink">
                        {t("Visit Project")} <span className="arw">→</span>
                      </a>
                    ) : (
                      <span className="w-plink disabled">{t("Confidential")} <span className="arw">•</span></span>
                    )}
                    <span className={`w-status ${w.status.toLowerCase()}`}>{t(w.status)}</span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div className="w-cta" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", damping: 24, stiffness: 130 }}>
          <h2 className="w-cta-title">{t("Have something")}<br />{t("worth building?")}</h2>
          <p className="w-cta-sub">{t("We partner with teams to design and ship software that performs in production.")}</p>
          <a href="/#contact" className="w-cta-btn">{t("Start a Project →")}</a>
        </motion.div>
      </div>

      {/* FOOTER */}
      <footer className="w-footer">
        <span className="w-footer-copy">© {new Date().getFullYear()} {t("Mega Devs. All rights reserved.")}</span>
        <div className="w-footer-links">
          <a href="/" className="w-footer-link">{t("Home")}</a>
          <a href="/history" className="w-footer-link">{t("Our Story")}</a>
          <a href="/#contact" className="w-footer-link">{t("Contact")}</a>
        </div>
      </footer>
    </div>
  );
}
