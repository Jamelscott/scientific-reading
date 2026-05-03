import { useNavigate } from "react-router";
import { BookOpen, MoveLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      className="h-screen flex flex-col items-center justify-center gap-6"
      style={{ background: "#dff3ff" }}
    >
      <div className="flex items-center gap-3 mb-4">
        <BookOpen className="w-8 h-8" style={{ color: "#004aad" }} />
        <span className="text-xl" style={{ color: "#004aad" }}>
          {t("app.title")}
        </span>
      </div>

      <div
        className="rounded-2xl p-12 shadow-lg flex flex-col items-center gap-4 text-center max-w-md w-full"
        style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
      >
        <p className="text-8xl font-bold" style={{ color: "#004aad" }}>
          404
        </p>
        <h1 className="text-2xl font-semibold" style={{ color: "#004aad" }}>
          {t("notFound.title")}
        </h1>
        <p className="text-base" style={{ color: "#6b7280" }}>
          {t("notFound.description")}
        </p>

        <button
          onClick={() => navigate("/dashboard")}
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
