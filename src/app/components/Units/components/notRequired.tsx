import { useTranslation } from "react-i18next";

export function NotRequired() {
  const { t } = useTranslation();
  return (
    <div
      className="p-12 rounded-xl text-center"
      style={{ background: "#fff9e6", border: "2px solid #ffde59" }}
    >
      <p className="text-2xl mb-3" style={{ color: "#004aad" }}>
        {t("evaluation.markedNotRequired")}
      </p>
      <p className="text-lg" style={{ color: "#000000" }}>
        {t("evaluation.notRequiredDesc")}
      </p>
    </div>
  );
}

export default NotRequired;
