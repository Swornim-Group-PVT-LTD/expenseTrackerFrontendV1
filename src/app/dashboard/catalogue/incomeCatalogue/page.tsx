"use client";

import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import IncomeCatalogueForm from "./components/incomeCatalogueForm";
import IncomeCatalogueTable from "./components/incomeCatalogueTable";
import { useState } from "react";


export default function IncomeCatalogueUI() {
  const router = useRouter();

      const [refreshTrigger, setRefreshTrigger] = useState(0);
  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="p-4">
      {/* Breadcrumb & Title */}
      <div className="mb-4">
        <div className="flex items-center gap-1 text-md mb-2">
          <Home className="w-4 h-4" />
          <span>/ Add Income Catalogue</span>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-4">Add Income Catalogue</h1>
      </div>

      {/* Form */}
      <IncomeCatalogueForm onSuccess={refreshData} />

      <div className="mt-5 mb-10"></div>

      {/* Table */}
      <IncomeCatalogueTable refreshTrigger={refreshTrigger} />
    </div>
  );
}
