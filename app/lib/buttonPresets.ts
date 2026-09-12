// Button style presets for the builder. Each preset only sets *look* fields —
// applying one keeps the element's label, link, font, size and position.

export interface ButtonPreset {
  id: string;
  label: string;
  category: "Solid" | "Gradient" | "Outline" | "Glass" | "Neon" | "3D" | "Animated" | "Minimal";
  style: Record<string, any>;
}

// Common defaults filled in so nothing is undefined at render time.
const base = {
  border: "none",
  boxShadow: "none",
  textShadow: "none",
  letterSpacing: 0,
  textTransform: "none",
  backdropBlur: 0,
  animClass: "",
  fontWeight: 700,
};

const P = (
  id: string,
  label: string,
  category: ButtonPreset["category"],
  style: Record<string, any>
): ButtonPreset => ({ id, label, category, style: { ...base, ...style } });

export const BUTTON_PRESETS: ButtonPreset[] = [
  // ── Solid ──
  P("solid-indigo", "Indigo", "Solid", { bg: "#6366f1", color: "#fff", radius: 12, boxShadow: "0 8px 20px rgba(99,102,241,0.4)" }),
  P("solid-black", "Ink", "Solid", { bg: "#0f0f12", color: "#fff", radius: 10 }),
  P("solid-white", "Snow", "Solid", { bg: "#ffffff", color: "#0f0f12", radius: 10, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }),
  P("solid-rose", "Rose", "Solid", { bg: "#f43f5e", color: "#fff", radius: 12, boxShadow: "0 8px 20px rgba(244,63,94,0.4)" }),
  P("solid-emerald", "Emerald", "Solid", { bg: "#10b981", color: "#052e23", radius: 12, boxShadow: "0 8px 20px rgba(16,185,129,0.4)" }),
  P("solid-amber", "Amber", "Solid", { bg: "#f59e0b", color: "#3a2606", radius: 12, boxShadow: "0 8px 20px rgba(245,158,11,0.4)" }),

  // ── Gradient ──
  P("grad-violet", "Violet Dusk", "Gradient", { bg: "linear-gradient(135deg,#6366f1,#a855f7)", color: "#fff", radius: 14, boxShadow: "0 10px 26px rgba(139,92,246,0.45)" }),
  P("grad-sunset", "Sunset", "Gradient", { bg: "linear-gradient(135deg,#f97316,#ec4899)", color: "#fff", radius: 14, boxShadow: "0 10px 26px rgba(236,72,153,0.4)" }),
  P("grad-ocean", "Ocean", "Gradient", { bg: "linear-gradient(135deg,#06b6d4,#3b82f6)", color: "#fff", radius: 14, boxShadow: "0 10px 26px rgba(59,130,246,0.4)" }),
  P("grad-emerald", "Mint", "Gradient", { bg: "linear-gradient(135deg,#34d399,#0d9488)", color: "#04231c", radius: 14 }),
  P("grad-fire", "Fire", "Gradient", { bg: "linear-gradient(135deg,#ef4444,#f59e0b)", color: "#fff", radius: 14, boxShadow: "0 10px 26px rgba(239,68,68,0.4)" }),
  P("grad-aurora", "Aurora", "Gradient", { bg: "linear-gradient(135deg,#22d3ee,#818cf8,#e879f9)", color: "#fff", radius: 14 }),
  P("grad-candy", "Candy", "Gradient", { bg: "linear-gradient(135deg,#ec4899,#8b5cf6)", color: "#fff", radius: 999, boxShadow: "0 10px 26px rgba(168,85,247,0.4)" }),
  P("grad-gold", "Royal Gold", "Gradient", { bg: "linear-gradient(135deg,#facc15,#f97316)", color: "#3a2606", radius: 12, fontWeight: 800 }),

  // ── Outline ──
  P("out-white", "Outline White", "Outline", { bg: "transparent", color: "#ffffff", radius: 12, border: "2px solid rgba(255,255,255,0.85)" }),
  P("out-indigo", "Outline Indigo", "Outline", { bg: "transparent", color: "#6366f1", radius: 12, border: "2px solid #6366f1" }),
  P("out-pill", "Outline Pill", "Outline", { bg: "transparent", color: "#ffffff", radius: 999, border: "1.5px solid rgba(255,255,255,0.6)", letterSpacing: 1 }),
  P("out-thick", "Bold Border", "Outline", { bg: "#0f0f12", color: "#fff", radius: 12, border: "3px solid #6366f1" }),

  // ── Glass ──
  P("glass-light", "Glass Light", "Glass", { bg: "rgba(255,255,255,0.14)", color: "#fff", radius: 14, border: "1px solid rgba(255,255,255,0.35)", backdropBlur: 10, boxShadow: "0 8px 30px rgba(0,0,0,0.25)" }),
  P("glass-dark", "Glass Dark", "Glass", { bg: "rgba(10,10,15,0.35)", color: "#fff", radius: 14, border: "1px solid rgba(255,255,255,0.12)", backdropBlur: 12 }),
  P("glass-frost", "Frost Pill", "Glass", { bg: "rgba(255,255,255,0.1)", color: "#fff", radius: 999, border: "1px solid rgba(255,255,255,0.25)", backdropBlur: 8 }),

  // ── Neon ──
  P("neon-cyan", "Neon Cyan", "Neon", { bg: "rgba(6,182,212,0.08)", color: "#22d3ee", radius: 12, border: "2px solid #22d3ee", boxShadow: "0 0 18px rgba(34,211,238,0.7), inset 0 0 12px rgba(34,211,238,0.25)", textShadow: "0 0 8px rgba(34,211,238,0.8)", animClass: "btn-neon" }),
  P("neon-pink", "Neon Pink", "Neon", { bg: "rgba(236,72,153,0.08)", color: "#f472b6", radius: 12, border: "2px solid #ec4899", boxShadow: "0 0 18px rgba(236,72,153,0.7), inset 0 0 12px rgba(236,72,153,0.25)", textShadow: "0 0 8px rgba(236,72,153,0.8)", animClass: "btn-neon" }),
  P("neon-green", "Neon Lime", "Neon", { bg: "rgba(132,204,22,0.08)", color: "#a3e635", radius: 12, border: "2px solid #84cc16", boxShadow: "0 0 18px rgba(132,204,22,0.7)", textShadow: "0 0 8px rgba(163,230,53,0.8)", animClass: "btn-neon" }),

  // ── 3D ──
  P("d3-indigo", "3D Indigo", "3D", { bg: "#6366f1", color: "#fff", radius: 14, boxShadow: "0 6px 0 #3730a3", fontWeight: 800 }),
  P("d3-amber", "3D Amber", "3D", { bg: "#f59e0b", color: "#3a2606", radius: 14, boxShadow: "0 6px 0 #b45309", fontWeight: 800 }),
  P("d3-rose", "3D Rose", "3D", { bg: "#f43f5e", color: "#fff", radius: 14, boxShadow: "0 6px 0 #9f1239", fontWeight: 800 }),

  // ── Animated ──
  P("anim-shine", "Shine Sweep", "Animated", { bg: "linear-gradient(135deg,#6366f1,#a855f7)", color: "#fff", radius: 14, boxShadow: "0 10px 26px rgba(139,92,246,0.45)", animClass: "btn-shine" }),
  P("anim-gradient", "Living Gradient", "Animated", { bg: "linear-gradient(90deg,#22d3ee,#818cf8,#e879f9,#22d3ee)", color: "#fff", radius: 14, animClass: "btn-gradient-move" }),
  P("anim-pulse", "Pulse Glow", "Animated", { bg: "#6366f1", color: "#fff", radius: 999, boxShadow: "0 0 22px rgba(99,102,241,0.8)", animClass: "btn-pulse" }),

  // ── Minimal ──
  P("min-soft", "Soft Pastel", "Minimal", { bg: "#e0e7ff", color: "#4338ca", radius: 12 }),
  P("min-ghost", "Ghost", "Minimal", { bg: "transparent", color: "#ffffff", radius: 8, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }),
  P("min-elevated", "Slate Card", "Minimal", { bg: "#1f2937", color: "#e5e7eb", radius: 12, boxShadow: "0 6px 18px rgba(0,0,0,0.4)" }),
];

export const BUTTON_PRESET_CATEGORIES: ButtonPreset["category"][] = [
  "Solid", "Gradient", "Outline", "Glass", "Neon", "3D", "Animated", "Minimal",
];
