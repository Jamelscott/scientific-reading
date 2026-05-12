import { useNavigate } from "react-router";
import { BookOpen, MoveLeft, HardHat } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../stores";

export function UnderConstructionPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);

  const homePath =
    currentUser?.type === "board"
      ? "/board/dashboard"
      : currentUser?.type === "school"
        ? "/school/dashboard"
        : "/teacher/dashboard";

  return (
    <div
      className="h-screen flex flex-col items-center justify-center gap-6"
      style={{ background: "#dff3ff" }}
    >
      <div
        className="rounded-2xl p-12 shadow-lg flex flex-col items-center gap-4 text-center max-w-md w-full"
        style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
      >
        <HardHat className="w-20 h-20" style={{ color: "#ffde59" }} />
        <h1 className="text-2xl" style={{ color: "#004aad" }}>
          {t("underConstruction.title")}
        </h1>
        <p className="text-base" style={{ color: "#6b7280" }}>
          {t("underConstruction.description")}
        </p>

        <button
          onClick={() => navigate(homePath)}
          className="mt-4 flex items-center gap-2 px-6 py-3 rounded-xl transition-all"
          style={{ background: "#004aad", color: "#ffffff" }}
        >
          <MoveLeft className="w-5 h-5" />
          {t("notFound.backToDashboard")}
        </button>
      </div>
    </div>
  );
}
