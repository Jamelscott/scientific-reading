import { useState } from "react";
import { useTranslation } from "react-i18next";

export function UnitContainer({
  notRequired,
  children,
}: {
  notRequired: boolean;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-[#DFF3FF]">
      <div className="max-w-7xl mx-auto">
        <div
          className="rounded-2xl p-8 shadow-lg"
          style={{ background: "#ffffff", border: "1px solid #dff3ff" }}
        >
          {notRequired ? (
            <div
              className="p-12 rounded-xl text-center"
              style={{ background: "#fff9e6", border: "2px solid #ffde59" }}
            >
              <p className="text-2xl mb-3" style={{ color: "#004aad" }}>
                {t("units.notRequired.title")}
              </p>
              <p className="text-lg" style={{ color: "#000000" }}>
                {t("units.notRequired.description")}
              </p>
            </div>
          ) : (
            <>{children}</>
          )}
        </div>
      </div>
    </div>
  );
}

export default UnitContainer;
