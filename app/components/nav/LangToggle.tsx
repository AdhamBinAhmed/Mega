"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "../../lib/i18n";

/** EN ⇄ العربية switch (text label by design — it names the target language). */
export default function LangToggle({ className = "mnav-icon mnav-lang" }: { className?: string }) {
  const { lang, toggle } = useLang();
  return (
    <motion.button
      onClick={toggle}
      className={className}
      aria-label="Switch language"
      title={lang === "ar" ? "English" : "العربية"}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.85, rotate: -8 }}
      style={{ perspective: 400, overflow: "hidden" }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={lang}
          initial={{ rotateY: -90, opacity: 0, y: 4 }}
          animate={{ rotateY: 0, opacity: 1, y: 0 }}
          exit={{ rotateY: 90, opacity: 0, y: -4 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "inline-block" }}
        >
          {lang === "ar" ? "EN" : "ع"}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
