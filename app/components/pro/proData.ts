import type { ComponentType } from "react";
import { PhoneIcon, LetterIcon, LinkIcon } from "@solar-icons/react/linear";
import {
  GitHubLogo,
  WhatsAppLogo,
  InstagramLogo,
  TelegramLogo,
  FacebookLogo,
} from "../icons/brand";

/** Minimal icon contract shared by Solar icons and the vendored brand logos. */
export type IconType = ComponentType<{ size?: number | string; className?: string }>;

/* Mirror of about-me's LinkNode type. */
export type LinkNode = {
  label: string;
  detail: string;
  href: string;
  internal?: boolean;
  icon: IconType;
  accent: string; // css var name
  key: string;
};

export type Identity = {
  name: string;
  role: string;
  photoUrl: string;
};

export type Profile = {
  name?: string;
  role?: string;
  photoUrl?: string;
  telegram?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  github?: string;
  phone?: string;
  gmail?: string;
  customLinks?: { id: string; title: string; url: string }[];
  [key: string]: any;
};

/** Identity block that fills about-me's Hero / Nav / footer, from the user's profile. */
export function buildIdentity(profile: Profile): Identity {
  return {
    name: profile.name || "Your Name",
    role: profile.role || "",
    photoUrl: profile.photoUrl || "",
  };
}

/** The "Connect" grid — same shape as about-me's LINKS, filled from the user's saved fields. */
export function buildLinks(profile: Profile): LinkNode[] {
  const nodes: LinkNode[] = [];

  const push = (
    val: string | undefined,
    key: string,
    label: string,
    detail: string,
    icon: IconType,
    accent: string,
    hrefBuilder?: (v: string) => string
  ) => {
    const v = (val || "").trim();
    if (!v) return;
    nodes.push({ key, label, detail, icon, accent, href: hrefBuilder ? hrefBuilder(v) : v });
  };

  push(profile.github, "github", "GitHub", "open-source & code", GitHubLogo, "--text");
  push(profile.whatsapp, "whatsapp", "WhatsApp", "let's talk", WhatsAppLogo, "--green", (v) =>
    v.startsWith("http") ? v : `https://wa.me/${v.replace(/[^\d]/g, "")}`
  );
  push(profile.instagram, "instagram", "Instagram", "photos & moments", InstagramLogo, "--magenta");
  push(profile.telegram, "telegram", "Telegram", "message me", TelegramLogo, "--indigo");
  push(profile.facebook, "facebook", "Facebook", "on the socials", FacebookLogo, "--indigo");
  push(profile.gmail, "gmail", "Email", profile.gmail || "get in touch", LetterIcon, "--cyan", (v) =>
    v.startsWith("mailto:") ? v : `mailto:${v}`
  );
  push(profile.phone, "phone", "Call", profile.phone || "give me a ring", PhoneIcon, "--amber", (v) =>
    v.startsWith("tel:") ? v : `tel:${v.replace(/\s+/g, "")}`
  );

  (profile.customLinks || []).forEach((l, i) => {
    if (!l || !l.url?.trim()) return;
    nodes.push({
      key: `custom-${l.id || i}`,
      label: l.title?.trim() || "Link",
      detail: "custom link",
      href: l.url.trim(),
      icon: LinkIcon,
      accent: "--violet",
    });
  });

  return nodes;
}
