# PROJECT INTELLIGENCE REPORT — MEGA Devs (megadevs.site)

> Stage 1 audit. Verified against the working tree on 2026-11-11. No source files were modified.
> Companion docs: `REDESIGN_BLUEPRINT.md`, `ICON_MIGRATION_MAP.md`, `CLAUDE_REDESIGN_PROMPT.md`, `DESIGN_RESEARCH.md`, `SUBAGENT_REPORTS/`.

## 1. Architecture & Framework

- **Framework:** Next.js **16.4.0** (App Router, Turbopack). `AGENTS.md` warning applies: consult `node_modules/next/dist/docs/` before using any Next API. Verified specifics:
  - Middleware is the **`proxy.ts`** convention in 16.4 (deprecated `middleware.ts` rename). The project already uses root `proxy.ts` ✔ (subdomain rewrite + rate-limit backstop + reserved-slug guard).
  - `next/dynamic` with `ssr: false` **must be called inside a client component** (error in server components) — confirms the SwimmingGlass mount plan (client wrapper imported by the server `layout.tsx`).
- **React** 19.2.4, **TypeScript** 5, **Tailwind CSS v4** (via `@tailwindcss/postcss`; `@theme` tokens in `app/globals.css`), but ~90% of styling is hand-written per-area CSS.
- **Backend:** Firebase client SDK v12 (Auth + Firestore) in `lib/firebase.ts`; Cloudinary unsigned uploads (dashboard + builder); no custom server. One API route: `app/api/login-gate/route.ts` (Firestore-backed login gate, fail-closed).
- **Deploy:** Netlify (`netlify.toml`, `@netlify/plugin-nextjs`), strict security headers + CSP (`script-src 'self' 'unsafe-inline' 'unsafe-eval'`; `img-src https:` allowed; fonts from Google allowed). CSP permits canvas/WebGL components and same-origin/https images for MaskedHeading.
- **i18n:** `app/lib/i18n.tsx` — `LanguageProvider` + `t(english) → arabic` map keyed by English source strings, EN/AR with `<html lang dir>` swap and a full-screen "wipe" transition (note: wipe gradient uses off-brand colors `#a78bfa→#5eead4`).
- **Theme:** `data-theme="light" | "dark"` on `<html>`, set in `Navbar.tsx` from `localStorage` **after hydration** (no blocking script, default dark → light-theme users see a dark flash). No "system" option today.

## 2. Route Map / Page Inventory

| Route | File | Rendering | Purpose |
|---|---|---|---|
| `/` | `app/page.tsx` + `page.css` | client | Marketing home: hero ("We Ship. / Fast. / Always."), ticker, stats, DevMega ad, services, process, works list, stack (`#stack` `.stack-grid`), FAQ, team, marquee, contact, history CTA, footer |
| `/works` | `app/works/page.tsx` | client, inline `<style>` | Portfolio; `<h1 className="w-headline">{t("Work we're")}<br/><em>{t("proud of")}</em></h1>`; 8 projects with animated "window" visuals; optional `shot` screenshots |
| `/history` | `app/history/page.tsx` | client, inline `<style>` | Timeline 2023–2027, pillars grid, stats; `.h-nav` is `display:none !important` (dead code) |
| `/palestine` | `app/palestine/page.tsx` | client, inline `<style>` | Solidarity page, **own palette** (`--red #e2263c`, `--pgreen #22a866`); sticky `.pal-masthead` with 14px blur |
| `/login` | `app/login/page.tsx` | client | Google sign-in; hardcoded dark palette (`#050507`), ignores theme; login-gate lock check |
| `/dashboard` | `app/dashboard/page.tsx` + `dashboard.css` | client | Profile editor; auth-gated; sticky preview (`.preview-sticky`), `.glass-panel`/`.glass-card` blur surfaces; Cloudinary upload; quota via `rateLimit.ts` |
| `/builder` | `app/builder/page.tsx` + `builder.css` | client | Full-screen canvas site builder (navbar hidden — `builder` not in `APP_SEGMENTS`) |
| `/[subdomain]` | server (`connection()` + Firestore) | server | Public profile → `PremiumProfileCard` or `ProProfile` (pro design). **User content: pixel-equivalent rule** |
| `/site/[slug]/[[...page]]` | server | server | Published builder sites via `CanvasStage`. **User content: pixel-equivalent rule** |
| `/api/login-gate` | route handler | — | GET availability / POST consume |
| `sitemap.ts`, `robots.ts` | force-static | — | Both still list `megadevs.vercel.app`; sitemap missing `/works`, `/history`, `/palestine` |

Subdomain hosts (`*.megadevs.site`, `*.localhost`) are rewritten by `proxy.ts` to `/[subdomain]`; navbar hides itself via `isSubdomainHost()` + `APP_SEGMENTS = {"", works, history, dashboard, login, palestine}` (note: `builder` intentionally excluded).

## 3. Component Map

**Global chrome** — `app/layout.tsx` (server): 8 `next/font` families → `LanguageProvider` → `LoadingScreen` (every visit, runs to `load`+1200ms, locks body scroll) → `Navbar` → page.

**`app/components/`**
- `Navbar.tsx` (289 ln) + `navbar.css` — fixed full-width bar (62px, blur 20px), logo pair (`/light_mode_img.jpg` **missing**, `/dark_mode_img.jpg` exists), 4 essential links, "/ Index" palette trigger (**only `/` key — no ⌘K/Ctrl+K**), lang + theme buttons (glyphs `ع/EN`, `☾/☀`), burger + drawer (`.mnav-drawer`, breakpoint **860px**, no focus trap/inert/body-scroll-lock), command palette (`.mnav-cmd`, no ARIA combobox, no arrow-key nav, Enter = first match), toast (`.mnav-toast`, no `aria-live`). Contains `sections`, `essentials`, `actions`, `APP_SEGMENTS`, `isSubdomainHost`.
- `LoadingScreen.tsx`, `MagneticButton.tsx` (hero CTA; 5px translate magnetic), `DevMegaAd.tsx/.css` (solid panel card, no blur).
- **User-content components (do not restyle):** `PremiumProfileCard.tsx` (857 ln, inline brand-logo SVGs, QR modal, blur surfaces), `ProProfile.tsx` + `pro/*` (Aurora, Hero, LinkCard, Nav, TiltCard, proData — **the only `react-icons` consumers**: `FiArrowDown`, `FiArrowUpRight`, `FiArrowRight`, `FiGithub`, `Fa*` brand set), `CanvasStage.tsx`, `CanvasElementView.tsx`, `canvas-buttons.css`.
- **Unused (verified zero imports):** `Scene.tsx` (three), `MouseTracker.tsx`, `palestine/Scene3D.tsx` (three), root `MeetDevelopersExtracted.tsx`.

**`app/lib/`** (do-not-touch logic): `builderTypes.ts`, `buttonPresets.ts`, `fonts.ts` (builder Google-Fonts library — unrelated to site fonts), `i18n.tsx`, `rateLimit.ts`, `reserved.ts`, `sanitizeUrl.ts`.

## 4. Styling Architecture

- `app/globals.css`: Tailwind v4 import + `@theme` color tokens (partially duplicating `page.css` tokens), Arabic override block (`[lang="ar"] * { font-family: var(--font-arabic) …; letter-spacing: normal; }`), `.reveal` class, scrollbar/selection.
- `app/page.css`: **the real token source** — `:root/[data-theme]` tokens (below), fonts, shared primitives (`.kicker .meta .rule .wrap`), all homepage sections, breakpoints **1180/1024/860/560**, `prefers-reduced-motion` global kill, custom cursor (`cursor: none` + red dot on fine pointers).
- Per-area CSS: `navbar.css` (duplicate `--mnav-*` token set), `dashboard.css`, `builder.css`, `[subdomain]/pro-design.css`, `subdomain-bg.css` (18 user-selectable backgrounds), `DevMegaAd.css`, `canvas-buttons.css`. `/works`, `/history`, `/palestine`, `/login` use inline `<style>` blocks.

**Brand tokens (locked):**
- Dark: `--paper #0c0b0f`, `--ink #f4f2ed`, `--ink-soft #a8a49e`, `--ink-mute #6a6862`, `--panel #111015`, `--panel-2 #18171e`, `--accent #ef4444`, `--rule rgba(244,242,236,.1)`, `--rule-2 rgba(244,242,236,.18)`.
- Light: `--paper #f6f3ec`, `--ink #111010`, `--ink-soft #57534b`, `--ink-mute #8a857b`, `--panel #faf8f2`, `--panel-2 #ece7db`, `--accent #d92b1f`, rules at .1/.2 black.
- Easing: `--ease cubic-bezier(0.22,1,0.36,1)`, `--ease-spring cubic-bezier(0.34,1.4,0.5,1)`.

**Fonts (8 loaded in layout):** Outfit (`--font-outfit` → `--font-display`, the **body font**), Space Grotesk (`--font-ed`, headings/UI), JetBrains Mono (`--font-mono`), Sora (`--font-logo`, dashboard logo + lang wipe), Geist + Geist Mono (ProProfile only), Cairo (`--font-arabic`), DM Serif Display (`--font-accent`, italic `<em>` accents). Plan: trim to 4 global (Space Grotesk, DM Serif, JetBrains Mono, Cairo); Geist scoped to ProProfile; Outfit/Sora removed — **removing Outfit changes body copy to Space Grotesk** (`var(--font-ui)`), an intentional, visible change.

**Existing `backdrop-filter` inventory** (Phase D targets ✱ / user-content keep ✦):
✱ `.mnav-bar` 20px, `.mnav-overlay` 8px, `.mnav-cmd-overlay` 16px (palette panel itself is solid `--mnav-panel`); ✱ dashboard `.glass-panel` 16px / `.glass-card` 20px / `.nav` 20px; ✱ palestine `.pal-masthead` 14px; dead: history `.h-nav`; ✦ `PremiumProfileCard` (48/12/14/44px) and `subdomain-bg.css` — public user content, untouched.

## 5. Dependencies

Installed (lockfile restored for audit): `next 16.4.0`, `react/react-dom 19.2.4`, `framer-motion 12.38` ✔ (CircularText-ready), `firebase 12.14`, `qrcode.react 4.2` (PremiumProfileCard QR — keep), `react-icons 5.7` (pro/* only — **remove in Phase C**), `three 0.184` + `@react-three/fiber 9.6` + `@react-three/drei 10.7` + `@types/three` (**only consumed by the two unused Scene files — removal safe**).
To add in Stage 2 only: `gsap` (latest 3.15.1) and `@solar-icons/react` (latest **2.5.0**; subpath exports `./linear/*` etc.; `SolarProvider` exported from root; naming verified — see `ICON_MIGRATION_MAP.md`; the magnifier icon is **`MagnifierIcon`**, not "Magnifer", in v2).

## 6. Assets

| Asset | Status |
|---|---|
| `/dark_mode_img.jpg` (logo, dark) | exists, used by navbar |
| `/light_mode_img.jpg` (logo, light) | **referenced but MISSING** → broken img in light theme. Ask user |
| `/works/kira-store-v2.png`, `/works/devfolio-v2.png` | **referenced but MISSING** (no `public/works/`); works page falls back gracefully via `onError` |
| MaskedHeading media for `/works` `<h1>` | **none available** → keep old heading until user supplies an image |
| `/developers/ahmed.jpg`, `/developers/seif.jpg` | exist, used |
| `/WEBPH.png`, `next/vercel/file/window/globe.svg` | unused → delete in Phase A |
| `google*.html` verification files | keep |
| `app/icon.png` | favicon, keep |

## 7. Functional Inventory (must survive unchanged)

Login (Google popup + login-gate lock), dashboard profile CRUD + quota (`rateLimit.ts` 30 writes/day) + Cloudinary image upload (10MB cap) + subdomain claim (`reserved.ts`), builder multi-page canvas editor + publish to `sites/{slug}`, public profile & site rendering, subdomain rewrite, FAQ accordion, command-palette navigation/actions, EN/AR toggle with RTL flip, theme toggle with dissolve, works/ history/ palestine content.

## 8. Current Design Weaknesses

1. Theme flash on load (no blocking script); no system theme.
2. Token duplication: `globals.css @theme` vs `page.css` vs `navbar.css --mnav-*` vs four inline `<style>` pages.
3. Glyph/emoji icons throughout UI (`◐ ☾ ☀ ✉ ⌥ → ↗ 🖼️ 🅣 ⬛ ▢ 🇵🇸`) — inconsistent weights, no RTL mirroring, screen-reader noise.
4. A11y gaps: drawer & palette lack focus traps/ARIA/keyboard model; toast lacks `aria-live`; palette Enter-first-match only.
5. LoadingScreen runs every visit (hurts LCP and repeat UX).
6. `/login` ignores theming and brand tokens; i18n wipe uses off-brand gradient.
7. Blur surfaces are flat single-layer blurs (no material system); dashboard glass uses non-brand white alphas.
8. Broken asset references (§6); sitemap/robots list a dead vercel domain and omit real routes.
9. Inconsistent breakpoints (1180/1024/860/560) and per-page duplicated primitives.
10. Dead code: Scene/MouseTracker/Scene3D/MeetDevelopersExtracted, `.h-nav`, unused public svgs; unused three.js dependency weight in `package.json`.
11. MEGA ROM link inconsistency: home says `roms.megadevs.site`, works says `megaroms.ggff.net` (content fix for the user to confirm).

## 9. Technical Constraints & Risks

- Marketing pages are fully client-rendered; keep them client (no architecture rewrite in scope).
- `/[subdomain]`, `/site/...`, builder canvas output: pixel-equivalent except approved icon swaps.
- CSP blocks third-party scripts; all new effects must be first-party (all appendix components are).
- WebGL budget on `/`: SpecularButton + SwimmingGlass only (2 contexts).
- `next/font` + Netlify: font changes are build-time only, safe.
- Arabic: character-splitting canvas/clip text breaks joining → per-component AR fallbacks (TechText, MaskedHeading, CircularText) are mandatory, already specified in Phase 5B.
- `prefers-reduced-motion` is currently nuked globally via `animation-duration: 0.01ms !important` in `page.css` — new components self-handle RM, but this global rule also hard-kills them; keep it (it's the stronger guarantee) and ensure components look correct when frozen.

## 10. Phase 5B placement verification (all checked against source)

| 5B item | Verified anchor | Status |
|---|---|---|
| TechText hero | `app/page.tsx` `<h1 className="hero-title">` — three `motion.span`s: "We Ship." / "Fast."(`.accent`) / "Always."(`.outline`) | ✔ matches; line 3 stays outline span per spec |
| SpecularButton | `.hero-promo` → `<a href="https://megadevs.site/login" className="promo-link">{t("Start Now →")}</a>` | ✔ matches; AR key `"Start Now →": "ابدأ الآن →"` must be split per icon map |
| LogoLoop | `#stack` section `.stack-grid` = `techStack.map` cells; `stack-meta` rows beside; `.ticker` above | ✔ matches |
| StaggeredMenu | `Navbar.tsx` `.mnav-drawer` exists | ⚠ breakpoint conflict: drawer switch is **860px** today, plan says 768px (see CLAUDE_REDESIGN_PROMPT §Adjustments) |
| MaskedHeading | `/works` `<h1 class="w-headline">` | ⚠ heading is 2 i18n strings + `<br/>` + serif `<em>`; image missing → keep old heading until asset supplied |
| AnimatedContent | `whileInView` on `/`, `/works`, `/history`, `/palestine` + `.reveal` CSS defined in globals (class itself barely used) | ✔ |
| CircularText / SwimmingGlass / LiquidGlass | mount points free; no HeroGlass/FluidGlass anywhere (`grep` clean — Stage 2 §2 is a no-op) | ✔ |
