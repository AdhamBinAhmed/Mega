"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";

// Define the shape of the profile data based on Firebase structure
interface Profile {
  name: string;
  role?: string;
  photoUrl?: string;
  telegram?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  github?: string;
  phone?: string;
  gmail?: string;
  [key: string]: any;
}

export default function PremiumProfileCard({ profile, bgStyle }: { profile: Profile, bgStyle: string }) {
  // Animation variants for staggering children
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  // Helper for generating dynamic colors for social buttons
  const getSocialColor = (type: string) => {
    switch (type) {
      case "telegram": return "group-hover:border-blue-400/50 group-hover:bg-blue-500/10 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] text-blue-400";
      case "whatsapp": return "group-hover:border-green-400/50 group-hover:bg-green-500/10 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] text-green-400";
      case "instagram": return "group-hover:border-pink-400/50 group-hover:bg-pink-500/10 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.15)] text-pink-400";
      case "facebook": return "group-hover:border-blue-600/50 group-hover:bg-blue-600/10 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.15)] text-blue-500";
      case "github": return "group-hover:border-gray-400/50 group-hover:bg-gray-500/10 group-hover:shadow-[0_0_20px_rgba(156,163,175,0.15)] text-gray-300";
      case "phone": return "group-hover:border-indigo-400/50 group-hover:bg-indigo-500/10 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] text-indigo-400";
      default: return "group-hover:border-white/30 group-hover:bg-white/5";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`relative z-10 w-full max-w-md p-10 sm:p-14 text-center rounded-[2.5rem] border border-white/10 bg-[#09090b]/80 backdrop-blur-3xl shadow-2xl shadow-black/80 ring-1 ring-white/5 ${bgStyle === "bg-glass" ? "bg-[#0d0d10]/40 border-white/20" : ""}`}
    >
      {/* Dynamic Glow Behind Card Content */}
      <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        {/* Avatar Section */}
        <motion.div variants={itemVariants} className="relative w-36 h-36 mx-auto mb-8 group">
          {/* Animated Halo */}
          <div className="absolute inset-[-4px] rounded-full bg-gradient-to-br from-red-500 via-orange-500 to-transparent opacity-70 group-hover:opacity-100 blur-md transition-opacity duration-500 group-hover:animate-pulse" />
          
          <div className="relative w-full h-full rounded-full p-1 bg-gradient-to-br from-red-500 to-[#18181b]">
            {profile.photoUrl ? (
              <img 
                src={profile.photoUrl} 
                alt={profile.name} 
                className="w-full h-full object-cover rounded-full bg-[#18181b] ring-2 ring-black/50" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center rounded-full bg-[#18181b] font-mono text-gray-500 text-4xl font-light">
                {profile.name.charAt(0)}
              </div>
            )}
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div variants={itemVariants} className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 mb-2 drop-shadow-sm">
            {profile.name}
          </h1>
          {profile.role && (
            <div className="font-mono text-xs sm:text-sm text-red-500 font-medium tracking-[0.25em] uppercase">
              {profile.role}
            </div>
          )}
        </motion.div>

        {/* Standard Links */}
        <motion.div variants={itemVariants} className="flex flex-col gap-3">
          {profile.telegram && (
            <SocialButton href={profile.telegram} icon="✈" label="Telegram" colors={getSocialColor('telegram')} />
          )}
          {profile.whatsapp && (
            <SocialButton href={profile.whatsapp} icon="💬" label="WhatsApp" colors={getSocialColor('whatsapp')} />
          )}
          {profile.instagram && (
            <SocialButton href={profile.instagram} icon="📷" label="Instagram" colors={getSocialColor('instagram')} />
          )}
          {profile.facebook && (
            <SocialButton href={profile.facebook} icon="📘" label="Facebook" colors={getSocialColor('facebook')} />
          )}
          {profile.github && (
            <SocialButton href={profile.github} icon="⌥" label="GitHub" colors={getSocialColor('github')} />
          )}
          {profile.phone && (
            <SocialButton href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`} icon="📞" label={profile.phone} colors={getSocialColor('phone')} />
          )}
        </motion.div>

        {/* Premium Gmail Section */}
        {profile.gmail && (
          <motion.div variants={itemVariants} className="mt-8 pt-8 border-t border-white/10 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
            
            <p className="text-[10px] text-gray-400 mb-4 font-bold tracking-[0.2em] uppercase font-mono">
              Get In Touch
            </p>
            
            <motion.a 
              href={`mailto:${profile.gmail}?subject=Contact%20${profile.name}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-between p-2 pl-6 bg-gradient-to-r from-red-500/10 via-[#18181b]/50 to-transparent border border-red-500/20 rounded-2xl group transition-all duration-300 hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] overflow-hidden relative"
            >
              {/* Shine effect on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

              <div className="flex flex-col text-left z-10">
                <span className="text-white font-bold text-sm tracking-wide">Drop an Email</span>
                <span className="text-red-400/80 text-xs truncate max-w-[180px] font-mono mt-0.5">{profile.gmail}</span>
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-red-500 to-orange-600 text-white rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.5)] z-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </motion.a>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

// Reusable micro-component for social buttons
function SocialButton({ href, icon, label, colors }: { href: string, icon: string, label: string, colors: string }) {
  return (
    <motion.a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group flex items-center gap-4 px-6 py-4 bg-[#18181b]/80 backdrop-blur-md border border-white/10 rounded-2xl text-white font-semibold text-sm transition-colors duration-300 ${colors}`}
    >
      <span className={`text-lg transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110`}>{icon}</span>
      <span className="flex-1 text-center tracking-wide">{label}</span>
      <span className="w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-gray-400">→</span>
    </motion.a>
  );
}
