import type { StoryStep } from "@/data/storySteps";
import { Screen } from "../screens/Screens";

/**
 * Contenido de la pantalla de la laptop: una capa por paso, todas apiladas dentro de la
 * máscara de la pantalla (overflow: hidden), así nada puede salirse de sus bordes.
 * Las imágenes se cargan de inmediato para que la secuencia no espere a ninguna.
 */
export function LaptopScreen({ steps }: { steps: StoryStep[] }) {
  return (
    <>
      {steps.map((s, i) => (
        <div className="screen-layer" data-screen data-step={i} key={s.id}>
          <div className="screen-layer__inner">
            <Screen id={s.screen} />
          </div>
        </div>
      ))}
    </>
  );
}
