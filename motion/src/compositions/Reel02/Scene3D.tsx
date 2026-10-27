import { useLayoutEffect, useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useCurrentFrame } from "remotion";
import { Color, FogExp2, PCFSoftShadowMap, PMREMGenerator, type PerspectiveCamera } from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { cameraAt, VIEW } from "./camera";
import { drivers } from "./drivers";
import { Buildings, Ground, Lamps, Shops, Traffic, Trees } from "./city/City";
import { Connections } from "./city/Connections";
import { HeroShop } from "./city/HeroShop";
import { city, mainRoutes } from "./city/layout";
import { makeCityUniforms, palette } from "./city/materials";
import { msgPulse } from "./ui/messages";
import { scenes } from "./timeline";

/** Cámara del recorrido: la misma función que usan las interfaces para anclarse a la ciudad. */
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

/** Reflejos controlados: entorno neutro muy tenue para vidrio, autos y calzada. */
function Environment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useLayoutEffect(() => {
    gl.shadowMap.type = PCFSoftShadowMap;
    const pmrem = new PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.12;
    return () => env.dispose();
  }, [gl, scene]);
  return null;
}

function Fog({ density }: { density: number }) {
  const scene = useThree((s) => s.scene);
  if (!scene.fog) scene.fog = new FogExp2(palette.fondo, density);
  (scene.fog as FogExp2).density = density;
  return null;
}

/** Comercios conectados por la línea principal: se modernizan cuando su ruta llega. */
const mainTargets = mainRoutes.map((r) => r.points[r.points.length - 1]);

export function Scene3D() {
  const frame = useCurrentFrame();
  const d = drivers(frame);
  const u = useMemo(makeCityUniforms, []);
  u.uLitRadius.value = d.litRadius;
  u.uLitRatio.value = 0.42 + 0.1 * d.blue;
  u.uBlue.value = d.blue;
  u.uDim.value = d.dim;
  u.uFade.value = d.fade;
  u.uWin.value = 1 - 0.4 * d.stress * d.interior;

  // Modernización de cada comercio: los de la línea principal al llegar su ruta; el resto, como una
  // onda que se expande desde el centro durante las escenas 6 y 7.
  const wave = Math.max(0, (frame - scenes.automatizacion.from) / (scenes.comunidad.to - scenes.automatizacion.from)) * 34;
  const modern = (i: number) => {
    const b = city.shops[i];
    const k = mainTargets.findIndex((p) => Math.abs(p[0] - b.shop!.door[0]) < 0.01 && Math.abs(p[2] - b.shop!.door[2]) < 0.01);
    if (k >= 0) {
      const r = mainRoutes[k];
      return Math.min(1, Math.max(0, (d.main - (r.start * (1 - r.dur) + r.dur)) * 6 + 1)) * (d.main > 0 ? 1 : 0);
    }
    return Math.min(1, Math.max(0, (wave - b.dist) / 4));
  };

  const fog = 0.016 - 0.008 * Math.min(1, frame / 90) + 0.12 * (1 - d.fade);
  return (
    <ThreeCanvas width={VIEW.width} height={VIEW.height} shadows gl={{ antialias: true, powerPreference: "high-performance" }} camera={{ fov: 34, near: 0.05, far: 400 }}>
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
        shadow-camera-left={-34}
        shadow-camera-right={34}
        shadow-camera-top={34}
        shadow-camera-bottom={-34}
        shadow-camera-near={1}
        shadow-camera-far={90}
        shadow-bias={-0.0008}
        shadow-normalBias={0.06}
      />
      <Ground d={d} />
      <Buildings u={u} />
      <Shops d={d} modern={modern} />
      <Lamps d={d} />
      <Trees />
      <Traffic d={d} />
      <HeroShop u={u} d={d} frame={frame} msg={msgPulse(frame)} />
      <Connections d={d} frame={frame} />
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur luminanceThreshold={0.85} luminanceSmoothing={0.2} intensity={1.15} radius={0.72} />
        <Vignette offset={0.32} darkness={0.62} />
      </EffectComposer>
    </ThreeCanvas>
  );
}
