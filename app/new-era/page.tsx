import type { Metadata } from "next";
import NewEraClient from "./NewEraClient";
import "./new-era.css";

export const metadata: Metadata = {
  title: "New Era — MEGA Devs",
  description:
    "MEGA Devs is evolving: introducing MEGA Cyber, MEGA Tools, the new MegaOS and a new team structure.",
  alternates: { canonical: "/new-era" },
  openGraph: {
    title: "New Era — MEGA Devs",
    description:
      "MEGA Devs is evolving: introducing MEGA Cyber, MEGA Tools, the new MegaOS and a new team structure.",
    url: "https://www.megadevs.site/new-era",
    siteName: "MEGA Devs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "New Era — MEGA Devs",
    description:
      "MEGA Devs is evolving: introducing MEGA Cyber, MEGA Tools, the new MegaOS and a new team structure.",
  },
};

/**
 * The page is a server component so the full story is in the HTML for search
 * engines; only the animated pieces inside NewEraClient are client islands.
 */
export default function NewEraPage() {
  return <NewEraClient />;
}
