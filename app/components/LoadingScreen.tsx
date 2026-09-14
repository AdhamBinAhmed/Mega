"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    let finished = false;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        const remaining = 90 - prev;
        return Math.min(90, prev + Math.max(0.5, remaining * 0.04));
      });
    }, 30);

    const finish = () => {
      if (finished) return;
      finished = true;
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        document.body.style.overflow = "";
      }, 1200);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener("load", finish);
      document.body.style.overflow = "";
    };
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          background: "#0c0b0f",
        }}
      />
    );
  }

  // Letter-by-letter stagger for the wordmark
  const letters = "MEGA".split("");

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "#0c0b0f",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "40px",
          }}
        >
          {/* Wordmark with staggered letter reveal */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "2px",
            }}
          >
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1 + 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  fontFamily: "var(--font-space-grotesk, 'Space Grotesk'), sans-serif",
                  fontSize: "clamp(2.4rem, 8vw, 4rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.06em",
                  color: "#f8f7fa",
                  display: "inline-block",
                }}
              >
                {letter}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.7, ease: "backOut" }}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#ef4444",
                display: "inline-block",
                marginLeft: "4px",
                marginBottom: "6px",
              }}
            />
          </div>

          {/* Thin progress line */}
          <div
            style={{
              width: "min(200px, 50vw)",
              height: "1px",
              background: "rgba(255,255,255,0.08)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                background: "#ef4444",
                transformOrigin: "left",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progress / 100 }}
              transition={{ duration: 0.15, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
