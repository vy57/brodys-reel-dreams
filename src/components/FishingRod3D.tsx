import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, ContactShadows } from "@react-three/drei";
import { useRef, Suspense, useMemo } from "react";
import * as THREE from "three";

/* ---------------- Procedural textures ---------------- */

function useCarbonWeaveTexture() {
  return useMemo(() => {
    const size = 256;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d")!;
    // base
    const grad = ctx.createLinearGradient(0, 0, 0, size);
    grad.addColorStop(0, "#0a0a0a");
    grad.addColorStop(0.5, "#161616");
    grad.addColorStop(1, "#070707");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    // twill weave
    const cell = 16;
    for (let y = 0; y < size; y += cell) {
      for (let x = 0; x < size; x += cell) {
        const offset = ((y / cell) % 2) * (cell / 2);
        const gx = x + offset;
        const g = ctx.createLinearGradient(gx, y, gx + cell, y + cell);
        g.addColorStop(0, "#1f1f1f");
        g.addColorStop(0.5, "#2c2c2c");
        g.addColorStop(1, "#0a0a0a");
        ctx.fillStyle = g;
        ctx.fillRect(gx, y, cell - 1, cell / 2 - 1);
        const g2 = ctx.createLinearGradient(gx, y + cell / 2, gx + cell, y + cell);
        g2.addColorStop(0, "#0a0a0a");
        g2.addColorStop(0.5, "#222");
        g2.addColorStop(1, "#1a1a1a");
        ctx.fillStyle = g2;
        ctx.fillRect(gx + cell / 2, y + cell / 2, cell - 1, cell / 2 - 1);
      }
    }
    // sheen specks
    ctx.globalAlpha = 0.25;
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? "#3a3a3a" : "#000";
      ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
    }
    ctx.globalAlpha = 1;

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 20);
    tex.anisotropy = 8;
    return tex;
  }, []);
}

function useCorkTexture() {
  return useMemo(() => {
    const size = 256;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#d6b079";
    ctx.fillRect(0, 0, size, size);
    // speckles
    for (let i = 0; i < 1200; i++) {
      const r = Math.random() * 2 + 0.4;
      const shade = Math.random();
      ctx.fillStyle =
        shade < 0.55 ? "#a07c4a" : shade < 0.85 ? "#6e4f29" : "#3b2a14";
      ctx.globalAlpha = 0.35 + Math.random() * 0.5;
      ctx.beginPath();
      ctx.arc(Math.random() * size, Math.random() * size, r, 0, Math.PI * 2);
      ctx.fill();
    }
    // larger pits
    for (let i = 0; i < 60; i++) {
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = "#3b2a14";
      ctx.beginPath();
      ctx.arc(Math.random() * size, Math.random() * size, Math.random() * 3 + 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);
}

function useThreadTexture(color: string, trim: string) {
  return useMemo(() => {
    const w = 128;
    const h = 8;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
    // diagonal silk lines
    ctx.strokeStyle = trim;
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 1;
    for (let i = -h; i < w; i += 2) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h, h);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 1);
    return tex;
  }, [color, trim]);
}

/* ---------------- Geometry helpers ---------------- */

const LENGTH = 6.4;
const BUTT_R = 0.14;
const TIP_R = 0.012;

function radiusAt(y: number) {
  const t = (y + LENGTH / 2) / LENGTH;
  return BUTT_R * Math.pow(1 - t, 1.6) + TIP_R;
}

/* ---------------- Sub components ---------------- */

function CorkGrip({
  position,
  length,
  rTop,
  rBottom,
  texture,
}: {
  position: [number, number, number];
  length: number;
  rTop: number;
  rBottom: number;
  texture: THREE.Texture;
}) {
  const tex = useMemo(() => {
    const t = texture.clone();
    t.needsUpdate = true;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(3, Math.max(1, Math.round(length * 4)));
    return t;
  }, [texture, length]);
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[rTop, rBottom, length, 64]} />
        <meshStandardMaterial map={tex} roughness={0.95} metalness={0} />
      </mesh>
      {/* Decorative burl-cork accent bands */}
      <mesh position={[0, length / 2 - 0.015, 0]}>
        <cylinderGeometry args={[rTop + 0.003, rTop + 0.003, 0.012, 48]} />
        <meshStandardMaterial color="#2a1a0c" roughness={0.6} />
      </mesh>
      <mesh position={[0, -length / 2 + 0.015, 0]}>
        <cylinderGeometry args={[rBottom + 0.003, rBottom + 0.003, 0.012, 48]} />
        <meshStandardMaterial color="#2a1a0c" roughness={0.6} />
      </mesh>
    </group>
  );
}

function ThreadWrap({
  y,
  length,
  color,
  trim,
  blankR,
}: {
  y: number;
  length: number;
  color: string;
  trim: string;
  blankR: number;
}) {
  const tex = useThreadTexture(color, trim);
  const r = blankR + 0.006;
  return (
    <mesh position={[0, y, 0]} castShadow>
      <cylinderGeometry args={[r, r, length, 48]} />
      <meshStandardMaterial map={tex} roughness={0.45} metalness={0.05} />
    </mesh>
  );
}

function TrimBand({ y, blankR, color }: { y: number; blankR: number; color: string }) {
  const r = blankR + 0.008;
  return (
    <mesh position={[0, y, 0]}>
      <cylinderGeometry args={[r, r, 0.012, 32]} />
      <meshStandardMaterial color={color} metalness={0.85} roughness={0.25} />
    </mesh>
  );
}

function Guide({
  y,
  blankR,
  ringR,
  accent,
  doubleFoot = false,
  small = false,
}: {
  y: number;
  blankR: number;
  ringR: number;
  accent: string;
  doubleFoot?: boolean;
  small?: boolean;
}) {
  const footLen = small ? 0.05 : doubleFoot ? 0.16 : 0.1;
  const standH = ringR + 0.05;
  const frameColor = "#0d0d0d";
  return (
    <group position={[0, y, 0]}>
      {/* Thread wrap binding foot(s) */}
      {doubleFoot ? (
        <>
          <ThreadWrap y={-footLen / 2 - 0.015} length={footLen / 2} color={accent} trim="#f4ead4" blankR={blankR} />
          <ThreadWrap y={footLen / 2 + 0.015} length={footLen / 2} color={accent} trim="#f4ead4" blankR={blankR} />
          <TrimBand y={-footLen / 2 - footLen / 4} blankR={blankR} color="#f4ead4" />
          <TrimBand y={footLen / 2 + footLen / 4} blankR={blankR} color="#f4ead4" />
        </>
      ) : (
        <>
          <ThreadWrap y={0} length={footLen} color={accent} trim="#f4ead4" blankR={blankR} />
          <TrimBand y={footLen / 2 + 0.008} blankR={blankR} color="#f4ead4" />
          <TrimBand y={-footLen / 2 - 0.008} blankR={blankR} color="#f4ead4" />
        </>
      )}
      {/* Foot metal under wrap (tapered) */}
      <mesh position={[blankR + 0.005, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.012, footLen, 12]} />
        <meshStandardMaterial color={frameColor} metalness={0.95} roughness={0.25} />
      </mesh>
      {/* Two stand legs forming a triangle frame */}
      <mesh position={[blankR + standH * 0.35, 0, 0]} rotation={[0, 0, -Math.PI / 3]}>
        <cylinderGeometry args={[0.008, 0.011, standH * 0.85, 12]} />
        <meshStandardMaterial color={frameColor} metalness={0.95} roughness={0.25} />
      </mesh>
      {/* Ring frame (outer) */}
      <mesh
        position={[blankR + standH, 0, 0]}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
        castShadow
      >
        <torusGeometry args={[ringR, 0.014, 16, 36]} />
        <meshStandardMaterial color={frameColor} metalness={0.95} roughness={0.2} />
      </mesh>
      {/* Ceramic insert (SiC) — bluish sheen */}
      <mesh
        position={[blankR + standH, 0, 0]}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
      >
        <torusGeometry args={[ringR - 0.004, 0.006, 14, 36]} />
        <meshPhysicalMaterial
          color="#1b2230"
          metalness={0.6}
          roughness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.05}
          emissive={accent}
          emissiveIntensity={0.05}
        />
      </mesh>
      {/* Ring center disc (very thin, dark to read as a hole) */}
      <mesh
        position={[blankR + standH, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <ringGeometry args={[ringR - 0.012, ringR - 0.006, 36]} />
        <meshStandardMaterial color="#050505" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function SpinningReel({ accent }: { accent: string }) {
  const spool = useRef<THREE.Group>(null);
  const handle = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (handle.current) handle.current.rotation.x = t * 0.6;
    if (spool.current) spool.current.rotation.y = Math.sin(t * 0.7) * 0.4;
  });
  return (
    <group rotation={[0, 0, Math.PI]} position={[0, 0, 0]}>
      {/* Reel foot */}
      <mesh position={[0, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.06, 0.35, 0.12]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.95} roughness={0.2} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.22, 20]} />
        <meshStandardMaterial color="#161616" metalness={0.9} roughness={0.25} />
      </mesh>
      {/* Body */}
      <mesh position={[0, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.13, 0.08, 8, 24]} />
        <meshPhysicalMaterial
          color="#0e0e0e"
          metalness={0.9}
          roughness={0.2}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
        />
      </mesh>
      {/* Accent ring on body */}
      <mesh position={[0, -0.02, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.085, 0.012, 12, 32]} />
        <meshStandardMaterial color={accent} metalness={0.95} roughness={0.18} />
      </mesh>
      {/* Spool */}
      <group ref={spool} position={[0, -0.02, -0.18]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.13, 0.13, 0.08, 32]} />
          <meshStandardMaterial color="#1c1c1c" metalness={0.95} roughness={0.18} />
        </mesh>
        {/* Line on spool */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.115, 0.115, 0.055, 32]} />
          <meshStandardMaterial color="#e8e2c8" roughness={0.6} />
        </mesh>
        {/* Spool lip */}
        <mesh position={[0, 0, -0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.13, 0.008, 10, 32]} />
          <meshStandardMaterial color={accent} metalness={0.95} roughness={0.18} />
        </mesh>
        {/* Drag knob */}
        <mesh position={[0, 0, -0.08]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.06, 0.03, 16]} />
          <meshStandardMaterial color={accent} metalness={0.95} roughness={0.2} />
        </mesh>
        {/* Bail wire arc */}
        <mesh position={[0, 0.13, -0.04]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.14, 0.006, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#cfcfcf" metalness={1} roughness={0.1} />
        </mesh>
      </group>
      {/* Rotor arm */}
      <mesh position={[0, -0.02, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.11, 0.018, 12, 32]} />
        <meshStandardMaterial color="#141414" metalness={0.95} roughness={0.2} />
      </mesh>
      {/* Handle arm + knob */}
      <group ref={handle} position={[0.16, -0.02, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.18, 12]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.95} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, 0.09]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color={accent} metalness={0.95} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, -0.09]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color={accent} metalness={0.95} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

/* ---------------- Main rod ---------------- */

function Rod({ accent = "#c97f3d", interactive = false }: { accent?: string; interactive?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const carbonTex = useCarbonWeaveTexture();
  const corkTex = useCorkTexture();

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

  // Tapered blank
  const blankGeo = useMemo(() => {
    const points: THREE.Vector2[] = [];
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const r = BUTT_R * Math.pow(1 - t, 1.6) + TIP_R;
      const y = -LENGTH / 2 + t * LENGTH;
      points.push(new THREE.Vector2(r, y));
    }
    return new THREE.LatheGeometry(points, 64);
  }, []);

  // Guide positions (logarithmic spacing — closer near tip)
  const guides = [
    { y: -LENGTH / 2 + 1.25, ringR: 0.085, doubleFoot: true },
    { y: -LENGTH / 2 + 2.15, ringR: 0.07, doubleFoot: true },
    { y: -LENGTH / 2 + 3.0, ringR: 0.055 },
    { y: -LENGTH / 2 + 3.8, ringR: 0.045 },
    { y: -LENGTH / 2 + 4.48, ringR: 0.038 },
    { y: -LENGTH / 2 + 5.02, ringR: 0.032 },
    { y: -LENGTH / 2 + 5.45, ringR: 0.028 },
    { y: -LENGTH / 2 + 5.78, ringR: 0.025 },
  ];

  // Decorative trim near foregrip (diamond/cross wrap stack)
  const trimY = -LENGTH / 2 + 0.95;
  const trimGroup = [
    { y: trimY - 0.04, color: "#f4ead4", w: 0.01 },
    { y: trimY - 0.025, color: "#0a0a0a", w: 0.008 },
    { y: trimY, color: accent, w: 0.08 },
    { y: trimY + 0.05, color: "#0a0a0a", w: 0.008 },
    { y: trimY + 0.065, color: "#f4ead4", w: 0.01 },
  ];

  return (
    <group ref={group} rotation={[0, 0, Math.PI / 4]}>
      {/* Gimbal / fighting butt */}
      <group position={[0, -LENGTH / 2 - 1.05, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.17, 0.13, 0.18, 8]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <torusGeometry args={[0.17, 0.012, 8, 24]} />
          <meshStandardMaterial color={accent} metalness={0.95} roughness={0.2} />
        </mesh>
      </group>

      {/* Rubber butt cap accent ring */}
      <mesh position={[0, -LENGTH / 2 - 0.93, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.17, 0.04, 32]} />
        <meshStandardMaterial color={accent} metalness={0.95} roughness={0.2} />
      </mesh>

      {/* Rear cork grip */}
      <CorkGrip
        position={[0, -LENGTH / 2 - 0.55, 0]}
        length={0.7}
        rTop={0.18}
        rBottom={0.17}
        texture={corkTex}
      />

      {/* Reel seat */}
      <group position={[0, -LENGTH / 2 - 0.05, 0]}>
        {/* Carbon barrel */}
        <mesh castShadow>
          <cylinderGeometry args={[0.21, 0.21, 0.42, 48]} />
          <meshPhysicalMaterial
            map={carbonTex}
            metalness={0.7}
            roughness={0.25}
            clearcoat={0.8}
            clearcoatRoughness={0.15}
          />
        </mesh>
        {/* Hood */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.2, 0.1, 32]} />
          <meshStandardMaterial color={accent} metalness={0.95} roughness={0.18} />
        </mesh>
        {/* Locking nut */}
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.23, 0.23, 0.09, 32]} />
          <meshStandardMaterial color={accent} metalness={0.95} roughness={0.2} />
        </mesh>
        {/* Knurl rings */}
        {Array.from({ length: 14 }).map((_, i) => {
          const angle = (i / 14) * Math.PI * 2;
          return (
            <mesh
              key={`k${i}`}
              position={[Math.cos(angle) * 0.225, -0.2, Math.sin(angle) * 0.225]}
            >
              <boxGeometry args={[0.012, 0.085, 0.012]} />
              <meshStandardMaterial color="#241a10" metalness={0.9} roughness={0.35} />
            </mesh>
          );
        })}
        {/* Trim rings */}
        {[-0.16, -0.13, 0.13, 0.16].map((y, i) => (
          <mesh key={`tr${i}`} position={[0, y, 0]}>
            <torusGeometry args={[0.225, 0.005, 8, 36]} />
            <meshStandardMaterial color="#f4ead4" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
        {/* Reel attached on the hood side */}
        <SpinningReel accent={accent} />
      </group>

      {/* Winding check ring (transition collar) */}
      <group position={[0, -LENGTH / 2 + 0.22, 0]}>
        <mesh>
          <cylinderGeometry args={[0.16, 0.17, 0.04, 36]} />
          <meshStandardMaterial color={accent} metalness={0.95} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.025, 0]}>
          <torusGeometry args={[0.16, 0.004, 8, 32]} />
          <meshStandardMaterial color="#f4ead4" metalness={0.5} roughness={0.4} />
        </mesh>
      </group>

      {/* Foregrip (short cork) */}
      <CorkGrip
        position={[0, -LENGTH / 2 + 0.45, 0]}
        length={0.35}
        rTop={0.15}
        rBottom={0.16}
        texture={corkTex}
      />

      {/* Tapered carbon blank */}
      <mesh geometry={blankGeo} castShadow receiveShadow>
        <meshPhysicalMaterial
          map={carbonTex}
          color="#0a0a0a"
          roughness={0.25}
          metalness={0.55}
          clearcoat={1}
          clearcoatRoughness={0.12}
        />
      </mesh>

      {/* Decorative signature wrap stack near foregrip */}
      {trimGroup.map((b, i) => {
        const r = radiusAt(b.y) + 0.006;
        return (
          <mesh key={`b${i}`} position={[0, b.y, 0]} castShadow>
            <cylinderGeometry args={[r, r, b.w, 48]} />
            <meshStandardMaterial color={b.color} metalness={b.color === accent ? 0.2 : 0.7} roughness={0.45} />
          </mesh>
        );
      })}

      {/* Builder's signature plate (tiny) */}
      <mesh position={[radiusAt(trimY) + 0.012, trimY + 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.012, 0.07, 0.018]} />
        <meshStandardMaterial color="#f4ead4" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Guides */}
      {guides.map((g, i) => {
        const r = radiusAt(g.y);
        return (
          <Guide
            key={`g${i}`}
            y={g.y}
            blankR={r}
            ringR={g.ringR}
            accent={accent}
            doubleFoot={g.doubleFoot}
          />
        );
      })}

      {/* Hook keeper */}
      <Guide y={-LENGTH / 2 + 0.78} blankR={radiusAt(-LENGTH / 2 + 0.78)} ringR={0.028} accent={accent} small />

      {/* Tip top */}
      <group position={[0, LENGTH / 2, 0]}>
        <mesh>
          <cylinderGeometry args={[TIP_R + 0.005, TIP_R + 0.005, 0.06, 16]} />
          <meshStandardMaterial color={accent} metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.025, 0.005, 14, 28]} />
          <meshStandardMaterial color={accent} metalness={0.95} roughness={0.15} />
        </mesh>
        {/* Ceramic tip insert */}
        <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.02, 0.0025, 10, 24]} />
          <meshPhysicalMaterial color="#1b2230" metalness={0.6} roughness={0.1} clearcoat={1} />
        </mesh>
      </group>
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
