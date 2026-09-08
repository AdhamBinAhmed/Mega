"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useLang } from "../lib/i18n";

const values = [
  {
    index: "01",
    title: "Humanity",
    body: "Every life carries dignity. We build with empathy and stand with those who endure hardship.",
    color: "var(--red)",
  },
  {
    index: "02",
    title: "Justice",
    body: "We believe in equity and truth — that freedom and human rights belong to every single person.",
    color: "var(--ink)",
  },
  {
    index: "03",
    title: "Hope",
    body: "Through resilience, community, and creation, a future rooted in peace remains within reach.",
    color: "var(--pgreen)",
  },
];

export default function PalestinePage() {
  const { t } = useLang();
  const rootRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <div className="pal-root" ref={rootRef}>
      <style>{`
        .pal-root {
          --paper:#0a0a0b; --ink:#f4f2ec; --ink-soft:#a8a49b; --ink-mute:#6a6862;
          --rule:rgba(244,242,236,0.14); --rule-2:rgba(244,242,236,0.28);
          --panel:#0f0f11; --panel-2:#16161a;
          --red:#e2263c; --pgreen:#22a866; --glow:rgba(226,38,60,0.12); --shadow:rgba(0,0,0,0.5);
          --nav-bg:rgba(10,10,11,0.72);
        }
        [data-theme="light"] .pal-root {
          --paper:#f4f1e9; --ink:#111010; --ink-soft:#57534b; --ink-mute:#8a857b;
          --rule:rgba(17,16,16,0.16); --rule-2:rgba(17,16,16,0.34);
          --panel:#fbf9f3; --panel-2:#ece7db;
          --red:#c8121f; --pgreen:#00622f; --glow:rgba(200,18,31,0.08); --shadow:rgba(0,0,0,0.12);
          --nav-bg:rgba(244,241,233,0.82);
        }
        .pal-root {
          --font-ed:var(--font-space-grotesk,'Space Grotesk'),sans-serif;
          --font-display:var(--font-outfit,'Outfit'),sans-serif;
          --font-mono:var(--font-jetbrains,'JetBrains Mono'),monospace;
          --ease:cubic-bezier(0.22,1,0.36,1);
          --gutter:48px; --maxw:1180px;
        }
        .pal-root *,.pal-root *::before,.pal-root *::after{box-sizing:border-box;margin:0;padding:0;}
        .pal-root{min-height:100vh;background:var(--paper);color:var(--ink);
          font-family:var(--font-display);-webkit-font-smoothing:antialiased;overflow-x:hidden;position:relative;}
        .pal-root ::selection{background:var(--red);color:#fff;}

        /* PRIMITIVES */
        .pal-kicker{font-family:var(--font-mono);font-size:.62rem;font-weight:600;letter-spacing:.28em;text-transform:uppercase;color:var(--red);}
        .pal-meta{font-family:var(--font-mono);font-size:.62rem;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-mute);}
        .pal-rule{height:1px;background:var(--rule);width:100%;}
        .pal-wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--gutter);}

        /* BG */
        .pal-lines{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.45;
          background-image:linear-gradient(90deg,var(--rule) 1px,transparent 1px),linear-gradient(180deg,var(--rule) 1px,transparent 1px);
          background-size:calc((100vw - 2*var(--gutter))/6) 100%,100% 132px;background-position:var(--gutter) 0,0 0;
          -webkit-mask-image:radial-gradient(ellipse 90% 80% at 50% 30%,#000 40%,transparent 100%);
          mask-image:radial-gradient(ellipse 90% 80% at 50% 30%,#000 40%,transparent 100%);}
        .pal-glow{position:fixed;inset:-35%;z-index:0;pointer-events:none;will-change:transform;
          background:
            radial-gradient(ellipse 42% 40% at 82% 8%,var(--glow),transparent 62%),
            radial-gradient(ellipse 40% 44% at 6% 92%,rgba(34,168,102,0.10),transparent 58%);
          animation:pal-aurora 30s ease-in-out infinite alternate;}
        @keyframes pal-aurora{0%{transform:translate3d(-2%,-1.5%,0) rotate(0deg) scale(1);}100%{transform:translate3d(3.5%,2.5%,0) rotate(8deg) scale(1.05);}}
        .pal-vignette{position:fixed;inset:0;z-index:0;pointer-events:none;
          background:radial-gradient(ellipse 120% 100% at 50% 38%,transparent 52%,rgba(0,0,0,0.42) 100%);}
        [data-theme="light"] .pal-root .pal-vignette{background:radial-gradient(ellipse 130% 100% at 50% 40%,transparent 58%,rgba(60,40,20,0.07) 100%);}
        @media(hover:none) and (pointer:coarse){.pal-lines,.pal-glow,.pal-vignette{display:none;}}

        .pal-scroll-bar{position:fixed;top:0;left:0;right:0;height:2px;z-index:200;transform-origin:left;
          background:linear-gradient(90deg,var(--red) 0 40%,var(--ink) 40% 60%,var(--pgreen) 60% 100%);pointer-events:none;}

        /* MASTHEAD */
        .pal-masthead{position:fixed;top:0;left:0;right:0;z-index:100;background:var(--nav-bg);
          backdrop-filter:blur(14px) saturate(150%);-webkit-backdrop-filter:blur(14px) saturate(150%);border-bottom:1px solid var(--rule);}
        .pal-masthead-inner{max-width:var(--maxw);margin:0 auto;padding:0 var(--gutter);height:66px;display:flex;align-items:center;justify-content:space-between;}
        .pal-logo{display:flex;align-items:center;gap:10px;text-decoration:none;}
        .pal-logo-img{height:34px;width:auto;display:block;}
        .pal-logo-img-light{display:none;} .pal-logo-img-dark{display:block;}
        [data-theme="light"] .pal-root .pal-logo-img-light{display:block;}
        [data-theme="light"] .pal-root .pal-logo-img-dark{display:none;}
        .pal-logo-dot{width:6px;height:6px;border-radius:50%;background:var(--red);animation:pal-blink 2s ease-in-out infinite;}
        @keyframes pal-blink{0%,100%{opacity:1;}50%{opacity:.25;}}
        .pal-nav-mid{font-family:var(--font-mono);font-size:.6rem;color:var(--ink-mute);letter-spacing:.22em;text-transform:uppercase;display:flex;align-items:center;gap:9px;}
        .pal-nav-mid::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--red);box-shadow:0 0 8px var(--red);animation:pal-pulse 2s ease-in-out infinite;}
        .pal-nav-right{display:flex;align-items:center;gap:8px;}
        .pal-btn{height:34px;min-width:34px;padding:0 12px;display:inline-flex;align-items:center;gap:6px;justify-content:center;
          background:transparent;border:1px solid var(--rule-2);color:var(--ink-soft);font-family:var(--font-mono);font-size:.62rem;
          letter-spacing:.12em;text-transform:uppercase;text-decoration:none;transition:all .2s;cursor:pointer;-webkit-tap-highlight-color:transparent;}
        .pal-btn:hover{border-color:var(--red);color:var(--red);}

        /* STRAP */
        .pal-strap{position:fixed;top:66px;left:0;right:0;z-index:99;background:var(--red);color:#fff;overflow:hidden;border-bottom:1px solid rgba(0,0,0,0.15);}
        .pal-strap-track{display:flex;align-items:center;gap:40px;width:max-content;padding:6px 0;animation:pal-strap 38s linear infinite;}
        .pal-strap-item{font-family:var(--font-mono);font-size:.6rem;letter-spacing:.24em;text-transform:uppercase;white-space:nowrap;display:flex;align-items:center;gap:40px;}
        .pal-strap-item::after{content:'✦';opacity:.7;}
        @keyframes pal-strap{from{transform:translateX(0);}to{transform:translateX(-50%);}}
        @media(max-width:560px){.pal-strap{display:none;}}

        /* CONTENT */
        .pal-content{position:relative;z-index:2;}

        /* HERO */
        .pal-hero{position:relative;z-index:2;padding:150px var(--gutter) 0;max-width:var(--maxw);margin:0 auto;}
        .pal-hero-top{display:flex;justify-content:space-between;align-items:flex-end;padding-bottom:20px;border-bottom:1px solid var(--rule);flex-wrap:wrap;gap:12px;}
        .pal-hero-issue{display:flex;gap:26px;align-items:baseline;flex-wrap:wrap;}
        .pal-hero-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:56px;align-items:center;margin-top:48px;}
        .pal-headline{font-family:var(--font-ed);font-weight:700;font-size:clamp(3rem,9vw,8rem);line-height:.86;letter-spacing:-.055em;text-transform:uppercase;}
        .pal-headline span{display:block;}
        .pal-headline .accent{color:var(--red);font-style:italic;font-weight:500;}
        .pal-headline .outline{color:transparent;-webkit-text-stroke:1.5px var(--pgreen);}
        .pal-manifesto{font-size:clamp(1rem,1.4vw,1.2rem);color:var(--ink-soft);line-height:1.7;max-width:46ch;margin-top:34px;padding-top:26px;border-top:1px solid var(--rule);}
        .pal-manifesto strong{color:var(--ink);font-weight:600;}

        /* FLAG */
        .pal-flag-wrap{perspective:1100px;}
        .pal-flag{position:relative;width:100%;max-width:440px;aspect-ratio:5/3;overflow:hidden;margin-left:auto;
          border:1px solid var(--rule-2);box-shadow:0 40px 90px var(--shadow);transform-style:preserve-3d;}
        .pal-flag-stripes{position:absolute;inset:0;display:flex;flex-direction:column;}
        .pal-flag-stripes>span{flex:1;}
        .pal-flag-caption{position:absolute;bottom:0;left:0;right:0;z-index:3;display:flex;justify-content:space-between;
          padding:8px 12px;font-family:var(--font-mono);font-size:.52rem;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.85);
          background:linear-gradient(0deg,rgba(0,0,0,.5),transparent);}
        .pal-shine{position:absolute;inset:0;pointer-events:none;background:linear-gradient(135deg,rgba(255,255,255,.16),transparent 45%,transparent 60%,rgba(255,255,255,.05));}
        .pal-sweep{position:absolute;inset:0;width:34%;transform:skewX(-20deg);pointer-events:none;background:linear-gradient(90deg,transparent,rgba(255,255,255,.26),transparent);}

        /* SECTION SHELL */
        .pal-section{position:relative;z-index:2;padding:120px 0;}
        .pal-section.alt{background:var(--panel);border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);}
        .pal-sec-head{display:grid;grid-template-columns:auto 1fr;gap:28px;align-items:end;padding-bottom:36px;margin-bottom:56px;border-bottom:1px solid var(--rule-2);}
        .pal-sec-index{font-family:var(--font-ed);font-weight:700;font-size:clamp(2.4rem,5vw,4.4rem);line-height:.8;letter-spacing:-.05em;color:var(--red);}
        .pal-sec-head-r{display:flex;flex-direction:column;gap:14px;}
        .pal-sec-head-top{display:flex;align-items:center;gap:16px;}
        .pal-sec-head-top .pal-rule{flex:1;}
        .pal-sec-title{font-family:var(--font-ed);font-weight:600;font-size:clamp(1.8rem,4vw,3.4rem);line-height:.98;letter-spacing:-.04em;text-transform:uppercase;color:var(--ink);}
        .pal-sec-title em{font-style:italic;font-weight:400;color:var(--red);}

        /* VALUES */
        .pal-values{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--rule);border-left:1px solid var(--rule);}
        .pal-card{position:relative;overflow:hidden;border-right:1px solid var(--rule);border-bottom:1px solid var(--rule);
          padding:44px 38px;transition:background .3s var(--ease);}
        .pal-card:hover{background:var(--panel-2);}
        .pal-card-idx{font-family:var(--font-ed);font-weight:700;font-size:5rem;line-height:.8;letter-spacing:-.05em;
          color:transparent;-webkit-text-stroke:1.2px var(--rule-2);margin-bottom:26px;transition:all .3s;}
        .pal-card:hover .pal-card-idx{-webkit-text-stroke-color:var(--card-color);}
        .pal-card-bar{width:38px;height:3px;background:var(--card-color);margin-bottom:22px;}
        .pal-card-title{font-family:var(--font-ed);font-weight:600;font-size:1.5rem;letter-spacing:-.03em;text-transform:uppercase;color:var(--ink);margin-bottom:14px;}
        .pal-card-body{font-size:.92rem;color:var(--ink-soft);line-height:1.7;}

        /* QUOTE STRIP */
        .pal-quote{position:relative;z-index:2;padding:96px var(--gutter);max-width:var(--maxw);margin:0 auto;text-align:center;}
        .pal-quote-text{font-family:var(--font-ed);font-weight:500;font-size:clamp(1.4rem,3.4vw,2.6rem);line-height:1.25;letter-spacing:-.02em;color:var(--ink);max-width:20ch;margin:0 auto 24px;}
        .pal-quote-text b{color:var(--red);font-weight:600;}
        .pal-quote-by{font-family:var(--font-mono);font-size:.62rem;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-mute);}

        /* CTA */
        .pal-cta-flagline{height:4px;background:linear-gradient(90deg,var(--red) 0 40%,var(--ink) 40% 60%,var(--pgreen) 60% 100%);}
        .pal-cta{display:grid;grid-template-columns:1fr auto;gap:48px;align-items:center;}
        .pal-cta-title{font-family:var(--font-ed);font-weight:600;font-size:clamp(2rem,5vw,4rem);line-height:.98;letter-spacing:-.04em;text-transform:uppercase;color:var(--ink);}
        .pal-cta-sub{color:var(--ink-soft);font-size:1.05rem;line-height:1.6;max-width:40ch;margin-top:20px;}
        .pal-hashtag{display:inline-flex;align-items:center;gap:12px;padding:22px 40px;text-decoration:none;position:relative;overflow:hidden;
          border:1px solid var(--rule-2);background:var(--panel);font-family:var(--font-ed);font-weight:700;font-size:clamp(1rem,2vw,1.5rem);
          letter-spacing:.06em;text-transform:uppercase;color:var(--ink);white-space:nowrap;transition:all .25s var(--ease);}
        .pal-hashtag:hover{border-color:var(--red);color:var(--red);transform:translateY(-3px);}
        .pal-hashtag-sweep{position:absolute;inset:0;transform:translateX(-100%);pointer-events:none;background:linear-gradient(90deg,transparent,rgba(226,38,60,.12),transparent);transition:transform .9s;}
        .pal-hashtag:hover .pal-hashtag-sweep{transform:translateX(100%);}

        /* MARQUEE DIVIDER */
        .pal-mq{position:relative;z-index:2;overflow:hidden;padding:30px 0;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);
          -webkit-mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent);mask-image:linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent);}
        .pal-mq-track{display:flex;width:max-content;animation:pal-strap 30s linear infinite;}
        .pal-mq:hover .pal-mq-track{animation-play-state:paused;}
        .pal-mq-item{display:flex;align-items:center;gap:44px;white-space:nowrap;padding-right:44px;font-family:var(--font-ed);font-weight:700;
          font-size:clamp(2.2rem,7vw,5rem);line-height:1;letter-spacing:-.045em;text-transform:uppercase;color:transparent;
          -webkit-text-stroke:1.2px var(--rule-2);transition:all .4s var(--ease);}
        .pal-mq-item b{color:var(--red);-webkit-text-stroke:0;font-size:.5em;}
        .pal-mq:hover .pal-mq-item{color:var(--ink);-webkit-text-stroke:0;}

        /* COLOPHON */
        .pal-colophon{position:relative;z-index:2;border-top:1px solid var(--rule);padding:48px var(--gutter);max-width:var(--maxw);margin:0 auto;}
        .pal-colophon-top{display:flex;justify-content:space-between;align-items:flex-start;gap:32px;flex-wrap:wrap;padding-bottom:32px;border-bottom:1px solid var(--rule);}
        .pal-colophon-word{font-family:var(--font-ed);font-weight:700;font-size:clamp(2.2rem,7vw,5rem);line-height:.85;letter-spacing:-.05em;text-transform:uppercase;color:var(--ink);}
        .pal-colophon-word b{color:var(--red);}
        .pal-colophon-cols{display:flex;gap:48px;flex-wrap:wrap;}
        .pal-colophon-col{display:flex;flex-direction:column;gap:10px;}
        .pal-colophon-col h4{font-family:var(--font-mono);font-size:.58rem;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-mute);margin-bottom:4px;}
        .pal-colophon-col a{font-family:var(--font-mono);font-size:.72rem;color:var(--ink-soft);text-decoration:none;transition:color .2s;}
        .pal-colophon-col a:hover{color:var(--red);}
        .pal-colophon-bottom{display:flex;justify-content:space-between;align-items:center;gap:16px;padding-top:28px;flex-wrap:wrap;}
        .pal-colophon-copy{font-family:var(--font-mono);font-size:.6rem;letter-spacing:.08em;color:var(--ink-mute);text-transform:uppercase;}

        @keyframes pal-pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.5;transform:scale(.85);}}

        @media(max-width:900px){
          .pal-root{--gutter:24px;}
          .pal-hero-grid{grid-template-columns:1fr;gap:36px;}
          .pal-flag{margin:0 auto;}
          .pal-values{grid-template-columns:1fr;}
          .pal-cta{grid-template-columns:1fr;gap:32px;}
          .pal-nav-mid{display:none;}
        }
        @media(max-width:560px){
          .pal-root{--gutter:18px;}
          .pal-hero{padding-top:120px;}
          .pal-headline{font-size:clamp(2.8rem,15vw,4.5rem);}
          .pal-section{padding:80px 0;}
          .pal-btn .pal-btn-label{display:none;}
        }
        @media(hover:none) and (pointer:coarse){
          .pal-masthead{backdrop-filter:none;-webkit-backdrop-filter:none;background:var(--paper);}
        }
        @media(prefers-reduced-motion:reduce){.pal-root *,.pal-root *::before,.pal-root *::after{animation-duration:.01ms !important;transition-duration:.01ms !important;}}
        .pal-root ::-webkit-scrollbar{width:5px;}
        .pal-root ::-webkit-scrollbar-track{background:var(--paper);}
        .pal-root ::-webkit-scrollbar-thumb{background:var(--rule-2);}
      `}</style>

      <div className="pal-lines" />
      <div className="pal-glow" />
      <div className="pal-vignette" />
      <motion.div className="pal-scroll-bar" style={{ scaleX: progress }} />

      {/* STRAP */}
      <div className="pal-strap">
        <div className="pal-strap-track">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="pal-strap-item">
              {t("Free Palestine")}<span> </span>{t("Stand for Humanity")}<span> </span>{t("Justice · Dignity · Hope")}<span> </span>{t("Technology in Service of People")}<span> </span>{t("We Will Not Look Away")}
            </span>
          ))}
        </div>
      </div>

      <div className="pal-content">
        {/* HERO */}
        <section className="pal-hero">
          <div className="pal-hero-top">
            <div className="pal-hero-issue">
              <span className="pal-kicker">{t("Free Palestine")}</span>
              <span className="pal-meta">{t("In Solidarity")}</span>
              <span className="pal-meta">{t("Cairo · Egypt")}</span>
            </div>
            <span className="pal-meta">{t("Est. Always")}</span>
          </div>

          <div className="pal-hero-grid">
            <div>
              <motion.h1 className="pal-headline"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
                <span>{t("Resilience")}</span>
                <span className="accent">&amp;</span>
                <span className="outline">{t("Solidarity")}</span>
              </motion.h1>
              <motion.p className="pal-manifesto"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}>
                {t("We stand with the people of Palestine. Beyond the code we write, we believe technology should serve ")}<strong>{t("humanity")}</strong>{t(" — that every voice deserves to be heard, every story remembered, and every future built on justice and peace.")}
              </motion.p>
            </div>

            {/* FLAG */}
            <motion.div className="pal-flag-wrap"
              initial={{ opacity: 0, y: 40, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}>
              <motion.div className="pal-flag"
                animate={{ rotateX: [0, 4, 0, -3, 0], rotateY: [0, -3, 0, 3, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}>
                <div className="pal-flag-stripes">
                  <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} style={{ originX: 0, background: "#000" }} />
                  <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }} style={{ originX: 0, background: "#fff" }} />
                  <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }} style={{ originX: 0, background: "#007A3D" }} />
                </div>
                <motion.div
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.1, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  style={{ position: "absolute", inset: 0, width: "40%", background: "#CE1126", clipPath: "polygon(0 0, 100% 50%, 0 100%)", transformOrigin: "left" }}
                />
                <div className="pal-shine" />
                <motion.div className="pal-sweep"
                  initial={{ x: "-140%" }} animate={{ x: "180%" }}
                  transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }} />
                <div className="pal-flag-caption"><span>{t("State of Palestine")}</span><span>فلسطين</span></div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* VALUES */}
        <section className="pal-section alt">
          <div className="pal-wrap">
            <div className="pal-sec-head">
              <div className="pal-sec-index">§01</div>
              <div className="pal-sec-head-r">
                <div className="pal-sec-head-top"><span className="pal-kicker">{t("What We Stand For")}</span><div className="pal-rule" /></div>
                <h2 className="pal-sec-title">{t("Three things we will never ")}<em>{t("compromise")}</em></h2>
              </div>
            </div>
            <div className="pal-values">
              {values.map((v, i) => (
                <motion.div key={v.title} className="pal-card" style={{ ["--card-color" as string]: v.color }}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ type: "spring", damping: 24, stiffness: 130, delay: i * 0.08 }}>
                  <div className="pal-card-idx">{v.index}</div>
                  <div className="pal-card-bar" />
                  <div className="pal-card-title">{t(v.title)}</div>
                  <p className="pal-card-body">{t(v.body)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* QUOTE */}
        <section className="pal-quote">
          <motion.p className="pal-quote-text"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            &ldquo;{t("To exist is to resist. We build so that every ")}<b>{t("story is remembered")}</b>.&rdquo;
          </motion.p>
          <span className="pal-quote-by">{t("— MEGA Devs · In Solidarity")}</span>
        </section>

        {/* CTA */}
        <section className="pal-section">
          <div className="pal-wrap">
            <div className="pal-sec-head">
              <div className="pal-sec-index">§02</div>
              <div className="pal-sec-head-r">
                <div className="pal-sec-head-top"><span className="pal-kicker">{t("Take Action")}</span><div className="pal-rule" /></div>
                <h2 className="pal-sec-title">{t("Raise your voice. Build with ")}<em>{t("purpose")}</em></h2>
              </div>
            </div>
            <div className="pal-cta-flagline" />
            <div className="pal-cta" style={{ marginTop: 40 }}>
              <div>
                <h3 className="pal-cta-title">{t("Every voice counts")}</h3>
                <p className="pal-cta-sub">{t("Join the movement and share your solidarity. Amplify the stories that must not be forgotten.")}</p>
              </div>
              <motion.a href="https://twitter.com/search?q=%23build_with_palestine" target="_blank" rel="noopener noreferrer"
                className="pal-hashtag" whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
                <span className="pal-hashtag-sweep" />
                #build_with_palestine
              </motion.a>
            </div>
          </div>
        </section>

        {/* MARQUEE DIVIDER */}
        <div className="pal-mq">
          <div className="pal-mq-track">
            {Array.from({ length: 2 }).map((_, k) => (
              <span key={k} className="pal-mq-item">{t("Free Palestine")} <b>✦</b> {t("Stand for Humanity")} <b>✦</b></span>
            ))}
          </div>
        </div>
      </div>

      {/* COLOPHON */}
      <footer className="pal-colophon">
        <div className="pal-colophon-top">
          <div className="pal-colophon-word">MEGA<b>·</b>DEVS</div>
          <div className="pal-colophon-cols">
            <div className="pal-colophon-col">
              <h4>{t("Navigate")}</h4>
              <a href="/">{t("Home")}</a>
              <a href="/works">{t("Works")}</a>
              <a href="/history">{t("Our Story")}</a>
            </div>
            <div className="pal-colophon-col">
              <h4>{t("Stand With")}</h4>
              <a href="https://twitter.com/search?q=%23build_with_palestine" target="_blank" rel="noopener noreferrer">#build_with_palestine</a>
              <a href="/">{t("Standing for humanity")}</a>
            </div>
          </div>
        </div>
        <div className="pal-colophon-bottom">
          <span className="pal-colophon-copy">© {new Date().getFullYear()} {t("MEGA Devs · Standing for humanity")}</span>
          <span className="pal-colophon-copy">{t("Justice · Dignity · Hope")}</span>
        </div>
      </footer>
    </div>
  );
}
