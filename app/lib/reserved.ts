// Subdomains / site slugs a user must NOT be able to claim, because they
// collide with real application routes (the subdomain middleware rewrites
// `<name>.megadevs.site` -> `/<name>`) or with infrastructure hostnames.
// Without this list, registering e.g. `dashboard` shadows the real dashboard
// and enables convincing phishing.
export const RESERVED_SLUGS = new Set<string>([
  // App routes
  "dashboard",
  "builder",
  "login",
  "works",
  "history",
  "palestine",
  "site",
  // Infra / common
  "www",
  "api",
  "admin",
  "mega",
  "megadevs",
  "app",
  "assets",
  "static",
  "public",
  "_next",
  "next",
  "robots",
  "sitemap",
  "favicon",
  "mail",
  "ftp",
  "cdn",
]);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}

/**
 * Normalize a user-chosen subdomain/slug: lowercase, keep only [a-z0-9-],
 * collapse runs of hyphens, trim leading/trailing hyphens, cap length.
 * Returns "" for anything that reduces to empty.
 */
export function cleanSlug(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 63);
}
