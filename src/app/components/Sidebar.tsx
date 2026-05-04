import { useNavigate, useLocation } from "react-router";
import {
  BookOpen,
  LogOut,
  LucideIcon,
  Settings,
  Users,
  User,
  BarChart3,
  FileText,
  TrendingUp,
  School,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../stores";

export interface SidebarItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

const teacherNavItems: SidebarItem[] = [
  { icon: Users, label: "nav.myClasses", path: "/teacher-dashboard" },
  { icon: FileText, label: "nav.evaluations", path: "/evaluations" },
  { icon: BarChart3, label: "nav.reports", path: "/rapports" },
  { icon: User, label: "nav.profile", path: "/profile" },
  { icon: Settings, label: "nav.settings", path: "/settings" },
];

const boardNavItems: SidebarItem[] = [
  { icon: TrendingUp, label: "nav.overview", path: "/board-dashboard" },
  { icon: School, label: "nav.schools", path: "/board-dashboard/schools" },
  { icon: Users, label: "nav.students", path: "/board-dashboard/students" },
  { icon: BarChart3, label: "nav.reports", path: "/board-dashboard/reports" },
  {
    icon: FileText,
    label: "nav.evaluations",
    path: "/board-dashboard/evaluations",
  },
  {
    icon: BarChart3,
    label: "nav.analytics",
    path: "/board-dashboard/analytics",
  },
  { icon: Settings, label: "nav.settings", path: "/settings" },
];

function SidebarShell({
  items,
  useTranslationKey = false,
}: {
  items: SidebarItem[];
  useTranslationKey?: boolean;
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      className="w-64 p-6 flex flex-col overflow-y-auto flex-shrink-0"
      style={{ background: "#ffffff", borderRight: "1px solid #dff3ff" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-8 h-8" style={{ color: "#004aad" }} />
        <h1 className="text-xl" style={{ color: "#004aad" }}>
          Lecture scientifique
        </h1>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
              style={{
                background: isActive ? "#dff3ff" : "transparent",
                color: isActive ? "#004aad" : "#000000",
              }}
            >
              <Icon className="w-5 h-5" />
              <span>{useTranslationKey ? t(item.label) : item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all mt-4"
        style={{ color: "#ff5757" }}
      >
        <LogOut className="w-5 h-5" />
        <span>{t("nav.logout")}</span>
      </button>
    </div>
  );
}

export function Sidebar() {
  const currentUser = useAuthStore((state) => state.currentUser);
  if (currentUser?.type === "board") {
    return <SidebarShell items={boardNavItems} useTranslationKey />;
  }
  return <SidebarShell items={teacherNavItems} useTranslationKey />;
}
