import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { world } from "../lib/world";
import {
  HeroZone,
  ExperimentalZone,
  CyberZone,
  BrandsZone,
  ArchZone,
  ShowroomZone,
  ReturnZone,
} from "./zones";

/* ------------------------------------------------------------------ */
/*  Camera / atmosphere keyframes — one continuous dolly through zones */
/* ------------------------------------------------------------------ */

interface Key {
  p: number;
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
  bg: string;
  fogN: number;
  fogF: number;
  hemi: number;
  hemiC: string;
  dir: number;
  dirC: string;
  pt: number; // cyber street point-light intensity
}

const KEYS: Key[] = [
  { p: 0.0,   pos: [0, 0.6, 6.5],   look: [0, 0.5, -6],    fov: 38, bg: "#14120E", fogN: 7, fogF: 26, hemi: 0.5,  hemiC: "#39332B", dir: 0.9, dirC: "#E4573D", pt: 0 },
  { p: 0.09,  pos: [0, 0.55, 1.2],  look: [0, 0.5, -8],    fov: 40, bg: "#14120E", fogN: 5, fogF: 20, hemi: 0.5,  hemiC: "#39332B", dir: 0.8, dirC: "#D8664F", pt: 0 },
  { p: 0.15,  pos: [0, 0.6, -8.5],  look: [0, 0.7, -30],   fov: 42, bg: "#C9BFA9", fogN: 2, fogF: 13, hemi: 0.8,  hemiC: "#C9BFA9", dir: 0.6, dirC: "#EFE6D2", pt: 0 },
  { p: 0.205, pos: [-2.0, 0.8, -26],look: [1.4, 1.1, -40], fov: 44, bg: "#EFEAE0", fogN: 8, fogF: 46, hemi: 1.0,  hemiC: "#FFF6E4", dir: 0.9, dirC: "#FFF1D8", pt: 0 },
  { p: 0.26,  pos: [1.8, 1.0, -36], look: [-1.8, 1.5, -46],fov: 44, bg: "#EFEAE0", fogN: 8, fogF: 46, hemi: 1.0,  hemiC: "#FFF6E4", dir: 0.9, dirC: "#FFF1D8", pt: 0 },
  { p: 0.315, pos: [-0.6, 1.1, -48],look: [0.6, 1.2, -62], fov: 44, bg: "#EFEAE0", fogN: 8, fogF: 44, hemi: 0.95, hemiC: "#F5EDDC", dir: 0.8, dirC: "#FFF1D8", pt: 0 },
  { p: 0.375, pos: [0, 1.1, -62],   look: [0, 1.3, -84],   fov: 46, bg: "#3A3A40", fogN: 4, fogF: 22, hemi: 0.5,  hemiC: "#4A4A55", dir: 0.3, dirC: "#8A93A8", pt: 6 },
  { p: 0.435, pos: [0, 1.25, -76],  look: [0, 2.0, -94],   fov: 48, bg: "#0E0E12", fogN: 6, fogF: 34, hemi: 0.3,  hemiC: "#202838", dir: 0.12,dirC: "#5C8AFF", pt: 30 },
  { p: 0.5,   pos: [0, 1.3, -88],   look: [0.5, 2.6, -100],fov: 48, bg: "#0E0E12", fogN: 6, fogF: 34, hemi: 0.3,  hemiC: "#202838", dir: 0.12,dirC: "#5C8AFF", pt: 30 },
  { p: 0.55,  pos: [0, 1.2, -98],   look: [0, 3.2, -110],  fov: 46, bg: "#0E0E12", fogN: 6, fogF: 34, hemi: 0.32, hemiC: "#202838", dir: 0.12,dirC: "#5C8AFF", pt: 24 },
  { p: 0.6,   pos: [0, 1.1, -112],  look: [0, 1.2, -132],  fov: 44, bg: "#6B6255", fogN: 4, fogF: 20, hemi: 0.6,  hemiC: "#6E6355", dir: 0.4, dirC: "#E8D9BE", pt: 4 },
  { p: 0.65,  pos: [-1.9, 1.15, -126], look: [1.5, 1.1, -140], fov: 42, bg: "#F1E9DC", fogN: 8, fogF: 40, hemi: 0.95, hemiC: "#FFE9C8", dir: 0.9, dirC: "#FFDFAC", pt: 0 },
  { p: 0.7,   pos: [1.7, 1.2, -137],look: [-0.2, 1.0, -141],fov: 40, bg: "#F1E9DC", fogN: 8, fogF: 40, hemi: 0.95, hemiC: "#FFE9C8", dir: 0.95,dirC: "#FFDFAC", pt: 0 },
  { p: 0.745, pos: [0.4, 1.25, -144],look: [0, 1.3, -166], fov: 42, bg: "#F1E9DC", fogN: 8, fogF: 42, hemi: 0.9,  hemiC: "#FAE8CC", dir: 0.9, dirC: "#FFE3B8", pt: 0 },
  { p: 0.8,   pos: [-2.6, 1.3, -172],look: [1.8, 1.2, -185],fov: 42, bg: "#ECE6DA", fogN: 8, fogF: 44, hemi: 1.05, hemiC: "#FFF2DC", dir: 1.15,dirC: "#FFE0A0", pt: 0 },
  { p: 0.86,  pos: [1.4, 1.2, -180],look: [-1.6, 1.6, -188],fov: 40, bg: "#ECE6DA", fogN: 8, fogF: 44, hemi: 1.05, hemiC: "#FFF2DC", dir: 1.15,dirC: "#FFE0A0", pt: 0 },
  { p: 0.915, pos: [0, 1.3, -192],  look: [0, 1.3, -220],  fov: 44, bg: "#ECE6DA", fogN: 8, fogF: 42, hemi: 1.0,  hemiC: "#FBF2E2", dir: 1.0, dirC: "#FFE9C4", pt: 0 },
  { p: 0.955, pos: [0, 1.35, -214], look: [0, 1.2, -227],  fov: 44, bg: "#F4F1EA", fogN: 8, fogF: 40, hemi: 1.15, hemiC: "#FFFFFF", dir: 0.9, dirC: "#FFFFFF", pt: 0 },
  { p: 0.98,  pos: [0, 1.45, -232], look: [0, 1.5, -256],  fov: 42, bg: "#4A443A", fogN: 4, fogF: 20, hemi: 0.7,  hemiC: "#5A5245", dir: 0.5, dirC: "#E8D8C0", pt: 0 },
  { p: 1.0,   pos: [0, 1.55, -241], look: [0, 1.5, -260],  fov: 40, bg: "#14120E", fogN: 5, fogF: 30, hemi: 0.55, hemiC: "#3A342B", dir: 0.75,dirC: "#E4573D", pt: 0 },
];

const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();
const colA = new THREE.Color();
const colB = new THREE.Color();
const smooth = (t: number) => t * t * (3 - 2 * t);

function Rig() {
  const { camera, scene } = useThree();
  const hemi = useRef<THREE.HemisphereLight>(null!);
  const dir = useRef<THREE.DirectionalLight>(null!);
  const pt = useRef<THREE.PointLight>(null!);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const lambda = world.reduced ? 60 : 4.2;
    world.dCine = THREE.MathUtils.damp(world.dCine, world.pCine, lambda, dt);
    const p = THREE.MathUtils.clamp(world.dCine, 0, 1);

    let i = 0;
    while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++;
    const a = KEYS[i];
    const b = KEYS[i + 1];
    const t = smooth(THREE.MathUtils.clamp((p - a.p) / (b.p - a.p), 0, 1));

    const mx = world.reduced ? 0 : world.mouseX;
    const my = world.reduced ? 0 : world.mouseY;

    tmpA.set(...a.pos).lerp(tmpB.set(...b.pos), t);
    tmpA.x += mx * 0.32;
    tmpA.y += -my * 0.16;
    camera.position.copy(tmpA);

    lookTarget.set(...a.look).lerp(tmpB.set(...b.look), t);
    lookTarget.x += mx * 0.85;
    lookTarget.y += -my * 0.45;
    camera.lookAt(lookTarget);

    const fov = a.fov + (b.fov - a.fov) * t;
    if (Math.abs((camera as THREE.PerspectiveCamera).fov - fov) > 0.01) {
      (camera as THREE.PerspectiveCamera).fov = fov;
      camera.updateProjectionMatrix();
    }

    const fog = scene.fog as THREE.Fog;
    fog.near = a.fogN + (b.fogN - a.fogN) * t;
    fog.far = a.fogF + (b.fogF - a.fogF) * t;
    (fog.color as THREE.Color).copy(colA.set(a.bg).lerp(colB.set(b.bg), t));
    (scene.background as THREE.Color).copy(fog.color);

    hemi.current.intensity = a.hemi + (b.hemi - a.hemi) * t;
    hemi.current.color.copy(colA.set(a.hemiC).lerp(colB.set(b.hemiC), t));
    dir.current.intensity = a.dir + (b.dir - a.dir) * t;
    dir.current.color.copy(colA.set(a.dirC).lerp(colB.set(b.dirC), t));
    pt.current.intensity = a.pt + (b.pt - a.pt) * t;

    world.camZ = camera.position.z;
  });

  return (
    <>
      <hemisphereLight ref={hemi} args={["#39332B", "#12100C", 0.5]} />
      <directionalLight
        ref={dir}
        position={[-7, 12, -174]}
        target-position={[0, 0, -184]}
        intensity={0.9}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-camera-far={60}
        shadow-bias={-0.0004}
      />
      <pointLight ref={pt} position={[0, 3.4, -92]} distance={34} decay={1.8} color="#5C8AFF" intensity={0} />
    </>
  );
}

/* ------------------------------------------------------------------ */

export default function Experience() {
  const dpr: [number, number] = world.lowPower ? [1, 1.4] : [1, 1.8];
  return (
    <Canvas
      className="webgl"
      dpr={dpr}
      shadows
      camera={{ fov: 38, position: [0, 0.6, 6.5], near: 0.1, far: 90 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ scene }) => {
        scene.fog = new THREE.Fog("#14120E", 7, 26);
        scene.background = new THREE.Color("#14120E");
      }}
    >
      <Suspense fallback={null}>
        <Rig />
        <HeroZone />
        <ExperimentalZone />
        <CyberZone />
        <BrandsZone />
        <ArchZone />
        <ShowroomZone />
        <ReturnZone />
      </Suspense>
    </Canvas>
  );
}
