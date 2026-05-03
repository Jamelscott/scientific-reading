import { createBrowserRouter } from "react-router";
import { LoginPage } from "./pages/LoginPage";
import { TeacherDashboard } from "./pages/TeacherDashboard";
import { ClassPage } from "./pages/ClassPage";
import { SchoolBoardDashboard } from "./pages/SchoolBoardDashboard";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/dashboard",
    Component: TeacherDashboard,
  },
  {
    path: "/class/:classId",
    Component: ClassPage,
  },
  {
    path: "/board",
    Component: SchoolBoardDashboard,
  },
  {
    path: "/profile",
    Component: ProfilePage,
  },
  {
    path: "/settings",
    Component: SettingsPage,
  },
  {
    path: "/rapports",
    Component: ReportsPage,
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);
