import { useState } from "react";
import { Bell, Globe, Shield, User } from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import { NotificationDropdown } from "../components/NotificationDropdown";
import { useTranslation } from "react-i18next";
import TranslationToggle from "../components/TranslationToggle";

export function SettingsPage() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weeklyReport: true,
  });

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{ background: "#dff3ff" }}
    >
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-12 overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <h1 className="text-3xl mb-2" style={{ color: "#004aad" }}>
              {t("settings.title")}
            </h1>
            <p className="text-lg" style={{ color: "#000000" }}>
              {t("settings.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "#38b6ff", color: "#ffffff" }}
            >
              MG
            </div>
          </div>
        </div>

        <div className="max-w-4xl space-y-6">
          {/* Language Card */}
          <div
            className="rounded-2xl p-8 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "#dff3ff" }}
              >
                <Globe className="w-5 h-5" style={{ color: "#004aad" }} />
              </div>
              <h2 className="text-xl" style={{ color: "#004aad" }}>
                {t("settings.language")}
              </h2>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm" style={{ color: "#6b7280" }}>
                {t("settings.languageDescription")}
              </p>
              <TranslationToggle />
            </div>
          </div>

          {/* Notifications Card */}
          <div
            className="rounded-2xl p-8 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "#dff3ff" }}
              >
                <Bell className="w-5 h-5" style={{ color: "#004aad" }} />
              </div>
              <h2 className="text-xl" style={{ color: "#004aad" }}>
                {t("settings.notifications")}
              </h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  key: "email" as const,
                  label: t("settings.emailNotifications"),
                },
                {
                  key: "push" as const,
                  label: t("settings.pushNotifications"),
                },
                {
                  key: "weeklyReport" as const,
                  label: t("settings.weeklyReport"),
                },
              ].map(({ key, label }) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                  style={{ borderColor: "#dff3ff" }}
                >
                  <span style={{ color: "#000000" }}>{label}</span>
                  <button
                    onClick={() =>
                      setNotifications((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                      }))
                    }
                    className="w-12 h-6 rounded-full transition-all relative"
                    style={{
                      background: notifications[key] ? "#004aad" : "#d1d5db",
                    }}
                  >
                    <span
                      className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
                      style={{ left: notifications[key] ? "26px" : "2px" }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Account Card */}
          <div
            className="rounded-2xl p-8 shadow-lg"
            style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "#dff3ff" }}
              >
                <User className="w-5 h-5" style={{ color: "#004aad" }} />
              </div>
              <h2 className="text-xl" style={{ color: "#004aad" }}>
                {t("settings.account")}
              </h2>
            </div>
            <div className="space-y-3">
              <button
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                style={{ background: "#dff3ff", color: "#004aad" }}
              >
                <Shield className="w-5 h-5" />
                {t("settings.changePassword")}
              </button>
              <button
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                style={{
                  background: "#fff0f0",
                  color: "#ff5757",
                  border: "1px solid #ffd5d5",
                }}
              >
                {t("settings.deleteAccount")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
