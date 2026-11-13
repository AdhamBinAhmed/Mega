# REDESIGN BLUEPRINT — MEGA Devs × Liquid Glass

> **Status: implemented.** `IMPLEMENTATION_REPORT.md` records the as-built state.
> Notable changes to this spec: phones use a bottom dock (not the top pill +
> drawer), `/works` gained a CardSwap stack, the primary hero CTA is also a
> SpecularButton, View Transitions were dropped (React version), and
> MaskedHeading is wired but inactive pending an image asset.

> The binding visual strategy for Stage 2. Where this document and the master prompt's **Phase 5B** disagree, **Phase 5B wins**. Section numbers §1/§3/§4/§5/§6 are referenced by the Stage 2 phase plan (`CLAUDE_REDESIGN_PROMPT.md`).

**Design thesis.** The site already has a strong identity: a dark editorial "engineering magazine" — paper/ink, hairline rules, mono metadata, serif-italic accents, brand red. The redesign does not replace that identity; it adds a second physical layer above it: **floating glass instruments** (nav pill, palette, menu, toasts, hero button, drifting orb) rendered in the Liquid Glass material, while content stays print-flat. Two layers, clearly separated = spatial depth without glassmorphism soup.

## §0. Brand preservation (hard constraints)

- Colors exactly as today (see DESIGN_SYSTEM_REPORT §2). No demo colors (`#5227FF`, `#B497CF`, `#525252`, white panels, `bg-white`, `text-black`) may survive in `app/components/reactbits/`.
- Fonts: Space Grotesk, DM Serif Display (italic accents), JetBrains Mono, Cairo. Outfit/Sora removed; Geist scoped to ProProfile. One visible consequence (flagged at checkpoint): body copy moves Outfit → Space Grotesk.
- Logo: `/dark_mode_img.jpg` kept; light logo pending from user.
- `/palestine` keeps its own palette; glass there uses its `--red` as `--lg-accent`.
- Public user content (`/[subdomain]`, `/site/...`, builder canvas): pixel-equivalent except like-for-like icon swaps.

## §1. Design tokens (Phase B implements)

Create `app/styles/tokens.css` + `motion.css` + `base.css`, import order in `globals.css`: tailwind → tokens → liquid-glass → motion → base. Exact token values: DESIGN_SYSTEM_REPORT §2-§6 (colors moved verbatim from `page.css`; motion anchored on existing `cubic-bezier(0.22,1,0.36,1)`). Alias legacy names (`--font-ed`, `--font-display`, `--font-logo`, `--font-serif`, `--mnav-*` removal) so untouched pages keep rendering. Tailwind `@theme` maps onto tokens. Theme = `light|dark|system` via blocking inline `<head>` script (reads localStorage, falls back to `prefers-color-scheme`, sets `data-theme` before paint), `<html suppressHydrationWarning>`; Navbar theme toggle cycles three states (Sun2/Moon/Monitor icons). `MotionConfig reducedMotion="user"` wraps the client tree.

## §2. The ten mandatory enhancements — where each lives

1. **Spatial depth** — three planes: background (noise + paper-glow + gradient mesh + BackgroundBadge z0), content (z2, print-flat), instruments (z40+: orb, nav, menu, palette, toast). Shadows from the z-scale; no floating elements inside content flow.
2. **Interactive spotlight** — cursor-following radial highlight on: works `.w-project` cards, team `.dev` cards, DevMega ad card. CSS var `--mx/--my` + rAF-throttled pointermove; `(hover:hover) and (pointer:fine)` only; radial of `--glow` at ≤0.1 alpha so text contrast is untouched. MaskedHeading's built-in spotlight covers `/works` h1.
3. **Magnetic interactions** — existing `MagneticButton` (5px) kept on hero CTA; extend to nav icon buttons (3px) and `.w-plink`. SpecularButton's `followMouse` shine is its own magnetic analogue. Never on list rows or text links.
4. **Theme system** — §1; glass variants are theme-aware via `liquid-glass.css` `[data-theme="light"]` blocks; `/login` joins the token system (loses its hardcoded palette).
5. **Liquid transitions** — **No React `<ViewTransition>`** (needs React 19.3; repo pins 19.2.4 — see FRONTEND_ARCHITECTURE_REPORT). Instead: palette/menu/toast enter-exit via existing framer springs retimed to motion tokens; theme switch keeps the dissolve; FAQ height animation kept; page-level transitions = AnimatedContent reveals. Optional later: pure-CSS `@view-transition` cross-fade (progressive enhancement, no JS dependency).
6. **Bento grids** — only where content already wants modularity: `/history` pillars (2-col bento with one wide + one tall, existing `span` hints), dashboard "effects" toggles grid, home stats row → 4-cell bento band on ≥768px. NOT the services list, works list, or FAQ (editorial rows are the identity).
7. **Ambient gradient mesh** — upgrade `.paper-glow` to a 2-stop mesh: existing accent ellipse + one `--panel-2` ellipse opposite corner, 40s drift (existing keyframe), `opacity ≤ .9`, static on touch/RM (existing media rules). Brand palette only.
8. **Command palette** — Phase E: ⌘K + Ctrl+K + `/`; LiquidGlass `modal` r24; combobox ARIA + ↑↓/Home/End/Enter/Esc; groups: Sections / Actions / Account (auth-gated: Dashboard, Builder, Sign out); only real routes; `MagnifierIcon` input icon.
9. **Editorial typography** — scale per DESIGN_SYSTEM_REPORT §3; serif-italic `<em>` accents stay the signature; mono kickers stay; Arabic: Cairo, zero tracking, no uppercase (existing rule), AR fallbacks for canvas text components.
10. **Unified motion** — `motion.css` tokens + rules in DESIGN_SYSTEM_REPORT §6; AnimatedContent house settings (`distance 40 / 0.8s / power3.out / blur 6 / threshold .15 / once`, stagger .08 lists, palestine calm variant); one library per element; `ScrollTrigger.refresh()` on pathname change + `document.fonts.ready`.

## §3. Glass surface map (Phase D implements)

| Surface | File anchor | Variant | Radius | Notes |
|---|---|---|---|---|
| Navbar → floating pill, top 12px, maxw 1320 | `navbar.css .mnav-bar` | `nav` | 999 | replaces full-width bar; delete old bg/blur/border |
| Command palette panel | `.mnav-cmd` | `modal` | 24 | overlay stays plain dim (no blur-on-blur) |
| Toast | `.mnav-toast` | `floating` | 999 | |
| Nav icon buttons (lang/theme/index) | `.mnav-icon`, `.mnav-key` | `interactive` | 999 | |
| Hero promo pill (hosts SpecularButton) | `.hero-promo` | — solid accent-tinted panel, **not** glass (SpecularButton inside; no glass-on-glass) | 999 | pulse animation removed |
| DevMega ad card | `DevMegaAd.css .devmega-card` | `floating` | 24 | upgrade from solid panel |
| Contact code-card | `.contact-card` | `subtle` | 14 | low-risk accent surface |
| Dashboard `.glass-panel` / `.glass-card` / `.nav` | `dashboard.css` | `primary` / `floating` / `nav` | 16/20/0→pill16 | replace white-alpha glass |
| Dashboard sticky preview frame | `.preview-sticky` wrap | `floating` | 20 | |
| Builder toolbar / properties panel | `builder.css` | `nav` / `primary` | 16 | |
| Login card | `login/page.tsx .card` | `modal` | 28 | page joins token system |
| StaggeredMenu panel | reactbits | `modal` (or solid `--paper` if legibility suffers) | 0 | |
| Palestine masthead | `.pal-masthead` | `nav` | 0 | `--lg-accent: var(--red)` scope override |
| **Never:** PremiumProfileCard, subdomain-bg, pro-design, canvas output | user content | — | — | untouched |

Budget: ≤3 refracting surfaces visible at once on mobile (nav + one overlay + toast is the worst legal case). Overlays (`.mnav-overlay`, `.mnav-cmd-overlay`) lose their blur → plain `rgba(0,0,0,.5)` dim (cheaper, avoids double-blur). `prefers-contrast: more` → solid (in material CSS). Fallback (Safari/Firefox) = tuned blur with raised tint — both modes must pass AA.

## §4. Shared primitives (Phase E implements) — `app/components/ui/`

`Kicker`, `Meta`, `Rule`, `SectionHead` (kicker+rule+title with `<em>`), `Button` (`solid|line` = existing `.btn-solid/.btn-line`), `Card` (panel+hairline), `Field` (label+input+error), `Toast` host with `aria-live`, `Spotlight` wrapper (enhancement #2), plus `icons/brand.tsx`. One stylesheet `ui.css` consuming tokens; the four inline-`<style>` pages migrate their duplicate declarations here during Phase G.

## §5. Page-by-page (Phase G implements; placements from 5B.1 included)

**`/` Home** — purpose: convert + showcase. Weaknesses: promo pulse is noisy; stats flat; glyph icons. Changes: hero keeps layout; TechText lines 1-2 + outline span line 3 (5B.2.3); promo row → calm glass-adjacent pill hosting SpecularButton→`/login` (5B.2.9); ticker stays; stats → bento band; DevMega ad → `floating` glass + spotlight; services/process/works/FAQ/team keep editorial rows with AnimatedContent reveals (replace all `whileInView` on sections); `#stack` → LogoLoop + kept `stack-meta` + kept ticker (5B.2.7); contact card → `subtle` glass; CircularText badge + SwimmingGlass mount; footer unchanged structurally. Icons per map. Internal `<a>`→`<Link>`.

**`/works`** — keep alternating project layout + window visuals (they're good). MaskedHeading for `<h1>` **only when the user supplies a screenshot image**; until then the current two-line serif-em heading stays (5B.2.4 — do not ship an empty mask; note: current heading is two i18n strings + `<em>`, MaskedHeading flattens to one string "Work we're proud of" and loses the serif em — accepted trade-off, confirm at checkpoint). AnimatedContent on project cards (stagger). CircularText badge + orb. Spotlight on cards. Inline styles → tokens.

**`/history`** — timeline kept; pillars → bento (#6); AnimatedContent on years/pillars; CircularText badge + orb; delete dead `.h-nav`; inline styles → tokens.

**`/palestine`** — own palette preserved; masthead → `nav` glass with `--red` accent scope; AnimatedContent calm settings (`blur 0 / distance 24 / 1s`); **no orb, no badge** (5B.2.2/5B.2.5); content untouched.

**`/login`** — tokens + theme support; card → `modal` glass; Google logo from `brand.tsx`; error strings through `t()`; orb mounts here (5B §5 list).

**`/dashboard`** — keep layout/flows exactly; re-skin: nav → `nav` glass pill, panels → `primary`, preview frame → `floating`; chevrons/✓/↗ → Solar; effects grid → bento; orb mounts here. No logic changes (quota, upload, claim).

**`/builder`** — chrome re-skin only (toolbar `nav`, properties `primary`); ADD_BUTTONS emoji → Solar; canvas + published output pixel-equivalent. No orb.

**`/[subdomain]`, `/site/...`** — icon-only like-for-like swaps via `brand.tsx` (to allow react-icons removal); everything else untouched.

**Global chrome** — Navbar split per Phase E; StaggeredMenu <768px (5B.2.6: brand colors, Cairo in AR, focus kit, items = sections minus duplicates + auth-gated Dashboard/Login, socials = GitHub + Telegram founders' links already on the site, theme/lang toggles inside panel); LoadingScreen once per session ≤900ms; skip link; `<noscript>` AnimatedContent override.

## §6. Accessibility (Phase H gate — `a11y-reviewer` checks against this)

Everything in ACCESSIBILITY_REPORT "Rules for the new components" + "Current violations" fixed, specifically: palette combobox ARIA + full keyboard; StaggeredMenu focus kit; toast `aria-live`; skip link; `aria-controls` on FAQ; marquee pause affordance; both glass modes AA; light-mode small accent text role-adjusted; RTL mirroring for directional icons; AR fallbacks for TechText/MaskedHeading/CircularText; `sr-only` hero text; decorative components `aria-hidden`.

## §7. Performance budget

LCP <2.0s, CLS <0.05, INP <200ms (Lighthouse mobile `/`). WebGL on `/`: exactly 2 contexts (SpecularButton, SwimmingGlass — lazy, idle-mounted, `maxDevicePixelRatio 1.5`). LiquidGlass maps rebuilt only on resize (ResizeObserver, capped 1.2MP). gsap only inside reactbits components. Fonts 8→4 global. Home JS growth ≤ gsap's size vs baseline. No blur animation anywhere. Marquees = transform-only (existing). AnimatedContent `once` (no persistent observers after reveal).

## §8. Responsive

New-work breakpoints 480/768/1024/1280; existing page queries (1180/1024/860/560) stay unless a touched block needs alignment. Menu switch moves 860→768 (checkpoint item). BackgroundBadge hidden <768. TechText heights via clamp (tune so desktop glyph size matches current 13rem cap — wrapper `clamp(64px, 12vw, 190px)` starting point). LogoLoop 28/36 logoHeight, 36/56 gap mobile/desktop. Test 360/390/768/1024/1440/1920 × EN/AR × dark/light.
