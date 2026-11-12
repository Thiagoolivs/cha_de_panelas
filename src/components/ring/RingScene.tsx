"use client";

/**
 * Aliança 3D (three.js via React Three Fiber). A cena lê o progresso da rolagem
 * (0..1) e a aliança gira, vem na direção da câmera e atravessa a tela.
 * Ambiente gerado localmente (RoomEnvironment), sem baixar HDR.
 */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const GOLD = "#e3c07a";

function Env() {
  const gl = useThree((s) => s.gl);
  const env = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const tex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    return tex;
  }, [gl]);
  useEffect(() => () => env.dispose(), [env]);
  return <primitive object={env} attach="environment" />;
}

/** Perfil do diamante (lapidação brilhante simplificada), girado em torno de y. */
function useDiamondGeometry() {
  return useMemo(() => {
    const pts = [
      new THREE.Vector2(0, -0.34),
      new THREE.Vector2(0.3, -0.02),
      new THREE.Vector2(0.31, 0.02),
      new THREE.Vector2(0.2, 0.15),
      new THREE.Vector2(0, 0.16),
    ];
    const g = new THREE.LatheGeometry(pts, 8);
    return g.toNonIndexed();
  }, []);
}

const ease = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

function Ring({ progress, still }: { progress: MotionValue<number> | null; still: boolean }) {
  const group = useRef<THREE.Group>(null);
  const diamond = useDiamondGeometry();
  const t0 = useRef(0);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    t0.current += dt;
    const p = still || !progress ? 0 : progress.get();
    // 0–0.2: flutua girando; 0.2–0.8: vem para a câmera e vira o aro para ela
    const fly = ease(seg(p, 0.18, 0.82));
    const spin = still ? 0.6 : t0.current * 0.5 + p * 7;
    g.position.z = THREE.MathUtils.lerp(0, 9.4, fly);
    g.position.y = Math.sin(t0.current * 1.2) * 0.05 * (1 - fly) - fly * 0.15;
    g.rotation.x = THREE.MathUtils.lerp(-0.45, 0, fly) + Math.sin(t0.current * 0.7) * 0.06 * (1 - fly);
    g.rotation.y = THREE.MathUtils.lerp(spin, Math.round(spin / Math.PI) * Math.PI, fly);
    g.rotation.z = THREE.MathUtils.lerp(0.18, 0, fly);
    state.invalidate();
  });

  return (
    <group ref={group}>
      {/* aro: toro achatado */}
      <mesh scale={[1, 1, 1.9]}>
        <torusGeometry args={[1, 0.085, 48, 220]} />
        <meshPhysicalMaterial color={GOLD} metalness={1} roughness={0.16} clearcoat={0.4} clearcoatRoughness={0.1} envMapIntensity={1.4} />
      </mesh>
      {/* garras */}
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.17, 1.17, Math.sin(a) * 0.17]} rotation={[Math.sin(a) * 0.3, 0, -Math.cos(a) * 0.3]}>
            <cylinderGeometry args={[0.022, 0.03, 0.28, 10]} />
            <meshPhysicalMaterial color={GOLD} metalness={1} roughness={0.2} />
          </mesh>
        );
      })}
      <mesh position={[0, 1.09, 0]}>
        <cylinderGeometry args={[0.13, 0.09, 0.12, 24]} />
        <meshPhysicalMaterial color={GOLD} metalness={1} roughness={0.2} />
      </mesh>
      {/* diamante */}
      {/* diamante: facetas espelhadas (barato no celular, brilha com o ambiente) */}
      <mesh geometry={diamond} position={[0, 1.36, 0]} scale={0.78}>
        <meshStandardMaterial color="#eef3ff" metalness={1} roughness={0.02} envMapIntensity={2.6} flatShading />
      </mesh>
    </group>
  );
}

export default function RingScene({ progress, still = false }: { progress: MotionValue<number> | null; still?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 10], fov: 32, near: 0.05, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    >
      <Env />
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />
      <directionalLight position={[-4, -2, 2]} intensity={0.6} color="#fff3dc" />
      <Ring progress={progress} still={still} />
    </Canvas>
  );
}
