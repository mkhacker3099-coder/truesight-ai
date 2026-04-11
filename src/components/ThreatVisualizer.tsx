import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ThreatSphereProps {
  level: "safe" | "medium" | "high";
}

function Sphere({ level }: ThreatSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const color = level === "safe" ? "#00e676" : level === "medium" ? "#ffab00" : "#ff1744";
  const distortion = level === "safe" ? 0.02 : level === "medium" ? 0.06 : 0.12;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * distortion;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.2, 3]} />
      <meshStandardMaterial
        color={color}
        wireframe
        transparent
        opacity={0.7}
        emissive={color}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function Particles({ level }: ThreatSphereProps) {
  const ref = useRef<THREE.Points>(null!);
  const count = level === "high" ? 300 : level === "medium" ? 150 : 80;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.5 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  const color = level === "safe" ? "#00e676" : level === "medium" ? "#ffab00" : "#ff1744";

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color={color} transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

const ThreatVisualizer = ({ level }: ThreatSphereProps) => {
  return (
    <div className="w-full h-48 rounded-xl overflow-hidden">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[3, 3, 3]} intensity={0.5} />
        <Sphere level={level} />
        <Particles level={level} />
      </Canvas>
    </div>
  );
};

export default ThreatVisualizer;