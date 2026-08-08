"use client";

import LanguageSelector from "@/app/components/LanguageSelector"
import { useTranslation } from "react-i18next";
import { Settings, Globe, User, Bell, Shield, Palette } from "lucide-react";

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

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Language Settings Card */}
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

         

          {/* Security Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Security</h3>
                <p className="text-sm text-gray-500">Manage your account security</p>
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left text-sm text-gray-700 hover:text-gray-900 py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors">
                Change Password
              </button>

            </div>
          </div>

          

        </div>
      </div>
    </div>
  );
}
