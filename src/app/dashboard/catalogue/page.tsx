"use client";

import { useRouter } from "next/navigation";
import {
  Wallet,
  ArrowUp,
  ArrowDown,
  PiggyBank,
  Home,
  Info,
} from "lucide-react";

const catalogues = [
  {
    label: "Add Expenses Catalogue",
    icon: <ArrowDown size={32} />,
    path: "catalogue/expenseCatalogue",
    bgClass: "bg-red-500",
  },
  {
    label: "Add Income Catalogue",
    icon: <ArrowUp size={32} />,
    path: "catalogue/incomeCatalogue",
    bgClass: "bg-green-600",
  },
  {
    label: "Add Saving Catalogue",
    icon: <PiggyBank size={32} />,
    path: "catalogue/savingCatalogue",
    bgClass: "bg-[#f7bc4c]",
  },
  {
    label: "Add Investment Catalogue",
    icon: <Wallet size={32} />,
    path: "catalogue/investmentCatalogue",
    bgClass: "bg-blue-500",
  },
  {
    label: "Add Currency Catalogue",
    icon: <Wallet size={32} />,
    path: "catalogue/currencyCatalogue",
    bgClass: "bg-green-400",
  },
];

export default function CatalogueUI() {
  const router = useRouter();

  return (
    <div>
      {/* Breadcrumb & Title */}
      <div className="mb-4">
        <div className="flex items-center gap-1 text-md mb-1 md:mb-4">
          <Home className="w-4 h-4" />
          <span>/Catalogue</span>
        </div>
        <h1 className="text-2xl font-bold">Add Your Static Values</h1>
      </div>

      {/* Catalogue Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {catalogues.map((item) => (
          <div
            key={item.label}
            className={`flex flex-col items-center justify-center p-6 shadow-md rounded-xl cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1 ${item.bgClass}`}
            onClick={() => router.push(item.path)}
          >
            <div className="mb-4 text-white">{item.icon}</div>
            <span className="text-center font-medium text-white">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Notification Card */}
      <div className="flex items-start gap-4 bg-yellow-100 border-l-4 border-yellow-400 p-6 rounded-lg mt-6">
        <Info className="w-6 h-6 text-yellow-600 mt-1" />
        <p className="text-yellow-800">
          <strong>Note:</strong> From this page you can create your new custom
          remarks that will appear in a dropdown. So no need to type remarks,
          you can simply select from the dropdown.
        </p>
      </div>
    </div>
  );
}
