"use client";

import { motion, Variants, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { safeUrl } from "../lib/sanitizeUrl";

interface Profile {
  name: string;
  role?: string;
  photoUrl?: string;
  telegram?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  github?: string;
  phone?: string;
  gmail?: string;
  themeColor?: string;
  glassyEffect?: boolean;
  cursorSpotlight?: boolean;
  tiltEffect?: boolean;
  particlesEffect?: boolean;
  gradientBorder?: boolean;
  holographicFoil?: boolean;
  cyberGlitch?: boolean;
  levitationFloat?: boolean;
  neonPulse?: boolean;
  sonarPulse?: boolean;
  scanlineEffect?: boolean;
  shineSweep?: boolean;
  borderBeam?: boolean;
  starfield?: boolean;
  customLinks?: { id: string, title: string, url: string }[];
  [key: string]: any;
}

const THEMES: Record<string, { a: string; b: string; glow: string }> = {
  blue: { a: "#3b82f6", b: "#818cf8", glow: "59,130,246" },
  purple: { a: "#a855f7", b: "#ec4899", glow: "168,85,247" },
  emerald: { a: "#10b981", b: "#06b6d4", glow: "16,185,129" },
  rose: { a: "#f43f5e", b: "#fb923c", glow: "244,63,94" },
  amber: { a: "#f59e0b", b: "#ef4444", glow: "245,158,11" },
  slate: { a: "#94a3b8", b: "#cbd5e1", glow: "148,163,184" },
  neon: { a: "#00ff88", b: "#00ccff", glow: "0,255,136" },
  crimson: { a: "#dc143c", b: "#ff6b6b", glow: "220,20,60" },
  gold: { a: "#ffd700", b: "#ff8c00", glow: "255,215,0" },
  ocean: { a: "#0ea5e9", b: "#22d3ee", glow: "14,165,233" },
};

const SOCIAL: Record<string, { grad: string; icon: React.ReactNode; label: string; sub: string }> = {
  telegram: { grad: "linear-gradient(145deg,#54a9eb,#2b73b3)", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/></svg>, label: "Telegram", sub: "Chat with me" },
  whatsapp: { grad: "linear-gradient(145deg,#25d366,#128c45)", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M11.974 0A12 12 0 000 12c0 2.115.548 4.095 1.498 5.845L.16 23.4l5.773-1.282c1.78.89 3.82 1.412 5.992 1.412h.016A12 12 0 0024 12c0-6.627-5.373-12-12-12H11.974zm0 2.016A9.972 9.972 0 0121.942 12a9.973 9.973 0 01-9.968 9.983h-.01c-1.637 0-3.197-.42-4.577-1.213l-.33-.19-3.418.761.777-3.232-.212-.34a9.92 9.92 0 01-1.536-5.35c0-5.503 4.475-9.983 9.98-9.983h.009zm5.305 13.56c-.287.808-1.395 1.545-2.247 1.704-.707.132-1.602.246-4.996-1.162-4.062-1.688-6.697-5.834-6.896-6.1-.198-.266-1.64-2.185-1.64-4.168 0-1.983 1.042-2.956 1.414-3.344.37-.389.81-.486 1.08-.486.27 0 .53.003.766.012.245.01.575-.094.896.68.341.82 1.134 2.766 1.233 2.964.1.2.167.433.033.7-.133.265-.2.43-.404.665-.198.234-.42.496-.596.697-.197.227-.407.472-.178.865.228.394 1.01 1.67 2.168 2.705 1.5 1.343 2.738 1.758 3.13 1.956.393.198.625.166.862-.102.238-.266 1.018-1.187 1.293-1.597.276-.41.553-.342.915-.205.362.137 2.296 1.082 2.69 1.28.395.197.66.295.756.46.096.166.096.963-.19 1.772z"/></svg>, label: "WhatsApp", sub: "Send a message" },
  instagram: { grad: "linear-gradient(145deg,#f9ce34,#ee2a7b 50%,#6228d7)", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>, label: "Instagram", sub: "Follow my journey" },
  facebook: { grad: "linear-gradient(145deg,#4267b2,#1a3c6c)", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M12 0C5.372 0 0 5.372 0 12c0 5.983 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 22.954 24 17.983 24 12c0-6.628-5.372-12-12-12z"/></svg>, label: "Facebook", sub: "Connect with me" },
  github: { grad: "linear-gradient(145deg,#4c4c4c,#1a1a1a)", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.165c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.62-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.627-5.373-12-12-12z"/></svg>, label: "GitHub", sub: "Open source projects" },
  phone: { grad: "linear-gradient(145deg,#7c3aed,#4c1d95)", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>, label: "Call Now", sub: "" },
  gmail: { grad: "linear-gradient(145deg,#ea4335,#c62828)", icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>, label: "Email Me", sub: "" },
};

export default function PremiumProfileCard({ profile, bgStyle }: { profile: Profile; bgStyle: string }) {
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [spotPos, setSpotPos] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  useEffect(() => {
    if (typeof window !== "undefined") setCurrentUrl(window.location.href);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!profile.cursorSpotlight && !profile.tiltEffect) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    if (profile.cursorSpotlight) setSpotPos({ x, y });
    if (profile.tiltEffect) setTilt({ rx: ((y - 50) / 50) * -6, ry: ((x - 50) / 50) * 6 });
  };

  const handleCardMouseLeave = () => {
    setSpotPos({ x: 50, y: 50 });
    setTilt({ rx: 0, ry: 0 });
  };

  const particles = Array.from({ length: 14 }, (_, i) => ({
    left: (i * 37) % 100,
    top: (i * 53) % 100,
    size: 2 + (i % 3),
    delay: (i % 7) * 0.8,
    duration: 6 + (i % 5) * 1.4,
  }));

  const t = THEMES[profile.themeColor || "blue"] || THEMES.blue;

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
  };
  const item: Variants = {
    hidden: { y: 20, opacity: 0, scale: 0.97 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 340, damping: 28 } },
  };

  const socials = [
    profile.telegram && { key: "telegram", href: profile.telegram },
    profile.whatsapp && { key: "whatsapp", href: profile.whatsapp },
    profile.instagram && { key: "instagram", href: profile.instagram },
    profile.facebook && { key: "facebook", href: profile.facebook },
    profile.github && { key: "github", href: profile.github },
    profile.phone && { key: "phone", href: `tel:${profile.phone.replace(/[^0-9+]/g, "")}`, sub: profile.phone },
  ].filter(Boolean) as { key: string; href: string; sub?: string }[];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        .ppc-shell {
          position: relative; z-index: 10;
          width: 100%; max-width: 500px;
          margin: 0 auto; padding: 24px 16px 80px;
          font-family: 'Outfit', sans-serif;
          perspective: 1200px;
        }

        /* ── ANIMATED GRADIENT BORDER ── */
        .ppc-gb-wrap { position: relative; border-radius: 32px; padding: 2px; overflow: hidden; }
        .ppc-gb-wrap::before {
          content: ""; position: absolute; inset: -60%; z-index: 0;
          background: conic-gradient(from 0deg, transparent, var(--theme-a), var(--theme-b), transparent 55%);
          animation: gbSpin 5s linear infinite;
        }
        .ppc-gb-wrap .ppc-card { position: relative; z-index: 1; }
        @keyframes gbSpin { to { transform: rotate(360deg); } }

        /* ── CURSOR SPOTLIGHT ── */
        .ppc-spotlight {
          position: absolute; inset: 0; z-index: 4; pointer-events: none; border-radius: inherit;
          background: radial-gradient(circle 240px at var(--spot-x) var(--spot-y), rgba(var(--theme-glow),0.16), transparent 70%);
          transition: opacity 0.25s ease;
        }

        /* ── AMBIENT PARTICLES ── */
        .ppc-particles { position: absolute; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; border-radius: inherit; }
        .ppc-particle {
          position: absolute; border-radius: 50%;
          background: var(--theme-a);
          box-shadow: 0 0 6px 1px var(--theme-a);
          opacity: 0;
          animation: particleFloat linear infinite;
        }
        @keyframes particleFloat {
          0%   { transform: translateY(0); opacity: 0; }
          10%  { opacity: 0.55; }
          90%  { opacity: 0.35; }
          100% { transform: translateY(-140px); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ppc-gb-wrap::before, .ppc-particle { animation: none; }
        }

        /* ── OUTER BLUR BOX ── */
        .ppc-card {
          position: relative; border-radius: 30px; padding: 44px 24px 32px; overflow: hidden;
          background: rgba(8, 10, 18, 0.54);
          backdrop-filter: blur(48px) saturate(160%) brightness(0.88);
          -webkit-backdrop-filter: blur(48px) saturate(160%) brightness(0.88);
          border: 1px solid rgba(255,255,255,0.07);
          transform-style: preserve-3d;
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
          box-shadow:
            0 2px 0 0 rgba(255,255,255,0.07) inset,
            0 -1px 0 0 rgba(0,0,0,0.5) inset,
            0 48px 96px -24px rgba(0,0,0,0.75),
            0 0 0 1px rgba(0,0,0,0.6);
        }
        .ppc-card::before {
          content: ""; position: absolute; top: 0; left: 10%; right: 10%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          pointer-events: none;
        }
        .ppc-card-glow {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background: radial-gradient(ellipse 90% 55% at 50% -5%, rgba(var(--theme-glow),0.13) 0%, transparent 60%);
        }

        /* ── QR SHARE BUTTON ── */
        .ppc-qr-btn {
          position: absolute; top: 16px; right: 16px; z-index: 20;
          width: 38px; height: 38px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 11px;
          color: #475569; cursor: pointer;
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          backdrop-filter: blur(12px);
        }
        .ppc-qr-btn:hover {
          background: rgba(var(--theme-glow),0.12);
          border-color: rgba(var(--theme-glow),0.4);
          color: var(--theme-a);
          transform: scale(1.1);
          box-shadow: 0 0 14px rgba(var(--theme-glow),0.2);
        }

        /* ── AVATAR ── */
        .ppc-av-wrap { position: relative; width: 124px; height: 124px; margin: 0 auto 22px; z-index: 1; }
        .ppc-av-ring-blur {
          position: absolute; inset: -10px; border-radius: 50%;
          background: radial-gradient(circle, rgba(var(--theme-glow),0.5), transparent 70%);
          filter: blur(14px);
          animation: haloPulse 4s ease-in-out infinite alternate; z-index: 0;
        }
        .ppc-av-ring {
          position: absolute; inset: -4px; border-radius: 50%;
          background: conic-gradient(from 0deg, var(--theme-a), var(--theme-b), transparent 40%, var(--theme-a));
          animation: ringRotate 5s linear infinite; z-index: 1;
        }
        .ppc-av-bg   { position: absolute; inset: -4px; border-radius: 50%; background: #080a12; z-index: 2; }
        .ppc-av-inner {
          position: absolute; inset: 3px; border-radius: 50%; overflow: hidden;
          background: #0f172a; z-index: 3;
          box-shadow: inset 0 2px 8px rgba(0,0,0,0.6);
        }
        .ppc-av-img  { width: 100%; height: 100%; object-fit: cover; }
        .ppc-av-init {
          width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
          font-family: 'Outfit', sans-serif; font-size: 2.8rem; font-weight: 800; color: #fff;
          background: linear-gradient(135deg, var(--theme-a), var(--theme-b));
        }
        @keyframes ringRotate { to { transform: rotate(360deg); } }
        @keyframes haloPulse  { from { opacity: 0.45; transform: scale(0.88); } to { opacity: 1; transform: scale(1.12); } }

        /* ── NAME / ROLE ── */
        .ppc-name {
          font-family: 'Outfit', sans-serif;
          font-size: 2.2rem; font-weight: 800;
          letter-spacing: -0.03em; line-height: 1.05; margin-bottom: 8px;
          background: linear-gradient(160deg, #ffffff 45%, rgba(255,255,255,0.38));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          position: relative; z-index: 1;
        }
        .ppc-role {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem; font-weight: 500; letter-spacing: 0.18em;
          text-transform: uppercase; color: var(--theme-a); margin-bottom: 8px;
          position: relative; z-index: 1; opacity: 0.85;
        }

        /* ── CYBER GLITCH TEXT ── */
        .ppc-glitch {
          position: relative; display: inline-block;
        }
        .ppc-glitch::before, .ppc-glitch::after {
          content: attr(data-text);
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          clip: rect(0, 0, 0, 0); opacity: 0.8;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .ppc-glitch::before {
          left: -2px; text-shadow: 2px 0 #ff0055;
          animation: glitchAnim1 3s infinite linear alternate-reverse;
        }
        .ppc-glitch::after {
          left: 2px; text-shadow: -2px 0 #00ffff;
          animation: glitchAnim2 2.5s infinite linear alternate-reverse;
        }
        @keyframes glitchAnim1 {
          0% { clip: rect(10px, 9999px, 30px, 0); transform: skew(0.3deg); }
          20% { clip: rect(40px, 9999px, 60px, 0); transform: skew(-0.5deg); }
          40% { clip: rect(15px, 9999px, 50px, 0); transform: skew(0.4deg); }
          60% { clip: rect(50px, 9999px, 20px, 0); transform: skew(-0.2deg); }
          80% { clip: rect(2px, 9999px, 70px, 0); transform: skew(0.6deg); }
          100% { clip: rect(35px, 9999px, 10px, 0); transform: skew(-0.3deg); }
        }
        @keyframes glitchAnim2 {
          0% { clip: rect(25px, 9999px, 15px, 0); transform: skew(-0.4deg); }
          25% { clip: rect(60px, 9999px, 35px, 0); transform: skew(0.2deg); }
          50% { clip: rect(5px, 9999px, 80px, 0); transform: skew(-0.6deg); }
          75% { clip: rect(45px, 9999px, 20px, 0); transform: skew(0.5deg); }
          100% { clip: rect(18px, 9999px, 55px, 0); transform: skew(-0.1deg); }
        }

        /* ── HOLOGRAPHIC FOIL ── */
        .ppc-holo-foil {
          position: absolute; inset: 0; z-index: 3; pointer-events: none; border-radius: inherit; overflow: hidden;
          background: linear-gradient(
            115deg,
            transparent 15%,
            rgba(255, 0, 128, 0.14) 30%,
            rgba(0, 230, 255, 0.18) 45%,
            rgba(255, 235, 0, 0.16) 60%,
            rgba(0, 255, 128, 0.14) 75%,
            transparent 90%
          );
          background-size: 200% 200%;
          animation: holoFoilSweep 6s ease-in-out infinite alternate;
          mix-blend-mode: color-dodge;
          opacity: 0.85;
        }
        @keyframes holoFoilSweep {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }

        /* ── LEVITATION FLOAT ── */
        .ppc-levitate {
          animation: levitateAnim 4.8s ease-in-out infinite alternate;
        }
        @keyframes levitateAnim {
          0% { transform: translateY(-8px) rotateX(1.5deg); }
          100% { transform: translateY(8px) rotateX(-1.5deg); }
        }

        /* ── NEON AURA PULSE ── */
        .ppc-card.ppc-neon-pulse {
          animation: neonPulseAnim 3.5s ease-in-out infinite alternate;
        }
        @keyframes neonPulseAnim {
          0% {
            box-shadow:
              0 2px 0 0 rgba(255,255,255,0.07) inset,
              0 -1px 0 0 rgba(0,0,0,0.5) inset,
              0 0 35px rgba(var(--theme-glow), 0.35),
              0 0 70px rgba(var(--theme-glow), 0.18),
              0 48px 96px -24px rgba(0,0,0,0.75);
          }
          100% {
            box-shadow:
              0 2px 0 0 rgba(255,255,255,0.12) inset,
              0 -1px 0 0 rgba(0,0,0,0.5) inset,
              0 0 65px rgba(var(--theme-glow), 0.65),
              0 0 130px rgba(var(--theme-glow), 0.35),
              0 48px 96px -24px rgba(0,0,0,0.75);
          }
        }

        /* ── AVATAR SONAR RIPPLES ── */
        .ppc-av-sonar {
          position: absolute; inset: -20px; border-radius: 50%; z-index: 0; pointer-events: none;
        }
        .ppc-av-sonar-ring {
          position: absolute; inset: 0; border-radius: 50%;
          border: 1.5px solid var(--theme-a);
          animation: sonarExpand 3s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
          opacity: 0;
        }
        .ppc-av-sonar-ring:nth-child(2) { animation-delay: 1s; }
        .ppc-av-sonar-ring:nth-child(3) { animation-delay: 2s; }
        @keyframes sonarExpand {
          0% { transform: scale(0.75); opacity: 0.8; }
          100% { transform: scale(1.7); opacity: 0; }
        }

        /* ── GLINT SHINE SWEEP ── */
        @property --beam-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
        .ppc-shine-sweep {
          position: absolute; inset: 0; z-index: 3; pointer-events: none;
          border-radius: inherit; overflow: hidden;
        }
        .ppc-shine-sweep::before {
          content: ""; position: absolute; top: -20%; left: -70%; width: 45%; height: 140%;
          transform: skewX(-22deg);
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent);
          animation: ppcShineSweep 5.5s ease-in-out infinite;
        }
        @keyframes ppcShineSweep {
          0% { left: -70%; }
          55%, 100% { left: 150%; }
        }

        /* ── BORDER LIGHT BEAM ── */
        .ppc-beam {
          position: absolute; inset: 0; z-index: 3; pointer-events: none;
          border-radius: inherit; padding: 2px;
          background: conic-gradient(from var(--beam-angle),
            transparent 0deg, transparent 295deg,
            var(--theme-a) 330deg, var(--theme-b) 350deg, transparent 360deg);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          animation: ppcBeamSpin 4s linear infinite;
        }
        @keyframes ppcBeamSpin { to { --beam-angle: 360deg; } }

        /* ── TWINKLING STARFIELD ── */
        .ppc-starfield {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          border-radius: inherit; overflow: hidden;
          background-image:
            radial-gradient(1.5px 1.5px at 18% 22%, #fff, transparent),
            radial-gradient(1px 1px at 62% 18%, rgba(255,255,255,0.85), transparent),
            radial-gradient(1.5px 1.5px at 82% 55%, var(--theme-a), transparent),
            radial-gradient(1px 1px at 33% 72%, #fff, transparent),
            radial-gradient(1px 1px at 74% 82%, var(--theme-b), transparent),
            radial-gradient(1.5px 1.5px at 48% 45%, rgba(255,255,255,0.7), transparent),
            radial-gradient(1px 1px at 90% 30%, #fff, transparent),
            radial-gradient(1px 1px at 10% 60%, rgba(255,255,255,0.7), transparent);
          background-repeat: no-repeat;
          animation: ppcTwinkle 3.6s ease-in-out infinite alternate;
        }
        @keyframes ppcTwinkle { 0% { opacity: 0.35; } 100% { opacity: 1; } }

        @media (prefers-reduced-motion: reduce) {
          .ppc-shine-sweep::before, .ppc-beam, .ppc-starfield { animation: none; }
        }

        /* ── CRT SCANLINES ── */
        .ppc-scanlines {
          position: absolute; inset: 0; z-index: 3; pointer-events: none; border-radius: inherit; overflow: hidden;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.25),
            rgba(0, 0, 0, 0.25) 1px,
            transparent 1px,
            transparent 3px
          );
          opacity: 0.6;
        }
        .ppc-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 20px; margin-bottom: 26px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem; color: #3d4f66; letter-spacing: 0.14em; text-transform: uppercase;
          position: relative; z-index: 1;
        }
        .ppc-badge-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--theme-a); box-shadow: 0 0 7px var(--theme-a);
          animation: blink 2.4s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

        /* ── INDIVIDUAL BUTTON BOXES ── */
        .ppc-btn-wrap {
          display: flex; flex-direction: column; gap: 16px;
          position: relative; z-index: 1;
        }

        /* each button is its own frosted box */
        .ppc-btn {
          display: flex; align-items: center; gap: 14px;
          width: 100%; padding: 13px 14px; border-radius: 18px;
          text-decoration: none;
          position: relative; overflow: hidden;
          /* individual blur box */
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.055), 0 4px 16px rgba(0,0,0,0.25);
          transition: all 0.28s cubic-bezier(0.34,1.56,0.64,1);
        }
        .ppc-btn::before {
          content: ""; position: absolute; top: 0; left: 10%; right: 10%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          pointer-events: none;
        }
        .ppc-btn:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(var(--theme-glow),0.3);
          transform: translateY(-2px) scale(1.01);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.08),
            0 10px 32px rgba(0,0,0,0.4),
            0 0 0 1px rgba(var(--theme-glow),0.14);
        }
        .ppc-btn:active { transform: translateY(0) scale(0.99); }

        /* ── LIQUID HOVER EFFECT ── */
        .ppc-btn-liquid {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          border-radius: 18px; z-index: 0;
          opacity: 0; transition: opacity 0.4s ease;
          pointer-events: none; overflow: hidden;
        }
        .ppc-btn:hover .ppc-btn-liquid { opacity: 1; }
        
        .ppc-btn-liquid::before, .ppc-btn-liquid::after {
          content: ""; position: absolute;
          width: 500px; height: 500px;
          top: 50%; left: 50%;
        }
        .ppc-btn-liquid::before {
          border-radius: 43%;
          background: rgba(var(--theme-glow), 0.12);
          animation: liquid-wave 7s linear infinite;
        }
        .ppc-btn-liquid::after {
          border-radius: 38%;
          background: rgba(var(--theme-glow), 0.18);
          animation: liquid-wave 11s linear infinite;
        }
        @keyframes liquid-wave {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        /* shimmer */
        .ppc-btn::after {
          content: ""; position: absolute; top: 0; left: -60%; width: 40%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
          transition: left 0.5s ease; pointer-events: none; z-index: 1;
        }
        .ppc-btn:hover::after { left: 130%; }

        /* ── ICON ── */
        .ppc-icon {
          width: 44px; height: 44px; flex-shrink: 0; border-radius: 13px;
          display: flex; align-items: center; justify-content: center; font-size: 1.15rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2);
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
          position: relative; overflow: hidden;
        }
        .ppc-icon::after {
          content: ""; position: absolute; top: 0; left: 0; right: 0; height: 46%;
          background: rgba(255,255,255,0.13); border-radius: 13px 13px 0 0;
        }
        .ppc-btn:hover .ppc-icon { transform: scale(1.1) rotate(-5deg); }

        .ppc-btn-label {
          font-weight: 700; color: #e2e8f0;
          font-size: 0.92rem; display: block; letter-spacing: -0.01em;
        }
        .ppc-btn-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem; color: #334155; display: block; margin-top: 2px;
          letter-spacing: 0.02em;
        }

        .ppc-arrow {
          margin-left: auto; flex-shrink: 0; width: 28px; height: 28px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          color: #1e2d3d; font-size: 0.85rem;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
          transition: all 0.28s cubic-bezier(0.34,1.56,0.64,1);
        }
        .ppc-btn:hover .ppc-arrow {
          color: var(--theme-a); background: rgba(var(--theme-glow),0.1);
          border-color: rgba(var(--theme-glow),0.3); transform: translate(2px,-2px) rotate(-30deg);
        }

        /* ── DIVIDER ── */
        .ppc-divider {
          display: flex; align-items: center; gap: 10px;
          margin: 14px 0 8px; position: relative; z-index: 1;
        }
        .ppc-div-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent); }
        .ppc-div-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.58rem; color: #1a2535; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 600;
        }

        /* ── FOOTER ── */
        .ppc-footer {
          margin-top: 24px; padding: 14px; border-radius: 14px;
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04);
          display: flex; align-items: center; justify-content: center; gap: 8px;
          position: relative; z-index: 1;
        }
        .ppc-footer-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.58rem; color: #1a2535; letter-spacing: 0.14em; text-transform: uppercase;
        }
        .ppc-footer-brand {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.58rem; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 700;
          background: linear-gradient(90deg, var(--theme-a), var(--theme-b));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          text-decoration: none;
        }

        /* ── QR MODAL ── */
        .qr-overlay {
          position: fixed; inset: 0; z-index: 999;
          background: rgba(0,0,0,0.76);
          backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          display: flex; align-items: center; justify-content: center; padding: 24px;
        }
        .qr-modal {
          position: relative; width: 100%; max-width: 320px;
          border-radius: 26px; padding: 30px 26px 26px;
          background: rgba(9, 12, 22, 0.88);
          backdrop-filter: blur(44px) saturate(150%); -webkit-backdrop-filter: blur(44px) saturate(150%);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 2px 0 rgba(255,255,255,0.07) inset, 0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,0,0,0.5);
          text-align: center;
        }
        .qr-modal::before {
          content: ""; position: absolute; top: 0; left: 15%; right: 15%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        }
        .qr-modal-glow {
          position: absolute; inset: 0; border-radius: 26px; pointer-events: none;
          background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(var(--theme-glow),0.13) 0%, transparent 60%);
        }
        .qr-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.2rem; font-weight: 800; color: #fff;
          margin-bottom: 5px; position: relative; z-index: 1; letter-spacing: -0.02em;
        }
        .qr-subtitle {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem; color: #334155; margin-bottom: 22px;
          word-break: break-all; line-height: 1.6; position: relative; z-index: 1;
        }
        .qr-code-wrap {
          display: inline-block; background: #fff;
          padding: 12px; border-radius: 14px;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.4);
          position: relative; z-index: 1;
        }
        .qr-actions {
          display: flex; gap: 9px; margin-top: 22px; position: relative; z-index: 1;
        }
        .qr-btn-copy {
          flex: 1; padding: 11px 0; border-radius: 12px; border: none; cursor: pointer;
          font-family: 'Outfit', sans-serif; font-size: 0.8rem; font-weight: 700;
          background: linear-gradient(135deg, var(--theme-a), var(--theme-b)); color: #fff;
          transition: all 0.2s; letter-spacing: 0.02em;
          box-shadow: 0 4px 14px rgba(var(--theme-glow),0.35);
        }
        .qr-btn-copy:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(var(--theme-glow),0.45); }
        .qr-btn-close {
          flex: 1; padding: 11px 0; border-radius: 12px; cursor: pointer;
          font-family: 'Outfit', sans-serif; font-size: 0.8rem; font-weight: 600;
          background: rgba(255,255,255,0.05); color: #4a5568;
          border: 1px solid rgba(255,255,255,0.08); transition: all 0.2s;
        }
        .qr-btn-close:hover { background: rgba(255,255,255,0.09); color: #94a3b8; }

        @media (max-width: 480px) {
          .ppc-card { padding: 36px 16px 28px; border-radius: 24px; }
          .ppc-name { font-size: 1.9rem; }
          .ppc-av-wrap { width: 106px; height: 106px; }
        }
      `}</style>

      <div className="ppc-shell" style={{
        "--theme-a": t.a,
        "--theme-b": t.b,
        "--theme-glow": t.glow,
      } as React.CSSProperties}>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={profile.gradientBorder ? "ppc-gb-wrap" : undefined}>
          <div
            className={`ppc-card ${profile.levitationFloat ? "ppc-levitate" : ""} ${profile.neonPulse ? "ppc-neon-pulse" : ""}`}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={profile.tiltEffect && !profile.levitationFloat ? ({ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` } as React.CSSProperties) : undefined}
          >
            <div className="ppc-card-glow" />
            {profile.starfield && <div className="ppc-starfield" />}
            {profile.holographicFoil && <div className="ppc-holo-foil" />}
            {profile.scanlineEffect && <div className="ppc-scanlines" />}
            {profile.shineSweep && <div className="ppc-shine-sweep" />}
            {profile.borderBeam && <div className="ppc-beam" />}
            {profile.cursorSpotlight && (
              <div
                className="ppc-spotlight"
                style={{ "--spot-x": `${spotPos.x}%`, "--spot-y": `${spotPos.y}%` } as React.CSSProperties}
              />
            )}
            {profile.particlesEffect && (
              <div className="ppc-particles">
                {particles.map((p, i) => (
                  <span
                    key={i}
                    className="ppc-particle"
                    style={{
                      left: `${p.left}%`,
                      top: `${p.top}%`,
                      width: p.size,
                      height: p.size,
                      animationDelay: `${p.delay}s`,
                      animationDuration: `${p.duration}s`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* QR BUTTON — actual QR grid icon */}
            <button className="ppc-qr-btn" onClick={() => setIsQrOpen(true)} title="Show QR Code">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="2" width="4" height="4" rx="0.5" />
                <rect x="7" y="2" width="2" height="2" rx="0.5" />
                <rect x="10" y="2" width="4" height="4" rx="0.5" />
                <rect x="2" y="7" width="2" height="2" rx="0.5" />
                <rect x="2" y="10" width="4" height="4" rx="0.5" />
                <rect x="7" y="10" width="2" height="4" rx="0.5" />
                <rect x="10" y="7" width="4" height="2" rx="0.5" />
                <rect x="10" y="10" width="2" height="4" rx="0.5" />
                <rect x="13" y="13" width="2" height="2" rx="0.5" />
                <rect x="16" y="2" width="6" height="6" rx="0.5" fillOpacity="0" stroke="currentColor" strokeWidth="1.8" />
                <rect x="18" y="4" width="2" height="2" rx="0.5" />
                <rect x="16" y="16" width="6" height="6" rx="0.5" fillOpacity="0" stroke="currentColor" strokeWidth="1.8" />
                <rect x="18" y="18" width="2" height="2" rx="0.5" />
                <rect x="2" y="16" width="6" height="6" rx="0.5" fillOpacity="0" stroke="currentColor" strokeWidth="1.8" />
                <rect x="4" y="18" width="2" height="2" rx="0.5" />
              </svg>
            </button>

            <motion.div variants={container} initial="hidden" animate="visible">

              {/* AVATAR */}
              <motion.div variants={item} className="ppc-av-wrap">
                {profile.sonarPulse && (
                  <div className="ppc-av-sonar">
                    <div className="ppc-av-sonar-ring" />
                    <div className="ppc-av-sonar-ring" />
                    <div className="ppc-av-sonar-ring" />
                  </div>
                )}
                <div className="ppc-av-ring-blur" />
                <div className="ppc-av-ring" />
                <div className="ppc-av-bg" />
                <div className="ppc-av-inner">
                  {profile.photoUrl
                    ? <img src={profile.photoUrl} alt={profile.name} className="ppc-av-img" />
                    : <div className="ppc-av-init">{profile.name?.charAt(0) || "?"}</div>}
                </div>
              </motion.div>

              {/* NAME / ROLE */}
              <motion.div variants={item} style={{ textAlign: "center" }}>
                <h1 className={`ppc-name ${profile.cyberGlitch ? "ppc-glitch" : ""}`} data-text={profile.name}>
                  {profile.name}
                </h1>
                {profile.role && (
                  <p className={`ppc-role ${profile.cyberGlitch ? "ppc-glitch" : ""}`} data-text={profile.role}>
                    {profile.role}
                  </p>
                )}
                <div className="ppc-badge"><span className="ppc-badge-dot" />available for work</div>
              </motion.div>

              {/* SOCIAL LINKS AND CUSTOM LINKS */}
              {(socials.length > 0 || (profile.customLinks && profile.customLinks.length > 0)) && (
                <motion.div variants={item} className="ppc-btn-wrap">
                  {socials.map(({ key, href, sub }) => {
                    const s = SOCIAL[key];
                    return <Btn key={key} href={href} grad={s.grad} icon={s.icon} label={s.label} sub={sub ?? s.sub} />;
                  })}
                  {profile.customLinks?.map((link) => (
                    <Btn
                      key={link.id}
                      href={link.url}
                      grad="linear-gradient(145deg, #64748b, #334155)"
                      icon={<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"></path></svg>}
                      label={link.title}
                      sub="Link"
                    />
                  ))}
                </motion.div>
              )}

              {/* EMAIL */}
              {profile.gmail && (
                <motion.div variants={item}>
                  <div className="ppc-divider">
                    <div className="ppc-div-line" />
                    <span className="ppc-div-text">direct contact</span>
                    <div className="ppc-div-line" />
                  </div>
                  <div className="ppc-btn-wrap">
                    <Btn
                      href={`mailto:${profile.gmail}?subject=Contact%20${encodeURIComponent(profile.name)}`}
                      grad={SOCIAL.gmail.grad} icon={SOCIAL.gmail.icon}
                      label={SOCIAL.gmail.label} sub={profile.gmail}
                    />
                  </div>
                </motion.div>
              )}

              {/* FOOTER */}
              <motion.div variants={item} className="ppc-footer">
                <span className="ppc-footer-label">powered by</span>
                <a href="https://megadevs.site" className="ppc-footer-brand">MEGA DEVS</a>
              </motion.div>

            </motion.div>
          </div>
          </div>
        </motion.div>
      </div>

      {/* QR MODAL */}
      <AnimatePresence>
        {isQrOpen && (
          <motion.div
            className="qr-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsQrOpen(false)}
          >
            <motion.div
              className="qr-modal"
              initial={{ scale: 0.88, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.88, y: 24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="qr-modal-glow" />
              <p className="qr-title">Scan to Visit</p>
              <p className="qr-subtitle">{currentUrl}</p>
              <div className="qr-code-wrap">
                <QRCodeCanvas
                  value={currentUrl || "https://megadevs.site"}
                  size={184}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                />
              </div>
              <div className="qr-actions">
                <button className="qr-btn-copy" onClick={handleCopy}>
                  {copied ? "✓ Copied!" : "Copy Link"}
                </button>
                <button className="qr-btn-close" onClick={() => setIsQrOpen(false)}>Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Btn({ href, grad, icon, label, sub }: { href: string; grad: string; icon: React.ReactNode; label: string; sub: string }) {
  return (
    <motion.a href={safeUrl(href)} target="_blank" rel="noopener noreferrer" whileTap={{ scale: 0.97 }} className="ppc-btn">
      <div className="ppc-btn-liquid" />
      <div className="ppc-icon" style={{ background: grad, position: "relative", zIndex: 2 }}>{icon}</div>
      <div style={{ flex: 1, textAlign: "left", position: "relative", zIndex: 2 }}>
        <span className="ppc-btn-label">{label}</span>
        {sub && <span className="ppc-btn-sub">{sub}</span>}
      </div>
      <div className="ppc-arrow" style={{ position: "relative", zIndex: 2 }}>↗</div>
    </motion.a>
  );
}