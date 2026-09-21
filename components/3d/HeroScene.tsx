"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Float, Html, Line } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const ACCENT = "#2DE2D0";
const VIOLET = "#8B9BFF";

interface SceneProps {
  active: boolean;
  reduced: boolean;
  mobile: boolean;
}

interface PanelSpec {
  id: string;
  group: "build" | "test";
  size: [number, number];
  position: [number, number, number];
  rotation: [number, number, number];
  kind: "code" | "check";
  label?: string;
  desktopOnly?: boolean;
}

const PANELS: PanelSpec[] = [
  { id: "b1", group: "build", size: [1.7, 1.1], position: [-1.7, 0.75, 0.4], rotation: [0, 0.35, 0.05], kind: "code", label: "BUILD" },
  { id: "b2", group: "build", size: [1.4, 0.9], position: [-1.25, -0.95, -0.6], rotation: [0, 0.25, -0.04], kind: "code" },
  { id: "b3", group: "build", size: [1.2, 0.8], position: [-2.5, -0.05, -1.3], rotation: [0, 0.45, 0], kind: "code", desktopOnly: true },
  { id: "t1", group: "test", size: [1.5, 1.0], position: [1.75, 0.45, 0.5], rotation: [0, -0.35, -0.04], kind: "check", label: "PASS" },
  { id: "t2", group: "test", size: [1.3, 0.85], position: [1.3, -1.0, -0.4], rotation: [0, -0.25, 0.05], kind: "check", label: "TEST" },
  { id: "t3", group: "test", size: [1.15, 0.75], position: [2.5, 0.95, -1.2], rotation: [0, -0.45, 0], kind: "check", desktopOnly: true },
];

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function Chip({ text, accent = false }: { text: string; accent?: boolean }) {
  return (
    <span
      style={{
        pointerEvents: "none",
        userSelect: "none",
        fontFamily: "var(--f-mono), monospace",
        fontSize: 10,
        letterSpacing: "0.18em",
        padding: "4px 8px",
        borderRadius: 999,
        border: `1px solid ${accent ? ACCENT : "rgba(255,255,255,0.28)"}`,
        color: accent ? "#031513" : "#F5F7FA",
        background: accent ? ACCENT : "rgba(5,5,5,0.55)",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}

function Panel({ spec, chips }: { spec: PanelSpec; chips: boolean }) {
  const [w, h] = spec.size;
  const lines = useMemo(
    () => [0.62, 0.9, 0.48, 0.74].map((len, i) => ({ y: h / 2 - 0.36 - i * 0.14, w: (w - 0.36) * len })),
    [w, h],
  );
  const isCheck = spec.kind === "check";
  return (
    <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.5} floatingRange={[-0.06, 0.06]}>
      <group position={spec.position} rotation={spec.rotation}>
        <mesh>
          <boxGeometry args={[w, h, 0.03]} />
          <meshStandardMaterial color="#0c141a" transparent opacity={0.72} metalness={0.4} roughness={0.35} />
          <Edges threshold={15} color={isCheck ? ACCENT : "#9fb2c4"} />
        </mesh>
        {/* title bar + window dots */}
        <mesh position={[0, h / 2 - 0.1, 0.02]}>
          <planeGeometry args={[w - 0.04, 0.14]} />
          <meshBasicMaterial color={isCheck ? ACCENT : VIOLET} transparent opacity={0.16} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[-w / 2 + 0.12 + i * 0.09, h / 2 - 0.1, 0.03]}>
            <circleGeometry args={[0.025, 12]} />
            <meshBasicMaterial color={i === 0 ? ACCENT : "#8B95A5"} />
          </mesh>
        ))}
        {isCheck ? (
          <>
            <Line
              points={[[-0.16, -0.02, 0.03], [-0.04, -0.14, 0.03], [0.2, 0.12, 0.03]]}
              color={ACCENT}
              lineWidth={2.5}
            />
            <mesh position={[0, -h / 2 + 0.2, 0.025]}>
              <planeGeometry args={[(w - 0.4) * 0.7, 0.025]} />
              <meshBasicMaterial color={ACCENT} transparent opacity={0.5} />
            </mesh>
          </>
        ) : (
          lines.map((l, i) => (
            <mesh key={i} position={[-w / 2 + 0.18 + l.w / 2, l.y, 0.025]}>
              <planeGeometry args={[l.w, 0.035]} />
              <meshBasicMaterial color={i === 1 ? ACCENT : "#F5F7FA"} transparent opacity={i === 1 ? 0.7 : 0.28} />
            </mesh>
          ))
        )}
        {chips && spec.label && (
          <Html position={[w / 2 - 0.1, h / 2 + 0.14, 0.05]} center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
            <Chip text={spec.label} accent={spec.label === "PASS"} />
          </Html>
        )}
      </group>
    </Float>
  );
}

function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // deterministic pseudo-random distribution on a shell
      const a = (i * 2.399963) % (Math.PI * 2);
      const r = 3 + ((i * 7919) % 100) / 100 * 3.2;
      const y = (((i * 104729) % 1000) / 1000 - 0.5) * 6;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = Math.sin(a) * r - 1;
    }
    return arr;
  }, [count]);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.02;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.028} color="#8B95A5" transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Rig({ reduced, mobile }: { reduced: boolean; mobile: boolean }) {
  const root = useRef<THREE.Group>(null);
  const core = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const build = useRef<THREE.Group>(null);
  const test = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  // Window-level pointer so the canvas can stay behind the page content.
  useEffect(() => {
    if (mobile) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mobile]);
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const p = Math.min(1.5, window.scrollY / window.innerHeight);
    const split = smooth(0.2, 1.05, p);
    const wide = viewport.width > 8;
    const px = reduced ? 0 : pointer.current.x;
    const py = reduced ? 0 : pointer.current.y;
    // Frame-rate independent easing; snap straight to target when frames are on-demand.
    const k = reduced ? 1 : 1 - Math.pow(0.001, dt);

    if (root.current) {
      const targetX = wide ? viewport.width * 0.17 : 0;
      const targetY = wide ? 0.5 : viewport.height * 0.26;
      const sway = mobile && !reduced ? Math.sin(t * 0.4) * 0.25 : 0;
      root.current.position.x += (targetX - root.current.position.x) * k;
      root.current.position.y += (targetY - root.current.position.y) * k;
      root.current.rotation.y += ((px * 0.4 + sway + p * 0.7) - root.current.rotation.y) * k;
      root.current.rotation.x += ((-py * 0.22 - p * 0.1) - root.current.rotation.x) * k;
      const s = (mobile ? 0.62 : wide ? 0.92 : 0.8) * (1 - split * 0.15);
      root.current.scale.setScalar(s);
    }
    if (core.current && !reduced) {
      core.current.rotation.y = t * 0.16 + p * 1.6;
      core.current.rotation.x = Math.sin(t * 0.3) * 0.15;
    }
    if (shell.current && !reduced) shell.current.rotation.z = -t * 0.08;
    // The two halves drift apart as the hero hands over to the About section.
    if (build.current) build.current.position.x += ((-split * 3.4 + px * -0.22) - build.current.position.x) * k;
    if (test.current) test.current.position.x += ((split * 3.4 + px * 0.22) - test.current.position.x) * k;
  });

  const panels = PANELS.filter((p) => !(mobile && p.desktopOnly));

  return (
    <group ref={root}>
      <group ref={core}>
        <mesh>
          <icosahedronGeometry args={[0.82, 1]} />
          <meshPhysicalMaterial
            color="#0a1c1e"
            transparent
            opacity={0.55}
            roughness={0.12}
            metalness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.1}
            flatShading
          />
          <Edges threshold={1} color={ACCENT} />
        </mesh>
        <mesh scale={0.42}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color={ACCENT} wireframe />
        </mesh>
      </group>
      <mesh ref={shell} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.32, 0.006, 8, 96]} />
        <meshBasicMaterial color="#F5F7FA" transparent opacity={0.35} />
      </mesh>

      <group ref={build}>
        {panels.filter((p) => p.group === "build").map((p) => (
          <Panel key={p.id} spec={p} chips={!mobile} />
        ))}
      </group>
      <group ref={test}>
        {panels.filter((p) => p.group === "test").map((p) => (
          <Panel key={p.id} spec={p} chips />
        ))}
        {!mobile && (
          <Html position={[0, 1.4, 0.3]} center zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
            <Chip text="SHIP" />
          </Html>
        )}
      </group>
    </group>
  );
}

export default function HeroScene({ active, reduced, mobile }: SceneProps) {
  return (
    <Canvas
      frameloop={active && !reduced ? "always" : "demand"}
      dpr={mobile ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 0, 7], fov: 40 }}
      gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <ambientLight intensity={0.55} />
      <pointLight position={[3, 3, 4]} intensity={40} color={ACCENT} />
      <pointLight position={[-4, -2, 3]} intensity={26} color={VIOLET} />
      <Rig reduced={reduced} mobile={mobile} />
      <Particles count={mobile ? 90 : 320} />
    </Canvas>
  );
}

