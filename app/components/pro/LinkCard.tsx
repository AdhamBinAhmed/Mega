"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowUpRight, FiArrowRight } from "react-icons/fi";
import TiltCard from "./TiltCard";
import type { LinkNode } from "./proData";
import { safeUrl } from "../../lib/sanitizeUrl";

const ease = [0.22, 1, 0.36, 1] as const;

export default function LinkCard({
  node,
  index,
  featured,
}: {
  node: LinkNode;
  index: number;
  featured?: boolean;
}) {
  const Icon = node.icon;
  const accent = `var(${node.accent})`;

  const inner = (
    <TiltCard
      className={`h-full rounded-3xl border border-[var(--border)] bg-[var(--panel)]
        backdrop-blur-xl overflow-hidden
        transition-colors duration-300 hover:border-[var(--border-strong)]
        ${featured ? "min-h-[220px]" : "min-h-[150px]"}`}
    >
      {/* accent wash */}
      <div
        className="absolute inset-0 opacity-0 group-hover/tilt:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(120% 120% at 100% 0%, ${accent}22, transparent 60%)`,
        }}
      />

      <div
        className="relative h-full p-6 sm:p-7 flex flex-col"
        style={{ transform: "translateZ(40px)" }}
      >
        <div className="flex items-start justify-between">
          <span
            className="grid place-items-center w-12 h-12 rounded-2xl border border-[var(--border)]
              bg-white/5 text-xl transition-transform duration-300 group-hover/tilt:scale-110"
            style={{ color: accent, boxShadow: `0 8px 30px -10px ${accent}` }}
          >
            <Icon />
          </span>
          <span className="text-[var(--dim)] group-hover/tilt:text-[var(--text)] transition-colors text-lg">
            {node.internal ? <FiArrowRight /> : <FiArrowUpRight />}
          </span>
        </div>

        <div className="mt-auto pt-6">
          <h3 className="text-xl font-semibold text-[var(--text)]">
            {node.label}
          </h3>
          <p className="text-sm text-[var(--muted)] mt-1">{node.detail}</p>
        </div>
      </div>
    </TiltCard>
  );

  const wrapper = "block h-full scene";
  const body = (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.07, ease }}
      className="h-full"
    >
      {inner}
    </motion.div>
  );

  const href = safeUrl(node.href);

  return node.internal ? (
    <Link href={href} className={wrapper}>
      {body}
    </Link>
  ) : (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className={wrapper}
    >
      {body}
    </a>
  );
}
