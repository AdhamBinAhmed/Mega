import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Cairo, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./components/Navbar";
import MotionProvider from "./components/MotionProvider";
import SkipLink from "./components/SkipLink";
import ChromeExtras from "./components/ChromeExtras";
import CustomCursor from "./components/CustomCursor";
import LaunchIntro from "./components/launch/LaunchIntro";
import { RevealRefresher } from "./components/Reveal";
import { LanguageProvider } from "./lib/i18n";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

// Arabic webfont, applied when <html lang="ar">.
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
});

// Accent serif for personality — breaks monotony of all-grotesk typography.
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

// Applies the stored theme (light | dark | system) before first paint so there
// is no flash. Must stay tiny and synchronous.
const THEME_SCRIPT = `(function(){try{var p=localStorage.getItem("theme");var t=p==="light"||p==="dark"?p:(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","dark")}})()`;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.megadevs.site"),
  title: "MEGA Devs — Engineering Studio",
  description: "Two-person dev shop. High-performance web apps, Android ROMs, backends, and AI systems. We ship fast, scale effortlessly.",
  alternates: {
    canonical: "/",
  },
  keywords: ["web development", "Android ROM", "Next.js", "React", "AI", "Cairo", "Egypt"],
  authors: [{ name: "MEGA Devs" }],
  openGraph: {
    title: "Introducing the new MEGA Devs — A New Era. A New MEGA.",
    description:
      "The studio has been rebuilt: a glass interface with light and dark themes, a ⌘K command palette, and a free portfolio builder — in Arabic and English.",
    url: "https://www.megadevs.site",
    siteName: "MEGA Devs",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Introducing the new MEGA Devs — A New Era. A New MEGA.",
    description:
      "The studio has been rebuilt: a glass interface with light and dark themes, a ⌘K command palette, and a free portfolio builder — in Arabic and English.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "ybO9TJ7D0GASP_ggBaZxj6MAqAARyFpjQwMx81G8BZs",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${cairo.variable} ${dmSerif.variable}`}>
        <noscript>
          {/* Scroll reveals start invisible until GSAP runs — never hide content without JS. */}
          <style>{`.invisible{visibility:visible!important}`}</style>
        </noscript>
        <LanguageProvider>
          <MotionProvider>
            <SkipLink />
            <LoadingScreen />
            <LaunchIntro />
            <Navbar />
            <ChromeExtras />
            <CustomCursor />
            <RevealRefresher />
            <div id="main-content">{children}</div>
          </MotionProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
