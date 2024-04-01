import { PALETTE_KEYS, PREVIEW, useConfig } from "@/api";
import { Switch } from "@/components";
import { useLocalStorage } from "@/utils";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export function PaletteDesigner() {
  const { p } = useParams();

  if (p !== "a" && p !== "b") {
    throw new Error("Invalid palette parameter");
  }

  return (
    <>
      <PreviewSwitch p={p} />
    </>
  );
}

type PreviewSwitchProps = {
  p: "a" | "b";
};

function PreviewSwitch({ p }: PreviewSwitchProps) {
  const [config, setConfig] = useConfig();
  const setPreviewMode = (preview: boolean) => {
    const previewMode = preview
      ? PREVIEW.paletteStart +
        (p === "a" ? PALETTE_KEYS.custom1 : PALETTE_KEYS.custom2)
      : PREVIEW.noPreview;

    setConfig({
      previewMode,
    });
  };

  const [preview, setPreview] = useLocalStorage<boolean>(
    "preview-palettes",
    true
  );

  useEffect(() => {
    setPreviewMode(preview);
  }, [preview, setConfig]);
  useEffect(() => () => setPreviewMode(false), [setConfig]);

  return (
    <label className="space-y-2">
      <div className="flex items-center space-x-2">
        <Switch checked={preview} onCheckedChange={setPreview} />{" "}
        <span>Preview Palette</span>
      </div>
      <p className="text-muted-foreground text-sm m-0">
        Show the palette in the room while editing
      </p>
    </label>
  );
}
