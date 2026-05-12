import { useState } from "react";
import { useTranslation } from "react-i18next";

export function CommentsContainer({
  comments,
  onChange,
}: {
  comments: string;
  onChange: (value: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="mt-8">
      <label className="block mb-2" style={{ color: "#004aad" }}>
        {t("units.comments")}
      </label>
      <textarea
        value={comments}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        className="w-full px-4 py-3 rounded-xl border"
        style={{ background: "#ffffff", borderColor: "#dff3ff" }}
        placeholder={t("units.addComments")}
      />
    </div>
  );
}

export default CommentsContainer;
