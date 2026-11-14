// Shared routing facts for the MEGA Devs app chrome (navbar, palette, menu).
// Moved verbatim out of Navbar.tsx so dashboard/builder can share them.

// Top-level routes that belong to the MEGA Devs app itself and keep the navbar.
// Anything else at the root (e.g. /adham) is a user profile/site and hides it.
export const APP_SEGMENTS = new Set(["", "works", "history", "dashboard", "login", "palestine", "new-era"]);

export function isSubdomainHost(host: string): boolean {
  const h = host.split(":")[0];
  if (h.endsWith("localhost")) return h !== "localhost"; // e.g. adham.localhost
  if (h === "127.0.0.1" || h.endsWith("vercel.app")) return false;
  const root = "megadevs.site";
  if (h === root || h === `www.${root}`) return false;
  return h.endsWith(`.${root}`); // e.g. adham.megadevs.site
}

// Full section index — powers the ⌘K palette and the mobile menu.
export const sections = [
  { l: "Services", h: "/#services" },
  { l: "Process", h: "/#process" },
  { l: "DevMega", h: "https://dev.megadevs.site" },
  { l: "Works", h: "/works" },
  { l: "Our Story", h: "/history" },
  { l: "Stack", h: "/#stack" },
  { l: "FAQ", h: "/#faq" },
  { l: "Team", h: "/#developers" },
  { l: "Contact", h: "/#contact" },
  { l: "Palestine", h: "/palestine" },
];

// Only the essentials sit on the desktop bar.
export const essentials = [
  { l: "DevMega", h: "https://dev.megadevs.site" },
  { l: "Works", h: "/works" },
  { l: "Our Story", h: "/history" },
  { l: "Contact", h: "/#contact" },
];

// SwimmingGlass orb allow-list (5B.2.2): decorative chrome only on app pages
// that are not full-screen tools or user content.
export const ORB_SEGMENTS = new Set(["", "works", "history", "login", "dashboard"]);

// CircularText background badge (5B.2.5).
export const BADGE_SEGMENTS = new Set(["", "works", "history"]);
