import { createBrowserRouter } from "react-router-dom";
import { Root } from "./routes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/animation/0", element: <h1>Hello</h1> },
      { path: "/palette/b", element: <h1>Hello</h1> },
    ],
  },
]);
