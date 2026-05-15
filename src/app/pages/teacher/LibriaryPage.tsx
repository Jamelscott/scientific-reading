import { useNavigate } from "react-router";
import { Download, FileCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NotificationDropdown } from "../../components/NotificationDropdown";
import { Initials } from "../../components/Initials";
import { Sidebar } from "../../components/Sidebar";
import { Continuum } from "../../components/LirbaryPage/Continuum";
import { exportContinuumToPdf } from "../../components/utils/exportContinuumToPdf";
import { Button } from "../../components/ui/Button";

interface Resource {
  id: number;
  title: string;
  icon: React.ReactNode;
}
const resources = [
  {
    id: 2,
    title: "Unité 1",
    icon: (
      <FileCheck className="w-4 h-4" style={{ color: "var(--unit-1-bg)" }} />
    ),
  },
  {
    id: 3,
    title: "Unité 2",
    icon: (
      <FileCheck className="w-4 h-4" style={{ color: "var(--unit-2-bg)" }} />
    ),
  },
  {
    id: 4,
    title: "Unité 3",
    icon: (
      <FileCheck className="w-4 h-4" style={{ color: "var(--unit-3-bg)" }} />
    ),
  },
  {
    id: 5,
    title: "Unité 4",
    icon: (
      <FileCheck className="w-4 h-4" style={{ color: "var(--unit-4-bg)" }} />
    ),
  },
  {
    id: 6,
    title: "Unité 5",
    icon: (
      <FileCheck className="w-4 h-4" style={{ color: "var(--unit-5-bg)" }} />
    ),
  },
  {
    id: 7,
    title: "Unité 6",
    icon: (
      <FileCheck className="w-4 h-4" style={{ color: "var(--unit-6-bg)" }} />
    ),
  },
  {
    id: 8,
    title: "Unité 7",
    icon: (
      <FileCheck className="w-4 h-4" style={{ color: "var(--unit-7-bg)" }} />
    ),
  },
  {
    id: 9,
    title: "Unité 8",
    icon: (
      <FileCheck className="w-4 h-4" style={{ color: "var(--unit-8-bg)" }} />
    ),
  },
  {
    id: 10,
    title: "Unité 9",
    icon: (
      <FileCheck className="w-4 h-4" style={{ color: "var(--unit-9-bg)" }} />
    ),
  },
  {
    id: 11,
    title: "Unité 10",
    icon: (
      <FileCheck className="w-4 h-4" style={{ color: "var(--unit-10-bg)" }} />
    ),
  },
];

export function LibraryPage() {
  const { t } = useTranslation();

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
              {t("library.library")}
            </h1>
            <p className="text-lg" style={{ color: "#000000" }}>
              {t("library.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <Initials size="sm" />
          </div>
        </div>
        {/* Continuum Section */}
        <Continuum />

        {/* Resources Grid */}
        <div>
          <h2 className="text-2xl mb-4" style={{ color: "#004aad" }}>
            Unités pédagogiques
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource, index) => {
              const unitNum = index + 1;
              const colors = {
                bg: `var(--unit-${unitNum}-bg)`,
                text: `var(--unit-${unitNum}-text)`,
              };
              return (
                <div
                  key={resource.id}
                  className="flex items-center gap-4 px-5 py-4 rounded-xl transition-all hover:shadow-lg cursor-pointer"
                  style={{
                    background: "#ffffff",
                    border: `2px solid ${colors.bg}`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: colors.bg }}
                  >
                    <FileCheck
                      className="w-5 h-5"
                      style={{ color: colors.text }}
                    />
                  </div>

                  <span
                    className="flex-1 font-semibold text-base"
                    style={{ color: "#004aad" }}
                  >
                    {resource.title}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(resource.id);
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                    style={{ background: colors.bg, color: colors.text }}
                  >
                    Ouvrir
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
