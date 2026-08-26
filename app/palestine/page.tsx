"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

const values = [
  {
    icon: "❤",
    title: "Humanity",
    body: "Every life carries dignity. We build with empathy and stand with those who endure.",
    color: "#CE1126",
  },
  {
    icon: "⚖",
    title: "Justice",
    body: "We believe in equity and truth — that freedom and human rights belong to everyone.",
    color: "#ffffff",
  },
  {
    icon: "✷",
    title: "Hope",
    body: "Through resilience, community, and creation, a future rooted in peace remains within reach.",
    color: "#007A3D",
  },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function PalestinePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#020202]" />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020202] font-sans text-white">
      {/* Interactive 3D Background */}
      <Scene3D />

      {/* Atmospheric Overlays */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-[#020202]" />
      <div className="pointer-events-none absolute inset-0 z-10 shadow-[inset_0_0_160px_rgba(0,0,0,0.9)]" />
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
      />

      {/* Top Bar */}
      <header className="pointer-events-auto absolute top-0 left-0 z-50 flex w-full items-center justify-between p-7 md:p-9">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-lg backdrop-blur-md transition-all group-hover:border-white/25 group-hover:bg-white/15">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </div>
          <span className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-white/45 transition-colors group-hover:text-white">
            Return Home
          </span>
        </Link>

        <div className="hidden items-center gap-2.5 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-white/40 sm:flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#CE1126]" />
          In Solidarity
        </div>
      </header>

      {/* MAIN */}
      <main className="relative z-20 mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-6 py-28 text-center">
        {/* Waving Glass Flag */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.3, ease: easeOut }}
          className="mb-14"
        >
          <motion.div
            animate={{ rotateX: [0, 4, 0, -3, 0], rotateY: [0, -3, 0, 3, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformStyle: "preserve-3d", perspective: 1000 }}
            className="group relative h-44 w-72 overflow-hidden rounded-3xl border border-white/15 shadow-[0_50px_100px_rgba(0,0,0,0.85)] sm:h-56 sm:w-[24rem] md:h-64 md:w-[27rem]"
          >
            {/* Flag stripes: black / white / green */}
            <div className="absolute inset-0 flex flex-col">
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: 0.3, ease: easeOut }} style={{ originX: 0 }} className="flex-1 bg-black" />
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: 0.45, ease: easeOut }} style={{ originX: 0 }} className="flex-1 bg-white" />
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay: 0.6, ease: easeOut }} style={{ originX: 0 }} className="flex-1 bg-[#007A3D]" />
            </div>
            {/* Red hoist triangle */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.85, ease: easeOut }}
              style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)", originX: 0 }}
              className="absolute inset-y-0 left-0 w-2/5 bg-[#CE1126]"
            />
            {/* Glass reflections */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/15 via-transparent to-white/5" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 -skew-y-6 bg-gradient-to-b from-white/15 to-transparent" />
            <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_40px_rgba(255,255,255,0.12)]" />
            {/* Shine sweep */}
            <motion.div
              initial={{ x: "-120%" }}
              animate={{ x: "120%" }}
              transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-y-0 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent"
            />
          </motion.div>
        </motion.div>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease: easeOut }}
          className="mb-6 flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.35em] text-white/40"
        >
          <span className="h-px w-8 bg-white/30" />
          Free Palestine
          <span className="h-px w-8 bg-white/30" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 1.0, ease: easeOut }}
          className="mb-7 text-6xl font-black leading-[0.92] tracking-tighter md:text-8xl lg:text-[7.5rem]"
        >
          <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent drop-shadow-2xl">
            Resilience
          </span>
          <br />
          <span className="bg-gradient-to-r from-[#CE1126] via-white to-[#007A3D] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]">
            &amp; Solidarity
          </span>
        </motion.h1>

        {/* Manifesto */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2, ease: easeOut }}
          className="mb-16 max-w-2xl text-lg font-light leading-relaxed text-white/55 drop-shadow-md md:text-xl"
        >
          We stand with the people of Palestine. Beyond the code we write, we believe technology
          should serve humanity — and that every voice deserves to be heard, every story remembered,
          and every future built on justice and peace.
        </motion.p>

        {/* Value cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.35, ease: easeOut }}
          className="mb-16 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left backdrop-blur-xl transition-colors hover:border-white/25"
            >
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
                style={{ background: v.color }}
              />
              <span
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl"
                style={{ color: v.color, textShadow: `0 0 18px ${v.color}` }}
              >
                {v.icon}
              </span>
              <h3 className="mb-2 text-lg font-bold tracking-tight">{v.title}</h3>
              <p className="text-sm leading-relaxed text-white/50">{v.body}</p>
              <span className="mt-4 block font-mono text-[0.55rem] uppercase tracking-[0.2em] text-white/25">
                {String(i + 1).padStart(2, "0")}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.a
          href="https://twitter.com/search?q=%23build_with_palestine"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5, ease: easeOut }}
          whileHover={{ scale: 1.04, y: -4 }}
          whileTap={{ scale: 0.97 }}
          className="group relative inline-block"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#CE1126] via-white to-[#007A3D] opacity-40 blur-2xl transition-all duration-700 group-hover:opacity-100 group-hover:blur-3xl" />
          <div className="relative overflow-hidden rounded-full border border-white/20 bg-[#050507]/60 px-10 py-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] backdrop-blur-2xl md:px-12 md:py-6">
            <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            <span className="relative bg-gradient-to-r from-[#CE1126] via-white to-[#007A3D] bg-clip-text text-xl font-extrabold uppercase tracking-[0.15em] text-transparent drop-shadow-lg md:text-2xl">
              #build_with_palestine
            </span>
          </div>
        </motion.a>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.7 }}
          className="mt-16 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/25"
        >
          Mega Devs · Standing for humanity
        </motion.p>
      </main>
    </div>
  );
}
