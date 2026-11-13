# IMPLEMENTATION REPORT — Stage 2

What actually shipped, how it differs from the Stage 1 plan, and what is verified vs. open.
Baseline commit: `29ed596`. Read with `REDESIGN_BLUEPRINT.md` (spec) and `CLAUDE_REDESIGN_PROMPT.md` (plan).

## Commits

| Phase | Commit | Scope |
|---|---|---|
| Baseline | `29ed596` | pre-redesign snapshot + Stage 1 docs |
| A | `f81e467` | dead code/assets removed, three.js stack uninstalled, sitemap/robots domains fixed |
| B | `147535b` | token system, light/dark/system theme without flash, fonts 8→4 |
| C | `ebae11b` | Solar Icons migration, vendored brand logos, `react-icons` removed |
| D | `b73fc1c` | LiquidGlass material + first surface conversions |
| E | `39d3679` | nav split, ⌘K palette, StaggeredMenu phone nav, LoadingScreen, skip link |
| F | `dfebe74` | TechText hero, SpecularButton, LogoLoop, orb + badge, AnimatedContent reveals |
| G | `5e04a92`, `0f44616` | page passes, login re-skin, builder chrome, Spotlight, lint scoping |
| H | `3e7b295`, `c86da39` | QA fixes, phone dock, CardSwap, X close buttons |

## Deviations from the plan (and why)

1. **Nav shape changed twice, then the phone chrome was redesigned.** The plan specified a floating pill + StaggeredMenu below 768px. On request: full-width bar → back to the floating pill (desktop), and phones now use a **bottom dock** (`nav/MobileDock.tsx`) instead of a top bar: `[menu][theme][home] (logo) [Works][History]`. The centre logo is a raised frame that opens the command palette; the menu button doubles as the panel's close control. StaggeredMenu gained a **controlled mode** (`open`/`onOpenChange`/`hideHeader`) to support this — an extension of the one component the spec allows editing.
2. **CardSwap added to `/works`** (not in the original plan; requested mid-implementation). Two-column hero ≥1024px, stack built from the existing `works` array, front-card click scrolls to that project's section.
3. **Primary CTA became a SpecularButton too.** The plan put SpecularButton only on the small "Start Now" promo link; "Start a Project" now uses it as well, keeping `.btn-solid` metrics and scroll-to-`#contact` behaviour.
4. **View Transitions dropped** — React's `<ViewTransition>` needs React 19.3 and the repo pins 19.2.4. Transitions are framer/GSAP only.
5. **`SolarProvider` skipped** — icons are provider-free and RSC-safe; explicit `size` per icon instead.
6. **MaskedHeading not used.** `/works` keeps its two-line serif-em heading because no screenshot asset exists (see Open items). The component is in the repo, configured and ready.
7. **Background badge now shows on phones** (smaller). It was only hidden below 768px because of the old top-right menu toggle, which no longer exists.
8. **SwimmingGlass orb is desktop-only** — on phones it cost a WebGL context and competed with the dock.
9. **Lint rules scoped, not disabled.** `react-hooks/set-state-in-effect` → warn globally (the SSR hydration pattern this app uses); `no-explicit-any`/`react-hooks/refs`/`prefer-const` → warn **only** under `app/components/reactbits/**` and `FluidGlass.tsx`, which are kept byte-identical to upstream. First-party code keeps the strict rules.

## Bugs found and fixed during QA (not in the original plan)

- **Cascade-layer regression (critical, self-inflicted in Phase B).** The universal reset was moved into an *un-layered* stylesheet; un-layered CSS beats `@layer utilities`, so `* { padding: 0 }` silently killed **every Tailwind spacing utility** used by the vendored components. Reset moved into `@layer base`.
- **Global cursor bug (pre-existing).** `cursor: none` lived in `page.css`, which Next bundles app-wide, while the cursor dot only rendered on `/` — every other route had no visible pointer. Replaced by a global `CustomCursor` (accent dot + trailing ring, expands over interactive targets) that hides the native cursor *only* while it is active; touch, reduced-motion and JS-off keep the real cursor.
- **Hydration risk.** `useBrandColors` read the live theme during render, so SSR markup (dark) and the first client render (light) could disagree inside `style` attributes. It now starts from the dark fallback and syncs in an effect.
- **Contrast failures (measured).** `--ink-mute` was 3.53:1 (dark) / 2.49:1 (light) on modal glass and 3.19:1 on the nav key pill — all below AA for small text. Those surfaces now use `--ink-soft` (7.93 / 5.19 / 7.18:1).
- **Off-brand colors.** The language-wipe gradient was `#a78bfa → #5eead4`; re-tinted to brand tokens. Remaining literals in `page.css` tokenized.
- **Hero rhythm.** TechText centres each line's *ink box*, so a line with a descender ("We Ship.") and one without ("Fast.") sat at different heights, opening a large gap. Canvas height is now em-relative with a per-line pull.
- Dead `.h-nav` rules deleted; `--font-mono: var(--font-mono)` self-reference removed; phone top clearance for the removed top bar deleted site-wide.

## Verified

- `npm run build` passes on every commit; `npm run lint` **errors 65 → 26**, all pre-existing (`no-explicit-any`, `prefer-const`, one unescaped entity) in untouched business-logic files. Zero new errors.
- `npx tsc --noEmit` clean.
- All 7 app routes return 200 and render with exactly **one `<h1>`**, no horizontal overflow (`scrollWidth === innerWidth` at 390px), and no reveal wrapper left stuck at `visibility: hidden`.
- Homepage: 3 LiquidGlass surfaces (within the ≤3 mobile budget), `sr-only` hero text present, `<noscript>` reveal guard emitted, `.sr-only`/`.invisible` utilities generated.
- Marketing bundle is **Firebase-free**: the only "firebase" match in homepage JS is an i18n translation string; the SDK loads lazily when the palette or menu is first opened.
- `grep -rn "react-icons\|HeroGlass" app` → empty.
- Phone dock, StaggeredMenu (numbering, socials, in-panel toggles, X close), and the ⌘K palette (glass refraction, grouped options, X close) confirmed by screenshot.
- Light theme verified on `/`, `/works`, `/history`, `/palestine`.

## Open items / not verifiable here

1. **`/login`, `/dashboard`, `/builder` could not be exercised end-to-end**: `.env` is gitignored and absent in this environment, so Firebase throws `auth/invalid-api-key` on mount. Their markup builds and renders; **the auth, quota, upload, subdomain-claim and publish flows still need a run with real credentials.**
2. **Missing assets (unchanged from the checkpoint):** `public/light_mode_img.jpg` (the navbar uses the dark mark in both themes as a placeholder), `public/works/kira-store-v2.png`, `public/works/devfolio-v2.png`, and a screenshot for MaskedHeading on `/works`.
3. **MEGA ROM URL conflict:** the homepage links `roms.megadevs.site`, `/works` links `megaroms.ggff.net`. Left as-is — needs your decision.
4. **Light-mode accent on small text** remains a brand-level tension: `#d92b1f` on `#f6f3ec` is 4.39:1. Mitigated by role (small mono kickers use `--ink-soft` with an accent rule); the hex is unchanged per the brand lock.
5. **Next.js security advisory:** `next build` prints an upgrade reminder for 16.4.0. Not actioned — dependency scope was locked to `+gsap`, `+@solar-icons/react`.
6. Cross-browser (Safari/Firefox) and Lighthouse numbers were not measured in this environment; the glass fallback path (non-Chromium → blur) is implemented but unverified on real Safari.
