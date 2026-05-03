import { RouterProvider } from "react-router";
import { router } from "./routes";
import { GlobalLoadingSpinner } from "./components/GlobalLoadingSpinner";

export default function App() {
  return (
    <>
      <GlobalLoadingSpinner />
      <RouterProvider router={router} />
    </>
  );
}
