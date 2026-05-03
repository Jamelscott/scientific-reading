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
} from "lucide-react";
import { useTranslation } from "react-i18next";

export interface SidebarItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

const navItems: SidebarItem[] = [
  { icon: Users, label: "nav.myClasses", path: "/dashboard" },
  { icon: FileText, label: "nav.evaluations", path: "/evaluations" },
  { icon: BarChart3, label: "nav.reports", path: "/rapports" },
  { icon: User, label: "nav.profile", path: "/profile" },
  { icon: Settings, label: "nav.settings", path: "/settings" },
];

export function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <div
      className="w-64 p-6 flex flex-col overflow-y-auto flex-shrink-0"
      style={{ background: "#ffffff", borderRight: "1px solid #dff3ff" }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8" style={{ color: "#004aad" }} />
          <h1 className="text-xl" style={{ color: "#004aad" }}>
            {t("app.title")}
          </h1>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
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
              <span>{t(item.label)}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all mt-4"
        style={{ color: "#ff5757" }}
      >
        <LogOut className="w-5 h-5" />
        <span>{t("nav.logout")}</span>
      </button>
    </div>
  );
}
