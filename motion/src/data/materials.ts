import { random } from "remotion";

/**
 * Materiales "reales" de la ciudad, ya oscurecidos para la noche. Se usan solo en lo que está
 * en foco; fuera de foco todo vuelve a los grises de la marca.
 */
export type Facade = { top: string; left: string; right: string };

export const facades: Record<string, Facade> = {
  ladrillo: { top: "#7A4A3C", left: "#5A3329", right: "#6B3D31" },
  arena: { top: "#9A8466", left: "#6F5E48", right: "#837056" },
  revoque: { top: "#A8A296", left: "#7A756B", right: "#8E887D" },
  vidrioAzul: { top: "#3E5670", left: "#26384B", right: "#30465D" },
  vidrioVerde: { top: "#3D6466", left: "#264446", right: "#305456" },
  terracota: { top: "#8E5A3E", left: "#6A3F2A", right: "#7C4C34" },
  hormigon: { top: "#6E6E6A", left: "#4D4D4A", right: "#5D5D59" },
};

const keys = Object.keys(facades);

/** Material estable para un edificio (por id) o el indicado. */
export const facadeFor = (id: string, name?: string) => facades[name ?? keys[Math.floor(random(`mat-${id}`) * keys.length)]];

export const real = {
  window: "#FFD58F",
  asphalt: "#26282C",
  roadEdge: "#3A3C40",
  roadMark: "#D9B44A",
  sidewalk: "#3E3D3A",
  sidewalkEdge: "#55534F",
  foliage: "#2F5A35",
  foliageTop: "#3F7446",
  trunk: "#5B3F2C",
  lamp: "#FFC877",
  wood: "#6B4A30",
  wallBack: "#9C8D76",
  wallSide: "#7E7160",
  desk: { top: "#8A6644", front: "#6A4E34", right: "#5C432D" },
  paper: "#F4F1EA",
  skin: "#C99A7A",
  shirts: ["#3D6FA8", "#A8473D", "#4F8A5B", "#C9A04A", "#6A5A9E"],
};
