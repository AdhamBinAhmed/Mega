import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { notFound } from "next/navigation";
import Image from "next/image";

export const revalidate = 60; // optionally revalidate every 60 seconds

export default async function SubdomainProfilePage({ params }: { params: { subdomain: string } }) {
  const { subdomain } = await params;
  const docRef = doc(db, "profiles", subdomain);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    notFound();
  }

  const profile = docSnap.data();
  const theme = "dark"; // Defaulting profiles to dark theme for consistency
  const bgStyle = profile.backgroundStyle || "bg-grid";

  return (
    <div className="profile-root" data-theme={theme}>
      <style>{`
        /* ── TOKENS ── */
        .profile-root {
          --bg:       #050507;
          --surface:  #0d0d10;
          --surface2: #131318;
          --border:   rgba(255,255,255,0.06);
          --border2:  rgba(255,255,255,0.12);
          --text:     #f0f0f2;
          --muted:    #6b6b7a;
          --accent:   #e84545;
          --font-display: var(--font-outfit,'Outfit'),sans-serif;
          --font-mono:    var(--font-jetbrains,'JetBrains Mono'),monospace;
          --font-logo:    var(--font-logo,'Orbitron'),sans-serif;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .profile-root {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-display);
          -webkit-font-smoothing: antialiased;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        /* ── BG EFFECTS ── */
        .bg-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .bg-glow {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 50% at 10% 20%, rgba(232,69,69,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 90% 80%, rgba(255,112,67,0.06) 0%, transparent 70%);
        }
        .noise {
          position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }

        /* ── CARD ── */
        .card {
          position: relative; z-index: 2;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 56px 48px;
          text-align: center;
          max-width: 480px; width: 100%;
          box-shadow: 0 32px 80px rgba(0,0,0,0.4);
          animation: floatIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0; transform: translateY(40px);
        }

        @keyframes floatIn {
          to { opacity: 1; transform: translateY(0); }
        }

        .avatar-wrapper {
          width: 120px; height: 120px; margin: 0 auto 32px;
          border-radius: 50%; padding: 4px;
          background: linear-gradient(135deg, var(--accent), transparent);
        }
        .avatar {
          width: 100%; height: 100%; border-radius: 50%;
          object-fit: cover; background: var(--surface2);
        }
        .avatar-placeholder {
          width: 100%; height: 100%; border-radius: 50%;
          background: var(--surface2); display: flex; align-items: center; justify-content: center;
          font-family: var(--font-mono); color: var(--muted); font-size: 2rem;
        }

        .name {
          font-size: 2.2rem; font-weight: 800; letter-spacing: -0.03em;
          margin-bottom: 8px; color: var(--text);
        }
        .role {
          font-family: var(--font-mono); font-size: 0.8rem;
          color: var(--accent); letter-spacing: 0.15em; text-transform: uppercase;
          margin-bottom: 32px;
        }

        .links {
          display: flex; flex-direction: column; gap: 12px;
        }
        .link-btn {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          padding: 16px 24px; background: var(--surface2); border: 1px solid var(--border2);
          color: var(--text); text-decoration: none; font-weight: 600; font-size: 0.9rem;
          border-radius: 12px; transition: all 0.2s;
        }
        .link-btn:hover {
          border-color: var(--accent); background: rgba(232,69,69,0.05); transform: translateY(-2px);
        }

        .powered-by {
          position: fixed; bottom: 32px; left: 0; right: 0; text-align: center;
          font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted); letter-spacing: 0.1em;
          z-index: 2;
        }
        .powered-by a { color: var(--text); text-decoration: none; }
        .powered-by a:hover { color: var(--accent); }
      `}</style>

      {/* Dynamic Background */}
      {bgStyle === "bg-grid" && <div className="bg-grid" />}
      {(bgStyle === "bg-grid" || bgStyle === "bg-glow") && <div className="bg-glow" />}
      {bgStyle === "noise" && <div className="noise" />}

      <div className="card">
        <div className="avatar-wrapper">
          {profile.photoUrl ? (
            <img src={profile.photoUrl} alt={profile.name} className="avatar" />
          ) : (
            <div className="avatar-placeholder">{profile.name.charAt(0)}</div>
          )}
        </div>
        <h1 className="name">{profile.name}</h1>
        {profile.role && <div className="role">{profile.role}</div>}

        <div className="links">
          {profile.telegram && (
            <a href={profile.telegram} target="_blank" rel="noopener noreferrer" className="link-btn">
              ✈ Telegram
            </a>
          )}
          {profile.whatsapp && (
            <a href={profile.whatsapp} target="_blank" rel="noopener noreferrer" className="link-btn">
              💬 WhatsApp
            </a>
          )}
          {profile.instagram && (
            <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="link-btn">
              📷 Instagram
            </a>
          )}
          {profile.facebook && (
            <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className="link-btn">
              📘 Facebook
            </a>
          )}
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="link-btn">
              ⌥ GitHub
            </a>
          )}
          {profile.phone && (
            <a href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`} className="link-btn">
              📞 {profile.phone}
            </a>
          )}
          <a href={`mailto:?subject=Contact%20${profile.name}`} className="link-btn">
            ✉ Contact Me
          </a>
        </div>
      </div>

      <div className="powered-by">
        POWERED BY <a href="https://megadevs.site">MEGA DEVS</a>
      </div>
    </div>
  );
}
