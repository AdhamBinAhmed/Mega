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
  // Touch devices fall back to plain blur: building the displacement map is a
  // per-pixel canvas pass, and re-filtering the backdrop each frame while the
  // page scrolls is the single most expensive thing a glass surface can do on
  // a phone GPU. The blur fallback is visually close and composites cheaply.
  const coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  supportCache = Boolean(chromium && css && !reduce && !coarse);
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
