"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";
import "../[subdomain]/pro-design.css";

/* ============================================================
   Inline SVG icons (no react-icons dependency)
   ============================================================ */
type IconProps = { className?: string };
const I = {
  github: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" {...p}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.41-1.27.74-1.56-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.42.36.8 1.08.8 2.18v3.23c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  ),
  whatsapp: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" {...p}>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.47 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.4.25-.7.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35ZM12.05 21.5h-.01a9.5 9.5 0 0 1-4.84-1.32l-.35-.2-3.6.94.96-3.5-.23-.36a9.44 9.44 0 0 1-1.45-5.05c0-5.22 4.26-9.47 9.5-9.47a9.44 9.44 0 0 1 9.49 9.49c0 5.22-4.26 9.47-9.5 9.47ZM20.6 3.44A11.36 11.36 0 0 0 12.05.5C5.79.5.7 5.58.7 11.83c0 2.08.55 4.11 1.58 5.9L.6 23.5l5.9-1.55a11.35 11.35 0 0 0 5.44 1.39h.01c6.26 0 11.35-5.08 11.35-11.33 0-3.03-1.18-5.88-3.32-8.02Z" />
    </svg>
  ),
  instagram: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="1em" height="1em" {...p}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  telegram: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" {...p}>
      <path d="M21.94 4.3 18.9 19.1c-.23 1.02-.84 1.27-1.7.79l-4.7-3.46-2.27 2.18c-.25.25-.46.46-.94.46l.33-4.77 8.68-7.84c.38-.34-.08-.53-.59-.19L6.99 13.2l-4.63-1.45c-1.01-.31-1.03-1 .21-1.48l18.1-6.98c.84-.31 1.57.2 1.27 1.51Z" />
    </svg>
  ),
  facebook: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" {...p}>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  ),
  phone: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="1em" height="1em" {...p}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  ),
  mail: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="1em" height="1em" {...p}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  ),
  link: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="1em" height="1em" {...p}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  arrowUpRight: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="1em" height="1em" {...p}>
      <path d="M7 17 17 7" /><path d="M7 7h10v10" />
    </svg>
  ),
  arrowDown: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="1em" height="1em" {...p}>
      <path d="M12 5v14" /><path d="m19 12-7 7-7-7" />
    </svg>
  ),
};

type IconKey = keyof typeof I;

interface Profile {
  name?: string;
  role?: string;
  photoUrl?: string;
  telegram?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  github?: string;
  phone?: string;
  gmail?: string;
  customLinks?: { id: string; title: string; url: string }[];
  [key: string]: any;
}

type LinkNode = {
  key: string;
  label: string;
  detail: string;
  href: string;
  icon: IconKey;
  accent: string; // css var name, e.g. "--cyan"
};

const ease = [0.22, 1, 0.36, 1] as const;

/* ============================================================
   Build link nodes from the saved profile fields
   ============================================================ */
function buildLinks(profile: Profile): LinkNode[] {
  const nodes: LinkNode[] = [];

  const push = (
    val: string | undefined,
    key: string,
    label: string,
    detail: string,
    icon: IconKey,
    accent: string,
    hrefBuilder?: (v: string) => string
  ) => {
    const v = (val || "").trim();
    if (!v) return;
    nodes.push({ key, label, detail, href: hrefBuilder ? hrefBuilder(v) : v, icon, accent });
  };

  push(profile.github, "github", "GitHub", "open-source & code", "github", "--text");
  push(profile.whatsapp, "whatsapp", "WhatsApp", "let's talk", "whatsapp", "--green", (v) =>
    /^https?:|^wa\.me/.test(v) ? (v.startsWith("http") ? v : `https://${v}`) : `https://wa.me/${v.replace(/[^\d]/g, "")}`
  );
  push(profile.instagram, "instagram", "Instagram", "photos & moments", "instagram", "--magenta");
  push(profile.telegram, "telegram", "Telegram", "message me", "telegram", "--indigo");
  push(profile.facebook, "facebook", "Facebook", "on the socials", "facebook", "--indigo");
  push(profile.gmail, "gmail", "Email", profile.gmail || "get in touch", "mail", "--cyan", (v) =>
    v.startsWith("mailto:") ? v : `mailto:${v}`
  );
  push(profile.phone, "phone", "Call", profile.phone || "give me a ring", "phone", "--amber", (v) =>
    v.startsWith("tel:") ? v : `tel:${v.replace(/\s+/g, "")}`
  );

  (profile.customLinks || []).forEach((l, i) => {
    if (!l || !l.url?.trim()) return;
    nodes.push({
      key: `custom-${l.id || i}`,
      label: l.title?.trim() || "Link",
      detail: "custom link",
      href: l.url.trim(),
      icon: "link",
      accent: "--violet",
    });
  });

  return nodes;
}

function initials(name?: string) {
  if (!name) return "•";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

/* ============================================================
   TiltCard (ported from about-me)
   ============================================================ */
function TiltCard({
  children,
  className,
  max = 12,
  lift = 40,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  lift?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 220, damping: 20 });
  const sy = useSpring(py, { stiffness: 220, damping: 20 });
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const tx = useTransform(sx, [0, 1], [-8, 8]);
  const ty = useTransform(sy, [0, 1], [-8, 8]);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    px.set(x);
    py.set(y);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, x: tx, y: ty, transformStyle: "preserve-3d" }}
      whileHover={{ z: lift }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className={`group/tilt relative preserve-3d ${className ?? ""}`}
    >
      {children}
      <span className="glare" />
      <span className="card-ring" />
    </motion.div>
  );
}

/* ============================================================
   Ambient background (ported from about-me Aurora)
   ============================================================ */
function Ambient() {
  const rootRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 40, damping: 20 });
  const sy = useSpring(my, { stiffness: 40, damping: 20 });
  const x1 = useTransform(sx, [0, 1], [24, -24]);
  const y1 = useTransform(sy, [0, 1], [24, -24]);
  const x2 = useTransform(sx, [0, 1], [-30, 30]);
  const y2 = useTransform(sy, [0, 1], [-30, 30]);

  useEffect(() => {
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const px = e.clientX / window.innerWidth;
      const py = e.clientY / window.innerHeight;
      mx.set(px);
      my.set(py);
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          const el = rootRef.current;
          if (el) {
            el.style.setProperty("--mx", `${px * 100}%`);
            el.style.setProperty("--my", `${py * 100}%`);
          }
        });
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mx, my]);

  return (
    <>
      <div ref={rootRef} className="ambient">
        <div className="aurora">
          <motion.div className="aurora-blob blob-a" style={{ x: x1, y: y1 }} />
          <motion.div className="aurora-blob blob-b" style={{ x: x2, y: y2 }} />
          <motion.div className="aurora-blob blob-c" style={{ x: x1, y: y2 }} />
        </div>
        <div className="starfield" />
        <div className="torch" />
        <div className="spotlight" />
        <div className="vignette" />
      </div>
      <div className="grain" />
    </>
  );
}

/* ============================================================
   Hero (ported from about-me Hero)
   ============================================================ */
function Hero({ profile }: { profile: Profile }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const nameX = useTransform(sx, [0, 1], [26, -26]);
  const nameY = useTransform(sy, [0, 1], [18, -18]);
  const roleX = useTransform(sx, [0, 1], [14, -14]);
  const roleY = useTransform(sy, [0, 1], [10, -10]);
  const avaX = useTransform(sx, [0, 1], [-10, 10]);
  const avaY = useTransform(sy, [0, 1], [-8, 8]);
  const rotY = useTransform(sx, [0, 1], [8, -8]);
  const rotX = useTransform(sy, [0, 1], [-6, 6]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  return (
    <header className="scene relative min-h-[88vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div style={{ rotateX: rotX, rotateY: rotY }} className="preserve-3d flex flex-col items-center">
        {/* avatar */}
        <motion.div
          style={{ x: avaX, y: avaY }}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="relative mb-8"
        >
          <div className="absolute -inset-6 rounded-full bg-[var(--halo)] blur-3xl opacity-40 animate-pulse" />
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-[2px] bg-gradient-to-br from-[var(--violet)] via-[var(--indigo)] to-[var(--cyan)]">
            <div className="relative w-full h-full rounded-full overflow-hidden bg-[var(--bg-2)] grid place-items-center">
              {profile.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.photoUrl} alt={profile.name || "avatar"} className="w-full h-full object-cover" />
              ) : (
                <span className="font-display text-2xl font-bold text-[var(--text)]">{initials(profile.name)}</span>
              )}
            </div>
          </div>
          <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[var(--bg)] grid place-items-center">
            <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
          </span>
        </motion.div>

        {/* eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease }}
          className="mb-4 text-xs sm:text-sm tracking-[0.35em] uppercase text-[var(--muted)] font-mono"
        >
          Hello, I&apos;m
        </motion.p>

        {/* name */}
        <motion.h1
          style={{ x: nameX, y: nameY }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          className="shimmer glow-violet font-display font-extrabold tracking-tight leading-[0.95] text-[clamp(2.75rem,12vw,7rem)]"
        >
          {profile.name || "Your Name"}
        </motion.h1>

        {/* role */}
        {profile.role && (
          <motion.p
            style={{ x: roleX, y: roleY }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease }}
            className="mt-5 text-lg sm:text-2xl text-[var(--text)]/85 max-w-xl"
          >
            {profile.role}
          </motion.p>
        )}
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="absolute bottom-8 flex flex-col items-center gap-2 text-[var(--dim)]"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">Explore</span>
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
          <I.arrowDown />
        </motion.span>
      </motion.div>
    </header>
  );
}

/* ============================================================
   Link card (ported from about-me LinkCard)
   ============================================================ */
function LinkCard({ node, index, featured }: { node: LinkNode; index: number; featured?: boolean }) {
  const Icon = I[node.icon];
  const accent = `var(${node.accent})`;
  const external = /^https?:/.test(node.href);

  return (
    <a
      href={node.href}
      target={external ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="block h-full scene"
    >
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: index * 0.07, ease }}
        className="h-full"
      >
        <TiltCard
          className={`h-full rounded-3xl border border-[var(--border)] bg-[var(--panel)] backdrop-blur-xl overflow-hidden transition-colors duration-300 hover:border-[var(--border-strong)] ${
            featured ? "min-h-[220px]" : "min-h-[150px]"
          }`}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover/tilt:opacity-100 transition-opacity duration-500"
            style={{ background: `radial-gradient(120% 120% at 100% 0%, ${accent}22, transparent 60%)` }}
          />
          <div className="relative h-full p-6 sm:p-7 flex flex-col" style={{ transform: "translateZ(40px)" }}>
            <div className="flex items-start justify-between">
              <span
                className="grid place-items-center w-12 h-12 rounded-2xl border border-[var(--border)] bg-white/5 text-xl transition-transform duration-300 group-hover/tilt:scale-110"
                style={{ color: accent, boxShadow: `0 8px 30px -10px ${accent}` }}
              >
                <Icon />
              </span>
              <span className="text-[var(--dim)] group-hover/tilt:text-[var(--text)] transition-colors text-lg">
                <I.arrowUpRight />
              </span>
            </div>
            <div className="mt-auto pt-6">
              <h3 className="text-xl font-semibold text-[var(--text)]">{node.label}</h3>
              <p className="text-sm text-[var(--muted)] mt-1">{node.detail}</p>
            </div>
          </div>
        </TiltCard>
      </motion.div>
    </a>
  );
}

/* ============================================================
   ProProfile — full page
   ============================================================ */
export default function ProProfile({ profile }: { profile: Profile }) {
  const links = buildLinks(profile);

  // Full takeover: hide the global MEGA navbar while mounted.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("pro-active");
    return () => root.classList.remove("pro-active");
  }, []);

  return (
    <div className="pro-root" data-theme="dark">
      <Ambient />

      <main className="pro-content relative min-h-screen">
        <Hero profile={profile} />

        {/* Connect */}
        <section className="relative mx-auto max-w-5xl px-4 sm:px-6 pb-24">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-xs tracking-[0.35em] uppercase text-[var(--violet)]">/ connect</p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold tracking-tight text-[var(--text)]">
                Find me around
                <br className="hidden sm:block" /> the web.
              </h2>
            </div>
            <p className="hidden sm:block max-w-xs text-sm text-[var(--muted)] text-right">
              Powered by <span className="text-[var(--cyan)]">Mega Devs</span>. Always open to a good project or a chat.
            </p>
          </div>

          {links.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {links.map((node, i) => (
                <div key={node.key} className={i === 0 ? "sm:col-span-2" : undefined}>
                  <LinkCard node={node} index={i} featured={i === 0} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--muted)] text-sm font-mono">No links added yet.</p>
          )}

          <footer className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--border)] pt-8 text-sm text-[var(--dim)]">
            <span>
              © {new Date().getFullYear()} {profile.name || "Anonymous"}. All rights reserved.
            </span>
            {profile.role && <span className="font-mono text-xs tracking-widest uppercase">{profile.role}</span>}
          </footer>
        </section>
      </main>
    </div>
  );
}
