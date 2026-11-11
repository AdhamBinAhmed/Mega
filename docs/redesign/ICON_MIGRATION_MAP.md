# ICON MIGRATION MAP — Solar Icons (`@solar-icons/react` v2.5.0)

**Rules.** Primary style: **Linear** for all UI chrome (matches the hairline editorial aesthetic; `strokeWidth` default 1.5, use 1.25 at 16px). Bold only for filled/active states if ever needed. Import per icon from the style subpath for tree-shaking (`"sideEffects": false` verified): `import { ArrowRightIcon } from "@solar-icons/react/linear"`. `SolarProvider` exists but is optional — icon components are RSC-friendly and default to `currentColor`; the iconography researcher recommends skipping the provider (adjustment to the master plan's Phase C, decide at implementation; zero functional difference, all consumers are client components). Icons auto-set `aria-hidden` when no `alt` is passed (verified in IconBase). License: artwork **CC BY 4.0** (add an attribution line in the footer colophon or humans.txt); package code MIT. Add `@solar-icons/react` to `optimizePackageImports` in `next.config.ts`. Every decorative icon gets `aria-hidden="true"`; icon-only buttons keep their `aria-label`. Directional icons (arrows, logout) mirror in RTL via `[dir="rtl"] .icon-flip { transform: scaleX(-1) }`. **No emoji as UI icons.** Brand/tech logos are NOT Solar — they live in `app/components/icons/brand.tsx` as monochrome `currentColor` inline SVGs (Simple Icons CC0 paths).

Every Solar name below was **verified to exist** in `dist/icons/style/linear.d.mts` of v2.5.0. Note: v2 renamed the magnifier family — it is **`MagnifierIcon`** (the prompt's `MagniferIcon` does not exist in v2).

## 1. Navbar / global chrome (`app/components/Navbar.tsx` → `app/components/nav/*`)

| Current | Location | Replacement | Notes |
|---|---|---|---|
| `☾` / `☀` theme button | `.mnav-icon` | `MoonIcon` / `Sun2Icon` (linear, 18) | add `MonitorIcon` for the new "system" state |
| `ع` / `EN` lang button | `.mnav-lang` | keep **text** (it's a label, not an icon) | optionally pair with `GlobalIcon` 16 |
| `/ Index` key pill | `.mnav-key` | `CommandIcon` 14 + `⌘K`/`Ctrl K` text | palette trigger |
| Burger `<span>×3` | `.mnav-burger` | replaced by StaggeredMenu's own toggle | old burger removed <768px |
| Drawer numbering `1..n` | `.mnav-drawer-link span` | keep (StaggeredMenu `displayItemNumbering`) | mono font |
| Palette prompt `>` | `.mnav-cmd-prompt` | `MagnifierIcon` 16 | input leading icon |
| Palette item `>` | `.mnav-cmd-ic` | `ArrowRightIcon` 14 (RTL-mirror) | sections group |
| Action `◐` Toggle Theme | palette action | `MoonIcon` 16 | |
| Action `✉` Copy Email | palette action | `CopyIcon` 16 | |
| Action `↑` Scroll to Top | palette action | `ArrowUpIcon` 16 | |
| Action `⌥` Open GitHub | palette action | brand `GitHubLogo` 16 | from `brand.tsx` |
| Action `🇵🇸` Palestine | palette action | keep flag emoji **as text content** or replace with `HeartIcon` 16 | flag is semantic, acceptable exception; decide at implementation |
| Toast dot | `.mnav-toast-dot` | `CheckCircleIcon` 16 + keep `aria-live` dot styling | |
| New: account group (Dashboard / Builder / Sign out) | palette + mobile menu | `UserCircleIcon` / `Widget2Icon` / `Logout2Icon` 16 | only when `auth.currentUser` |

## 2. Homepage (`app/page.tsx`)

| Current | Location | Replacement |
|---|---|---|
| `"Start a Project →"` (glyph inside i18n key) | hero CTA `btn-solid` | text `t("Start a Project")` + `ArrowRightIcon` 16 (RTL-mirror). **i18n:** add key `"Start a Project"` with AR `"ابدأ مشروعاً"`; keep old key until all callers migrate (also used by drawer CTA) |
| `"Start Now →"` | `.hero-promo` `promo-link` | SpecularButton label `t("Start Now")` + `ArrowRightIcon` 16. **i18n:** add `"Start Now": "ابدأ الآن"` |
| `↗` svc arrow | `.svc-arrow` | `ArrowRightUpIcon` 16 (RTL-mirror) |
| `✦` marquee separators | `.mq-divider-item b`, palestine marquee | keep — typographic ornament, not a UI icon |
| `→` contact-link arrows | `.contact-link-arrow` | `ArrowRightIcon` 16 (RTL-mirror) |
| `●` status dots (`status-live`, availability) | hero/status/footer | keep CSS dot (`.status-live` div) — not an icon |
| `"Launch the toolkit →"` | DevMegaAd CTA | text + `SquareArrowRightUpIcon` 16 |
| `"Read Our Story →"` | history CTA | text + `ArrowRightIcon` 16 |
| `🇵🇸 Palestine` footer link | `.colophon-col` | keep flag (semantic) |
| Telegram / GitHub dev links | `.dev-link` | brand `TelegramLogo` / `GitHubLogo` 14 + text |
| FAQ `+` toggle | `.faq-icon` | `AddCircleIcon` 18 (rotates 45° when open — keep behavior) |

## 3. Works page (`app/works/page.tsx`)

| Current | Replacement |
|---|---|
| `"Visit Project" + →` (`.arw`) | text + `ArrowRightUpIcon` 16 (RTL-mirror) |
| `"Confidential" + •` | text + `CloseCircleIcon` 14 or keep dot |
| CTA `→` (bottom) | `ArrowRightIcon` 16 |
| macOS window dots (`.w-dot`) | keep — decorative device chrome |

## 4. History page

| Current | Replacement |
|---|---|
| Pillar icons `◎ ⬡ ✶ …` | `GlobalIcon` (leadership), `CpuIcon` (AI), `Widget2Icon` (ecosystem) 24 — map by meaning, verify remaining pillars at implementation |
| `"Read Our Story →"` style CTAs | text + `ArrowRightIcon` |

## 5. Login / Dashboard / Builder (app chrome — allowed)

| Current | Location | Replacement |
|---|---|---|
| Google logo (gstatic img) | login button | brand `GoogleLogo` from `brand.tsx` (removes external img dependency) |
| `↗ View Live Site`, `↗` preview open | dashboard | `SquareArrowRightUpIcon` 16 + split glyph out of i18n keys (add `"View Live Site"` key) |
| `Copied ✓` / `✓ Enabled…` | dashboard buttons | `CheckCircleIcon` 16 + plain text keys |
| `▾` section chevrons | `.form-section-chevron` | `AltArrowDownIcon` 16 (rotate when open) |
| `🖼️` empty image slot | dashboard uploader | `GalleryIcon` 32 |
| Builder ADD_BUTTONS `🅣 ⬛ 🖼️ ▢` | `app/builder/page.tsx` | Text `TextSquareIcon` · Button `BoxMinimalisticIcon` · Image `GalleryIcon` · Box `Widget2Icon` (all four verified in linear.d.mts; note `TextIcon` does NOT exist in v2) |
| `📱 Phone` preview toggle | builder toolbar | `SmartphoneIcon` 16 |
| `↗ View live` | builder | `SquareArrowRightUpIcon` 16 |
| `＋ Add new page` | builder | `AddCircleIcon` 16 |
| Toast `… ✓` strings | builder `showToast` | `CheckCircleIcon` in toast UI; strip glyph from strings |

## 6. Brand & tech logos → `app/components/icons/brand.tsx`

Monochrome, `fill="currentColor"`, `viewBox="0 0 24 24"`, from **Simple Icons (CC0)**. Social/auth: GitHub, Telegram, WhatsApp, Instagram, Facebook, Google. Tech (LogoLoop, §5B.2.7): Next.js, React, Python, C++ (`cplusplus` slug), Arch Linux, Tailwind CSS, PostgreSQL, Docker, PyTorch, Node.js, Nginx. "Android ROMs" has no logo → Solar `SmartphoneIcon` (verified). All inherit `color: var(--ink-soft)`, hover `var(--accent)` — never per-brand colors.

**Not migrated (pixel-equivalent user content):** `PremiumProfileCard.tsx` inline SVG brand icons (already proper logos), `pro/*` react-icons get a **like-for-like swap only**: `FiArrowDown`→`AltArrowDownIcon`, `FiArrowUpRight`→`ArrowRightUpIcon`, `FiArrowRight`→`ArrowRightIcon`, `FiGithub`→brand `GitHubLogo`, `Fa*` social set→`brand.tsx` logos (same 20px box, same colors) — this is what lets `react-icons` be uninstalled without visual change.

## 7. i18n key changes required (EN key + AR value both updated)

| Old key | New key(s) | AR |
|---|---|---|
| `"Start a Project →"` | `"Start a Project"` | `ابدأ مشروعاً` |
| `"Start Now →"` | `"Start Now"` | `ابدأ الآن` |
| `"Read Our Story →"` | `"Read Our Story"` | (reuse existing AR minus arrow) |
| `"Launch the toolkit →"` | `"Launch the toolkit"` | 〃 |
| `"↗ View Live Site"` | `"View Live Site"` | 〃 |
| `"Copied ✓"` / `"✓ Enabled — Turn Off"` | `"Copied"` / `"Enabled — Turn Off"` | 〃 |
| new | `"Menu"` / `"Close"` / `"Socials"` | `القائمة` / `إغلاق` / `تواصل` |
| new | `"MEGA DEVS • WE SHIP FAST • "` | CircularText badge; if AR glyph-splitting renders broken, use the EN string in both languages (per 5B.2.5) |

## 8. Missing equivalents / exceptions

- Flag emoji 🇵🇸 — semantic, kept as text (or `HeartIcon`); decide at checkpoint.
- `✦` ornaments, macOS window dots, `.status-live` pulse dots, `.c-cursor` blink — typographic/decorative, kept.
- Solar has no brand logos (by design) → `brand.tsx`.
- `MagniferIcon` (v1 spelling) does not exist in v2 → use `MagnifierIcon`.

## 9. Migration order (Phase C)

1. `npm i @solar-icons/react` → add `SolarProvider` to the client tree (inside `LanguageProvider`).
2. Create `brand.tsx` with the 17 logos.
3. Migrate per the tables above, file by file; split i18n keys in the same commit as their consumer.
4. Like-for-like swap in `pro/*`; visual-diff the public profile pages.
5. `npm uninstall react-icons`; `grep -rn "react-icons" app` must be empty; `npm run lint && npm run build`.
