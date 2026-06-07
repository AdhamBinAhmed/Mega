"use client";

import { motion } from "framer-motion";

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
  const themeColor = profile.themeColor || "blue";
  const isGlassy = profile.glassyEffect !== undefined ? profile.glassyEffect : true;

  const themeColors: Record<string, { halo: string, hoverBorder: string }> = {
    blue: { halo: "rgba(59,130,246,0.6) 0%, rgba(99,102,241,0.3) 50%", hoverBorder: "rgba(59,130,246,0.4)" },
    purple: { halo: "rgba(168,85,247,0.6) 0%, rgba(217,70,239,0.3) 50%", hoverBorder: "rgba(168,85,247,0.4)" },
    emerald: { halo: "rgba(16,185,129,0.6) 0%, rgba(52,211,153,0.3) 50%", hoverBorder: "rgba(16,185,129,0.4)" },
    rose: { halo: "rgba(244,63,94,0.6) 0%, rgba(251,113,133,0.3) 50%", hoverBorder: "rgba(244,63,94,0.4)" },
    amber: { halo: "rgba(245,158,11,0.6) 0%, rgba(252,211,77,0.3) 50%", hoverBorder: "rgba(245,158,11,0.4)" },
    slate: { halo: "rgba(148,163,184,0.6) 0%, rgba(203,213,225,0.3) 50%", hoverBorder: "rgba(148,163,184,0.4)" },
  };
  const activeTheme = themeColors[themeColor] || themeColors.blue;

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
    <div style={{
      '--theme-halo': `radial-gradient(circle, ${activeTheme.halo}, transparent 70%)`,
      '--theme-hover-border': activeTheme.hoverBorder,
    } as React.CSSProperties}>
      <style>{`
        /* ── GLOBAL WIDE LAYOUT ── */
        .glass-container {
          position: relative; z-index: 10;
          width: 100%; max-width: 600px;
          margin: 0 auto; padding: 40px 16px 80px;
          text-align: center;
        }

        /* ── AVATAR ── */
        .glass-avatar-wrapper {
          position: relative; width: 140px; height: 140px; margin: 0 auto 24px;
        }
        .glass-avatar-halo {
          position: absolute; inset: -15px; border-radius: 50%;
          background: var(--theme-halo);
          filter: blur(15px); animation: halo-pulse 4s ease-in-out infinite alternate;
          z-index: 0;
        }
        @keyframes halo-pulse { 0% { transform: scale(0.9); opacity: 0.6; } 100% { transform: scale(1.1); opacity: 1; } }
        
        .glass-avatar-inner {
          position: relative; width: 100%; height: 100%; border-radius: 50%;
          border: 3px solid rgba(255,255,255,0.8); box-shadow: 0 0 20px rgba(0,0,0,0.5);
          overflow: hidden; z-index: 1; background: #0f172a;
        }
        .glass-avatar-img {
          width: 100%; height: 100%; object-fit: cover;
        }
        .glass-avatar-placeholder {
          width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
          font-family: sans-serif; color: #fff; font-size: 3rem; font-weight: 700;
        }

        /* ── INFO ── */
        .glass-name {
          font-size: 2.5rem; font-weight: 800; color: #fff; margin-bottom: 8px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5); letter-spacing: -0.02em;
        }
        .glass-role {
          font-size: 1rem; color: #94a3b8; font-weight: 500; margin-bottom: 40px;
        }

        /* ── BUTTON LINKS ── */
        .glass-links {
          display: flex; flex-direction: column; gap: 16px;
        }
        .glass-btn {
          display: flex; align-items: center; gap: 16px;
          width: 100%; padding: 12px 20px;
          border-radius: 24px;
          text-decoration: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        
        /* Glassy vs Solid Toggle */
        .glass-btn.style-glassy {
          background: rgba(30, 41, 59, 0.4);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.05);
        }
        .glass-btn.style-solid {
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: none; -webkit-backdrop-filter: none;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .glass-btn:hover {
          background: rgba(30, 41, 59, 0.7);
          border-color: var(--theme-hover-border);
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.4);
        }

        /* ── BUTTON INTERNAL LAYOUT ── */
        .glass-btn-icon-wrapper {
          width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;
          border-radius: 14px; font-size: 1.5rem; color: #fff; flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }
        .glass-btn-content {
          flex: 1; display: flex; flex-direction: column; align-items: flex-start; text-align: left;
        }
        .glass-btn-title {
          color: #fff; font-size: 1rem; font-weight: 700; margin-bottom: 2px;
        }
        .glass-btn-subtitle {
          color: #94a3b8; font-size: 0.75rem; font-weight: 400;
        }
        .glass-btn-arrow {
          color: #64748b; font-size: 1.25rem; font-weight: 300; transition: color 0.3s, transform 0.3s;
        }
        .glass-btn:hover .glass-btn-arrow {
          color: #fff; transform: translate(2px, -2px);
        }

        /* Icon Background Colors */
        .icon-tg { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .icon-wa { background: linear-gradient(135deg, #22c55e, #16a34a); }
        .icon-ig { background: linear-gradient(135deg, #ec4899, #db2777); }
        .icon-fb { background: linear-gradient(135deg, #1877f2, #1d4ed8); }
        .icon-gh { background: linear-gradient(135deg, #333333, #000000); }
        .icon-ph { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }
        .icon-gm { background: linear-gradient(135deg, #ef4444, #dc2626); }

        /* ── DIVIDER ── */
        .glass-divider {
          display: flex; align-items: center; justify-content: center; margin: 40px 0 24px;
        }
        .glass-divider-line {
          height: 1px; flex: 1; background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);
        }
        .glass-divider-text {
          color: #64748b; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.2em;
          text-transform: uppercase; padding: 0 16px;
        }
      `}</style>

      <div className="glass-container">
        <motion.div 
          variants={containerVariants as any}
          initial="hidden"
          animate="visible"
        >
          {/* Avatar Section */}
          <motion.div variants={itemVariants as any} className="glass-avatar-wrapper">
            <div className="glass-avatar-halo" />
            <div className="glass-avatar-inner">
              {profile.photoUrl ? (
                <img src={profile.photoUrl} alt={profile.name} className="glass-avatar-img" />
              ) : (
                <div className="glass-avatar-placeholder">{profile.name.charAt(0)}</div>
              )}
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div variants={itemVariants as any}>
            <h1 className="glass-name">{profile.name}</h1>
            {profile.role && <p className="glass-role">{profile.role}</p>}
          </motion.div>

          {/* Links Section */}
          <motion.div variants={itemVariants as any} className="glass-links">
            {profile.telegram && <SocialButton href={profile.telegram} icon="✈" bgClass="icon-tg" title="Telegram" subtitle="Chat with me on Telegram" isGlassy={isGlassy} />}
            {profile.whatsapp && <SocialButton href={profile.whatsapp} icon="💬" bgClass="icon-wa" title="WhatsApp" subtitle="Send me a message" isGlassy={isGlassy} />}
            {profile.instagram && <SocialButton href={profile.instagram} icon="📷" bgClass="icon-ig" title="Instagram" subtitle="Follow my journey" isGlassy={isGlassy} />}
            {profile.facebook && <SocialButton href={profile.facebook} icon="📘" bgClass="icon-fb" title="Facebook" subtitle="Connect with me" isGlassy={isGlassy} />}
            {profile.github && <SocialButton href={profile.github} icon="⌥" bgClass="icon-gh" title="GitHub" subtitle="View my open source projects" isGlassy={isGlassy} />}
            {profile.phone && <SocialButton href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`} icon="📞" bgClass="icon-ph" title="Call Now" subtitle={profile.phone} isGlassy={isGlassy} />}
          </motion.div>

          {/* Direct Contact Section */}
          {profile.gmail && (
            <motion.div variants={itemVariants as any}>
              <div className="glass-divider">
                <div className="glass-divider-line" />
                <div className="glass-divider-text">Direct Contact</div>
                <div className="glass-divider-line" />
              </div>
              
              <SocialButton 
                href={`mailto:${profile.gmail}?subject=Contact%20${profile.name}`} 
                icon="✉" 
                bgClass="icon-gm" 
                title="Email Me" 
                subtitle={profile.gmail} 
                isGlassy={isGlassy}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Reusable micro-component for wide glassy buttons
function SocialButton({ href, icon, title, subtitle, bgClass, isGlassy }: { href: string, icon: string, title: string, subtitle: string, bgClass: string, isGlassy: boolean }) {
  return (
    <motion.a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`glass-btn ${isGlassy ? 'style-glassy' : 'style-solid'}`}
    >
      <div className={`glass-btn-icon-wrapper ${bgClass}`}>
        {icon}
      </div>
      <div className="glass-btn-content">
        <span className="glass-btn-title">{title}</span>
        <span className="glass-btn-subtitle">{subtitle}</span>
      </div>
      <div className="glass-btn-arrow">↗</div>
    </motion.a>
  );
}
