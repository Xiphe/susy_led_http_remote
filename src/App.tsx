import { StrictMode } from "react";
import { RouterProvider } from "react-router-dom";
import { ConfigProvider } from "./api";
import { router } from "./router";

export default function App() {
  return (
    <StrictMode>
      <ConfigProvider>
        <RouterProvider router={router} />
      </ConfigProvider>
    </StrictMode>
  );
}
