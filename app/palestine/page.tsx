"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const values = [
  {
    icon: "❤",
    title: "Humanity",
    body: "Every life carries dignity. We build with empathy and stand with those who endure hardship.",
    color: "#CE1126",
  },
  {
    icon: "⚖",
    title: "Justice",
    body: "We believe in equity and truth — that freedom and human rights belong to every single person.",
    color: "#e8e8ea",
  },
  {
    icon: "✷",
    title: "Hope",
    body: "Through resilience, community, and creation, a future rooted in peace remains within reach.",
    color: "#007A3D",
  },
];

export default function PalestinePage() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const rootRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

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

  const toggleTheme = () => setTheme(t => (t === "dark" ? "light" : "dark"));

  return (
    <div className="pal-root" data-theme={theme} ref={rootRef}>
      <style>{`
        .pal-root, .pal-root[data-theme="dark"] {
          --bg:#050507; --surface:#0d0d10; --surface2:#131318;
          --border:rgba(255,255,255,0.06); --border2:rgba(255,255,255,0.12);
          --text:#f0f0f2; --muted:#6b6b7a;
          --red:#CE1126; --white:#e8e8ea; --green:#22c55e; --pgreen:#007A3D;
          --accent:#e84545; --accent2:#ff7043; --accent3:#ffd166;
          --ghost:rgba(255,255,255,0.03);
          --ease-out:cubic-bezier(0.16,1,0.3,1);
          --font-display:var(--font-outfit,'Outfit'),sans-serif;
          --font-mono:var(--font-jetbrains,'JetBrains Mono'),monospace;
          --font-logo:var(--font-logo,'Sora'),sans-serif;
        }
        .pal-root[data-theme="light"] {
          --bg:#faf8f5; --surface:#ffffff; --surface2:#f0ede8;
          --border:rgba(0,0,0,0.07); --border2:rgba(0,0,0,0.14);
          --text:#111111; --muted:#7a7570;
          --red:#CE1126; --white:#111111; --pgreen:#007A3D;
          --accent:#c8392b; --accent2:#e8571a; --accent3:#c08b20;
          --ghost:rgba(0,0,0,0.03);
        }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        .pal-root{min-height:100vh;background:var(--bg);color:var(--text);
          font-family:var(--font-display);-webkit-font-smoothing:antialiased;
          overflow-x:hidden;transition:background .3s,color .3s;position:relative;}

        /* BG */
        .pal-glow{position:fixed;inset:0;z-index:0;pointer-events:none;
          background:
            radial-gradient(ellipse 55% 45% at 15% 12%,rgba(206,17,38,0.10),transparent 70%),
            radial-gradient(ellipse 50% 55% at 85% 55%,rgba(0,122,61,0.09),transparent 70%),
            radial-gradient(ellipse 45% 45% at 50% 108%,rgba(255,255,255,0.04),transparent 70%);}
        .pal-root[data-theme="light"] .pal-glow{
          background:
            radial-gradient(ellipse 55% 45% at 15% 12%,rgba(206,17,38,0.07),transparent 70%),
            radial-gradient(ellipse 50% 55% at 85% 55%,rgba(0,122,61,0.06),transparent 70%);}
        .pal-grid{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.5;
          background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);
          background-size:64px 64px;
          -webkit-mask-image:radial-gradient(ellipse 90% 55% at 50% 0%,#000,transparent 75%);
          mask-image:radial-gradient(ellipse 90% 55% at 50% 0%,#000,transparent 75%);}

        .pal-scroll-bar{position:fixed;top:0;left:0;right:0;height:2px;z-index:200;transform-origin:left;
          background:linear-gradient(90deg,var(--red),var(--white),var(--pgreen));pointer-events:none;}

        /* NAV */
        .pal-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 56px;height:64px;
          display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);
          background:rgba(5,5,7,0.7);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);transition:background .3s;}
        .pal-root[data-theme="light"] .pal-nav{background:rgba(250,248,245,0.72);}
        .pal-logo{font-family:var(--font-logo);font-size:1.15rem;font-weight:800;color:var(--text);
          text-decoration:none;letter-spacing:-.01em;display:flex;align-items:center;gap:8px;}
        .pal-logo-accent{color:var(--accent);}
        .pal-logo-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:pulse 2s ease-in-out infinite;}
        .pal-nav-mid{font-family:var(--font-mono);font-size:.6rem;color:var(--muted);letter-spacing:.22em;
          text-transform:uppercase;display:flex;align-items:center;gap:9px;}
        .pal-nav-mid::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--red);
          box-shadow:0 0 8px var(--red);animation:pulse 2s ease-in-out infinite;}
        .pal-nav-right{display:flex;align-items:center;gap:14px;}
        .pal-back,.pal-theme-btn{font-family:var(--font-mono);font-size:.65rem;color:var(--muted);
          border:1px solid var(--border2);padding:8px 16px;background:none;letter-spacing:.08em;
          text-transform:uppercase;text-decoration:none;transition:all .2s;display:flex;align-items:center;gap:8px;
          cursor:pointer;-webkit-tap-highlight-color:transparent;min-height:40px;}
        .pal-back:hover,.pal-theme-btn:hover{color:var(--text);border-color:var(--accent);}

        /* CONTENT */
        .pal-content{position:relative;z-index:2;max-width:1000px;margin:0 auto;padding:0 56px;}

        /* HERO */
        .pal-hero{padding:150px 0 40px;display:flex;flex-direction:column;align-items:center;text-align:center;}
        .pal-eyebrow{font-family:var(--font-mono);font-size:.66rem;color:var(--muted);
          letter-spacing:.3em;text-transform:uppercase;margin-bottom:34px;display:flex;align-items:center;gap:14px;}
        .pal-eyebrow::before,.pal-eyebrow::after{content:'';width:34px;height:1px;background:var(--muted);}

        /* FLAG */
        .pal-flag-wrap{margin-bottom:44px;perspective:1000px;}
        .pal-flag{position:relative;width:min(78vw,420px);aspect-ratio:5/3;border-radius:22px;overflow:hidden;
          border:1px solid var(--border2);box-shadow:0 50px 100px rgba(0,0,0,.55);transform-style:preserve-3d;}
        .pal-flag-stripes{position:absolute;inset:0;display:flex;flex-direction:column;}
        .pal-flag-stripes>span{flex:1;}
        .pal-shine{position:absolute;inset:0;pointer-events:none;
          background:linear-gradient(135deg,rgba(255,255,255,.18),transparent 45%,transparent 60%,rgba(255,255,255,.06));}
        .pal-shine-top{position:absolute;inset:0 0 50% 0;transform:skewY(-6deg);pointer-events:none;
          background:linear-gradient(to bottom,rgba(255,255,255,.16),transparent);}
        .pal-flag-inset{position:absolute;inset:0;border-radius:22px;pointer-events:none;
          box-shadow:inset 0 0 40px rgba(255,255,255,.12);}
        .pal-sweep{position:absolute;inset:0;width:34%;transform:skewX(-20deg);pointer-events:none;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent);}

        .pal-headline{font-size:clamp(3rem,9vw,6.5rem);font-weight:800;letter-spacing:-.045em;line-height:.92;margin-bottom:28px;}
        .pal-headline .l1{background:linear-gradient(180deg,var(--text),color-mix(in srgb,var(--text) 45%,transparent));
          -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}
        .pal-headline .l2{background:linear-gradient(90deg,var(--red),var(--text),var(--pgreen));
          -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}
        .pal-manifesto{font-size:1.15rem;color:var(--muted);line-height:1.75;max-width:620px;margin-bottom:20px;}

        /* SECTION */
        .pal-sec-head{margin:110px 0 44px;text-align:center;display:flex;flex-direction:column;align-items:center;}
        .pal-sec-label{font-family:var(--font-mono);font-size:.66rem;color:var(--muted);letter-spacing:.24em;
          text-transform:uppercase;margin-bottom:18px;}
        .pal-sec-title{font-size:clamp(1.9rem,4.5vw,3rem);font-weight:800;letter-spacing:-.04em;line-height:1.05;}

        /* VALUE CARDS */
        .pal-values{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
        .pal-card{position:relative;overflow:hidden;border:1px solid var(--border);border-radius:20px;
          background:var(--surface);padding:38px 32px;text-align:left;
          transition:border-color .35s var(--ease-out),background .35s,transform .35s var(--ease-out);}
        .pal-card:hover{border-color:var(--border2);background:var(--surface2);transform:translateY(-6px);}
        .pal-card-glow{position:absolute;width:200px;height:200px;border-radius:50%;filter:blur(60px);
          opacity:.16;top:-60px;right:-60px;pointer-events:none;transition:opacity .35s;}
        .pal-card:hover .pal-card-glow{opacity:.32;}
        .pal-card-icon{width:48px;height:48px;border-radius:14px;border:1px solid var(--border2);
          background:var(--ghost);display:flex;align-items:center;justify-content:center;font-size:1.35rem;margin-bottom:22px;}
        .pal-card-title{font-size:1.2rem;font-weight:800;letter-spacing:-.02em;margin-bottom:12px;}
        .pal-card-body{font-size:.9rem;color:var(--muted);line-height:1.72;margin-bottom:22px;}
        .pal-card-num{font-family:var(--font-mono);font-size:.58rem;color:var(--muted);letter-spacing:.2em;}

        /* CTA */
        .pal-cta{margin:110px 0 40px;border:1px solid var(--border);border-radius:26px;overflow:hidden;
          background:linear-gradient(135deg,var(--surface),var(--surface2));padding:80px 56px;text-align:center;position:relative;}
        .pal-cta-flagline{position:absolute;top:0;left:0;right:0;height:4px;
          background:linear-gradient(90deg,var(--red) 0 40%,var(--text) 40% 60%,var(--pgreen) 60% 100%);}
        .pal-cta::after{content:'';position:absolute;inset:0;pointer-events:none;
          background:radial-gradient(ellipse 60% 100% at 50% 0%,rgba(206,17,38,.12),transparent 70%);}
        .pal-cta-title{font-size:clamp(1.7rem,4vw,2.8rem);font-weight:800;letter-spacing:-.04em;line-height:1.08;margin-bottom:16px;position:relative;}
        .pal-cta-sub{color:var(--muted);font-size:1.02rem;max-width:500px;margin:0 auto 36px;position:relative;line-height:1.7;}
        .pal-hashtag{position:relative;display:inline-block;}
        .pal-hashtag-glow{position:absolute;inset:0;border-radius:999px;filter:blur(28px);opacity:.4;
          background:linear-gradient(90deg,var(--red),var(--text),var(--pgreen));transition:opacity .6s,filter .6s;}
        .pal-hashtag:hover .pal-hashtag-glow{opacity:.9;filter:blur(40px);}
        .pal-hashtag-inner{position:relative;overflow:hidden;border-radius:999px;border:1px solid var(--border2);
          background:color-mix(in srgb,var(--bg) 65%,transparent);backdrop-filter:blur(12px);padding:20px 44px;}
        .pal-hashtag-text{position:relative;font-size:clamp(1.1rem,3vw,1.7rem);font-weight:800;letter-spacing:.12em;text-transform:uppercase;
          background:linear-gradient(90deg,var(--red),var(--text),var(--pgreen));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}
        .pal-hashtag-sweep{position:absolute;inset:0;transform:translateX(-100%);pointer-events:none;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);transition:transform 1s;}
        .pal-hashtag:hover .pal-hashtag-sweep{transform:translateX(100%);}

        /* FOOTER */
        .pal-footer{position:relative;z-index:2;border-top:1px solid var(--border);padding:32px 56px;max-width:1000px;margin:0 auto;
          display:flex;align-items:center;justify-content:space-between;gap:16px;}
        .pal-footer-copy{font-family:var(--font-mono);font-size:.6rem;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;}
        .pal-footer-links{display:flex;gap:24px;}
        .pal-footer-link{font-family:var(--font-mono);font-size:.6rem;color:var(--muted);text-decoration:none;
          letter-spacing:.08em;text-transform:uppercase;transition:color .2s;}
        .pal-footer-link:hover{color:var(--text);}

        @keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.5;transform:scale(.85);}}

        @media(max-width:900px){
          .pal-nav{padding:0 20px;}
          .pal-nav-mid{display:none;}
          .pal-content{padding:0 20px;}
          .pal-values{grid-template-columns:1fr;}
          .pal-cta{padding:56px 26px;}
          .pal-footer{padding:24px 20px;flex-direction:column;align-items:flex-start;}
        }
        @media(max-width:480px){
          .pal-back span:last-child{display:none;}
          .pal-hashtag-inner{padding:16px 28px;}
        }
        @media(hover:none) and (pointer:coarse){
          .pal-nav{backdrop-filter:none;-webkit-backdrop-filter:none;background:var(--bg);}
        }
        ::selection{background:var(--red);color:#fff;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:var(--bg);}
        ::-webkit-scrollbar-thumb{background:var(--border2);}
      `}</style>

      <div className="pal-glow" />
      <div className="pal-grid" />
      <motion.div className="pal-scroll-bar" style={{ scaleX: progress }} />

      {/* NAV */}
      <nav className="pal-nav">
        <a href="/" className="pal-logo">
          MEGA<span className="pal-logo-accent">Devs</span>
          <span className="pal-logo-dot" />
        </a>
        <span className="pal-nav-mid">In Solidarity</span>
        <div className="pal-nav-right">
          <button className="pal-theme-btn" onClick={toggleTheme}>{theme === "dark" ? "☀" : "◑"}</button>
          <a href="/" className="pal-back"><span>←</span><span>Back</span></a>
        </div>
      </nav>

      <div className="pal-content">
        {/* HERO */}
        <section className="pal-hero">
          <motion.div
            className="pal-eyebrow"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Free Palestine
          </motion.div>

          {/* FLAG */}
          <motion.div
            className="pal-flag-wrap"
            initial={{ opacity: 0, y: 40, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="pal-flag"
              animate={{ rotateX: [0, 4, 0, -3, 0], rotateY: [0, -3, 0, 3, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="pal-flag-stripes">
                <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} style={{ originX: 0, background: "#000" }} />
                <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }} style={{ originX: 0, background: "#fff" }} />
                <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }} style={{ originX: 0, background: "#007A3D" }} />
              </div>
              <motion.div
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: "absolute", inset: 0, width: "40%", background: "#CE1126", clipPath: "polygon(0 0, 100% 50%, 0 100%)", transformOrigin: "left" }}
              />
              <div className="pal-shine" />
              <div className="pal-shine-top" />
              <div className="pal-flag-inset" />
              <motion.div
                className="pal-sweep"
                initial={{ x: "-140%" }} animate={{ x: "180%" }}
                transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>

          {/* HEADLINE */}
          <motion.h1
            className="pal-headline"
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="l1">Resilience</span><br />
            <span className="l2">&amp; Solidarity</span>
          </motion.h1>

          <motion.p
            className="pal-manifesto"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            We stand with the people of Palestine. Beyond the code we write, we believe technology
            should serve humanity — that every voice deserves to be heard, every story remembered,
            and every future built on justice and peace.
          </motion.p>
        </section>

        {/* VALUES */}
        <div className="pal-sec-head">
          <div className="pal-sec-label">What We Stand For</div>
          <h2 className="pal-sec-title">Three things we<br />will never compromise.</h2>
        </div>

        <div className="pal-values">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              className="pal-card"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", damping: 24, stiffness: 130, delay: i * 0.08 }}
            >
              <div className="pal-card-glow" style={{ background: v.color }} />
              <div className="pal-card-icon" style={{ color: v.color, textShadow: `0 0 18px ${v.color}66` }}>{v.icon}</div>
              <div className="pal-card-title">{v.title}</div>
              <p className="pal-card-body">{v.body}</p>
              <span className="pal-card-num">{String(i + 1).padStart(2, "0")} / 03</span>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="pal-cta"
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ type: "spring", damping: 24, stiffness: 130 }}
        >
          <div className="pal-cta-flagline" />
          <h2 className="pal-cta-title">Raise your voice.<br />Build with purpose.</h2>
          <p className="pal-cta-sub">Join the movement and share your solidarity. Every voice counts.</p>
          <motion.a
            href="https://twitter.com/search?q=%23build_with_palestine"
            target="_blank" rel="noopener noreferrer"
            className="pal-hashtag"
            whileHover={{ scale: 1.04, y: -4 }} whileTap={{ scale: 0.97 }}
          >
            <span className="pal-hashtag-glow" />
            <span className="pal-hashtag-inner">
              <span className="pal-hashtag-sweep" />
              <span className="pal-hashtag-text">#build_with_palestine</span>
            </span>
          </motion.a>
        </motion.div>
      </div>

      {/* FOOTER */}
      <footer className="pal-footer">
        <span className="pal-footer-copy">© {new Date().getFullYear()} Mega Devs · Standing for humanity</span>
        <div className="pal-footer-links">
          <a href="/" className="pal-footer-link">Home</a>
          <a href="/works" className="pal-footer-link">Work</a>
          <a href="/history" className="pal-footer-link">Our Story</a>
        </div>
      </footer>
    </div>
  );
}
