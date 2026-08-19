import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { world } from "../lib/world";
import { IMG } from "../data/projects";

/* ---------------- helpers ---------------- */

const loader = new THREE.TextureLoader();
loader.setCrossOrigin("anonymous");

function useTex(url: string) {
  return useMemo(() => {
    const t = loader.load(url);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [url]);
}

const inWindow = (a: number, b: number) => world.dCine > a - 0.015 && world.dCine < b + 0.015;

function useWindow(a: number, b: number) {
  const ref = useRef<THREE.Group>(null!);
  useFrame(() => {
    ref.current.visible = inWindow(a, b);
  });
  return ref;
}

function makeWindowTexture() {
  const c = document.createElement("canvas");
  c.width = 96; c.height = 192;
  const g = c.getContext("2d")!;
  g.fillStyle = "#0D0F16";
  g.fillRect(0, 0, 96, 192);
  const lit = ["#9FC0FF", "#D6E4FF", "#6E93E8", "#BFD4FF"];
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 6; x++) {
      if (Math.random() < 0.3) {
        g.fillStyle = lit[(Math.random() * lit.length) | 0];
        g.globalAlpha = 0.35 + Math.random() * 0.65;
        g.fillRect(6 + x * 15, 8 + y * 11.4, 8, 6);
      }
    }
  }
  g.globalAlpha = 1;
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.magFilter = THREE.NearestFilter;
  t.repeat.set(2, 4);
  return t;
}

function makeLabelTexture(text: string, color = "#6E675A") {
  const c = document.createElement("canvas");
  c.width = 640; c.height = 96;
  const g = c.getContext("2d")!;
  g.clearRect(0, 0, 640, 96);
  g.font = "400 34px 'Space Mono', monospace";
  g.fillStyle = color;
  g.textBaseline = "middle";
  g.fillText(text, 8, 52);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeStreakTexture() {
  const c = document.createElement("canvas");
  c.width = 256; c.height = 256;
  const g = c.getContext("2d")!;
  g.clearRect(0, 0, 256, 256);
  for (let i = 0; i < 14; i++) {
    const y = Math.random() * 256;
    const grad = g.createLinearGradient(0, y - 5, 0, y + 5);
    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(0.5, `rgba(255,255,255,${0.05 + Math.random() * 0.1})`);
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, y - 5, 256, 10);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/* ---------------- shared bits ---------------- */

function FramedImage({
  url, w, h, pos, rotY = 0, rotX = 0, frame = "#211E18", float = 0,
}: {
  url: string; w: number; h: number; pos: [number, number, number];
  rotY?: number; rotX?: number; frame?: string; float?: number;
}) {
  const tex = useTex(url);
  const ref = useRef<THREE.Group>(null!);
  const seed = useMemo(() => Math.random() * 10, []);
  useFrame((state) => {
    if (!ref.current.visible) return;
    if (float > 0) ref.current.position.y = pos[1] + Math.sin(state.clock.elapsedTime * 0.6 + seed) * float;
  });
  return (
    <group ref={ref} position={pos} rotation={[rotX, rotY, 0]}>
      <mesh position={[0, 0, -0.045]}>
        <boxGeometry args={[w + 0.16, h + 0.16, 0.07]} />
        <meshStandardMaterial color={frame} roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Dust({ count, area, color, opacity = 0.45, speed = 0.12 }: {
  count: number; area: [number, number, number, number, number, number]; color: string; opacity?: number; speed?: number;
}) {
  const ref = useRef<THREE.Points>(null!);
  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = area[0] + Math.random() * area[1];
      positions[i * 3 + 1] = area[2] + Math.random() * area[3];
      positions[i * 3 + 2] = area[4] + Math.random() * area[5];
      seeds[i] = Math.random() * 20;
    }
    return { positions, seeds };
  }, [count, area]);
  useFrame((state) => {
    if (!ref.current?.parent?.visible) return;
    const t = state.clock.elapsedTime * speed;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      pos.setY(i, positions[i * 3 + 1] + Math.sin(t + seeds[i]) * 0.35);
      pos.setX(i, positions[i * 3] + Math.cos(t * 0.7 + seeds[i]) * 0.2);
    }
    pos.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.slice(), 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.035} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
}

/* ---------------- 00 · HERO ---------------- */

export function HeroZone() {
  const ref = useWindow(0, 0.22);
  const ring = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (ref.current.visible) ring.current.rotation.z = state.clock.elapsedTime * 0.05;
  });
  return (
    <group ref={ref}>
      {/* portrait — the person, first and last image of the film */}
      <FramedImage url={IMG.portrait} w={7.2} h={9} pos={[0, 0.4, -6]} frame="#0B0A07" />
      {/* coral mark */}
      <mesh ref={ring} position={[0, 0.4, -7.6]}>
        <torusGeometry args={[5.4, 0.016, 8, 120]} />
        <meshBasicMaterial color="#E4573D" transparent opacity={0.55} />
      </mesh>
      <mesh position={[0, 0.4, -6.18]}>
        <planeGeometry args={[22, 15]} />
        <meshBasicMaterial color="#0B0A07" />
      </mesh>
      {/* light veil the camera passes through — the hero becomes the world */}
      <mesh position={[0, 0.6, -6.5]}>
        <planeGeometry args={[70, 44]} />
        <meshBasicMaterial color="#EFEAE0" />
      </mesh>
      <Dust count={130} area={[-7, 14, -3, 7, -1, 9]} color="#C9B79A" opacity={0.35} />
    </group>
  );
}

/* ---------------- 01 · EXPERIMENTAL — Hinomori valley ---------------- */

function Torii({ pos, scale = 1, color = "#2B2320" }: { pos: [number, number, number]; scale?: number; color?: string }) {
  return (
    <group position={pos} scale={scale}>
      <mesh position={[-1.15, 1.55, 0]} rotation={[0, 0, 0.03]} castShadow>
        <cylinderGeometry args={[0.13, 0.16, 3.1, 10]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      <mesh position={[1.15, 1.55, 0]} rotation={[0, 0, -0.03]} castShadow>
        <cylinderGeometry args={[0.13, 0.16, 3.1, 10]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      <mesh position={[0, 3.18, 0]} castShadow>
        <boxGeometry args={[3.5, 0.2, 0.34]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      <mesh position={[0, 2.78, 0]}>
        <boxGeometry args={[2.9, 0.12, 0.26]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
    </group>
  );
}

function Petals({ count }: { count: number }) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const data = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: -8 + Math.random() * 16,
        y: Math.random() * 6.5,
        z: -24 - Math.random() * 38,
        s: 0.5 + Math.random() * 0.9,
        sp: 0.25 + Math.random() * 0.4,
        ph: Math.random() * 20,
      })),
    [count]
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useMemo(() => {
    // per-instance petal tints are applied once the mesh exists (see ref callback)
  }, []);
  useFrame((state) => {
    if (!ref.current?.parent?.visible) return;
    const t = state.clock.elapsedTime;
    data.forEach((d, i) => {
      const y = ((d.y - t * d.sp) % 6.5 + 6.5) % 6.5;
      dummy.position.set(d.x + Math.sin(t * 0.8 + d.ph) * 0.8, y, d.z);
      dummy.rotation.set(t * d.sp + d.ph, t * 0.6 + d.ph, Math.sin(t + d.ph) * 0.8);
      dummy.scale.setScalar(d.s);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh
      ref={(m) => {
        ref.current = m!;
        if (m && !m.userData.tinted) {
          const c = new THREE.Color();
          const palette = ["#F2ECDD", "#DCE5D4", "#EAD9CF", "#E8EFE4"];
          for (let i = 0; i < count; i++) {
            m.setColorAt(i, c.set(palette[i % palette.length]));
          }
          if (m.instanceColor) m.instanceColor.needsUpdate = true;
          m.userData.tinted = true;
        }
      }}
      args={[undefined, undefined, count]}
    >
      <planeGeometry args={[0.15, 0.1]} />
      <meshBasicMaterial color="#FFFFFF" side={THREE.DoubleSide} transparent opacity={0.9} depthWrite={false} />
    </instancedMesh>
  );
}

export function ExperimentalZone() {
  const ref = useWindow(0.12, 0.42);
  const shardRefs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame((state) => {
    if (!ref.current.visible) return;
    const t = state.clock.elapsedTime;
    shardRefs.current.forEach((m, i) => {
      if (!m) return;
      m.position.y = 1.6 + i * 0.5 + Math.sin(t * 0.7 + i * 2) * 0.25;
      m.rotation.y = t * 0.4 + i;
      m.rotation.x = Math.sin(t * 0.3 + i) * 0.5;
    });
  });
  return (
    <group ref={ref}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -42]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#E3DCCB" roughness={1} />
      </mesh>
      {/* path of gates — first one echoes the hero coral */}
      <Torii pos={[2.6, 0, -30]} scale={0.9} color="#B85C46" />
      <Torii pos={[-2.4, 0, -40]} scale={1.05} />
      <Torii pos={[2.2, 0, -50]} scale={1.2} />
      {/* the two installations carry the live projects */}
      <FramedImage url={IMG.hinomori} w={2.9} h={1.9} pos={[-2.5, 1.55, -35]} rotY={0.32} frame="#211D15" float={0.04} />
      <FramedImage url={IMG.japandays} w={2.9} h={1.9} pos={[2.7, 1.65, -45.5]} rotY={-0.34} frame="#211D15" float={0.04} />
      <mesh position={[-2.5, 0.3, -35]}>
        <boxGeometry args={[0.5, 0.6, 0.5]} />
        <meshStandardMaterial color="#C9C0AC" roughness={0.9} />
      </mesh>
      <mesh position={[2.7, 0.3, -45.5]}>
        <boxGeometry args={[0.5, 0.6, 0.5]} />
        <meshStandardMaterial color="#C9C0AC" roughness={0.9} />
      </mesh>
      {/* distant monoliths for depth */}
      <mesh position={[-7, 2.2, -56]} castShadow>
        <boxGeometry args={[1.1, 4.4, 1.1]} />
        <meshStandardMaterial color="#D8D0BD" roughness={0.95} />
      </mesh>
      <mesh position={[6.5, 2.8, -34]} castShadow>
        <boxGeometry args={[0.9, 5.6, 0.9]} />
        <meshStandardMaterial color="#D8D0BD" roughness={0.95} />
      </mesh>
      {/* soft green glass accents */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} ref={(el) => { shardRefs.current[i] = el; }} position={[-4 + i * 2.6, 2, -42 - i * 2]}>
          <octahedronGeometry args={[0.22, 0]} />
          <meshPhysicalMaterial color="#6F9A80" transparent opacity={0.55} roughness={0.15} metalness={0.1} />
        </mesh>
      ))}
      <Petals count={world.lowPower ? 46 : 110} />
      <Dust count={60} area={[-9, 18, 0, 6, -22, 40]} color="#FFFFFF" opacity={0.25} />
    </group>
  );
}

/* ---------------- 02 · DIGITAL WORLDS — the street ---------------- */

function Rain({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null!);
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = -11 + Math.random() * 22;
      positions[i * 3 + 1] = Math.random() * 10;
      positions[i * 3 + 2] = -68 - Math.random() * 50;
      velocities[i] = 5 + Math.random() * 4;
    }
    return { positions, velocities };
  }, [count]);
  useFrame((_, dt) => {
    if (!ref.current?.parent?.visible) return;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) - velocities[i] * dt;
      if (y < 0) y = 10;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.slice(), 3]} />
      </bufferGeometry>
      <pointsMaterial color="#A8BCE0" size={0.045} transparent opacity={0.32} depthWrite={false} sizeAttenuation />
    </points>
  );
}

export function CyberZone() {
  const ref = useWindow(0.34, 0.64);
  const windowTex = useMemo(() => makeWindowTexture(), []);
  const flicker = useRef<(THREE.Mesh | null)[]>([]);

  const buildings = useMemo(() => {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();
    const arr: THREE.Matrix4[] = [];
    for (let i = 0; i < 64; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (6.5 + Math.random() * 9);
      const z = -66 - Math.random() * 52;
      const h = 4 + Math.random() * 12;
      p.set(x, h / 2, z);
      s.set(2.4 + Math.random() * 2.4, h, 2.4 + Math.random() * 2.4);
      m.compose(p, q, s);
      arr.push(m.clone());
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current.visible) return;
    const t = state.clock.elapsedTime;
    flicker.current.forEach((mesh, i) => {
      if (!mesh) return;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      const f = 0.86 + 0.14 * Math.sin(t * 6.5 + i * 2.1) * Math.sin(t * 1.7 + i);
      mat.color.setScalar(0.75 + 0.25 * f);
    });
  });

  return (
    <group ref={ref}>
      {/* wet asphalt */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -92]}>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial color="#0B0B10" roughness={0.32} metalness={0.55} />
      </mesh>
      {/* instanced skyline */}
      <InstancedBuildings matrices={buildings} windowTex={windowTex} />
      {/* project billboards — three screens in the street */}
      <group position={[-4.6, 3.3, -84]} rotation={[0, 0.5, 0]}>
        <mesh ref={(el) => { flicker.current[0] = el; }}>
          <planeGeometry args={[4.4, 2.86]} />
          <meshBasicMaterial map={useTexMemo(IMG.seconds)} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, -0.06]}>
          <boxGeometry args={[4.7, 3.16, 0.1]} />
          <meshStandardMaterial color="#1B1D26" roughness={0.6} metalness={0.5} />
        </mesh>
        <mesh position={[0, -1.72, 0]}>
          <boxGeometry args={[4.7, 0.06, 0.06]} />
          <meshBasicMaterial color="#5C8AFF" toneMapped={false} />
        </mesh>
      </group>
      <group position={[4.7, 2.7, -94]} rotation={[0, -0.5, 0]}>
        <mesh ref={(el) => { flicker.current[1] = el; }}>
          <planeGeometry args={[4.4, 2.86]} />
          <meshBasicMaterial map={useTexMemo(IMG.city)} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, -0.06]}>
          <boxGeometry args={[4.7, 3.16, 0.1]} />
          <meshStandardMaterial color="#1B1D26" roughness={0.6} metalness={0.5} />
        </mesh>
        <mesh position={[0, 1.72, 0]}>
          <boxGeometry args={[4.7, 0.06, 0.06]} />
          <meshBasicMaterial color="#5C8AFF" toneMapped={false} />
        </mesh>
      </group>
      {/* gantry board overhead */}
      <group position={[0, 4.5, -106]}>
        <mesh ref={(el) => { flicker.current[2] = el; }} rotation={[0.14, 0, 0]}>
          <planeGeometry args={[5.2, 3.38]} />
          <meshBasicMaterial map={useTexMemo(IMG.lastinternet)} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, 0.07]}>
          <boxGeometry args={[5.5, 3.68, 0.1]} />
          <meshStandardMaterial color="#1B1D26" roughness={0.6} metalness={0.5} />
        </mesh>
        <mesh position={[-3.1, -2.2, 0.2]}>
          <boxGeometry args={[0.16, 4.6, 0.16]} />
          <meshStandardMaterial color="#22242E" roughness={0.5} metalness={0.6} />
        </mesh>
        <mesh position={[3.1, -2.2, 0.2]}>
          <boxGeometry args={[0.16, 4.6, 0.16]} />
          <meshStandardMaterial color="#22242E" roughness={0.5} metalness={0.6} />
        </mesh>
      </group>
      {/* restrained red signage */}
      <mesh position={[-6.3, 2.4, -86.5]}>
        <boxGeometry args={[0.09, 1.7, 0.09]} />
        <meshBasicMaterial color="#FF3B30" toneMapped={false} />
      </mesh>
      <mesh position={[6.4, 1.1, -99]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.07, 2.4, 0.07]} />
        <meshBasicMaterial color="#E4573D" toneMapped={false} />
      </mesh>
      <Rain count={world.lowPower ? 0 : 480} />
      <Dust count={50} area={[-8, 16, 0.2, 6, -66, 50]} color="#5C8AFF" opacity={0.2} />
    </group>
  );
}

/** Applies precomputed matrices to the instanced skyline (kept out of render loop). */
function InstancedBuildings({ matrices, windowTex }: { matrices: THREE.Matrix4[]; windowTex: THREE.Texture }) {
  return (
    <instancedMesh
      ref={(m) => {
        if (m && !m.userData.done) {
          matrices.forEach((mat, i) => m.setMatrixAt(i, mat));
          m.instanceMatrix.needsUpdate = true;
          m.userData.done = true;
        }
      }}
      args={[undefined, undefined, matrices.length]}
      frustumCulled={false}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#15161E"
        roughness={0.85}
        emissive="#9FC0FF"
        emissiveIntensity={0.55}
        emissiveMap={windowTex}
      />
    </instancedMesh>
  );
}

/** Texture loader usable inside JSX props without hooks-order issues. */
const texCache = new Map<string, THREE.Texture>();
function useTexMemo(url: string) {
  let t = texCache.get(url);
  if (!t) {
    t = loader.load(url);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    texCache.set(url, t);
  }
  return t;
}

/* ---------------- 03 · BRANDS — the Koppler counter ---------------- */

function Steam() {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const count = 26;
  const data = useMemo(
    () => Array.from({ length: count }, (_, i) => ({ ph: (i / count) * Math.PI * 2, sp: 0.14 + Math.random() * 0.1 })),
    []
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame((state) => {
    if (!ref.current?.parent?.visible) return;
    const t = state.clock.elapsedTime;
    data.forEach((d, i) => {
      const prog = ((t * d.sp + d.ph) % 1 + 1) % 1;
      dummy.position.set(
        Math.sin(t * 1.4 + d.ph) * 0.07 * prog,
        1.32 + prog * 1.1,
        -140 + Math.cos(t * 1.1 + d.ph) * 0.06 * prog
      );
      const s = 0.4 + prog * 1.3;
      dummy.scale.set(s, s, 1);
      dummy.rotation.z = Math.sin(t + d.ph) * 0.4;
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <planeGeometry args={[0.12, 0.3]} />
      <meshBasicMaterial color="#FFF8EC" transparent opacity={0.13} depthWrite={false} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

export function BrandsZone() {
  const ref = useWindow(0.58, 0.78);
  const cupProfile = useMemo(
    () =>
      [
        [0.001, 0], [0.14, 0], [0.17, 0.015], [0.155, 0.06], [0.145, 0.14],
        [0.15, 0.22], [0.175, 0.29], [0.185, 0.315], [0.17, 0.32],
      ].map(([x, y]) => new THREE.Vector2(x, y)),
    []
  );
  return (
    <group ref={ref}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -138]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#E7DCC8" roughness={1} />
      </mesh>
      <mesh position={[0, 3, -146.5]}>
        <planeGeometry args={[60, 12]} />
        <meshStandardMaterial color="#EADFCB" roughness={1} />
      </mesh>
      {/* counter */}
      <mesh position={[0, 0.92, -140]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.14, 1.5]} />
        <meshStandardMaterial color="#8A6746" roughness={0.55} />
      </mesh>
      <mesh position={[-1.4, 0.45, -140]}>
        <boxGeometry args={[0.14, 0.9, 1.3]} />
        <meshStandardMaterial color="#6E5138" roughness={0.7} />
      </mesh>
      <mesh position={[1.4, 0.45, -140]}>
        <boxGeometry args={[0.14, 0.9, 1.3]} />
        <meshStandardMaterial color="#6E5138" roughness={0.7} />
      </mesh>
      {/* cup + saucer + bag */}
      <group position={[-0.55, 0.99, -139.85]} scale={1.15}>
        <mesh position={[0, 0.008, 0]}>
          <cylinderGeometry args={[0.24, 0.22, 0.016, 24]} />
          <meshStandardMaterial color="#EFE6D6" roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.02, 0]} castShadow>
          <latheGeometry args={[cupProfile, 28]} />
          <meshStandardMaterial color="#F2EADA" roughness={0.3} />
        </mesh>
        <mesh position={[0.2, 0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.07, 0.018, 8, 20, Math.PI]} />
          <meshStandardMaterial color="#F2EADA" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.285, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.145, 24]} />
          <meshStandardMaterial color="#5C4632" roughness={0.4} />
        </mesh>
      </group>
      <group position={[0.55, 0.99, -140.15]} rotation={[0, -0.35, 0]}>
        <mesh position={[0, 0.34, 0]} castShadow>
          <boxGeometry args={[0.5, 0.68, 0.2]} />
          <meshStandardMaterial color="#B99B72" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.36, 0.105]}>
          <planeGeometry args={[0.34, 0.34]} />
          <meshStandardMaterial color="#EFE6D6" roughness={0.7} />
        </mesh>
      </group>
      <Steam />
      <FramedImage url={IMG.koppler} w={4.6} h={3} pos={[3.1, 2, -144]} rotY={-0.5} frame="#4A3A28" />
      <FramedImage url={IMG.koppler} w={1.5} h={0.98} pos={[-2.8, 1.55, -142.5]} rotY={0.55} frame="#4A3A28" />
      {/* hanging lamp */}
      <mesh position={[0, 3.4, -140]}>
        <cylinderGeometry args={[0.012, 0.012, 1.6, 6]} />
        <meshBasicMaterial color="#3A3128" />
      </mesh>
      <mesh position={[0, 2.55, -140]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.3, 0.34, 20, 1, true]} />
        <meshStandardMaterial color="#3A3128" roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
      <pointLight position={[0, 2.3, -140]} intensity={6} distance={9} decay={1.8} color="#FFDFA8" />
      <Dust count={46} area={[-5, 10, 0.4, 4, -134, 12]} color="#FFDFA8" opacity={0.3} />
    </group>
  );
}

/* ---------------- 04 · ARCHITECTURE — Cempaka courtyard ---------------- */

export function ArchZone() {
  const ref = useWindow(0.72, 0.92);
  const streakTex = useMemo(() => makeStreakTexture(), []);
  const streakRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ref.current.visible) return;
    streakTex.offset.x = state.clock.elapsedTime * 0.02;
    streakTex.offset.y = state.clock.elapsedTime * 0.008;
  });
  return (
    <group ref={ref}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -184]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#DDD5C6" roughness={0.95} />
      </mesh>
      {/* still pool */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.6, 0.02, -184]}>
        <planeGeometry args={[8.5, 5.4]} />
        <meshStandardMaterial color="#A9B7B8" roughness={0.08} metalness={0.25} />
      </mesh>
      <mesh ref={streakRef} rotation={[-Math.PI / 2, 0, 0]} position={[2.6, 0.035, -184]}>
        <planeGeometry args={[8.5, 5.4]} />
        <meshBasicMaterial map={streakTex} transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* concrete composition */}
      <mesh position={[-2.6, 3, -184.5]} castShadow>
        <boxGeometry args={[6.4, 0.26, 3.4]} />
        <meshStandardMaterial color="#CFC7B8" roughness={0.9} />
      </mesh>
      <mesh position={[-4.6, 1.5, -183.2]} castShadow>
        <cylinderGeometry args={[0.17, 0.17, 3, 14]} />
        <meshStandardMaterial color="#C6BEAE" roughness={0.9} />
      </mesh>
      <mesh position={[-0.9, 1.5, -185.8]} castShadow>
        <cylinderGeometry args={[0.17, 0.17, 3, 14]} />
        <meshStandardMaterial color="#C6BEAE" roughness={0.9} />
      </mesh>
      <mesh position={[-2.6, 0.55, -182.6]} castShadow>
        <boxGeometry args={[6.4, 1.1, 0.5]} />
        <meshStandardMaterial color="#D6CEBF" roughness={0.92} />
      </mesh>
      {/* presentation wall with the villa print */}
      <mesh position={[-2.4, 2.2, -189]}>
        <boxGeometry args={[9, 5.2, 0.3]} />
        <meshStandardMaterial color="#D9D1C0" roughness={0.95} />
      </mesh>
      <FramedImage url={IMG.villa} w={5} h={3.25} pos={[-2.4, 2.05, -188.78]} rotY={0} frame="#8A8272" />
      {/* teak bench */}
      <mesh position={[1.2, 0.24, -180.4]} castShadow>
        <boxGeometry args={[1.7, 0.09, 0.42]} />
        <meshStandardMaterial color="#8A6746" roughness={0.5} />
      </mesh>
      <mesh position={[0.55, 0.1, -180.4]}>
        <boxGeometry args={[0.09, 0.2, 0.38]} />
        <meshStandardMaterial color="#6E5138" roughness={0.7} />
      </mesh>
      <mesh position={[1.85, 0.1, -180.4]}>
        <boxGeometry args={[0.09, 0.2, 0.38]} />
        <meshStandardMaterial color="#6E5138" roughness={0.7} />
      </mesh>
      {/* one palm, casting the Bali shadow */}
      <group position={[4.6, 0, -180.5]}>
        <mesh position={[0, 1.4, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.1, 2.8, 8]} />
          <meshStandardMaterial color="#7A6A52" roughness={0.9} />
        </mesh>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <mesh key={i} position={[0, 2.85, 0]} rotation={[-0.55, (i / 7) * Math.PI * 2, 0]} castShadow>
            <planeGeometry args={[0.34, 1.7]} />
            <meshStandardMaterial color="#667553" roughness={0.85} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
      <Dust count={40} area={[-7, 14, 0.3, 4, -172, 20]} color="#FFE0A0" opacity={0.25} />
    </group>
  );
}

/* ---------------- 05 · SHOWROOM — future products ---------------- */

export function ShowroomZone() {
  const ref = useWindow(0.88, 1.0);
  const ringRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ref.current.visible) return;
    ringRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
  });
  const labelA = useMemo(() => makeLabelTexture("LOT 01 — RESERVED"), []);
  const labelB = useMemo(() => makeLabelTexture("STUDY — CERAMIC"), []);
  const labelC = useMemo(() => makeLabelTexture("STUDY — ORBIT"), []);
  const labelD = useMemo(() => makeLabelTexture("LOT 04 — RESERVED"), []);
  const vaseProfile = useMemo(
    () =>
      [
        [0.001, 0], [0.13, 0], [0.19, 0.08], [0.22, 0.22], [0.17, 0.38],
        [0.1, 0.48], [0.11, 0.56], [0.15, 0.61], [0.14, 0.63],
      ].map(([x, y]) => new THREE.Vector2(x, y)),
    []
  );
  const pedestals: { x: number; z: number; label: THREE.Texture }[] = [
    { x: -3.4, z: -222, label: labelA },
    { x: -1.7, z: -229, label: labelB },
    { x: 1.7, z: -223, label: labelC },
    { x: 3.4, z: -230, label: labelD },
  ];
  return (
    <group ref={ref}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -226]} receiveShadow>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial color="#EDEAE2" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.4, -238]}>
        <planeGeometry args={[70, 12]} />
        <meshStandardMaterial color="#F1EEE7" roughness={1} />
      </mesh>
      {pedestals.map((p, i) => (
        <group key={i} position={[p.x, 0, p.z]}>
          <mesh position={[0, 0.55, 0]} castShadow>
            <cylinderGeometry args={[0.55, 0.58, 1.1, 28]} />
            <meshStandardMaterial color="#F6F3EC" roughness={0.6} />
          </mesh>
          {/* soft light cone */}
          <mesh position={[0, 2.5, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[1.0, 2.6, 20, 1, true]} />
            <meshBasicMaterial color="#FFF8EA" transparent opacity={0.05} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.86, 0.42]} rotation={[-0.35, 0, 0]}>
            <planeGeometry args={[0.9, 0.135]} />
            <meshBasicMaterial map={p.label} transparent />
          </mesh>
        </group>
      ))}
      {/* glass case on lot 01 */}
      <mesh position={[-3.4, 1.42, -222]}>
        <boxGeometry args={[0.72, 0.62, 0.72]} />
        <meshStandardMaterial color="#DCE3E8" transparent opacity={0.14} roughness={0.05} metalness={0.4} depthWrite={false} />
      </mesh>
      {/* ceramic study */}
      <mesh position={[-1.7, 1.1, -229]} castShadow>
        <latheGeometry args={[vaseProfile, 30]} />
        <meshStandardMaterial color="#D8CFC0" roughness={0.85} />
      </mesh>
      {/* orbit study */}
      <mesh ref={ringRef} position={[1.7, 1.55, -223]}>
        <torusGeometry args={[0.3, 0.05, 12, 48]} />
        <meshStandardMaterial color="#B9C2CC" roughness={0.25} metalness={0.85} />
      </mesh>
      <Dust count={36} area={[-6, 12, 0.3, 3.4, -216, 22]} color="#FFFFFF" opacity={0.3} />
    </group>
  );
}

/* ---------------- 07 · RETURN — back to the person ---------------- */

export function ReturnZone() {
  const ref = useWindow(0.94, 1.01);
  return (
    <group ref={ref}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -254]}>
        <planeGeometry args={[60, 40]} />
        <meshStandardMaterial color="#171310" roughness={1} />
      </mesh>
      <mesh position={[0, 6, -266]}>
        <planeGeometry args={[60, 16]} />
        <meshBasicMaterial color="#0F0D0A" />
      </mesh>
      {/* a runway of light leading back to him */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.7, 0.01, -252]}>
        <planeGeometry args={[0.03, 16]} />
        <meshBasicMaterial color="#E4573D" transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.7, 0.01, -252]}>
        <planeGeometry args={[0.03, 16]} />
        <meshBasicMaterial color="#E4573D" transparent opacity={0.5} />
      </mesh>
      <FramedImage url={IMG.portrait} w={2.7} h={3.38} pos={[0, 1.6, -259]} frame="#E4573D" />
      <Dust count={70} area={[-5, 10, 0, 4.5, -244, 18]} color="#C9B79A" opacity={0.3} />
    </group>
  );
}
