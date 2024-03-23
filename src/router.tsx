import { createBrowserRouter } from "react-router-dom";
import { Root } from "./routes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
]);
