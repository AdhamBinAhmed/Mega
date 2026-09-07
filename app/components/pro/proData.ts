import type { IconType } from "react-icons";
import {
  FaInstagram,
  FaGithub,
  FaPhoneAlt,
  FaGlobe,
  FaWhatsapp,
  FaTelegramPlane,
  FaFacebookF,
  FaEnvelope,
  FaLink,
} from "react-icons/fa";

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

  push(profile.github, "github", "GitHub", "open-source & code", FaGithub, "--text");
  push(profile.whatsapp, "whatsapp", "WhatsApp", "let's talk", FaWhatsapp, "--green", (v) =>
    v.startsWith("http") ? v : `https://wa.me/${v.replace(/[^\d]/g, "")}`
  );
  push(profile.instagram, "instagram", "Instagram", "photos & moments", FaInstagram, "--magenta");
  push(profile.telegram, "telegram", "Telegram", "message me", FaTelegramPlane, "--indigo");
  push(profile.facebook, "facebook", "Facebook", "on the socials", FaFacebookF, "--indigo");
  push(profile.gmail, "gmail", "Email", profile.gmail || "get in touch", FaEnvelope, "--cyan", (v) =>
    v.startsWith("mailto:") ? v : `mailto:${v}`
  );
  push(profile.phone, "phone", "Call", profile.phone || "give me a ring", FaPhoneAlt, "--amber", (v) =>
    v.startsWith("tel:") ? v : `tel:${v.replace(/\s+/g, "")}`
  );

  (profile.customLinks || []).forEach((l, i) => {
    if (!l || !l.url?.trim()) return;
    nodes.push({
      key: `custom-${l.id || i}`,
      label: l.title?.trim() || "Link",
      detail: "custom link",
      href: l.url.trim(),
      icon: FaLink,
      accent: "--violet",
    });
  });

  return nodes;
}
