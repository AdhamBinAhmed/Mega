"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, PerspectiveCamera, Sparkles, PointMaterial, Points, MeshDistortMaterial } from "@react-three/drei";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";

// --- Camera Parallax Rig ---
function CameraRig() {
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, target.current.x * 5, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, target.current.y * 4, 0.04);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 34, 0.025);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

// --- 0. Morphing Core (Original) ---
function MorphingCore({ theme }: { theme: "light" | "dark" }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (meshRef.current) { meshRef.current.rotation.x += delta * 0.05; meshRef.current.rotation.y += delta * 0.08; }
    if (innerRef.current) { innerRef.current.rotation.x -= delta * 0.03; innerRef.current.rotation.y -= delta * 0.04; }
  });
  const color = theme === "dark" ? "#e05940" : "#c8553d";
  const glowColor = theme === "dark" ? "#e4b25e" : "#d4a24e";
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[10, 4]} />
        <MeshDistortMaterial color={color} wireframe={true} transparent opacity={theme === "dark" ? 0.15 : 0.08} distort={0.3} speed={1.5} />
      </mesh>
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[5, 3]} />
        <MeshDistortMaterial color={glowColor} wireframe={true} transparent opacity={theme === "dark" ? 0.08 : 0.04} distort={0.4} speed={2} />
      </mesh>
    </Float>
  );
}

// --- 1. Data Cloud ---
function DataCloud({ theme }: { theme: "light" | "dark" }) {
  const ref = useRef<THREE.Points>(null);
  const count = 2000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 15 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);
  useFrame((state, delta) => {
    if (ref.current) { ref.current.rotation.y += delta * 0.05; ref.current.rotation.x += delta * 0.02; }
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color={theme === "dark" ? "#e4b25e" : "#c8553d"} size={0.05} sizeAttenuation={true} depthWrite={false} opacity={0.6} />
    </Points>
  );
}

// --- 2. Floating Server Monoliths ---
function ServerMonoliths({ theme }: { theme: "light" | "dark" }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
      groupRef.current.children.forEach((child, i) => { child.position.y += Math.sin(state.clock.elapsedTime + i) * 0.005; });
    }
  });
  const baseColor = theme === "dark" ? "#1a1a1a" : "#ffffff";
  const edgeColor = theme === "dark" ? "#e05940" : "#c8553d";
  return (
    <group ref={groupRef}>
      {[...Array(5)].map((_, i) => (
        <Float key={i} speed={2} rotationIntensity={0.2} floatIntensity={1}>
          <mesh position={[(i - 2) * 5, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10]}>
            <boxGeometry args={[1.5, 8, 1.5]} />
            <meshBasicMaterial color={baseColor} transparent opacity={0.8} />
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(1.5, 8, 1.5)]} />
              <lineBasicMaterial color={edgeColor} transparent opacity={0.5} />
            </lineSegments>
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// --- 3. Holo-Grid ---
function HoloGrid({ theme }: { theme: "light" | "dark" }) {
  const gridRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (gridRef.current) { gridRef.current.position.z = (state.clock.elapsedTime * 4) % 4; }
  });
  return (
    <mesh ref={gridRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]}>
      <planeGeometry args={[100, 100, 25, 25]} />
      <meshBasicMaterial color={theme === "dark" ? "#e05940" : "#c8553d"} wireframe transparent opacity={0.15} />
    </mesh>
  );
}

// --- 4. Minimalist Crystal Core ---
function CrystalCore({ theme }: { theme: "light" | "dark" }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.children[0].rotation.x += delta * 0.1; groupRef.current.children[0].rotation.y += delta * 0.2;
      groupRef.current.children[1].rotation.x -= delta * 0.05; groupRef.current.children[1].rotation.y -= delta * 0.1;
    }
  });
  const baseColor = theme === "dark" ? "#e05940" : "#c8553d";
  const coreColor = theme === "dark" ? "#e4b25e" : "#d4a24e";
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef}>
        <mesh><octahedronGeometry args={[4, 0]} /><meshBasicMaterial color={coreColor} transparent opacity={0.4} /></mesh>
        <mesh><octahedronGeometry args={[6, 0]} /><meshBasicMaterial color={baseColor} wireframe transparent opacity={0.3} /></mesh>
      </group>
    </Float>
  );
}

// --- 5. Abstract Digital Waves ---
function AbstractWaves({ theme }: { theme: "light" | "dark" }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    const positions = meshRef.current.geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i); const y = positions.getY(i);
      positions.setZ(i, Math.sin(x * 0.5 + time) * Math.cos(y * 0.5 + time) * 1.5);
    }
    positions.needsUpdate = true;
  });
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -5, 0]}>
      <planeGeometry args={[40, 40, 20, 20]} />
      <meshBasicMaterial color={theme === "dark" ? "#ff8a6f" : "#ff6b4a"} wireframe transparent opacity={0.2} />
    </mesh>
  );
}

// --- 6. Interlocking Rings ---
function InterlockingRings({ theme }: { theme: "light" | "dark" }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * 0.05; groupRef.current.rotation.y += delta * 0.03;
      groupRef.current.children.forEach((ring, i) => {
        ring.rotation.x += delta * 0.1 * (i % 2 === 0 ? 1 : -1);
        ring.rotation.y += delta * 0.08 * (i % 3 === 0 ? -1 : 1);
      });
    }
  });
  const baseColor = theme === "dark" ? "#e05940" : "#c8553d";
  const accentColor = theme === "dark" ? "#e4b25e" : "#d4a24e";
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <group ref={groupRef}>
        {[6, 9, 12, 15].map((radius, i) => (
          <mesh key={i} rotation={[Math.PI / (i + 1), Math.PI / (i + 2), 0]}>
            <torusGeometry args={[radius, 0.04, 4, 64]} />
            <meshBasicMaterial color={i % 2 === 0 ? baseColor : accentColor} transparent opacity={0.25} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// --- 7. Floating Pyramids ---
function FloatingPyramids({ theme }: { theme: "light" | "dark" }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
      groupRef.current.children.forEach((child, i) => {
        child.rotation.x += delta * 0.2 * (i % 2 ? 1 : -1);
        child.rotation.y += delta * 0.1;
      });
    }
  });
  return (
    <group ref={groupRef}>
      {[...Array(15)].map((_, i) => (
        <Float key={i} speed={2} rotationIntensity={2} floatIntensity={2}>
          <mesh position={[(Math.random()-0.5)*40, (Math.random()-0.5)*40, (Math.random()-0.5)*20]}>
            <tetrahedronGeometry args={[Math.random() * 2 + 1]} />
            <meshBasicMaterial color={theme === "dark" ? "#e4b25e" : "#c8553d"} wireframe transparent opacity={0.3} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// --- 8. Fractal Cubes ---
function FractalCubes({ theme }: { theme: "light" | "dark" }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.rotation.x += delta * 0.1 * (i + 1);
        child.rotation.y -= delta * 0.15 * (i + 1);
      });
    }
  });
  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
      <group ref={groupRef}>
        {[4, 8, 12, 16].map((size, i) => (
          <mesh key={i}>
            <boxGeometry args={[size, size, size]} />
            <meshBasicMaterial color={theme === "dark" ? "#e05940" : "#ff6b4a"} wireframe transparent opacity={0.2} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// --- 9. Wireframe Sphere ---
function WireframeSphere({ theme }: { theme: "light" | "dark" }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
      meshRef.current.rotation.z += delta * 0.05;
    }
  });
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[12, 16, 16]} />
        <meshBasicMaterial color={theme === "dark" ? "#e4b25e" : "#d4a24e"} wireframe transparent opacity={0.15} />
      </mesh>
    </Float>
  );
}

// --- 10. Cyber Hexagons ---
function CyberHexagons({ theme }: { theme: "light" | "dark" }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * 0.05;
      groupRef.current.rotation.z += delta * 0.05;
    }
  });
  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef}>
        {[...Array(20)].map((_, i) => (
          <mesh key={i} position={[(Math.random()-0.5)*50, (Math.random()-0.5)*50, (Math.random()-0.5)*20]}>
            <cylinderGeometry args={[2, 2, 1, 6]} />
            <meshBasicMaterial color={theme === "dark" ? "#e05940" : "#c8553d"} wireframe transparent opacity={0.3} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// --- 11. Particle Rings ---
function ParticleRings({ theme }: { theme: "light" | "dark" }) {
  const ref = useRef<THREE.Points>(null);
  const count = 1500;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 10 + Math.random() * 8;
      const theta = Math.random() * 2 * Math.PI;
      pos[i * 3] = radius * Math.cos(theta);
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2;
      pos[i * 3 + 2] = radius * Math.sin(theta);
    }
    return pos;
  }, [count]);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.2;
      ref.current.rotation.x = Math.PI / 6;
    }
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color={theme === "dark" ? "#ff6b4a" : "#e05940"} size={0.1} sizeAttenuation={true} depthWrite={false} opacity={0.6} />
    </Points>
  );
}

// --- 12. Starfield Surge ---
function StarfieldSurge({ theme }: { theme: "light" | "dark" }) {
  const ref = useRef<THREE.Points>(null);
  const count = 1000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return pos;
  }, [count]);
  useFrame((state, delta) => {
    if (ref.current) {
      const positions = ref.current.geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        let z = positions.getZ(i);
        z += delta * 20;
        if (z > 25) z = -25;
        positions.setZ(i, z);
      }
      positions.needsUpdate = true;
    }
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color={theme === "dark" ? "#e4b25e" : "#d4a24e"} size={0.15} sizeAttenuation={true} depthWrite={false} opacity={0.8} />
    </Points>
  );
}

// --- 13. Neon Tubes ---
function NeonTubes({ theme }: { theme: "light" | "dark" }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }
  });
  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[8, 0.5, 64, 8]} />
        <meshBasicMaterial color={theme === "dark" ? "#e05940" : "#ff6b4a"} wireframe transparent opacity={0.2} />
      </mesh>
    </Float>
  );
}

// --- 14. Pulsing Stars ---
function PulsingStars({ theme }: { theme: "light" | "dark" }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.4;
      groupRef.current.scale.set(scale, scale, scale);
      groupRef.current.rotation.y += 0.005;
    }
  });
  return (
    <group ref={groupRef}>
      {[...Array(30)].map((_, i) => (
        <mesh key={i} position={[(Math.random()-0.5)*40, (Math.random()-0.5)*40, (Math.random()-0.5)*40]}>
          <octahedronGeometry args={[0.5, 0]} />
          <meshBasicMaterial color={theme === "dark" ? "#e4b25e" : "#d4a24e"} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// --- 15. Digital Rain ---
function DigitalRain({ theme }: { theme: "light" | "dark" }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child) => {
        child.position.y -= delta * 15;
        if (child.position.y < -20) child.position.y = 20;
      });
    }
  });
  return (
    <group ref={groupRef}>
      {[...Array(60)].map((_, i) => (
        <mesh key={i} position={[(Math.random()-0.5)*50, (Math.random()-0.5)*40, (Math.random()-0.5)*20]}>
          <boxGeometry args={[0.1, Math.random() * 4 + 1, 0.1]} />
          <meshBasicMaterial color={theme === "dark" ? "#2d5a27" : "#3d7a37"} transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

const components = [
  MorphingCore,
  DataCloud,
  ServerMonoliths,
  HoloGrid,
  CrystalCore,
  AbstractWaves,
  InterlockingRings,
  FloatingPyramids,
  FractalCubes,
  WireframeSphere,
  CyberHexagons,
  ParticleRings,
  StarfieldSurge,
  NeonTubes,
  PulsingStars,
  DigitalRain
];

export default function Scene({ theme, bgStyle = 0 }: { theme: "light" | "dark", bgStyle?: number }) {
  const ActiveComponent = components[bgStyle % components.length];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <Canvas dpr={[1, 1.5]}>
        <PerspectiveCamera makeDefault position={[0, 0, 30]} />
        <ambientLight intensity={0.5} />
        
        <CameraRig />
        
        <ActiveComponent theme={theme} />
        
        {/* Dynamic floating sparkles for premium feel */}
        <Sparkles 
          count={80} 
          scale={40} 
          size={3} 
          speed={0.4} 
          opacity={theme === "dark" ? 0.3 : 0.15} 
          color={theme === "dark" ? "#e4b25e" : "#ff6b4a"} 
        />
        
        {theme === "dark" && (
          <Stars radius={100} depth={50} count={800} factor={3} saturation={0} fade speed={0.5} />
        )}
      </Canvas>
    </div>
  );
}
