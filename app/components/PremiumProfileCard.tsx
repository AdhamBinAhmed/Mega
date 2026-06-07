"use client";

import { motion } from "framer-motion";
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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
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

  return (
    <>
      <style>{`
        .pc-wrapper {
          position: relative; z-index: 10;
          width: 100%; max-width: 448px;
          padding: 40px 56px; text-align: center;
          border-radius: 40px; border: 1px solid rgba(255,255,255,0.1);
          background: rgba(9, 9, 11, 0.8);
          backdrop-filter: blur(48px); -webkit-backdrop-filter: blur(48px);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.05);
        }
        .pc-wrapper.glass-mode {
          background: rgba(13, 13, 16, 0.4);
          border-color: rgba(255,255,255,0.2);
        }
        .pc-glow-bg {
          position: absolute; inset: 0; border-radius: 40px; pointer-events: none;
          background: linear-gradient(to bottom, rgba(255,255,255,0.03), transparent);
        }

        .pc-avatar-container {
          position: relative; width: 144px; height: 144px; margin: 0 auto 32px;
        }
        .pc-avatar-halo {
          position: absolute; inset: -4px; border-radius: 50%;
          background: linear-gradient(to bottom right, #ef4444, #f97316, transparent);
          opacity: 0.7; filter: blur(8px); transition: opacity 0.5s;
        }
        .pc-avatar-container:hover .pc-avatar-halo {
          opacity: 1; animation: pc-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pc-pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
        
        .pc-avatar-inner {
          position: relative; width: 100%; height: 100%; border-radius: 50%; padding: 4px;
          background: linear-gradient(to bottom right, #ef4444, #18181b);
        }
        .pc-avatar-img {
          width: 100%; height: 100%; object-fit: cover; border-radius: 50%;
          background: #18181b; border: 2px solid rgba(0,0,0,0.5);
        }
        .pc-avatar-placeholder {
          width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
          border-radius: 50%; background: #18181b;
          font-family: monospace; color: #71717a; font-size: 2.25rem; font-weight: 300;
        }

        .pc-name {
          font-size: 2.25rem; font-weight: 800; letter-spacing: -0.025em; margin-bottom: 8px;
          background: linear-gradient(to bottom right, #ffffff, #6b7280);
          -webkit-background-clip: text; color: transparent; text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        @media (min-width: 640px) { .pc-name { font-size: 3rem; } }
        .pc-role {
          font-family: monospace; font-size: 0.75rem; color: #ef4444; font-weight: 500;
          letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 40px;
        }
        @media (min-width: 640px) { .pc-role { font-size: 0.875rem; } }

        .pc-links { display: flex; flex-direction: column; gap: 12px; }
        .pc-link-btn {
          display: flex; align-items: center; gap: 16px; padding: 16px 24px;
          background: rgba(24, 24, 27, 0.8); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; color: #fff;
          font-weight: 600; font-size: 0.875rem; text-decoration: none; transition: all 0.3s;
        }
        .pc-link-icon { font-size: 1.125rem; transition: transform 0.3s; }
        .pc-link-label { flex: 1; text-align: center; letter-spacing: 0.025em; }
        .pc-link-arrow { width: 20px; opacity: 0; color: #9ca3af; transition: all 0.3s; transform: translateX(-4px); }
        
        .pc-link-btn:hover .pc-link-icon { transform: scale(1.1) rotate(-12deg); }
        .pc-link-btn:hover .pc-link-arrow { opacity: 1; transform: translateX(4px); }

        .btn-tg:hover { border-color: rgba(96, 165, 250, 0.5); background: rgba(59, 130, 246, 0.1); box-shadow: 0 0 20px rgba(59,130,246,0.15); color: #60a5fa; }
        .btn-wa:hover { border-color: rgba(74, 222, 128, 0.5); background: rgba(34, 197, 94, 0.1); box-shadow: 0 0 20px rgba(34,197,94,0.15); color: #4ade80; }
        .btn-ig:hover { border-color: rgba(244, 114, 182, 0.5); background: rgba(236, 72, 153, 0.1); box-shadow: 0 0 20px rgba(236,72,153,0.15); color: #f472b6; }
        .btn-fb:hover { border-color: rgba(37, 99, 235, 0.5); background: rgba(37, 99, 235, 0.1); box-shadow: 0 0 20px rgba(37,99,235,0.15); color: #3b82f6; }
        .btn-gh:hover { border-color: rgba(156, 163, 175, 0.5); background: rgba(107, 114, 128, 0.1); box-shadow: 0 0 20px rgba(156,163,175,0.15); color: #d1d5db; }
        .btn-ph:hover { border-color: rgba(129, 140, 248, 0.5); background: rgba(99, 102, 241, 0.1); box-shadow: 0 0 20px rgba(99,102,241,0.15); color: #818cf8; }

        .pc-gmail-wrapper { margin-top: 32px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.1); position: relative; }
        .pc-gmail-line { position: absolute; top: 0; left: 50%; transform: translate(-50%, -50%); width: 50%; height: 1px; background: linear-gradient(to right, transparent, rgba(239,68,68,0.5), transparent); }
        .pc-gmail-label { font-size: 10px; color: #9ca3af; margin-bottom: 16px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; font-family: monospace; }
        
        .pc-gmail-card {
          display: flex; align-items: center; justify-content: space-between; padding: 8px 8px 8px 24px;
          background: linear-gradient(to right, rgba(239,68,68,0.1), rgba(24,24,27,0.5), transparent);
          border: 1px solid rgba(239,68,68,0.2); border-radius: 16px; text-decoration: none; position: relative; overflow: hidden;
          transition: all 0.3s;
        }
        .pc-gmail-card:hover { border-color: rgba(239,68,68,0.5); box-shadow: 0 0 30px rgba(239,68,68,0.2); }
        .pc-gmail-shimmer { position: absolute; inset: 0; transform: translateX(-100%); background: linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent); pointer-events: none; }
        .pc-gmail-card:hover .pc-gmail-shimmer { animation: pc-shimmer 1.5s infinite; }
        @keyframes pc-shimmer { 100% { transform: translateX(100%); } }

        .pc-gmail-col { display: flex; flex-direction: column; text-align: left; z-index: 10; }
        .pc-gmail-title { color: #fff; font-weight: 700; font-size: 0.875rem; letter-spacing: 0.025em; }
        .pc-gmail-address { color: rgba(248,113,113,0.8); font-size: 0.75rem; font-family: monospace; margin-top: 2px; max-width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        
        .pc-gmail-icon {
          width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; z-index: 10;
          background: linear-gradient(to bottom right, #ef4444, #ea580c); color: #fff; border-radius: 12px;
          box-shadow: 0 0 15px rgba(239,68,68,0.5); transition: transform 0.3s;
        }
        .pc-gmail-card:hover .pc-gmail-icon { transform: scale(1.1) rotate(12deg); }
        .pc-gmail-icon svg { width: 20px; height: 20px; }
      `}</style>

      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`pc-wrapper ${bgStyle === "bg-glass" ? "glass-mode" : ""}`}
      >
        <div className="pc-glow-bg" />

        <motion.div 
          variants={containerVariants as any}
          initial="hidden"
          animate="visible"
          style={{ position: "relative", zIndex: 10 }}
        >
          {/* Avatar Section */}
          <motion.div variants={itemVariants as any} className="pc-avatar-container">
            <div className="pc-avatar-halo" />
            
            <div className="pc-avatar-inner">
              {profile.photoUrl ? (
                <img 
                  src={profile.photoUrl} 
                  alt={profile.name} 
                  className="pc-avatar-img" 
                />
              ) : (
                <div className="pc-avatar-placeholder">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div variants={itemVariants as any}>
            <h1 className="pc-name">{profile.name}</h1>
            {profile.role && <div className="pc-role">{profile.role}</div>}
          </motion.div>

          {/* Standard Links */}
          <motion.div variants={itemVariants as any} className="pc-links">
            {profile.telegram && <SocialButton href={profile.telegram} icon="✈" label="Telegram" btnClass="btn-tg" />}
            {profile.whatsapp && <SocialButton href={profile.whatsapp} icon="💬" label="WhatsApp" btnClass="btn-wa" />}
            {profile.instagram && <SocialButton href={profile.instagram} icon="📷" label="Instagram" btnClass="btn-ig" />}
            {profile.facebook && <SocialButton href={profile.facebook} icon="📘" label="Facebook" btnClass="btn-fb" />}
            {profile.github && <SocialButton href={profile.github} icon="⌥" label="GitHub" btnClass="btn-gh" />}
            {profile.phone && <SocialButton href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`} icon="📞" label={profile.phone} btnClass="btn-ph" />}
          </motion.div>

          {/* Premium Gmail Section */}
          {profile.gmail && (
            <motion.div variants={itemVariants as any} className="pc-gmail-wrapper">
              <div className="pc-gmail-line" />
              <p className="pc-gmail-label">Get In Touch</p>
              
              <motion.a 
                href={`mailto:${profile.gmail}?subject=Contact%20${profile.name}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pc-gmail-card"
              >
                <div className="pc-gmail-shimmer" />

                <div className="pc-gmail-col">
                  <span className="pc-gmail-title">Drop an Email</span>
                  <span className="pc-gmail-address">{profile.gmail}</span>
                </div>
                <div className="pc-gmail-icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </motion.a>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}

// Reusable micro-component for social buttons
function SocialButton({ href, icon, label, btnClass }: { href: string, icon: string, label: string, btnClass: string }) {
  return (
    <motion.a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`pc-link-btn ${btnClass}`}
    >
      <span className="pc-link-icon">{icon}</span>
      <span className="pc-link-label">{label}</span>
      <span className="pc-link-arrow">→</span>
    </motion.a>
  );
}
