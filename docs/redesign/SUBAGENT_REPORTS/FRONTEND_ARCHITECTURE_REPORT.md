# FRONTEND ARCHITECTURE REPORT

> Authored by the main agent from the live-code audit (see `../PROJECT_INTELLIGENCE_REPORT.md` for the full inventory — not duplicated here). Focus: constraints, risks, and reuse opportunities for the redesign.

## Framework conventions that bind the redesign (Next 16.4, verified in `node_modules/next/dist/docs/`)

1. **`proxy.ts` is the middleware convention** (deprecated `middleware.ts` renamed). Root `proxy.ts` already complies — do not touch (subdomain rewrite, rate-limit backstop, reserved slugs).
2. **`next/dynamic` + `ssr: false` only inside client components.** `app/layout.tsx` is a server component → SwimmingGlass must mount via a small client wrapper (`'use client'` file that itself calls `dynamic(() => import('../SwimmingGlass'), { ssr: false })` after `requestIdleCallback`), imported by the layout. This matches 5B.2.2 exactly.
3. React 19.2.4 is pinned. The bundled Next guide for `<ViewTransition>` requires **React 19.3+** — the installed `react` has no `ViewTransition` export (verified by the motion researcher). Decision for the blueprint: **skip the React ViewTransition component**; use framer-motion/GSAP transitions, optionally plain CSS `@view-transition` later. No React upgrade inside this redesign (risk containment).
4. Tailwind v4 `@theme` exists but utilities are a minority; the hand-written CSS token system is authoritative. Phase B should make `app/styles/tokens.css` the single source and map Tailwind `@theme` onto it — not the reverse.

## Component reuse opportunities

- `Navbar.tsx` is 5 responsibilities in one file → split (Phase E) into `nav/Navbar`, `nav/CommandPalette`, `nav/Toast`, `nav/ThemeToggle`, `nav/LangToggle`, `nav/MobileMenu(StaggeredMenu)`; hoist `APP_SEGMENTS`/`isSubdomainHost` into `app/lib/appRoutes.ts` so dashboard/builder can share them.
- Shared primitives already exist as CSS classes (`.kicker`, `.meta`, `.rule`, `.wrap`, `.btn-solid`, `.btn-line`) but are re-declared in four inline `<style>` pages → extract to `app/components/ui/` + one stylesheet; the inline-style pages should import it instead of re-declaring.
- `MagneticButton` survives as the magnetic-interaction primitive (already restrained: 5px translate, touch-gated).
- The works/history/palestine inline `<style>` blocks are the main obstacle to tokens; converting them to token references (not rewriting the pages) is the low-risk path.

## Risks

| Risk | Mitigation |
|---|---|
| `npm install` during a running `next dev` corrupted Turbopack cache once during audit (`@vercel/turbopack-next/internal/font/google/font` module-not-found for Sora) | Delete `.next`, restart dev server. Also disappears in Phase B when Sora is removed |
| Marketing pages fully client-side → every new component adds to one big client bundle | Lazy-load WebGL (SwimmingGlass); gsap imported only inside components that use it; per-icon Solar imports |
| Global `prefers-reduced-motion` kill rule (`page.css`) freezes ALL animation incl. new components | Keep the rule; new components must present a correct static first frame |
| Theme set post-hydration → FOUC | Phase B blocking inline script + `suppressHydrationWarning` |
| User-content surfaces share CSS files with app surfaces (`subdomain-bg.css` imported by dashboard AND public pages) | Phase D touches only app-chrome selectors; never edit shared user-content classes |
| LoadingScreen gates LCP every visit | Phase E: once per session, ≤900ms cap |
| Removing `three`/`@react-three/*` | Safe — only consumed by the two unused Scene files (verified zero imports) |
| i18n keys are English literals; splitting glyphs out of keys breaks AR lookups if missed | Icon map §7 lists every key change; change EN key + AR entry in the same commit |

## Key decisions for the blueprint
- Keep client-page architecture; no SSR conversion.
- Single token source `app/styles/tokens.css`; inline-style pages consume tokens.
- No React upgrade; no `<ViewTransition>`; motion via framer-motion + gsap only.
- SwimmingGlass via client wrapper + `next/dynamic` ssr:false + idle mount.
- Extract `appRoutes.ts`; split Navbar; shared `ui/` primitives.
