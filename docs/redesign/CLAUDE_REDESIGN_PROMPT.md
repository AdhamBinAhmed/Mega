# CLAUDE_REDESIGN_PROMPT — Stage 2 Implementation Plan (audit-adjusted)

> **Status: executed.** See `IMPLEMENTATION_REPORT.md` for what actually shipped,
> the deviations agreed during implementation (phone bottom dock, CardSwap on
> /works, SpecularButton on the primary CTA), the bugs found in QA, and the
> open items. Where this plan and the report disagree, the report is current.

Execute the MEGA Devs Liquid-Glass redesign in this repo (`C:\Users\adham\Desktop\Mega`). This document is self-sufficient: architecture facts come from `PROJECT_INTELLIGENCE_REPORT.md`, the visual spec from `REDESIGN_BLUEPRINT.md` (§1 tokens, §3 glass map, §4 primitives, §5 pages, §6 a11y), icons from `ICON_MIGRATION_MAP.md`, research rationale from `DESIGN_RESEARCH.md`. **Component source code: `APPENDIX_CODE.md` in this directory — copy each file exactly as written there.** Where anything disagrees, the Phase 5B specs (§5 below) win.

## 0. Ground rules (binding)

1. Next.js **16.4** — read the matching doc in `node_modules/next/dist/docs/` before using any Next API. Known: middleware = `proxy.ts` (already present, don't touch); `next/dynamic` `ssr:false` only inside client components.
2. **Never change brand colors or fonts.** Dark `--accent #ef4444 / --paper #0c0b0f / --ink #f4f2ed`; light `--accent #d92b1f / --paper #f6f3ec / --ink #111010`. Fonts: Space Grotesk, DM Serif Display (italic `<em>`), JetBrains Mono, Cairo (AR). Replace every demo color in React Bits components (`#5227FF`, `#B497CF`, white panels, `#525252`, `bg-white`, `text-black`, `#e9e9ef`, `#111`…) with brand tokens.
3. Do **not** change: Firestore reads/writes, `app/lib/rateLimit.ts`, `firestore.rules`, `storage.rules`, Cloudinary calls, `app/api/login-gate`, `proxy.ts`, `reserved.ts`, `sanitizeUrl.ts`, `builderTypes.ts`, `fonts.ts`, `buttonPresets.ts`, `CanvasElementView` output, i18n `t()` mechanics, `netlify.toml`.
4. `/[subdomain]`, `/site/...`, builder canvas output: pixel-equivalent except like-for-like icon swaps (see icon map §6).
5. Icons: `@solar-icons/react` v2 (`import { XIcon } from '@solar-icons/react/linear'`). Brand logos in `app/components/icons/brand.tsx` (Simple Icons CC0 paths, monochrome `currentColor`). Remove `react-icons`.
6. Dependencies: **add only `gsap` and `@solar-icons/react`; remove `three @react-three/fiber @react-three/drei @types/three react-icons`.** `framer-motion` 12.38 is installed (CircularText uses it). Do not add `motion`.
7. All new components are client components; marketing pages are already client.
8. Every animated component respects `prefers-reduced-motion` (shipped behavior — don't remove). The global RM kill-rule in `page.css` stays.
9. Every placement works under `dir="rtl"` (per-component notes in §5).
10. Commit per phase; `npm run lint && npm run build` must pass at every commit.

## 1. Audit adjustments to the original plan (all verified against source — honor these)

| # | Original plan said | Audit found | Adjusted instruction |
|---|---|---|---|
| A1 | Stage 2 §2 "Undo HeroGlass" | `grep -rn "HeroGlass\|FluidGlass" app` is already empty | §2 is a **no-op**; skip |
| A2 | `MagniferIcon` | v2.5.0 renamed → **`MagnifierIcon`**; also **no `TextIcon`** (use `TextSquareIcon`), no `ExternalLinkIcon` | use corrected names; verify each import against `node_modules/@solar-icons/react/dist/icons/style/linear.d.mts` |
| A3 | Phase C "Add SolarProvider" | Provider optional; icons provider-free, RSC-safe, auto `aria-hidden` | Skip the provider; pass explicit `size`; add package to `optimizePackageImports` |
| A4 | StaggeredMenu < 768px | current burger/drawer breakpoint is **860px** | adopt **768px** per plan; verify 4 pill links + actions fit at 768–860 (they measure ~fit at 0.78rem); if cramped, drop "Our Story" from `essentials` at <1024 rather than moving the breakpoint |
| A5 | MaskedHeading on `/works` h1 | heading is `{t("Work we're")}<br/><em>{t("proud of")}</em>` (two keys + serif em); `/works/*.png` missing | keep current heading until user supplies an image; when supplied, text = `t("Work we're proud of")` (add key + AR), serif-`<em>` styling is lost — user accepted/sees checkpoint |
| A6 | Liquid transitions "explore View Transitions" | React `<ViewTransition>` needs React 19.3; repo pins 19.2.4 | **No React bump, no VT**; framer/GSAP only (DESIGN_RESEARCH §4) |
| A7 | Phase D table | extra live blurs exist: palestine `.pal-masthead` (14px), dashboard `.nav` (20px); history `.h-nav` is dead code; overlays `.mnav-overlay/.mnav-cmd-overlay` blur | masthead → `nav` glass with `--lg-accent: var(--red)` scope; dashboard `.nav` → `nav`; delete `.h-nav` rules; overlays lose blur → plain `rgba(0,0,0,.5)` dim |
| A8 | — | `PremiumProfileCard`/`subdomain-bg.css` blurs are user content | never convert those |
| A9 | Fonts 8→4 | Outfit is the current **body** font; Sora used by dashboard `.logo` + lang-wipe | body becomes Space Grotesk via `--font-ui`; alias `--font-display/--font-ed/--font-logo → var(--font-ui)`, `--font-serif → var(--font-accent)`; this is a visible change, approved at checkpoint |
| A10 | — | i18n lang-wipe gradient is off-brand (`#a78bfa→#5eead4`) | re-tint wipe to `var(--accent)/var(--paper)` (style-only; `t()` mechanics untouched) |
| A11 | sitemap fix | sitemap AND `robots.ts` list `megadevs.vercel.app` | fix both to `https://www.megadevs.site` + add `/works /history /palestine` to sitemap |
| A12 | — | palette opens on `/` only | Phase E adds ⌘K + Ctrl+K, keeps `/` |
| A13 | — | works-page MEGA ROM link `megaroms.ggff.net` vs home `roms.megadevs.site` | ask user which is canonical; don't silently change |
| A14 | — | light accent #d92b1f small text = 4.39:1 (AA fail, pre-existing) | hex locked; in light mode use accent only for ≥large text/graphics; small kickers get `--ink-soft` + accent rule (Blueprint §6) |
| A15 | — | Solar artwork CC BY 4.0 | add attribution line to footer colophon ("Icons: Solar by 480 Design — CC BY 4.0") |
| A16 | TechText height `clamp(64px,11vw,170px)` | `.hero-title` caps at 13rem (208px) | start from `clamp(64px, 12vw, 190px)` and tune to match current rendered size at 1440 |
| A17 | SwimmingGlass pages incl. `/login` | `/login` currently has no theme/token support | Phase G brings `/login` into tokens first, then mount orb |
| A18 | npm install during dev corrupted Turbopack cache once | — | if `@vercel/turbopack-next/internal/font/google/font` error appears: stop dev, delete `.next`, restart |

## 2. Subagents (create in `.claude/agents/`, Markdown + YAML frontmatter)

Create `token-auditor`, `a11y-reviewer`, `icon-migrator`, `visual-regression` exactly as defined in the master prompt Stage 2 §3 (definitions reproduced in `APPENDIX_CODE.md` §Agents). Run read-only ones in parallel; main agent integrates.

## 3. Phases (commit each; lint+build green)

**A — Baseline & cleanup.** Screenshots of `/ /works /history /palestine /login /dashboard` at 1440+390, dark+light, en+ar → `docs/redesign/baseline/`. Delete `app/components/Scene.tsx`, `app/components/MouseTracker.tsx`, `app/palestine/Scene3D.tsx`, `MeetDevelopersExtracted.tsx`, `public/{WEBPH.png,next.svg,vercel.svg,file.svg,window.svg,globe.svg}` (keep `google*.html`). `npm uninstall three @react-three/fiber @react-three/drei @types/three`. Fix sitemap+robots (A11). Light logo: ask user for `light_mode_img.jpg`; don't invent one.

**B — Tokens, theme, fonts.** `app/styles/{tokens,motion,base}.css` per Blueprint §1 / DESIGN_SYSTEM_REPORT; `app/styles/liquid-glass.css` verbatim from APPENDIX_CODE. Import order: tailwind → tokens → liquid-glass → motion → base. Map `@theme` to tokens; delete duplicate token blocks from `page.css` + `--mnav-*` from `navbar.css`. Theme `light|dark|system` with blocking inline head script + `suppressHydrationWarning`; toggle cycles 3 states. Fonts per A9; Geist scoped into `ProProfile`. `MotionConfig reducedMotion="user"` in client tree.

**C — Icons** (`icon-migrator` agent): follow `ICON_MIGRATION_MAP.md` exactly (incl. §7 i18n key splits, EN+AR together). Create `brand.tsx` (17 logos). Like-for-like swaps in `pro/*` and user-content surfaces only. Then `npm uninstall react-icons`; grep must be clean.

**D — Glass material.** `app/components/LiquidGlass.tsx` verbatim from APPENDIX_CODE. Convert every surface in Blueprint §3's table (incl. A7 additions): delete old `background/backdrop-filter/border/box-shadow`, keep layout. No nested glass; ≤3 refracting on mobile; overlays become plain dim.

**E — Global chrome.** Split `Navbar.tsx` → `app/components/nav/{Navbar,CommandPalette,Toast,ThemeToggle,LangToggle,MobileMenu}.tsx`; `MobileMenu` = StaggeredMenu (§5.6). Keep `sections/essentials/actions` data verbatim; move `APP_SEGMENTS`/`isSubdomainHost` to `app/lib/appRoutes.ts`. Palette: ⌘K/Ctrl+K/`/`, combobox ARIA (`role=combobox` input, `listbox`+`option`s, `aria-activedescendant`), ↑↓ Home End Enter Esc, focus trap+restore, Account group (Dashboard/Builder/Sign out) only when `auth.currentUser`. Internal `<a>`→`next/link`. `app/components/ui/` primitives per Blueprint §4. LoadingScreen: once per sessionStorage, ≤900ms. Skip link. `<noscript><style>.invisible{visibility:visible!important}</style></noscript>` in layout.

**F — React Bits components.** All into `app/components/reactbits/`. From APPENDIX_CODE verbatim: `TechText.tsx`, `MaskedHeading.tsx`, `CircularText.tsx` (framer-motion import already switched), `SpecularButton.tsx`, plus `app/components/FluidGlass.tsx` + `app/components/SwimmingGlass.tsx`. From registry: `npx shadcn@latest add https://reactbits.dev/r/StaggeredMenu-TS-TW`, `.../AnimatedContent-TS-TW`, `.../LogoLoop-TS-TW` (fallback `npx jsrepo@latest add <url>` or download from reactbits.dev) → move into `app/components/reactbits/`, then apply ONLY the edits listed in §5.6 (StaggeredMenu is the only component whose source may be edited, plus its color/label changes).

**G — Pages.** Blueprint §5 layouts + §5 placements below. `/palestine` keeps its palette. `/login` tokens-first (A17).

**H — QA.** Run `a11y-reviewer`, `token-auditor`, `visual-regression`; fix all findings. Glass hardening follow-ups (fresh filter ids, modal-open navbar downgrade) only if regression testing shows the issues cited in LIQUID_GLASS_RESEARCH.

## 4. Placement map

| Component | Where | Pages |
|---|---|---|
| LiquidGlass | every surface in Blueprint §3 | all app pages |
| SwimmingGlass 60px orb | fixed, self-drifting, z40, pointer-events none | `/ /works /history /login /dashboard` only — never `/builder /palestine /[subdomain] /site/*` or subdomain hosts |
| TechText | hero `.hero-title` lines 1–2 (line 3 stays outline span) | `/` |
| MaskedHeading | `/works` `<h1 class="w-headline">` (gated on image, A5) | `/works` |
| CircularText | `BackgroundBadge.tsx`, fixed top-right, z0, hidden <768px | `/ /works /history` |
| SpecularButton | hero `.hero-promo` "Start Now" → `/login` | `/` |
| StaggeredMenu | phone menu <768px, replaces `.mnav-drawer` | global |
| AnimatedContent | section reveals (replaces `whileInView`/`.reveal`) | `/ /history /works /palestine` |
| LogoLoop | `#stack` replaces `.stack-grid`; keep `stack-meta` + ticker | `/` |

## 5. Component specs (binding — Phase 5B verbatim, with audit corrections)

### 5.1 LiquidGlass
Variants per `GLASS_VARIANTS` in the appendix; surface→variant table in Blueprint §3. No glass-on-glass; max 3 refracting on mobile.

### 5.2 SwimmingGlass
`FluidGlass.tsx` + `SwimmingGlass.tsx` (appendix). Mount once in `layout.tsx` through a client wrapper (`'use client'`) that renders it via `next/dynamic(..., { ssr:false })` after `requestIdleCallback` (fallback `setTimeout(…,1500)`), and returns null unless `usePathname()` is in the §4 allow-list AND `!isSubdomainHost(location.hostname)`. z40, below navbar/palette/menu; `pointer-events:none`; no mouse following.

### 5.3 TechText — hero (`app/page.tsx`)
- Keep `<h1 className="hero-title">`; real text in `sr-only` span (`t("We Ship.")`, `t("Fast.")`, `t("Always.")`); each TechText wrapped `<span aria-hidden="true">`, override `role="presentation"` + `aria-label={undefined}`.
- Line 1 `t("We Ship.")` wrapper `.hero-tt--ink{color:var(--ink)}`; line 2 `t("Fast.")` wrapper `.hero-tt--accent{color:var(--accent)}` — pass `color="currentColor"` (TechText resolves via `getComputedStyle(container).color`; repaints on `data-theme` change). Line 3 **stays the existing outline `motion.span`** (TechText can't draw outline).
- `accentColor`: line 1 `"currentColor"`; line 2 = resolved `--ink` hex from `getComputedStyle(document.documentElement)`, re-read on theme change (MutationObserver) so the frame reads against red.
- `fontFamily=""` (inherits — give the wrapper `.hero-title`'s font-family/weight) or pass computed value; `fontWeight` 700; `letterSpacing` −0.055 em; `align` = `left` LTR / `right` RTL from `useLang()`.
- Props: `reveal="letter" dashLength={4} dashGap={2} specks={15} intro="none" clickKick draggable guides={false} sweep labels`; keep hero mount animation by wrapping each line in the existing `motion.span` variants.
- Sizing: wrapper `<span className="hero-tt" style={{display:'block', height:'clamp(64px, 12vw, 190px)'}}>` (A16 tune), `fontSize` = current max px (208).
- **AR: render the original three `motion.span` lines** (character-splitting breaks Arabic joining). `touch-pan-y` built in.

### 5.4 MaskedHeading — `/works` (gated, A5)
When the user supplies a screenshot: `<MaskedHeading tag="h1" text={t("Work we're proud of")} mediaType="image" src={<supplied image>} tint={theme==='dark'?'#ef4444':'#d92b1f'} outline outlineColor="" reveal="rise" trigger="view" spotlight spotlightRadius={180} parallax={24} drift={12} fillScale={1.25} weight={800} tracking={-0.045} className=<Space Grotesk>/>`; clamp its container-driven font-size to ≤ current `clamp(2.8rem,8vw,6rem)`; `textScale` tuned to match. Literal theme hex for `tint` (CSS var won't resolve in blend). AR → original heading. Images same-origin/https only. Until then: current heading untouched.

### 5.5 CircularText — `app/components/BackgroundBadge.tsx`
`position:fixed; top:96px; inset-inline-end:24px; z-index:0; pointer-events:none; opacity:.55`; behind content, below navbar. `text={t("MEGA DEVS • WE SHIP FAST • ")}` (add AR i18n; if AR glyph-splitting renders broken, use EN string for both), `spinDuration={24} onHover="speedUp" size={150} fontSize={14} fontWeight={600} color="var(--ink-mute)" ring ringColor="var(--rule-2)"`, children = 8px red dot `background:'var(--accent)'`. JetBrains Mono uppercase. Mount `/ /works /history`; hidden <768px. Reduced motion static (built in). Uses installed framer-motion.

### 5.6 StaggeredMenu — `app/components/nav/MobileMenu.tsx` (<768px)
Registry install → move to `app/components/reactbits/StaggeredMenu.tsx`, then edit (ONLY allowed source edits):
- Panel `bg-white`→`var(--paper)` (optionally wrapped `LiquidGlass variant="modal"`; solid if legibility suffers). Items `#000/text-black`→`var(--ink)`; socials `#111`→`var(--ink-soft)`; toggle `#e9e9ef`→`var(--ink)`; focus→`var(--focus)`. Remove `filter:invert(100%)` on logo (use per-theme logo).
- Fonts: items `var(--font-ui)`; numbering/socials-title `var(--font-mono)`; AR → Cairo, tracking 0, no uppercase (global rule covers).
- Add `menuLabel`/`closeLabel` props → `t("Menu")`/`t("Close")` (AR keys per icon map §7); `'Socials'` → prop.
- Item font-size `clamp(2.25rem, 11vw, 3.5rem)`.
- a11y: focus first item on open, trap, Esc closes, restore to toggle, `inert`+`aria-hidden` when closed, body scroll lock, close on any link click (incl. `#section`).
- Config: `isFixed position={dir==='rtl'?'left':'right'} colors={['var(--panel-2)','var(--accent)']} accentColor="var(--accent)" menuButtonColor="var(--ink)" openMenuButtonColor="var(--ink)" changeMenuColorOnOpen={false} displayItemNumbering displaySocials logoUrl=<theme logo>`.
- Items: Home, Services, Works `/works`, History `/history`, Contact `#contact`, Palestine `/palestine` + Dashboard (`/dashboard`) when signed in else Login (`/login`); labels via `t()`. Consider DevMega external under socials (it's in current `sections` — don't lose it). Socials: GitHub URL from Navbar actions + founders' Telegram links (already on site). No invented accounts.
- <768px only; hide pill links there; menu header owns logo+toggle (hide old burger/dup logo); theme/lang toggles inside panel below items. z above SwimmingGlass/badge, below palette.

### 5.7 LogoLoop — `#stack`
Registry → `app/components/reactbits/LogoLoop.tsx`. Replace `.stack-grid` (`techStack.map`) with LogoLoop; keep `stack-meta` rows + top ticker. Logos: the 12 `techStack` entries as monochrome `currentColor` SVGs from `brand.tsx` (Simple Icons); "Android ROMs" → Solar `SmartphoneIcon`. `title`=name, labels show `cat`. Colors: inherit `var(--ink-soft)`, `hoverColor="var(--accent)"` for ALL. Labels `var(--font-mono)`. Props: `speed={60} logoHeight={36} gap={56} hoverSpeed={0} scaleOnHover fadeOut labels="below" muted={0.35} draggable ariaLabel={t("Tech Stack")}`; no hrefs; RTL `direction="right"`. Mobile `logoHeight={28} gap={36}`.

### 5.8 AnimatedContent — `/ /history /works /palestine`
Registry → `app/components/reactbits/AnimatedContent.tsx`. Replaces `.reveal` + section `whileInView` on those pages (remove old `initial/whileInView` from anything wrapped — no double animation). NOT on hero, navbar, or anything fixed. House: `distance={40} direction="vertical" duration={0.8} ease="power3.out" blur={6} threshold={0.15} once`; grids/lists `stagger={0.08}`; palestine `blur={0} distance={24} duration={1}`. RTL: `reverse` for horizontal (prefer vertical). No flash: wrapper starts `invisible` until GSAP runs + layout `<noscript>` override. `ScrollTrigger.refresh()` on pathname change + `document.fonts.ready`.

### 5.9 SpecularButton — hero "Start Now"
Replace `<a href="https://megadevs.site/login" className="promo-link">{t("Start Now →")}</a>` with `<Link href="/login" className="contents"><SpecularButton tabIndex={-1} …/></Link>` (one focusable link). Label `t("Start Now")` + Solar `ArrowRightIcon` (RTL-mirrored); i18n key split per icon map. **Resolved hex only** (canvas fillStyle can't take CSS vars): `useBrandColors()` reads `getComputedStyle(document.documentElement)` for `--accent/--ink/--rule-2`, re-reads via MutationObserver on `data-theme`. `lineColor={accent} baseColor={rule2→hex} textColor={ink} tint={accent} tintOpacity={0.08}`. Props: `size="md" radius={999} intensity={1} idleIntensity={0.35} shineSize={10} shineFade={34} thickness={1.2} glow={1} followMouse proximity={220} blur={0}`. Font inherits; keep `promo-link` size/weight. Without WebGL2 it's a tinted pill — verify visible.

## 6. Responsive / A11y / Performance / Testing / Acceptance

Exactly as Blueprint §6–§8 plus:
- Keyboard-only pass: nav, palette (⌘K/Ctrl+K//), phone menu (open/Tab trap/Esc), FAQ, SpecularButton link, dashboard forms.
- Functional regression: login (incl. locked gate), dashboard save+quota, image upload, subdomain claim, builder publish, public profile & site render, subdomain rewrite.
- Matrix: routes × {dark,light,system} × {en,ar} × {1440,390} × {Chrome,Safari,Firefox}; reduced-motion + `prefers-contrast` emulation.
- Acceptance checklist = master prompt Stage 2 §11 verbatim, plus: A1–A18 adjustments honored; Solar attribution present; no `TextIcon`/`MagniferIcon` imports; `grep -rn "react-icons\|HeroGlass" app` empty; Lighthouse mobile home Perf ≥90 / A11y ≥95 / BP ≥95 / SEO 100; no hydration warnings.

## 7. Open items awaiting the user (do not guess)

1. `light_mode_img.jpg` logo.
2. A `/works` screenshot for MaskedHeading (plus restoring `/works/kira-store-v2.png`, `/works/devfolio-v2.png` if desired).
3. Canonical MEGA ROM URL (A13).
4. Approval of: body font Outfit→Space Grotesk (A9), menu breakpoint 860→768 (A4), MaskedHeading flattening the serif-em heading (A5), light-mode small-accent-text mitigation (A14).
