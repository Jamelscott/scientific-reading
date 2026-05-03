import { useTranslation } from "react-i18next";

export function EvaluationLegend() {
  const { t } = useTranslation();

  return (
    <div className="flex gap-6 mt-6">
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg"
          style={{ background: "#c9e265" }}
        ></div>
        <span style={{ color: "#000000" }}>
          {t("studentTracking.legend.success")}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg"
          style={{ background: "#ffde59" }}
        ></div>
        <span style={{ color: "#000000" }}>
          {t("studentTracking.legend.adequate")}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg"
          style={{ background: "#ff5757" }}
        ></div>
        <span style={{ color: "#000000" }}>
          {t("studentTracking.legend.needsImprovement")}
        </span>
      </div>
    </div>
  );
}
