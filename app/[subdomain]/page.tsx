import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { notFound } from "next/navigation";
import Image from "next/image";
import PremiumProfileCard from "../components/PremiumProfileCard";

export const revalidate = 60; // optionally revalidate every 60 seconds

export default async function SubdomainProfilePage({ params }: { params: { subdomain: string } }) {
  const { subdomain } = await params;
  const docRef = doc(db, "profiles", subdomain);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    notFound();
  }

  const profile = docSnap.data() as any;
  const theme = "dark"; // Defaulting profiles to dark theme for consistency
  const bgStyle = profile.backgroundStyle || "bg-grid";

  return (
    <div className="min-h-screen relative overflow-x-hidden pt-12 pb-24 px-4 sm:px-6" data-theme={theme}>
      {/* Background CSS Definitions */}
      <style>{`
        .bg-grid {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .bg-glow {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 50% at 10% 20%, rgba(232,69,69,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 90% 80%, rgba(255,112,67,0.06) 0%, transparent 70%);
        }
        .noise {
          position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }
        .bg-aurora {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background: linear-gradient(45deg, rgba(232,69,69,0.08), rgba(69,232,204,0.08), rgba(118,69,232,0.08));
          background-size: 400% 400%;
          animation: auroraAnim 15s ease infinite;
        }
        @keyframes auroraAnim { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        
        .bg-cyber {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image: 
            linear-gradient(rgba(0, 255, 204, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 204, 0.05) 1px, transparent 1px);
          background-size: 30px 30px;
          box-shadow: inset 0 0 100px rgba(0, 255, 204, 0.1);
        }

        .bg-stars {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
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
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(69, 218, 232, 0.05) 2px, rgba(69, 218, 232, 0.05) 4px);
        }

        .bg-glass-orbs {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background: 
            radial-gradient(circle at 15% 50%, rgba(232,69,69,0.15), transparent 40%),
            radial-gradient(circle at 85% 30%, rgba(69,134,232,0.15), transparent 40%);
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

      {/* Premium UI Component */}
      <PremiumProfileCard profile={profile} bgStyle={bgStyle} />

      {/* Footer */}
      <div className="fixed bottom-8 left-0 right-0 text-center font-mono text-[0.65rem] text-gray-500 tracking-[0.1em] z-10">
        POWERED BY <a href="https://megadevs.site" className="text-gray-300 hover:text-white transition-colors duration-300">MEGA DEVS</a>
      </div>
    </div>
  );
}
