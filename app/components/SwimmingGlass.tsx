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
