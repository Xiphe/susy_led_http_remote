import { StrictMode } from "react";
import { Animation } from "./Animation";
import { Brightness } from "./Brightness";
import { ConfigProvider } from "./api";
import { EnabledStrips } from "./EnabledStrips";
import { Palette } from "./Palette";
import { AnimationParams } from "./AnimationParams";

export default function App() {
  return (
    <StrictMode>
      <ConfigProvider>
        <Animation />
        <hr />
        <Brightness />
        <hr />
        <EnabledStrips />
        <hr />
        <AnimationParams n={1} />
        <Palette n={1} />
      </ConfigProvider>
    </StrictMode>
  );
}
