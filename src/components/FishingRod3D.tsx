import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function Rod({ accent = "#c97f3d" }: { accent?: string }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.z = Math.sin(t * 0.4) * 0.08;
    group.current.rotation.y = t * 0.15;
  });

  // Build a tapered rod via several cylinder segments
  const segments = 8;
  const length = 6;
  const segLen = length / segments;

  return (
    <group ref={group} rotation={[0, 0, Math.PI / 4]}>
      {/* Handle / cork */}
      <mesh position={[0, -length / 2 - 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.16, 0.9, 32]} />
        <meshStandardMaterial color="#d9b380" roughness={0.9} />
      </mesh>
      {/* Reel seat */}
      <mesh position={[0, -length / 2 + 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.35, 32]} />
        <meshStandardMaterial color={accent} metalness={0.9} roughness={0.25} />
      </mesh>
      {/* Wrap accent */}
      <mesh position={[0, -length / 2 + 0.5, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.15, 32]} />
        <meshStandardMaterial color={accent} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Tapered blank */}
      {Array.from({ length: segments }).map((_, i) => {
        const rBottom = 0.12 - (i * 0.012);
        const rTop = 0.12 - ((i + 1) * 0.012);
        const y = -length / 2 + 0.7 + i * segLen + segLen / 2;
        return (
          <mesh key={i} position={[0, y, 0]} castShadow>
            <cylinderGeometry args={[rTop, rBottom, segLen, 24]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.4} />
          </mesh>
        );
      })}

      {/* Guides (rings) */}
      {Array.from({ length: 6 }).map((_, i) => {
        const y = -length / 2 + 1.2 + i * 0.85;
        return (
          <mesh key={`g${i}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.09 - i * 0.008, 0.012, 12, 24]} />
            <meshStandardMaterial color={accent} metalness={0.95} roughness={0.2} />
          </mesh>
        );
      })}

      {/* Tip top */}
      <mesh position={[0, length / 2 + 0.3, 0]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color={accent} metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
}

export function FishingRod3D({ accent }: { accent?: string }) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 7], fov: 38 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-4, 2, -3]} intensity={0.4} color="#7fa66b" />
        <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.5}>
          <Rod accent={accent} />
        </Float>
        <Environment preset="warehouse" />
      </Suspense>
    </Canvas>
  );
}
