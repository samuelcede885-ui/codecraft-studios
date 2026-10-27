import { Color, MeshStandardMaterial, type IUniform } from "three";

/** Dirección de arte del reel 02 (indicada en el encargo, compatible con la marca). */
export const palette = {
  fondo: "#080A0F",
  grafito: "#171C26",
  grafitoClaro: "#232A36",
  acera: "#121722",
  calzada: "#0B0E15",
  azul: "#2563EB",
  cian: "#38DDF5",
  blanco: "#FFFFFF",
  calido: "#FFC58A",
} as const;

export type CityUniforms = {
  uLitRadius: IUniform<number>;
  uLitRatio: IUniform<number>;
  uBlue: IUniform<number>;
  uDim: IUniform<number>;
  uWin: IUniform<number>;
  uFade: IUniform<number>;
};

export const makeCityUniforms = (): CityUniforms => ({
  uLitRadius: { value: 0 },
  uLitRatio: { value: 0.5 },
  uBlue: { value: 0 },
  uDim: { value: 0 },
  uWin: { value: 1 },
  uFade: { value: 1 },
});

/**
 * Material de fachada con ventanas procedurales (sin texturas): rejilla en caras laterales,
 * encendido aleatorio por ventana, iluminación progresiva desde el centro (uLitRadius),
 * modernización hacia el azul (uBlue) y modo red (uDim oscurece la ciudad).
 */
export function facadeMaterial(u: CityUniforms, opts: { color: string; roughness: number; metalness: number; cell?: [number, number] }) {
  const m = new MeshStandardMaterial({ color: new Color(opts.color), roughness: opts.roughness, metalness: opts.metalness });
  const [cw, ch] = opts.cell ?? [0.3, 0.4];
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, u);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vW;\nvarying vec3 vN;\nvarying float vSeed;")
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        #ifdef USE_INSTANCING
          vec4 wpos = modelMatrix * instanceMatrix * vec4(transformed, 1.0);
          vN = normalize(mat3(modelMatrix * instanceMatrix) * objectNormal);
          vSeed = fract(sin(dot(instanceMatrix[3].xz, vec2(12.9898, 78.233))) * 43758.5453);
        #else
          vec4 wpos = modelMatrix * vec4(transformed, 1.0);
          vN = normalize(mat3(modelMatrix) * objectNormal);
          vSeed = 0.37;
        #endif
        vW = wpos.xyz;`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        varying vec3 vW; varying vec3 vN; varying float vSeed;
        uniform float uLitRadius; uniform float uLitRatio; uniform float uBlue; uniform float uDim; uniform float uWin; uniform float uFade;
        float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }`,
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        diffuseColor.rgb *= (1.0 - 0.55 * uDim) * uFade;`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        float side = 1.0 - step(0.5, abs(vN.y));
        vec2 uv = vec2(abs(vN.x) > 0.5 ? vW.z : vW.x, vW.y);
        vec2 cell = vec2(${cw.toFixed(3)}, ${ch.toFixed(3)});
        vec2 g = fract(uv / cell); vec2 id = floor(uv / cell);
        float win = smoothstep(0.18, 0.24, g.x) * (1.0 - smoothstep(0.76, 0.82, g.x)) * smoothstep(0.22, 0.28, g.y) * (1.0 - smoothstep(0.72, 0.78, g.y));
        float upper = step(0.55, vW.y);
        float rnd = h21(id + floor(vSeed * 997.0 + 0.5) * 7.0);
        float d = length(vW.xz);
        float zone = 1.0 - smoothstep(uLitRadius - 3.0, uLitRadius, d);
        float lit = step(rnd, uLitRatio) * zone;
        vec3 warm = vec3(1.0, 0.74, 0.46);
        vec3 cool = vec3(0.70, 0.84, 1.0);
        vec3 blue = vec3(0.15, 0.39, 0.92) * 1.7;
        vec3 wc = mix(warm, cool, step(0.62, fract(rnd * 7.31)));
        wc = mix(wc, mix(blue, vec3(0.22, 0.86, 0.96) * 1.3, step(0.5, fract(rnd * 3.7))), uBlue * step(0.55, fract(rnd * 5.3)));
        float flick = 0.55 + 0.45 * fract(rnd * 13.7);
        totalEmissiveRadiance += side * upper * win * lit * wc * flick * uWin * (1.0 - 0.75 * uDim) * uFade;
        totalEmissiveRadiance += side * upper * win * vec3(0.012, 0.016, 0.024) * uFade;`,
      );
  };
  m.customProgramCacheKey = () => `facade-${opts.color}-${cw}-${ch}`;
  return m;
}
