"use client";

import LanguageSelector from "@/app/components/LanguageSelector"
import { useTranslation } from "react-i18next";
import { Settings, Globe } from "lucide-react";
import AccountDetailsForm from "./AccountDetailsForm";

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">{t("settings")}</h1>
          </div>
          <p className="text-gray-600">Manage your account preferences and application settings</p>
        </div>

        <div className="space-y-6">
          <AccountDetailsForm />
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{t("language")}</h3>
                <p className="text-sm text-gray-500">Choose your preferred language</p>
              </div>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </div>
    </div>
  );
}
