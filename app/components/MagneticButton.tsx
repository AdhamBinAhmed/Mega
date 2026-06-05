"use client";

import { motion } from "framer-motion";
import { useRef, ReactNode, useEffect, useState } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
}

export default function MagneticButton({ children, className = "", href, onClick }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(hover: none) and (pointer: coarse)").matches);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTouchDevice || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `translate(${x * 5}px, ${y * 5}px)`;
  };

  const handleMouseLeave = () => {
    if (isTouchDevice || !ref.current) return;
    ref.current.style.transform = "translate(0, 0)";
  };

  const Component = href ? "a" : "button";

  return (
    <motion.div
      className="inline-block"
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Component
        ref={ref as any}
        href={href}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`magnetic font-bold transition-all duration-300 inline-flex items-center justify-center gap-2 ${className}`}
      >
        {children}
      </Component>
    </motion.div>
  );
}
