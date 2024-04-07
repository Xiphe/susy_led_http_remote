import { Outlet, useLoaderData } from "react-router-dom";
import { Navigation } from "@/components";

export function RootLayout() {
  useLoaderData();

  return (
    <div className="container min-h-screen py-2 md:p-8 md:pt-4 flex flex-col">
      <Navigation />

      <div className="sm:py-8 sm:px-4 grow flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}
