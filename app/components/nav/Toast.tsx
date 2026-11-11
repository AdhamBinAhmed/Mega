"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon } from "@solar-icons/react/linear";
import LiquidGlass from "../LiquidGlass";

/**
 * Global toast. The aria-live region is ALWAYS mounted (screen readers only
 * announce content changes inside an existing live region).
 */
export default function Toast({ message }: { message: string | null }) {
  return (
    <div aria-live="polite" role="status">
      <AnimatePresence>
        {message && (
          <motion.div
            className="mnav-toast-pos"
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            transition={{ type: "spring", damping: 24, stiffness: 200 }}
          >
            <LiquidGlass variant="floating" radius={999} className="mnav-toast">
              <CheckCircleIcon size={16} style={{ color: "var(--ok)" }} />
              <span>{message}</span>
            </LiquidGlass>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
