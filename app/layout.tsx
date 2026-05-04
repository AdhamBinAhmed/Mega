import type { Metadata } from "next";
import { Outfit, Space_Grotesk, JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";

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

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-logo",
});

export const metadata: Metadata = {
  title: "MEGA Devs — Engineering Studio",
  description: "Two-person dev shop. High-performance web apps, Android ROMs, backends, and AI systems. We ship fast, scale effortlessly.",
  keywords: ["web development", "Android ROM", "Next.js", "React", "AI", "Cairo", "Egypt"],
  authors: [{ name: "MEGA Devs" }],
  openGraph: {
    title: "MEGA Devs — Engineering Studio",
    description: "Two-person dev shop. High-performance web apps, Android ROMs, backends, and AI systems.",
    url: "https://megadevs.vercel.app",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${orbitron.variable}`}>{children}</body>
    </html>
  );
}
