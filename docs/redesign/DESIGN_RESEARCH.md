# DESIGN RESEARCH — Consolidated Findings

> Consolidates the four research reports in `SUBAGENT_REPORTS/` (three subagent-authored, see its README for the execution record) plus orchestrator verifications. Detailed evidence and source URLs live in the individual reports; this file records the consolidated positions and how conflicts were resolved. **Where any research recommendation conflicts with Phase 5B of the master prompt, Phase 5B wins** — such cases are listed in §6.

## 1. Visual direction (UI_UX_RESEARCH.md)

Premium 2025–26 references (Linear, Stripe, Vercel, Resend, Family, rauno.me) converge on: restrained glass on *chrome only*, flat content, strong typographic identity, depth via a small fixed elevation scale. For this brand: keep the editorial paper/ink identity as the content layer and float Liquid Glass *instruments* above it; pane fills are paper-tinted `color-mix`, never white alpha; red never tints glass. Bento only where content is genuinely unequal (history pillars, stats band, dashboard toggles). Light theme authored as "newsprint" (heavier hairlines), not a naive inversion.

## 2. Liquid Glass (LIQUID_GLASS_RESEARCH.md)

- Apple HIG (verified): glass is a navigation-layer material; content never glass; bigger surfaces more opaque; one tinted surface per view; Apple itself added opacity controls in 26.1/27 — restraint is canon.
- **`backdrop-filter: url(#svg)` is Chromium-only (late 2026).** WebKit 245510 open; Firefox parses but renders nothing → `@supports` false-positives → **JS runtime gating required** (the appendix `LiquidGlass` already does UA-based detection ✔).
- Three-rung ladder: solid tint → blur+saturate frost → SDF displacement refraction. Site must look finished at rung 1.
- Budgets: blur ≤20px, 3–4 glass surfaces per viewport (plan already caps 3 on mobile), never animate blur/displacement geometry, audit backdrop-root ancestors (no transform/filter/will-change above glass; portal overlays to body).
- Contrast math from live tokens: dark tint floor ≈0.62 alpha under arbitrary media (appendix fallback uses 0.62 ✔); light glass 0.72–0.85 paper tint with ink rim (appendix light fallback 0.72 ✔). Keep accent out of refracting layer and off text-on-glass.

## 3. Motion (MOTION_DESIGN_REPORT.md)

Tokens 120/200/320/560ms; brand curve `(0.22,1,0.36,1)` as the default easing, registered in GSAP via CustomEase; delete the ~12 stray beziers found in the codebase. Ownership: framer-motion = presence/state (palette, menus, hovers); GSAP = scroll + text choreography (AnimatedContent, MaskedHeading, StaggeredMenu). `useGSAP`, `ScrollTrigger.refresh()` on `document.fonts.ready` + route settle. Reduced motion: kill (parallax/marquee/spotlight/magnetic) / swap (entrances → opacity) / keep (<120ms feedback); marquee gets a pause control (WCAG 2.2.2). Magnetic ≤5 targets, ±6–10px; spotlight ≤5–6% alpha dark, ~3% light.

## 4. View Transitions — **dropped from scope**

Verified: same-document View Transitions ship in Chrome 111+ / Safari 18+ / Firefox 144+ (93% global). But React's `<ViewTransition>` requires **React 19.3** and the repo pins 19.2.4 (installed React has no such export). The motion researcher recommended bumping React; the architecture assessment says a React minor bump is outside this redesign's risk budget. **Resolution (final): no React upgrade, no ViewTransition; liquid transitions are delivered with framer/GSAP; a pure-CSS `@view-transition` cross-fade may be added later as progressive enhancement.**

## 5. Iconography (ICONOGRAPHY_REPORT.md)

`@solar-icons/react@2.5.0` (code MIT, artwork **CC BY 4.0** → attribution line in footer), 7479 icons × 6 styles. Linear house style (stroke 1.5; 1.25 @16px), per-style subpath imports, `sideEffects:false` verified, add to `optimizePackageImports`. **Skip `SolarProvider`** (icons are provider-free and RSC-safe). No `mirrored` prop → RTL via `[dir="rtl"] .icon-mirror{transform:scaleX(-1)}`. Auto `aria-hidden` built in. Name corrections verified against the barrel: `MagnifierIcon` (not "Magnifer"), **no `TextIcon`** (use `TextSquareIcon`), no `ExternalLinkIcon` (use `SquareShareLineIcon`/`ArrowRightUpIcon`). Brand/tech logos: vendored Simple Icons paths (CC0, all 17 slugs verified live incl. `cplusplus`, `nextdotjs`, `nodedotjs`).

## 6. Conflicts resolved (research vs the binding plan)

| Research recommendation | Binding plan says | Resolution |
|---|---|---|
| React 19.3 bump for `<ViewTransition>` | deps: only gsap + solar | **No bump; VT dropped** (§4) |
| `SolarProvider` skip | Phase C "Add SolarProvider" | Skip recorded as Phase C adjustment (zero functional impact) |
| Glass hardening: `blob:` map URLs, fresh filter id per rebuild, navbar→solid while modal open, user Glass/Solid toggle | Appendix code is verbatim-binding | Ship appendix as-is; hardening items become **Phase H follow-ups only if visual-regression/testing surfaces the cited issues** (WebKit-specific items are moot — WebKit never gets rung 3) |
| `data-glass` attribute on `<html>` for 3-tier gating | Appendix does per-component JS detection | Appendix wins; equivalent outcome |
| Spotlight tile-border variant preferred | Plan's radial spotlight | Radial per plan, alpha capped per research (≤6%/3%) |
| Light `#d92b1f` small text fails AA (4.39:1) | Brand hexes locked | Hex stays; role-based mitigation (size/weight/color-role) — **escalated to checkpoint** |

## 7. Technology verification summary

| Claim | Status |
|---|---|
| Next 16.4: `proxy.ts` convention; `ssr:false` client-only | verified in bundled docs |
| `backdrop-filter` general support ~97% | verified (caniuse) |
| `backdrop-filter: url()` Chromium-only; Firefox false-positive `@supports` | verified (caniuse + Bugzilla/WebKit trackers via researcher) |
| View Transitions same-doc: Chrome 111/Safari 18/Firefox 144, ~93% | verified (caniuse) |
| gsap latest 3.15.1, fully free | verified (npm; Webflow-era licensing) |
| `@solar-icons/react` 2.5.0 exports/names/sideEffects | verified (local probe install) |
| framer-motion 12.38 installed, CircularText-compatible | verified (package.json) |
| Simple Icons CC0; 17 needed slugs live | verified (researcher, LICENSE.md + CDN checks) |
| Solar artwork CC BY 4.0 | verified via package LICENSE-THIRD-PARTY + solar-icons.dev; repo LICENSE file 404s — re-check formality at implementation |
