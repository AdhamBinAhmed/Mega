# Motion & Interaction Design Report — MEGA Devs Redesign

**Agent:** Motion & Interaction Designer · **Date:** 2026-11-11 · **Scope:** research only, no code changed.

**Legend:** `[FACT]` = verified against a cited source. `[OPINION]` = design judgement. `[CODE]` = observed in this repo.

---

## 1. Unified motion language (tokens)

`[CODE]` The codebase currently contains **16 distinct cubic-bezier curves** across `app/*.css` and page-level styles. The dominant ones: `cubic-bezier(0.22,1,0.36,1)` (declared as `--ease` in `app/page.css`), `cubic-bezier(0.16,1,0.3,1)`, Material's `(0.4,0,0.2,1)` family, and a springy `(0.34,1.56,0.64,1)` / `(0.34,1.4,0.5,1)` pair (`--ease-spring`). This is the problem the unified language solves: collapse 16 curves to 4.

### Proposed token set `[OPINION]`

```css
:root {
  /* Durations */
  --dur-instant: 120ms;  /* press, toggle, focus ring, hover color */
  --dur-fast:    200ms;  /* hover transforms, small fades, tooltips */
  --dur-base:    320ms;  /* entrances, card reveals, palette open */
  --dur-slow:    560ms;  /* hero entrances, staggered groups, sheets */

  /* Easings */
  --ease-out:    cubic-bezier(0.22, 1, 0.36, 1);   /* DEFAULT — the brand curve, keep as-is */
  --ease-out-xl: cubic-bezier(0.16, 1, 0.3, 1);    /* big travel: sheets, menu, hero */
  --ease-spring: cubic-bezier(0.34, 1.4, 0.5, 1);  /* playful overshoot: magnetic snap-back, palette pop */
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);   /* the rare move-in-place (marquee pause, tab underline) */
}
```

Rationale: `(0.22,1,0.36,1)` is already the site's voice — a fast-attack, long-settle ease-out that feels editorial rather than bouncy. `(0.16,1,0.3,1)` is the same character stretched for large distances (also already in the codebase). Keep `(0.34,1.4,0.5,1)` as the *only* overshoot curve and delete `(0.34,1.56,0.64,1)` — 1.56 overshoot is too cartoonish for this brand. Delete all six Material `(0.4,0,…)` variants.

GSAP equivalents: `--ease-out` ≈ `"expo.out"` softened — register once with `CustomEase.create("mega", "0.22,1,0.36,1")` (CustomEase is free now, see §2) so GSAP and CSS animate on the *same* curve. `--ease-spring` ≈ `"back.out(1.2)"`.

### Pattern grammar `[OPINION]`

| Pattern | Recipe |
| --- | --- |
| **Entrance** | `opacity 0→1` + `translateY(16px)→0`, `--dur-base`, `--ease-out`. Stagger siblings 40–70ms, cap total group time at ~700ms (clamp stagger when n is large). |
| **Exit** | Opacity-led, **half the entrance**: `--dur-fast`, slight `translateY(0→-8px)`, ease-in flavor. Exits must never block the user. |
| **Hover** | `--dur-fast` in, `--dur-base` out (fast attack, slow release reads expensive). Transform/`box-shadow`/`color` only. Lift = `translateY(-2px)` max for cards; glass chrome never lifts, it brightens (border alpha + inner highlight). |
| **Press** | `--dur-instant`, `scale(0.97)`, release with `--ease-spring`. |
| **Glass/“liquid” transitions** | Treat as entrance/exit of elevation-3 chrome: scale `0.96→1` + opacity + `backdrop-filter` blur ramp, `--dur-base`, `--ease-spring` for the palette pop, `--ease-out-xl` for full-screen sheets at `--dur-slow`. Never animate a refracting element's width/height/radius (forces displacement-map rebuild — see UI report §5.7). |
| **Focus** | Not animated beyond `--dur-instant` color; the ring itself appears instantly. |

Asymmetric enter/exit timing (old leaves fast, new arrives gently, enter fade delayed until exit ends) is the pattern Next's own view-transitions guide teaches — 150ms exit / 210ms enter / 400ms move. `[FACT]` ([bundled Next.js docs](C:\Users\adham\Desktop\Mega\node_modules\next\dist\docs\01-app\02-guides\view-transitions.md)) Those land almost exactly on `--dur-instant/--dur-fast/--dur-base`, which is a good sign the token set is conventional.

---

## 2. GSAP + framer-motion v12 coexistence

### Licensing / versions `[FACT]`

- GSAP is now 100% free including every formerly-paid plugin (SplitText, MorphSVG, ScrollSmoother, CustomEase…), for commercial use, after the Webflow acquisition; the free release happened April 30 2025, and 3.15.x is current. ([gsap.com/pricing](https://gsap.com/pricing/), [noqode](https://www.noqode.fr/en/outils/gsap), [npm](https://www.npmjs.com/package/gsap))
- Bundle: GSAP core ≈ 23–27KB gz, plugins added only as imported; framer-motion full ≈ 50KB gz, lazy setup ≈ 31KB (6KB shell). ([hontran.dev](https://www.hontran.dev/blog/gsap-vs-framer-motion), [kanopylabs](https://kanopylabs.com/blog/motion-vs-framer-motion-vs-gsap-animation)) `[CODE]` framer-motion ^12.38 is already a dependency, so GSAP is additive ≈ +25–30KB gz on pages that use it.

### Division of labour `[OPINION]` — the one rule that prevents all pitfalls

**Never let both libraries own the same property on the same element.** They will fight over `transform` and the last writer wins per frame. ([withmeteoric](https://withmeteoric.com/blog/gsap-vs-framer-motion-production-guide)) Enforce by component ownership, not by discipline:

- **framer-motion:** UI state animation — presence (`AnimatePresence`) for modal/palette/menu mount-unmount, layout animations, hover/press variants, anything driven by React state.
- **GSAP:** scroll choreography (ScrollTrigger), text splitting/masked headlines (SplitText — now free), and the imported React Bits components (StaggeredMenu / AnimatedContent / MaskedHeading already depend on GSAP ([superdesign](https://superdesign.dev/library/staggered-menu), [dev.to comparison](https://dev.to/rohit_kumar_42b6c9d9ca16a/6-gsap-component-libraries-compared-in-2026-annnimate-made-with-gsap-osmo-react-bits-codrops-1g3a))).
- A component is either a framer-motion component or a GSAP component. If GSAP scroll-reveals a card that framer-motion hover-lifts, put the hover transform on an **inner wrapper element** so each library owns its own node.

### Pitfalls and the known fixes `[FACT]`

1. **SSR:** use `useGSAP()` from `@gsap/react` — a drop-in for `useEffect/useLayoutEffect` using the isomorphic-layout-effect technique, safe in App Router inside client components; it also auto-reverts tweens on unmount via `gsap.context` semantics (kills the StrictMode double-invoke problem). ([semaphore](https://semaphore.io/blog/react-framer-motion-gsap), [medium/thomasaugot](https://medium.com/@thomasaugot/optimizing-gsap-animations-in-next-js-15-best-practices-for-initialization-and-cleanup-2ebaba7d0232))
2. **Route change:** kill all old ScrollTrigger instances on unmount and call `ScrollTrigger.refresh()` only after the new DOM has settled. ([gsap forum](https://gsap.com/community/forums/topic/34287-scrolltriggerrefresh-not-working-upon-changing-route-in-nextjs/)) With `useGSAP` scoped per page component, cleanup is automatic; add one small client component in the root layout that watches `usePathname()` and calls `requestAnimationFrame(() => ScrollTrigger.refresh())`.
3. **Fonts:** GSAP does not watch font loading; trigger positions computed before Space Grotesk/Cairo swap in are wrong. `document.fonts.ready.then(() => ScrollTrigger.refresh())` once at startup. ([madeforaward](https://www.madeforaward.com/blog/gsap-scrolltrigger-not-working)) `[OPINION]` Cairo is a heavy family — this matters more on AR pages; also refresh after the locale/theme toggle if either reflows.
4. **Stale start values:** pass `invalidateOnRefresh: true` on ScrollTriggers whose tween starting values depend on layout, or refreshes reuse cached `from` values. ([annnimate](https://annnimate.com/learn/scroll/invalidate-on-refresh))
5. **Bundle discipline:** import gsap only inside the client components that use it; heavy pieces (ScrollSmoother-style smooth scroll, SplitText heroes) behind `next/dynamic` so they sit in non-blocking chunks and don't damage LCP/INP. ([buildwithumar](https://buildwithumar.com/blogs/gsap-vs-framer-motion-nextjs-2026)) Register plugins (`gsap.registerPlugin(ScrollTrigger)`) inside the module that imports them, never in the root layout.
6. `[OPINION]` **Skip Lenis/ScrollSmoother entirely.** Smooth-scroll hijacking fights RTL scrollbars, CSS `scroll-behavior`, and accessibility, and the editorial identity doesn't need it. Native scroll + ScrollTrigger is the robust combination.

---

## 3. CSS View Transitions API — status Nov 2026 and recommendation

### Support `[FACT]`

- **Same-document:** Chrome/Edge 111+, Safari 18+, Firefox 133+ — all evergreen engines; >90% global coverage. ([testmuai](https://www.testmuai.com/learning-hub/view-transitions-api-browser-support/), [cssawwwards](https://cssawwwards.com/blog/view-transitions-api-guide-2026))
- **Cross-document (MPA):** Chrome/Edge 126+, Safari 18+; **Firefox still in development** (expected during 2026, not shipped at research time). ([testmuai](https://www.testmuai.com/learning-hub/view-transitions-api-browser-support/), [frontendhorizon](https://www.frontendhorizon.com/blog/view-transitions-api-and-css-scroll-driven-animations-the-browser-wins-of-2026))
- **Next.js:** App Router navigations are React Transitions, so React's `<ViewTransition>` component activates automatically on navigation — shared-element morph, Suspense reveals, directional slides via `<Link transitionTypes={['nav-forward']}>`, same-route crossfades keyed by param. Works "with no configuration"; the guide states React 19.3 includes `ViewTransition` and `addTransitionType`. ([bundled Next.js guide](C:\Users\adham\Desktop\Mega\node_modules\next\dist\docs\01-app\02-guides\view-transitions.md))
- `[CODE]` **Blocker:** this repo pins `react@19.2.4`, and `ViewTransition` / `unstable_ViewTransition` are **undefined** in the installed React (verified by requiring it). The bundled guide's API needs React 19.3. So the documented path requires a minor React upgrade first.

### Recommendation `[OPINION]`

**Use, as progressive enhancement — after bumping React to 19.3.** It is the only mechanism that gives real cross-route shared-element morphs (project card → case-study hero) and it degrades to instant swap with zero cost in unsupported engines (per the guide: "your application works normally; the transitions do not animate"). Plan:

- Bump `react`/`react-dom` to 19.3.x (small, but schedule it consciously — don't fold it silently into the redesign PR).
- Same-document transitions only (App Router navs); ignore cross-document — irrelevant for an SPA-navigating App Router site and Firefox isn't there yet.
- Patterns to adopt from the guide: `default="none"` on every named pair (prevents every named element crossfading on unrelated transitions), header anchored with `viewTransitionName` + `animation: none` + `display: none` on the old snapshot, `::view-transition { pointer-events: none }` to keep the page clickable mid-transition.
- **RTL:** the guide's film grammar (forward = leftward) is a left-to-right convention. Flip `--slide-offset` signs under `dir="rtl"` or forward/back will feel reversed for Arabic users.
- Route transitions belong to View Transitions **exclusively** — do not also run framer-motion `AnimatePresence` page transitions; that would be the double-animating pitfall at page scale.

---

## 4. prefers-reduced-motion strategy

### Three-bin policy `[FACT]`

Sort every animation into bins rather than nuking everything: **Kill** parallax, scroll-scrubbing, auto-playing marquees, large translations — anything that moves content the user didn't ask to move. **Swap** entrances/exits for plain opacity crossfades — "something appeared" survives without the travel. **Keep** tiny user-triggered feedback: color shifts, focus rings, sub-100ms presses. ([alexshanley](https://alexshanley.com/reduced-motion-strategy/), [a11ypath](https://a11ypath.com/guides/motion-and-animation/)) Color, blur, and opacity changes are explicitly *not* motion, so crossfades remain fine under reduce. ([a11ypath](https://a11ypath.com/guides/motion-and-animation/)) WCAG anchors: 2.3.3 (AAA, motion from interaction), 2.2.2 (A — the **marquee** must be pausable regardless of motion preference since it autoplays >5s alongside other content). ([accessibility.build](https://accessibility.build/wcag/2-3-3))

### Applied to this site `[OPINION]`

| Feature | Under reduce |
| --- | --- |
| Scroll reveals (AnimatedContent) | Opacity-only fade, no translate (React Bits 2.0 components ship reduced-motion handling — verify per component ([pkgpulse](https://www.pkgpulse.com/guides/react-bits-animated-components-2026))) |
| Marquee tickers | **Static row** (also add pause-on-hover/focus control for everyone, per 2.2.2) |
| MaskedHeading / SplitText | Simple fade of whole heading; skip per-char stagger |
| View Transitions | Zero out `::view-transition-*` durations per the Next guide's snippet; optionally keep the root crossfade |
| Magnetic hover / cursor spotlight | Off entirely (spotlight is a moving gradient = untriggered motion) |
| Ambient gradient mesh drift | Static gradient |
| Palette/modal open | Opacity + backdrop fade only, no scale/spring |
| Hover color, focus ring, press | Keep (sub-120ms, user-triggered) |

Implementation: gate in one place — a `useReducedMotion()` source of truth (framer-motion exports one; mirror it into GSAP via `gsap.matchMedia()`, which is the idiomatic GSAP-side gate) plus a global CSS block for pure-CSS animations. Never `* { animation: none !important }` — that breaks `animation`-dependent JS (`animationend` listeners); use `animation-duration: 0.01ms` style overrides or per-pattern opacity variants.

---

## 5. Scroll reveal best practices

- **Observer config:** `threshold: 0.1–0.15` with `rootMargin: "0px 0px -10% 0px"` so reveals fire just before the element is comfortably in view; never `threshold: 1` on tall elements (may never fire on small screens). Tune these two values — they define the feel. ([javascriptbit](https://javascriptbit.com/javascript-intersection-observer-api/), [jsguides](https://jsguides.dev/guides/javascript-intersection-observer-patterns/))
- **One-shot:** `unobserve` after reveal; reveals replay on every scroll-past read as gimmick and cost observers. ([codeshack](https://codeshack.io/references/javascript/intersectionobserver/))
- **No layout shift:** animate `transform` + `opacity` only — GPU-composited, no reflow. Never animate width/height/margin/padding in reveals. ([javascriptbit](https://javascriptbit.com/javascript-intersection-observer-api/)) `[OPINION]` The pre-reveal `translateY(16px)` must not change the element's layout box (transform doesn't) — so reveals are CLS-free by construction if the recipe is transform/opacity only.
- **Avoiding hidden-content flash / SEO-safe hiding:** `[OPINION]` never author `opacity: 0` in static CSS. Set the hidden state from JS (`html.js .reveal {}` via a class added by inline script, or GSAP `gsap.set`) so that with JS disabled or failed, content is simply visible. This *is* the noscript fallback — static content, zero motion — and it must be treated as a designed settled state, not an accident. ([codefronts](https://codefronts.com/motion/css-scroll-animations/intersection-observer-fallback/))
- **Above-the-fold exception:** `[OPINION]` hero content animates on mount (time-based), never on intersection — observer-driven reveals at scroll position 0 cause a visible pop after hydration, which users read as flash.
- `[OPINION]` **Stack choice:** use GSAP ScrollTrigger (already being added) as the single reveal engine rather than mixing hand-rolled IntersectionObserver + framer-motion `whileInView`; one engine = one place to apply reduced-motion, refresh-on-fonts, and route-change cleanup. The IO guidance above still governs the *parameters* (ScrollTrigger `start: "top 85%"` ≈ the −10% rootMargin).

---

## 6. Magnetic hover + cursor spotlight

### Restraint `[OPINION]`

- Magnetic: **only small, discrete, high-intent targets** — primary CTA, nav pill items, social icons. Never cards, never text links, never more than ~5 magnetic elements per viewport. Translation cap ±6px (icons) to ±10px (large CTA); beyond that the cursor feels mocked, not assisted. Snap back with `--ease-spring`.
- Spotlight: one page-level radial gradient following the cursor at very low alpha — on this brand, `radial-gradient(400–600px circle, color-mix(in oklab, var(--accent) 5%, transparent), transparent 70%)` on dark; drop to ~3% or disable on light (light paper shows smudge, not glow). A second, tighter variant on bento-tile borders (border-glow-follows-cursor) is the premium version of the effect — more purposeful than a free-floating blob.
- The two must not compete: spotlight is ambient (page layer, `pointer-events: none`), magnetic is focal (element layer). No magnetic element should also have its own spotlight.

### Performance `[FACT]`

- Use a **passive `pointermove` listener that only writes a target vector**; all animation happens in a `requestAnimationFrame` lerp loop (`offset += (target - offset) * 0.1–0.15`) writing `transform: translate3d()` — never animate `left/top`, never set React state per move. Run the rAF loop only while catching up, then stop. ([javiersilvestri](https://javiersilvestri.vercel.app/posts/custom-cursor-animation/), [noreason.io](https://www.noreason.io/scripts/magnetic-cursor-at-target), [effect-labs](https://effect-labs.com/en/pages/cursors.html))
- `[OPINION]` For the spotlight, write two CSS custom properties (`--mx`, `--my`) from the rAF loop and let CSS paint the gradient — one style write per frame, no per-element listeners. GSAP's `quickTo()` is the idiomatic in-stack way to get the same lerp if the component is already GSAP-owned.

### Touch / hybrid devices `[FACT]`

- Gate on capability, not screen size: wrap CSS in `@media (hover: hover) and (pointer: fine)` and mirror with `window.matchMedia` in JS so the pointer-tracking loops **never attach** on touch devices — bypassing the work entirely, not just hiding the output. ([freefrontend](https://freefrontend.com/javascript-cursors/), [juliolmuller issue](https://github.com/juliolmuller/portfolio/issues/29))
- `[OPINION]` Hybrids (touch laptops) pass `hover: hover` with a mouse attached and that is correct — `pointer: fine` tracks the *primary* pointer; also listen to `pointerType` on the first event and bail for `touch` so a stylus/finger on a hybrid doesn't leave a stranded spotlight. Both effects are decoration: their absence on touch must cost nothing (cards still have hover-independent affordances: borders, labels, chevrons).
- Both effects: off under `prefers-reduced-motion` (§4).

---

## Key decisions for the blueprint

1. **Token set:** durations 120/200/320/560ms; easings `--ease-out (0.22,1,0.36,1)` (default, brand curve), `--ease-out-xl (0.16,1,0.3,1)`, `--ease-spring (0.34,1.4,0.5,1)` (only overshoot), `--ease-in-out (0.65,0,0.35,1)`. Delete the other ~12 curves in the codebase. Register the brand curve in GSAP via `CustomEase` so both engines share it.
2. **Grammar:** entrances = opacity + ≤16px translate at 320ms; exits = opacity-led at half entrance; hover fast-in/slow-out; press 120ms scale 0.97; stagger 40–70ms capped at ~700ms/group.
3. **Ownership rule:** framer-motion owns state/presence (modals, palette, menus, hover variants); GSAP owns scroll + text choreography (ScrollTrigger, SplitText, React Bits). One library per element — split onto wrapper nodes when both are needed.
4. **GSAP hygiene:** `useGSAP` from `@gsap/react` everywhere; `ScrollTrigger.refresh()` on `document.fonts.ready` and after route-change settle; `invalidateOnRefresh: true` on layout-dependent triggers; gsap imported only in consuming client components, heavy pieces via `next/dynamic`; register plugins at import site. No Lenis/ScrollSmoother.
5. **View Transitions: adopt** (same-document only) as progressive enhancement for route navs and card→hero morphs — **requires bumping React 19.2.4 → 19.3** (installed React has no `ViewTransition` export; verified). `default="none"` on all named pairs; anchored header; `::view-transition { pointer-events: none }`; flip slide offsets under RTL; framer-motion never animates routes.
6. **Reduced motion:** three bins — kill (parallax/scrub/marquee/spotlight/magnetic/mesh drift), swap (entrances → opacity-only), keep (sub-120ms user-triggered feedback). Single gate: framer `useReducedMotion` + `gsap.matchMedia()` + one CSS block. Marquee additionally gets a pause control for everyone (WCAG 2.2.2).
7. **Scroll reveals:** ScrollTrigger as sole engine; `start: "top 85%"` (≈ threshold 0.1 + −10% rootMargin), one-shot, transform/opacity only, hidden state set from JS so no-JS/noscript shows static content; hero animates on mount, not on intersection.
8. **Magnetic/spotlight:** ≤5 magnetic targets per viewport, ±6–10px cap, spring release; spotlight ≤5–6% accent alpha on dark, ~3% or off on light, tile-border variant preferred; passive pointermove → rAF lerp → `translate3d`/CSS vars; fully disabled (listeners never attached) outside `(hover: hover) and (pointer: fine)` and under reduced motion.
9. **Glass motion:** glass chrome animates scale/opacity/blur only — never width/height/border-radius on a refracting surface (displacement-map rebuild cost).
