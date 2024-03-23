import { Outlet } from "react-router-dom";
import {
  Animation,
  Brightness,
  EnabledStrips,
  Palette,
  AnimationParams,
} from "@/components";

export function Root() {
  return (
    <div className="container md:p-8 md:pt-4">
      <Animation />
      <hr />
      <Brightness />
      <hr />
      <EnabledStrips />
      <hr />
      <AnimationParams n={1} />
      <Palette n={1} />
      <Outlet />
    </div>
  );
}
