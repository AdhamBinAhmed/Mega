"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, PerspectiveCamera, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function AnimatedCore({ theme }: { theme: "light" | "dark" }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.05;
      meshRef.current.rotation.y += delta * 0.08;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x -= delta * 0.03;
      innerRef.current.rotation.y -= delta * 0.04;
    }
  });

  const color = theme === "dark" ? "#e05940" : "#c8553d";
  const glowColor = theme === "dark" ? "#e4b25e" : "#d4a24e";

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      {/* Outer morphing wireframe */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[10, 16]} />
        <MeshDistortMaterial 
          color={color} 
          wireframe={true} 
          transparent 
          opacity={theme === "dark" ? 0.15 : 0.08}
          distort={0.3}
          speed={1.5}
        />
      </mesh>
      
      {/* Inner glowing morphing core */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[5, 12]} />
        <MeshDistortMaterial 
          color={glowColor}
          wireframe={true}
          transparent
          opacity={theme === "dark" ? 0.08 : 0.04}
          distort={0.4}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

export default function Scene({ theme }: { theme: "light" | "dark" }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 30]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#e4b25e" />
        
        <AnimatedCore theme={theme} />
        
        {/* Dynamic floating sparkles for premium feel */}
        <Sparkles 
          count={300} 
          scale={40} 
          size={3} 
          speed={0.4} 
          opacity={theme === "dark" ? 0.2 : 0.1} 
          color={theme === "dark" ? "#ff8a6f" : "#ff6b4a"} 
        />
        
        {theme === "dark" && (
          <Stars radius={100} depth={50} count={3000} factor={3} saturation={0} fade speed={0.5} />
        )}
      </Canvas>
    </div>
  );
}
