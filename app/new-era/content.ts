/**
 * New Era — the single source of copy and links for BOTH experiences
 * (the cinematic intro and the /new-era page), so they can never drift apart.
 *
 * Every string here is an i18n key: render it through `t()`.
 *
 * FACTS ONLY. Nothing in this file may be embellished — no invented tool
 * names, counts beyond "10+", services, AI features, people, roles, dates,
 * metrics or quotes. If a detail is missing, it stays missing until the
 * owner supplies it.
 */

export type ChapterId = "cyber" | "tools" | "megaos" | "team";

export interface Chapter {
  id: ChapterId;
  /** Chapter number shown in mono, e.g. "01". */
  n: string;
  /** Short category label, e.g. "New Branch". */
  label: string;
  /** Display name; `accent` marks the word rendered in the serif italic. */
  name: string;
  accent?: string;
  summary: string;
  href?: string;
  /** Small chip, e.g. the MegaOS return date. */
  chip?: string;
}

export const NEW_ERA = {
  /** Bump to replay the intro for everyone after a major update. */
  version: 1,
  /** Show the red dot next to the navbar link until this is turned off. */
  showNavBadge: true,

  kicker: "Introducing",
  title: "New Era",
  /** The accent word inside `title`, rendered in DM Serif italic. */
  titleAccent: "Era",
  headline: "MEGA Devs is evolving.",
  dek: "A new branch, a new platform, a redesigned MegaOS and a new structure — one chapter at a time.",

  chapters: [
    {
      id: "cyber",
      n: "01",
      label: "New Branch",
      name: "MEGA Cyber",
      accent: "Cyber",
      summary:
        "A specialized branch for website security, security assessment and vulnerability discovery.",
      href: "https://cyber.megadevs.site",
    },
    {
      id: "tools",
      n: "02",
      label: "New Platform",
      name: "MEGA Tools",
      accent: "Tools",
      summary:
        "A developer platform with 10+ free tools in one place. You only need to sign in.",
      href: "https://tools.megadevs.site",
      chip: "10+ free tools",
    },
    {
      id: "megaos",
      n: "03",
      label: "Redesign & Revival",
      name: "MegaOS",
      accent: "OS",
      summary:
        "Our websites are being redesigned and upgraded. The first is the new MegaOS platform, rebuilt and enhanced with AI-powered services.",
      href: "https://roms.megadevs.site",
      chip: "Returns · Jan 2027",
    },
    {
      id: "team",
      n: "04",
      label: "Restructuring",
      name: "A new structure",
      accent: "structure",
      summary:
        "We are restructuring the team to support the expansion, the new branches and the direction ahead.",
    },
  ] as Chapter[],

  /**
   * MegaOS revival timeline. `highlight` marks the node drawn in the accent.
   * Typed explicitly so `as const` does not narrow `highlight` off the
   * entries that omit it.
   */
  revival: [
    { when: "Late 2025", what: "Paused" },
    { when: "2026", what: "Rebuilt" },
    { when: "January 2027", what: "Development resumes", highlight: true },
  ] as { when: string; what: string; highlight?: boolean }[],

  /** The month MegaOS development resumes, for the countdown. */
  returnsAt: "2027-01-01T00:00:00Z",

  /**
   * The MEGA Tools line-up, exactly as supplied by the owner. `icon` names a
   * Solar linear icon (verified to exist) — the source listing used emoji,
   * which the site never uses for UI.
   */
  tools: [
    { name: "DevLens", icon: "MagnifierIcon", blurb: "Paste a GitHub repo and get live architecture maps, dependency graphs and tech-debt detection." },
    { name: "StackTrace", icon: "BugIcon", blurb: "Paste any error: it detects the language and framework, parses the stack and isolates the probable root cause." },
    { name: "DevProof", icon: "UserCheckRoundedIcon", blurb: "Turn a GitHub username into an evidence-based developer profile, backed by real repo data." },
    { name: "RegexLab", icon: "Code2Icon", blurb: "A full regex IDE: live matching, a backtracking debugger and code generation in 7 languages." },
    { name: "APIForge", icon: "ServerIcon", blurb: "A lightweight API workspace: request builder, environments, collections and cURL import." },
    { name: "EnvVault", icon: "LockKeyholeIcon", blurb: "Parse .env files, classify secrets, diff environments and scan code for leaks — all locally." },
    { name: "Color Picker", icon: "PaletteIcon", blurb: "Pick colors, convert HEX/RGB/HSL, build palettes and check WCAG contrast." },
    { name: "Base64 Codec", icon: "TransferHorizontalIcon", blurb: "Encode and decode Base64 — UTF-8 safe, URL-safe, and file to Base64. Nothing leaves your browser." },
    { name: "Base Converter", icon: "CalculatorIcon", blurb: "Convert between binary, octal, decimal, hexadecimal and text live, at arbitrary precision." },
    { name: "QR Generator", icon: "QrCodeIcon", blurb: "Turn links or text into QR codes. No redirect service, no expiry. PNG and SVG export." },
  ],

  /** Org units for the restructuring diagram. No people, no roles. */
  units: [
    { name: "MEGA Cyber", note: "Security" },
    { name: "MEGA Tools", note: "Platform" },
    { name: "MegaOS", note: "Android & OS" },
    { name: "Web Studio", note: "Web engineering" },
  ],
} as const;

export const NEW_ERA_SEEN_KEY = "mega:new-era:seen";
