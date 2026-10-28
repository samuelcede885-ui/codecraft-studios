import { AbsoluteFill } from "remotion";
import { FaryLogo } from "../../components/FaryLogo";
import { palette } from "../Reel02/city/materials";
import { ui } from "../Reel02/ui/kit";
import { Scene3D } from "./Scene3D";
import { s } from "./timeline";

/** Portada vertical para TikTok / Reels: la ciudad conectada (escena 6) con el título. */
export function Reel04Cover() {
  return (
    <AbsoluteFill style={{ background: palette.fondo }}>
      <Scene3D at={s(38.6)} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(8,10,15,0.9) 0%, rgba(8,10,15,0.35) 36%, rgba(8,10,15,0) 55%, rgba(8,10,15,0.75) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <FaryLogo width={300} />
        <div style={{ marginTop: 50, font: `900 104px/0.98 ${ui.display}`, color: "#fff", letterSpacing: "-0.01em", textShadow: "0 8px 50px rgba(0,0,0,0.7)" }}>
          UNA VENEZUELA
          <br />
          <span style={{ color: "#5B8DF7", textShadow: "0 0 40px rgba(37,99,235,0.9)" }}>CONECTADA</span>
        </div>
        <div style={{ marginTop: 30, font: `600 34px ${ui.font}`, color: "#C6CEDC" }}>Así podría ser comprar y vender.</div>
      </div>
    </AbsoluteFill>
  );
}
