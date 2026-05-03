import React from "react";
import { useTranslation } from "react-i18next";

export default function TranslationToggle() {
  const { i18n } = useTranslation();
  const current = i18n.language || "fr";

  const setLang = (lng: string) => {
    void i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLang("fr")}
        aria-pressed={current.startsWith("fr")}
        className={
          "px-3 py-1 rounded-md transition-colors " +
          (current.startsWith("fr")
            ? "bg-blue-600 text-white"
            : "bg-white border text-slate-700")
        }
      >
        FR
      </button>

      <button
        onClick={() => setLang("en")}
        aria-pressed={current.startsWith("en")}
        className={
          "px-3 py-1 rounded-md transition-colors " +
          (current.startsWith("en")
            ? "bg-blue-600 text-white"
            : "bg-white border text-slate-700")
        }
      >
        EN
      </button>
    </div>
  );
}
