# DESIGN SYSTEM REPORT

> Authored by the main agent. This is the token/system proposal consumed by `REDESIGN_BLUEPRINT.md` §1-§4. Brand hexes and fonts are **locked** (Stage 2 ground rule 2).

## 1. Token architecture

Single source `app/styles/tokens.css`, loaded after Tailwind, before everything else. Existing values are *moved*, not changed. Layers:

```
tokens.css      — color, type, space, radius, shadow, z, breakpoints (as custom media comments)
liquid-glass.css— glass material (appendix, verbatim)
motion.css      — durations, easings, shared keyframes
base.css        — reset, body, selection, scrollbar, focus ring, .wrap/.kicker/.meta/.rule
```

`globals.css` keeps only Tailwind import + `@source` + `@theme` **mapped to the tokens** (e.g. `--color-accent: var(--accent)`), plus the Arabic override block. Delete the duplicated literal token blocks from `page.css` (`:root/[data-theme]`) and `navbar.css` (`--mnav-*` → point at the globals); the four inline-`<style>` pages reference tokens instead of literals.

## 2. Color system (verbatim from the live site — locked)

| Token | Dark | Light | Role |
|---|---|---|---|
| `--paper` | `#0c0b0f` | `#f6f3ec` | page ground |
| `--ink` | `#f4f2ed` | `#111010` | primary text |
| `--ink-soft` | `#a8a49e` | `#57534b` | secondary text |
| `--ink-mute` | `#6a6862` | `#8a857b` | metadata (small-size only on paper/panel) |
| `--panel` / `--panel-2` | `#111015` / `#18171e` | `#faf8f2` / `#ece7db` | raised surfaces |
| `--accent` | `#ef4444` | `#d92b1f` | brand red (light: large-text/graphic roles only, see A11y report) |
| `--accent-ink` | `#ffffff` | `#ffffff` | text on accent |
| `--rule` / `--rule-2` | ink @ .10/.18 | ink @ .10/.20 | hairlines |
| `--glow` | accent @ .08 | accent @ .06 | ambient |
| `--shadow` | `rgba(0,0,0,.5)` | `rgba(0,0,0,.1)` | |
| new `--focus` | `var(--accent)` | `var(--accent)` | focus ring (existing behavior formalized) |
| new `--ok` | `#2ecc71` | `#1da955` | status green (dark value already in use) |

Glass tints (`--lg-*`) come from `liquid-glass.css` as shipped; palestine scope overrides `--lg-accent` to its `--red`.

## 3. Typography

Global families after Phase B (4): `--font-ui` = Space Grotesk (headings **and** body — Outfit removed), `--font-accent` = DM Serif Display (italic `<em>` only), `--font-mono` = JetBrains Mono, `--font-arabic` = Cairo. Geist/Geist Mono scoped to `ProProfile` via a local `next/font` in that subtree. Alias map for zero-churn migration: `--font-ed → var(--font-ui)`, `--font-display → var(--font-ui)`, `--font-logo → var(--font-ui)` (dashboard logo), `--font-serif → var(--font-accent)`.

Scale (clamp-based, matches current values where they exist):
`--text-hero clamp(3.2rem,14vw,13rem)` (unchanged) · `--text-h1 clamp(2.8rem,8vw,6rem)` · `--text-h2 clamp(1.6rem,3.5vw,3rem)` · `--text-h3 1.15–1.5rem` · `--text-body 1rem/1.65` · `--text-dek clamp(1rem,1.4vw,1.18rem)` · `--text-meta 0.62rem` mono upper 0.14-0.24em tracking · Arabic: tracking 0, `line-height ≥1.7`, no uppercase (existing `[lang=ar]` rule enforces).

## 4. Space / radius / shadow / z

- Space: 4-base scale `4 8 12 16 24 32 48 64 96 140`; `--gutter 48/28/18px` (existing responsive values), `--maxw 1260px` (page) / `1320px` (nav).
- Radius: `--r-xs 4` `--r-sm 8` `--r-md 12` `--r-lg 16` `--r-xl 24` `--r-2xl 28` `--r-pill 999` (all values already appear in the CSS).
- Shadow: `--sh-ambient 0 2px 6px var(--shadow)` · `--sh-float 0 16px 48px var(--shadow)` · `--sh-modal 0 24px 80px var(--shadow)`; glass surfaces use `--lg-shadow` from the material instead.
- Z scale (documents today's implicit stack): content 2 · badge 0 (behind content) · SwimmingGlass 40 · side-rail 90 · scroll-bar 200 · navbar 500 · StaggeredMenu 505-515 · drawer-legacy 510 · palette 520 · toast 530 · lang-wipe 100000 (existing, keep).

## 5. Glass material system

Exactly the appendix `GLASS_VARIANTS` (nav/primary/floating/modal/interactive/subtle) — see `REDESIGN_BLUEPRINT.md` §3 for the surface→variant table. Rules: never nest glass; "Secondary Glass" = solid `--panel` inner card (no glass-on-glass); ≤3 refracting surfaces concurrently on mobile; long-form text and user-generated content never sit on live glass; `prefers-contrast: more` → solid `--panel`.

## 6. Motion system

`motion.css` tokens — anchored on the existing brand curve:
`--dur-fast 120ms` · `--dur-base 200ms` · `--dur-slow 320ms` · `--dur-reveal 560ms` · `--ease-out cubic-bezier(0.22,1,0.36,1)` (existing `--ease`) · `--ease-spring cubic-bezier(0.34,1.4,0.5,1)` (existing) · `--ease-in-out cubic-bezier(0.7,0,0.3,1)` (existing lang-wipe curve).
GSAP equivalents: `power3.out` ≈ `--ease-out` (AnimatedContent house setting already `power3.out` ✔). Framer spring presets stay for hero/palette (damping 22-26, stiffness 120-140 — current values). Rule: one library per element; scroll entrances = AnimatedContent (gsap), micro-interactions = framer/CSS. Reduced motion: global kill rule stays + per-component RM paths.

## 7. Icon system

See `../ICON_MIGRATION_MAP.md`. Linear style, `SolarProvider` defaults size 18, sizes 14/16/18/24/32 by role, `currentColor` always, `aria-hidden` on decorative, RTL mirror class for directional icons, brand logos in `icons/brand.tsx`.

## 8. Component standards (visual spec summary)

- **Buttons:** `.btn-solid` (accent bg, white ink, r-10) and `.btn-line` (hairline) stay as the system; SpecularButton is a *hero-only* showpiece variant. Hover: translateY(-2px) + shadow (existing).
- **Cards:** solid `--panel` + `--rule-2` border + r-12..18 (existing patterns); glass only for floating/overlay chrome.
- **Inputs:** `--panel-2` bg, `--rule-2` border, r-8, focus ring `--focus`; dashboard styles converge here.
- **Dialogs/palette:** LiquidGlass `modal` r-24/28 + `--sh-modal`; overlay `rgba(0,0,0,.5)` (existing).
- **Toast:** LiquidGlass `floating` r-pill + `aria-live`.
- **Tabs/badges/tables/empty/error/loading:** follow panel+hairline+mono-meta grammar; skeletons = `--panel-2` shimmer at `--dur-reveal`.

## Key decisions for the blueprint
- tokens.css is authoritative; Tailwind `@theme` maps onto it.
- Body font becomes Space Grotesk (Outfit removed) — flag at checkpoint as the one visible typography change.
- Alias old font vars to new ones so inline-style pages keep working before their Phase G pass.
- Glass is chrome-only; content stays print-editorial. The redesign reads as "editorial magazine behind floating glass instruments".
