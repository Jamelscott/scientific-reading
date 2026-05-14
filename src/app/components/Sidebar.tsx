import { useNavigate, useLocation } from "react-router";
import {
  BookOpen,
  LogOut,
  LucideIcon,
  Settings,
  Users,
  User,
  BarChart3,
  Book,
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
  { icon: Users, label: "nav.myClasses", path: "/teacher/dashboard" },
  { icon: Book, label: "nav.library", path: "/teacher/library" },
  { icon: BarChart3, label: "nav.reports", path: "/teacher/reports" },
  { icon: User, label: "nav.profile", path: "/teacher/profile" },
  { icon: Settings, label: "nav.settings", path: "/teacher/settings" },
];

const getTeacherNavItems = (teacherId: string): SidebarItem[] => [
  {
    icon: Users,
    label: "nav.myClasses",
    path: `/teacher/${teacherId}/dashboard`,
  },
  { icon: Book, label: "nav.library", path: `/teacher/${teacherId}/library` },
  {
    icon: BarChart3,
    label: "nav.reports",
    path: `/teacher/${teacherId}/reports`,
  },
  { icon: User, label: "nav.profile", path: `/teacher/${teacherId}/profile` },
  {
    icon: Settings,
    label: "nav.settings",
    path: `/teacher/${teacherId}/settings`,
  },
];

const schoolNavItems: SidebarItem[] = [
  { icon: TrendingUp, label: "nav.overview", path: "/school/dashboard" },
  { icon: Users, label: "nav.teachers", path: "/school/teachers" },
  { icon: BarChart3, label: "nav.reports", path: "/school/reports" },
  { icon: User, label: "nav.profile", path: "/school/profile" },
  { icon: Settings, label: "nav.settings", path: "/school/settings" },
];

const boardNavItems: SidebarItem[] = [
  { icon: TrendingUp, label: "nav.overview", path: "/board/dashboard" },
  { icon: School, label: "nav.schools", path: "/board/schools" },
  { icon: BarChart3, label: "nav.reports", path: "/board/reports" },
  { icon: User, label: "nav.profile", path: "/board/profile" },
  { icon: Settings, label: "nav.settings", path: "/board/settings" },
];

function SidebarShell({
  items,
  useTranslationKey = false,
  portalKey,
}: {
  items: SidebarItem[];
  useTranslationKey?: boolean;
  portalKey: string;
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
      className="w-72 p-6 flex flex-col overflow-y-auto flex-shrink-0"
      style={{ background: "#ffffff", borderRight: "1px solid #dff3ff" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-8 h-8" style={{ color: "#004aad" }} />
        <div>
          <h1 className="text-xl" style={{ color: "#004aad" }}>
            Lecture Scientifique
          </h1>
          <p
            className="text-xs mt-0.5 px-2 py-0.5 rounded-full inline-block"
            style={{
              background:
                portalKey === "portal.board"
                  ? "var(--portal-board-bg)"
                  : portalKey === "portal.school"
                    ? "var(--portal-school-bg)"
                    : "var(--portal-teacher-bg)",
              border: `1px solid ${
                portalKey === "portal.board"
                  ? "var(--portal-board-border)"
                  : portalKey === "portal.school"
                    ? "var(--portal-school-border)"
                    : "var(--portal-teacher-border)"
              }`,
              color: "#004aad",
            }}
          >
            {t(portalKey)}
          </p>
        </div>
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
    return (
      <SidebarShell
        items={boardNavItems}
        useTranslationKey
        portalKey="portal.board"
      />
    );
  }
  if (currentUser?.type === "school") {
    return (
      <SidebarShell
        items={schoolNavItems}
        useTranslationKey
        portalKey="portal.school"
      />
    );
  }
  if (!currentUser) return null; // Or handle loading/error state
  return (
    <SidebarShell
      items={getTeacherNavItems(currentUser.id)}
      useTranslationKey
      portalKey="portal.teacher"
    />
  );
}
