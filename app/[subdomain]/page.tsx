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
        
        /* ── NEW DESIGNS ── */
        .bg-aurora {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: linear-gradient(45deg, rgba(232,69,69,0.08), rgba(69,232,204,0.08), rgba(118,69,232,0.08));
          background-size: 400% 400%;
          animation: auroraAnim 15s ease infinite;
        }
        @keyframes auroraAnim { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        
        .bg-cyber {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: 
            linear-gradient(rgba(0, 255, 204, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 204, 0.05) 1px, transparent 1px);
          background-size: 30px 30px;
          box-shadow: inset 0 0 100px rgba(0, 255, 204, 0.1);
        }

        .bg-stars {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: 
            radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 50px 160px, #ddd, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 90px 40px, #fff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 200px 200px;
          animation: starsAnim 5s linear infinite alternate;
        }
        @keyframes starsAnim { 0% { opacity: 0.3; } 100% { opacity: 1; } }

        .bg-holo {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(69, 218, 232, 0.05) 2px, rgba(69, 218, 232, 0.05) 4px);
        }

        .bg-glass-orbs {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: 
            radial-gradient(circle at 15% 50%, rgba(232,69,69,0.15), transparent 40%),
            radial-gradient(circle at 85% 30%, rgba(69,134,232,0.15), transparent 40%);
        }
        .glass-card {
          background: rgba(13, 13, 16, 0.5) !important;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.1) !important;
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        
        @keyframes floatIn {
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float-in {
          animation: floatIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0; transform: translateY(40px);
        }
      `}</style>

      {/* Dynamic Background */}
      {bgStyle === "bg-grid" && <div className="bg-grid" />}
      {(bgStyle === "bg-grid" || bgStyle === "bg-glow") && <div className="bg-glow" />}
      {bgStyle === "noise" && <div className="noise" />}
      {bgStyle === "bg-aurora" && <div className="bg-aurora" />}
      {bgStyle === "bg-cyber" && <div className="bg-cyber" />}
      {bgStyle === "bg-stars" && <div className="bg-stars" />}
      {bgStyle === "bg-holo" && <div className="bg-holo" />}
      {bgStyle === "bg-glass" && <div className="bg-glass-orbs" />}

      <div className={`relative z-10 w-full max-w-md p-10 sm:p-14 text-center rounded-[32px] border border-white/10 bg-[#0d0d10]/90 backdrop-blur-2xl shadow-2xl shadow-black/50 animate-float-in ${bgStyle === "bg-glass" ? "glass-card" : ""}`}>
        
        {/* Avatar */}
        <div className="w-32 h-32 mx-auto mb-8 rounded-full p-1 bg-gradient-to-br from-red-500 to-transparent">
          {profile.photoUrl ? (
            <img src={profile.photoUrl} alt={profile.name} className="w-full h-full object-cover rounded-full bg-[#131318]" />
          ) : (
            <div className="w-full h-full flex items-center justify-center rounded-full bg-[#131318] font-mono text-gray-500 text-3xl">
              {profile.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Info */}
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
          {profile.name}
        </h1>
        {profile.role && (
          <div className="font-mono text-xs text-red-500 tracking-[0.2em] uppercase mb-10">
            {profile.role}
          </div>
        )}

        {/* Links */}
        <div className="flex flex-col gap-3">
          {profile.telegram && (
            <a href={profile.telegram} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center gap-3 px-6 py-4 bg-[#131318] border border-white/10 rounded-2xl text-white font-semibold text-sm transition-all duration-300 hover:border-red-500/50 hover:bg-red-500/5 hover:-translate-y-1">
              ✈ Telegram
            </a>
          )}
          {profile.whatsapp && (
            <a href={profile.whatsapp} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center gap-3 px-6 py-4 bg-[#131318] border border-white/10 rounded-2xl text-white font-semibold text-sm transition-all duration-300 hover:border-green-500/50 hover:bg-green-500/5 hover:-translate-y-1">
              💬 WhatsApp
            </a>
          )}
          {profile.instagram && (
            <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center gap-3 px-6 py-4 bg-[#131318] border border-white/10 rounded-2xl text-white font-semibold text-sm transition-all duration-300 hover:border-pink-500/50 hover:bg-pink-500/5 hover:-translate-y-1">
              📷 Instagram
            </a>
          )}
          {profile.facebook && (
            <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center gap-3 px-6 py-4 bg-[#131318] border border-white/10 rounded-2xl text-white font-semibold text-sm transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-500/5 hover:-translate-y-1">
              📘 Facebook
            </a>
          )}
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center gap-3 px-6 py-4 bg-[#131318] border border-white/10 rounded-2xl text-white font-semibold text-sm transition-all duration-300 hover:border-gray-400 hover:bg-gray-500/5 hover:-translate-y-1">
              ⌥ GitHub
            </a>
          )}
          {profile.phone && (
            <a href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`} className="group flex items-center justify-center gap-3 px-6 py-4 bg-[#131318] border border-white/10 rounded-2xl text-white font-semibold text-sm transition-all duration-300 hover:border-white/30 hover:bg-white/5 hover:-translate-y-1">
              📞 {profile.phone}
            </a>
          )}

          {/* Premium Gmail Section */}
          {profile.gmail && (
            <div className="mt-4 pt-6 border-t border-white/10">
              <p className="text-xs text-gray-400 mb-4 font-medium tracking-wide uppercase">Get In Touch</p>
              <a href={`mailto:${profile.gmail}?subject=Contact%20${profile.name}`} className="flex items-center justify-between p-1 pl-6 bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20 rounded-2xl group transition-all duration-300 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                <div className="flex flex-col text-left">
                  <span className="text-white font-bold text-sm tracking-wide">Email Me on Gmail</span>
                  <span className="text-red-400/80 text-xs truncate max-w-[180px] font-mono mt-0.5">{profile.gmail}</span>
                </div>
                <div className="w-12 h-12 flex items-center justify-center bg-red-500 text-white rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                  ✉
                </div>
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-8 left-0 right-0 text-center font-mono text-[0.65rem] text-gray-500 tracking-[0.1em] z-10">
        POWERED BY <a href="https://megadevs.site" className="text-gray-300 hover:text-red-500 transition-colors">MEGA DEVS</a>
      </div>
    </div>
  );
}
