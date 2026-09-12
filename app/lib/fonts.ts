// Big Google Fonts library for the builder.
// Editor loads them all; the public site loads only the fonts a page uses.

export type FontCategory = "Sans" | "Serif" | "Display" | "Handwriting" | "Mono";

export interface FontDef {
  label: string;      // shown in the picker
  family: string;     // Google Fonts family name
  category: FontCategory;
  stack: string;      // CSS font-family value stored on the element
  weights?: number[]; // requested weights (400;700 is safe on all multi-weight families)
}

const GENERIC: Record<FontCategory, string> = {
  Sans: "sans-serif",
  Serif: "serif",
  Display: "sans-serif",
  Handwriting: "cursive",
  Mono: "monospace",
};

// Multi-weight families all reliably ship 400 + 700 (heavier weights fall back to
// synthetic bold, which is fine for an MVP). Single-weight display/script fonts omit weights.
const W = [400, 700];

function f(label: string, family: string, category: FontCategory, multiWeight = true): FontDef {
  return {
    label,
    family,
    category,
    stack: `'${family}', ${GENERIC[category]}`,
    weights: multiWeight ? W : undefined,
  };
}

export const FONTS: FontDef[] = [
  // ── Sans ──
  f("Inter", "Inter", "Sans"),
  f("Poppins", "Poppins", "Sans"),
  f("Montserrat", "Montserrat", "Sans"),
  f("Roboto", "Roboto", "Sans"),
  f("Open Sans", "Open Sans", "Sans"),
  f("Lato", "Lato", "Sans"),
  f("Nunito", "Nunito", "Sans"),
  f("Raleway", "Raleway", "Sans"),
  f("Work Sans", "Work Sans", "Sans"),
  f("Manrope", "Manrope", "Sans"),
  f("DM Sans", "DM Sans", "Sans"),
  f("Rubik", "Rubik", "Sans"),
  f("Mulish", "Mulish", "Sans"),
  f("Quicksand", "Quicksand", "Sans"),
  f("Josefin Sans", "Josefin Sans", "Sans"),
  f("Kanit", "Kanit", "Sans"),
  f("Barlow", "Barlow", "Sans"),
  f("Sora", "Sora", "Sans"),
  f("Space Grotesk", "Space Grotesk", "Sans"),
  f("Archivo", "Archivo", "Sans"),
  f("Figtree", "Figtree", "Sans"),
  f("Plus Jakarta Sans", "Plus Jakarta Sans", "Sans"),

  // ── Serif ──
  f("Playfair Display", "Playfair Display", "Serif"),
  f("Merriweather", "Merriweather", "Serif"),
  f("Lora", "Lora", "Serif"),
  f("PT Serif", "PT Serif", "Serif"),
  f("Cormorant Garamond", "Cormorant Garamond", "Serif"),
  f("EB Garamond", "EB Garamond", "Serif"),
  f("Libre Baskerville", "Libre Baskerville", "Serif"),
  f("Bitter", "Bitter", "Serif"),
  f("Crimson Text", "Crimson Text", "Serif"),
  f("Zilla Slab", "Zilla Slab", "Serif"),
  f("Noto Serif", "Noto Serif", "Serif"),
  f("DM Serif Display", "DM Serif Display", "Serif", false),

  // ── Display ──
  f("Bebas Neue", "Bebas Neue", "Display", false),
  f("Anton", "Anton", "Display", false),
  f("Oswald", "Oswald", "Display"),
  f("Righteous", "Righteous", "Display", false),
  f("Archivo Black", "Archivo Black", "Display", false),
  f("Alfa Slab One", "Alfa Slab One", "Display", false),
  f("Fjalla One", "Fjalla One", "Display", false),
  f("Titan One", "Titan One", "Display", false),
  f("Passion One", "Passion One", "Display"),
  f("Bungee", "Bungee", "Display", false),
  f("Monoton", "Monoton", "Display", false),
  f("Abril Fatface", "Abril Fatface", "Display", false),
  f("Staatliches", "Staatliches", "Display", false),
  f("Teko", "Teko", "Display"),

  // ── Handwriting / Script ──
  f("Pacifico", "Pacifico", "Handwriting", false),
  f("Dancing Script", "Dancing Script", "Handwriting"),
  f("Caveat", "Caveat", "Handwriting"),
  f("Lobster", "Lobster", "Handwriting", false),
  f("Great Vibes", "Great Vibes", "Handwriting", false),
  f("Satisfy", "Satisfy", "Handwriting", false),
  f("Sacramento", "Sacramento", "Handwriting", false),
  f("Shadows Into Light", "Shadows Into Light", "Handwriting", false),
  f("Permanent Marker", "Permanent Marker", "Handwriting", false),
  f("Kaushan Script", "Kaushan Script", "Handwriting", false),
  f("Cookie", "Cookie", "Handwriting", false),
  f("Courgette", "Courgette", "Handwriting", false),

  // ── Mono ──
  f("Roboto Mono", "Roboto Mono", "Mono"),
  f("JetBrains Mono", "JetBrains Mono", "Mono"),
  f("Space Mono", "Space Mono", "Mono"),
  f("Fira Code", "Fira Code", "Mono"),
  f("IBM Plex Mono", "IBM Plex Mono", "Mono"),
  f("Source Code Pro", "Source Code Pro", "Mono"),
  f("Inconsolata", "Inconsolata", "Mono"),
];

export const FONT_CATEGORIES: FontCategory[] = ["Sans", "Serif", "Display", "Handwriting", "Mono"];

// Backward-compatible shape used by createElement + the picker.
export const FONT_FAMILIES = FONTS.map((ff) => ({ value: ff.stack, label: ff.label }));

const byStack = new Map(FONTS.map((ff) => [ff.stack, ff]));

export function fontByStack(stack: string): FontDef | undefined {
  return byStack.get(stack);
}

// Build a Google Fonts CSS2 URL for the given families ("all" = the whole library).
export function googleFontsUrl(stacks: string[] | "all"): string {
  const defs =
    stacks === "all"
      ? FONTS
      : Array.from(new Set(stacks))
          .map((s) => byStack.get(s))
          .filter((d): d is FontDef => !!d);

  if (defs.length === 0) return "";

  const params = defs.map((d) => {
    const name = d.family.replace(/ /g, "+");
    return d.weights ? `family=${name}:wght@${d.weights.join(";")}` : `family=${name}`;
  });

  return `https://fonts.googleapis.com/css2?${params.join("&")}&display=swap`;
}
