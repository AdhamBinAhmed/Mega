# ACCESSIBILITY & RESPONSIVE REPORT

> Authored by the main agent from the live-code audit. Target: WCAG 2.2 AA.

## Current violations / gaps (file:line anchors)

1. **Mobile drawer** (`Navbar.tsx` ~185-230): no focus trap, no `inert`/`aria-hidden` when closed (AnimatePresence unmounts it — OK), focus not moved on open nor restored on close, body scroll not locked, no `aria-modal`/`role="dialog"`. Esc works (global handler). → replaced by StaggeredMenu with the full a11y kit (5B.2.6).
2. **Command palette** (`Navbar.tsx` ~240-300): plain input + anchor list; no `role="combobox"`/`listbox`/`option`, no `aria-activedescendant`, no ↑↓/Home/End navigation (Enter = first match only), no focus trap/restore, overlay click-to-close only. Opens only on `/` — add ⌘K/Ctrl+K (Phase E).
3. **Toast** (`.mnav-toast`): no `aria-live="polite"` region — screen readers never hear "Email copied".
4. **Theme/lang buttons**: `aria-label` present ✔ but glyph-only content; Solar icons + `aria-hidden` fix the SR noise.
5. **FAQ** (`page.tsx` ~430): `aria-expanded` present ✔; missing `aria-controls`/region ids — minor, add while touching.
6. **Marquees/ticker**: infinite animation with no pause control (WCAG 2.2.2). Hover-pauses on desktop only; add reduced-motion stop ✔ (already frozen by global RM rule) and consider a visible pause affordance on touch.
7. **Custom cursor** (`page.css`): `cursor: none` on fine pointers with a JS dot — keyboard users unaffected, but if JS fails the cursor vanishes. Scope `cursor:none` behind a `.js` class or drop it; decision: keep but gate (Phase G polish).
8. **Contrast**:
   - Light accent `#d92b1f` on `--paper #f6f3ec` ≈ **4.39:1 — fails AA for normal text** (fine for large text/graphics). Used for kickers (0.62rem mono = small). Mitigation without changing brand hex: kickers/metas in light mode use `--ink-soft` with an accent rule, or bump size/weight; record as a known issue — brand hex stays locked.
   - `--ink-mute #6a6862` on `#0c0b0f` ≈ 4.6:1 ✔ at small sizes; on `--panel-2` slightly lower — verify per-surface in Phase H.
9. **`/login`**: hardcoded palette, error strings not via `t()`, Google logo from gstatic without text fallback issues (alt present ✔).
10. **Headings**: `/` has h1→h2 order ✔; works/history/palestine ✔. Keep after redesign (TechText keeps real `<h1>` text `sr-only`; MaskedHeading renders a real tag).
11. **Skip link**: none — add in Phase E (§8 of the plan).
12. **Images**: dev avatars have alt ✔; logo imgs have alt ✔ (will break visually in light mode — missing file, separate issue).

## Rules for the new components (binding, from Phase 5B — verified present in appendix code)

- TechText: real text in `sr-only` span inside `<h1>`; canvases `aria-hidden` + `role="presentation"`; `touch-pan-y` built in; AR → original spans.
- MaskedHeading: renders real heading tag; AR → original heading; reduced motion → settle() static.
- CircularText badge + SwimmingGlass: `aria-hidden`, `pointer-events:none`, below 768px hidden (badge), reduced-motion static/skip (orb returns null).
- StaggeredMenu: focus → first item on open, trap, Esc closes, focus restore, `inert` when closed, body scroll lock, close on link click.
- SpecularButton: wrapped in real `<Link href="/login">`, button `tabIndex={-1}` → one focusable link; visible focus ring from component CSS; works without WebGL2 (tinted pill remains).
- AnimatedContent: `<noscript>` visibility override in layout; `once`; no double-animation.
- LiquidGlass: `prefers-contrast: more` → solid panels (in liquid-glass.css ✔); non-refracting fallback raises tint opacity for legibility ✔; text over glass must also pass AA against the *fallback* blur rendering — Phase H checks both modes.

## Responsive

- Current breakpoints: 1180 (side-rail off), 1024 (gutter 28), 860 (nav links→burger, grids 1-col), 560 (gutter 18, type scale down).
- Plan standardizes new work on 480/768/1024/1280 while leaving working page-level queries alone. **Conflict to resolve at checkpoint:** menu switch moves 860→768; between 768-860px the 4 pill links + actions must fit (at 0.78rem they do, ~430px of content in ≥700px of bar; verified by measurement of current sizes — re-verify visually in Phase H).
- Test matrix: 360/390/768/1024/1440/1920 × dark/light × EN/AR (RTL) — StaggeredMenu `position` flips, TechText `align` flips, LogoLoop `direction="right"` in RTL, logical properties (`inset-inline-end`) for the badge.
- Touch: spotlight/magnetic disabled on coarse pointers (existing pattern `(hover:none)` — keep); LiquidGlass mobile budget ≤3 refracting surfaces; ticker/marquee duration already shortened on touch.

## Key decisions for the blueprint
- Adopt the full StaggeredMenu a11y kit; palette gets combobox ARIA + roving `aria-activedescendant`.
- `aria-live="polite"` toast region; skip link; `aria-controls` on FAQ.
- Brand hexes stay; light-mode small-accent-text usage is adjusted by role (size/weight/color-role), not by changing the hex.
- Both glass modes (refract + blur fallback) must pass AA; `prefers-contrast: more` = solid.
