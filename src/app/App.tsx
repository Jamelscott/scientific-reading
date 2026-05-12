import { RouterProvider } from "react-router";
import { router } from "./router";
import { GlobalLoadingSpinner } from "./components/GlobalLoadingSpinner";

export default function App() {
  return (
    <>
      <GlobalLoadingSpinner />
      <RouterProvider router={router} />
    </>
  );
}
