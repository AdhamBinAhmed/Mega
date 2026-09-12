import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { notFound } from "next/navigation";
import CanvasStage from "../../components/CanvasStage";
import type { SiteDoc } from "../../lib/builderTypes";
import "../../[subdomain]/subdomain-bg.css";

export const revalidate = 30;

// Public render of a user-built canvas site.
export default async function SitePage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const snap = await getDoc(doc(db, "sites", slug.toLowerCase()));

  if (!snap.exists()) {
    notFound();
  }

  const site = snap.data() as SiteDoc;
  const bgStyle = site.bgStyle || "none";

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        overflowX: "hidden",
        background: site.bgColor || "#050507",
      }}
      data-theme="dark"
    >
      {/* Animated background layers (reused from the profile system) */}
      {bgStyle !== "none" && bgStyle !== "custom" && <div className={bgStyle} />}
      {(bgStyle === "bg-grid") && <div className="bg-glow" />}
      {bgStyle === "custom" && site.bgImageUrl && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            backgroundImage: `url(${site.bgImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      <div style={{ position: "relative", zIndex: 1, padding: "0 12px" }}>
        <CanvasStage elements={site.elements || []} canvasHeight={site.canvasHeight || 900} />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: "24px 0 32px",
          fontFamily: "monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.1em",
          color: "#6b7280",
        }}
      >
        POWERED BY{" "}
        <a href="https://megadevs.site" style={{ color: "#d1d5db", textDecoration: "none" }}>
          MEGA DEVS
        </a>
      </div>
    </div>
  );
}
