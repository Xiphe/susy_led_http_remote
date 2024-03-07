import { StrictMode } from "react";
import { Animation } from "./Animation";
import { Brightness } from "./Brightness";
import { ConfigProvider } from "./config";
import { EnabledStrips } from "./EnabledStrips";

export default function App() {
  return (
    <StrictMode>
      <ConfigProvider>
        <Animation />
        <hr />
        <Brightness />
        <hr />
        <EnabledStrips />
      </ConfigProvider>
    </StrictMode>
  );
}
