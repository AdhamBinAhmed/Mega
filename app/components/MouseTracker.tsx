"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MouseTracker() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Mouse position
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring configuration for the trailing circle
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    setIsMounted(true);

    // Only enable on desktop/devices with a mouse
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isMounted) return null;
  
  if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Inner dot */}
      <motion.div
        style={{
          position: "fixed",
          left: cursorX,
          top: cursorY,
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "var(--color-accent)",
          pointerEvents: "none",
          zIndex: 9999,
          x: "-50%",
          y: "-50%",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      />
      {/* Outer trailing circle */}
      <motion.div
        style={{
          position: "fixed",
          left: cursorXSpring,
          top: cursorYSpring,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1.5px solid var(--color-accent)",
          backgroundColor: "var(--color-accent-light)",
          pointerEvents: "none",
          zIndex: 9998,
          x: "-50%",
          y: "-50%",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      />
    </>
  );
}
