import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/** A stylised woman in a flowing evening gown, walking toward the viewer. */

const SKIN = "#e8c9ae";
const GOWN = "#2b2b33";
const GOWN_SHEEN = "#d4af37";
const HAIR = "#141014";

function Limb({
  refObj,
  length,
  radius,
  color,
}: {
  refObj: React.RefObject<THREE.Group | null>;
  length: number;
  radius: number;
  color: string;
}) {
  return (
    <group ref={refObj}>
      <mesh castShadow position={[0, -length / 2, 0]}>
        <capsuleGeometry args={[radius, length * 0.8, 8, 24]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.05} />
      </mesh>
    </group>
  );
}

function WalkingWoman({ reduced }: { reduced: boolean }) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const skirt = useRef<THREE.Mesh>(null);
  const hair = useRef<THREE.Mesh>(null);

  // Deformable gown so the hem ripples as she walks.
  const skirtGeo = useMemo(() => {
    const g = new THREE.ConeGeometry(0.72, 1.6, 64, 18, true);
    g.translate(0, -0.8, 0);
    const attr = g.attributes["position"] as THREE.BufferAttribute;
    attr.setUsage(THREE.DynamicDrawUsage);
    g.userData["base"] = Float32Array.from(attr.array);
    return g;

  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const walk = reduced ? 0 : t * 2.6;

    if (root.current) {
      // Approach the camera on a slow loop, then restart further back.
      const cycle = reduced ? 0.55 : (t * 0.07) % 1;
      const z = THREE.MathUtils.lerp(-9.5, -1.2, cycle);
      root.current.position.z = z;
      root.current.position.y = reduced ? 0 : Math.abs(Math.sin(walk)) * 0.05;
      root.current.rotation.y = reduced ? 0 : state.pointer.x * 0.35 + Math.sin(t * 0.4) * 0.06;
      const fade = cycle > 0.86 ? 1 - (cycle - 0.86) / 0.14 : Math.min(1, cycle / 0.08);
      root.current.scale.setScalar(0.98 + fade * 0.02);
      root.current.visible = fade > 0.02;
      root.current.traverse((o) => {
        const m = (o as THREE.Mesh).material as THREE.Material | undefined;
        if (m && "opacity" in m) {
          const mat = m as THREE.MeshStandardMaterial;
          mat.transparent = fade < 0.995;
          mat.opacity = fade;
          mat.depthWrite = true;
        }
      });
    }

    if (body.current) {
      body.current.rotation.z = reduced ? 0 : Math.sin(walk) * 0.05;
      body.current.position.y = reduced ? 0 : Math.sin(walk * 2) * 0.03;
    }
    const swing = reduced ? 0 : Math.sin(walk) * 0.55;
    if (armL.current) armL.current.rotation.x = swing;
    if (armR.current) armR.current.rotation.x = -swing;
    if (legL.current) legL.current.rotation.x = -swing * 0.75;
    if (legR.current) legR.current.rotation.x = swing * 0.75;
    if (hair.current) hair.current.rotation.z = reduced ? 0 : Math.sin(walk) * 0.08;

    if (skirt.current && !reduced) {
      const pos = skirt.current.geometry.attributes["position"] as THREE.BufferAttribute;
      const base = skirt.current.geometry.userData["base"] as Float32Array;
      for (let i = 0; i < pos.count; i++) {
        const bx = base[i * 3] ?? 0;
        const by = base[i * 3 + 1] ?? 0;
        const bz = base[i * 3 + 2] ?? 0;
        const depth = THREE.MathUtils.clamp(-by / 1.6, 0, 1);
        const wave = Math.sin(walk * 1.2 + bx * 3 + bz * 2) * 0.09 * depth * depth;
        pos.setXYZ(i, bx + wave, by + Math.abs(wave) * 0.25, bz + wave * 0.7);
      }

      pos.needsUpdate = true;
      skirt.current.geometry.computeVertexNormals();
    }

    // gentle settle
    if (root.current) root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, 0, 3, delta);
  });

  return (
    <group ref={root} position={[1.45, -1.55, -4]}>
      <group ref={body}>
        {/* gown skirt */}
        <mesh ref={skirt} geometry={skirtGeo} position={[0, 1.86, 0]} castShadow>
          <meshStandardMaterial
            color={GOWN}
            roughness={0.42}
            metalness={0.35}
            side={THREE.DoubleSide}
            emissive={GOWN_SHEEN}
            emissiveIntensity={0.05}
          />
        </mesh>
        {/* bodice */}
        <mesh castShadow position={[0, 2.24, 0]} scale={[1, 1, 0.7]}>
          <capsuleGeometry args={[0.2, 0.46, 10, 36]} />
          <meshStandardMaterial color={GOWN} roughness={0.35} metalness={0.5} />
        </mesh>
        {/* shoulders / décolleté */}
        <mesh castShadow position={[0, 2.58, 0]} scale={[1.3, 0.5, 0.82]}>
          <sphereGeometry args={[0.21, 40, 40]} />
          <meshStandardMaterial color={SKIN} roughness={0.55} />
        </mesh>
        {/* belt */}
        <mesh position={[0, 1.9, 0]} scale={[1, 1, 0.7]}>
          <torusGeometry args={[0.21, 0.03, 16, 64]} />
          <meshStandardMaterial color={GOWN_SHEEN} metalness={1} roughness={0.2} />
        </mesh>
        {/* neck + head */}
        <mesh castShadow position={[0, 2.78, 0]}>
          <cylinderGeometry args={[0.06, 0.075, 0.2, 24]} />
          <meshStandardMaterial color={SKIN} roughness={0.55} />
        </mesh>
        <mesh castShadow position={[0, 3.0, 0]} scale={[0.82, 1, 0.86]}>
          <sphereGeometry args={[0.17, 48, 48]} />
          <meshStandardMaterial color={SKIN} roughness={0.5} />
        </mesh>
        {/* hair */}
        <mesh ref={hair} castShadow position={[0, 2.99, -0.03]} scale={[1.08, 1.2, 1.08]}>
          <sphereGeometry args={[0.185, 40, 40, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color={HAIR} roughness={0.35} metalness={0.25} />
        </mesh>
        <mesh castShadow position={[0, 2.74, -0.13]} scale={[0.8, 1.5, 0.5]}>
          <sphereGeometry args={[0.16, 32, 32]} />
          <meshStandardMaterial color={HAIR} roughness={0.35} metalness={0.25} />
        </mesh>

        {/* arms */}
        <group position={[-0.25, 2.55, 0]}>
          <Limb refObj={armL} length={0.92} radius={0.05} color={SKIN} />
        </group>
        <group position={[0.25, 2.55, 0]}>
          <Limb refObj={armR} length={0.92} radius={0.05} color={SKIN} />
        </group>

        {/* legs (visible below the hem) */}
        <group position={[-0.1, 1.86, 0]}>
          <Limb refObj={legL} length={1.55} radius={0.07} color={SKIN} />
        </group>
        <group position={[0.1, 1.86, 0]}>
          <Limb refObj={legR} length={1.55} radius={0.07} color={SKIN} />
        </group>
      </group>
    </group>
  );
}

function OrbitingForm({
  radius,
  speed,
  offset,
  scale,
  gold,
  reduced,
}: {
  radius: number;
  speed: number;
  offset: number;
  scale: number;
  gold?: boolean;
  reduced: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = reduced ? offset : state.clock.elapsedTime * speed + offset;
    ref.current.position.set(Math.cos(t) * radius, Math.sin(t * 0.7) * 0.7 + 0.4, Math.sin(t) * radius - 2);
    ref.current.rotation.x = t * 0.5;
    ref.current.rotation.z = t * 0.3;
  });
  return (
    <mesh ref={ref} scale={scale} castShadow>
      <torusGeometry args={[0.35, 0.02, 16, 96]} />
      <meshStandardMaterial
        color={gold ? "#d4af37" : "#2a2a2a"}
        roughness={gold ? 0.2 : 0.55}
        metalness={gold ? 1 : 0.35}
      />
    </mesh>
  );
}


function Particles({ count = 420, reduced }: { count?: number; reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.028} color="#d4af37" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function CameraRig({ reduced }: { reduced: boolean }) {
  const { camera } = useThree();
  useFrame((state, delta) => {
    if (reduced) return;
    const x = state.pointer.x * 0.8;
    const y = 0.9 + state.pointer.y * 0.35;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, x, 1.6, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, y, 1.6, delta);
    camera.lookAt(0.2, 0.6, 0);
  });
  return null;
}

export default function HeroScene({ reduced = false }: { reduced?: boolean }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.9, 8.5], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
      aria-hidden="true"
    >
      <color attach="background" args={["#0a0a0a"]} />
      <fog attach="fog" args={["#0a0a0a", 14, 30]} />

      <ambientLight intensity={0.75} />
      <spotLight
        position={[4, 6, 4]}
        angle={0.45}
        penumbra={1}
        intensity={90}
        castShadow
        shadow-mapSize={[1024, 1024]}
        color="#fff6e0"
      />
      <spotLight position={[0, 4, 7]} angle={0.6} penumbra={1} intensity={160} color="#fff3dd" />
      <pointLight position={[-4, 1, -3]} intensity={40} color="#d4af37" />
      <pointLight position={[0, 1.4, 4]} intensity={26} color="#ffe9c4" />
      <pointLight position={[3, -2, 3]} intensity={12} color="#7a7a8c" />

      <CameraRig reduced={reduced} />

      <WalkingWoman reduced={reduced} />


      <OrbitingForm radius={3.4} speed={0.35} offset={0} scale={0.6} reduced={reduced} gold />
      <OrbitingForm radius={4.1} speed={-0.25} offset={2.2} scale={0.5} reduced={reduced} />
      <OrbitingForm radius={3.0} speed={0.45} offset={4.1} scale={0.38} reduced={reduced} />

      <Particles reduced={reduced} />

      <ContactShadows
        position={[0, -1.45, 0]}
        opacity={0.7}
        scale={12}
        blur={3}
        far={4}
        color="#000000"
      />
    </Canvas>
  );
}
