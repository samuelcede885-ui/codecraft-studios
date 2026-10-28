import { interpolate } from "remotion";
import { fingerTip, SEC, SEC_GEO } from "../city/ScreenSection";
import { NOTE } from "../city/Explainers";
import { s } from "../timeline";
import { clamp } from "../../Reel02/ui/kit";
import { Callout } from "./Captions";

/** Ventana de aparición de un rótulo (entra y sale con suavidad). */
const win = (f: number, a: number, b: number) => Math.min(interpolate(f, [a, a + 8], [0, 1], clamp), interpolate(f, [b - 8, b], [1, 0], clamp));
const sec = (x: number, y: number, z = 0): [number, number, number] => [SEC.x + 2 * x, SEC.y + 2 * y, SEC.z + 2 * z];

/** Rótulos técnicos de las escenas 1 (corte de la pantalla), 2 y 4. */
export function SceneLabels({ frame }: { frame: number }) {
  const t = frame / 30;
  const tip = fingerTip(frame);
  const pulseX = -0.06 + Math.max(0, t - 1.25) * 0.55;
  return (
    <>
      {/* Escena 1 */}
      <Callout frame={frame} at={sec(0.16, 0, 0.15)} text="VIDRIO" a={win(frame, 6, s(2.5))} dx={40} dy={-150} />
      <Callout frame={frame} at={sec(0.26, SEC_GEO.padY, 0)} text="SENSORES" a={win(frame, 12, s(2.5))} dx={70} dy={-230} />
      <Callout frame={frame} at={sec(0.0, SEC_GEO.rgbY, 0.02)} text="PÍXELES" a={win(frame, 18, s(2.5))} dx={-60} dy={140} />
      <Callout frame={frame} at={sec(tip.x, 0.006, 0)} text="CARGA" a={win(frame, s(1.25), s(2.4))} dx={-120} dy={-330} lit={1} />
      <Callout frame={frame} at={sec(pulseX, SEC_GEO.padY + 0.004, 0)} text="DATOS" a={win(frame, s(1.55), s(3.2))} dx={0} dy={160} lit={1} />
      {/* Escena 2 */}
      <Callout frame={frame} at={[0, 2.75, -0.1]} text="BODEGA" a={win(frame, s(4.4), s(9.4))} dx={-170} dy={-120} />
      {/* Escena 4: la información está dispersa */}
      <Callout frame={frame} at={[NOTE.x, NOTE.y + 0.1, NOTE.z]} text="LIBRETA" a={win(frame, s(20.8), s(23.9))} dx={-40} dy={170} />
      <Callout frame={frame} at={[-1.05, 1.75, 2.2]} text="HOJA DE CÁLCULO" a={win(frame, s(21.6), s(23.9))} dx={60} dy={-150} />
      <Callout frame={frame} at={[1.05, 1.75, 2.3]} text="MENSAJES" a={win(frame, s(21.9), s(23.9))} dx={-30} dy={-180} />
      <Callout frame={frame} at={[0.7, 1.15, 2.4]} text="DATOS SEPARADOS" a={win(frame, s(22.4), s(23.9))} dx={-80} dy={260} />
    </>
  );
}
