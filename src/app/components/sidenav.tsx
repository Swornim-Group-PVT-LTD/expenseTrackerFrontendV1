"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import {
  Wallet,
  ArrowUp,
  ArrowDown,
  PiggyBank,
  TrendingUp,
  Menu,
  LayoutDashboard,
  Folder,
  Plus,
  FileText,
} from "lucide-react";
import { useState } from "react";

import { useTranslation } from "react-i18next";

const dashboardData = [
  {
    title: "dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-6 w-6" />,
    color: "bg-red-900",
  },
  {
    title: "balance",
    href: "/dashboard/balance",
    icon: <Wallet className="h-6 w-6" />,
    color: "bg-blue-800",
  },
  {
    title: "income",
    href: "/dashboard/income",
    icon: <ArrowUp className="h-6 w-6" />,
    color: "bg-green-500",
  },
  {
    title: "expenses",
    href: "/dashboard/expenses",
    icon: <ArrowDown className="h-6 w-6" />,
    color: "bg-red-500",
  },
  {
    title: "savings",
    href: "/dashboard/saving",
    icon: <PiggyBank className="h-6 w-6" />,
    color: "bg-[var(--color2)]",
  },
  {
    title: "investment",
    href: "/dashboard/investment",
    icon: <TrendingUp className="h-6 w-6" />,
    color: "bg-blue-500",
  },
  {
    title: "catalogue",
    href: "/dashboard/catalogue",
    icon: <Folder className="h-6 w-6" />,
    color: "bg-blue-500",
  },
  {
    title: "statement",
    href: "/dashboard/statement",
    icon: <FileText className="h-6 w-6" />,
    color: "bg-purple-500",
  },
];

export default function Sidebar() {
  const { t } = useTranslation();
  const { collapsed, setCollapsed } = useSidebar();
  const pathname = usePathname();
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Separate add categories from other nav items
  const addCategories = dashboardData.filter(item => 
    ['income', 'expenses', 'savings', 'investment'].includes(item.title)
  );
  
  const otherNavItems = dashboardData.filter(item => 
    !['income', 'expenses', 'savings', 'investment'].includes(item.title)
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex ${
          collapsed ? "w-20" : "w-64"
        } bg-[var(--color1)] text-white transition-all duration-500 ease-in-out flex-col h-screen fixed left-0 top-0 z-50`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-4 hover:bg-[#2a2a2a] flex items-center justify-center transition-colors duration-200"
        >
          <Menu className="h-6 w-6" />
        </button>

        <nav className="flex-1 mt-4 space-y-2">
          {dashboardData.map((item, i) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={i}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-all duration-300 ease-in-out ${
                  isActive ? "bg-[var(--color2)]" : "hover:bg-[#2a2a2a]"
                }`}
              >
                <div
                  className={`p-2 rounded-lg flex items-center justify-center transition-transform duration-300 ${
                    isActive ? "bg-[var(--color2)]" : item.color
                  }`}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-sm font-medium transition-all duration-300 ${
                    collapsed
                      ? "opacity-0 w-0 overflow-hidden"
                      : "opacity-100 w-auto"
                  }`}
                >
                  {t(item.title)}
                  
                  {/* {item.title} */}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[var(--color1)] text-white flex justify-around items-center h-20 z-50 shadow-lg">
        {/* Add Menu Dropdown */}
        {showAddMenu && (
          <div className="absolute bottom-20 left-0 w-full bg-[var(--color1)] border-t border-gray-600 p-4">
            <div className="grid grid-cols-2 gap-4">
              {addCategories.map((item, i) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={i}
                    href={item.href}
                    onClick={() => setShowAddMenu(false)}
                    className="flex flex-col items-center justify-center text-xs transition-colors p-2"
                  >
                    <div
                      className={`p-2 rounded-lg flex items-center justify-center ${
                        isActive ? "border-[var(--color2)] border-2" : item.color
                      }`}
                    >
                      {item.icon}
                    </div>
                    <span
                      className={`text-[10px] mt-1 ${
                        isActive ? "text-[var(--color2)] font-semibold" : ""
                      }`}
                    >
                      {item.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Main Nav Items */}
        {otherNavItems.map((item, i) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={i}
              href={item.href}
              className="flex flex-col items-center justify-center text-xs transition-colors"
            >
              <div
                className={`p-2 rounded-lg flex items-center justify-center ${
                  isActive ? "border-[var(--color2)] border-2" : item.color
                }`}
              >
                {item.icon}
              </div>
              <span
                className={`text-[10px] mt-1 ${
                  isActive ? "text-[var(--color2)] font-semibold" : ""
                }`}
              >
                {item.title}
              </span>
            </Link>
          );
        })}
        
        {/* Add Button */}
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="flex flex-col items-center justify-center text-xs transition-colors"
        >
          <div className="p-2 rounded-lg flex items-center justify-center bg-green-600">
            <Plus className="h-6 w-6" />
          </div>
          <span className="text-[10px] mt-1">Add</span>
        </button>
      </nav>
    </>
  );
}
