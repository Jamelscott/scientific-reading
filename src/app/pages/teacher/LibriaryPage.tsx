import { useNavigate, useParams } from "react-router";
import {
  ArrowRight,
  ChevronDown,
  Download,
  FileCheck,
  FileText,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { NotificationDropdown } from "../../components/NotificationDropdown";
import { Initials } from "../../components/Initials";
import { Sidebar } from "../../components/Sidebar";
import { Continuum } from "../../components/LirbaryPage/Continuum";
import { useUnitsStore } from "../../../stores";

export function LibraryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { teacherId } = useParams();
  const resources = useUnitsStore((state) => state.resources);
  const slugify = (str: string) =>
    str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-");

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
          {/* <div className="flex items-center gap-4">
            <NotificationDropdown />
            <Initials size="sm" />
          </div> */}
        </div>
        {/* Continuum Section */}
        <Continuum />

        {/* Resources Grid */}
        <div>
          <h2
            className="text-3xl mb-8 font-bold mt-16"
            style={{ color: "#004aad" }}
          >
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
                    gap: "16px",
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

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
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
                      {t("library.quickSheet")}
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          `/teacher/${teacherId}/library/unit/${unitNum}`,
                        )
                      }
                      className="w-full py-2 rounded-full text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-md cursor-pointer"
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
                      <ArrowRight className="w-3 h-3" />
                      {t("library.lessons")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Downloadable Resources Section */}
        <h2
          className="text-3xl mb-8 font-bold mt-16"
          style={{ color: "#004aad", letterSpacing: "-0.02em" }}
        >
          {t("library.downloadableResources")}
        </h2>

        <div className="space-y-4">
          {resources.map((category, idx) => (
            <details
              key={idx}
              className="rounded-2xl overflow-hidden transition-all"
              style={{
                background: "#ffffff",
                border: `2px solid ${category.color}20`,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              }}
            >
              <summary
                className="px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-opacity-50 transition-all"
                style={{
                  background: `${category.color}10`,
                  listStyle: "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: category.color }}
                  >
                    <FileText
                      className="w-5 h-5"
                      style={{ color: "#ffffff" }}
                    />
                  </div>
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: "#004aad" }}
                  >
                    {category.title}
                  </h3>
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      background: `${category.color}20`,
                      color: category.color,
                    }}
                  >
                    {t("library.resourcesCount", {
                      count: category.resources.length,
                    })}
                  </span>
                </div>
                <ChevronDown
                  className="w-5 h-5"
                  style={{ color: category.color }}
                />
              </summary>
              <div className="p-6 grid grid-cols-3 gap-3">
                {category.resources.map((resource, resIdx) => {
                  const categorySlug = slugify(category.title);
                  const firstActivity =
                    resource.activities && resource.activities[0];
                  const activitySlug = firstActivity
                    ? slugify(firstActivity.name)
                    : slugify(resource.title);
                  return (
                    <button
                      key={resIdx}
                      onClick={() =>
                        navigate(
                          `/teacher/${teacherId}/library/resources/${categorySlug}/${activitySlug}`,
                        )
                      }
                      className="flex items-center gap-2 px-4 py-3 rounded-xl transition-all text-left hover:shadow-md cursor-pointer"
                      style={{
                        background: `${category.color}08`,
                        border: `1px solid ${category.color}20`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${category.color}15`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = `${category.color}08`;
                      }}
                    >
                      <Download
                        className="w-4 h-4"
                        style={{ color: category.color }}
                      />
                      <span className="text-sm" style={{ color: "#004aad" }}>
                        {resource.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
