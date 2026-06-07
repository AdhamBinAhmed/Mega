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
