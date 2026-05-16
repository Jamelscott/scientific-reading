import { useNavigate, useParams } from "react-router";
import { Download, FileCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NotificationDropdown } from "../../components/NotificationDropdown";
import { Initials } from "../../components/Initials";
import { Sidebar } from "../../components/Sidebar";
import { Continuum } from "../../components/LirbaryPage/Continuum";
import { exportContinuumToPdf } from "../../components/utils/exportContinuumToPdf";
import { Button } from "../../components/ui/Button";
import { useUnitsStore } from "../../../stores";

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
  const navigate = useNavigate();
  const { teacherId } = useParams();
  const unitData = useUnitsStore((state) => state.getUnitsData);

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
            {t("units.educationalUnits")}
          </h2>

          <div className="flex flex-wrap gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((unitNum) => {
              const colors = {
                bg: `var(--unit-${unitNum}-bg)`,
                text: `var(--unit-${unitNum}-text)`,
              };
              return (
                <div
                  key={unitNum}
                  className="group flex-1 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 max-w-[200px] min-w-[200px]"
                  style={{
                    background: "#ffffff",
                    borderRadius: "20px",
                    padding: "24px 20px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 12px 24px rgba(0, 0, 0, 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0, 0, 0, 0.06)";
                  }}
                >
                  <div className="flex flex-col justify-between items-center text-center gap-3 w-full">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300"
                      style={{
                        background: colors.bg,
                        boxShadow: `0 4px 16px ${colors.bg}40`,
                      }}
                    >
                      <FileCheck
                        className="w-7 h-7"
                        style={{ color: colors.text }}
                      />
                    </div>
                    <div className="flex flex-col justify-between">
                      <div className="space-y-1">
                        <h3
                          className="font-bold text-base leading-tight"
                          style={{ color: "#004aad" }}
                        >
                          {t("units.unit", { number: unitNum })}
                        </h3>
                        <p
                          className="text-xs leading-snug"
                          style={{ color: "#666", lineHeight: "1.4" }}
                        >
                          {t(`units.unit${unitNum}Desc`)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/teacher/t-1/library/unit/${unitNum}`);
                    }}
                    className="w-full py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer"
                    style={{
                      background: `var(--unit-${unitNum}-bg-15)`,
                      color: `var(--unit-${unitNum}-text)`,
                      border: `2px solid var(--unit-${unitNum}-bg-30)`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `var(--unit-${unitNum}-bg)`;
                      e.currentTarget.style.color = `var(--unit-${unitNum}-text)`;
                      e.currentTarget.style.borderColor = `var(--unit-${unitNum}-bg)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = `var(--unit-${unitNum}-bg-15)`;
                      e.currentTarget.style.color = `var(--unit-${unitNum}-text)`;
                      e.currentTarget.style.borderColor = `var(--unit-${unitNum}-bg-30)`;
                    }}
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
