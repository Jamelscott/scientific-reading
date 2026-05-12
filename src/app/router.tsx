import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { UnderConstructionPage } from "./pages/UnderConstructionPage";
import { useAuthStore } from "../stores";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { UnitEvaluationRouter } from "./pages/routes/UnitEvaluationRouter";

// Teacher pages
import { TeacherDashboard } from "./pages/teacher/Dashboard";
import { ClassPage } from "./pages/teacher/ClassPage";
import { ProfilePage as TeacherProfile } from "./pages/teacher/Profile";
import { SettingsPage as TeacherSettings } from "./pages/teacher/Settings";

// School pages
import { SchoolDashboard } from "./pages/school/Dashboard";
import { SchoolProfile } from "./pages/school/Profile";
import { SchoolReports } from "./pages/school/Reports";
import { SchoolTeachers } from "./pages/school/Teachers";
import { Settings as SchoolSettings } from "./pages/school/Settings";

// Board pages
import { BoardDashboard } from "./pages/board/Dashboard";
import { BoardProfile } from "./pages/board/Profile";
import { BoardReports } from "./pages/board/Reports";
import { BoardSchools } from "./pages/board/Schools";
import { Settings as BoardSettings } from "./pages/board/Settings";

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
    const home =
      currentUser.type === "board"
        ? "/board/dashboard"
        : currentUser.type === "school"
          ? "/school/dashboard"
          : "/teacher/dashboard";
    return <Navigate to={home} replace />;
  }
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
    errorElement: <ErrorBoundary />,
  },

  // ── Teacher flow ───────────────────────────────────────────
  {
    path: "/teacher",
    errorElement: <ErrorBoundary />,
    element: (
      <RequireAuth allowedTypes={["teacher"]}>
        <Outlet />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", Component: TeacherDashboard },
      { path: "class/:classId", Component: ClassPage },
      {
        path: "class/:classId/student/:studentId/evaluation/:evaluationId",
        Component: UnitEvaluationRouter,
        errorElement: <ErrorBoundary />,
      },
      { path: "profile", Component: TeacherProfile },
      { path: "settings", Component: TeacherSettings },
      { path: "units", Component: UnderConstructionPage },
    ],
  },

  // ── School flow ────────────────────────────────────────────
  {
    path: "/school",
    errorElement: <ErrorBoundary />,
    element: (
      <RequireAuth allowedTypes={["school"]}>
        <Outlet />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", Component: SchoolDashboard },
      { path: "profile", Component: SchoolProfile },
      { path: "reports", Component: SchoolReports },
      { path: "teachers", Component: SchoolTeachers },
      { path: "settings", Component: SchoolSettings },
    ],
  },

  // ── Board flow ─────────────────────────────────────────────
  {
    path: "/board",
    errorElement: <ErrorBoundary />,
    element: (
      <RequireAuth allowedTypes={["board"]}>
        <Outlet />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", Component: BoardDashboard },
      { path: "profile", Component: BoardProfile },
      { path: "reports", Component: BoardReports },
      { path: "schools", Component: BoardSchools },
      { path: "settings", Component: BoardSettings },
    ],
  },

  {
    path: "*",
    Component: NotFoundPage,
  },
]);
