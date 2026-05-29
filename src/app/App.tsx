import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./router";
import { GlobalLoadingSpinner } from "./components/GlobalLoadingSpinner";
import { useAuthStore, useTeacherStore } from "../stores";

export default function App() {
  return (
    <>
      <GlobalLoadingSpinner />
      <RouterProvider router={router} />
    </>
  );
}
