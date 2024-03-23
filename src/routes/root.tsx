import { Outlet } from "react-router-dom";
import {
  Animation,
  Brightness,
  EnabledStrips,
  Palette,
  AnimationParams,
} from "@/components";
import { TopNavigation } from "@/components";

export function Root() {
  return (
    <div className="container py-2 md:p-8 md:pt-4">
      <TopNavigation />

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
