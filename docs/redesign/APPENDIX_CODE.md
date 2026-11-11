# APPENDIX_CODE — verbatim sources for Stage 2

Copy each file **exactly**, then configure through props/CSS per `CLAUDE_REDESIGN_PROMPT.md` §5 (StaggeredMenu edits in §5.6 are the only allowed source changes).

Components not embedded here come from the official React Bits registry (TypeScript + Tailwind):
- `npx shadcn@latest add https://reactbits.dev/r/StaggeredMenu-TS-TW`
- `npx shadcn@latest add https://reactbits.dev/r/AnimatedContent-TS-TW`
- `npx shadcn@latest add https://reactbits.dev/r/LogoLoop-TS-TW`

(If shadcn CLI isn't initialised, use `npx jsrepo@latest add <url>`, or download the source from each component's reactbits.dev page.)

## Agents (`.claude/agents/*.md`)

```markdown
---
name: token-auditor
description: Read-only. Finds hard-coded colors, blur values, radii, breakpoints and font-family literals that must use tokens — including demo colors left in React Bits components.
tools: Read, Grep, Glob
model: sonnet
---
Report file:line for every literal hex/rgb, backdrop-filter, border-radius, @media width and font-family outside app/styles/tokens.css. Flag especially #5227FF, #B497CF, #525252, #f5f5f5, bg-white, text-black inside app/components/reactbits/. Never edit.
```
```markdown
---
name: a11y-reviewer
description: Read-only WCAG 2.2 AA review of changed components (focus, ARIA, contrast, RTL, reduced motion).
tools: Read, Grep, Glob, Bash
model: sonnet
---
Check git diff against REDESIGN_BLUEPRINT.md §6 and this prompt's Phase 5B notes. List violations with file:line and a fix. Never edit.
```
```markdown
---
name: icon-migrator
description: Replaces react-icons and glyph icons with Solar per docs/redesign/ICON_MIGRATION_MAP.md, including i18n key splitting.
tools: Read, Edit, Grep, Glob, Bash
model: sonnet
---
Follow ICON_MIGRATION_MAP.md exactly. Verify each name in node_modules/@solar-icons/react/dist/icons/style/linear.d.mts before importing. When removing a glyph from an i18n key, update both the EN key and the AR value. Run npm run build at the end.
```
```markdown
---
name: visual-regression
description: Builds and screenshots key routes in both themes, EN/AR, desktop/mobile.
tools: Bash, Read
model: sonnet
---
npm run build && npm start; capture /, /works, /history, /palestine, /login, /dashboard at 1440 and 390, dark/light, en/ar. Compare with docs/redesign/baseline/. Report diffs.
```

## `app/components/LiquidGlass.tsx`

```tsx
'use client';

/**
 * LiquidGlass — refractive glass *material* for UI surfaces (nav, palette, dialogs, cards).
 *
 * Ports the look of the FluidGlass shader (lens-profile refraction at the edges,
 * RGB dispersion, fresnel rim light) to the live page behind an element, using
 * `backdrop-filter: url(#svg-filter)` with a generated displacement map.
 *
 *  - Chromium: real refraction + dispersion of whatever is behind the element.
 *  - Safari / Firefox / reduced-transparency / increased-contrast: falls back to
 *    a tuned blur glass (backdrop-filter url() is Chromium-only).
 */

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode
} from 'react';

export type GlassVariant = 'nav' | 'primary' | 'floating' | 'modal' | 'interactive' | 'subtle';

interface VariantSpec {
  bevel: number; // px width of the curved edge that bends light
  refraction: number; // max displacement in px at the very edge
  dispersion: number; // 0..1 chromatic split between R/G/B
  blur: number; // px frost applied on top of refraction
  saturate: number; // %
  fallbackBlur: number; // px blur used where refraction is unsupported
}

export const GLASS_VARIANTS: Record<GlassVariant, VariantSpec> = {
  nav: { bevel: 16, refraction: 22, dispersion: 0.35, blur: 1.5, saturate: 170, fallbackBlur: 24 },
  primary: { bevel: 22, refraction: 18, dispersion: 0.2, blur: 4, saturate: 150, fallbackBlur: 20 },
  floating: { bevel: 12, refraction: 16, dispersion: 0.3, blur: 2, saturate: 170, fallbackBlur: 16 },
  modal: { bevel: 26, refraction: 30, dispersion: 0.4, blur: 6, saturate: 180, fallbackBlur: 32 },
  interactive: { bevel: 10, refraction: 14, dispersion: 0.25, blur: 1, saturate: 160, fallbackBlur: 12 },
  subtle: { bevel: 8, refraction: 8, dispersion: 0, blur: 0, saturate: 130, fallbackBlur: 0 }
};

export interface LiquidGlassProps {
  as?: ElementType;
  variant?: GlassVariant;
  radius?: number;
  bevel?: number;
  refraction?: number;
  dispersion?: number;
  blur?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  [key: string]: unknown;
}

const MAX_MAP_PIXELS = 1.2e6;
let supportCache: boolean | null = null;

/** backdrop-filter: url() only renders in Chromium. */
function supportsRefraction(): boolean {
  if (supportCache !== null) return supportCache;
  if (typeof window === 'undefined') return false;
  const nav = navigator as Navigator & { userAgentData?: { brands?: { brand: string }[] } };
  const chromium =
    nav.userAgentData?.brands?.some(b => /Chromium/i.test(b.brand)) ??
    /Chrome\/|Chromium\//.test(navigator.userAgent); // Edge & Opera are Chromium too
  const css = typeof CSS !== 'undefined' && CSS.supports('backdrop-filter', 'url(#a)');
  const reduce =
    window.matchMedia('(prefers-reduced-transparency: reduce)').matches ||
    window.matchMedia('(prefers-contrast: more)').matches;
  supportCache = Boolean(chromium && css && !reduce);
  return supportCache;
}

/**
 * Displacement map from a rounded-rect SDF. Inside the bevel the surface is a
 * convex lens (same idea as the shader's `lens` shape): light is pushed toward the
 * centre, strongest at the rim, zero on the flat top. R = x offset, G = y offset.
 */
function buildMap(width: number, height: number, radius: number, bevel: number): string {
  const scale = Math.min(1, Math.sqrt(MAX_MAP_PIXELS / (width * height)));
  const w = Math.max(2, Math.round(width * scale));
  const h = Math.max(2, Math.round(height * scale));
  const r = Math.min(radius, width / 2, height / 2) * scale;
  const b = Math.max(1, bevel * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  const img = ctx.createImageData(w, h);
  const hw = w / 2;
  const hh = h / 2;

  const sdf = (px: number, py: number) => {
    const qx = Math.abs(px - hw) - (hw - r);
    const qy = Math.abs(py - hh) - (hh - r);
    const ox = Math.max(qx, 0);
    const oy = Math.max(qy, 0);
    return Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - r;
  };

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      const d = sdf(px, py); // negative inside
      let dx = 0;
      let dy = 0;
      if (d < 0 && d > -b) {
        // Normal = SDF gradient (central differences).
        let nx = sdf(px + 1, py) - sdf(px - 1, py);
        let ny = sdf(px, py + 1) - sdf(px, py - 1);
        const len = Math.hypot(nx, ny) || 1;
        nx /= len;
        ny /= len;
        // Lens profile: 1 at the rim → 0 at bevel end, eased like a circular cap.
        const t = 1 + d / b; // 1 at edge, 0 at inner bevel edge
        const strength = 1 - Math.sqrt(1 - t * t);
        dx = -nx * strength;
        dy = -ny * strength;
      }
      const i = (y * w + x) * 4;
      img.data[i] = Math.round(128 + dx * 127);
      img.data[i + 1] = Math.round(128 + dy * 127);
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL('image/png');
}

export default function LiquidGlass({
  as: Tag = 'div',
  variant = 'primary',
  radius = 24,
  bevel,
  refraction,
  dispersion,
  blur,
  className = '',
  style,
  children,
  ...rest
}: LiquidGlassProps) {
  const spec = GLASS_VARIANTS[variant];
  const p = {
    bevel: bevel ?? spec.bevel,
    refraction: refraction ?? spec.refraction,
    dispersion: dispersion ?? spec.dispersion,
    blur: blur ?? spec.blur
  };
  const rawId = useId();
  const filterId = `lg-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const ref = useRef<HTMLElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [map, setMap] = useState<{ url: string; w: number; h: number } | null>(null);

  useEffect(() => {
    setEnabled(supportsRefraction() && p.refraction > 0);
  }, [p.refraction]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const { width, height } = el.getBoundingClientRect();
        if (width < 2 || height < 2) return;
        const w = Math.round(width);
        const h = Math.round(height);
        setMap(prev =>
          prev && prev.w === w && prev.h === h ? prev : { url: buildMap(w, h, radius, p.bevel), w, h }
        );
      });
    };
    const observer = new ResizeObserver(update);
    observer.observe(el);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [enabled, radius, p.bevel]);

  // Map changed geometry → force a rebuild even if size stayed the same.
  useEffect(() => setMap(null), [radius, p.bevel]);

  const live = enabled && map;
  const split = p.refraction * p.dispersion * 0.18;
  const backdrop = live
    ? `url(#${filterId}) blur(${p.blur}px) saturate(${spec.saturate}%)`
    : spec.fallbackBlur
      ? `blur(${spec.fallbackBlur}px) saturate(${spec.saturate}%)`
      : 'none';

  return (
    <Tag
      ref={ref}
      className={`liquid-glass liquid-glass--${variant}${live ? ' is-refracting' : ''} ${className}`.trim()}
      style={{
        ...style,
        borderRadius: radius,
        backdropFilter: backdrop,
        WebkitBackdropFilter: backdrop
      }}
      {...rest}
    >
      {live ? (
        <svg aria-hidden="true" width="0" height="0" style={{ position: 'absolute', overflow: 'hidden' }}>
          <filter
            id={filterId}
            x="0"
            y="0"
            width={map.w}
            height={map.h}
            filterUnits="userSpaceOnUse"
            primitiveUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feImage href={map.url} x="0" y="0" width={map.w} height={map.h} preserveAspectRatio="none" result="map" />
            {/* One displacement per channel → chromatic dispersion, like the shader's R/G/B IOR spread. */}
            <feDisplacementMap in="SourceGraphic" in2="map" scale={p.refraction + split} xChannelSelector="R" yChannelSelector="G" result="dr" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale={p.refraction} xChannelSelector="R" yChannelSelector="G" result="dg" />
            <feDisplacementMap in="SourceGraphic" in2="map" scale={Math.max(0, p.refraction - split)} xChannelSelector="R" yChannelSelector="G" result="db" />
            <feColorMatrix in="dr" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
            <feColorMatrix in="dg" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
            <feColorMatrix in="db" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
            <feComposite in="r" in2="g" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="rg" />
            <feComposite in="rg" in2="b" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
          </filter>
        </svg>
      ) : null}
      {children}
    </Tag>
  );
}
```

## `app/styles/liquid-glass.css`

```css
/* Liquid Glass material — tint, border light, fresnel rim, specular sheen.
   Refraction itself comes from LiquidGlass.tsx (backdrop-filter url()). */

.liquid-glass {
  --lg-tint: rgb(18 17 22 / .42);
  --lg-edge: rgb(255 255 255 / .22);
  --lg-edge-dim: rgb(255 255 255 / .04);
  --lg-rim: rgb(255 255 255 / .16);
  --lg-accent: color-mix(in oklab, var(--accent, #ef4444) 10%, transparent);
  position: relative;
  isolation: isolate;
  background: linear-gradient(180deg, var(--lg-accent), transparent 60%), var(--lg-tint);
  box-shadow:
    inset 0 1px 0 var(--lg-rim),            /* top specular line */
    inset 0 -1px 0 rgb(0 0 0 / .25),
    var(--lg-shadow, 0 2px 6px rgb(0 0 0 / .25), 0 24px 48px -16px rgb(0 0 0 / .5));
}
[data-theme="light"] .liquid-glass {
  --lg-tint: rgb(250 248 242 / .5);
  --lg-edge: rgb(255 255 255 / .9);
  --lg-edge-dim: rgb(17 16 16 / .06);
  --lg-rim: rgb(255 255 255 / .85);
  --lg-shadow: 0 2px 6px rgb(60 40 20 / .08), 0 24px 48px -16px rgb(60 40 20 / .18);
}

/* Gradient border that catches light (mask technique). */
.liquid-glass::before {
  content: "";
  position: absolute; inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(160deg, var(--lg-edge), var(--lg-edge-dim) 40%, var(--lg-edge-dim) 70%, var(--lg-edge));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  pointer-events: none;
  z-index: 1;
}

/* Fresnel-style rim glow + soft sheen (the shader's rimLight / studio highlight). */
.liquid-glass::after {
  content: "";
  position: absolute; inset: 0;
  border-radius: inherit;
  background:
    radial-gradient(120% 60% at 20% -10%, rgb(255 255 255 / .14), transparent 55%),
    radial-gradient(80% 50% at 110% 120%, rgb(255 255 255 / .06), transparent 60%);
  box-shadow: inset 0 0 18px rgb(255 255 255 / .05);
  pointer-events: none;
  z-index: 1;
}
.liquid-glass > :not(svg) { position: relative; z-index: 2; }

/* Without real refraction the tint must carry legibility on its own. */
.liquid-glass:not(.is-refracting) { --lg-tint: rgb(18 17 22 / .62); }
[data-theme="light"] .liquid-glass:not(.is-refracting) { --lg-tint: rgb(250 248 242 / .72); }

.liquid-glass--modal  { --lg-tint: rgb(16 15 20 / .55); }
.liquid-glass--subtle { --lg-tint: rgb(255 255 255 / .04); box-shadow: none; }
.liquid-glass--subtle::after { display: none; }

.liquid-glass--interactive { transition: transform var(--dur-fast, 160ms) var(--ease-out, ease), box-shadow var(--dur-fast, 160ms); }
.liquid-glass--interactive:hover  { --lg-rim: rgb(255 255 255 / .28); }
.liquid-glass--interactive:active { transform: scale(.97); }

/* Accessibility & perf fallbacks */
@media (prefers-contrast: more) {
  .liquid-glass { background: var(--panel, #111015) !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
  .liquid-glass::after { display: none; }
}
@media (hover: none) and (pointer: coarse) {
  .liquid-glass--primary, .liquid-glass--floating { --lg-tint: rgb(18 17 22 / .78); }
}
```

## `app/components/SwimmingGlass.tsx`

```tsx
'use client';

import { useEffect, useState } from 'react';
import FluidGlass from './FluidGlass';

/**
 * A single 60px glass orb that slowly swims around the viewport.
 * Not a cursor follower: interaction is "static", pointer events are off,
 * and the path is a slow Lissajous curve fed into FluidGlass's `position`
 * (FluidGlass springs toward it, which gives the "swimming" motion).
 */
const TICK_MS = 120; // how often the target moves; the spring smooths between ticks
const SPEED = 0.045; // radians per second along the path → one lap ≈ 2–3 min

export default function SwimmingGlass() {
  const [pos, setPos] = useState<[number, number]>([0.82, 0.3]);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(!reduce.matches);
    update();
    reduce.addEventListener('change', update);
    return () => reduce.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let t = Math.random() * 100;
    let last = performance.now();
    const id = window.setInterval(() => {
      if (document.hidden) return;
      const now = performance.now();
      t += ((now - last) / 1000) * SPEED;
      last = now;
      // Lissajous path kept inside 8%–92% of the viewport.
      const x = 0.5 + 0.42 * Math.sin(t * 3.0 + 0.6) * Math.cos(t * 0.7);
      const y = 0.5 + 0.38 * Math.sin(t * 2.0) * Math.cos(t * 1.3 + 1.1);
      setPos([x, y]);
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 40, pointerEvents: 'none' }}
    >
      <FluidGlass
        text=""
        background="transparent"
        shape="lens"
        shapes={['lens']}
        size={60}
        refraction={1}
        dispersion={0.35}
        reflection={1.1}
        frost={0}
        color="#ef4444"
        tint={0.12}
        shadow={0.25}
        elevation={0.5}
        interaction="static"
        smoothness={1}
        wobble={0.35}
        spin={0.15}
        idle
        morphOnClick={false}
        position={pos}
        intro
        maxDevicePixelRatio={1.5}
      />
    </div>
  );
}
```

## `app/components/FluidGlass.tsx`

```tsx
'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

type Shape = 'lens' | 'blob' | 'cube' | 'pill' | 'torus' | 'prism' | 'diamond';
type Interaction = 'follow' | 'drag' | 'static';
type Uniforms = Record<string, WebGLUniformLocation | null>;

export interface FluidGlassProps {
  text?: string;
  textColor?: string;
  fontFamily?: string;
  fontWeight?: number | string;
  fontSize?: number;
  src?: string;
  fit?: 'cover' | 'contain';
  background?: string;
  shape?: Shape;
  shapes?: Shape[];
  size?: number;
  refraction?: number;
  dispersion?: number;
  reflection?: number;
  frost?: number;
  color?: string;
  tint?: number;
  shadow?: number;
  elevation?: number;
  interaction?: Interaction;
  smoothness?: number;
  wobble?: number;
  spin?: number;
  idle?: boolean;
  morphOnClick?: boolean;
  onShapeChange?: (shape: Shape) => void;
  position?: [number, number];
  intro?: boolean;
  maxDevicePixelRatio?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

interface Settings {
  text: string;
  textColor?: string;
  fontFamily?: string;
  fontWeight: number | string;
  fontSize?: number;
  src?: string;
  fit: 'cover' | 'contain';
  background: number[];
  shape: Shape;
  cycle: Shape[];
  size: number;
  ior: number;
  dispersion: number;
  reflection: number;
  frost: number;
  color: number[];
  tint: number;
  shadow: number;
  elevation: number;
  interaction: Interaction;
  smoothness: number;
  wobble: number;
  spin: number;
  idle: boolean;
  morphOnClick: boolean;
  onShapeChange?: (shape: Shape) => void;
  position: number[];
  intro: boolean;
  maxRatio: number;
}

interface ProgramEntry {
  program: WebGLProgram;
  fragment: WebGLShader;
  uniforms: Uniforms | null;
  failed: boolean;
}

const HANDLE: Record<'none' | 'drag' | 'button', string> = {
  none: 'pointer-events-none absolute left-0 top-0 h-0 w-0 rounded-full will-change-transform',
  drag: 'absolute left-0 top-0 h-0 w-0 cursor-grab touch-none rounded-full will-change-transform group-data-[grabbing]:cursor-grabbing',
  button: 'absolute left-0 top-0 h-0 w-0 cursor-pointer rounded-full will-change-transform'
};

// Raymarching cost scales with pixel count — keep phones/tablets well under desktop.
const PIXEL_BUDGET = 5e6;
const PIXEL_BUDGET_COARSE = 1.6e6;
const COARSE_MAX_RATIO = 1.25;
const ARABIC = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;
const INTERACTIVE = 'a,button,input,textarea,select,label,[role="button"],[contenteditable="true"]';
const SHADOW_SIZE = 160;
const SHAPES: Shape[] = ['lens', 'blob', 'cube', 'pill', 'torus', 'prism', 'diamond'];
const EXTENT: Record<Shape, number> = {
  lens: 1.02,
  blob: 1.08,
  cube: 1.32,
  pill: 1.02,
  torus: 1.0,
  prism: 1.18,
  diamond: 1.05
};
const BASE: Record<Shape, [number, number, number]> = {
  lens: [0, 0, 0],
  blob: [0.2, 0, 0],
  cube: [-0.48, 0.62, 0.0],
  pill: [0.0, 0.0, 0.0],
  torus: [-0.5, 0.18, 0.0],
  prism: [-0.3, 0.45, 0.0],
  diamond: [-0.35, 0.5, 0.0]
};
const SPIN: Record<Shape, [number, number]> = {
  lens: [0, 0],
  blob: [1, 0],
  cube: [1, 0],
  pill: [0, 0],
  torus: [0, 1],
  prism: [1, 0],
  diamond: [1, 0]
};
const VIDEO = /\.(mp4|webm|ogv|ogg|mov|m4v)(\?|#|$)/i;

const VERTEX = `#version 300 es
const vec2 corners[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
void main() {
  gl_Position = vec4(corners[gl_VertexID], 0.0, 1.0);
}`;

const CONTENT = `#version 300 es
precision highp float;
uniform vec2 uView;
uniform float uRatio;
uniform sampler2D uMedia;
uniform vec4 uMediaRect;
uniform float uMediaOn;
uniform sampler2D uText;
uniform float uTextOn;
uniform vec4 uBackground;
out vec4 fragColor;

void main() {
  vec2 w = gl_FragCoord.xy / uRatio;
  vec2 uv = vec2(w.x, uView.y - w.y) / uView;
  vec4 color = uBackground;
  if (uMediaOn > 0.5) {
    vec2 m = (uv - uMediaRect.xy) / uMediaRect.zw;
    if (m.x >= 0.0 && m.y >= 0.0 && m.x <= 1.0 && m.y <= 1.0) {
      vec4 media = texture(uMedia, m);
      color = media + color * (1.0 - media.a);
    }
  }
  if (uTextOn > 0.5) {
    vec4 text = texture(uText, uv);
    color = text + color * (1.0 - text.a);
  }
  fragColor = color;
}`;

const SDF: Record<Shape, string> = {
  lens: `{
    float a = length(p - vec3(0.0, 0.0, -1.85)) - 2.13;
    float b = length(p - vec3(0.0, 0.0, 1.85)) - 2.13;
    float h = clamp(0.5 - 0.5 * (b - a) / 0.2, 0.0, 1.0);
    return mix(b, a, h) + 0.2 * h * (1.0 - h);
  }`,
  blob: `{
    vec3 q = p * 1.6;
    float t = uTime;
    float n = sin(q.x + t * 1.1) * sin(q.y * 1.15 - t * 0.9) * sin(q.z * 0.95 + t * 0.8);
    n += 0.45 * sin(q.x * 1.6 - t * 0.6 + q.z) * sin(q.y * 1.9 + t * 1.2 + q.x * 0.5);
    return (length(p) - 0.92 - 0.085 * n) * 0.78;
  }`,
  cube: `{
    vec3 q = abs(p) - vec3(0.6);
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - 0.16;
  }`,
  pill: `{
    float outline = length(vec2(max(abs(p.x) - 0.58, 0.0), p.y)) - 0.42;
    vec2 q = vec2(outline + 0.16, abs(p.z) - 0.16);
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - 0.16;
  }`,
  torus: `{
    vec2 q = vec2(length(p.xy) - 0.68, p.z);
    return length(q) - 0.3;
  }`,
  prism: `{
    vec3 q = abs(p);
    float side = max(q.x * 0.866025 + p.y * 0.5, -p.y) - 0.5;
    float d = max(q.z - 0.34, side);
    return d - 0.08;
  }`,
  diamond: `{
    vec3 q = abs(p);
    return (q.x + q.y * 0.92 + q.z * 1.25 - 0.98) * 0.5;
  }`
};

const SUPERSAMPLE = `
  float rim = tr.mode > 1.5 ? 1.0 - smoothstep(0.3, 0.55, clamp(-dot(rd, tr.n), 0.0, 1.0)) : tr.mode;
  if (rim > 0.0) {
    vec2 offsets[3] = vec2[3](vec2(0.33, 0.33), vec2(-0.33, 0.25), vec2(0.25, -0.33));
    float scatter = (length(tx) + length(ty)) / max(uBound, 1.0);
    for (int k = 0; k < 3; k++) {
      vec2 sub = w + offsets[k] * pixel;
      vec3 subDir = normalize(vec3(sub, 0.0) - camera);
      Trace st = traceSurface(ro, subDir, eps, pixel);
      if (st.mode > 1.5 && (uTint.a > 0.0 || bandOf(clamp(-dot(subDir, st.n), 0.0, 1.0), scatter) < 1.0)) {
        traceInterior(st, subDir, eps);
      }
      color += shadeTrace(st, subDir, background, tone, sub, tx, ty, rx, ry);
    }
    color *= 0.25;
  }`;

const fragmentFor = (a: Shape, b: Shape, supersample: boolean) => `#version 300 es
precision highp float;
uniform vec2 uView;
uniform float uRatio;
uniform float uFocal;
uniform vec3 uCenter;
uniform mat3 uInverse;
uniform float uScale;
uniform float uBound;
uniform float uMorph;
uniform float uRipple;
uniform float uTime;
uniform float uIor;
uniform float uDispersion;
uniform float uReflection;
uniform float uFrost;
uniform vec4 uTint;
uniform float uShadow;
uniform vec3 uLight;
uniform float uPresence;
uniform sampler2D uMedia;
uniform vec4 uMediaRect;
uniform float uMediaOn;
uniform sampler2D uText;
uniform float uTextOn;
uniform vec4 uBackground;
uniform float uPass;
uniform sampler2D uShadowMap;
uniform vec4 uShadowBox;
uniform vec2 uShadowSize;
out vec4 fragColor;

float shapeA(vec3 p) ${SDF[a]}
float shapeB(vec3 p) ${SDF[b]}

float field(vec3 p) {
  float d = shapeA(p);
  ${a !== b ? 'd = mix(d, shapeB(p), uMorph);' : ''}
  if (uRipple > 0.0) {
    d += uRipple * sin(p.x * 3.1 + uTime * 2.3) * sin(p.y * 3.4 - uTime * 1.9) * sin(p.z * 2.9 + uTime * 1.6);
  }
  return d;
}

float map(vec3 w) {
  return field(uInverse * (w - uCenter)) * uScale;
}

vec3 normalAt(vec3 w) {
  float e = 0.35;
  vec2 k = vec2(1.0, -1.0);
  return normalize(
    k.xyy * map(w + k.xyy * e) +
    k.yyx * map(w + k.yyx * e) +
    k.yxy * map(w + k.yxy * e) +
    k.xxx * map(w + k.xxx * e)
  );
}

vec4 content(vec2 w, vec2 gx, vec2 gy) {
  vec2 uv = vec2(w.x, uView.y - w.y) / uView;
  vec2 dx = vec2(gx.x, -gx.y) / uView;
  vec2 dy = vec2(gy.x, -gy.y) / uView;
  vec4 color = uBackground;
  if (uMediaOn > 0.5) {
    vec2 m = (uv - uMediaRect.xy) / uMediaRect.zw;
    vec2 inside = step(vec2(0.0), m) * step(m, vec2(1.0));
    vec4 media = textureGrad(uMedia, m, dx / uMediaRect.zw, dy / uMediaRect.zw) * inside.x * inside.y;
    color = media + color * (1.0 - media.a);
  }
  if (uTextOn > 0.5) {
    vec4 text = textureGrad(uText, uv, dx, dy);
    color = text + color * (1.0 - text.a);
  }
  return color;
}

vec4 frosted(vec2 w, vec2 gx, vec2 gy) {
  if (uFrost <= 0.0) return content(w, gx, gy);
  float r = uFrost * 16.0;
  vec2 bx = gx + vec2(r * 0.35, 0.0);
  vec2 by = gy + vec2(0.0, r * 0.35);
  vec4 sum = content(w, bx, by) * 0.2;
  for (int i = 0; i < 8; i++) {
    float a = float(i) * 0.785398 + 0.3;
    sum += content(w + vec2(cos(a), sin(a)) * r * (0.55 + 0.45 * float(i & 1)), bx, by) * 0.1;
  }
  return sum;
}

vec3 studio(vec3 d) {
  vec2 a = vec2(atan(d.x, d.z), d.y);
  float key = smoothstep(0.42, 0.22, abs(a.x + 0.62)) * smoothstep(0.3, 0.12, abs(a.y - 0.5));
  float strip = smoothstep(0.12, 0.05, abs(a.x - 0.95)) * smoothstep(0.8, 0.35, abs(a.y - 0.05));
  float dome = smoothstep(0.0, 1.0, d.z) * 0.04;
  return vec3(18.0) * key + vec3(8.0) * strip + vec3(dome);
}

vec4 light(vec3 d, float weight) {
  vec3 c = studio(d) * weight;
  float a = clamp(max(c.r, max(c.g, c.b)), 0.0, 1.0);
  return vec4(min(c, vec3(a)), a);
}

vec2 landing(vec3 o, vec3 d, vec2 fallback) {
  if (d.z > -0.0005) return fallback;
  return o.xy + d.xy * (-o.z / d.z);
}

float shadowAt(vec2 w, out float caustic) {
  caustic = 0.0;
  if (uShadow <= 0.0) return 0.0;
  vec3 p = vec3(w, 0.0);
  vec2 footprint = uCenter.xy + uLight.xy / uLight.z * uCenter.z;
  if (length(w - footprint) > uBound * 1.6) return 0.0;
  float t = 2.0;
  float occlusion = 1.0;
  float deepest = 1e5;
  for (int i = 0; i < 28; i++) {
    float h = map(p + uLight * t);
    deepest = min(deepest, h);
    if (h > 0.0) occlusion = min(occlusion, 6.0 * h / t);
    if (t > uCenter.z * 2.6 + uBound * 2.0) break;
    t += clamp(abs(h) * 0.8, 2.0, uBound * 0.25);
  }
  if (deepest > 0.0) return (1.0 - clamp(occlusion, 0.0, 1.0)) * 0.36;
  float depth = -deepest / max(uBound, 1.0);
  caustic = smoothstep(0.12, 0.5, depth) * (uIor - 1.0) * 2.0;
  return exp(-depth * 14.0) * 0.42;
}

vec2 shadowSample(vec2 w) {
  if (uShadow <= 0.0) return vec2(0.0);
  vec2 uv = (w - uShadowBox.xy) / uShadowBox.zw;
  if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) return vec2(0.0);
  vec2 s = textureLod(uShadowMap, uv, 0.0).rg;
  return vec2(s.x * 0.42, s.y * 2.0);
}

vec2 lighting(vec2 w, float under) {
  vec2 s = shadowSample(w);
  float dark = s.x * uShadow * uPresence;
  float glow = clamp(s.y * uShadow * uPresence, 0.0, 1.0) * mix(0.12, 0.3, under);
  return vec2(dark * mix(0.45, 1.0, under), glow);
}

vec4 shade(vec4 color, vec2 factors) {
  vec3 rgb = color.rgb * (1.0 - factors.x);
  float alpha = color.a + factors.x - color.a * factors.x;
  rgb = vec3(factors.y) + rgb * (1.0 - factors.y);
  alpha = factors.y + alpha * (1.0 - factors.y);
  return vec4(rgb, alpha);
}

struct Trace {
  float mode;
  float cover;
  vec3 p;
  vec3 n;
  vec3 q;
  vec3 inside;
  vec3 exitNormal;
  vec3 exitDir;
  float escaped;
  float travel;
  float bounces;
};

Trace traceSurface(vec3 ro, vec3 rd, float eps, float pixel) {
  Trace tr;
  tr.mode = 0.0;
  tr.cover = 0.0;
  tr.p = vec3(0.0);
  tr.n = vec3(0.0, 0.0, 1.0);
  tr.q = vec3(0.0);
  tr.inside = vec3(0.0, 0.0, -1.0);
  tr.exitNormal = vec3(0.0, 0.0, 1.0);
  tr.exitDir = vec3(0.0, 0.0, -1.0);
  tr.escaped = 0.0;
  tr.travel = 0.0;
  tr.bounces = 0.0;
  vec3 oc = ro - uCenter;
  float b = dot(oc, rd);
  float c = dot(oc, oc) - uBound * uBound;
  float disc = b * b - c;
  if (disc <= 0.0 || uPresence <= 0.0) return tr;
  float sq = sqrt(disc);
  float t = max(-b - sq, 0.0);
  float tEnd = -b + sq;
  float closest = 1e5;
  float closestT = t;
  bool hit = false;
  for (int i = 0; i < 96; i++) {
    float d = map(ro + rd * t);
    if (d < closest) {
      closest = d;
      closestT = t;
    }
    if (d < eps) {
      hit = true;
      break;
    }
    t += d * 0.9;
    if (t > tEnd) break;
  }
  if (!hit && closest < pixel * 0.35) {
    hit = true;
    t = closestT;
  }
  if (!hit) {
    tr.cover = clamp(1.0 - closest / (pixel * 1.2), 0.0, 1.0) * uPresence;
    if (tr.cover > 0.0) {
      tr.mode = 1.0;
      tr.p = ro + rd * closestT;
      tr.n = normalAt(tr.p);
    }
    return tr;
  }
  tr.mode = 2.0;
  tr.p = ro + rd * t;
  tr.n = normalAt(tr.p);
  return tr;
}

void traceInterior(inout Trace tr, vec3 rd, float eps) {
  vec3 inside = refract(rd, tr.n, 1.0 / uIor);
  vec3 q = tr.p + inside * eps * 4.0;
  vec3 exitDir = inside;
  bool escaped = false;
  for (int bounce = 0; bounce < 3; bounce++) {
    for (int i = 0; i < 64; i++) {
      float d = map(q);
      if (d > -eps) break;
      float stepLength = max(-d * 0.9, eps);
      q += inside * stepLength;
      tr.travel += stepLength;
    }
    vec3 n2 = normalAt(q);
    tr.exitNormal = n2;
    vec3 out1 = refract(inside, -n2, uIor);
    if (dot(out1, out1) > 0.0) {
      exitDir = out1;
      escaped = true;
      break;
    }
    inside = reflect(inside, -n2);
    q += inside * eps * 4.0;
    tr.bounces += 1.0;
  }
  if (!escaped) exitDir = inside;
  if (exitDir.z > -0.2) exitDir = normalize(vec3(exitDir.xy, -0.2 - abs(exitDir.z)));
  tr.q = q;
  tr.inside = inside;
  tr.exitDir = exitDir;
  tr.escaped = escaped ? 1.0 : 0.0;
}

float bandOf(float cosi, float scatter) {
  return max(smoothstep(0.42, 0.12, cosi), smoothstep(0.06, 0.24, scatter));
}

vec4 shadeTrace(Trace tr, vec3 rd, vec4 background, vec4 tone, vec2 w, vec2 tx, vec2 ty, vec2 rx, vec2 ry) {
  if (tr.mode < 0.5) return background;
  vec3 mirrorDir = reflect(rd, tr.n);
  if (tr.mode < 1.5) {
    vec4 edgeTone = tone * uReflection * 0.8 + light(mirrorDir, uReflection) * 0.5;
    return mix(background, edgeTone + background * (1.0 - edgeTone.a), tr.cover * 0.7);
  }
  float cosi = clamp(-dot(rd, tr.n), 0.0, 1.0);
  float f0 = pow((uIor - 1.0) / (uIor + 1.0), 2.0);
  float fresnel = f0 + (1.0 - f0) * pow(1.0 - cosi, 5.0);
  float band = bandOf(cosi, (length(tx) + length(ty)) / max(uBound, 1.0));

  vec4 mirror = tone * uReflection;
  vec4 transmitted = tone;
  if (band < 1.0) {
    mirror = mirrorDir.z < -0.0005 ? frosted(landing(tr.p, mirrorDir, w), rx, ry) * uReflection : light(mirrorDir, uReflection);
    vec2 hitT = landing(tr.q, tr.exitDir, w);
    vec4 green = frosted(hitT, tx, ty);
    vec4 red = green;
    vec4 blue = green;
    if (tr.escaped > 0.5 && uDispersion > 0.0) {
      vec3 spread = vec3(-1.0, 0.0, 1.0) * uDispersion * 0.06;
      vec3 dirR = refract(tr.inside, -tr.exitNormal, uIor + spread.x);
      vec3 dirB = refract(tr.inside, -tr.exitNormal, uIor + spread.z);
      if (dot(dirR, dirR) > 0.0 && dirR.z < -0.2) red = frosted(landing(tr.q, dirR, hitT), tx, ty);
      if (dot(dirB, dirB) > 0.0 && dirB.z < -0.2) blue = frosted(landing(tr.q, dirB, hitT), tx, ty);
    }
    vec2 factors = lighting(hitT, 0.0);
    red = shade(red, factors);
    green = shade(green, factors);
    blue = shade(blue, factors);
    transmitted = mix(vec4(red.r, green.g, blue.b, green.a), tone, band);
    mirror = mix(mirror, tone * uReflection, band);
  }

  vec3 tint = pow(max(uTint.rgb, vec3(0.001)), vec3(uTint.a * tr.travel / max(uBound, 1.0)));
  transmitted.rgb *= tint;
  float body = (1.0 - dot(tint, vec3(0.3333))) * 0.7;
  transmitted += vec4(uTint.rgb * body, body) * (1.0 - transmitted.a);

  vec4 reflected = mirrorDir.z < -0.0005 ? mirror * fresnel : light(mirrorDir, uReflection * fresnel);
  vec4 glass = reflected + transmitted * (1.0 - reflected.a);
  float edge = 1.0 - smoothstep(0.04, 0.3, cosi);
  glass = mix(glass, mirror + background * (1.0 - mirror.a), edge);
  vec2 facing = normalize(vec2(-0.42, 0.55));
  float rimLight = pow(1.0 - cosi, 3.0) * (0.25 + 0.75 * abs(dot(normalize(tr.n.xy + 1e-5), facing))) * 0.55 * uReflection;
  rimLight *= smoothstep(0.0, 0.08, cosi);
  glass = vec4(rimLight) + glass * (1.0 - rimLight);
  return mix(background, glass, uPresence);
}

void main() {
  if (uPass > 0.5) {
    float caustic;
    float dark = shadowAt(uShadowBox.xy + gl_FragCoord.xy / uShadowSize * uShadowBox.zw, caustic);
    fragColor = vec4(dark / 0.42, caustic * 0.5, 0.0, 1.0);
    return;
  }
  vec2 w = gl_FragCoord.xy / uRatio;
  vec3 camera = vec3(uView * 0.5, uFocal);
  vec3 ro = camera;
  vec3 rd = normalize(vec3(w, 0.0) - camera);
  float pixel = 1.0 / uRatio;
  float eps = 0.25 * pixel;

  Trace tr = traceSurface(ro, rd, eps, pixel);
  if (tr.mode > 1.5) traceInterior(tr, rd, eps);
  vec2 hitT = tr.mode > 1.5 ? landing(tr.q, tr.exitDir, w) : w;
  vec2 hitR = tr.mode > 0.5 ? landing(tr.p, reflect(rd, tr.n), w) : w;
  vec2 tx = dFdx(hitT);
  vec2 ty = dFdy(hitT);
  vec2 rx = dFdx(hitR);
  vec2 ry = dFdy(hitR);
  vec2 wx = dFdx(w);
  vec2 wy = dFdy(w);

  vec4 background = shade(content(w, wx, wy), lighting(w, 1.0));
  vec4 tone = tr.mode > 0.5 ? content(uCenter.xy, vec2(uBound * 1.4, 0.0), vec2(0.0, uBound * 1.4)) : vec4(0.0);
  vec4 color = shadeTrace(tr, rd, background, tone, w, tx, ty, rx, ry);
  ${supersample ? SUPERSAMPLE : ''}
  fragColor = color;
}`;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const parseColor = (value: string | undefined): number[] | null => {
  const text = String(value || '').trim();
  const hex = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(text);
  if (hex) {
    const full = hex[1].length === 3 ? hex[1].replace(/./g, digit => digit + digit) : hex[1];
    return [0, 2, 4].map(index => parseInt(full.slice(index, index + 2), 16) / 255).concat(1);
  }
  const rgb = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?/i.exec(text);
  if (rgb) {
    const alpha = rgb[4] === undefined ? 1 : rgb[4].endsWith('%') ? parseFloat(rgb[4]) / 100 : parseFloat(rgb[4]);
    return [rgb[1], rgb[2], rgb[3]].map(channel => clamp(parseFloat(channel) / 255, 0, 1)).concat(clamp(alpha, 0, 1));
  }
  return null;
};

const compile = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
};

const smoother = (t: number) => {
  const x = clamp(t, 0, 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
};

const quaternion = (x: number, y: number, z: number): number[] => {
  const cx = Math.cos(x / 2);
  const sx = Math.sin(x / 2);
  const cy = Math.cos(y / 2);
  const sy = Math.sin(y / 2);
  const cz = Math.cos(z / 2);
  const sz = Math.sin(z / 2);
  return [
    sx * cy * cz - cx * sy * sz,
    cx * sy * cz + sx * cy * sz,
    cx * cy * sz - sx * sy * cz,
    cx * cy * cz + sx * sy * sz
  ];
};

const multiply = (a: number[], b: number[]): number[] => [
  a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
  a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
  a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
  a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]
];

const slerp = (a: number[], b: number[], t: number): number[] => {
  let dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  const target = dot < 0 ? b.map(value => -value) : b;
  dot = Math.abs(dot);
  if (dot > 0.9995) {
    const mixed = a.map((value, index) => value + (target[index] - value) * t);
    const length = Math.hypot(...mixed);
    return mixed.map(value => value / length);
  }
  const theta = Math.acos(dot);
  const sin = Math.sin(theta);
  const wa = Math.sin((1 - t) * theta) / sin;
  const wb = Math.sin(t * theta) / sin;
  return a.map((value, index) => value * wa + target[index] * wb);
};

const driftAt = (clock: number, size: number): number[] => [
  Math.sin(clock * 0.37) * size * 0.35 + Math.sin(clock * 0.71 + 1.3) * size * 0.12,
  Math.sin(clock * 0.29 + 0.8) * size * 0.2 + Math.cos(clock * 0.53) * size * 0.08
];

const toMatrix = ([x, y, z, w]: number[]): number[] => [
  1 - 2 * (y * y + z * z),
  2 * (x * y + z * w),
  2 * (x * z - y * w),
  2 * (x * y - z * w),
  1 - 2 * (x * x + z * z),
  2 * (y * z + x * w),
  2 * (x * z + y * w),
  2 * (y * z - x * w),
  1 - 2 * (x * x + y * y)
];

const FluidGlass = ({
  text = 'Look closer.',
  textColor,
  fontFamily,
  fontWeight = 600,
  fontSize,
  src,
  fit = 'cover',
  background = 'transparent',
  shape = 'torus',
  shapes,
  size = 260,
  refraction = 1,
  dispersion = 0.35,
  reflection = 1,
  frost = 0,
  color = '#ffffff',
  tint = 0,
  shadow = 0.5,
  elevation = 0.4,
  interaction = 'follow',
  smoothness = 0.5,
  wobble = 0.5,
  spin = 0.3,
  idle = true,
  morphOnClick = true,
  onShapeChange,
  position = [0.5, 0.5],
  intro = true,
  maxDevicePixelRatio = 2,
  className = '',
  style,
  children
}: FluidGlassProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const wakeRef = useRef<(() => void) | null>(null);
  const [generation, setGeneration] = useState(0);
  // true when WebGL2 is missing or the shaders fail → show the text as plain DOM.
  const [unsupported, setUnsupported] = useState(false);

  const cycle = Array.isArray(shapes) && shapes.length ? shapes.filter(name => SHAPES.includes(name)) : SHAPES;
  const settings: Settings = {
    text: String(text ?? ''),
    textColor,
    fontFamily,
    fontWeight,
    fontSize,
    src,
    fit,
    background: parseColor(background) || [0, 0, 0, 0],
    shape: SHAPES.includes(shape) ? shape : 'torus',
    cycle: cycle.length ? cycle : SHAPES,
    size: Math.max(16, size),
    ior: 1 + 0.5 * clamp(refraction, 0, 2),
    dispersion: clamp(dispersion, 0, 1),
    reflection: clamp(reflection, 0, 2),
    frost: clamp(frost, 0, 1),
    color: parseColor(color) || [1, 1, 1, 1],
    tint: clamp(tint, 0, 1),
    shadow: clamp(shadow, 0, 1),
    elevation: clamp(elevation, 0, 3),
    interaction,
    smoothness: clamp(smoothness, 0, 1),
    wobble: clamp(wobble, 0, 1),
    spin,
    idle,
    morphOnClick,
    onShapeChange,
    position: [clamp(position?.[0] ?? 0.5, 0, 1), clamp(position?.[1] ?? 0.5, 0, 1)],
    intro,
    maxRatio: clamp(maxDevicePixelRatio, 0.5, 3)
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    wakeRef.current?.();
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance'
    });
    if (!gl) {
      setUnsupported(true);
      return;
    }
    const parallel = gl.getExtension('KHR_parallel_shader_compile');
    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const programs = new Map<string, ProgramEntry>();

    const request = (name: string): ProgramEntry => {
      const key = name === 'content' ? name : `${name}>${view.ratio < 1.75 ? 1 : 0}`;
      if (programs.has(key)) return programs.get(key) as ProgramEntry;
      const [a, b, sampled] = key.split('>');
      const fragment = compile(
        gl,
        gl.FRAGMENT_SHADER,
        key === 'content' ? CONTENT : fragmentFor(a as Shape, b as Shape, sampled === '1')
      );
      const program = gl.createProgram() as WebGLProgram;
      gl.attachShader(program, vertex as WebGLShader);
      gl.attachShader(program, fragment as WebGLShader);
      gl.linkProgram(program);
      const entry: ProgramEntry = { program, fragment: fragment as WebGLShader, uniforms: null, failed: false };
      programs.set(key, entry);
      return entry;
    };

    const ready = (entry: ProgramEntry) => {
      if (entry.failed) return false;
      if (entry.uniforms) return true;
      if (parallel && !gl.getProgramParameter(entry.program, parallel.COMPLETION_STATUS_KHR)) return false;
      if (!gl.getProgramParameter(entry.program, gl.LINK_STATUS)) {
        console.error(gl.getShaderInfoLog(entry.fragment) || gl.getProgramInfoLog(entry.program));
        entry.failed = true;
        // A broken driver fails every program; don't leave a blank canvas.
        if (!disposed && !gl.isContextLost()) setUnsupported(true);
        return false;
      }
      const uniforms: Uniforms = {};
      const count = gl.getProgramParameter(entry.program, gl.ACTIVE_UNIFORMS);
      for (let index = 0; index < count; index++) {
        const info = gl.getActiveUniform(entry.program, index);
        if (info) uniforms[info.name] = gl.getUniformLocation(entry.program, info.name);
      }
      entry.uniforms = uniforms;
      return true;
    };

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = motionQuery.matches;
    const coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const vao = gl.createVertexArray();
    const makeTexture = () => {
      const texture = gl.createTexture() as WebGLTexture;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
      gl.generateMipmap(gl.TEXTURE_2D);
      return texture;
    };
    const mediaTexture = makeTexture();
    const textTexture = makeTexture();
    const shadowMap = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, shadowMap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SHADOW_SIZE, SHADOW_SIZE, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    const shadowTarget = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, shadowTarget);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, shadowMap, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    const textCanvas = document.createElement('canvas');
    const view = { width: 1, height: 1, ratio: 1 };
    const media: {
      src: string | null | undefined;
      clip: HTMLVideoElement | null;
      image: HTMLImageElement | null;
      ready: boolean;
      width: number;
      height: number;
    } = { src: null, clip: null, image: null, ready: false, width: 1, height: 1 };
    const textState = { key: '', ready: false };

    const pointer = {
      x: 0,
      y: 0,
      inside: false,
      down: false,
      grabbed: false,
      offsetX: 0,
      offsetY: 0,
      startX: 0,
      startY: 0
    };
    const body = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      spin: 0,
      ripple: 0,
      dirX: 1,
      dirY: 0,
      anchorX: 0,
      anchorY: 0
    };
    const spring: Record<string, number> = {
      stretch: 1,
      vstretch: 0,
      tiltX: 0,
      vtiltX: 0,
      tiltY: 0,
      vtiltY: 0,
      scale: 0,
      vscale: 0
    };
    let placed = false;
    let flying = false;
    const morph: { from: Shape; to: Shape; t: number; pending: Shape | null } = {
      from: settingsRef.current.shape,
      to: settingsRef.current.shape,
      t: 1,
      pending: null
    };
    let requested = settingsRef.current.shape;
    let presence = settingsRef.current.intro && !reduced && generation === 0 ? 0 : 1;
    if (presence === 1) spring.scale = 1;
    let time = 0;
    let idleClock = Math.random() * 20;
    let raf = 0;
    let disposed = false;
    let last = 0;
    let tick = 0;
    let pace = 1000 / 60;
    let skipped = 0;
    let calm = false;
    let visible = true;
    let pageVisible = document.visibilityState !== 'hidden';
    let lost = false;
    let current: ProgramEntry | null = null;

    const drawText = () => {
      const s = settingsRef.current;
      const computed = getComputedStyle(container);
      const family = s.fontFamily || computed.fontFamily || 'sans-serif';
      const fill = s.textColor || computed.color || '#ffffff';
      const width = canvas.width;
      const height = canvas.height;
      const key = [s.text, family, fill, s.fontWeight, s.fontSize, width, height].join('|');
      if (key === textState.key) return;
      textState.key = key;
      textCanvas.width = width;
      textCanvas.height = height;
      const ctx = textCanvas.getContext('2d') as CanvasRenderingContext2D;
      ctx.clearRect(0, 0, width, height);
      const lines = s.text.split('\n');
      if (s.text.trim()) {
        const ratio = view.ratio;
        const font = (px: number) => `${s.fontWeight} ${px}px ${family}`;
        let px = s.fontSize ? s.fontSize * ratio : height * 0.36;
        if (!s.fontSize) {
          ctx.font = font(100);
          const widest = Math.max(...lines.map(line => ctx.measureText(line).width), 1);
          px = Math.min((width * 0.84 * 100) / widest, (height * 0.64) / (lines.length * 1.02));
        }
        ctx.font = font(px);
        ctx.fillStyle = fill;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        // Arabic is cursive: negative tracking breaks letter joins. Also shape RTL correctly.
        const arabic = ARABIC.test(s.text);
        ctx.direction = arabic || getComputedStyle(container).direction === 'rtl' ? 'rtl' : 'ltr';
        if ('letterSpacing' in ctx) ctx.letterSpacing = arabic ? '0px' : `${-0.03 * px}px`;
        const metrics = ctx.measureText('Hg');
        const ascent = metrics.actualBoundingBoxAscent || px * 0.72;
        const descent = metrics.actualBoundingBoxDescent || px * 0.2;
        const lineHeight = px * 1.02;
        const total = lineHeight * (lines.length - 1) + ascent + descent;
        let y = (height - total) / 2 + ascent;
        lines.forEach(line => {
          ctx.fillText(line, width / 2, y);
          y += lineHeight;
        });
      }
      gl.bindTexture(gl.TEXTURE_2D, textTexture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.generateMipmap(gl.TEXTURE_2D);
      textState.ready = Boolean(s.text.trim());
    };

    const releaseClip = () => {
      if (!media.clip) return;
      media.clip.pause();
      media.clip.removeAttribute('src');
      media.clip.load();
      media.clip = null;
    };

    const loadMedia = () => {
      const s = settingsRef.current;
      if (s.src === media.src) return;
      releaseClip();
      media.src = s.src;
      media.ready = false;
      media.image = null;
      if (!s.src) return;
      if (VIDEO.test(s.src)) {
        const clip = document.createElement('video');
        clip.crossOrigin = 'anonymous';
        clip.muted = true;
        clip.loop = true;
        clip.playsInline = true;
        clip.autoplay = true;
        clip.preload = 'auto';
        clip.src = s.src;
        clip.addEventListener('loadeddata', () => {
          if (media.clip !== clip) return;
          media.width = clip.videoWidth || 1;
          media.height = clip.videoHeight || 1;
          media.ready = true;
          wake();
        });
        clip.play().catch(() => {});
        media.clip = clip;
      } else {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.decoding = 'async';
        image.onload = () => {
          if (disposed || media.image !== image) return;
          media.width = image.naturalWidth || 1;
          media.height = image.naturalHeight || 1;
          gl.bindTexture(gl.TEXTURE_2D, mediaTexture);
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
          gl.generateMipmap(gl.TEXTURE_2D);
          media.ready = true;
          wake();
        };
        image.src = s.src;
        media.image = image;
      }
    };

    let resizePending = false;
    const applyResize = () => {
      const s = settingsRef.current;
      const rect = container.getBoundingClientRect();
      const cssWidth = Math.max(1, rect.width);
      const cssHeight = Math.max(1, rect.height);
      const ratio = Math.min(
        window.devicePixelRatio || 1,
        coarse ? Math.min(s.maxRatio, COARSE_MAX_RATIO) : s.maxRatio,
        Math.sqrt((coarse ? PIXEL_BUDGET_COARSE : PIXEL_BUDGET) / (cssWidth * cssHeight))
      );
      const width = Math.max(1, Math.round(cssWidth * ratio));
      const height = Math.max(1, Math.round(cssHeight * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      view.width = cssWidth;
      view.height = cssHeight;
      view.ratio = width / cssWidth;
      if (!placed) {
        body.x = s.position[0] * cssWidth;
        body.y = s.position[1] * cssHeight;
        body.anchorX = body.x;
        body.anchorY = body.y;
        placed = true;
      } else if (s.interaction === 'drag') {
        const edge = radius() * 1.08;
        body.anchorX = clamp(body.anchorX, edge, Math.max(edge, cssWidth - edge));
        body.anchorY = clamp(body.anchorY, edge, Math.max(edge, cssHeight - edge));
      }
      drawText();
    };

    const resize = () => {
      resizePending = true;
      wake();
    };

    const radius = () => {
      const s = settingsRef.current;
      return Math.min(s.size / 2, Math.min(view.width, view.height) * 0.36);
    };

    const bindContent = (u: Uniforms, s: Settings) => {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, mediaTexture);
      gl.uniform1i(u.uMedia, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, textTexture);
      gl.uniform1i(u.uText, 1);
      gl.uniform2f(u.uView, view.width, view.height);
      gl.uniform1f(u.uRatio, view.ratio);
      let rect = [0, 0, 1, 1];
      if (media.ready) {
        const boxRatio = view.width / view.height;
        const mediaRatio = media.width / media.height;
        if (mediaRatio > boxRatio === (s.fit !== 'contain')) {
          const w = mediaRatio / boxRatio;
          rect = [(1 - w) / 2, 0, w, 1];
        } else {
          const h = boxRatio / mediaRatio;
          rect = [0, (1 - h) / 2, 1, h];
        }
      }
      gl.uniform4f(u.uMediaRect, rect[0], rect[1], rect[2], rect[3]);
      gl.uniform1f(u.uMediaOn, media.ready ? 1 : 0);
      gl.uniform1f(u.uTextOn, textState.ready ? 1 : 0);
      const bg = s.background;
      gl.uniform4f(u.uBackground, bg[0] * bg[3], bg[1] * bg[3], bg[2] * bg[3], bg[3]);
    };

    const settle = () => {
      const s = settingsRef.current;
      const size = radius();
      const drift = s.idle && !reduced ? driftAt(idleClock, size) : [0, 0];
      const edge = size * 1.08;
      body.anchorX = clamp(body.x, edge, Math.max(edge, view.width - edge)) - drift[0];
      body.anchorY = clamp(body.y, edge, Math.max(edge, view.height - edge)) - drift[1];
    };

    const step = (key: string, target: number, omega: number, zeta: number, dt: number) => {
      const velocity = `v${key}`;
      const steps = Math.max(1, Math.ceil(dt / (1 / 240)));
      const h = dt / steps;
      for (let index = 0; index < steps; index++) {
        spring[velocity] += (omega * omega * (target - spring[key]) - 2 * zeta * omega * spring[velocity]) * h;
        spring[key] += spring[velocity] * h;
      }
      const settled = Math.abs(target - spring[key]) < 0.0005 && Math.abs(spring[velocity]) < 0.002;
      if (settled) {
        spring[key] = target;
        spring[velocity] = 0;
      }
      return !settled;
    };

    const frame = (now: number) => {
      raf = 0;
      if (resizePending) {
        resizePending = false;
        applyResize();
      }
      if (lost) return;
      const gap = now - tick;
      tick = now;
      if (gap > 2 && gap < 100) pace += (gap - pace) * 0.1;
      if (calm && skipped < Math.round(12 / pace) - 1) {
        skipped += 1;
        if (visible && pageVisible) raf = requestAnimationFrame(frame);
        return;
      }
      skipped = 0;
      const s = settingsRef.current;
      const dt = clamp((now - last) / 1000 || 0, 0, 0.05);
      last = Math.max(last, now);
      time += dt;
      let busy = false;

      if (s.shape !== requested) {
        requested = s.shape;
        morph.pending = s.shape;
      }
      if (morph.pending && morph.t >= 1) {
        const key = `${morph.to}>${morph.pending}`;
        const entry = request(key);
        if (ready(entry)) {
          request(`${morph.pending}>${morph.pending}`);
          morph.from = morph.to;
          morph.to = morph.pending;
          morph.pending = null;
          morph.t = 0;
          spring.vstretch -= 2.5 * s.wobble;
          if (morph.to !== morph.from) s.onShapeChange?.(morph.to);
        }
        busy = true;
      }
      if (morph.t < 1) {
        morph.t = Math.min(1, morph.t + dt / (reduced ? 0.35 : 0.85));
        busy = true;
      }
      if (s.morphOnClick && s.cycle.length > 1 && !morph.pending) {
        const index = s.cycle.indexOf(morph.to);
        request(`${morph.to}>${s.cycle[(index + 1) % s.cycle.length]}`);
      }

      const size = radius();
      if (!pointer.grabbed && s.interaction !== 'drag') {
        body.anchorX = s.position[0] * view.width;
        body.anchorY = s.position[1] * view.height;
      }
      const drifting = s.idle && !reduced;
      if (drifting && !pointer.grabbed) {
        idleClock += dt;
        busy = true;
      }
      const drift = drifting ? driftAt(idleClock, size) : [0, 0];
      let goalX = body.anchorX + drift[0];
      let goalY = body.anchorY + drift[1];
      if (s.interaction === 'follow' && pointer.inside) {
        goalX = pointer.x;
        goalY = pointer.y;
      }
      const omega = (pointer.grabbed ? 34 : 24) * Math.pow(0.18, s.smoothness) * (reduced ? 1.6 : 1);
      const substeps = Math.max(1, Math.ceil(dt / (1 / 240)));
      const h = dt / substeps;
      if (pointer.grabbed) {
        goalX = pointer.x - pointer.offsetX;
        goalY = pointer.y - pointer.offsetY;
        flying = false;
      }
      if (flying) {
        const edge = size * 1.08;
        for (let index = 0; index < substeps; index++) {
          body.x += body.vx * h;
          body.y += body.vy * h;
          const friction = Math.exp(-h * 1.4);
          body.vx *= friction;
          body.vy *= friction;
          if (body.x < edge || body.x > view.width - edge) {
            body.x = clamp(body.x, edge, Math.max(edge, view.width - edge));
            spring.vstretch -= Math.min(4, Math.abs(body.vx) * 0.0016) * s.wobble;
            body.vx *= -0.62;
          }
          if (body.y < edge || body.y > view.height - edge) {
            body.y = clamp(body.y, edge, Math.max(edge, view.height - edge));
            spring.vstretch -= Math.min(4, Math.abs(body.vy) * 0.0016) * s.wobble;
            body.vy *= -0.62;
          }
        }
        if (Math.hypot(body.vx, body.vy) < 30) {
          flying = false;
          settle();
        }
        busy = true;
      } else {
        for (let index = 0; index < substeps; index++) {
          body.vx += (omega * omega * (goalX - body.x) - 2 * 0.86 * omega * body.vx) * h;
          body.vy += (omega * omega * (goalY - body.y) - 2 * 0.86 * omega * body.vy) * h;
          body.x += body.vx * h;
          body.y += body.vy * h;
        }
        if (Math.abs(goalX - body.x) + Math.abs(goalY - body.y) > 0.05 || Math.hypot(body.vx, body.vy) > 0.5)
          busy = true;
      }

      const speed = Math.hypot(body.vx, body.vy);
      if (speed > 1) {
        body.dirX = body.vx / speed;
        body.dirY = body.vy / speed;
      }
      const stretchTarget = 1 + clamp(speed / 1800, 0, 0.55) * s.wobble * (reduced ? 0 : 1);
      busy = step('stretch', stretchTarget, 13, 0.32, dt) || busy;
      const tiltGain = reduced ? 0 : 0.00045;
      busy = step('tiltX', clamp(body.vy * tiltGain, -0.7, 0.7), 9, 0.5, dt) || busy;
      busy = step('tiltY', clamp(body.vx * tiltGain, -0.7, 0.7), 9, 0.5, dt) || busy;
      if (!reduced && (morph.to === 'blob' || (morph.from === 'blob' && morph.t < 1))) busy = true;
      if (!reduced && s.spin) {
        body.spin += dt * s.spin;
        busy = true;
      }
      const key = morph.t < 1 ? `${morph.from}>${morph.to}` : `${morph.to}>${morph.to}`;
      const entry = request(key);
      if (ready(entry)) current = entry;
      else busy = true;
      if (current) {
        if (presence < 1) {
          presence = Math.min(1, presence + dt / 0.5);
          busy = true;
        }
        busy = step('scale', 1, 11, 0.52, dt) || busy;
      }
      body.ripple +=
        ((morph.t < 1 ? 0.05 * s.wobble * Math.sin(Math.PI * morph.t) : 0) - body.ripple) * (1 - Math.exp(-dt / 0.08));

      if (media.clip && media.ready && !media.clip.paused) {
        gl.bindTexture(gl.TEXTURE_2D, mediaTexture);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, media.clip);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.generateMipmap(gl.TEXTURE_2D);
        busy = true;
      }

      if (!current) {
        const fallback = request('content');
        if (ready(fallback)) {
          gl.viewport(0, 0, canvas.width, canvas.height);
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.useProgram(fallback.program);
          gl.bindVertexArray(vao);
          bindContent(fallback.uniforms as Uniforms, s);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
        }
        if (visible && pageVisible) raf = requestAnimationFrame(frame);
        return;
      }

      const eased = smoother(morph.t);
      const extent = EXTENT[morph.from] + (EXTENT[morph.to] - EXTENT[morph.from]) * eased;
      const unit = size / extent;
      const scale = Math.max(0.001, spring.scale);
      const qa = quaternion(...BASE[morph.from]);
      const qb = quaternion(...BASE[morph.to]);
      let orientation = slerp(qa, qb, eased);
      const tumble = SPIN[morph.from][0] + (SPIN[morph.to][0] - SPIN[morph.from][0]) * eased;
      const sway = SPIN[morph.from][1] + (SPIN[morph.to][1] - SPIN[morph.from][1]) * eased;
      const angle = body.spin % (Math.PI * 2);
      const turnY = slerp([0, 0, 0, 1], quaternion(0, angle, 0), tumble);
      const turnZ = slerp([0, 0, 0, 1], quaternion(0, 0, angle), sway);
      orientation = multiply(multiply(quaternion(Math.sin(body.spin * 0.6) * 0.18 * tumble, 0, 0), turnY), orientation);
      orientation = multiply(turnZ, orientation);
      orientation = multiply(quaternion(spring.tiltX, spring.tiltY, 0), orientation);
      const r = toMatrix(orientation);
      const sx = Math.max(0.2, spring.stretch);
      const q = 1 / Math.sqrt(sx);
      const ux = body.dirX;
      const uy = -body.dirY;
      const inv = [
        1 / q + (1 / sx - 1 / q) * ux * ux,
        (1 / sx - 1 / q) * ux * uy,
        0,
        (1 / sx - 1 / q) * ux * uy,
        1 / q + (1 / sx - 1 / q) * uy * uy,
        0,
        0,
        0,
        1 / q
      ];
      const transposeR = [r[0], r[3], r[6], r[1], r[4], r[7], r[2], r[5], r[8]];
      const combined = new Float32Array(9);
      for (let col = 0; col < 3; col++) {
        for (let row = 0; row < 3; row++) {
          let sum = 0;
          for (let k = 0; k < 3; k++) sum += transposeR[k * 3 + row] * inv[col * 3 + k];
          combined[col * 3 + row] = sum / (unit * scale);
        }
      }
      const minScale = Math.min(sx, q);
      const maxScale = Math.max(sx, q);
      const focal = Math.max(view.width, view.height) * 1.6;
      const height = unit * (0.35 + s.elevation);
      const worldY = view.height - body.y;
      const cx = view.width / 2 + (body.x - view.width / 2) * ((focal - height) / focal);
      const cy = view.height / 2 + (worldY - view.height / 2) * ((focal - height) / focal);

      const handle = handleRef.current;
      if (handle) {
        const reach = size * scale * 2;
        handle.style.width = `${reach.toFixed(1)}px`;
        handle.style.height = `${reach.toFixed(1)}px`;
        handle.style.transform = `translate3d(${(body.x - reach / 2).toFixed(1)}px, ${(body.y - reach / 2).toFixed(1)}px, 0)`;
      }

      const u = current.uniforms as Uniforms;
      gl.useProgram(current.program);
      gl.bindVertexArray(vao);
      bindContent(u, s);
      gl.uniform1f(u.uFocal, focal);
      gl.uniform3f(u.uCenter, cx, cy, height);
      gl.uniformMatrix3fv(u.uInverse, false, combined);
      gl.uniform1f(u.uScale, unit * scale * minScale);
      const bound = size * scale * maxScale * 1.08 + 2;
      gl.uniform1f(u.uBound, bound);
      gl.uniform1f(u.uMorph, eased);
      gl.uniform1f(u.uRipple, body.ripple);
      gl.uniform1f(u.uTime, reduced ? 0 : time);
      gl.uniform1f(u.uIor, s.ior);
      gl.uniform1f(u.uDispersion, s.dispersion);
      gl.uniform1f(u.uReflection, s.reflection);
      gl.uniform1f(u.uFrost, s.frost);
      gl.uniform4f(u.uTint, s.color[0], s.color[1], s.color[2], s.tint * 1.6);
      gl.uniform1f(u.uShadow, s.shadow);
      const light = [-0.42, 0.55, 1];
      const length = Math.hypot(...light);
      gl.uniform3f(u.uLight, light[0] / length, light[1] / length, light[2] / length);
      gl.uniform1f(u.uPresence, presence);
      const footprint = bound * 1.6 * (SHADOW_SIZE / (SHADOW_SIZE - 6)) + 1;
      const footX = cx + (light[0] / light[2]) * height;
      const footY = cy + (light[1] / light[2]) * height;
      gl.uniform4f(u.uShadowBox, footX - footprint, footY - footprint, footprint * 2, footprint * 2);
      gl.uniform2f(u.uShadowSize, SHADOW_SIZE, SHADOW_SIZE);
      gl.uniform1i(u.uShadowMap, 2);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, null);
      if (s.shadow > 0) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, shadowTarget);
        gl.viewport(0, 0, SHADOW_SIZE, SHADOW_SIZE);
        gl.uniform1f(u.uPass, 1);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, shadowMap);
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(u.uPass, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      calm =
        !pointer.grabbed &&
        !flying &&
        morph.t >= 1 &&
        !morph.pending &&
        presence >= 1 &&
        Math.abs(s.spin) <= 1 &&
        Math.hypot(body.vx, body.vy) < 120 &&
        Math.abs(spring.vstretch) + Math.abs(spring.vtiltX) + Math.abs(spring.vtiltY) + Math.abs(spring.vscale) < 0.05;
      if (busy && visible && pageVisible) raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (raf || lost || !visible || !pageVisible) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    wakeRef.current = () => {
      calm = false;
      loadMedia();
      resize();
      wake();
    };

    const locate = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        inside:
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      const spot = locate(event);
      pointer.x = spot.x;
      pointer.y = spot.y;
      pointer.inside = spot.inside;
      if (spot.inside || pointer.grabbed) calm = false;
      wake();
    };
    const onPointerDown = (event: PointerEvent) => {
      const s = settingsRef.current;
      const spot = locate(event);
      if (!spot.inside) return;
      // Clicking a CTA in `children` must not grab or morph the glass behind it.
      if ((event.target as Element | null)?.closest?.(INTERACTIVE)) return;
      pointer.x = spot.x;
      pointer.y = spot.y;
      pointer.inside = true;
      pointer.down = true;
      const near = Math.hypot(spot.x - body.x, spot.y - body.y) < radius() * 1.1;
      if (s.interaction === 'drag' && near) {
        pointer.grabbed = true;
        container.setAttribute('data-grabbing', '');
        flying = false;
        pointer.offsetX = spot.x - body.x;
        pointer.offsetY = spot.y - body.y;
      }
      pointer.startX = spot.x;
      pointer.startY = spot.y;
      calm = false;
      wake();
    };
    const onPointerUp = (event: PointerEvent) => {
      const s = settingsRef.current;
      if (!pointer.down) return;
      pointer.down = false;
      const spot = locate(event);
      const moved = Math.hypot(spot.x - pointer.startX, spot.y - pointer.startY) > 6;
      const near = Math.hypot(spot.x - body.x, spot.y - body.y) < radius() * 1.1;
      if (pointer.grabbed) {
        pointer.grabbed = false;
        container.removeAttribute('data-grabbing');
        flying = Math.hypot(body.vx, body.vy) > 60;
        if (!flying) settle();
      }
      if (!moved && near && spot.inside) {
        spring.vstretch -= 3 * s.wobble;
        if (s.morphOnClick && s.cycle.length > 1) {
          const index = s.cycle.indexOf(morph.pending || morph.to);
          morph.pending = s.cycle[(index + 1) % s.cycle.length];
        }
      }
      if (event.pointerType !== 'mouse') pointer.inside = false;
      calm = false;
      wake();
    };
    const onLeave = () => {
      calm = false;
      pointer.inside = false;
      pointer.down = false;
      if (pointer.grabbed) {
        pointer.grabbed = false;
        container.removeAttribute('data-grabbing');
        settle();
      }
      wake();
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onLeave, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    const onLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onRestored = () => setGeneration(value => value + 1);
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      wake();
    });
    resizeObserver.observe(container);
    const playback = () => {
      if (!media.clip) return;
      if (visible && pageVisible) media.clip.play().catch(() => {});
      else media.clip.pause();
    };
    const intersection = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      playback();
      wake();
    });
    intersection.observe(container);
    const onVisibility = () => {
      pageVisible = document.visibilityState !== 'hidden';
      playback();
      wake();
    };
    document.addEventListener('visibilitychange', onVisibility);
    const onMotion = (event: MediaQueryListEvent) => {
      reduced = event.matches;
      calm = false;
      wake();
    };
    motionQuery.addEventListener('change', onMotion);
    const themeObserver = new MutationObserver(() => {
      drawText();
      wake();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style', 'data-theme']
    });
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (disposed) return;
        textState.key = '';
        drawText();
        wake();
      });
    }

    resize();
    request('content');
    request(`${settingsRef.current.shape}>${settingsRef.current.shape}`);
    loadMedia();
    wake();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      wakeRef.current = null;
      resizeObserver.disconnect();
      intersection.disconnect();
      themeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onLeave);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      motionQuery.removeEventListener('change', onMotion);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      releaseClip();
      if (!gl.isContextLost()) {
        programs.forEach(entry => {
          gl.deleteProgram(entry.program);
          gl.deleteShader(entry.fragment);
        });
        gl.deleteShader(vertex);
        gl.deleteTexture(mediaTexture);
        gl.deleteTexture(textTexture);
        gl.deleteTexture(shadowMap);
        gl.deleteFramebuffer(shadowTarget);
        gl.deleteVertexArray(vao);
      }
    };
  }, [generation]);

  return (
    <div
      ref={containerRef}
      className={`group relative h-full w-full overflow-hidden ${className}`.trim()}
      style={style}
      data-interaction={interaction}
      data-clickable={morphOnClick ? '' : undefined}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full"
        aria-hidden="true"
        style={unsupported ? { display: 'none' } : undefined}
      />
      {unsupported && text ? (
        <p
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center whitespace-pre-line text-center leading-none"
          style={{
            color: textColor,
            fontFamily,
            fontWeight,
            fontSize: fontSize ?? 'clamp(2.5rem, 9vw, 8rem)',
            letterSpacing: ARABIC.test(text) ? 'normal' : '-0.03em'
          }}
        >
          {text}
        </p>
      ) : null}
      <div
        ref={handleRef}
        className={
          HANDLE[interaction === 'drag' ? 'drag' : interaction === 'static' && morphOnClick ? 'button' : 'none']
        }
        aria-hidden="true"
      />
      {text ? <p className="sr-only whitespace-pre-line">{text}</p> : null}
      {children ? (
        <div className="pointer-events-none absolute inset-0 [&>*]:pointer-events-auto">{children}</div>
      ) : null}
    </div>
  );
};

export default FluidGlass;
```

## `app/components/reactbits/TechText.tsx`

```tsx
'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

type Box = { x1: number; y1: number; x2: number; y2: number };
type Art = { image: HTMLCanvasElement; left: number; top: number };
type Shape = { char: string; x: number; box: Box };
type Cell = { x: number; y: number; size: number; dx: number; dy: number; start: number; land: number };
type Glyph = Shape & {
  offset: { x: number; y: number };
  velocity: { x: number; y: number };
  outline: number;
  shown: number;
  cells: Cell[] | null;
  assembled: number;
  index: number;
  fill: Art;
  dashes: Art;
};
type Line = { y: number; label: string };
type Band = { y0: number; y1: number; up: boolean; order: number };
type Word = {
  size: number;
  baseline: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  lines: Line[];
  bands: Band[];
};
type Kick = { index: number; at: number; velocity: number };

export interface TechTextProps {
  text?: string;
  fontFamily?: string;
  fontWeight?: number;
  fontSize?: number;
  letterSpacing?: number;
  color?: string;
  accentColor?: string;
  align?: 'left' | 'center' | 'right';
  reach?: number;
  softness?: number;
  dashLength?: number;
  dashGap?: number;
  strokeWidth?: number;
  lineStyle?: 'dashed' | 'solid';
  reveal?: 'area' | 'letter' | 'off';
  specks?: number;
  selection?: boolean;
  labels?: boolean;
  draggable?: boolean;
  bounce?: number;
  sweep?: boolean;
  speed?: number;
  clickKick?: boolean;
  intro?: 'none' | 'type' | 'assemble' | 'metrics';
  introDuration?: number;
  guides?: boolean;
  className?: string;
  style?: CSSProperties;
}

type Settings = Required<Omit<TechTextProps, 'className' | 'style'>>;

const LABEL_FONT = '10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const FALLOFF_STEPS = 8;
const SPRING = 320;
const INHERIT = /^(currentcolor|inherit)$/i;
const INTRO_DELAY = 0.15;
const KICK_DECAY = 0.62;

const approach = (current: number, target: number, dt: number, seconds: number) =>
  current + (target - current) * (1 - Math.exp(-dt / seconds));

const clamp01 = (value: number) => Math.min(1, Math.max(0, Number(value) || 0));

const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

const noise = (...values: number[]) => {
  let h = 2166136261;
  for (const value of values) {
    h = Math.imul(h ^ (value | 0), 16777619);
    h ^= h >>> 13;
    h = Math.imul(h, 0x5bd1e995);
    h ^= h >>> 15;
  }
  return (h >>> 0) / 4294967296;
};

const signed = (value: number) => (value > 0 ? `+${value}` : value < 0 ? `−${-value}` : '0');

const TechText = ({
  text = 'React Bits',
  fontFamily = '',
  fontWeight = 600,
  fontSize = 150,
  letterSpacing = -0.05,
  color = 'currentColor',
  accentColor = 'currentColor',
  align = 'center',
  reach = 200,
  softness = 0.7,
  dashLength = 4,
  dashGap = 2,
  strokeWidth = 1.5,
  lineStyle = 'dashed',
  reveal = 'letter',
  specks = 15,
  selection = true,
  labels = true,
  draggable = true,
  bounce = 0.4,
  sweep = true,
  speed = 1,
  clickKick = true,
  intro = 'none',
  introDuration = 2,
  guides = false,
  className = '',
  style
}: TechTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settingsRef = useRef<Settings | null>(null);
  const wakeRef = useRef<() => void>(() => {});

  useEffect(() => {
    settingsRef.current = {
      text,
      fontFamily,
      fontWeight,
      fontSize,
      letterSpacing,
      color,
      accentColor,
      align,
      reach,
      softness,
      dashLength,
      dashGap,
      strokeWidth,
      lineStyle,
      reveal,
      specks,
      selection,
      labels,
      draggable,
      bounce,
      sweep,
      speed,
      clickKick,
      intro,
      introDuration,
      guides
    };
    wakeRef.current();
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const scratch = document.createElement('canvas');
    const scratchCtx = scratch.getContext('2d');
    if (!container || !canvas || !ctx || !scratchCtx) return undefined;

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let raf = 0;
    let last = performance.now();
    let visible = false;
    let alive = true;
    let layoutKey = '';
    let sizeDirty = true;
    let requestedFont = '';
    let word: Word | null = null;
    let glyphs: Glyph[] = [];
    let presence = 0;
    let clock = 0;
    let pulse = 0;
    let placed = false;
    let dragging = -1;
    let cursor = '';
    let introClock = 0;
    let introKind = '';
    let introducing = false;
    let fontsReady = !document.fonts;
    let guideAlpha = 0;
    const kicks: Kick[] = [];
    const press = { x: 0, y: 0, time: 0, index: -1 };
    const pointer = { x: 0, y: 0, inside: false };
    const grab = { x: 0, y: 0 };
    const lens = { x: 0, y: 0 };
    const frame = { x1: 0, y1: 0, x2: 0, y2: 0, alpha: 0, index: -1 };

    const refreshFonts = () => {
      layoutKey = '';
      wakeRef.current();
    };

    const fontsLoaded = () => {
      fontsReady = true;
      refreshFonts();
    };

    const family = (s: Settings) => s.fontFamily || getComputedStyle(container).fontFamily || 'sans-serif';
    const fontFor = (s: Settings, size: number) => `${s.fontWeight} ${size}px ${family(s)}`;

    const palette = (s: Settings) => {
      const current = getComputedStyle(container).color || '#000000';
      const pick = (value: string) => (!value || INHERIT.test(String(value).trim()) ? current : value);
      return { ink: pick(s.color), accent: pick(s.accentColor) };
    };

    const setFont = (target: CanvasRenderingContext2D, s: Settings, size: number) => {
      target.font = fontFor(s, size);
      if ('letterSpacing' in target) target.letterSpacing = `${s.letterSpacing * size}px`;
      target.textAlign = 'left';
      target.textBaseline = 'alphabetic';
    };

    const sprite = (s: Settings, view: Word, glyph: Shape, stroke: boolean, ink: string): Art => {
      const pad = Math.ceil(s.strokeWidth * 2 + 4);
      const left = glyph.box.x1 - pad;
      const top = glyph.box.y1 - pad;
      const w = glyph.box.x2 - glyph.box.x1 + pad * 2;
      const h = glyph.box.y2 - glyph.box.y1 + pad * 2;
      const image = document.createElement('canvas');
      image.width = Math.max(1, Math.ceil(w * dpr));
      image.height = Math.max(1, Math.ceil(h * dpr));
      const c = image.getContext('2d');
      if (!c) return { image, left, top };
      c.setTransform(dpr, 0, 0, dpr, -left * dpr, -top * dpr);
      setFont(c, s, view.size);
      if (stroke) {
        c.lineJoin = 'round';
        c.lineWidth = s.strokeWidth * 2;
        c.lineCap = 'butt';
        c.strokeStyle = ink;
        if (s.lineStyle !== 'solid') c.setLineDash([Math.max(1, s.dashLength), Math.max(1, s.dashGap)]);
        c.strokeText(glyph.char, glyph.x, view.baseline);
        c.setLineDash([]);
        c.globalCompositeOperation = 'destination-out';
        c.fillStyle = '#000000';
        c.fillText(glyph.char, glyph.x, view.baseline);
        c.globalCompositeOperation = 'source-over';
      } else {
        c.fillStyle = ink;
        c.fillText(glyph.char, glyph.x, view.baseline);
      }
      return { image, left, top };
    };

    const ensureLayout = (s: Settings, ink: string): Word => {
      const key = [
        s.text,
        family(s),
        s.fontWeight,
        s.fontSize,
        s.letterSpacing,
        s.align,
        ink,
        s.dashLength,
        s.dashGap,
        s.strokeWidth,
        s.lineStyle,
        width,
        height,
        dpr
      ].join('|');
      if (key === layoutKey && word) return word;
      layoutKey = key;
      const wanted = fontFor(s, 64);
      if (document.fonts && wanted !== requestedFont) {
        requestedFont = wanted;
        document.fonts.load(wanted, s.text).then(refreshFonts, refreshFonts);
      }

      const probe = scratchCtx;
      setFont(probe, s, s.fontSize);
      let m = probe.measureText(s.text);
      const fit = Math.min(
        1,
        (width * 0.9) / Math.max(m.actualBoundingBoxLeft + m.actualBoundingBoxRight, 1),
        (height * 0.66) / Math.max(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent, 1)
      );
      const size = s.fontSize * fit;
      setFont(probe, s, size);
      m = probe.measureText(s.text);
      const inkWidth = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
      const inkHeight = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
      const margin = width * 0.05;
      const start =
        s.align === 'left' ? margin : s.align === 'right' ? width - margin - inkWidth : (width - inkWidth) / 2;
      const x = start + m.actualBoundingBoxLeft;
      const baseline = (height - inkHeight) / 2 + m.actualBoundingBoxAscent;
      const xHeight = baseline - probe.measureText('x').actualBoundingBoxAscent;
      const capHeight = baseline - probe.measureText('H').actualBoundingBoxAscent;
      const ascender = baseline - probe.measureText('d').actualBoundingBoxAscent;
      const descender = baseline + probe.measureText('p').actualBoundingBoxDescent;
      const top = baseline - m.actualBoundingBoxAscent;
      const bottom = baseline + m.actualBoundingBoxDescent;
      const inkTop = Math.min(top, capHeight) - 2;
      const inkBottom = Math.max(bottom, baseline) + 2;
      const next: Word = {
        size,
        baseline,
        left: x - m.actualBoundingBoxLeft,
        right: x + m.actualBoundingBoxRight,
        top,
        bottom,
        lines: [
          { y: baseline, label: 'baseline' },
          { y: xHeight, label: 'x-height' },
          { y: capHeight, label: 'cap height' },
          ...(capHeight - ascender > Math.max(11, size * 0.06) ? [{ y: ascender, label: 'ascender' }] : []),
          { y: descender, label: 'descender' }
        ],
        bands: [
          { y0: xHeight, y1: baseline, up: true, order: 0 },
          { y0: capHeight, y1: xHeight, up: true, order: 1 },
          { y0: inkTop, y1: capHeight, up: true, order: 2 },
          { y0: baseline, y1: inkBottom, up: false, order: 1 }
        ].filter(band => band.y1 - band.y0 > 0.5)
      };
      word = next;

      const chars = Array.from(s.text);
      const previous = glyphs;
      glyphs = [];
      let prefix = '';
      chars.forEach((char, i) => {
        prefix += char;
        const own = probe.measureText(char);
        const gx = x + probe.measureText(prefix).width - own.width;
        if (!char.trim()) return;
        const base = {
          char,
          x: gx,
          box: {
            x1: gx - own.actualBoundingBoxLeft,
            y1: baseline - own.actualBoundingBoxAscent,
            x2: gx + own.actualBoundingBoxRight,
            y2: baseline + own.actualBoundingBoxDescent
          }
        };
        const kept = previous[glyphs.length];
        const sameGlyph = kept?.char === char && kept.index === i;
        glyphs.push({
          ...base,
          offset: sameGlyph ? kept.offset : { x: 0, y: 0 },
          velocity: sameGlyph ? kept.velocity : { x: 0, y: 0 },
          outline: sameGlyph ? kept.outline : 0,
          shown: sameGlyph ? kept.shown : 1,
          cells: null,
          assembled: 0,
          index: i,
          fill: sprite(s, next, base, false, ink),
          dashes: sprite(s, next, base, true, ink)
        });
      });
      if (dragging >= 0 && glyphs[dragging]?.index !== previous[dragging]?.index) dragging = -1;
      if (frame.index >= 0 && glyphs[frame.index]?.char !== previous[frame.index]?.char) frame.index = -1;
      return next;
    };

    const glyphAt = (x: number, y: number) => {
      if (!word || y < word.top - 24 || y > word.bottom + 24) return -1;
      let best = -1;
      let bestDistance = Infinity;
      glyphs.forEach((glyph, i) => {
        const x1 = glyph.box.x1 + glyph.offset.x;
        const x2 = glyph.box.x2 + glyph.offset.x;
        const d = x < x1 ? x1 - x : x > x2 ? x - x2 : 0;
        if (d < bestDistance) {
          bestDistance = d;
          best = i;
        }
      });
      return bestDistance < 28 ? best : -1;
    };

    const falloff = (
      target: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      radius: number,
      strength: number,
      softness: number
    ) => {
      const inner = Math.min(1, Math.max(0, 1 - softness));
      const gradient = target.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, `rgba(0, 0, 0, ${strength})`);
      if (inner > 0.995) {
        gradient.addColorStop(0.995, `rgba(0, 0, 0, ${strength})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        return gradient;
      }
      for (let i = 0; i <= FALLOFF_STEPS; i++) {
        const t = i / FALLOFF_STEPS;
        const eased = t * t * (3 - 2 * t);
        gradient.addColorStop(inner + (1 - inner) * t, `rgba(0, 0, 0, ${strength * (1 - eased)})`);
      }
      return gradient;
    };

    const blit = (
      target: CanvasRenderingContext2D,
      art: Art,
      dx: number,
      dy: number,
      originX: number,
      originY: number
    ) => {
      target.drawImage(
        art.image,
        Math.round((art.left + dx) * dpr - originX),
        Math.round((art.top + dy) * dpr - originY)
      );
    };

    const drawReveal = (s: Settings) => {
      const radius = s.reach * dpr;
      const cx = lens.x * dpr;
      const cy = lens.y * dpr;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = falloff(ctx, cx, cy, radius, presence, s.softness);
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
      ctx.globalCompositeOperation = 'source-over';

      const x0 = Math.max(0, Math.floor(cx - radius));
      const y0 = Math.max(0, Math.floor(cy - radius));
      const x1 = Math.min(canvas.width, Math.ceil(cx + radius));
      const y1 = Math.min(canvas.height, Math.ceil(cy + radius));
      if (x1 <= x0 || y1 <= y0) return;
      const w = x1 - x0;
      const h = y1 - y0;
      if (scratch.width < w || scratch.height < h) {
        scratch.width = Math.max(scratch.width, w);
        scratch.height = Math.max(scratch.height, h);
      }
      scratchCtx.setTransform(1, 0, 0, 1, 0, 0);
      scratchCtx.globalCompositeOperation = 'source-over';
      scratchCtx.clearRect(0, 0, w, h);
      for (const glyph of glyphs) blit(scratchCtx, glyph.dashes, glyph.offset.x, glyph.offset.y, x0, y0);
      scratchCtx.globalCompositeOperation = 'destination-in';
      scratchCtx.fillStyle = falloff(scratchCtx, cx - x0, cy - y0, radius, 1, s.softness);
      scratchCtx.fillRect(0, 0, w, h);
      scratchCtx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = presence;
      ctx.drawImage(scratch, 0, 0, w, h, x0, y0, w, h);
      ctx.globalAlpha = 1;
    };

    const crisp = (value: number) => (Math.round(value * dpr) + 0.5) / dpr;

    const perimeterPoint = (distance: number, w: number, h: number): [number, number, number, number] => {
      let d = ((distance % (2 * (w + h))) + 2 * (w + h)) % (2 * (w + h));
      if (d < w) return [frame.x1 + d, frame.y1, 0, -1];
      d -= w;
      if (d < h) return [frame.x2, frame.y1 + d, 1, 0];
      d -= h;
      if (d < w) return [frame.x2 - d, frame.y2, 0, 1];
      d -= w;
      return [frame.x1, frame.y2 - d, -1, 0];
    };

    const drawSpecks = (s: Settings, a: number, accent: string) => {
      const w = frame.x2 - frame.x1;
      const h = frame.y2 - frame.y1;
      if (w < 2 || h < 2) return;
      const perimeter = 2 * (w + h);
      const seed = frame.index + 1;
      const grid = 3;
      ctx.fillStyle = accent;
      ctx.strokeStyle = accent;

      for (let k = 0; k < s.specks; k++) {
        const period = 0.5 + noise(seed, k, 11) * 1.2;
        const t = pulse / period + noise(seed, k, 17);
        const cycle = Math.floor(t);
        const life = t - cycle;
        if (life > 0.7) continue;
        const [px, py, nx, ny] = perimeterPoint(noise(seed, k, cycle) * perimeter, w, h);
        const pick = noise(seed, k, cycle, 2);
        const size = pick < 0.46 ? 2 : pick < 0.7 ? 3 : pick < 0.84 ? 5 : pick < 0.94 ? 8 : 11;
        const large = size >= 8;
        const out = (large ? 9 : 4) + Math.floor(noise(seed, k, cycle, 1) * 5) * grid;
        const x = frame.x1 + Math.round((px + nx * out - frame.x1) / grid) * grid;
        const y = frame.y1 + Math.round((py + ny * out - frame.y1) / grid) * grid;
        const tone = noise(seed, k, cycle, 3);
        const blink = life < 0.06 || (life > 0.32 && life < 0.36) ? 0.35 : 1;
        const alpha = a * (large ? 0.3 + 0.4 * tone : 0.3 + 0.6 * tone) * blink;
        const left = Math.round(x - size / 2);
        const top = Math.round(y - size / 2);
        ctx.globalAlpha = alpha;
        if (tone < 0.26 || (large && tone < 0.78)) {
          ctx.strokeRect(left + 0.5, top + 0.5, size, size);
          if (large && tone > 0.5) ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
        } else {
          ctx.fillRect(left, top, size, size);
        }
      }

      for (let j = 0; j < 2; j++) {
        const head = (pulse * 0.42 * s.speed + j * 0.5) * perimeter;
        for (let i = 0; i < 4; i++) {
          const [x, y] = perimeterPoint(head - i * 6, w, h);
          const size = i === 0 ? 3 : 2;
          ctx.globalAlpha = a * [0.95, 0.55, 0.32, 0.16][i];
          ctx.fillRect(Math.round(x - size / 2), Math.round(y - size / 2), size, size);
        }
      }
      ctx.globalAlpha = 1;
    };

    const drawFrame = (s: Settings, accent: string) => {
      const glyph = glyphs[frame.index];
      if (!glyph || frame.alpha < 0.01) return;
      const a = frame.alpha;
      const x1 = crisp(frame.x1);
      const y1 = crisp(frame.y1);
      const x2 = crisp(frame.x2);
      const y2 = crisp(frame.y2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = accent;
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1;

      const moved = Math.hypot(glyph.offset.x, glyph.offset.y);
      if (moved > 1) {
        const hx = (glyph.box.x1 + glyph.box.x2) / 2;
        const hy = (glyph.box.y1 + glyph.box.y2) / 2;
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.lineTo(hx + glyph.offset.x, hy + glyph.offset.y);
        ctx.setLineDash([3, 4]);
        ctx.globalAlpha = 0.45 * a;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.rect(Math.round(hx) - 2, Math.round(hy) - 2, 4, 4);
        ctx.globalAlpha = 0.7 * a;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.rect(x1, y1, x2 - x1, y2 - y1);
      ctx.globalAlpha = 0.5 * a;
      ctx.stroke();

      ctx.beginPath();
      for (const [cx, cy] of [
        [x1, y1],
        [x2, y1],
        [x2, y2],
        [x1, y2]
      ]) {
        ctx.rect(Math.round(cx) - 2, Math.round(cy) - 2, 5, 5);
      }
      ctx.globalAlpha = 0.95 * a;
      ctx.fill();
      ctx.globalAlpha = 1;

      if (s.specks > 0) drawSpecks(s, a, accent);

      if (!s.labels) return;
      ctx.font = LABEL_FONT;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.62 * a;
      const label =
        moved > 1
          ? `${signed(Math.round(glyph.offset.x))}, ${signed(Math.round(-glyph.offset.y))}`
          : `${glyph.char}  ${Math.round(glyph.box.x2 - glyph.box.x1)} × ${Math.round(glyph.box.y2 - glyph.box.y1)}`;
      ctx.fillText(label, Math.round(frame.x1), Math.round(frame.y1) - 7);
      ctx.globalAlpha = 1;
    };

    const drawLines = (s: Settings, view: Word, accent: string, alpha: number, growth: (k: number) => number) => {
      const pad = Math.max(12, view.size * 0.12);
      const x1 = Math.round(view.left - pad);
      const x2 = Math.round(view.right + pad);
      const room = width - x2 > x1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.strokeStyle = accent;
      ctx.fillStyle = accent;
      ctx.lineWidth = 1;
      ctx.font = LABEL_FONT;
      ctx.textBaseline = 'middle';
      ctx.textAlign = room ? 'left' : 'right';
      view.lines.forEach((line, k) => {
        const grow = growth(k);
        if (grow <= 0.001) return;
        const y = crisp(line.y);
        const end = x1 + (x2 - x1) * grow;
        ctx.globalAlpha = alpha * 0.4;
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(end, y);
        ctx.stroke();
        ctx.globalAlpha = alpha * 0.9;
        ctx.fillRect(x1 - 1, Math.round(line.y) - 1, 3, 3);
        ctx.fillRect(Math.round(end) - 1, Math.round(line.y) - 1, 3, 3);
        if (s.labels) {
          ctx.globalAlpha = alpha * 0.62 * smoothstep(0.7, 1, grow);
          ctx.fillText(line.label, room ? x2 + 8 : x1 - 8, Math.round(line.y));
        }
      });
      ctx.textAlign = 'left';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
    };

    const ensureCells = (glyph: Glyph, view: Word): Cell[] => {
      if (glyph.cells) return glyph.cells;
      const art = glyph.fill;
      const size = Math.max(3, Math.round(view.size / 26));
      const w = art.image.width;
      const h = art.image.height;
      const source = art.image.getContext('2d');
      const cells: Cell[] = [];
      glyph.cells = cells;
      glyph.assembled = 0;
      if (!source || w < 2 || h < 2) return cells;
      const data = source.getImageData(0, 0, w, h).data;
      const gx = Math.floor(art.left / size) * size;
      const gy = Math.floor(art.top / size) * size;
      const cols = Math.ceil((art.left + w / dpr - gx) / size) + 1;
      const rows = Math.ceil((art.top + h / dpr - gy) / size) + 1;
      const hit = new Uint8Array(cols * rows);
      for (let py = 0; py < h; py++) {
        for (let px = 0; px < w; px++) {
          if (data[(py * w + px) * 4 + 3] < 24) continue;
          const cx = Math.floor((art.left + px / dpr - gx) / size);
          const cy = Math.floor((art.top + py / dpr - gy) / size);
          hit[cy * cols + cx] = 1;
        }
      }
      const center = (glyph.box.x1 + glyph.box.x2) / 2;
      const along = clamp01((center - view.left) / Math.max(1, view.right - view.left));
      for (let k = 0; k < hit.length; k++) {
        if (!hit[k]) continue;
        const angle = noise(glyph.index, k, 1) * Math.PI * 2;
        const distance = view.size * (0.25 + 0.6 * noise(glyph.index, k, 2));
        const start = 0.03 + 0.36 * along + 0.12 * noise(glyph.index, k, 3);
        const land = start + 0.3 + 0.14 * noise(glyph.index, k, 4);
        cells.push({
          x: gx + (k % cols) * size,
          y: gy + Math.floor(k / cols) * size,
          size,
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance * 0.7,
          start,
          land
        });
        glyph.assembled = Math.max(glyph.assembled, land);
      }
      return cells;
    };

    const cellRect = (x: number, y: number, size: number): [number, number, number, number] => {
      const left = Math.round(x * dpr);
      const top = Math.round(y * dpr);
      return [left, top, Math.round((x + size) * dpr) - left, Math.round((y + size) * dpr) - top];
    };

    const drawAssembling = (glyph: Glyph, progress: number, accent: string) => {
      const cells = glyph.cells || [];
      ctx.save();
      ctx.beginPath();
      let landed = 0;
      for (const cell of cells) {
        if (progress < cell.land) continue;
        const [x, y, w, h] = cellRect(cell.x, cell.y, cell.size);
        ctx.rect(x, y, w, h);
        landed++;
      }
      if (landed) {
        ctx.clip();
        blit(ctx, glyph.fill, 0, 0, 0, 0);
      }
      ctx.restore();
      ctx.fillStyle = accent;
      for (const cell of cells) {
        if (progress < cell.start || progress >= cell.land) continue;
        const u = (progress - cell.start) / (cell.land - cell.start);
        const eased = 1 - Math.pow(1 - u, 4);
        const size = cell.size * (0.4 + 0.6 * eased);
        const x = cell.x + (cell.size - size) / 2 + cell.dx * (1 - eased);
        const y = cell.y + (cell.size - size) / 2 + cell.dy * (1 - eased);
        const [left, top, w, h] = cellRect(x, y, size);
        ctx.globalAlpha = Math.min(1, u * 4) * (0.55 + 0.45 * eased);
        ctx.fillRect(left, top, Math.max(1, w), Math.max(1, h));
      }
      ctx.globalAlpha = 1;
    };

    const drawFilling = (glyph: Glyph, lead: number, progress: number, view: Word) => {
      const art = glyph.fill;
      const left = Math.floor(art.left * dpr);
      const top = Math.floor(art.top * dpr);
      const w = art.image.width + 2;
      const h = art.image.height + 2;
      const fill = clamp01((progress - 0.24 - 0.28 * lead) / 0.48);
      const rects: [number, number][] = [];
      for (const band of view.bands) {
        const amount = smoothstep(0.3 * band.order, 0.3 * band.order + 0.4, fill);
        if (amount <= 0) continue;
        const span = (band.y1 - band.y0) * amount;
        const y0 = Math.round((band.up ? band.y1 - span : band.y0) * dpr);
        const y1 = Math.round((band.up ? band.y1 : band.y0 + span) * dpr);
        if (y1 > y0) rects.push([y0, y1 - y0]);
      }
      const outline = smoothstep(0.08 + 0.2 * lead, 0.22 + 0.2 * lead, progress);
      if (outline > 0.001) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(left - 2, top - 2, w + 2, h + 2);
        for (const [y, span] of rects) ctx.rect(left - 2, y, w + 2, span);
        ctx.clip('evenodd');
        ctx.globalAlpha = outline;
        blit(ctx, glyph.dashes, 0, 0, 0, 0);
        ctx.restore();
      }
      if (rects.length) {
        ctx.save();
        ctx.beginPath();
        for (const [y, span] of rects) ctx.rect(left - 2, y, w + 2, span);
        ctx.clip();
        blit(ctx, glyph.fill, 0, 0, 0, 0);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    };

    const kick = (index: number) => {
      const strength = (word ? word.size : 120) * 11;
      kicks.push({ index, at: pulse, velocity: strength });
      for (let d = 1; d < glyphs.length; d++) {
        const velocity = strength * Math.pow(KICK_DECAY, d);
        if (velocity < 30) break;
        for (const j of [index - d, index + d]) {
          if (j >= 0 && j < glyphs.length) kicks.push({ index: j, at: pulse + d * 0.055, velocity });
        }
      }
      wakeRef.current();
    };

    const tick = (now: number) => {
      raf = 0;
      const s = settingsRef.current;
      if (!s) return;
      if (sizeDirty) {
        sizeDirty = false;
        width = Math.max(1, container.clientWidth);
        height = Math.max(1, container.clientHeight);
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        const pixelWidth = Math.round(width * dpr);
        const pixelHeight = Math.round(height * dpr);
        if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
        if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
      }
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      const { ink, accent } = palette(s);
      const view = ensureLayout(s, ink);
      const damping = 2 * Math.sqrt(SPRING) * (1 - clamp01(s.bounce) * 0.96);

      if (s.intro !== introKind) {
        introKind = s.intro;
        introClock = 0;
      }
      const introOn = introKind !== 'none' && !reducedMotion && glyphs.length > 0;
      if (introOn && fontsReady) introClock += dt;
      const progress = introOn ? clamp01((introClock - INTRO_DELAY) / Math.max(0.3, s.introDuration)) : 1;
      introducing = introOn && progress < 1;

      const sweeping = !introducing && s.sweep && !reducedMotion && !pointer.inside && dragging < 0;
      if (sweeping) clock += dt * s.speed;
      pulse += dt;
      let targetX = pointer.x;
      let targetY = pointer.y;
      if (sweeping) {
        targetX = view.left + (view.right - view.left) * (0.5 - 0.5 * Math.cos(clock * 0.45));
        targetY = view.top + (view.bottom - view.top) * (0.45 + 0.1 * Math.sin(clock * 0.8));
      }
      const active = !introducing && (pointer.inside || sweeping || dragging >= 0);
      if (active && !placed) {
        lens.x = targetX;
        lens.y = targetY;
      }
      if (active) {
        const lag = pointer.inside ? 0.05 : 0.22;
        lens.x = approach(lens.x, targetX, dt, lag);
        lens.y = approach(lens.y, targetY, dt, lag);
      }
      placed = active;
      presence = approach(presence, s.reveal === 'area' && active && dragging < 0 ? 1 : 0, dt, 0.16);

      for (let k = kicks.length - 1; k >= 0; k--) {
        if (kicks[k].at > pulse) continue;
        const glyph = glyphs[kicks[k].index];
        if (glyph) glyph.velocity.y -= kicks[k].velocity;
        kicks.splice(k, 1);
      }

      let moving = false;
      glyphs.forEach((glyph, i) => {
        if (i === dragging) {
          glyph.offset.x = approach(glyph.offset.x, pointer.x - grab.x, dt, 0.03);
          glyph.offset.y = approach(glyph.offset.y, pointer.y - grab.y, dt, 0.03);
          glyph.velocity.x = 0;
          glyph.velocity.y = 0;
          moving = true;
          return;
        }
        const { offset, velocity } = glyph;
        if (Math.abs(offset.x) < 0.05 && Math.abs(offset.y) < 0.05 && Math.hypot(velocity.x, velocity.y) < 0.5) {
          offset.x = 0;
          offset.y = 0;
          velocity.x = 0;
          velocity.y = 0;
          return;
        }
        velocity.x += (-SPRING * offset.x - damping * velocity.x) * dt;
        velocity.y += (-SPRING * offset.y - damping * velocity.y) * dt;
        offset.x += velocity.x * dt;
        offset.y += velocity.y * dt;
        moving = true;
      });

      let typing = -1;
      if (introducing && introKind === 'type') {
        const step = 0.86 / glyphs.length;
        const cursorAt = Math.min(glyphs.length - 1, Math.floor(progress / step));
        typing = progress < 0.93 ? cursorAt : -1;
        glyphs.forEach((glyph, i) => {
          glyph.shown = i < cursorAt ? 1 : i === cursorAt ? smoothstep(0, step * 0.3, progress - i * step) : 0;
        });
      } else {
        glyphs.forEach(glyph => {
          glyph.shown = 1;
        });
      }

      const focus = introducing ? typing : dragging >= 0 ? dragging : active ? glyphAt(lens.x, lens.y) : -1;
      if (focus >= 0 && s.selection) {
        const glyph = glyphs[focus];
        const bx1 = glyph.box.x1 + glyph.offset.x - 6;
        const by1 = glyph.box.y1 + glyph.offset.y - 6;
        const bx2 = glyph.box.x2 + glyph.offset.x + 6;
        const by2 = glyph.box.y2 + glyph.offset.y + 6;
        if (frame.index < 0 || frame.alpha < 0.02) {
          frame.x1 = bx1;
          frame.y1 = by1;
          frame.x2 = bx2;
          frame.y2 = by2;
        }
        const glide = focus === dragging ? 0.02 : 0.08;
        frame.x1 = approach(frame.x1, bx1, dt, glide);
        frame.y1 = approach(frame.y1, by1, dt, glide);
        frame.x2 = approach(frame.x2, bx2, dt, glide);
        frame.y2 = approach(frame.y2, by2, dt, glide);
        frame.index = focus;
      }
      frame.alpha = approach(frame.alpha, focus >= 0 && s.selection ? 1 : 0, dt, 0.1);

      glyphs.forEach((glyph, i) => {
        const target = introducing
          ? introKind === 'type' && (i === typing || (typing >= 0 && i > typing))
            ? 1
            : 0
          : s.reveal === 'letter' && i === focus && i !== dragging
            ? 1
            : 0;
        if (introducing && glyph.shown === 0) glyph.outline = target;
        glyph.outline = approach(glyph.outline, target, dt, 0.09);
        if (Math.abs(glyph.outline - target) > 0.002) moving = true;
        else glyph.outline = target;
      });

      guideAlpha = approach(guideAlpha, s.guides && !introducing && (focus >= 0 || presence > 0.4) ? 1 : 0, dt, 0.14);

      const hovering = !introducing && focus >= 0 && pointer.inside;
      const nextCursor =
        dragging >= 0 ? 'grabbing' : hovering && s.draggable ? 'grab' : hovering && s.clickKick ? 'pointer' : '';
      if (nextCursor !== cursor) {
        cursor = nextCursor;
        container.style.cursor = nextCursor;
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const glyph of glyphs) {
        const moved = Math.hypot(glyph.offset.x, glyph.offset.y);
        if (moved > 1) {
          ctx.globalAlpha = Math.min(1, moved / 24) * 0.55;
          blit(ctx, glyph.dashes, 0, 0, 0, 0);
          ctx.globalAlpha = 1;
        }
      }
      if (introducing && introKind === 'metrics') {
        drawLines(s, view, accent, 1 - smoothstep(0.84, 1, progress), k =>
          smoothstep(0.02 + 0.04 * k, 0.2 + 0.04 * k, progress)
        );
      } else if (guideAlpha > 0.005) {
        drawLines(s, view, accent, guideAlpha * 0.6, () => 1);
      }
      glyphs.forEach((glyph, i) => {
        if (introducing && introKind === 'assemble') {
          ensureCells(glyph, view);
          if (progress < glyph.assembled) {
            drawAssembling(glyph, progress, accent);
            return;
          }
        }
        if (introducing && introKind === 'metrics') {
          const lead = glyphs.length > 1 ? i / (glyphs.length - 1) : 0;
          if (progress < 0.72 + 0.28 * lead) {
            drawFilling(glyph, lead, progress, view);
            return;
          }
        }
        if (glyph.shown < 0.001) return;
        if (glyph.outline < 0.999) {
          ctx.globalAlpha = (1 - glyph.outline) * glyph.shown;
          blit(ctx, glyph.fill, glyph.offset.x, glyph.offset.y, 0, 0);
        }
        if (glyph.outline > 0.001) {
          ctx.globalAlpha = glyph.outline * glyph.shown;
          blit(ctx, glyph.dashes, glyph.offset.x, glyph.offset.y, 0, 0);
        }
        ctx.globalAlpha = 1;
      });
      if (presence > 0.001) drawReveal(s);
      drawFrame(s, accent);

      const settling =
        moving ||
        introducing ||
        kicks.length > 0 ||
        (guideAlpha > 0.005 && guideAlpha < 0.995) ||
        Math.abs(presence - (s.reveal === 'area' && active && dragging < 0 ? 1 : 0)) > 0.002 ||
        (frame.alpha > 0.01 && frame.alpha < 0.99);
      if ((active || settling) && visible && alive) raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (raf || !visible || !alive) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    wakeRef.current = wake;

    const resize = () => {
      sizeDirty = true;
      wake();
    };

    const locate = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onMove = (e: PointerEvent) => {
      locate(e);
      pointer.inside = true;
      wake();
    };
    const onLeave = () => {
      if (dragging >= 0) return;
      pointer.inside = false;
      wake();
    };
    const onDown = (e: PointerEvent) => {
      locate(e);
      pointer.inside = true;
      const s = settingsRef.current;
      const primary = e.pointerType !== 'mouse' || e.button === 0;
      const index = introducing || !primary ? -1 : glyphAt(pointer.x, pointer.y);
      press.x = pointer.x;
      press.y = pointer.y;
      press.time = performance.now();
      press.index = index;
      if (s?.draggable && index >= 0) {
        dragging = index;
        grab.x = pointer.x - glyphs[index].offset.x;
        grab.y = pointer.y - glyphs[index].offset.y;
        container.setPointerCapture?.(e.pointerId);
      }
      wake();
    };
    const onUp = (e: PointerEvent) => {
      if (dragging >= 0) {
        dragging = -1;
        container.releasePointerCapture?.(e.pointerId);
        const rect = container.getBoundingClientRect();
        pointer.inside =
          e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      }
      if (
        e.type === 'pointerup' &&
        press.index >= 0 &&
        settingsRef.current?.clickKick &&
        !reducedMotion &&
        performance.now() - press.time < 450
      ) {
        const rect = container.getBoundingClientRect();
        if (Math.hypot(e.clientX - rect.left - press.x, e.clientY - rect.top - press.y) < 6) kick(press.index);
      }
      press.index = -1;
      wake();
    };

    container.addEventListener('pointermove', onMove, { passive: true });
    container.addEventListener('pointerenter', onMove, { passive: true });
    container.addEventListener('pointerdown', onDown, { passive: true });
    container.addEventListener('pointerup', onUp, { passive: true });
    container.addEventListener('pointercancel', onUp, { passive: true });
    container.addEventListener('pointerleave', onLeave, { passive: true });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    window.addEventListener('resize', resize, { passive: true });
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    intersectionObserver.observe(container);
    const themeObserver = new MutationObserver(wake);
    for (const node of [document.documentElement, document.body]) {
      if (node) themeObserver.observe(node, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] });
    }
    const schemeQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
    schemeQuery?.addEventListener?.('change', wake);
    if (document.fonts) document.fonts.ready.then(fontsLoaded, fontsLoaded);

    resize();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      wakeRef.current = () => {};
      resizeObserver.disconnect();
      window.removeEventListener('resize', resize);
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      schemeQuery?.removeEventListener?.('change', wake);
      container.style.cursor = '';
      container.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerenter', onMove);
      container.removeEventListener('pointerdown', onDown);
      container.removeEventListener('pointerup', onUp);
      container.removeEventListener('pointercancel', onUp);
      container.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full touch-pan-y select-none ${className}`.trim()}
      style={style}
      role="img"
      aria-label={text}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default TechText;
```

## `app/components/reactbits/MaskedHeading.tsx`

```tsx
'use client';

import React, { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef } from 'react';
import type { CSSProperties, ElementType } from 'react';
import { gsap } from 'gsap';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const clamp = (v: number, a: number, b: number): number => (v < a ? a : v > b ? b : v);

const SPOT_MASK = `radial-gradient(circle var(--mh-spot-r, 160px) at var(--mh-spot-x, 50%) var(--mh-spot-y, 50%), ${Array.from(
  { length: 9 },
  (_, i) => {
    const t = i / 8;
    const u = clamp((t - 0.1) / 0.9, 0, 1);
    return `rgba(0, 0, 0, ${(u * u * u * (u * (u * 6 - 15) + 10)).toFixed(3)}) ${(t * 100).toFixed(1)}%`;
  }
).join(', ')})`;

type Reveal = 'rise' | 'scale' | 'blur' | 'wipe' | 'fade' | 'none';
type Trigger = 'view' | 'mount' | 'hover';

export interface MaskedHeadingProps {
  text?: string;
  tag?: ElementType;
  mediaType?: 'image' | 'video';
  src?: string;
  poster?: string;
  fillScale?: number;
  parallax?: number;
  drift?: number;
  hoverZoom?: number;
  brightness?: number;
  saturation?: number;
  grayscale?: boolean;
  tint?: string;
  spotlight?: boolean;
  spotlightRadius?: number;
  outline?: boolean;
  outlineColor?: string;
  outlineWidth?: number;
  reveal?: Reveal;
  duration?: number;
  stagger?: number;
  trigger?: Trigger;
  align?: 'left' | 'center' | 'right';
  weight?: number;
  tracking?: number;
  lineHeight?: number;
  textScale?: number;
  className?: string;
  style?: CSSProperties;
  [key: string]: unknown;
}

interface Settings {
  fillScale: number;
  parallax: number;
  drift: number;
  hoverZoom: number;
  brightness: number;
  saturation: number;
  grayscale: boolean;
  textScale: number;
  spotlight: boolean;
}

interface GlyphBox {
  x: number;
  y: number;
  w: number;
  cx: number;
  cy: number;
  lc: number;
}

interface GlyphState {
  x: number;
  y: number;
  s: number;
}

const MaskedHeading: React.FC<MaskedHeadingProps> = ({
  text = 'Designed in the details',
  tag = 'h2',
  mediaType = 'image',
  src = '',
  poster = '',
  fillScale = 1.25,
  parallax = 26,
  drift = 18,
  hoverZoom = 0,
  brightness = 1,
  saturation = 1,
  grayscale = false,
  tint = '',
  spotlight = false,
  spotlightRadius = 160,
  outline = false,
  outlineColor = '',
  outlineWidth = 1,
  reveal = 'rise',
  duration = 1.1,
  stagger = 0.09,
  trigger = 'view',
  align = 'center',
  weight = 700,
  tracking = -0.03,
  lineHeight = 1.06,
  textScale = 0.115,
  className = '',
  style,
  ...rest
}: MaskedHeadingProps) => {
  const rootRef = useRef<HTMLElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const revealRef = useRef<HTMLSpanElement | null>(null);
  const clipRef = useRef<HTMLSpanElement | null>(null);
  const mediaRef = useRef<HTMLSpanElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const baseRefs = useRef<(HTMLElement | null)[]>([]);
  const glyphRefs = useRef<(SVGTextElement | null)[]>([]);
  const lineRefs = useRef<(SVGTextElement | null)[]>([]);
  const boxesRef = useRef<GlyphBox[]>([]);
  const statesRef = useRef<GlyphState[]>([]);
  const tweenRef = useRef<gsap.core.Animation | null>(null);
  const offsetRef = useRef({ x: 0, y: 0, tx: 0, ty: 0, zoom: 0, px: 0, py: 0, sx: 0, sy: 0, lit: false });
  const paintRef = useRef({ transform: '', filter: '', spot: '' });
  const wakeRef = useRef<() => void>(() => {});

  const clipId = `mh-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const words = useMemo(() => String(text).split(/\s+/).filter(Boolean), [text]);
  const glyphs = useMemo(() => words.flatMap((word, w) => Array.from(word).map(char => ({ char, w }))), [words]);

  const settingsRef = useRef<Settings>({
    fillScale: 1,
    parallax: 0,
    drift: 0,
    hoverZoom: 0,
    brightness: 1,
    saturation: 1,
    grayscale: false,
    textScale: 0.115,
    spotlight: false
  });
  settingsRef.current = {
    fillScale,
    parallax,
    drift,
    hoverZoom,
    brightness,
    saturation,
    grayscale,
    textScale,
    spotlight
  };

  const place = useCallback(() => {
    const root = rootRef.current;
    const media = mediaRef.current;
    if (!root || !media) return;
    const s = settingsRef.current;
    const off = offsetRef.current;
    const scale = s.fillScale * (1 + Math.max(0, off.zoom));
    const maxX = Math.max(0, ((scale - 1) / 2) * root.clientWidth);
    const maxY = Math.max(0, ((scale - 1) / 2) * root.clientHeight);

    const transform = `translate3d(${clamp(off.x, -maxX, maxX).toFixed(2)}px, ${clamp(off.y, -maxY, maxY).toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
    const filter = `brightness(${s.brightness}) saturate(${s.saturation})${s.grayscale ? ' grayscale(1)' : ''}`;
    const paint = paintRef.current;
    if (paint.transform !== transform) {
      paint.transform = transform;
      media.style.transform = transform;
    }
    if (paint.filter !== filter) {
      paint.filter = filter;
      media.style.filter = filter;
    }

    const clip = clipRef.current;
    if (clip && s.spotlight) {
      const spot = `${off.sx.toFixed(1)}px ${off.sy.toFixed(1)}px`;
      if (paint.spot !== spot) {
        paint.spot = spot;
        clip.style.setProperty('--mh-spot-x', `${off.sx.toFixed(1)}px`);
        clip.style.setProperty('--mh-spot-y', `${off.sy.toFixed(1)}px`);
      }
    }
  }, []);

  const renderGlyphs = useCallback(() => {
    const boxes = boxesRef.current;
    const states = statesRef.current;
    for (let i = 0; i < glyphRefs.current.length; i += 1) {
      const glyph = glyphRefs.current[i];
      if (!glyph) continue;
      const box = boxes[i];
      const st = states[i];
      if (!box || !st || (st.x === 0 && st.y === 0 && st.s === 1)) {
        if (glyph.hasAttribute('transform')) glyph.removeAttribute('transform');
        continue;
      }
      const s = Math.max(st.s, 0.0001);
      const tx = box.cx * (1 - s) + st.x * (box.cx - box.lc);
      const ty = box.cy * (1 - s) + st.y;
      glyph.setAttribute('transform', `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(4)})`);
    }
  }, []);

  const sync = useCallback(() => {
    const root = rootRef.current;
    const measure = measureRef.current;
    if (!root || !measure) return;
    const s = settingsRef.current;

    root.style.fontSize = `${clamp(root.clientWidth * s.textScale, 20, 200).toFixed(1)}px`;

    const cs = window.getComputedStyle(measure);
    const fontPx = parseFloat(cs.fontSize) || 48;
    const rootRect = root.getBoundingClientRect();
    const ratio = root.offsetWidth ? rootRect.width / root.offsetWidth || 1 : 1;
    const range = document.createRange();
    const boxes: GlyphBox[] = [];
    let index = 0;

    for (let w = 0; w < wordRefs.current.length; w += 1) {
      const box = wordRefs.current[w];
      const base = baseRefs.current[w];
      const node = box?.firstChild as Text | null | undefined;
      if (!box || !base || !node || node.nodeType !== 3) {
        index += Array.from(box?.textContent ?? '').length;
        continue;
      }
      const boxRect = box.getBoundingClientRect();
      const baseline = base.offsetTop;
      let offset = 0;
      for (const char of Array.from(node.data)) {
        range.setStart(node, offset);
        range.setEnd(node, offset + char.length);
        offset += char.length;
        const r = range.getBoundingClientRect();
        const x = box.offsetLeft + (r.left - boxRect.left) / ratio;
        const width = r.width / ratio;
        boxes[index] = { x, y: baseline, w: width, cx: x + width / 2, cy: baseline - fontPx * 0.36, lc: 0 };
        index += 1;
      }
    }
    const lines = new Map<number, { left: number; right: number }>();
    for (const box of boxes) {
      if (!box) continue;
      const line = lines.get(box.y) ?? { left: Infinity, right: -Infinity };
      line.left = Math.min(line.left, box.x);
      line.right = Math.max(line.right, box.x + box.w);
      lines.set(box.y, line);
    }
    for (const box of boxes) {
      if (!box) continue;
      const line = lines.get(box.y);
      if (line) box.lc = (line.left + line.right) / 2;
    }
    boxesRef.current = boxes;

    const write = (el: SVGTextElement) => {
      if (!el) return;
      el.style.fontFamily = cs.fontFamily;
      el.style.fontSize = cs.fontSize;
      el.style.fontWeight = cs.fontWeight;
      el.style.fontStyle = cs.fontStyle;
      el.style.letterSpacing = cs.letterSpacing;
    };
    for (let i = 0; i < boxes.length; i += 1) {
      const box = boxes[i];
      for (const el of [glyphRefs.current[i], lineRefs.current[i]]) {
        if (!el || !box) continue;
        el.setAttribute('x', box.x.toFixed(2));
        el.setAttribute('y', `${box.y}`);
        write(el);
      }
    }
    renderGlyphs();
    place();
  }, [place, renderGlyphs]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    let alive = true;
    let needsSync = false;
    const ro = new ResizeObserver(() => {
      needsSync = true;
      wake();
    });
    ro.observe(root);
    if (document.fonts?.ready) document.fonts.ready.then(() => alive && sync()).catch(() => {});

    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const off = offsetRef.current;
    let raf = 0;
    let last = 0;
    let clock = 0;
    let visible = true;
    let hovering = false;

    const frame = (now: number) => {
      raf = 0;
      if (needsSync) {
        needsSync = false;
        sync();
      }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      const s = settingsRef.current;
      const still = !!motionQuery?.matches;

      if (still) {
        off.x = 0;
        off.y = 0;
        off.zoom = 0;
      } else {
        clock += dt;
        const dx = Math.sin(clock * 0.21) * s.drift;
        const dy = Math.cos(clock * 0.17) * s.drift * 0.6;
        const ease = 1 - Math.exp(-dt / 0.18);
        off.x += (off.tx + dx - off.x) * ease;
        off.y += (off.ty + dy - off.y) * ease;
        off.zoom += ((hovering ? s.hoverZoom : 0) - off.zoom) * (1 - Math.exp(-dt / 0.35));
      }

      if (s.spotlight) {
        const w = root.clientWidth;
        const h = root.clientHeight;
        let gx = w / 2;
        let gy = h / 2;
        if (hovering) {
          gx = off.px;
          gy = off.py;
        } else if (!still) {
          gx = w * (0.5 + 0.36 * Math.sin(clock * 0.37));
          gy = h * (0.5 + 0.22 * Math.sin(clock * 0.61 + 0.9));
        }
        if (!off.lit || still) {
          off.sx = gx;
          off.sy = gy;
          off.lit = true;
        } else {
          const follow = 1 - Math.exp(-dt / (hovering ? 0.12 : 0.6));
          off.sx += (gx - off.sx) * follow;
          off.sy += (gy - off.sy) * follow;
        }
      } else {
        off.lit = false;
      }

      place();
      if (visible && !still && alive) raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (raf || !alive) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    wakeRef.current = wake;

    const onMove = (e: PointerEvent) => {
      const s = settingsRef.current;
      const r = root.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / (r.width || 1)) * 2 - 1;
      const ny = ((e.clientY - r.top) / (r.height || 1)) * 2 - 1;
      off.tx = clamp(nx, -1, 1) * -Math.max(0, s.parallax);
      off.ty = clamp(ny, -1, 1) * -Math.max(0, s.parallax);
      off.px = ((e.clientX - r.left) / (r.width || 1)) * root.clientWidth;
      off.py = ((e.clientY - r.top) / (r.height || 1)) * root.clientHeight;
      if (s.spotlight) wake();
    };

    const onEnter = (e: PointerEvent) => {
      hovering = e.pointerType !== 'touch';
      onMove(e);
      wake();
    };

    const onLeave = () => {
      hovering = false;
      off.tx = 0;
      off.ty = 0;
      wake();
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    io.observe(root);

    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerenter', onEnter);
    root.addEventListener('pointerleave', onLeave);
    wake();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      raf = 0;
      wakeRef.current = () => {};
      ro.disconnect();
      io.disconnect();
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerenter', onEnter);
      root.removeEventListener('pointerleave', onLeave);
    };
  }, [place, sync]);

  useEffect(() => {
    wakeRef.current();
  });

  useEffect(() => {
    const video = mediaRef.current?.querySelector('video');
    if (video && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) video.pause();
  }, [mediaType, src]);

  useIsomorphicLayoutEffect(() => {
    sync();
  }, [sync, words, tag, align, weight, tracking, lineHeight, textScale, outline]);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const layer = revealRef.current;
    if (!root || !layer) return undefined;
    const states: GlyphState[] = glyphs.map(() => ({ x: 0, y: 0, s: 1 }));
    statesRef.current = states;
    if (!states.length) return undefined;

    const em = () => parseFloat(window.getComputedStyle(root).fontSize) || 48;
    const wordDelay = (i: number) => glyphs[i].w * stagger;
    const letterDelay = (i: number) => i * stagger * 0.35;

    const clearLayer = () => {
      gsap.set(layer, { opacity: 1, scale: 1 });
      layer.style.clipPath = '';
      layer.style.filter = '';
    };

    const settle = () => {
      states.forEach(st => {
        st.x = 0;
        st.y = 0;
        st.s = 1;
      });
      renderGlyphs();
      clearLayer();
    };

    const rest = () => {
      const size = em();
      if (reveal === 'rise') {
        states.forEach(st => {
          st.y = size * 1.15;
        });
      } else if (reveal === 'scale') {
        states.forEach(st => {
          st.y = size * 0.1;
          st.s = 0;
        });
      } else if (reveal === 'blur') {
        states.forEach(st => {
          st.x = 0.22;
        });
        gsap.set(layer, { opacity: 0 });
        layer.style.filter = `blur(${(size * 0.3).toFixed(2)}px)`;
      } else if (reveal === 'wipe') {
        layer.style.clipPath = 'inset(0% 100% 0% 0%)';
      } else if (reveal === 'fade') {
        gsap.set(layer, { opacity: 0, scale: 1.08 });
      }
      renderGlyphs();
    };

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reveal === 'none' || reduce) {
      settle();
      return undefined;
    }

    const play = () => {
      tweenRef.current?.kill();
      const size = em();
      if (reveal === 'rise') {
        clearLayer();
        tweenRef.current = gsap.fromTo(
          states,
          { x: 0, y: size * 1.15, s: 1 },
          { y: 0, duration, stagger: wordDelay, ease: 'power4.out', overwrite: 'auto', onUpdate: renderGlyphs }
        );
        renderGlyphs();
      } else if (reveal === 'scale') {
        clearLayer();
        tweenRef.current = gsap.fromTo(
          states,
          { x: 0, y: size * 0.1, s: 0 },
          { y: 0, s: 1, duration, stagger: letterDelay, ease: 'expo.out', overwrite: 'auto', onUpdate: renderGlyphs }
        );
        renderGlyphs();
      } else if (reveal === 'blur') {
        const focus = { blur: size * 0.3, opacity: 0 };
        gsap.set(layer, { scale: 1, opacity: 0 });
        layer.style.clipPath = '';
        layer.style.filter = `blur(${focus.blur.toFixed(2)}px)`;
        const timeline = gsap.timeline({ onUpdate: renderGlyphs });
        timeline.fromTo(states, { x: 0.22, y: 0, s: 1 }, { x: 0, duration: duration * 1.2, ease: 'expo.out' }, 0);
        timeline.to(
          focus,
          {
            blur: 0,
            opacity: 1,
            duration: duration * 1.2,
            ease: 'power2.out',
            onUpdate: () => {
              layer.style.filter = focus.blur > 0.05 ? `blur(${focus.blur.toFixed(2)}px)` : '';
              layer.style.opacity = focus.opacity.toFixed(3);
            }
          },
          0
        );
        tweenRef.current = timeline;
        renderGlyphs();
      } else if (reveal === 'wipe') {
        settle();
        layer.style.clipPath = 'inset(0% 100% 0% 0%)';
        const state = { p: 100 };
        tweenRef.current = gsap.to(state, {
          p: 0,
          duration,
          ease: 'power3.inOut',
          overwrite: 'auto',
          onUpdate: () => {
            layer.style.clipPath = `inset(0% ${state.p}% 0% 0%)`;
          }
        });
      } else {
        settle();
        tweenRef.current = gsap.fromTo(
          layer,
          { opacity: 0, scale: 1.08 },
          { opacity: 1, scale: 1, duration, ease: 'power3.out', overwrite: 'auto' }
        );
      }
    };

    if (trigger === 'hover') {
      settle();
      root.addEventListener('pointerenter', play);
      return () => {
        root.removeEventListener('pointerenter', play);
        tweenRef.current?.kill();
      };
    }

    if (trigger === 'view') {
      settle();
      rest();
      const io = new IntersectionObserver(
        entries => {
          if (entries.some(e => e.isIntersecting)) {
            play();
            io.disconnect();
          }
        },
        { threshold: 0.25 }
      );
      io.observe(root);
      return () => {
        io.disconnect();
        tweenRef.current?.kill();
      };
    }

    play();
    return () => tweenRef.current?.kill();
  }, [reveal, trigger, duration, stagger, glyphs, renderGlyphs]);

  const Tag = tag as unknown as React.FC<Record<string, unknown>>;

  return (
    <Tag
      ref={rootRef}
      className={`relative w-full m-0 p-0 antialiased [text-wrap:balance] ${className}`.trim()}
      style={{
        textAlign: align,
        fontWeight: weight,
        letterSpacing: `${tracking}em`,
        lineHeight,
        ...style
      }}
      {...rest}
    >
      <span ref={measureRef} className="text-transparent">
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            ref={(el: HTMLSpanElement | null) => {
              wordRefs.current[i] = el;
            }}
            className="inline-block whitespace-pre [&:not(:last-child)]:after:content-['_']"
          >
            {word}
            <i
              ref={(el: HTMLElement | null) => {
                baseRefs.current[i] = el;
              }}
              className="inline-block w-0 h-0"
            />
          </span>
        ))}
      </span>

      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            {glyphs.map((glyph, i) => (
              <text
                key={i}
                ref={(el: SVGTextElement | null) => {
                  glyphRefs.current[i] = el;
                }}
              >
                {glyph.char}
              </text>
            ))}
          </clipPath>
        </defs>
      </svg>

      <span ref={revealRef} className="absolute inset-0 block pointer-events-none">
        <span
          ref={clipRef}
          className="absolute inset-0 block"
          style={
            {
              clipPath: `url(#${clipId})`,
              ['--mh-spot-r' as string]: `${Math.max(1, spotlightRadius)}px`
            } as CSSProperties
          }
        >
          <span
            ref={mediaRef}
            className="absolute inset-0 block [background:color-mix(in_srgb,currentColor_10%,transparent)] [will-change:transform,filter]"
          >
            {mediaType === 'video' ? (
              <video
                className="block w-full h-full object-cover select-none"
                src={src || undefined}
                poster={poster || undefined}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                className="block w-full h-full object-cover select-none"
                src={src || undefined}
                alt=""
                draggable={false}
              />
            )}
          </span>
          {tint ? (
            <span className="absolute inset-0 block mix-blend-color pointer-events-none" style={{ background: tint }} />
          ) : null}
          {spotlight ? (
            <>
              <span
                className="absolute inset-0 block pointer-events-none bg-[#808080] mix-blend-saturation"
                style={{ maskImage: SPOT_MASK, WebkitMaskImage: SPOT_MASK }}
              />
              <span
                className="absolute inset-0 block pointer-events-none bg-black opacity-55"
                style={{ maskImage: SPOT_MASK, WebkitMaskImage: SPOT_MASK }}
              />
            </>
          ) : null}
        </span>
      </span>

      {outline ? (
        <svg
          className="absolute inset-0 w-full h-full overflow-visible pointer-events-none fill-none [stroke-linejoin:round]"
          aria-hidden="true"
          focusable="false"
          style={{ stroke: outlineColor || 'currentColor', strokeWidth: Math.max(0, outlineWidth) }}
        >
          {glyphs.map((glyph, i) => (
            <text
              key={i}
              ref={(el: SVGTextElement | null) => {
                lineRefs.current[i] = el;
              }}
            >
              {glyph.char}
            </text>
          ))}
        </svg>
      ) : null}
    </Tag>
  );
};

export default MaskedHeading;
```

## `app/components/reactbits/CircularText.tsx` (import switched to framer-motion)

```tsx
'use client';

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { cancelFrame, frame, motion, useMotionValue, useReducedMotion, useSpring, type FrameData } from 'framer-motion';

type HoverMode = 'slowDown' | 'speedUp' | 'pause' | 'goBonkers';

interface CircularTextProps {
  text: string;
  spinDuration?: number;
  onHover?: HoverMode;
  direction?: 'clockwise' | 'counterclockwise';
  size?: number;
  fontSize?: number;
  fontWeight?: number;
  letterSpacing?: number;
  color?: string;
  startAngle?: number;
  fill?: boolean;
  repeat?: number;
  ring?: boolean;
  ringColor?: string;
  tilt?: number;
  hoverTilt?: number;
  draggable?: boolean;
  children?: React.ReactNode;
  className?: string;
}

interface SpinState {
  dragging: boolean;
  hovering: boolean;
  fling: number;
  cruise: number;
  angle: number | null;
  travel: number;
  samples: [number, number][];
}

const HOVER_SPEED: Record<HoverMode, number> = { slowDown: 0.5, speedUp: 4, pause: 0, goBonkers: 20 };
const MAX_FLING = 1440;
const LETTER_EASE = 'transition-transform duration-500 ease-[cubic-bezier(0,0,0,1)]';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const clamp = (v: number, a: number, b: number): number => (v < a ? a : v > b ? b : v);

const CircularText: React.FC<CircularTextProps> = ({
  text,
  spinDuration = 20,
  onHover = 'speedUp',
  direction = 'clockwise',
  size = 200,
  fontSize = 24,
  fontWeight = 900,
  letterSpacing = 0,
  color = '',
  startAngle = 0,
  fill = true,
  repeat = 1,
  ring = false,
  ringColor = '',
  tilt = 0,
  hoverTilt = 0,
  draggable = false,
  children,
  className = ''
}: CircularTextProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const glyphRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const stateRef = useRef<SpinState>({
    dragging: false,
    hovering: false,
    fling: 0,
    cruise: 0,
    angle: null,
    travel: 0,
    samples: []
  });
  const [advances, setAdvances] = useState<number[] | null>(null);
  const [settled, setSettled] = useState(false);
  const [dragging, setDragging] = useState(false);
  const reduceMotion = useReducedMotion();
  const rotation = useMotionValue(0);
  const speed = useSpring(1, { stiffness: 60, damping: 18 });
  const scale = useSpring(1, { stiffness: 300, damping: 20 });
  const tiltX = useSpring(0, { stiffness: 150, damping: 18 });
  const tiltY = useSpring(0, { stiffness: 150, damping: 18 });

  const glyphs = useMemo(() => Array.from(text ?? ''), [text]);
  const copies = Math.max(1, Math.round(repeat) || 1);
  const letters = useMemo(() => Array.from({ length: copies }, () => glyphs).flat(), [glyphs, copies]);

  const angles = useMemo(() => {
    const count = glyphs.length;
    if (!count) return [];
    if (fill) return letters.map((_, i) => startAngle + (360 / letters.length) * i);
    const known = advances && advances.length === count ? advances : null;
    const toDegrees = 180 / (Math.PI * Math.max(size / 2 - fontSize * 0.6, 1));
    const arcs = glyphs.map((glyph, i) => {
      const width = known ? known[i] : fontSize * (glyph === ' ' ? 0.3 : 0.6);
      return Math.max(0, width + letterSpacing * fontSize) * toDegrees;
    });
    const span = arcs.reduce((sum, arc) => sum + arc, 0);
    const fit = span > 0 ? Math.min(1, 360 / (span * copies)) : 1;
    const result: number[] = [];
    for (let copy = 0; copy < copies; copy += 1) {
      let cursor = startAngle + (360 / copies) * copy - (arcs[0] * fit) / 2;
      for (let i = 0; i < count; i += 1) {
        const arc = arcs[i] * fit;
        result.push(cursor + arc / 2);
        cursor += arc;
      }
    }
    return result;
  }, [glyphs, letters, copies, fill, startAngle, size, fontSize, letterSpacing, advances]);

  useIsomorphicLayoutEffect(() => {
    if (fill) return undefined;
    let alive = true;
    const measure = () => {
      if (!alive) return;
      const widths = glyphs.map((_, i) => glyphRefs.current[i]?.offsetWidth ?? 0);
      setAdvances(prev =>
        prev && prev.length === widths.length && prev.every((width, i) => width === widths[i]) ? prev : widths
      );
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      alive = false;
    };
  }, [fill, glyphs, fontSize, fontWeight, className]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setSettled(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const state = stateRef.current;
    const turn = direction === 'counterclockwise' ? -1 : 1;
    state.cruise = spinDuration > 0 && !reduceMotion ? (360 / spinDuration) * turn : 0;
    if (!root || reduceMotion) return undefined;

    const spin = ({ delta }: FrameData) => {
      if (state.dragging) return;
      const dt = Math.min(delta, 100) / 1000;
      state.fling *= Math.exp(-dt / 0.7);
      if (Math.abs(state.fling) < 1) state.fling = 0;
      const velocity = state.cruise * speed.get() + state.fling;
      if (velocity) rotation.set((rotation.get() + velocity * dt) % 360);
    };

    let running = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting === running) return;
      running = entry.isIntersecting;
      if (running) frame.update(spin, true);
      else cancelFrame(spin);
    });
    observer.observe(root);

    return () => {
      observer.disconnect();
      cancelFrame(spin);
    };
  }, [spinDuration, direction, reduceMotion, rotation, speed]);

  useEffect(() => {
    if (hoverTilt && !reduceMotion) return;
    tiltX.set(0);
    tiltY.set(0);
  }, [hoverTilt, reduceMotion, tiltX, tiltY]);

  const applyScale = () => {
    const state = stateRef.current;
    const bonkers = state.hovering && onHover === 'goBonkers' && !reduceMotion;
    scale.set((bonkers ? 0.8 : 1) * (state.dragging ? 0.96 : 1));
  };

  const pointerAngle = (e: React.PointerEvent<HTMLDivElement>): number | null => {
    const root = rootRef.current;
    if (!root) return null;
    const rect = root.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    if (Math.hypot(dx, dy) < rect.width * 0.06) return null;
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };

  const handleEnter = () => {
    stateRef.current.hovering = true;
    if (onHover && !reduceMotion) speed.set(HOVER_SPEED[onHover] ?? 1);
    applyScale();
  };

  const handleLeave = () => {
    stateRef.current.hovering = false;
    speed.set(1);
    tiltX.set(0);
    tiltY.set(0);
    applyScale();
  };

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = stateRef.current;
    const root = rootRef.current;
    if (!root) return;

    if (state.dragging) {
      const angle = pointerAngle(e);
      if (angle !== null) {
        if (state.angle !== null) {
          let delta = angle - state.angle;
          if (delta > 180) delta -= 360;
          if (delta < -180) delta += 360;
          state.travel += delta;
          rotation.set((rotation.get() + delta) % 360);
          state.samples.push([e.timeStamp, state.travel]);
          while (state.samples.length > 2 && e.timeStamp - state.samples[0][0] > 100) state.samples.shift();
        }
        state.angle = angle;
      }
    }

    if (!hoverTilt || reduceMotion || e.pointerType === 'touch') return;
    const rect = root.getBoundingClientRect();
    const nx = clamp(((e.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
    const ny = clamp(((e.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
    tiltX.set(-ny * hoverTilt);
    tiltY.set(nx * hoverTilt);
  };

  const handleDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const state = stateRef.current;
    state.dragging = true;
    state.fling = 0;
    state.angle = pointerAngle(e);
    state.travel = 0;
    state.samples = [[e.timeStamp, 0]];
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDragging(true);
    applyScale();
  };

  const handleUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = stateRef.current;
    if (!state.dragging) return;
    state.dragging = false;
    setDragging(false);
    applyScale();
    const [startTime, startTravel] = state.samples[0];
    const lastTime = state.samples[state.samples.length - 1][0];
    const elapsed = e.timeStamp - startTime;
    const velocity = elapsed > 0 && e.timeStamp - lastTime < 80 ? ((state.travel - startTravel) / elapsed) * 1000 : 0;
    state.fling = reduceMotion ? 0 : clamp(velocity, -MAX_FLING, MAX_FLING) - state.cruise * speed.get();
  };

  return (
    <div
      ref={rootRef}
      className={`relative mx-auto rounded-full text-center cursor-pointer ${className}`}
      style={{
        width: size,
        height: size,
        fontSize,
        fontWeight,
        color: color || undefined,
        perspective: size * 2.5,
        cursor: draggable ? (dragging ? 'grabbing' : 'grab') : undefined,
        touchAction: draggable ? 'none' : undefined,
        userSelect: draggable ? 'none' : undefined,
        WebkitUserSelect: draggable ? 'none' : undefined
      }}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      onPointerMove={handleMove}
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      onPointerCancel={handleUp}
    >
      <motion.div
        className="absolute inset-0 [transform-style:preserve-3d]"
        style={{ rotateX: tiltX, rotateY: tiltY, scale }}
      >
        <div
          className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: tilt ? `rotateX(${tilt}deg)` : undefined }}
        >
          <span
            className="absolute inset-[1.3em] rounded-full border-solid border-current pointer-events-none transition-opacity duration-[400ms]"
            style={{
              borderWidth: Math.max(1, fontSize / 16),
              borderColor: ringColor || undefined,
              opacity: ring ? 1 : 0
            }}
          />
          <motion.div className="absolute inset-0" role="img" aria-label={text} style={{ rotate: rotation }}>
            {letters.map((letter, i) => (
              <span
                key={i}
                className={`absolute inset-0 inline-block whitespace-pre ${settled ? LETTER_EASE : ''}`}
                style={{ transform: `rotate(${angles[i] ?? 0}deg)` }}
              >
                <span
                  ref={
                    i < glyphs.length
                      ? (el: HTMLSpanElement | null) => {
                          glyphRefs.current[i] = el;
                        }
                      : undefined
                  }
                >
                  {letter}
                </span>
              </span>
            ))}
          </motion.div>
        </div>
        {children != null && children !== false ? (
          <div className="absolute inset-0 flex items-center justify-center">{children}</div>
        ) : null}
      </motion.div>
    </div>
  );
};

export default CircularText;
```

## `app/components/reactbits/SpecularButton.tsx`

```tsx
'use client';

import { useEffect, useRef, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';

const SIZES: Record<SpecularButtonSize, string> = {
  sm: 'px-5 py-2.5 text-[0.875rem]',
  md: 'px-7 py-3.5 text-[1rem]',
  lg: 'px-[38px] py-[18px] text-[1.125rem]'
};

const BUTTON =
  'relative isolate m-0 inline-flex cursor-pointer items-center justify-center gap-[0.5em] border-0 [font-family:inherit] font-medium leading-none tracking-[0.01em] [color:var(--sb-text-color)] [border-radius:var(--sb-radius)] [background:color-mix(in_srgb,var(--sb-tint)_calc(var(--sb-tint-opacity)*100%),transparent)] shadow-[0_10px_24px_-14px_rgba(0,0,0,0.45)] [-webkit-backdrop-filter:blur(var(--sb-blur))] [backdrop-filter:blur(var(--sb-blur))] outline-none [-webkit-tap-highlight-color:transparent] transition-transform duration-250 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-[3px] focus-visible:[outline-color:color-mix(in_srgb,var(--sb-text-color)_55%,transparent)] disabled:cursor-default disabled:opacity-50 disabled:active:scale-100';

const PAD = 24;
const TAU = Math.PI * 2;

export type SpecularButtonSize = 'sm' | 'md' | 'lg';

export interface SpecularButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'> {
  children?: ReactNode;
  size?: SpecularButtonSize;
  radius?: number;
  tint?: string;
  tintOpacity?: number;
  blur?: number;
  textColor?: string;
  lineColor?: string;
  baseColor?: string;
  intensity?: number;
  idleIntensity?: number;
  shineSize?: number;
  shineFade?: number;
  thickness?: number;
  glow?: number;
  speed?: number;
  followMouse?: boolean;
  proximity?: number;
  autoAnimate?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

type Settings = {
  radius: number;
  lineColor: string;
  baseColor: string;
  intensity: number;
  idleIntensity: number;
  shineSize: number;
  shineFade: number;
  thickness: number;
  glow: number;
  speed: number;
  followMouse: boolean;
  proximity: number;
  autoAnimate: boolean;
  disabled: boolean;
};

const VERTEX = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 uCenter;
uniform vec2 uHalf;
uniform float uRadius;
uniform float uPx;
uniform float uSpot;
uniform vec2 uEntry;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform vec2 uWindow;
uniform float uThickness;
uniform float uGlow;
out vec4 outColor;

float roundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float loopPosition(vec2 p, vec2 b, float r) {
  vec2 inner = b - r;
  float arc = 1.5707963 * r;
  float quarter = inner.x + inner.y + arc;
  vec2 a = abs(p);
  vec2 q = a - inner;
  float s = q.x > 0.0 && q.y > 0.0
    ? inner.y + atan(q.y, q.x) * r
    : (q.x > q.y ? min(a.y, inner.y) : inner.y + arc + inner.x - min(a.x, inner.x));
  if (p.x < 0.0) s = p.y >= 0.0 ? 2.0 * quarter - s : 2.0 * quarter + s;
  else if (p.y < 0.0) s = 4.0 * quarter - s;
  return s / max(4.0 * quarter, 0.0001);
}

float lobe(float position, float center) {
  float gap = abs(fract(position - center + 0.5) - 0.5);
  return 1.0 - smoothstep(uWindow.x, uWindow.x + uWindow.y, gap);
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = roundedBox(p, uHalf, uRadius);
  float position = loopPosition(p, uHalf, uRadius);
  float key = lobe(position, uSpot);
  float back = lobe(position, uSpot + 0.5);
  float streak = key + back * 0.45;
  float width = max(uThickness * uPx * mix(1.0, max(key, back), 0.6), 0.35);
  float band = smoothstep(-width - 0.6, -width + 0.6, d) * (1.0 - smoothstep(-0.6, 0.6, d));
  float hair = smoothstep(-uPx - 0.6, -uPx + 0.6, d) * (1.0 - smoothstep(-0.6, 0.6, d));
  float inside = 1.0 - smoothstep(-0.6, 0.6, d);
  vec2 pool = (p - uEntry) / (uHalf.y * vec2(1.6, 1.1));
  float glow = streak * 0.2 * exp(-abs(d + width * 0.5) / (5.0 * uPx)) + inside * 0.08 * exp(-dot(pool, pool));
  float light = clamp((band * streak + glow * uGlow) * uIntensity, 0.0, 1.0);
  vec4 base = vec4(uBaseColor, 1.0) * hair * 0.6;
  outColor = vec4(uLineColor, 1.0) * light + base * (1.0 - light);
}`;

const UNIFORMS = [
  'uCenter',
  'uHalf',
  'uRadius',
  'uPx',
  'uSpot',
  'uEntry',
  'uLineColor',
  'uBaseColor',
  'uIntensity',
  'uWindow',
  'uThickness',
  'uGlow'
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const wrap = (value: number) => value - Math.floor(value);

const loopPosition = (x: number, y: number, halfX: number, halfY: number, r: number) => {
  const innerX = halfX - r;
  const innerY = halfY - r;
  const arc = (Math.PI / 2) * r;
  const quarter = innerX + innerY + arc;
  const ax = Math.abs(x);
  const ay = Math.abs(y);
  const qx = ax - innerX;
  const qy = ay - innerY;
  let s;
  if (qx > 0 && qy > 0) s = innerY + Math.atan2(qy, qx) * r;
  else if (qx > qy) s = Math.min(ay, innerY);
  else s = innerY + arc + innerX - Math.min(ax, innerX);
  if (x < 0) s = y >= 0 ? 2 * quarter - s : 2 * quarter + s;
  else if (y < 0) s = 4 * quarter - s;
  return wrap(s / Math.max(4 * quarter, 0.0001));
};

const rimPoint = (position: number, halfX: number, halfY: number, r: number): [number, number] => {
  const innerX = halfX - r;
  const innerY = halfY - r;
  const arc = (Math.PI / 2) * r;
  const quarter = innerX + innerY + arc;
  let s = wrap(position) * 4 * quarter;
  let signX = 1;
  let signY = 1;
  if (s > 3 * quarter) {
    s = 4 * quarter - s;
    signY = -1;
  } else if (s > 2 * quarter) {
    s -= 2 * quarter;
    signX = -1;
    signY = -1;
  } else if (s > quarter) {
    s = 2 * quarter - s;
    signX = -1;
  }
  let x = innerX - (s - innerY - arc);
  let y = halfY;
  if (s <= innerY) {
    x = halfX;
    y = s;
  } else if (s <= innerY + arc) {
    const angle = (s - innerY) / Math.max(r, 0.0001);
    x = innerX + Math.cos(angle) * r;
    y = innerY + Math.sin(angle) * r;
  }
  return [x * signX, y * signY];
};

const compile = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
};

const link = (gl: WebGL2RenderingContext) => {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.bindAttribLocation(program, 0, 'aPosition');
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  gl.deleteProgram(program);
  return null;
};

const SpecularButton = ({
  children = 'Get Started',
  size = 'lg',
  radius = 18,
  tint = '#ffffff',
  tintOpacity = 0.04,
  blur = 0,
  textColor = '#f5f5f5',
  lineColor = '#ffffff',
  baseColor = '#525252',
  intensity = 1,
  idleIntensity = 0.35,
  shineSize = 10,
  shineFade = 34,
  thickness = 1.2,
  glow = 1,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  style,
  ...rest
}: SpecularButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wakeRef = useRef<(() => void) | null>(null);
  const settings: Settings = {
    radius: Math.max(0, radius),
    lineColor: String(lineColor),
    baseColor: String(baseColor),
    intensity: Math.max(0, intensity),
    idleIntensity: clamp(idleIntensity, 0, 1),
    shineSize: Math.max(0, shineSize),
    shineFade: Math.max(0, shineFade),
    thickness: Math.max(0, thickness),
    glow: Math.max(0, glow),
    speed,
    followMouse,
    proximity: Math.max(1, proximity),
    autoAnimate,
    disabled
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    const button = buttonRef.current;
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false
    });
    if (!button || !canvas || !gl) return undefined;
    const program = link(gl);
    if (!program) return undefined;
    const uniforms: Record<string, WebGLUniformLocation | null> = {};
    for (const name of UNIFORMS) uniforms[name] = gl.getUniformLocation(program, name);
    const buffer = gl.createBuffer();
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    const probe = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const colors = new Map<string, number[]>();
    const view = { width: 1, height: 1, ratio: 1 };
    const pointer = { x: 0, y: 0, known: false };
    const state = { spot: 0, level: 0, press: 0, ready: false };
    let raf = 0;
    let last = 0;
    let visible = true;

    const toRgb = (value: string): number[] => {
      const cached = colors.get(value);
      if (cached) return cached;
      let rgb = [1, 1, 1];
      if (probe) {
        probe.clearRect(0, 0, 1, 1);
        probe.fillStyle = '#000000';
        probe.fillStyle = value;
        probe.fillRect(0, 0, 1, 1);
        const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
        rgb = [r / 255, g / 255, b / 255];
      }
      colors.set(value, rgb);
      return rgb;
    };

    const cornerRadius = (s: Settings) => Math.min(s.radius, view.width / 2, view.height / 2);

    const restSpot = (s: Settings) => {
      const r = cornerRadius(s);
      const inset = r * (1 - Math.SQRT1_2);
      return loopPosition(inset - view.width / 2, view.height / 2 - inset, view.width / 2, view.height / 2, r);
    };

    const aim = (s: Settings) => {
      if (!s.followMouse || s.disabled || !pointer.known) return null;
      const rect = button.getBoundingClientRect();
      const scale = rect.width / view.width || 1;
      const halfX = view.width / 2;
      const halfY = view.height / 2;
      const x = (pointer.x - rect.left - rect.width / 2) / scale;
      const y = (rect.top + rect.height / 2 - pointer.y) / scale;
      const distance = Math.hypot(Math.max(Math.abs(x) - halfX, 0), Math.max(Math.abs(y) - halfY, 0));
      const t = clamp(1 - distance / s.proximity, 0, 1);
      const near = t * t * (3 - 2 * t);
      const nearest = loopPosition(x, y, halfX, halfY, cornerRadius(s));
      if (distance > 0) return { spot: nearest, near };
      const depth = clamp(Math.min(halfX - Math.abs(x), halfY - Math.abs(y)) / (halfY * 0.8), 0, 1);
      const sway = restSpot(s) - (x / halfX) * 0.06 - (y / halfY) * 0.02;
      const offset = sway - nearest - Math.round(sway - nearest);
      return { spot: wrap(nearest + offset * depth * depth * (3 - 2 * depth)), near };
    };

    const draw = (s: Settings) => {
      const { width, height } = view;
      const scaleX = canvas.width / (width + PAD * 2);
      const scaleY = canvas.height / (height + PAD * 2);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform2f(uniforms.uCenter, (PAD + width / 2) * scaleX, (PAD + height / 2) * scaleY);
      gl.uniform2f(uniforms.uHalf, (width / 2) * scaleX, (height / 2) * scaleY);
      gl.uniform1f(uniforms.uRadius, Math.min(s.radius, width / 2, height / 2) * scaleX);
      gl.uniform1f(uniforms.uPx, view.ratio);
      const r = Math.min(s.radius, width / 2, height / 2);
      const [rimX, rimY] = rimPoint(state.spot, width / 2, height / 2, r);
      const pull = 1 - Math.min(0.35 * (height / 2), Math.hypot(rimX, rimY)) / Math.max(Math.hypot(rimX, rimY), 0.0001);
      gl.uniform1f(uniforms.uSpot, state.spot);
      gl.uniform2f(uniforms.uEntry, rimX * pull * scaleX, rimY * pull * scaleY);
      gl.uniform3fv(uniforms.uLineColor, toRgb(s.lineColor));
      gl.uniform3fv(uniforms.uBaseColor, toRgb(s.baseColor));
      gl.uniform1f(uniforms.uIntensity, s.intensity * (state.level + state.press * 0.8));
      gl.uniform2f(uniforms.uWindow, s.shineSize / 360 + state.press * 0.06, s.shineFade / 360 + 0.0001);
      gl.uniform1f(uniforms.uThickness, s.thickness);
      gl.uniform1f(uniforms.uGlow, s.glow);
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindVertexArray(null);
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      const s = settingsRef.current;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const target = aim(s);
      const spinning = s.autoAnimate && !reduce;
      const steering = !!target && target.near > 0;
      if (!state.ready) {
        state.spot = restSpot(s);
        state.level = s.autoAnimate ? 1 : s.idleIntensity;
        state.ready = true;
      }
      let diff = 0;
      if (spinning && !steering) state.spot = wrap(state.spot + (s.speed / TAU) * dt);
      else {
        diff = (steering ? target.spot : restSpot(s)) - state.spot;
        diff -= Math.round(diff);
        state.spot = wrap(state.spot + diff * (1 - Math.exp(-dt * 8)));
      }
      const level = s.autoAnimate ? 1 : s.idleIntensity + (1 - s.idleIntensity) * (target ? target.near : 0);
      state.level += (level - state.level) * (1 - Math.exp(-dt * 7));
      state.press *= Math.exp(-dt * 5);
      draw(s);
      const settling = Math.abs(diff) > 0.0002 || Math.abs(level - state.level) > 0.001 || state.press > 0.002;
      if (settling || (spinning && !steering)) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    const wake = () => {
      if (!raf && visible) raf = requestAnimationFrame(frame);
    };

    const measure = (entry?: ResizeObserverEntry) => {
      const box = entry?.borderBoxSize?.[0];
      view.width = Math.max(1, box ? box.inlineSize : button.offsetWidth);
      view.height = Math.max(1, box ? box.blockSize : button.offsetHeight);
      view.ratio = Math.min(window.devicePixelRatio || 1, 3);
      canvas.width = Math.max(1, Math.round((view.width + PAD * 2) * view.ratio));
      canvas.height = Math.max(1, Math.round((view.height + PAD * 2) * view.ratio));
      if (state.ready) draw(settingsRef.current);
      wake();
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.known = true;
      wake();
    };

    const onPointerDown = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.known = true;
      if (!settingsRef.current.disabled) state.press = 1;
      wake();
    };

    const onPointerEnd = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') return;
      pointer.known = false;
      wake();
    };

    const onPointerLeave = () => {
      pointer.known = false;
      wake();
    };

    const resizeObserver = new ResizeObserver(entries => measure(entries[entries.length - 1]));
    resizeObserver.observe(button);
    const intersection = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) {
        last = 0;
        wake();
      }
    });
    intersection.observe(button);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerEnd, { passive: true });
    window.addEventListener('pointercancel', onPointerEnd, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    button.addEventListener('pointerdown', onPointerDown);
    measure();
    wakeRef.current = wake;

    return () => {
      cancelAnimationFrame(raf);
      wakeRef.current = null;
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerEnd);
      window.removeEventListener('pointercancel', onPointerEnd);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      button.removeEventListener('pointerdown', onPointerDown);
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  useEffect(() => {
    wakeRef.current?.();
  });

  return (
    <button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${BUTTON} ${SIZES[size] ?? SIZES.lg}${className ? ` ${className}` : ''}`}
      style={
        {
          '--sb-radius': `${radius}px`,
          '--sb-tint': tint,
          '--sb-tint-opacity': tintOpacity,
          '--sb-blur': `${blur}px`,
          '--sb-text-color': textColor,
          ...style
        } as CSSProperties
      }
      {...rest}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute -inset-6 z-[1] block h-[calc(100%+48px)] w-[calc(100%+48px)]"
        aria-hidden="true"
      />
      <span className="relative z-[2] inline-flex items-center gap-[inherit]">{children}</span>
    </button>
  );
};

export default SpecularButton;
```
