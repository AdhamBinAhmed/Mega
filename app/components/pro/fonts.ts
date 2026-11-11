// Fonts used ONLY by the Pro Design (about-me) public profile layout.
// Scoped here so the global bundle carries just the 4 brand families;
// the pro profile keeps rendering pixel-identical (Geist pair + Sora wordmark).
import { Geist, Geist_Mono, Sora } from "next/font/google";

export const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-logo",
});

export const proFontClass = `${geistSans.variable} ${geistMono.variable} ${sora.variable}`;
