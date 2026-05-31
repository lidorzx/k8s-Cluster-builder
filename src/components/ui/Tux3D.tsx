import { Component, Suspense, useEffect, useRef, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { TuxMascot } from './TuxMascot';

// Shared, normalized cursor position (-1..1 across the viewport).
const pointer = { x: 0, y: 0 };

// Light, mostly-diffuse frame so the glasses read bright against the black head
// (a metallic frame just mirrors the dark scene and disappears).
const FRAME = '#eef1f6';

function Lens({ x }: { x: number }) {
  return (
    <group position={[x, 0, 0]}>
      {/* bright frame rim */}
      <mesh>
        <torusGeometry args={[0.185, 0.03, 16, 44]} />
        <meshStandardMaterial color={FRAME} metalness={0.25} roughness={0.45} />
      </mesh>
      {/* visible glossy blue lens */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.005]}>
        <cylinderGeometry args={[0.17, 0.17, 0.05, 40]} />
        <meshPhysicalMaterial color="#1f4488" metalness={0.2} roughness={0.14} clearcoat={1} clearcoatRoughness={0.06} />
      </mesh>
      {/* glowing eye on the lens */}
      <mesh position={[0, 0, 0.045]}>
        <sphereGeometry args={[0.062, 24, 24]} />
        <meshStandardMaterial color="#062b27" emissive="#22d3ee" emissiveIntensity={4.2} toneMapped={false} />
      </mesh>
    </group>
  );
}

function EarCup({ x }: { x: number }) {
  const side = Math.sign(x) || 1;
  return (
    <group position={[x, 0.28, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.14, 32]} />
        <meshStandardMaterial color="#1c1c25" metalness={0.55} roughness={0.4} />
      </mesh>
      {/* brand-glow ring on the outer face */}
      <mesh position={[side * 0.08, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.12, 0.018, 14, 36]} />
        <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Penguin() {
  const group = useRef<THREE.Group>(null!);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.position.y = -0.05 + Math.sin(t * 1.1) * 0.05; // idle bob
    const yaw = pointer.x * 0.6;
    const pitch = pointer.y * 0.32; // mouse above → look up, below → look down
    g.rotation.y += (yaw - g.rotation.y) * 0.07;
    g.rotation.x += (pitch - g.rotation.x) * 0.07;
    g.rotation.z += (-yaw * 0.12 - g.rotation.z) * 0.07; // playful head-cock
  });

  return (
    <group ref={group} dispose={null}>
      {/* body */}
      <mesh castShadow scale={[1, 1.34, 0.96]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial color="#17171f" roughness={0.42} clearcoat={1} clearcoatRoughness={0.32} />
      </mesh>

      {/* white belly */}
      <mesh position={[0, -0.12, 0.5]} scale={[0.64, 0.98, 0.55]}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial color="#f4f6fb" roughness={0.55} />
      </mesh>

      {/* beak */}
      <mesh position={[0, 0.2, 0.98]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.21, 0.42, 32]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* flippers */}
      <mesh position={[-0.97, -0.05, 0]} rotation={[0, 0, 0.5]} scale={[0.16, 0.62, 0.4]} castShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial color="#121218" roughness={0.45} clearcoat={0.7} />
      </mesh>
      <mesh position={[0.97, -0.05, 0]} rotation={[0, 0, -0.5]} scale={[0.16, 0.62, 0.4]} castShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial color="#121218" roughness={0.45} clearcoat={0.7} />
      </mesh>

      {/* feet */}
      <mesh position={[-0.34, -1.16, 0.32]} rotation={[-0.2, 0, 0]} scale={[0.3, 0.12, 0.52]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.5} />
      </mesh>
      <mesh position={[0.34, -1.16, 0.32]} rotation={[-0.2, 0, 0]} scale={[0.3, 0.12, 0.52]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.5} />
      </mesh>

      {/* cool chrome glasses with glowing eyes */}
      <group position={[0, 0.42, 0.83]}>
        <Lens x={-0.21} />
        <Lens x={0.21} />
        {/* bridge */}
        <mesh position={[0, 0.02, 0.02]}>
          <boxGeometry args={[0.13, 0.03, 0.04]} />
          <meshStandardMaterial color={FRAME} metalness={0.25} roughness={0.45} />
        </mesh>
        {/* temple arms back toward the headphones */}
        <mesh position={[-0.42, 0.03, -0.18]} rotation={[0, 0.7, 0]}>
          <boxGeometry args={[0.42, 0.03, 0.04]} />
          <meshStandardMaterial color={FRAME} metalness={0.25} roughness={0.45} />
        </mesh>
        <mesh position={[0.42, 0.03, -0.18]} rotation={[0, -0.7, 0]}>
          <boxGeometry args={[0.42, 0.03, 0.04]} />
          <meshStandardMaterial color={FRAME} metalness={0.25} roughness={0.45} />
        </mesh>
      </group>

      {/* headphones — band hugging the head + ear cups on the sides */}
      <mesh position={[0, 0.28, 0]}>
        <torusGeometry args={[0.99, 0.07, 16, 64, Math.PI]} />
        <meshStandardMaterial color="#1b1b22" metalness={0.55} roughness={0.4} />
      </mesh>
      <EarCup x={-0.95} />
      <EarCup x={0.95} />
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 4]} intensity={2.4} castShadow shadow-mapSize={[1024, 1024]} />
      {/* spotlight from above for the cinematic look */}
      <spotLight position={[1, 6, 3]} angle={0.5} penumbra={0.8} intensity={45} color="#dfe7ff" castShadow />
      {/* soft frontal fill so the face/belly read */}
      <pointLight position={[0, 1.5, 4.5]} intensity={14} color="#ffffff" />
      {/* colored rim lights */}
      <pointLight position={[-4, 1, 2]} intensity={28} color="#38bdf8" />
      <pointLight position={[4, 0.5, 1]} intensity={22} color="#6366f1" />

      <Penguin />

      <ContactShadows position={[0, -1.3, 0]} opacity={0.55} scale={7} blur={2.8} far={3.2} color="#05070f" />

      {/* local reflections (no external HDRI) */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.2} position={[0, 3, 3]} scale={[6, 4, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#6366f1" position={[-4, 1, 2]} scale={[3, 4, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#38bdf8" position={[4, 1, 2]} scale={[3, 4, 1]} />
      </Environment>
    </>
  );
}

interface BoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}
class WebGLBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function Tux3D({ className }: { className?: string }) {
  const fallback = <TuxMascot className={className} />;
  return (
    <WebGLBoundary fallback={fallback}>
      <div className={className}>
        <Canvas
          shadows
          dpr={[1, 1.8]}
          camera={{ position: [0, 0.15, 6.6], fov: 30 }}
          gl={{ antialias: true, alpha: true }}
          style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>
    </WebGLBoundary>
  );
}
