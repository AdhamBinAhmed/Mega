# Iconography Report — MEGA Devs Redesign

Agent: Iconography Specialist · Date: 2026-11-11 · Status: research complete
Scope: Solar Icons (mandatory primary system) + brand-logo strategy + RTL + usage rules.
Local probe inspected: `@solar-icons/react@2.5.0` (scratchpad install). All icon names below were verified against the probe's `dist/icons/style/linear.d.mts` export list unless marked otherwise.

---

## 1. Solar Icon Set — overview

- **Origin:** Designed by 480 Design (icons credited to Damir Tuarshe). Official repo: https://github.com/480-Design/Solar-Icon-Set (verified by orchestrator: repo states **7,479 icons across 6 styles**, maintained by 480 Design). Figma community file: https://www.figma.com/community/file/1166831539721848736 (this exact URL is cited in the probe's `LICENSE-THIRD-PARTY`).
- **Styles (6):** Linear, Outline, Broken, Line Duotone, Bold, Bold Duotone — confirmed both on Iconify (https://icon-sets.iconify.design/solar/) and in the probe (6 style directories).
- **Counts:** The React package README (probe, verified) says **1,517 unique icons × 6 styles = 9,102 SVGs**; each per-style barrel exports 1,530 names (a few aliases/extras). Iconify lists 8,706; the repo says 7,479 — counts differ per distribution snapshot; the npm package's set is the one that matters for us.
- **License:** Original artwork **CC BY 4.0** (commercial use OK, attribution required). Verified three ways: Iconify's listing, https://solar-icons.dev/docs/v2/community/license, and the probe's `LICENSE-THIRD-PARTY` file ("Solar Icons Set By 480 Design… CC BY 4.0"). The GitHub repo landing page does not surface a license file (orchestrator-verified; raw `/LICENSE` 404s) — treat **CC BY 4.0 as the operative license** and add attribution (section 6). Re-verify the repo LICENSE at implementation as a formality only.

## 2. `@solar-icons/react` v2.5.0 — API (verified in probe)

- **Package:** MIT (code) by Hakim Saoudi; icons CC BY 4.0 (third-party license file ships inside the package). npm latest = 2.5.0 (registry-verified). ESM-only (`"type": "module"`), React >= 16.8 peer dep. Docs: https://solar-icons.dev/docs/v2/packages/react
- **Tree-shaking:** `package.json` declares **`"sideEffects": false`** (verified). Import paths:
  - `@solar-icons/react/linear` — per-style barrel (preferred; tree-shakes).
  - `@solar-icons/react/linear/arrow-right` — single-icon module (fastest dev-server resolution).
  - Root `@solar-icons/react` — exports **style-suffixed names only** (`ArrowRightLinearIcon`, `ArrowRightBoldIcon`, … 9,184 exports) plus `SolarProvider`, `useSolar`, `IconBase`. Avoid: giant barrel.
  - `@solar-icons/react/dynamic` — runtime style switching via `weight?: 'Linear' | 'Outline' | 'Broken' | 'LineDuotone' | 'Bold' | 'BoldDuotone'` (bundles all 6 styles of each icon — avoid except in a style-toggle demo).
  - Recommend adding `@solar-icons/react` to `experimental.optimizePackageImports` in `next.config.ts` so barrel imports resolve to per-icon modules (Next docs: `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/optimizePackageImports.md`).
- **Props (verified in `dist/lib/types.d.mts`):** `size` (number→px or CSS unit), `color` (defaults to `var(--solar-color, currentColor)`), `strokeWidth` (Linear/Broken/LineDuotone; default `var(--solar-stroke-width, 1.5)`), `secondaryColor` / `secondaryOpacity` (duotone layers), `alt` (renders an SVG `<title>`), `isolated` (ignore provider), plus all standard SVG props (`className`, `onClick`, …). **There is NO `mirrored`/RTL prop** (verified — see section 5).
- **Built-in a11y:** `IconBase` auto-applies **`aria-hidden="true"` when no `alt`/`aria-label`/`title` is given** (verified in `IconBase.mjs`). Default sizing is `1em` with `font-size: var(--solar-size, 24px)` fallback, viewBox `0 0 24 24`, stroke/fill `currentColor`, round caps/joins.
- **SolarProvider / useSolar:** sets CSS custom props (`--solar-color`, `--solar-size`, `--solar-stroke-width`, `--solar-secondary-*`) on a `display: contents` div; icons read them via CSS cascade without re-rendering.
- **Next.js / RSC:** Only `SolarProvider.mjs` carries `"use client"` (verified by grep). Icon components are stateless `forwardRef` SVG renderers with **no** client directive — they render fine inside Server Components. Practical rule: skip `SolarProvider` entirely and drive defaults with our own CSS variables/Tailwind, keeping icons RSC-safe; if the provider is ever wanted it must sit inside a client boundary.

## 3. Recommended style: Linear primary, Bold for filled states

- **Primary: `linear`** (1.5 stroke on a 24px grid, round caps/joins — verified from path data). It matches the hairline editorial aesthetic (thin rules, Space Grotesk / JetBrains Mono) far better than Outline (solid filled outlines) or Broken (decorative gaps).
- **Secondary: `bold`** for filled/active states only — active nav item, filled star, toggled theme icon. Same geometry and identical export names across all 6 styles (verified: per-style export lists diff clean), so swapping style = swapping import path.
- **Accent option:** `bold-duotone` with `secondaryColor` = accent `#ef4444` (dark) / `#d92b1f` (light) at the default 0.5 secondary opacity, for marketing/feature cards only — never in chrome/UI.
- **Stroke rules:** keep `strokeWidth` at **1.5** for 20–24px; drop to **1.25** at 16px if strokes feel heavy beside 1px hairline borders (strokeWidth is a plain SVG attribute here, fractional values work). Never below 1.25 (anti-aliasing fuzz).
- **Optical alignment with JetBrains Mono labels:** icons render at `1em` by default — inline with text, let them inherit font-size and add `vertical-align: -0.125em`, or use flex `items-center` with `gap: 0.5em`. Mono caps sit high; a `translateY(0.5px)` nudge utility (`.icon-baseline`) is acceptable for 16px icons beside 12–13px mono microlabels.

## 4. Brand/tech logos: Simple Icons (Solar has none)

Solar contains no brand marks (only stray exceptions like `FigmaIcon`). Use **Simple Icons** as the path source: license is **CC0 1.0 Universal** (verified from the repo's LICENSE.md — public domain; it explicitly does *not* waive trademark rights, so marks remain subject to each brand's guidelines — fine for "link to my GitHub" usage). https://simpleicons.org · https://github.com/simple-icons/simple-icons (npm latest 16.37.0, registry-verified).

All 17 required slugs verified live (HTTP 200 on cdn.simpleicons.org, 2026-11-11):
`github`, `telegram`, `whatsapp`, `instagram`, `facebook`, `google`, `nextdotjs` (Next.js), `react`, `python`, `cplusplus` (C++ — **not removed**, slug intact), `archlinux`, `tailwindcss`, `postgresql`, `docker`, `pytorch`, `nodedotjs` (Node.js), `nginx`.
Naming gotchas verified (these 404): `cpp`, `nextjs`, `nodejs`, `tailwind`, `arch`, `twitter` (now `x`), `linkedin` (removed from Simple Icons at brand request).

**Strategy:** vendor the 17 path strings into one local `app/components/icons/brands.tsx` (single `<svg viewBox="0 0 24 24" fill="currentColor"><path d={…}/></svg>` factory) rather than depending on the npm package — Simple Icons periodically removes icons at brand request (e.g. linkedin), and vendoring freezes our set, keeps everything monochrome `currentColor`, and adds zero dependencies.

## 5. RTL mirroring (Arabic)

- **The package has no `mirrored` prop** (verified in `types.d.mts`) — mirroring is ours to implement. Simplest and recommended: one global CSS rule + opt-in class:
  `[dir="rtl"] .icon-mirror { transform: scaleX(-1); }`
  Apply `.icon-mirror` (via `className` on the icon, or a tiny `<DirIcon>` wrapper) only to directional icons. The site already uses `[dir="rtl"]` selectors (`app/globals.css`, `app/components/navbar.css`), so this slots straight in.
- **MUST mirror:** arrows conveying reading direction (`ArrowRightIcon`, `ArrowRightUpIcon`, `AltArrowRightIcon`/`AltArrowLeftIcon` chevrons, `DoubleAltArrowRightIcon`), `Logout2Icon`/`Login2Icon`/`ExitIcon`, `ReplyIcon`/`ForwardIcon`, `SquareShareLineIcon`, list-indent icons, `SidebarIcon`/panel icons, `ImportIcon`/`ExportIcon`.
- **MUST NOT mirror:** checkmarks (`CheckCircleIcon`), media playback (`PlayIcon` — stays LTR by convention), time (`ClockCircleIcon`, `HistoryIcon`), search (`MagnifierIcon`), brand logos, physical objects (`SmartphoneIcon`, `LetterIcon`), text-format icons containing letterforms, `GlobalIcon`, `SunIcon`/`MoonIcon`.
- "Up-right ↗ external" arrows mirror to up-left in RTL (treat as directional).

## 6. Usage rules for the redesign

- **Sizes:** 16 (inline/microlabels), 18 (buttons/inputs), 20 (nav/cards — the workhorse), 24 (feature/empty states). Always pass an explicit `size` in chrome (don't rely on `1em` in flex layouts). Icons are drawn on a 24px grid at every size.
- **Color:** never hardcode — rely on the default `currentColor` so icons inherit ink `#f4f2ed`/`#111010`; accent `#ef4444`/`#d92b1f` comes from the parent's `color` token, not icon props.
- **A11y:** decorative icons get no `alt` (package auto-sets `aria-hidden="true"`, verified). Icon-only buttons: `aria-label` on the `<button>`, not the icon. Icon + visible text: icon stays decorative.
- **No emoji/unicode glyphs as UI icons.** Replace every glyph currently in TSX/i18n (`→ ↗ ◐ ☾ ☀ ✉ ⌥ ✦ ● ◎ ⬡ 🖼️ 🅣 ▢ ⬛` — found in `app/page.tsx`, `app/components/Navbar.tsx`, `app/builder/page.tsx`, `app/history/page.tsx`, `app/dashboard/page.tsx`, `app/lib/i18n.tsx`, `app/works/page.tsx`, etc.) with Solar components, and strip arrows out of i18n strings so direction is CSS-driven. Exception: 🇵🇸 flag emoji is content/identity, not a UI icon — keep (or replace with a proper flag SVG).
- **Attribution (CC BY 4.0):** add one line to the site footer/about or `/humans.txt`: "Icons: Solar Icon Set by 480 Design (CC BY 4.0)". The package's `LICENSE-THIRD-PARTY` acknowledgment ships in `node_modules` automatically.
- **Remove `react-icons`** (used only in `app/components/pro/Hero.tsx`, `LinkCard.tsx`, `Nav.tsx`, `proData.ts`) after migration — one icon system only.

### Name mapping (every Solar name below verified present in the probe's linear barrel)

| Need | Use | Avoid (does NOT exist in v2.5.0) |
|---|---|---|
| → links / CTAs | `ArrowRightIcon` | — |
| ↗ external | `ArrowRightUpIcon` or `SquareShareLineIcon` | `ExternalLinkIcon` |
| Theme ◐ ☾ ☀ | `SunIcon` (or `Sun2Icon`), `MoonIcon`, `MoonStarsIcon` | — |
| Search | `MagnifierIcon`, `MinimalisticMagnifierIcon` | `MagniferIcon` (v1 typo name) |
| Menu / ⌥ cmd | `HamburgerMenuIcon`, `CommandIcon` | — |
| Language/globe | `GlobalIcon` (also `GlobeIcon`, `EarthIcon`) | — |
| Mail ✉ | `LetterIcon`, `LetterOpenedIcon` | — |
| Copy / auth | `CopyIcon`, `Logout2Icon`, `Login2Icon` | — |
| Terminal/code | `CodeIcon`, `Code2Icon`, `CodeSquareIcon`, `FileTerminalIcon`, `ProgrammingIcon` | `TerminalIcon` |
| Text 🅣 | `TextSquareIcon`, `TextFormatIcon` | `TextIcon` |
| Image 🖼️ | `GalleryIcon`, `GalleryMinimalisticIcon` | — |
| Shapes ▢ ⬛ ⬡ | `BoxIcon`, `BoxMinimalisticIcon`, `LayersIcon`, `WidgetIcon` | — |
| Sparkle ✦ | `StarsIcon`, `SparklesIcon`, `StarShineIcon`, `MagicWandIcon` | `MagicStickIcon` |
| Target ◎ | `TargetIcon` | — |
| Work/CV | `CaseIcon`, `CaseMinimalisticIcon`, `SuitcaseIcon` | `BriefcaseIcon` |
| Misc UI | `SettingsIcon`, `FilterIcon`, `SortIcon`, `EyeIcon`/`EyeClosedIcon`, `TrashBinTrashIcon`, `PenNewSquareIcon`, `InfoCircleIcon`, `DangerTriangleIcon`, `QuestionCircleIcon`, `CheckCircleIcon`, `CloseCircleIcon`, `MenuDotsIcon`, `UserRoundedIcon`, `UsersGroupRoundedIcon`, `LinkRoundAngleIcon`, `ClockCircleIcon`, `CalendarIcon`, `MapPointIcon`, `ShieldCheckIcon`, `BoltIcon`, `CpuIcon`, `DatabaseIcon`, `ServerIcon`, `CloudIcon`, `RocketIcon`, `GraphUpIcon`, `GitBranchIcon`, `QrCodeIcon`, `TranslationIcon`, `SmartphoneIcon`, `MonitorIcon`, `LaptopIcon` | `AtIcon` (use `MentionCircleIcon`), `BrushIcon` (use `PaintBrushIcon`), `FingerprintIcon` (use `LockKeyholeIcon`/`ShieldKeyholeIcon`), `QuoteUpIcon` (use `QuoteIcon`) |

---

## Key decisions for the blueprint

1. **Install `@solar-icons/react@2.5.0`; import from `@solar-icons/react/linear` (per-style subpath).** `sideEffects: false` verified — tree-shaking is safe; also add the package to `optimizePackageImports`. Never import the root barrel or `/dynamic`.
2. **Linear is the house style (strokeWidth 1.5 default, 1.25 allowed at 16px); Bold only for filled/active states; Bold Duotone with accent secondary reserved for feature highlights.**
3. **Skip `SolarProvider`** — icons are RSC-safe without it (`"use client"` exists only on the provider); defaults via `currentColor` + explicit `size` keep everything server-renderable.
4. **Brand logos come from vendored Simple Icons paths (CC0).** All 17 slugs verified live, including `cplusplus`, `nextdotjs`, `nodedotjs`; `linkedin`/`twitter` no longer exist in Simple Icons — do not plan around them.
5. **RTL = CSS only: `[dir="rtl"] .icon-mirror { transform: scaleX(-1); }` applied to directional icons** (arrows, logout/login, reply/forward, panels) — no package mirrored prop exists.
6. **Kill all unicode/emoji UI glyphs and `react-icons`; rely on the built-in auto `aria-hidden`; icon-only buttons get `aria-label`; footer carries the "Solar Icon Set by 480 Design (CC BY 4.0)" attribution line.**

Sources: local probe `@solar-icons/react@2.5.0` (package.json, README, LICENSE, LICENSE-THIRD-PARTY, dist types) · https://solar-icons.dev/docs/v2/packages/react · https://solar-icons.dev/docs/v2/community/license · https://github.com/480-Design/Solar-Icon-Set · https://icon-sets.iconify.design/solar/ · https://www.figma.com/community/file/1166831539721848736 · https://github.com/simple-icons/simple-icons (LICENSE.md = CC0 1.0) · https://cdn.simpleicons.org slug checks · npm registry (simple-icons 16.37.0, @solar-icons/react 2.5.0) · Next.js docs in `node_modules/next/dist/docs/`.
