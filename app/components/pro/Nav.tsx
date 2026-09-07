"use client";

import { motion } from "framer-motion";
import { FiGithub } from "react-icons/fi";
import type { Identity } from "./proData";

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "•"
  );
}

export default function Nav({ identity, github }: { identity: Identity; github?: string }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 inset-x-0 z-50 flex justify-center px-4"
    >
      <div className="flex items-center gap-4 sm:gap-6 h-12 pl-3 pr-4 rounded-full
        border border-[var(--border)] bg-[var(--bg-2)]/60 backdrop-blur-xl
        shadow-[0_10px_40px_-12px_rgba(0,0,0,0.7)]">
        {/* monogram */}
        <a href="#" className="flex items-center gap-2 group">
          <span className="grid place-items-center w-8 h-8 rounded-full text-xs font-display font-bold
            bg-gradient-to-br from-[var(--violet)] to-[var(--cyan)] text-[#0a0714]">
            {initials(identity.name)}
          </span>
          <span className="hidden sm:block text-sm text-[var(--muted)] group-hover:text-[var(--text)] transition-colors">
            {identity.name}
          </span>
        </a>

        {github && (
          <>
            <span className="w-px h-5 bg-[var(--border)]" />
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="grid place-items-center w-9 h-9 rounded-full text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/5 transition-colors"
            >
              <FiGithub />
            </a>
          </>
        )}
      </div>
    </motion.nav>
  );
}
