import { createBrowserRouter, matchPath } from "react-router-dom";
import {
  RootLayout,
  PaletteDesigner,
  createPalettePreviewSwitch,
} from "./routes";
import { Root } from "./routes/root";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: createPalettePreviewSwitch("/palette/:p", [
      { path: "/", element: <Root /> },
      { path: "/animation/0", element: <h1>Hello</h1> },
      {
        path: "/palette/:p",
        element: <PaletteDesigner />,
      },
    ]),
  },
]);
