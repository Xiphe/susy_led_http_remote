import { Outlet } from "react-router-dom";
import { Navigation } from "@/components";

export function RootLayout() {
  return (
    <div className="container py-2 md:p-8 md:pt-4">
      <Navigation />

      <div className="sm:py-8 sm:px-4">
        <Outlet />
      </div>
    </div>
  );
}
