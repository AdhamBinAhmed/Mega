# UI/UX Design Research — MEGA Devs Redesign

**Agent:** UI/UX Design Researcher · **Date:** 2026-11-11 · **Scope:** research only, no code changed.

**Legend:** `[FACT]` = verified against a cited primary/technical source. `[OPINION]` = my design judgement, not a sourced claim. `[CODE]` = observed in this repo.

**Locked constraints this report respects:** dark `--accent #ef4444` / `--paper #0c0b0f` / `--ink #f4f2ed`; light `--accent #d92b1f` / `--paper #f6f3ec` / `--ink #111010`; Space Grotesk + DM Serif Display italic + JetBrains Mono + Cairo (AR); full EN/AR with RTL.

---

## 1. Premium SaaS / studio design trends, 2025–2026

### What the field actually converged on

- `[FACT]` Liquid Glass is the dominant 2026 UI direction, downstream of Apple's iOS 26 design language; what used to be called "glassmorphism" has hardened into a material system with defined variants rather than a one-off blur effect. ([designrush](https://www.designrush.com/agency/website-design-development/trends/web-design-trends), [pixso](https://pixso.net/articles/7-ui-ux-design-trends/), [Apple HIG — Materials](https://developer.apple.com/design/human-interface-guidelines/materials))
- `[FACT]` Glass reads as "premium/technical" specifically on dark-mode, developer-facing, and fintech surfaces — which is exactly this site's register. ([neelnetworks](https://www.neelnetworks.com/blog/glassmorphism-web-design-guide-2026/))
- `[FACT]` The best-regarded B2B sites of 2026 converge on four decisions: one repeatable positioning sentence, **real product UI as the hero visual** (not illustration), social proof with numbers attached, and increasingly a machine-readable layer for AI agents. ([azurodigital](https://azurodigital.com/saas-website-examples/), [suur.io](https://suur.io/best/saas-website-designs))
- `[FACT]` Typography trend lines for 2026: variable fonts mainstream, `clamp()` fluid type, and an explicit **serif revival** pairing expressive serif headings with neutral sans body. ([madegooddesigns](https://madegooddesigns.com/web-typography-trends-2026/))
- `[OPINION]` The differentiator in 2026 is no longer *having* glass — it is having glass that is clearly subordinate to a real editorial voice. Sites that applied glass to everything look like each other. This site already owns a distinctive print-magazine voice, so glass should be the chrome, never the content.

### Reference sites and what to take from each

| Site | Take this | Do not take |
| --- | --- | --- |
| **Linear** (linear.app) | `[FACT]` most-referenced SaaS site of 2026; opens with one line about *how the product feels*, not a feature list ([azurodigital](https://azurodigital.com/saas-website-examples/)). `[OPINION]` Learn the restraint: near-monochrome, one accent, motion only on entrance and hover. Their glass panels are ~8–12% white over a dark field — barely transparent. | Their near-total absence of warmth; MEGA's paper/ink has more character than Linear's cool gray. |
| **Stripe** (stripe.com) | `[FACT]` the reference for dual-audience technical marketing — sells to developers and finance leaders without diluting either ([suur.io](https://suur.io/best/saas-website-designs)). `[OPINION]` Take the *information density per screen* and the code-block-as-hero credibility move. | The WebGL gradient. On a two-person studio site it reads as borrowed, and it fights the paper/ink palette. |
| **Vercel** (vercel.com) | `[FACT]` wins 2026 on "speed as design" ([suur.io](https://suur.io/best/saas-website-designs)). `[OPINION]` Take the geometry: hairline-bordered cards on a flat field, mono labels, zero decorative gradient. This is the closest existing site to MEGA's current aesthetic — it proves hairline + mono scales to a premium feel without glass. | Monochrome-only accent discipline; MEGA's red is an asset and should be used more boldly than Vercel uses blue. |
| **Resend** (resend.com) | `[FACT]` cited as the reference for "code-as-hero" and an agent-readable site layer ([suur.io](https://suur.io/best/saas-website-designs)). `[OPINION]` Take the bento section that mixes a code sample, a metric tile, and a logo row at three different tile weights. | Nothing to avoid; it is small-team-sized and the closest structural analogue to MEGA. |
| **Family** (family.co) | `[OPINION]` The best public example of iOS-grade material + spring motion on the web: layered sheets, real depth ordering, a motion language consistent across every element. Study their *z-ordering discipline* — every surface sits at one of about four known elevations, never arbitrary. | Their playfulness level; MEGA is editorial, not consumer-cute. |
| **Rauno Freiberg** (rauno.me / Vaul, Sonner) | `[OPINION]` The canonical craft reference for keyboard-first interaction, focus rings, and dialog/sheet physics. His component work is where the ⌘K and modal behaviours in this redesign should be benchmarked. | — |

`[OPINION]` **Depth/layering model to adopt:** exactly four elevations, no more. `0` page (paper), `1` inset/recessed (bento tile), `2` raised card, `3` floating glass chrome (navbar pill, palette, modal). Every shadow, border alpha, and blur radius is a function of the elevation number, not a per-component decision.

---

## 2. Bento grids: when they help, when they hurt

### When they help `[OPINION]`

- Heterogeneous content of genuinely unequal importance: one case study, three metrics, a stack list, a testimonial. Bento's whole value is encoding hierarchy spatially.
- Showing *range* for a small studio — a bento block says "we do these six things" faster than six sections.
- Replacing the current marquee tickers' job (signalling breadth) with something scannable and crawlable.

### When they hurt `[OPINION]`

- Homogeneous items (a list of 8 identical projects) — that's a grid, not a bento; varied spans there create fake hierarchy.
- Anything that must be compared item-to-item. Unequal tile sizes destroy comparison.
- Primary conversion paths. A CTA inside one of nine competing tiles loses.

### Responsive collapse `[FACT]`

- Plan the collapse explicitly: 4 cols → 2 cols → 1 col, **resetting the spans at each step**, or mobile degrades into an undifferentiated card stack. ([superdesign](https://superdesign.dev/styles/bento-grid), [orbix](https://www.orbix.studio/blogs/bento-grid-dashboard-design-aesthetics))
- Stacking tiles in their original visual order on mobile usually destroys the hierarchy that made the desktop layout work; use `order` to hoist the hero tile to the top even if it sits mid-grid on desktop. ([inkbotdesign](https://inkbotdesign.com/bento-grid-design/))
- `[OPINION]` For RTL, express spans with **logical** grid placement (`grid-column: span N` plus named areas, never `grid-column: 1 / 3` hardcoded left-to-right assumptions), so the Arabic layout mirrors without a second stylesheet. `grid-area` names + `direction: rtl` on the container handles this for free.

### Accessibility `[FACT]`

- Author the DOM in **logical reading order**, then use `grid-template-areas` / `order` for the visual arrangement. An asymmetric grid can still have a sane screen-reader order only if source order is the sensible sequence. ([superdesign](https://superdesign.dev/styles/bento-grid), [desinance](https://desinance.com/design/bento-grid-web-design/))
- Every interactive tile needs a high-contrast focus indicator; never use `tabindex > 0` to force order. ([inkbotdesign](https://inkbotdesign.com/bento-grid-design/))
- Target WCAG 2.2 / European Accessibility Act for the grid's reading order. ([desinance](https://desinance.com/design/bento-grid-web-design/))
- `[OPINION]` If a whole tile is clickable, use one `<a>` wrapping the heading with a stretched pseudo-element overlay rather than a `div` with a click handler — keeps one tab stop and one accessible name per tile.

---

## 3. Editorial typography on the web

### Fluid scale `[FACT]`

- `clamp(min, preferred, max)` with a viewport term in the preferred value replaces breakpoint type jumps. ([cssawwwards](https://cssawwwards.com/blog/fluid-typography-css-clamp-guide-2026))
- **Accessibility-critical:** use `rem` for the min and max, never `px`. `clamp(1rem, 2vw, 1.25rem)` honours a user's increased default font size; `clamp(16px, 2vw, 20px)` does not. ([cssawwwards](https://cssawwwards.com/blog/fluid-typography-css-clamp-guide-2026))
- Scale type **and spacing on the same logic** so proportions hold from phone to desktop without manual tuning. ([i8z.de](https://i8z.de/posts/2026-01-15-the-case-for-fluid-typography/))

### Proposed scale `[OPINION]`

Editorial display wants a wider ratio than UI. Use a **split ratio**: ~1.333 (perfect fourth) for display steps, ~1.2 (minor third) for body/UI steps. Mobile ratios compress to ~1.2 / 1.125.

```
--t-display:  clamp(2.75rem, 1.6rem + 5.4vw, 6.5rem)   /* Space Grotesk, 600–700 */
--t-h1:       clamp(2.125rem, 1.4rem + 3.1vw, 4rem)
--t-h2:       clamp(1.625rem, 1.25rem + 1.6vw, 2.5rem)
--t-h3:       clamp(1.25rem, 1.1rem + 0.7vw, 1.5rem)
--t-body-lg:  clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)
--t-body:     clamp(1rem, 0.97rem + 0.15vw, 1.0625rem)
--t-kicker:   clamp(0.6875rem, 0.66rem + 0.1vw, 0.75rem)  /* JetBrains Mono */
```

Pairings: Space Grotesk for display/H/UI (tighten `letter-spacing: -0.02em` at display sizes, `-0.01em` at H1–H2, `0` at body). DM Serif Display **italic only**, and only for pull-quotes, a single accented word inside a headline, and section numerals — it is a display-only face, never below ~1.5rem, never for running text. JetBrains Mono for kickers/meta/labels at `letter-spacing: 0.08–0.14em` and `text-transform: uppercase`.

`[OPINION]` **One display face only.** `[CODE]` `app/page.css` currently declares both `--font-ed: Space Grotesk` *and* `--font-display: Outfit`, and `app/dashboard/dashboard.css` + `app/history/page.tsx` repeat the pair. Outfit is a fourth Latin face doing a job Space Grotesk already does — drop it in the redesign and save a webfont.

### Arabic (Cairo) and RTL `[FACT]`

- Pair Latin with Arabic faces of matching proportion. Cairo is explicitly recommended as a real Arabic web face and pairs well with geometric low-contrast sans; Cairo ships with a matching Latin, which is the safest option of all. ([aniq-ui](https://www.aniq-ui.com/en/blog/arabic-fonts-for-web), [voxire](https://voxire.com/blog/arabic-rtl-typography-web-design-2026/))
- **Zero letter-spacing on Arabic.** Reset inherited tracking: `html[lang="ar"] { letter-spacing: 0 }`. Tracking breaks Arabic's connected script. ([voxire](https://voxire.com/blog/arabic-rtl-typography-web-design-2026/))
- Line height 1.6–1.8 for Arabic body vs 1.4–1.5 for Latin. ([voxire](https://voxire.com/blog/arabic-rtl-typography-web-design-2026/), [hamrix](https://hamrix.com/ksa/blog/arabic-rtl-ui-ux-design-guide))
- Arabic needs ~1–2px more optical size than its Latin partner to read as the same size. ([aniq-ui](https://www.aniq-ui.com/en/blog/arabic-fonts-for-web))
- Set `dir="rtl"` once at the root and use CSS **logical properties** throughout. ([voxire](https://voxire.com/blog/arabic-rtl-typography-web-design-2026/))

`[OPINION]` Concrete AR overrides for this site:

```css
html[lang="ar"] {
  --t-ratio-bump: 1.06;        /* apply to body/UI steps, not display */
  letter-spacing: 0;
  line-height: 1.75;
  font-synthesis: none;        /* no faux italic/bold on Cairo */
}
html[lang="ar"] .kicker { text-transform: none; letter-spacing: 0; }
```

The mono kicker and the DM Serif italic accent **have no Arabic equivalent**. Do not fake them. In AR, express a kicker with Cairo at reduced size + accent-red colour + a hairline rule, and express the serif-italic accent with Cairo at the next weight up in accent red. This is the single highest-risk area of the redesign — the editorial identity is carried by two Latin-only devices.

---

## 4. Command palette (⌘K) UX

### ARIA structure `[FACT]`

A command palette is an ARIA 1.2 **combobox with a listbox popup**, not a menu: ([W3C APG combobox + list autocomplete](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/), [techinterview](https://www.techinterview.org/post/3233475212/build-command-palette-cmd-k/), [allahabadi.dev](https://allahabadi.dev/frontend-system-design/components/command-palette/))

- Input: `role="combobox"`, `aria-expanded`, `aria-controls="<listbox id>"`, `aria-haspopup="listbox"`, `aria-autocomplete="list"`.
- Results container: `role="listbox"`; rows: `role="option"` with stable ids; groups: `role="group"` with `aria-labelledby` on the heading.
- **Virtual focus:** DOM focus never leaves the input. The highlight moves via `aria-activedescendant` on the input pointing at the active option's id; the visual highlight is CSS driven off an attribute on the option. ([techinterview](https://www.techinterview.org/post/3233475212/build-command-palette-cmd-k/))

### Keyboard model `[FACT]`/`[OPINION]`

`⌘K` / `Ctrl+K` toggles (`[OPINION]` also accept `/` when no input is focused). `↑ ↓` move the virtual highlight and wrap. `Home`/`End` jump. `Enter` runs the active item. `Esc` closes and **returns focus to the trigger**. `Backspace` on an empty input pops the scope stack. ([setproduct](https://www.setproduct.com/blog/command-palette-ui-design-guide), [uxpatterns.dev](https://uxpatterns.dev/patterns/advanced/command-palette))

`[OPINION]` RTL note: `↑/↓` are direction-neutral, so the palette needs no RTL keyboard remap — but any `→` "enter scope" affordance must flip to `←` under `dir="rtl"`.

### Grouping, scopes, states `[FACT]`

- Group results by category (Navigation / Actions / Settings / Recent) so the eye scans sections instead of parsing one flat list; hide a group heading whenever all of its items filter out, so no orphan headings float. ([setproduct](https://www.setproduct.com/blog/command-palette-ui-design-guide), [buildmvpfast](https://www.buildmvpfast.com/blog/how-to-add-cmd-k-command-palette-saas-2026))
- Scopes via a **pages stack**: an array of page names in state, render items for the active page, pop on `Backspace` when the input is empty. ([buildmvpfast](https://www.buildmvpfast.com/blog/how-to-add-cmd-k-command-palette-saas-2026))
- Empty (unfiltered) state: 4–6 recent actions, then a short group of never-tried capabilities. ([137foundry](https://137foundry.com/articles/command-palette-interface-users-actually-reach-for))
- No-match state must explain and offer a next step — never a dead end. ([137foundry](https://137foundry.com/articles/command-palette-interface-users-actually-reach-for))

`[OPINION]` For a marketing site + profile builder, the palette's real jobs are: jump to any page/section, toggle theme, switch EN↔AR, copy email, open WhatsApp, open GitHub, and (in the builder) section-level actions. Ship with ~15 commands, grouped, with the no-match state offering "Email us about '<query>'" — that turns a dead end into a lead.

---

## 5. Recommendations tailored to MEGA's brand

### Making glass premium without losing the editorial voice `[OPINION]`

1. **Glass is chrome, never canvas.** Navbar pill, ⌘K palette, modals, toasts, the theme switcher, and the mobile menu sheet get glass. Body copy, bento tiles, case studies, and footers stay on flat paper with hairline rules. This is the single rule that keeps the print identity intact.
2. **Hairline + glass is the signature.** The current look's strongest asset is the 1px hairline rule. Give every glass surface a two-tone edge — a `1px` inner highlight at the top (`inset 0 1px 0 rgb(255 255 255 / .14)` dark, `/.6` light) and a hairline outer border at the brand's existing border alpha. That edge is what makes glass read as *material* rather than *blur*, and it is the same visual vocabulary as the existing rules.
3. **Tint the glass with paper, not white.** On dark, the pane fill should be `color-mix(in oklab, var(--paper) 72%, transparent)` plus a 2–4% warm lift, not neutral white alpha — otherwise `#0c0b0f`'s warmth is washed out and the page goes cold/blue. On light, `color-mix(in oklab, var(--paper) 78%, transparent)`.
4. **Red is for ink, not for glass.** `#ef4444` / `#d92b1f` stays on type, rules, the active indicator, and focus rings. Resist red-tinted glass or red glows — that is where "premium" turns into "gamer RGB". At most, one `0 0 0 1px` accent ring on the focused palette row, and the cursor-spotlight at ≤6% accent.
5. **Contrast is the hard constraint.** `[FACT]` There is no transparency level that reliably passes WCAG 2.2 for text over a *dynamic* background without eliminating the transparency that defines the effect; higher blur boosts legibility, and a more opaque pane gives text a stable foundation. ([codexical](https://www.codexical.com/posts/2026-04-24-glassmorphism-accessibility), [newtarget](https://www.newtarget.com/web-insights-blog/glassmorphism/)) → `[OPINION]` Rule: any glass surface carrying text gets ≥70% pane opacity **plus** `backdrop-filter: blur(20px) saturate(140%)`, and the text/background pair is contrast-checked against the *worst-case* backdrop (the hero's brightest gradient stop), not against an average. Decorative glass with no text may go thinner.
6. **Degrade on three axes, not one.** `[FACT]` SVG filters inside `backdrop-filter` render in **Chromium only** — Firefox parses `url()` as valid, passes an `@supports` check, then renders nothing; Safari ignores it too. ([kube.io](https://kube.io/blog/liquid-glass-css-svg/), [Mozilla Connect](https://connect.mozilla.org/t5/ideas/support-svg-filters-in-backdrop-filter-for-advanced-glass/idi-p/98453)) → `[OPINION]` Do **not** feature-detect with `@supports (backdrop-filter: url(#x))`. Gate refraction on a runtime Chromium check written to a `data-glass="refract|blur|flat"` attribute on `<html>`, and author all three tiers. `[FACT]` Also honour `prefers-reduced-transparency` — Chrome 119+ supports it, Safari and Firefox do not, so it must be an enhancement over an already-usable default. ([caniuse](https://caniuse.com/mdn-css_at-rules_media_prefers-reduced-transparency), [Chrome for Developers](https://developer.chrome.com/blog/css-prefers-reduced-transparency)) The `flat` tier (opaque paper pane + hairline) must be a *designed* state, because it is what Safari/Firefox users on reduced-transparency actually see.
7. **Performance budget.** `[FACT]` Dynamic shape/size changes force a full displacement-map rebuild and are costly; animating filter props like `scale` is cheap by comparison. ([kube.io](https://kube.io/blog/liquid-glass-css-svg/)) → `[OPINION]` Cap the page at **three** live refracting surfaces, never animate a glass element's width/height/border-radius, and never stack two blurring surfaces.
8. **Theme switch = three states.** Light / dark / system, persisted, with `system` as the default and no flash on first paint (inline script sets the attribute before hydration). The light theme must be a true paper theme, not an inverted dark theme — `#f6f3ec` paper with `#111010` ink is a newsprint pairing and should keep warm, slightly heavier hairlines (`rgb(17 16 16 / .14)`) since dark-on-light rules read thinner.
9. **Keep the marquee, demote it.** `[OPINION]` The marquee ticker is brand-distinctive and should survive, but as a single hairline-bounded band between sections rather than a hero element — and it must respect `prefers-reduced-motion` (see motion report) and WCAG 2.2.2.
10. **Numbers over adjectives.** `[FACT]` Top 2026 sites attach numbers to social proof rather than showing bare logo walls. ([azurodigital](https://azurodigital.com/saas-website-examples/)) → For a two-person studio: projects shipped, years, response time, stack count. These are also perfect bento tile content.

---

## Key decisions for the blueprint

1. **Glass on chrome only** (navbar pill, ⌘K, modals, sheets, toasts). Content stays flat paper + hairline. Non-negotiable.
2. **Four fixed elevations** (0 page / 1 inset / 2 raised / 3 floating glass); all shadow, border-alpha and blur values derive from the elevation number.
3. **Three-tier glass rendering** driven by `data-glass="refract|blur|flat"` on `<html>` — runtime Chromium check, **not** `@supports url()`. Plus `prefers-reduced-transparency` → `flat`.
4. **Text-bearing glass ≥70% pane opacity + blur(20px)**, contrast-verified against the worst-case backdrop, not the average.
5. **Pane fill is paper-tinted via `color-mix`**, never neutral white alpha. Red accent never tints glass.
6. **Drop Outfit.** One Latin display face (Space Grotesk) + DM Serif Display italic accents + JetBrains Mono. Four families total including Cairo.
7. **Fluid `clamp()` scale in `rem`** with split ratios (~1.333 display / ~1.2 body); type and space scale on one logic.
8. **Arabic: zero tracking, 1.75 line-height, ~1.06× body size bump, `font-synthesis: none`.** Re-express the mono kicker and the serif-italic accent in Cairo + accent red — do not fake them.
9. **Bento only where content is genuinely unequal**; logical-property grid placement for RTL; DOM in reading order with `grid-template-areas` for layout; explicit 4→2→1 collapse with span resets and `order` hoisting.
10. **⌘K is an ARIA combobox + listbox with `aria-activedescendant` virtual focus**, grouped results, pages-stack scopes, 4–6 recents as the empty state, and a "email us about '<query>'" no-match action.
11. **Light/dark/system theme**, system default, no first-paint flash, light theme authored as true newsprint (heavier hairlines) rather than an inversion.
