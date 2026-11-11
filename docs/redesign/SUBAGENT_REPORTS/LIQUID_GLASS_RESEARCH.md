# Liquid Glass Research — MEGA Devs Redesign

Research agent report. Date: 2026-11-11. Scope: Apple's Liquid Glass design language, web
implementation of refractive glass, performance, accessibility, and a material system tailored to
the MEGA Devs brand. Claims are marked **[verified]** (primary/official source), **[reported]**
(secondary source, consistent across sources), or **[judgment]** (my recommendation, not a sourced
fact).

---

## 1. Apple's Liquid Glass — what is actually documented

**[verified]** Apple's HIG "Materials" page is the canonical design source
(<https://developer.apple.com/design/human-interface-guidelines/materials>; changelog shows
"Added guidance for Liquid Glass" 2025-06-09, updated 2025-09-09). Introduced at WWDC25
(session 219, "Meet Liquid Glass", <https://developer.apple.com/videos/play/wwdc2025/219/>).

Officially documented traits:

- **It is a navigation-layer material, not a content material.** Verbatim HIG rule:
  *"Don't use Liquid Glass in the content layer."* Glass forms "a distinct functional layer for
  controls and navigation elements — like tab bars and sidebars — that floats above the content
  layer." The only sanctioned content-layer exception is a *transient* interactive state
  (sliders/toggles adopt glass only while being manipulated).
- **Use it sparingly.** *"Limit these effects to the most important functional elements."*
  Apple's stated rationale: glass exists to draw attention to the content beneath it, so
  over-application defeats its purpose.
- **Two variants.** `regular` — *"blurs and adjusts the luminosity of background content to maintain
  legibility"*; use it "when background content might create legibility issues, or when components
  have a significant amount of text, such as alerts, sidebars, or popovers." `clear` — highly
  translucent, **only** for components over visually rich media. Clear requires a dimming layer:
  Apple specifies **a dark dimming layer at 35% opacity** when the underlying content is bright.
- **Adaptivity.** For small elements (toolbars, tab bars) the system flips glass between light and
  dark appearance based on what is behind it, and labels go monochromatic — darker over light
  content, lighter over dark. **Larger elements (sidebars) are rendered more opaque** specifically
  to preserve legibility and support richer content on the surface
  (<https://developer.apple.com/design/human-interface-guidelines/color>).
- **Tinting rule.** *"By default, Liquid Glass has no inherent color, and instead takes on colors
  from the content directly behind it."* Tint is allowed but: *"Apply color sparingly… To emphasize
  primary actions, apply color to the background rather than to symbols or text. Refrain from adding
  color to the background of multiple controls."* The HIG shows a whole toolbar of accent-tinted
  buttons as the **incorrect** example and a single tinted Done button as **correct**.
- **Scroll edge effect.** A companion mechanism, not the glass itself: content dissolving into the
  background as it scrolls under a floating bar, so the bar stays legible. **[reported]**
  (<https://www.createwithswift.com/define-the-scroll-edge-effect-style-of-a-scroll-view-for-liquid-glass/>)
- **Accessibility settings alter the material automatically.** Reduce Transparency makes glass
  frostier and obscures more backdrop; Increase Contrast shifts label colors (HIG color page shows
  white→black checkmark on a tinted button under increased contrast). **[verified]**
- **Glass-on-glass is not a documented Apple API concept but is consistent guidance.** Apple's own
  wording is "use sparingly" and "don't use in the content layer"; the explicit "never nest glass"
  phrasing circulating in community references is **[reported]**, not a verbatim HIG line.

**Apple itself retreated on transparency — this is the single most instructive fact.**
**[reported]** iOS 26 betas progressively reduced Liquid Glass translucency after legibility
backlash; iOS 26.1 shipped a user-facing **Clear / Tinted** toggle in *appearance* settings (not
buried in Accessibility), where Tinted "increases opacity and adds more contrast"
(<https://www.engadget.com/mobile/smartphones/how-to-adjust-the-liquid-glass-effect-in-ios-261-203634681.html>).
**[reported]** iOS 27 (WWDC 2026) went further: a continuous transparency slider from "ultra clear
to fully tinted", better diffusion of complex content, a **darkened edge** around glass elements,
brighter specular highlights, and a uniform opaque toolbar when content scrolls under floating bars
(<https://www.macrumors.com/2026/06/10/how-liquid-glass-is-changing-in-ios-27/>).

### Borrow vs avoid on the web

| Borrow | Avoid |
| --- | --- |
| Glass only on chrome: navbar, ⌘K palette, modals, toasts, mobile panel | Glass on article bodies, case-study text, UGC |
| Adaptive opacity — more opaque as the surface gets larger | One opacity for every surface |
| Specular top highlight + darkened outer edge (Apple's own iOS 27 correction) | Uniform 1px white border on all sides |
| Single accent-tinted surface per view (the primary CTA) | Accent-tinting the whole nav or every button |
| A "tinted" / opaque mode as a first-class user-visible option | Treating opacity only as an a11y escape hatch |
| Scroll-edge style gradient under the floating nav | Letting arbitrary hero imagery pass under nav text |

---

## 2. Web implementation: `backdrop-filter: url(#svg)` support, late 2026

**This is the critical finding: the refraction path is Chromium-only, and feature detection is
actively misleading.**

- **[verified]** `backdrop-filter` itself is **Baseline 2024** (newly available Sept 2024) and the
  spec grammar explicitly includes `url()`:
  `backdrop-filter: url("filters.svg#filter") blur(4px) saturate(150%)`
  (<https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter>). So `@supports
  (backdrop-filter: url(#x))` parses true in engines that implement the property at all — it tests
  *grammar*, not *rendering*.
- **Chromium: works.** Full `feImage` + `feDisplacementMap` through `backdrop-filter`. **[reported]**
  across every implementation writeup surveyed.
- **Safari / WebKit: does not render.** **[verified]** WebKit bug
  <https://bugs.webkit.org/show_bug.cgi?id=245510> — *"backdrop-filter: url(#some-svg-filter)
  doesn't work with SVG filters like feDisplacementMap"* — status **NEW / unresolved** with activity
  as recent as **2026-09-05**. Three PRs are in flight (WebKit #68614 software rendering,
  #68613 a GPU-process crash fix, #69566 accelerated transform animations), **re-uploaded, not
  merged**. Do not plan for Safari refraction; also note a reported *crash-loop* on affected pages
  pre-fix, which is a reason to actively gate Safari out rather than let it fail soft.
- **Firefox: parses, renders nothing — the dangerous case.** **[verified]** Bugzilla
  <https://bugzilla.mozilla.org/show_bug.cgi?id=1995195> is RESOLVED **DUPLICATE** of
  <https://bugzilla.mozilla.org/show_bug.cgi?id=1961378> — *"backdrop-filter gets ignored if it
  would fall back to a blob image (such like with some SVG url filters)"*. Earlier:
  <https://bugzilla.mozilla.org/show_bug.cgi?id=1787623> (element fails to render at all) and
  <https://bugzilla.mozilla.org/show_bug.cgi?id=1887451> (WPT
  `backdrop-filter-reference-filter.html` failing; Gecko won't build a frame for a `display:none`
  SVG, so the filter reference is treated as invalid — note the spec says filter elements must be
  referenceable even when `display:none`). **Consequence: if the SVG `<defs>` host is
  `display:none`, Firefox invalidates the reference. Hide the SVG with
  `position:fixed; width:0; height:0; overflow:hidden` instead of `display:none`.**
- **Standards trajectory.** **[verified]** SVGWG/FXTF issue #1142 (filed 2026-06-25,
  <https://lists.w3.org/Archives/Public/public-svg-issues/2026Jun/0110.html>) asks for an
  interoperable backdrop-displacement primitive (e.g. `feDisplacementMap in="BackdropGraphic"`),
  stating plainly that *"SVG filters inside backdrop-filter are not interoperable."* Open, untriaged
  across WGs. **No relief in this project's timeframe.**

### Known implementation landmines (all **[reported]**, consistent across sources)

1. **Never feature-detect refraction with `@supports`.** It returns true in Firefox and renders
   nothing. Gate rung 3 in JS. **[judgment]** Detect positively: Chromium + not Safari
   (`'chrome' in window && !/Apple/.test(navigator.vendor)`), or better, probe
   `CSS.supports('backdrop-filter','url(#x)') && !!window.chrome` plus a UA-data check via
   `navigator.userAgentData.brands`.
2. **`feImage` + `data:` URI is unreliable.** WebKit silently refuses to load a `data:` URI inside
   `feImage`; a `blob:` URL loads everywhere. If the canvas-generated map is injected as a data URI
   today, switch to `canvas.toBlob()` + `URL.createObjectURL` and revoke on unmount — it costs
   nothing and removes a whole class of "glass silently collapsed to flat frost" bugs.
   (<https://emit-solution.com/en/blog/recreate-apple-liquid-glass-css>, cross-referenced by
   <https://glass.outpacestudios.com/>)
3. **Premultiplied alpha kills the map.** Chromium premultiplies RGB by alpha on PNG decode, so a
   map written with `alpha: 0` decodes to all-zero RGB — a uniform offset, not refraction. **Write
   the displacement map at `alpha = 255`** and keep it out of the filter's final output (route it
   through `feMerge`/`result` chaining so only the displaced result is emitted).
4. **Chromium caches filters by `id`.** Regenerating the map on resize without changing the filter
   `id` (and the `backdrop-filter` URL that references it) shows a stale map. Mint a fresh id per
   rebuild.
5. **Units.** Percentage geometry on `feImage` maps incorrectly and produces asymmetric
   displacement; use `objectBoundingBox` units or absolute px matching the element box.
6. **Backdrop root.** `backdrop-filter` samples up to the nearest *backdrop root*. Any ancestor with
   `transform`, `filter`, `opacity < 1`, `will-change`, `backdrop-filter`, or `isolation: isolate`
   creates one — the glass then samples that subtree instead of the page and visibly goes flat or
   dead. **This is the #1 cause of "my glass navbar stopped working in production."**
7. **Transform caveat.** `translate` on the glass element is safe; `scale`/`rotate` distort filter
   coordinates (the displacement no longer lines up with the rounded rect).
8. **Masks/clipping and `border-radius`.** Historical Chromium bugs — backdrop-filter not respecting
   masks (<https://issues.chromium.org/issues/41465359>), odd results with translate
   (<https://issues.chromium.org/issues/41243210>). A Firefox bug where backdrop-filter dies on a
   `position: sticky` element whose ancestor has both `overflow` and `border-radius` was reportedly
   fixed Sept 2026 — still worth avoiding that ancestor combination.
9. **Safari prefix reality.** Ship `-webkit-backdrop-filter` alongside the unprefixed property, and
   **do not use CSS custom properties inside the `-webkit-` declaration** — they reportedly don't
   resolve there. Hardcode the fallback values in that one line.

### Published prior art worth reading before coding

`feDisplacementMap`-based, all Chromium-gated: <https://github.com/rizroze/liquid-glass> (SVG
displacement + chromatic aberration, one file), <https://github.com/LeonardSEO/liquid-glass-react>
(React/Next, single filter, ~5KB, no canvas), <https://www.ekino.fr/publications/liquid-glass-in-css-and-svg/>
(clearest explanation of the channel math: `0x00` → −1, `0x80` → 0, `0xFF` → +1, times `scale`),
<https://www.joshwcomeau.com/css/backdrop-filter/> (the layering/backdrop-root fundamentals).
**[reported]** The three-pass chromatic-aberration pattern is consistent across these: run
`feDisplacementMap` at scales `s + 2·ca`, `s + ca`, `s`, `feColorMatrix` each pass down to a single
R/G/B channel, then screen-blend the three back together.

---

## 3. Performance

- **[reported]** `backdrop-filter` is substantially more expensive than `filter` because it must
  sample and re-composite the backdrop: roughly **10–20 ms GPU per tile** vs 5–10 ms for an
  equivalent plain blur. Each glass element triggers its own compositing pass.
- **[reported]** A 12px-blur full-viewport surface can cost **15–25 fps of scroll** on a mid-range
  Android. Blur radius is the dominant cost term, scaled by surface area.
- **[reported]** Practical ceilings that recur across sources: **blur ≤ 20px on large surfaces**
  (24px is tolerable on small chips); **3–4 concurrent glass layers per viewport max** — "two or
  three filter passes is fine; six is a slideshow."
- **[verified-by-construction]** Displacement is cheap relative to blur: `feDisplacementMap` is a
  single texture lookup per pixel, whereas blur is a separable multi-tap convolution. Per the ekino
  writeup, displacement is *"significantly cheaper"* than blur — but SVG filtering does **not**
  super-sample, so displacement alone looks aliased/pixelated and needs a small blur to soften it.
  **[judgment]** This means the right dial for perf is *blur down, displacement up* — the opposite
  of typical glassmorphism tuning.
- **Never animate blur or displacement scale.** **[reported]** Animating filter values forces a full
  recomposite every frame. Animate `opacity` and `transform: translate` only. For the navbar's
  scroll-state change, cross-fade two pre-rendered tints rather than transitioning `blur()`.
- **`will-change` pitfalls.** **[judgment, grounded in the backdrop-root rule]** `will-change`
  creates a stacking context / backdrop root, so `will-change: transform` on a glass element's
  *ancestor* silently breaks the effect, and on the element itself it promotes a layer that holds
  GPU memory permanently. Add `will-change: backdrop-filter` only for the duration of a transition
  and remove it on `transitionend`; never leave it in a static stylesheet.
- **GPU memory.** **[judgment]** Each promoted glass layer holds a backdrop snapshot at
  `w × h × dpr² × 4` bytes. A full-screen modal glass on a 3× phone is ~30–45 MB on its own — which
  is why "modal open ⇒ unmount/disable the navbar glass" matters more than any micro-tuning.
- **`position: fixed`.** **[reported]** Chrome had historical failures with `backdrop-filter` on
  `position: fixed` and `overflow: auto` elements. Current engines are fine, but a fixed glass
  navbar is exactly the element most likely to sit under an ancestor that owns a transform (page
  transition wrappers, view-transition shims, Framer/Motion layout wrappers) — audit the ancestor
  chain of the navbar and portal roots specifically.
- **[judgment]** Portal every glass overlay (palette, modal, toast) to `document.body` so it escapes
  any transformed ancestor and samples the real page.

### Budget for this site **[judgment]**

| State | Concurrent glass surfaces | Notes |
| --- | --- | --- |
| Idle / scrolling | 1 (navbar) | the only always-on glass |
| ⌘K open | 2 (navbar + palette) | scrim between them, not glass-on-glass |
| Modal open | 1 (modal) | disable navbar glass → solid tint while modal is open |
| Toast + nav | 2 | cap toast stack at 2 visible; toasts ≥ 3 become solid |
| Mobile menu open | 1 (panel) | nav merges into the panel |
| Cards | 0 refracting | see §6 — cards get a static glass *look*, not a live filter |

---

## 4. Accessibility

- **`prefers-reduced-transparency` is still not broadly available.** **[verified]** Baseline status
  **Limited availability**: Chrome/Edge 119 (Oct–Nov 2023) only; **Firefox not supported** (behind
  `layout.css.prefers-reduced-transparency.enabled`), **Safari not supported** — WebKit cites
  privacy/fingerprinting concerns (bug 175497)
  (<https://web-platform-dx.github.io/web-features-explorer/features/prefers-reduced-transparency/>,
  <https://caniuse.com/mdn-css_at-rules_media_prefers-reduced-transparency>). **Honor it, but it
  cannot be your only transparency escape.**
- **`prefers-contrast: more` is the broadly supported lever.** **[verified]** Safari 14.1, Firefox
  101, Edge 96; ~93% global. **[judgment]** Make `prefers-contrast: more` collapse glass to a solid
  surface with a full-opacity border — it reaches far more users than reduced-transparency does.
- **Ship a user-facing control.** **[judgment, following Apple's own iOS 26.1/27 correction]** Add a
  site setting (Glass / Solid, or a 3-stop transparency control) persisted to `localStorage` and
  applied as a `data-glass` attribute on `<html>`. This is the only mechanism that reaches Safari
  and Firefox users who have the OS setting on.
- **WCAG 1.4.3 over variable backdrops.** **[verified criterion, reported practice]** 4.5:1 for
  normal text, 3:1 for large text and UI component boundaries (1.4.11). Translucency has no fixed
  ratio: the widely cited illustration is one component measuring 5.2:1 over a dark backdrop and
  **1.8:1** over a light one. **The only defensible method is to compute contrast against the
  worst-case backdrop the page can produce, not against the design comp.**
- **Measure after the blur, not before.** **[reported]** Blur shifts the composited surface
  luminance; sampling the comp's intended tint overstates contrast.
- **[judgment]** Layer order for legibility, strongest first: (a) an opaque **tint floor** (see §6
  for the numbers); (b) a scroll-edge gradient beneath the navbar so hero media never passes
  directly under nav labels; (c) text-shadow only as a last resort — it reads as a hack at editorial
  type sizes and does not count toward WCAG.
- **Focus rings must not be glass.** **[judgment]** Render focus outlines as solid accent at full
  opacity above the glass layer; a translucent focus ring can drop under the 3:1 requirement for
  non-text contrast.
- **Reduced motion.** **[judgment]** The specular highlight / pointer-tracked lens "wobble" is
  decorative motion — gate it behind `prefers-reduced-motion: no-preference` and keep the static
  material.

---

## 5. Designing a differentiated glass material system

The failure mode is not "glass looks bad" — it is "every surface looks like the same sheet of
glass," which destroys the depth hierarchy glass exists to create. **[judgment]** Differentiate on
four axes simultaneously (changing only blur radius is what makes variants indistinguishable):

| Axis | What it communicates |
| --- | --- |
| **Blur radius** | distance from the content plane |
| **Tint opacity** | how much the surface insists on its own legibility |
| **Border light** (top specular vs full rim) | how "lifted" the surface is |
| **Displacement scale** | perceived glass thickness / edge lensing |
| **Outer shadow** | elevation |

Recommended ladder for the six declared variants **[judgment, calibrated to the ≤20px /
3–4-layer constraints in §3]**:

| Variant | Blur | Displacement | Border light | Elevation | Refraction |
| --- | --- | --- | --- | --- | --- |
| `subtle` | 6px | 0 | hairline, uniform | none | never — static tint only |
| `nav` | 12px | low (~0.10 obb) | strong top specular + dark bottom edge | small | yes (Chromium) |
| `interactive` | 10px | medium, scales on hover | full rim, brightens on hover | small | yes |
| `floating` (toast) | 14px | low | top specular | medium | yes |
| `primary` (CTA) | 10px | medium | accent-tinted rim | medium | yes |
| `modal` | 18–20px | low | soft full rim | large | optional — opacity matters more |

Apple's own rule encoded here: **bigger surface ⇒ more opaque, not more blurred** (HIG: sidebars
are "more opaque… to preserve legibility"). So `modal` wins on tint opacity, `nav` wins on edge
definition. **[judgment]** Add a *darkened outer edge* to every variant — Apple added exactly this
in iOS 27 and it is what separates glass from a flat translucent rectangle.

### Avoiding glass-on-glass

**[judgment]** Enforce in code, not in review:
1. A React context (`GlassDepthContext`) that any `LiquidGlass` reads; if depth > 0, it renders the
   solid/tinted variant instead of a filtered one. This makes nesting structurally impossible.
2. Between two stacked chrome layers (navbar under palette), put a **non-glass scrim**
   (`rgba(paper, 0.55)` + 2px blur) — not a second glass sheet. The scrim also fixes the
   backdrop-root problem, because the lower glass is then sampling a flat scrim anyway.
3. Buttons *inside* a glass panel use solid or `subtle` fills, never their own `backdrop-filter`.
   This also removes 3–6 compositing passes per modal.

### Light mode is the harder theme — documented failure patterns

**[reported]**
- **White-on-white collapse.** A white-tinted glass over a light paper backdrop has almost no
  luminance delta, so the surface reads as a flat smudge; edges vanish and the "glass" is
  indistinguishable from the page. Fix: borrow *contrast from the border and shadow*, not the fill —
  a visible shadow plus a **darkened** hairline rim (not a white one) is what makes light-mode glass
  legible as a surface.
- **White borders are invisible.** The `rgba(255,255,255,0.28)` border that defines dark glass does
  nothing in light mode. Light mode needs an ink-based border.
- **Blur alone doesn't separate layers in light mode** because there is less luminance range to
  compress — this is why Apple makes light-mode material *thicker*.
- **Accent text on light glass is the real trap** — see the computed numbers in §6.

---

## 6. Tailoring to the MEGA Devs brand

Computed WCAG ratios for the actual tokens (my own calculation from the hex values, sRGB,
WCAG 2.x relative luminance):

**Baselines:** dark `--ink #f4f2ed` on `--paper #0c0b0f` = **17.54:1**. Dark `--accent #ef4444` on
paper = **5.21:1** (passes as text, but with little headroom). Light `--ink #111010` on
`--paper #f6f3ec` = **17.14:1**. **Light `--accent #d92b1f` as text on light paper = 4.39:1 — it
already fails 4.5:1 before any glass is involved.**

### Dark mode (primary theme)

Glass = **paper tint + a small white lift**. Two numbers matter:

- **Tint floor against a worst-case bright backdrop.** With `--paper` composited over white:
  α 0.50 → ink 3.28:1 (fails); α 0.55 → 3.88:1 (fails); **α 0.60 → 4.62:1 (passes)**; α 0.65 →
  5.58:1. **Recommendation: a tint floor of `rgba(12, 11, 15, 0.62)` behind any glass that can have
  arbitrary media pass under it (navbar over a hero, modal over an image gallery).** For glass that
  only ever sits over the paper background, 0.35–0.45 is safe and far prettier.
- **White-lift ceiling if accent text is used on glass.** `--accent` on paper-plus-white-lift:
  4% → 4.83:1; 6% → 4.60:1; **8% → 4.37:1 (fails)**. **Keep the white lift ≤ 5% on any surface that
  carries accent-colored text.** Above that, accent must become a *fill* with an ink/white label —
  which is also Apple's rule ("apply color to the background rather than to symbols or text").

Starting values **[judgment]**:

| Token | Value |
| --- | --- |
| `--glass-tint-nav` | `rgba(12, 11, 15, 0.62)` |
| `--glass-tint-modal` | `rgba(12, 11, 15, 0.78)` |
| `--glass-tint-floating` | `rgba(12, 11, 15, 0.68)` |
| `--glass-tint-subtle` | `rgba(12, 11, 15, 0.40)` |
| `--glass-lift` | `rgba(244, 242, 237, 0.04)` |
| `--glass-specular` | `inset 0 1px 0 rgba(244, 242, 237, 0.30)` (top only) |
| `--glass-rim` | `rgba(244, 242, 237, 0.14)` → fading to `0.04` at the bottom |
| `--glass-edge-dark` | `0 0 0 1px rgba(0, 0, 0, 0.55)` outside the rim (the iOS 27 move) |
| `--glass-fresnel` | radial accent at **≤ 6% alpha** — see warning below |

**Accent warning.** `#ef4444` is a saturated mid-luminance red; in a `feDisplacementMap` chromatic
split the red channel is displaced most, so red-tinted glass edges will **fringe visibly** and read
as a rendering bug rather than an optical effect. **[judgment]** Keep accent out of the refracting
layer. Express brand through: (a) a single accent-tinted `primary` CTA surface per view; (b an
accent fresnel rim at 4–6% on hover/focus only; (c) accent in the focus ring, solid and above the
glass. Never an accent-tinted navbar — that is the HIG's explicit "incorrect" example *and* the
worst case for chromatic fringing.

### Light mode

- Do **not** reuse the dark recipe with white swapped in. `--ink #111010` has enormous headroom
  (4.42:1 even over a 50%-paper-over-black surface), so the problem is never body text — it is
  **surface definition** and **accent text**.
- Use a **near-paper tint, not white**: `rgba(246, 243, 236, 0.72)`. White-over-paper at any alpha
  lands at #faf8f5–#fdfdfb — invisible against the page.
- Replace the white rim with an **ink rim**: `rgba(17, 16, 16, 0.10)` plus a real shadow
  `0 10px 30px rgba(17,16,16,0.10)`. Keep a faint white specular top line (`0.55`) for the glass
  read, but the *structure* comes from the ink rim and shadow.
- **Make light glass thicker than dark glass** (tint 0.72–0.85 vs 0.62–0.78), per the HIG's
  larger-elements-are-more-opaque principle.
- **`--accent #d92b1f` must never be text on light glass.** It is 4.39:1 on plain paper and drops to
  **2.4:1** over a 75%-paper-over-dark surface, **1.1:1** at 50%. Either darken the light-mode accent
  (a shade near `#b31f15` clears 4.5:1 with margin) or use accent only as a fill behind white text.
  Flag this to whoever owns the token set — **it is a pre-existing contrast bug, not a glass bug.**

### Where glass must NOT be used on this site **[judgment]**

- **Long-form editorial text** — blog/article bodies, case studies, docs. Directly against the HIG's
  "don't use Liquid Glass in the content layer" and the exact place where a shifting backdrop makes
  1.4.3 unverifiable. An editorial brand's credibility is in its reading surface; make it opaque.
- **User-generated content** — arbitrary avatars, uploaded images, and pasted text mean the
  worst-case backdrop is unbounded and untestable.
- **Data-dense surfaces** — tables, code blocks, pricing grids, forms with validation. Fine hairlines
  and small type are what blur destroys first (HIG: thicker materials give "better contrast for text
  and other elements with fine features").
- **Content cards in a scrolling grid.** This is the biggest tension with the stated plan. Cards are
  content layer, they are numerous (blowing the 3–4-layer budget), and they live in scroll
  containers. **Recommendation: give cards a *static* glass aesthetic — gradient border, specular top
  line, subtle tint, no `backdrop-filter`, no SVG filter.** Reserve the real material for a card's
  *hover/active* overlay if anywhere, which also mirrors Apple's one sanctioned content-layer
  exception (transient interactive state).
- **Anything behind a `<video>` or canvas** — unpredictable per-frame backdrop plus continuous
  recompositing.
- **Page/section backgrounds** — that is what standard materials (plain tints and gradients) are for.

---

## Key decisions for the blueprint

1. **Refraction is a Chromium-only progressive enhancement.** Gate rung 3 in JS, never with
   `@supports` (Firefox parses `url()` as valid and renders nothing — Bugzilla 1961378). Explicitly
   exclude Safari; WebKit 245510 is still NEW as of 2026-09.
2. **Three-rung ladder, solid at the bottom:** solid tinted surface (always) → `blur + saturate`
   frost (`@supports (backdrop-filter: blur(1px))`) → SDF displacement + chromatic dispersion
   (Chromium, JS-gated). The site must look finished at rung 1.
3. **Deliver the map as a `blob:` URL at alpha 255, with a fresh filter `id` per rebuild**, and host
   the `<defs>` SVG off-screen via `position:fixed;width:0;height:0;overflow:hidden` — not
   `display:none`.
4. **Blur down, displacement up.** Blur ≤ 20px (nav 12, modal 18–20); displacement carries the
   effect because it is a single texture lookup. Never animate either — animate `opacity` and
   `translate` only.
5. **Hard budget: 3–4 glass surfaces per viewport.** Modal open ⇒ navbar glass goes solid. Toasts
   beyond 2 go solid. Content cards get the static glass *look*, not a live filter.
6. **Make glass-on-glass structurally impossible** via a depth context that downgrades nested
   instances, and separate stacked chrome with a non-glass scrim.
7. **Audit the backdrop root.** No ancestor of a glass surface may carry `transform`, `filter`,
   `opacity<1`, `will-change`, or `isolation: isolate`. Portal all overlays to `document.body`.
8. **Dark tint floor `rgba(12,11,15,0.62)`** wherever arbitrary media can pass behind (computed:
   0.60 is the 4.5:1 break-even for `--ink` over a white worst case). **White lift ≤ 5%** on any
   surface carrying accent text.
9. **Light mode gets its own recipe**: paper-based tint at 0.72–0.85, **ink** rim + real shadow
   instead of a white border, thicker than dark glass.
10. **Keep `--accent` out of the refracting layer** (red fringes hardest under channel-split
    displacement) and out of text-on-glass entirely. One accent-tinted surface per view, per HIG.
    Separately: **light-mode `#d92b1f` as text is 4.39:1 and already fails WCAG AA — escalate.**
11. **Ship a user-visible Glass/Solid toggle**, because `prefers-reduced-transparency` reaches
    Chromium only. Collapse glass to solid on `prefers-contrast: more` (93% support) as well.
12. **Add the iOS 27 corrections now**: darkened outer edge, brighter specular top line, and a
    scroll-edge gradient under the navbar so hero media never passes directly beneath nav labels.
13. **Glass is chrome only.** Article bodies, UGC, tables, forms, and code blocks stay opaque — this
    is both the HIG's rule and the only way 1.4.3 stays verifiable.
