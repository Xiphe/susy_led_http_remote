import { useParams } from "react-router-dom";
import { PreviewSwitch } from "./PreviewSwitch";
import { PaletteInput } from "./PaletteInput";

export { createPalettePreviewSwitch } from "./PreviewSwitch";

export function PaletteDesigner() {
  const { p } = useParams();

  if (p !== "a" && p !== "b") {
    throw new Error("Invalid palette parameter");
  }

  return (
    <>
      <PaletteInput />
      <PreviewSwitch p={p} />
    </>
  );
}
