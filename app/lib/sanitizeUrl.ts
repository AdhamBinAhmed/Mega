// URL sanitization shared by every place that renders a user-supplied link.
//
// User link/background URLs come from Firestore (profiles, sites) and are
// rendered on PUBLIC pages, so an attacker-stored `javascript:` / `data:` URI
// would be stored XSS. React does NOT sanitize href, so we gate the scheme
// here before it ever reaches an <a href> or a CSS url(...).

// Schemes we are willing to put in an href.
const SAFE_SCHEMES = ["http:", "https:", "mailto:", "tel:"];

// Browsers strip tab/newline/other C0 control chars out of URLs before acting
// on them (so `java\nscript:` becomes `javascript:`). We strip the same set
// first, so the scheme we test is the scheme the browser will actually run.
function strip(raw: unknown): string {
  if (typeof raw !== "string") return "";
  let out = "";
  for (let i = 0; i < raw.length; i++) {
    // Keep everything except C0 control chars (code points below 0x20).
    if (raw.charCodeAt(i) >= 0x20) out += raw[i];
  }
  return out.trim();
}

/**
 * Returns a safe href. Allows http(s), mailto, tel and site-relative/anchor
 * links; everything else (javascript:, data:, vbscript:, …) collapses to the
 * fallback so it is inert when clicked.
 */
export function safeUrl(raw: unknown, fallback = "#"): string {
  const url = strip(raw);
  if (!url) return fallback;

  // Site-relative or in-page links are always fine.
  if (/^(\/(?!\/)|#|\.\/|\.\.\/)/.test(url)) return url;

  // Has an explicit scheme? It must be allow-listed.
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(url)) {
    try {
      const parsed = new URL(url);
      return SAFE_SCHEMES.includes(parsed.protocol) ? url : fallback;
    } catch {
      return fallback;
    }
  }

  // No scheme and not clearly relative (e.g. "example.com/path"): treat as
  // https so it is a normal outbound link rather than something exotic.
  return `https://${url}`;
}

/**
 * Returns a URL safe to interpolate into a CSS `url(...)` background, or ""
 * when it is not a plain http(s) URL. Also rejects characters that could
 * break out of the url() wrapper and inject extra CSS.
 */
export function safeBgUrl(raw: unknown): string {
  const url = strip(raw);
  if (!/^https?:\/\//i.test(url)) return "";
  if (/["'()\\<>]/.test(url)) return "";
  return url;
}

/** Returns a safe HTTP(S) image URL, or an empty string. */
export function safeImageUrl(raw: unknown): string {
  const url = strip(raw);
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? url : "";
  } catch {
    return "";
  }
}
