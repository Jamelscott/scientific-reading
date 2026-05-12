import { useTranslation } from "react-i18next";

export function EvaluationLegend() {
  const { t } = useTranslation();

  const getStatusColor = (
    status:
      | "success"
      | "adequate"
      | "needs-improvement"
      | "not-required"
      | null,
  ) => {
    if (status === "success") return "#c9e265";
    if (status === "adequate") return "#ffde59";
    if (status === "needs-improvement") return "#ff5757";
    if (status === "not-required") return "#b8a3d6";
    return "#d1d5db";
  };

  const getStatusText = (
    status:
      | "success"
      | "adequate"
      | "needs-improvement"
      | "not-required"
      | null,
  ) => {
    if (status === "success") return "En voie/acquis";
    if (status === "adequate") return "À surveiller";
    if (status === "needs-improvement") return "À risque";
    if (status === "not-required") return "Non requis";
    return "Non évalué";
  };

  return (
    <div className="flex gap-6 mt-6">
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
          style={{ background: "#c9e265", color: "#000000" }}
        >
          75+
        </div>
        <span style={{ color: "#000000" }}>
          {t("studentTracking.legend.success")}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
          style={{ background: "#ffde59", color: "#000000" }}
        >
          50+
        </div>
        <span style={{ color: "#000000" }}>
          {t("studentTracking.legend.adequate")}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
          style={{ background: "#ff5757", color: "#ffffff" }}
        >
          &lt;50
        </div>
        <span style={{ color: "#000000" }}>
          {t("studentTracking.legend.needsImprovement")}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
          style={{ background: "#b8a3d6", color: "#000000" }}
        />
        <span style={{ color: "#000000" }}>
          {t("studentTracking.legend.notRequired")}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
          style={{ background: "lightgrey", color: "#000000" }}
        ></div>
        <span style={{ color: "#000000" }}>
          {t("studentTracking.legend.notComplete")}
        </span>
      </div>
    </div>
  );
}
