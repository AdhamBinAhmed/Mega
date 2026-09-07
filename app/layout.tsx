import type { Metadata } from "next";
import { Outfit, Space_Grotesk, JetBrains_Mono, Sora, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./components/Navbar";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-logo",
});

// Fonts used by the Pro Design (about-me) layout — faithful match.
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

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
    title: "MEGA Devs — Engineering Studio",
    description: "Two-person dev shop. High-performance web apps, Android ROMs, backends, and AI systems.",
    url: "https://www.megadevs.site",
    siteName: "MEGA Devs",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MEGA Devs — Engineering Studio",
    description: "Two-person dev shop. High-performance web apps, Android ROMs, backends, and AI systems.",
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
    <html lang="en">
      <body className={`${outfit.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${sora.variable} ${geistSans.variable} ${geistMono.variable}`}>
        <LoadingScreen />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
