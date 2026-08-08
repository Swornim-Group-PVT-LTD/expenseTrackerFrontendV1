"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import CurrencyCatalogueForm from "./component/currencyCatalogueForm";
import CurrencyCatalougeTable from "./component/currencyCatalougeTable"; 
export default function CurrencyCatalogueUI() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const router = useRouter();

  return (
    <div className="p-4">
      {/* Breadcrumb & Title */}
      <div className="mb-4">
        <div className="flex items-center gap-1 text-md mb-2">
          <Home className="w-4 h-4" />
          <span>/ Add Currency Catalogue</span>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-4">Add Currency Catalogue</h1>
      </div>

      {/* Form */}
      <CurrencyCatalogueForm onSuccess={refreshData} />

      <div className="mt-5 mb-10"></div>

      {/* Table */}
      <CurrencyCatalougeTable refreshTrigger={refreshTrigger} /> 
    </div>
  );
}
