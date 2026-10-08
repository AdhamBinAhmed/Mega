"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Environment, Stars } from "@react-three/drei";
import * as THREE from "three";

function seededUnit(index: number, salt: number): number {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

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
      {Array.from({ length: 45 }, (_, i) => {
        const color = colors[i % colors.length];
        const x = (seededUnit(i, 1) - 0.5) * 30;
        const y = (seededUnit(i, 2) - 0.5) * 30;
        const z = (seededUnit(i, 3) - 0.5) * 20 - 5;
        const scale = seededUnit(i, 4) * 1.5 + 0.5;
        const speed = seededUnit(i, 5) * 1.5 + 0.5;

        return (
          <Float key={i} speed={speed} rotationIntensity={3} floatIntensity={4}>
            <mesh position={[x, y, z]} scale={scale}>
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

export default function Scene3D() {
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
