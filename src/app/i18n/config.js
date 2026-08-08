"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en/common.json";
import np from "../locales/np/common.json";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      np: { translation: np }
    },
    lng:
      typeof window !== "undefined"
        ? localStorage.getItem("lang") || "en"
        : "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });
}

export default i18n;
