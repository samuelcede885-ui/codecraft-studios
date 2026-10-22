import { continueRender, delayRender, staticFile } from "remotion";

/** Lato (comunicación) e Inter (UI), locales y con licencia OFL: el render no depende de la red. */
const faces = [
  { family: "Lato", file: "lato-700.woff2", weight: "700" },
  { family: "Lato", file: "lato-900.woff2", weight: "900" },
  { family: "Inter", file: "inter-variable.woff2", weight: "400 700" },
];

let requested = false;

export function loadFaryFonts() {
  if (requested || typeof document === "undefined") return;
  requested = true;
  const handle = delayRender("Cargando tipografías de Fary Labs");
  Promise.all(
    faces.map(({ family, file, weight }) =>
      new FontFace(family, `url(${staticFile(`fonts/${file}`)}) format("woff2")`, { weight }).load().then((f) => {
        document.fonts.add(f);
      }),
    ),
  )
    .catch((err) => console.error("No se pudieron cargar las tipografías", err))
    .finally(() => continueRender(handle));
}
