import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "../public/locales/en/translation.json";
import fr from "../public/locales/fr/translation.json";

i18n
  .use(LanguageDetector)   // auto-detect browser language
  .use(initReactI18next)   // bind to React
  .init({
    fallbackLng: "fr",     // default to French (app is French-first)
    supportedLngs: ["en", "fr"],
    debug: import.meta.env.DEV,

    interpolation: {
      escapeValue: false,  // React already escapes values
    },

    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
  });

export default i18n;
