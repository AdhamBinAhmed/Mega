import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import CanvasStage from "../../../components/CanvasStage";
import { pagesFromDoc, type Page } from "../../../lib/builderTypes";
import { googleFontsUrl } from "../../../lib/fonts";
import { safeBgUrl } from "../../../lib/sanitizeUrl";
import "../../../[subdomain]/subdomain-bg.css";

// Public render of a user-built site. Handles multiple pages:
//   /site/<slug>            -> home (first page)
//   /site/<slug>/<path>     -> the page whose path matches
export default async function SitePage({
  params,
}: {
  params: { slug: string; page?: string[] };
}) {
  // See the profile route: defer Firestore access until a request arrives.
  await connection();
  const { slug, page } = await params;
  const snap = await getDoc(doc(db, "sites", slug.toLowerCase()));
  if (!snap.exists()) notFound();

  const data = snap.data();
  const pages = pagesFromDoc(data);
  if (page && page.length > 1) notFound();
  const seg = page?.[0] || "";

  const current: Page | undefined = seg
    ? pages.find((p) => p.path === seg)
    : pages[0];
  if (!current) notFound();

  const bgStyle = current.bgStyle || "none";
  const customBg = safeBgUrl(current.bgImageUrl);

  // Load only the fonts this page uses.
  const usedFonts = (current.elements || [])
    .map((el) => el.props?.fontFamily)
    .filter((v): v is string => typeof v === "string");
  const fontsUrl = googleFontsUrl(usedFonts);

  const base = `/site/${slug.toLowerCase()}`;
  const showNav = pages.length > 1;

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        overflowX: "hidden",
        background: current.bgColor || "#050507",
      }}
      data-theme="dark"
    >
      {fontsUrl && <link rel="stylesheet" href={fontsUrl} />}

      {/* Background layers */}
      {bgStyle !== "none" && bgStyle !== "custom" && <div className={bgStyle} />}
      {bgStyle === "bg-grid" && <div className="bg-glow" />}
      {bgStyle === "custom" && customBg && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            backgroundImage: `url(${customBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      <div style={{ position: "relative", zIndex: 1, padding: "0 12px" }}>
        <CanvasStage elements={current.elements || []} canvasHeight={current.canvasHeight || 900} />
      </div>

      {/* Auto page navigation (buttons for every page) */}
      {showNav && (
        <nav
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "center",
            padding: "18px 12px 6px",
          }}
        >
          {pages.map((p, i) => {
            const href = i === 0 ? base : `${base}/${p.path}`;
            const active = p.path === current.path;
            return (
              <a
                key={p.id}
                href={href}
                style={{
                  padding: "10px 20px",
                  borderRadius: 999,
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  color: active ? "#0a0714" : "#fff",
                  background: active
                    ? "linear-gradient(120deg,#a78bfa,#5eead4)"
                    : "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backdropFilter: "blur(6px)",
                }}
              >
                {i === 0 ? "🏠 " : ""}
                {p.name}
              </a>
            );
          })}
        </nav>
      )}

      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: "16px 0 32px",
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
