import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, ContactShadows } from "@react-three/drei";
import { useRef, Suspense, useMemo } from "react";
import * as THREE from "three";

function Rod({ accent = "#c97f3d", interactive = false }: { accent?: string; interactive?: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    const baseZ = Math.PI / 4 + Math.sin(t * 0.4) * 0.06;
    if (interactive) {
      const mx = state.pointer.x;
      const my = state.pointer.y;
      const targetY = t * 0.18 + mx * 0.6;
      const targetX = -my * 0.4;
      group.current.rotation.y += (targetY - group.current.rotation.y) * 0.06;
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.06;
      group.current.rotation.z = baseZ;
    } else {
      group.current.rotation.z = Math.sin(t * 0.4) * 0.06;
      group.current.rotation.y = t * 0.18;
    }
  });

  const length = 6.4;
  const buttR = 0.14;
  const tipR = 0.012;

  // Tapered blank as a lathed geometry
  const blankGeo = useMemo(() => {
    const points: THREE.Vector2[] = [];
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      // ease-out taper (thicker near butt)
      const r = buttR * Math.pow(1 - t, 1.6) + tipR;
      const y = -length / 2 + t * length;
      points.push(new THREE.Vector2(r, y));
    }
    return new THREE.LatheGeometry(points, 48);
  }, []);

  const radiusAt = (y: number) => {
    const t = (y + length / 2) / length;
    return buttR * Math.pow(1 - t, 1.6) + tipR;
  };

  // Thread wrap zones (decorative bands)
  const wraps = [
    { y: -length / 2 + 0.95, w: 0.06, c: accent },
    { y: -length / 2 + 1.02, w: 0.015, c: "#f0e6d2" },
    { y: -length / 2 + 1.06, w: 0.015, c: "#1a1a1a" },
  ];

  // Guide positions (logarithmic spacing — closer near tip)
  const guideYs = [
    -length / 2 + 1.25,
    -length / 2 + 2.1,
    -length / 2 + 2.95,
    -length / 2 + 3.75,
    -length / 2 + 4.45,
    -length / 2 + 5.0,
    -length / 2 + 5.45,
    -length / 2 + 5.78,
  ];

  return (
    <group ref={group} rotation={[0, 0, Math.PI / 4]}>
      {/* Butt cap */}
      <mesh position={[0, -length / 2 - 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.18, 0.12, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* Rubber butt cap accent */}
      <mesh position={[0, -length / 2 - 1.02, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.16, 0.04, 32]} />
        <meshStandardMaterial color={accent} metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Rear cork grip */}
      <CorkGrip position={[0, -length / 2 - 0.55, 0]} length={0.7} rTop={0.18} rBottom={0.17} />

      {/* Reel seat */}
      <group position={[0, -length / 2 - 0.05, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.21, 0.21, 0.42, 32]} />
          <meshStandardMaterial color="#0e0e0e" metalness={0.4} roughness={0.5} />
        </mesh>
        {/* Hood */}
        <mesh position={[0, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.2, 0.1, 32]} />
          <meshStandardMaterial color={accent} metalness={0.95} roughness={0.18} />
        </mesh>
        {/* Locking nut */}
        <mesh position={[0, -0.18, 0]} castShadow>
          <cylinderGeometry args={[0.23, 0.23, 0.09, 24]} />
          <meshStandardMaterial color={accent} metalness={0.95} roughness={0.2} />
        </mesh>
        {/* Knurl rings */}
        {[-0.16, -0.13, 0.13, 0.16].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <torusGeometry args={[0.225, 0.008, 8, 32]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Winding check ring */}
      <mesh position={[0, -length / 2 + 0.22, 0]}>
        <cylinderGeometry args={[0.16, 0.17, 0.04, 32]} />
        <meshStandardMaterial color={accent} metalness={0.95} roughness={0.2} />
      </mesh>

      {/* Foregrip (short cork) */}
      <CorkGrip position={[0, -length / 2 + 0.45, 0]} length={0.35} rTop={0.15} rBottom={0.16} />

      {/* Tapered blank */}
      <mesh geometry={blankGeo} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#0a0a0a"
          roughness={0.25}
          metalness={0.55}
          clearcoat={0.9}
          clearcoatRoughness={0.15}
        />
      </mesh>

      {/* Carbon weave subtle stripe (decorative) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.1, length * 0.6, 32, 1, true]} />
        <meshStandardMaterial
          color="#1c1c1c"
          metalness={0.7}
          roughness={0.4}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Thread wraps near foregrip */}
      {wraps.map((w, i) => {
        const r = radiusAt(w.y) + 0.004;
        return (
          <mesh key={`w${i}`} position={[0, w.y, 0]} castShadow>
            <cylinderGeometry args={[r, r, w.w, 32]} />
            <meshStandardMaterial color={w.c} roughness={0.45} metalness={0.1} />
          </mesh>
        );
      })}

      {/* Guides */}
      {guideYs.map((y, i) => {
        const r = radiusAt(y);
        const ringR = Math.max(0.025, r * 0.9 + 0.02);
        return <Guide key={`g${i}`} y={y} blankR={r} ringR={ringR} accent={accent} />;
      })}

      {/* Hook keeper */}
      <Guide y={-length / 2 + 0.7} blankR={radiusAt(-length / 2 + 0.7)} ringR={0.04} accent={accent} small />

      {/* Tip top */}
      <group position={[0, length / 2, 0]}>
        <mesh>
          <cylinderGeometry args={[tipR + 0.005, tipR + 0.005, 0.06, 16]} />
          <meshStandardMaterial color={accent} metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.022, 0.005, 12, 24]} />
          <meshStandardMaterial color={accent} metalness={0.95} roughness={0.15} />
        </mesh>
      </group>
    </group>
  );
}

function CorkGrip({
  position,
  length,
  rTop,
  rBottom,
}: {
  position: [number, number, number];
  length: number;
  rTop: number;
  rBottom: number;
}) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[rTop, rBottom, length, 48]} />
        <meshStandardMaterial color="#d6b079" roughness={0.95} metalness={0} />
      </mesh>
      {/* Cork specks via small spheres */}
      {Array.from({ length: 18 }).map((_, i) => {
        const a = (i / 18) * Math.PI * 2;
        const y = (Math.sin(i * 3.1) * length) / 2.4;
        const r = (rTop + rBottom) / 2 + 0.001;
        return (
          <mesh key={i} position={[Math.cos(a) * r, y, Math.sin(a) * r]}>
            <sphereGeometry args={[0.008, 6, 6]} />
            <meshStandardMaterial color="#8a6635" roughness={1} />
          </mesh>
        );
      })}
    </group>
  );
}

function Guide({
  y,
  blankR,
  ringR,
  accent,
  small = false,
}: {
  y: number;
  blankR: number;
  ringR: number;
  accent: string;
  small?: boolean;
}) {
  const footLen = small ? 0.06 : 0.12;
  const standH = ringR + 0.04;
  return (
    <group position={[0, y, 0]}>
      {/* Wrap binding the foot */}
      <mesh>
        <cylinderGeometry args={[blankR + 0.008, blankR + 0.008, footLen, 24]} />
        <meshStandardMaterial color={accent} roughness={0.5} />
      </mesh>
      {/* Foot/stand */}
      <mesh position={[blankR + standH / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.008, 0.012, standH, 12]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.25} />
      </mesh>
      {/* Ring frame */}
      <mesh
        position={[blankR + standH, 0, 0]}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
      >
        <torusGeometry args={[ringR, 0.012, 12, 28]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.95} roughness={0.2} />
      </mesh>
      {/* Inner ceramic insert */}
      <mesh
        position={[blankR + standH, 0, 0]}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
      >
        <torusGeometry args={[ringR - 0.005, 0.005, 10, 28]} />
        <meshStandardMaterial color={accent} metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
}

export function FishingRod3D({ accent, interactive = false }: { accent?: string; interactive?: boolean }) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 7.5], fov: 36 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1.3} castShadow />
        <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#7fa66b" />
        <spotLight position={[0, 6, 4]} angle={0.5} penumbra={0.8} intensity={0.6} color="#c97f3d" />
        <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.4}>
          <Rod accent={accent} interactive={interactive} />
        </Float>
        <ContactShadows position={[0, -3.6, 0]} opacity={0.4} scale={8} blur={2.5} far={4} />
        <Environment preset="warehouse" />
      </Suspense>
    </Canvas>
  );
}

