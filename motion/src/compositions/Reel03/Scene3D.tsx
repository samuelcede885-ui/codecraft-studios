import { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { Bloom, DepthOfField, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useCurrentFrame } from "remotion";
import { Color, Vector3, type PerspectiveCamera } from "three";
import { Buildings, Ground, Lamps, Shops, Traffic, Trees } from "../Reel02/city/City";
import { city } from "../Reel02/city/layout";
import { makeCityUniforms, palette } from "../Reel02/city/materials";
import { Environment, Fog } from "../Reel02/Scene3D";
import { cameraAt } from "./camera";
import { cityDrivers, drivers } from "./drivers";
import { Network } from "./city/Network";
import { TWIN, TwinShops } from "./city/TwinShops";
import { scenes } from "./timeline";

function CameraRig({ frame }: { frame: number }) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const c = cameraAt(frame);
  camera.position.set(...c.pos);
  camera.fov = c.fov;
  camera.near = 0.05;
  camera.far = 400;
  camera.lookAt(...c.at);
  camera.updateProjectionMatrix();
  return null;
}

/**
 * Lienzo 3D del reel 03: la ciudad del reel 02 (misma semilla) con las dos tiendas en la
 * manzana central. Profundidad de campo discreta enfocada en las tiendas mientras estamos cerca.
 */
/** Corredor frente a las tiendas: sin edificios entre la cámara y las fachadas (calle comercial). */
const corridor = (b: { x: number; z: number }) => Math.abs(b.x) < 2.2 && b.z > 2 && b.z < 16;

export function Scene3D() {
  const frame = useCurrentFrame();
  const d = drivers(frame);
  const cd = cityDrivers(d);
  const u = useMemo(makeCityUniforms, []);
  u.uLitRadius.value = d.litRadius;
  u.uLitRatio.value = 0.45;
  u.uBlue.value = 0.15 + 0.6 * d.dim;
  u.uDim.value = d.dim;
  u.uFade.value = d.fade;
  // En el cierre, los comercios que alcanza la red se vuelven azules (onda desde la tienda digital).
  const wave = d.net * 30;
  const modern = (i: number) => {
    const b = city.shops[i];
    return Math.min(1, Math.max(0, (wave - Math.hypot(b.x - TWIN.xs.digital, b.z)) / 4));
  };
  const close = frame > scenes.problema.from && frame < scenes.cierre.from;
  const focus = useMemo(() => new Vector3(0, 1.0, 0.4), []);
  const fog = 0.014 + 0.12 * (1 - d.fade);
  return (
    <ThreeCanvas width={1080} height={1920} shadows gl={{ antialias: true }} camera={{ fov: 34, near: 0.05, far: 400 }}>
      <color attach="background" args={[new Color(palette.fondo)]} />
      <CameraRig frame={frame} />
      <Environment />
      <Fog density={fog} />
      <hemisphereLight args={["#2A3B63", "#05070B", 0.75 * d.fade]} />
      <ambientLight color="#8EA0C8" intensity={0.08} />
      <directionalLight
        position={[-14, 26, 12]}
        color="#A9BDFF"
        intensity={0.85 * (1 - 0.5 * d.dim) * d.fade}
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
      <Ground d={cd} />
      <Buildings u={u} exclude={corridor} />
      <Shops d={cd} modern={modern} exclude={corridor} />
      <Lamps d={cd} />
      <Trees />
      <Traffic d={cd} />
      <TwinShops u={u} d={d} frame={frame} />
      <Network d={d} frame={frame} />
      <EffectComposer multisampling={0}>
        <DepthOfField target={focus} focalLength={0.06} bokehScale={close ? 2.4 : 0} height={960} />
        <Bloom mipmapBlur luminanceThreshold={0.85} luminanceSmoothing={0.2} intensity={1.15} radius={0.72} />
        <Vignette offset={0.32} darkness={0.62} />
      </EffectComposer>
    </ThreeCanvas>
  );
}
