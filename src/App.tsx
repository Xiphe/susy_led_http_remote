import { StrictMode } from "react";
import { ConfigProvider } from "./api";
import { RootView } from "@/views";

export default function App() {
  return (
    <StrictMode>
      <ConfigProvider>
        <RootView />
      </ConfigProvider>
    </StrictMode>
  );
}
