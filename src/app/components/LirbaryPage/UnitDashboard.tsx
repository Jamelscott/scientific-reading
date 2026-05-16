import { useNavigate, useParams } from "react-router";
import {
  BookOpen,
  BarChart3,
  User,
  LogOut,
  Users,
  ArrowLeft,
  FileText,
  Book,
  Download,
} from "lucide-react";
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
  console.log(unitId, resourceTitles);
  const unitColor = unitColors[unitId || "2"];
  console.log(unitId);
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
      // Handle PDF download/view
      console.log(`Opening PDF for ${option.title}`);
    }
  };

  return (
    <div
      className="h-screen overflow-hidden"
      style={{
        backgroundColor: "rgba(59, 130, 246, 0.082)",
      }}
    >
      {/* Main Content */}
      <div className="h-full overflow-y-auto">
        {/* Header */}
        <div className="p-12 pb-8" style={{ background: "#ffffff" }}>
          <div className="flex items-start justify-between">
            <div>
              <button
                onClick={() => navigate(`/teacher/${teacherId}/library/`)}
                className="flex items-center gap-2 mb-4 text-sm"
                style={{ color: "#38b6ff" }}
              >
                <ArrowLeft className="w-4 h-4" />
                {t("library.backToLibrary")}
              </button>
              <h1 className="text-3xl mb-2" style={{ color: "#004aad" }}>
                {resourceTitle} - {t(`units.unit${unitId}Desc`)}
              </h1>
              <div
                className="inline-block px-4 py-2 rounded-xl mb-3"
                style={{ background: "#f7ffd6", border: "1px solid #c9e265" }}
              >
                <p style={{ color: "#004aad" }}>
                  {getEvaluationRange(unitId || "2")}
                </p>
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

        {/* Resource Options */}
        <div className="p-12 pt-8">
          <div className="flex flex-wrap gap-6">
            {resourceOptions.map((option) => (
              <button
                key={option.id}
                className="rounded-2xl flex flex-col justify-between p-8 shadow-lg transition-all hover:shadow-xl text-left h-[250px] w-[325px]"
                style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
              >
                <div>
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "#dff3ff" }}
                  >
                    {option.icon}
                  </div>

                  <h3 className="text-xl mb-2" style={{ color: "#004aad" }}>
                    {option.title}
                  </h3>

                  <p
                    className="text-sm mb-4"
                    style={{ color: "#000000", opacity: 0.7 }}
                  >
                    {option.description}
                  </p>
                </div>

                <div
                  className="flex items-center gap-2"
                  style={{ color: "#38b6ff" }}
                >
                  {option.type === "pdf" ? (
                    <div className="flex gap-3 items-center cursor-pointer">
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Télécharger PDF</span>
                    </div>
                  ) : (
                    <div
                      className="flex gap-3 cursor-pointer"
                      onClick={() => handleOptionClick(option)}
                    >
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                      <span className="text-sm">Accéder</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
