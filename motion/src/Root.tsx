import { Composition, Folder } from "remotion";
import { fary } from "./theme/fary";
import { loadFaryFonts } from "./theme/fonts";
import { demo, reel01 } from "./data/reels";
import { Demo } from "./compositions/Demo/Demo";
import { Reel01 } from "./compositions/Reel01TuNegocioNoDeberiaDependerDeTi/Reel01";
import { WebTour } from "./compositions/WebTour/WebTour";
import { webTour } from "./data/webTour";

loadFaryFonts();

const { width, height, fps } = fary.video;

export function Root() {
  return (
    <>
      <Folder name="Reels">
        <Composition id={reel01.id} component={Reel01} durationInFrames={reel01.durationInFrames} fps={fps} width={width} height={height} defaultProps={{ guides: false }} />
        <Composition id={webTour.id} component={WebTour} durationInFrames={webTour.durationInFrames} fps={fps} width={width} height={height} />
      </Folder>
      <Folder name="Base">
        <Composition id={demo.id} component={Demo} durationInFrames={demo.durationInFrames} fps={fps} width={width} height={height} />
      </Folder>
    </>
  );
}
