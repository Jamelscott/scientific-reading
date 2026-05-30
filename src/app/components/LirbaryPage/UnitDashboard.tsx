import { useNavigate, useParams } from "react-router";
import { ArrowLeft, FileText, Book, Download, FileCheck } from "lucide-react";
import { NotificationDropdown } from "../NotificationDropdown";
import { useTranslation } from "react-i18next";

const resourceTitles: { [key: string]: string } = {
  "1": "Unité 1",
  "2": "Unité 2",
  "3": "Unité 3",
  "4": "Unité 4",
  "5": "Unité 5",
  "6": "Unité 6",
  "7": "Unité 7",
  "8": "Unité 8",
  "9": "Unité 9",
  "10": "Unité 10",
};
const unitColors: { [key: string]: string } = {
  "1": "#EFF5FF",
  "2": "#3b82f6",
  "3": "#38bdf8",
  "4": "#22d3ee",
  "5": "#a3e635",
  "6": "#fbbf24",
  "7": "#fb923c",
  "8": "#fb7185",
  "9": "#a855f7",
  "10": "#0ea5e9",
  "11": "#ef4444",
};

export function UnitDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { unitId, teacherId } = useParams();
  const resourceTitle = resourceTitles[unitId!];
  const unitColor = unitColors[unitId || "2"];

  const getEvaluationRange = (id: string) => {
    const ranges: { [key: string]: string } = {
      "1": "Ateliers 1, 2, 3, 4",
      "2": "Atelier 5",
      "3": "Atelier 6",
      "4": "Atelier 7",
      "5": "Atelier 8",
      "6": "Atelier 9",
      "7": "Atelier 10",
      "8": "Atelier 11",
      "9": "Atelier 12",
      "10": "Atelier 13",
    };
    return ranges[id] || "Ateliers 1, 2, 3, 4";
  };

  const resourceOptions = [
    {
      id: 1,
      title: "Fiche rapide",
      description: "Document PDF de référence rapide",
      icon: <FileText className="w-6 h-6" style={{ color: "#004aad" }} />,
      type: "pdf",
    },
    {
      id: 2,
      title: "Leçons",
      description: "Accéder aux leçons détaillées",
      icon: <Book className="w-6 h-6" style={{ color: "#38b6ff" }} />,
      type: "lessons",
    },
    {
      id: 3,
      title: "Livret",
      description: "Document PDF du livret complet",
      icon: <FileText className="w-6 h-6" style={{ color: "#004aad" }} />,
      type: "pdf",
    },
    {
      id: 4,
      title: "Activités supplémentaires",
      description: "Document PDF avec activités additionnelles",
      icon: <FileText className="w-6 h-6" style={{ color: "#004aad" }} />,
      type: "pdf",
    },
  ];

  const handleOptionClick = (option: (typeof resourceOptions)[0]) => {
    if (option.type === "lessons") {
      navigate(`/teacher/${teacherId}/library/unit/${unitId}/lessons`);
    } else {
      console.log(`Opening PDF for ${option.title}`);
    }
  };

  const lessonCount = unitId === "2" ? 13 : 8;
  const lessons = Array.from({ length: lessonCount }, (_, i) => i + 1);

  // Group lessons into columns with up to 4 items each
  const itemsPerColumn = 4;
  const columns: number[][] = [];
  for (let i = 0; i < lessons.length; i += itemsPerColumn) {
    columns.push(lessons.slice(i, i + itemsPerColumn));
  }
  const colors = {
    bg: `var(--unit-${unitId}-bg)`,
    text: `var(--unit-${unitId}-text)`,
  };
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "rgba(59, 130, 246, 0.082)",
        minHeight: "100vh",
      }}
    >
      <div className="h-full">
        <div
          className="p-12 pb-8"
          style={{
            background: "#ffffff",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <button
                onClick={() => navigate(`/teacher/${teacherId}/library/`)}
                className="flex items-center gap-2 mb-4 text-sm hover:font-bold"
                style={{ color: "#38b6ff" }}
              >
                <ArrowLeft className="w-4 h-4" />
                {t("library.backToLibrary")}
              </button>

              <div className="flex items-center gap-3 mb-2">
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
                <div>
                  <p className="text-sm" style={{ color: "#666" }}>
                    {getEvaluationRange(unitId || "2")}
                  </p>
                  <h1 className="text-3xl" style={{ color: "#004aad" }}>
                    {resourceTitle}
                  </h1>
                </div>
              </div>

              <p className="text-lg" style={{ color: "#000000" }}>
                {t("library.selectOption")}
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
        </div>

        {/* Lessons Grid - dynamic columns with max 4 items each */}
        <div className="p-12 pt-8">
          <div className="flex gap-6 flex-wrap">
            {columns.map((col, colIndex) => (
              <div
                key={colIndex}
                className="flex-1 min-w-[260px] flex flex-col gap-6"
              >
                {col.map((lessonNum) => (
                  <details
                    key={lessonNum}
                    className="rounded-xl overflow-hidden transition-all w-full"
                    style={{
                      background: "#ffffff",
                      border: `2px solid var(--unit-${unitId}-color-30)`,
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                    }}
                  >
                    <summary
                      className="px-4 py-3 cursor-pointer flex items-center justify-between transition-all list-none"
                      style={{ background: `var(--unit-${unitId}-bg-15)` }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                          style={{
                            background: `var(--unit-${unitId}-bg)`,
                            color: `var(--unit-${unitId}-text)`,
                          }}
                        >
                          {lessonNum}
                        </div>
                        <span
                          className="text-sm font-semibold"
                          style={{ color: "#004aad" }}
                        >
                          Leçon {lessonNum}
                        </span>
                      </div>
                    </summary>
                    <div className="p-6 space-y-4">
                      <div>
                        <h3
                          className="text-xl font-bold"
                          style={{ color: "#004aad" }}
                        >
                          Leçon {lessonNum} — Titre de la leçon {lessonNum}
                        </h3>
                        <p className="text-sm text-gray-700 mt-2">
                          Description de la leçon {lessonNum}. Ce bloc occupe
                          plus d'espace pour donner l'apparence d'une page
                          dédiée à la leçon.
                        </p>
                      </div>

                      <div className="p-4 space-y-2">
                        <button
                          onClick={() =>
                            navigate(
                              `/resource/${unitId}/lesson/${lessonNum}/interactive`,
                            )
                          }
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-left text-sm"
                          style={{
                            background: `${unitColor}08`,
                            border: `1px solid ${unitColor}20`,
                            color: "#004aad",
                          }}
                        >
                          <Book
                            className="w-4 h-4"
                            style={{ color: unitColor }}
                          />{" "}
                          Leçon interactive
                        </button>
                        <button
                          onClick={() =>
                            navigate(
                              `/resource/${unitId}/lesson/${lessonNum}/worksheet`,
                            )
                          }
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-left text-sm"
                          style={{
                            background: `${unitColor}08`,
                            border: `1px solid ${unitColor}20`,
                            color: "#004aad",
                          }}
                        >
                          <Download
                            className="w-4 h-4"
                            style={{ color: unitColor }}
                          />{" "}
                          Fiche d'activité associée
                        </button>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
