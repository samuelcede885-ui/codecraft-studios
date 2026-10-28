import { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { Bloom, DepthOfField, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useCurrentFrame } from "remotion";
import { Color, FogExp2, Vector3, type PerspectiveCamera } from "three";
import { drivers as reel02Drivers } from "../Reel02/drivers";
import { Ground, Lamps, Traffic, Trees } from "../Reel02/city/City";
import { makeCityUniforms } from "../Reel02/city/materials";
import { Environment } from "../Reel02/Scene3D";
import { cameraAt } from "./camera";
import { BIZ, drivers } from "./drivers";
import { scenes } from "./timeline";
import { Businesses } from "./city/Businesses";
import { Flow, Notebook, OrderOrb, Pulse } from "./city/Explainers";
import { GrowingCity } from "./city/GrowingCity";
import { Network4 } from "./city/Network4";
import { ScreenSection } from "./city/ScreenSection";
import { Starfield } from "./city/Starfield";

function CameraRig({ frame }: { frame: number }) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const c = cameraAt(frame);
  camera.position.set(...c.pos);
  camera.fov = c.fov;
  camera.near = 0.02;
  camera.far = 400;
  camera.lookAt(...c.at);
  camera.updateProjectionMatrix();
  return null;
}

/** Sin edificios genéricos frente a la cámara ni donde están los negocios temáticos. */
const exclude = (b: { x: number; z: number }) => (Math.abs(b.x) < 2.2 && b.z > 2 && b.z < 16) || BIZ.some((z) => Math.abs(b.x - z.x) < 1.9 && Math.abs(b.z - z.z) < 1.9);

/** Azul noche del estilo explicativo (fondo y niebla). */
const NIGHT = "#0A0E19";

function Fog({ density }: { density: number }) {
  const scene = useThree((s) => s.scene);
  if (!scene.fog) scene.fog = new FogExp2(NIGHT, density);
  (scene.fog as FogExp2).density = density;
  return null;
}

export function Scene3D() {
  const frame = useCurrentFrame();
  const d = drivers(frame);
  const u = useMemo(makeCityUniforms, []);
  u.uLitRadius.value = d.growRadius + 40 * d.connected;
  u.uLitRatio.value = 0.36 + 0.26 * d.connected;
  u.uBlue.value = 0.1 + 0.65 * d.connected;
  u.uDim.value = 0.35 * (1 - d.fade);
  u.uFade.value = d.fade;
  const cd = { ...reel02Drivers(0), litRadius: d.city * 40, fade: d.fade, dim: 0, traffic: d.traffic, linesFade: d.linesFade };
  const fog = 0.11 * d.voidFog + 0.013 + 0.12 * (1 - d.fade);
  // Profundidad de campo: enfoca lo que mira la cámara, solo en los planos cercanos.
  const c = cameraAt(frame);
  const focus = useMemo(() => new Vector3(), []);
  focus.set(...c.at);
  const close = frame < scenes.ciudad.from + 30 || (frame > scenes.procesos.from && frame < scenes.venezuela.from);
  const macro = frame < scenes.compra.from;
  return (
    <ThreeCanvas width={1080} height={1920} shadows gl={{ antialias: true }} camera={{ fov: 38, near: 0.02, far: 400 }}>
      <color attach="background" args={[new Color(NIGHT)]} />
      <CameraRig frame={frame} />
      <Environment />
      <Fog density={fog} />
      <hemisphereLight args={["#2A3B63", "#05070B", 0.7 * d.fade]} />
      <ambientLight color="#8EA0C8" intensity={0.1} />
      <directionalLight
        position={[-14, 26, 12]}
        color="#A9BDFF"
        intensity={0.9 * d.fade}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-camera-near={1}
        shadow-camera-far={90}
        shadow-bias={-0.0008}
        shadow-normalBias={0.06}
      />
      {/* Luz de contorno para el teléfono y los objetos explicativos */}
      <pointLight position={[1.5, 3, 11]} color="#9CC2FF" intensity={2.2 * (1 - d.voidFog * 0) * (frame < scenes.compra.from + 20 ? 1 : 0.3)} distance={8} decay={1.4} />
      {/* En el corte de la pantalla solo existe el vacío azul noche: la ciudad aparece al girar. */}
      <group visible={frame >= scenes.toque.to - 30}>
        <Ground d={cd} />
        <GrowingCity u={u} radius={d.growRadius} exclude={exclude} />
      </group>
      <group visible={d.city > 0.02}>
        <Lamps d={cd} />
        <Trees />
        <Traffic d={cd} />
      </group>
      <group visible={frame >= scenes.toque.to - 30}>
        <Businesses u={u} d={d} frame={frame} />
      </group>
      <ScreenSection frame={frame} />
      <Starfield frame={frame} opacity={d.linesFade} />
      <OrderOrb d={d} />
      <Notebook d={d} frame={frame} />
      <Pulse d={d} />
      <Flow d={d} frame={frame} />
      <Network4 d={d} frame={frame} />
      <EffectComposer multisampling={0}>
        <DepthOfField target={focus} focalLength={macro ? 0.02 : 0.05} bokehScale={macro ? 4 : close ? 2.6 : 0} height={960} />
        <Bloom mipmapBlur luminanceThreshold={0.85} luminanceSmoothing={0.2} intensity={1.2} radius={0.72} />
        <Vignette offset={0.3} darkness={0.65} />
      </EffectComposer>
    </ThreeCanvas>
  );
}
