import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fary, signal } from "../../theme/fary";
import { clamp, easeInOut, progress } from "../../lib/motion";
import { FaryLogo } from "../../components/FaryLogo";
import { Cursor } from "../../components/Cursor";
import { webTour, type TourChapter } from "../../data/webTour";
import capture from "../../data/webTourCapture.json";

/** Pantalla del monitor: la grabación (1280 × 800) se muestra a esta escala. */
const SCREEN = { w: 960, h: 600 };
const SCALE = SCREEN.w / 1280;
const BEZEL = 20;
const CHIN = 44;
const MONITOR = { x: (fary.video.width - SCREEN.w - BEZEL * 2) / 2, y: 640 };

/**
 * Recorrido por la web (vertical 1080 × 1920): la versión de escritorio grabada en tiempo real
 * dentro de un monitor, con el nombre de cada sección arriba y el avance abajo.
 * La grabación sale de scripts/record-web-tour.mjs (video + capítulos + posiciones del cursor).
 */
export function WebTour() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const endAt = webTour.videoEnd * fps;
  const outro = progress(frame, endAt, 18, easeInOut);
  const index = chapterAt(t);

  return (
    <AbsoluteFill style={{ background: fary.color.negro, fontFamily: fary.font.ui }}>
      <AbsoluteFill style={{ background: `radial-gradient(60% 34% at 50% 52%, ${fary.color.carbon} 0%, ${fary.color.negro} 100%)` }} />

      <div style={{ opacity: 1 - outro }}>
        <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <FaryLogo width={200} />
        </div>
        <ChapterTitles t={t} index={index} />
        <Monitor frame={frame} t={t} />
        <Progress t={t} index={index} />
      </div>

      <EndCard frame={frame - endAt} />
    </AbsoluteFill>
  );
}

function chapterAt(t: number) {
  let i = 0;
  webTour.chapters.forEach((c, k) => {
    if (t >= c.at) i = k;
  });
  return i;
}

/** Título de la sección actual; entra al llegar su capítulo y sale al empezar el siguiente. */
function ChapterTitles({ t, index }: { t: number; index: number }) {
  const { chapters } = webTour;
  return (
    <>
      {chapters.map((c, i) => {
        if (Math.abs(i - index) > 1) return null;
        const next = chapters[i + 1]?.at ?? webTour.videoEnd + 60;
        const enter = interpolate(t, [c.at, c.at + 0.45], [0, 1], { ...clamp, easing: easeInOut });
        const leave = interpolate(t, [next - 0.3, next], [0, 1], { ...clamp, easing: easeInOut });
        const o = Math.min(enter, 1 - leave);
        if (o <= 0) return null;
        return <ChapterTitle key={c.id} chapter={c} n={i + 1} opacity={o} shift={(1 - enter) * 26 - leave * 18} />;
      })}
    </>
  );
}

function ChapterTitle({ chapter, n, opacity, shift }: { chapter: TourChapter; n: number; opacity: number; shift: number }) {
  return (
    <div style={{ position: "absolute", left: 72, right: 72, top: 318, opacity, transform: `translateY(${shift}px)` }}>
      <div style={{ font: `600 24px ${fary.font.ui}`, letterSpacing: "0.16em", textTransform: "uppercase", color: fary.color.muted }}>
        <span style={{ color: fary.color.signal }}>{String(n).padStart(2, "0")}</span>
        <span style={{ margin: "0 14px" }}>/</span>
        {chapter.eyebrow}
      </div>
      <div style={{ marginTop: 18, font: `900 76px/1.02 ${fary.font.display}`, color: fary.color.blanco, letterSpacing: "-0.01em" }}>{chapter.title}</div>
      <div style={{ marginTop: 18, font: `400 32px/1.35 ${fary.font.ui}`, color: "#B9BBBF", maxWidth: 900 }}>{chapter.text}</div>
    </div>
  );
}

/** Monitor de escritorio con la grabación y el cursor encima. */
function Monitor({ frame, t }: { frame: number; t: number }) {
  const enter = progress(frame, 0, 24);
  const cursor = cursorAt(t);
  const press = clickPress(t);
  return (
    <div style={{ position: "absolute", left: MONITOR.x, top: MONITOR.y, opacity: enter, transform: `translateY(${(1 - enter) * 40}px)` }}>
      {/* Brillo de la señal tras el monitor. */}
      <div style={{ position: "absolute", inset: -80, borderRadius: 80, background: `radial-gradient(50% 50% at 50% 50%, ${signal(0.12)} 0%, rgba(0,0,0,0) 70%)` }} />
      <div
        style={{
          position: "relative",
          width: SCREEN.w + BEZEL * 2,
          padding: `${BEZEL}px ${BEZEL}px ${CHIN}px`,
          borderRadius: 30,
          background: `linear-gradient(180deg, #1C1D20 0%, ${fary.color.carbon} 100%)`,
          boxShadow: `0 0 0 2px ${fary.color.grafito}, 0 50px 100px rgba(0,0,0,0.6)`,
        }}
      >
        <div style={{ position: "relative", width: SCREEN.w, height: SCREEN.h, overflow: "hidden", borderRadius: 8, background: fary.color.marfil }}>
          <OffthreadVideo src={staticFile("tour/web-desktop.mp4")} muted style={{ width: SCREEN.w, height: SCREEN.h, display: "block" }} />
          {cursor && (
            <div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${SCALE})`, transformOrigin: "0 0" }}>
              <Cursor x={cursor.x} y={cursor.y} press={press} />
            </div>
          )}
        </div>
        <div style={{ position: "absolute", left: "50%", bottom: 17, width: 10, height: 10, marginLeft: -5, borderRadius: 10, background: fary.color.grafito }} />
      </div>
      {/* Pie del monitor. */}
      <div style={{ margin: "0 auto", width: 170, height: 96, background: `linear-gradient(180deg, #0E0F11 0%, #1A1B1E 100%)`, clipPath: "polygon(14% 0, 86% 0, 100% 100%, 0 100%)" }} />
      <div style={{ margin: "0 auto", width: 380, height: 14, borderRadius: 14, background: "#1C1D20", boxShadow: `0 0 0 1px ${fary.color.grafito}` }} />
    </div>
  );
}

type CursorPoint = [number, number, number];
const points = capture.cursor as CursorPoint[];

/** Última posición registrada del ratón en el segundo t (null antes del primer movimiento). */
function cursorAt(t: number) {
  let found: CursorPoint | null = null;
  for (const p of points) {
    if (p[0] > t) break;
    found = p;
  }
  return found && { x: found[1], y: found[2] };
}

/** Anillo de clic: 0 → 1 durante 0,4 s tras cada clic. */
function clickPress(t: number) {
  for (const c of capture.clicks) {
    if (t >= c && t < c + 0.4) return (t - c) / 0.4;
  }
  return 0;
}

/** Avance por secciones bajo el monitor. */
function Progress({ t, index }: { t: number; index: number }) {
  const { chapters, videoEnd } = webTour;
  const gap = 8;
  const width = fary.video.width - 144;
  const seg = (width - gap * (chapters.length - 1)) / chapters.length;
  return (
    <div style={{ position: "absolute", left: 72, top: 1468, width, display: "flex", gap }}>
      {chapters.map((c, i) => {
        const end = chapters[i + 1]?.at ?? videoEnd;
        const fill = interpolate(t, [c.at, end], [0, 1], clamp);
        return (
          <div key={c.id} style={{ width: seg, height: 6, borderRadius: 6, background: fary.color.grafito, overflow: "hidden" }}>
            <div style={{ width: `${fill * 100}%`, height: "100%", background: i === index ? fary.color.signal : fary.color.marfil }} />
          </div>
        );
      })}
    </div>
  );
}

function EndCard({ frame }: { frame: number }) {
  if (frame < 6) return null;
  const logo = progress(frame, 6, 24);
  const line = progress(frame, 18, 22);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div style={{ opacity: logo, transform: `scale(${0.94 + 0.06 * logo})` }}>
        <FaryLogo width={520} />
      </div>
      <div style={{ marginTop: 56, opacity: line, transform: `translateY(${(1 - line) * 20}px)`, textAlign: "center" }}>
        <div style={{ font: `900 64px/1.1 ${fary.font.display}`, color: fary.color.blanco }}>{webTour.endTitle}</div>
        <div style={{ marginTop: 22, font: `500 28px ${fary.font.ui}`, letterSpacing: "0.18em", textTransform: "uppercase", color: fary.color.muted }}>{webTour.endLine}</div>
      </div>
    </AbsoluteFill>
  );
}
