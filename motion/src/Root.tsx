import { Composition, Folder } from "remotion";
import { fary } from "./theme/fary";
import { loadFaryFonts } from "./theme/fonts";
import { demo } from "./data/reels";
import { Demo } from "./compositions/Demo/Demo";
import { PhonePreview } from "./compositions/PhonePreview/PhonePreview";

loadFaryFonts();

const { width, height, fps } = fary.video;

export function Root() {
  return (
    <>
      <Folder name="Base">
        <Composition id={demo.id} component={Demo} durationInFrames={demo.durationInFrames} fps={fps} width={width} height={height} defaultProps={{ guides: false }} />
        <Composition id="PhonePreview" component={PhonePreview} durationInFrames={90} fps={fps} width={width} height={height} />
      </Folder>
    </>
  );
}
