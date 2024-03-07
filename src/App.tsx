import { StrictMode } from "react";
import { Animation } from "./Animation";
import { Brightness } from "./Brightness";
import { ConfigProvider } from "./config";

export default function App() {
  return (
    <StrictMode>
      <ConfigProvider>
        <Animation />
        <hr />
        <Brightness />
      </ConfigProvider>
    </StrictMode>
  );
}
