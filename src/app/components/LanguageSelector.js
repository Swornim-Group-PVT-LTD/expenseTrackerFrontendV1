"use client";

import { useTranslation } from "react-i18next";

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <div>
      

      <select
        value={i18n.language}
        onChange={(e) => changeLang(e.target.value)}
      >
        <option value="en">English</option>
        <option value="np">नेपाली</option>
      </select>
    </div>
  );
}
