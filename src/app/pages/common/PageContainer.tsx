import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export function PageContainer({
  navRoute,
  children,
}: {
  navRoute: string;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: "#dff3ff" }}
    >
      {/* Header */}
      <div
        className="p-6 border-b flex-shrink-0 shadow-sm z-11"
        style={{ background: "#ffffff", borderColor: "#dff3ff" }}
      >
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(navRoute)}
            className="flex items-center gap-2 mb-4 text-sm text-[#38b6ff] hover:text-[#2D92CC] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("studentTracking.backToDashboard")}
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
