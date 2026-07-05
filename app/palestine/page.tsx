"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Environment, Stars } from "@react-three/drei";
import * as THREE from "three";

// ----------------------------------------------------
// 3D Scene Components
// ----------------------------------------------------
function FloatingGlassShapes() {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.05;
      group.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  const colors = ["#CE1126", "#007A3D", "#ffffff", "#111111"];

  return (
    <group ref={group}>
      {Array.from({ length: 45 }).map((_, i) => {
        // Distribute objects across a wide volume
        const x = (Math.random() - 0.5) * 30;
        const y = (Math.random() - 0.5) * 30;
        const z = (Math.random() - 0.5) * 20 - 5;
        const s = Math.random() * 1.5 + 0.5;
        const color = colors[i % colors.length];

        return (
          <Float key={i} speed={Math.random() * 1.5 + 0.5} rotationIntensity={3} floatIntensity={4}>
            <mesh position={[x, y, z]} scale={s}>
              {i % 2 === 0 ? <icosahedronGeometry args={[1, 1]} /> : <sphereGeometry args={[1, 32, 32]} />}
              <meshPhysicalMaterial 
                color={color}
                transmission={0.9} // Glass effect
                opacity={1}
                transparent
                metalness={0.1}
                roughness={0.15}
                ior={1.4}
                thickness={2}
                envMapIntensity={1.5}
                clearcoat={1}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

function Scene3D() {
  return (
    <div className="absolute inset-0 z-0" style={{ pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
        {/* Lights */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} />
        <spotLight position={[-10, 0, 15]} intensity={2} color="#CE1126" distance={50} />
        <spotLight position={[10, 0, 15]} intensity={2} color="#007A3D" distance={50} />
        
        <Environment preset="city" />
        
        {/* 3D Objects */}
        <FloatingGlassShapes />
        <Stars radius={100} depth={50} count={2000} factor={3} saturation={0} fade speed={1} />
        <Sparkles count={200} scale={25} size={3} speed={0.5} opacity={0.5} color="#ffffff" />
      </Canvas>
    </div>
  );
}

// ----------------------------------------------------
// Main Page UI Component
// ----------------------------------------------------
export default function PalestinePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#020202]" />;

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center relative overflow-hidden font-sans">
      
      {/* Interactive 3D Background */}
      <Scene3D />

      {/* Atmospheric Overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-[#020202]/90" />
      <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />

      {/* Navigation / Back Button */}
      <div className="absolute top-0 left-0 w-full p-8 z-50 flex justify-between items-center pointer-events-auto">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md group-hover:bg-white/15 transition-all shadow-lg group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </div>
          <span className="font-mono text-sm tracking-[0.2em] text-white/50 group-hover:text-white transition-colors uppercase font-medium">Return Home</span>
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-5xl px-6 min-h-screen py-20 pointer-events-auto">
        
        {/* Animated Palestine Glass Emblem */}
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.5, type: "spring", bounce: 0.3 }}
          className="relative w-80 h-48 sm:w-[28rem] sm:h-64 md:w-[600px] md:h-[360px] rounded-[2rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.8)] mb-16 border border-white/20 backdrop-blur-xl group"
        >
          {/* Base Glass Background */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-3xl" />

          {/* Authentic Flag Colors inside Glass Container */}
          <div className="absolute inset-0 flex flex-col opacity-90 mix-blend-screen">
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }} style={{ originX: 0 }} className="flex-1 bg-[#111]" />
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }} style={{ originX: 0 }} className="flex-1 bg-[#ffffff]" />
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }} style={{ originX: 0 }} className="flex-1 bg-[#007A3D]" />
          </div>
          
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }} 
            animate={{ scaleX: 1, opacity: 0.95 }} 
            transition={{ duration: 1.5, delay: 1.0, ease: "easeOut" }}
            className="absolute top-0 bottom-0 left-0 w-1/2 bg-[#CE1126] mix-blend-screen"
            style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)', originX: 0 }}
          />

          {/* Reflections for Glass Emblem Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none transform -skew-y-6" />
          <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(255,255,255,0.15)] pointer-events-none rounded-[2rem]" />
        </motion.div>

        {/* Text Typography */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.6 }}
          className="text-center flex flex-col items-center"
        >
          <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter mb-6 leading-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 drop-shadow-2xl">
              Resilience
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CE1126] via-white to-[#007A3D] drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              & Solidarity
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/50 font-light mb-14 max-w-3xl mx-auto leading-relaxed px-4 drop-shadow-md">
            Embracing the spirit of hope and strength. Together we build, innovate, and stand for a future where humanity and justice prevail.
          </p>
          
          {/* Interactive Hashtag Button Component */}
          <motion.a
            href="https://twitter.com/search?q=%23build_with_palestine"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.96 }}
            className="inline-block relative group"
          >
            {/* Ambient Animated Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#CE1126] via-white to-[#007A3D] opacity-40 blur-2xl group-hover:opacity-100 group-hover:blur-3xl transition-all duration-700 rounded-full" />
            
            {/* Main Premium Button */}
            <div className="relative px-12 py-6 rounded-full bg-[#050507]/60 border border-white/20 backdrop-blur-2xl transition-all duration-500 shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset] overflow-hidden">
              {/* Sweep effect on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
              
              <span className="relative text-2xl md:text-3xl font-extrabold tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-[#CE1126] via-white to-[#007A3D] uppercase drop-shadow-lg">
                #build_with_palestine
              </span>
            </div>
          </motion.a>
        </motion.div>

      </div>
    </div>
  );
}
