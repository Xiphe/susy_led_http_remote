import { PALETTE_KEYS, PREVIEW, updateConfigThrottled, useConfig } from "@/api";
import { Switch } from "@/components";
import { useState } from "react";
import {
  RouteObject,
  matchPath,
  useParams,
  useRouteLoaderData,
} from "react-router-dom";

const PALETTE_LOCAL_STORAGE_KEY = "preview-palettes";
const PREVIEW_SWITCH_ROUTE_ID = "preview-switch-route";

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

type PaletteKey = "a" | "b";

type PreviewSwitchProps = {
  p: PaletteKey;
};

function PreviewSwitch({ p }: PreviewSwitchProps) {
  const { show } = useRouteLoaderData(PREVIEW_SWITCH_ROUTE_ID) as LoaderDate;
  const [_, setConfig] = useConfig();
  const [preview, setPreview] = useState(() => show);

  return (
    <label className="space-y-2">
      <div className="flex items-center space-x-2">
        <Switch
          checked={preview}
          onCheckedChange={(checked) => {
            setPreview(checked);
            localStorage.setItem(
              PALETTE_LOCAL_STORAGE_KEY,
              JSON.stringify(checked)
            );
            setConfig({
              previewMode: getPreviewMode(checked, p),
            });
          }}
        />{" "}
        <span>Preview Palette</span>
      </div>
      <p className="text-muted-foreground text-sm m-0">
        Show the palette in the room while editing
      </p>
    </label>
  );
}

function getPreviewMode(enabled: boolean, palette?: string) {
  if (palette !== "a" && palette !== "b") {
    enabled = false;
  }

  return enabled
    ? PREVIEW.paletteStart +
        (palette === "a" ? PALETTE_KEYS.custom1 : PALETTE_KEYS.custom2)
    : PREVIEW.noPreview;
}

type LoaderDate = Awaited<
  ReturnType<ReturnType<typeof createPalettePreviewSwitch>[0]["loader"]>
>;

export function createPalettePreviewSwitch(
  palettePath: string,
  children: RouteObject[]
) {
  return [
    {
      id: PREVIEW_SWITCH_ROUTE_ID,
      async loader({ params, request }): Promise<{ show: boolean }> {
        const isPaletteRoute = Boolean(
          matchPath(palettePath, new URL(request.url).pathname)
        );
        let show = JSON.parse(
          localStorage.getItem(PALETTE_LOCAL_STORAGE_KEY) ?? "true"
        );
        if (show !== true && show !== false) {
          localStorage.removeItem(PALETTE_LOCAL_STORAGE_KEY);
          show = true;
        }

        await updateConfigThrottled({
          previewMode: getPreviewMode(isPaletteRoute && show, params.p),
        });

        return { show };
      },
      shouldRevalidate: () => true,
      children,
    },
  ] satisfies RouteObject[];
}
