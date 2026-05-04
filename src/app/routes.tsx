import { createBrowserRouter, Navigate } from "react-router";
import { LoginPage } from "./pages/LoginPage";
import { TeacherDashboard } from "./pages/TeacherDashboard";
import { ClassPage } from "./pages/ClassPage";
import { SchoolBoardDashboard } from "./pages/SchoolBoardDashboard";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { UnderConstructionPage } from "./pages/UnderConstructionPage";
import { useAuthStore } from "../stores";

function RequireAuth({
  children,
  allowedTypes,
}: {
  children: React.ReactNode;
  allowedTypes?: string[];
}) {
  const currentUser = useAuthStore.getState().currentUser;
  if (!currentUser) return <Navigate to="/" replace />;
  if (allowedTypes && !allowedTypes.includes(currentUser.type)) {
    return (
      <Navigate
        to={
          currentUser.type === "board"
            ? "/board-dashboard"
            : "/teacher-dashboard"
        }
        replace
      />
    );
  }
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/teacher-dashboard",
    element: (
      <RequireAuth allowedTypes={["teacher"]}>
        <TeacherDashboard />
      </RequireAuth>
    ),
  },
  {
    path: "/class/:classId",
    element: (
      <RequireAuth allowedTypes={["teacher"]}>
        <ClassPage />
      </RequireAuth>
    ),
  },
  {
    path: "/board-dashboard",
    element: (
      <RequireAuth allowedTypes={["board"]}>
        <SchoolBoardDashboard />
      </RequireAuth>
    ),
  },
  {
    path: "/profile",
    element: (
      <RequireAuth allowedTypes={["teacher"]}>
        <ProfilePage />
      </RequireAuth>
    ),
  },
  {
    path: "/settings",
    element: (
      <RequireAuth>
        <SettingsPage />
      </RequireAuth>
    ),
  },
  {
    path: "/rapports",
    element: (
      <RequireAuth allowedTypes={["teacher"]}>
        <ReportsPage />
      </RequireAuth>
    ),
  },
  {
    path: "/evaluations",
    element: (
      <RequireAuth>
        <UnderConstructionPage />
      </RequireAuth>
    ),
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);
