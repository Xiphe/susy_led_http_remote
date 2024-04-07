import {
  Animation,
  Brightness,
  EnabledStrips,
  Palette,
  AnimationParams,
} from "@/components";

export function Root() {
  return (
    <div>
      <Animation />
      <hr />
      <Brightness />
      <hr />
      <EnabledStrips />
      <hr />
      <AnimationParams n={1} />
      <Palette n={1} />
    </div>
  );
}
