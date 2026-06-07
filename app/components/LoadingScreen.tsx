"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Disable scrolling while loading
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    // Progress counter logic
    const duration = 1200;
    const intervalTime = 20; // update every 20ms
    const totalSteps = duration / intervalTime;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const currentProgress = Math.min(Math.round((step / totalSteps) * 100), 100);
      setProgress(currentProgress);
    }, intervalTime);

    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "";
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  // Prevent hydration mismatch by not rendering until mounted if necessary,
  // but since we want it immediately, we can render it.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          background: "#050507", // Fallback background
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    );
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "var(--bg, #050507)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text, #f0f0f2)",
            fontFamily: "var(--font-mono, monospace)"
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              gap: "32px",
              width: "100%",
              maxWidth: "300px"
            }}
          >
            {/* Spinning Rings */}
            <div style={{ position: "relative", width: "100px", height: "100px" }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute",
                  inset: 0,
                  border: "2px solid rgba(255,255,255,0.05)",
                  borderTopColor: "var(--accent, #e84545)",
                  borderRadius: "50%"
                }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute",
                  inset: "15px",
                  border: "2px solid rgba(255,255,255,0.05)",
                  borderBottomColor: "var(--accent2, #ff7043)",
                  borderRadius: "50%"
                }}
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute",
                  inset: "30px",
                  border: "1px dashed rgba(255,255,255,0.1)",
                  borderRadius: "50%"
                }}
              />
              <div style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                color: "var(--accent, #e84545)"
              }}>
                ◈
              </div>
            </div>

            {/* Text & Counter */}
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center",
              gap: "12px",
              width: "100%"
            }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                width: "100%",
                fontSize: "12px",
                letterSpacing: "0.15em",
                color: "var(--muted, #6b6b7a)"
              }}>
                <span>SYSTEM</span>
                <span>{progress}%</span>
              </div>
              
              {/* Progress Bar */}
              <div style={{
                width: "100%",
                height: "2px",
                background: "rgba(255,255,255,0.1)",
                position: "relative",
                overflow: "hidden"
              }}>
                <motion.div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(90deg, var(--accent, #e84545), var(--accent2, #ff7043))",
                    transformOrigin: "left",
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: progress / 100 }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              </div>

              <motion.div 
                style={{ 
                  fontSize: "10px", 
                  letterSpacing: "0.2em",
                  color: "var(--accent, #e84545)",
                  marginTop: "8px"
                }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                INITIALIZING WORKSPACE...
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
