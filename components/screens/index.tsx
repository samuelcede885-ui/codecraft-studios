import type { Scene, ScreenId } from "@/data/scenes";
import DashboardScreen from "./Dashboard";
import DepthfieldScreen from "./Depthfield";
import GreenadeScreen from "./Greenade";
import SimplyMilkScreen from "./SimplyMilk";
import SynthaScreen from "./Syntha";

const demoScreens: Record<ScreenId, () => React.JSX.Element> = {
  greenade: GreenadeScreen,
  "simply-milk": SimplyMilkScreen,
  "syntha-6": SynthaScreen,
  depthfield: DepthfieldScreen,
  dashboard: DashboardScreen,
};

// Una capa de pantalla: la captura original si existe, si no la pantalla demo en código.
export function ScreenLayer({ scene, index }: { scene: Scene; index: number }) {
  const Demo = demoScreens[scene.screen];
  return (
    <div
      className="screen-layer"
      data-screen
      data-transition={scene.transition}
      data-initial={index === 0 ? undefined : "hidden"}
      role="img"
      aria-label={scene.imageAlt}
    >
      {scene.image ? (
        <img src={scene.image} alt="" className="screen-img" loading="eager" decoding="async" />
      ) : (
        <Demo />
      )}
    </div>
  );
}
