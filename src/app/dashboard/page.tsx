"use client";

import { useEffect, useState } from "react";
import { Home, ArrowUp, ArrowDown, PiggyBank, TrendingUp } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import { useRouter } from "next/navigation";

import StatCard from "@/app/components/statcard";
import MonthlyBarChart from "@/app/components/DashboardBarChart";
import ExpensesPieChart from "@/app/components/ExpensePieChart";
import ExpensesLineChart from "@/app/components/ExpensesLineChart";
import BalanceCard from "@/app/components/BalanceCard";

import { getBalancesService } from "../services/balanceService";
import { getTotalExpenseService } from "../services/expenseService";
import { getTotalSavingService } from "../services/savingService";
import { getTotalIncomeService } from "../services/incomeService";
import { getTotalInvestmentService } from "../services/investmentService";

import { BalanceResponse } from "../types/balanceType";

export default function Dashboard() {
  const [balance, setBalance] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [totalSaving, setTotalSaving] = useState<number>(0);
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<string>("");

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [
          balanceResponse,
          totalExpenses,
          totalSaving,
          totalIncome,
          totalInvestment,
        ]: [BalanceResponse, number, number, number, number] =
          await Promise.all([
            getBalancesService(),
            getTotalExpenseService(),
            getTotalSavingService(),
            getTotalIncomeService(),
            getTotalInvestmentService(),
          ]);

        // Balance
        const bal = balanceResponse?.closing_balance ?? 0;
        setBalance(Number(bal));

        // Currency
        const detectedCurrency = balanceResponse?.currency?.symbol;
        setCurrency(detectedCurrency || "");

        // Totals
        setTotalExpenses(Number(totalExpenses) || 0);
        setTotalSaving(Number(totalSaving) || 0);
        setTotalIncome(Number(totalIncome) || 0);
        setTotalInvestment(Number(totalInvestment) || 0);
      } catch (error) {
        console.error("Dashboard loading error:", error);

        setBalance(0);
        setTotalExpenses(0);
        setTotalSaving(0);
        setTotalIncome(0);
        setTotalInvestment(0);
        setCurrency("");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const dashboardData = [
    {
      title: "Income",
      value: totalIncome,
      icon: "/income-logo.svg",
      labelColor: "#5EAC24",
      lucideIcon: <ArrowUp className="w-6 h-6" />,
    },
    {
      title: "Expenses",
      value: totalExpenses,
      icon: "/expenses-logo.svg",
      labelColor: "#E63F32",
      lucideIcon: <ArrowDown className="w-6 h-6" />,
    },
    {
      title: "Saving",
      value: totalSaving,
      icon: "/saving-logo.svg",
      labelColor: "#4EA890",
      lucideIcon: <PiggyBank className="w-6 h-6" />,
    },
    {
      title: "Investment",
      value: totalInvestment,
      icon: "/investment-logo.svg",
      labelColor: "#FFA726",
      lucideIcon: <TrendingUp className="w-6 h-6" />,
    },
  ];

  const router = useRouter();
  const handleClick = (label: string) => {
    router.push(`/dashboard/${label.toLowerCase()}`);
  };

  // Format displayed currency safely
  const formatCurrency = (value: number) => {
    if (!currency) return value.toLocaleString(); // No currency → show only number
    return `${currency} ${value.toLocaleString()}`;
  };

  return (
    <main>
      <div className="flex items-center gap-1 text-md mb-1 md:mb-4">
        <Home className="w-4 h-4" />
        <span>/Dashboard</span>
      </div>

      <div className="space-y-3 md:space-y-4">
        {/* Header + Add buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>

          {/* Desktop buttons */}
          <div className="hidden sm:block lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4 h-16">
              {dashboardData.map((item, index) => (
                <button
                  key={index}
                  style={{ backgroundColor: item.labelColor }}
                  className="text-white text-lg font-bold py-2 px-3 rounded hover:opacity-90 transition shadow-md cursor-pointer"
                  onClick={() => handleClick(item.title)}
                >
                  {`Add ${item.title}`}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile circular icons */}
          <div className="sm:hidden lg:col-span-2">
            <div className="grid grid-cols-4 gap-3 mb-4">
              {dashboardData.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleClick(item.title)}
                  className="flex flex-col items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md"
                    style={{ backgroundColor: item.labelColor }}
                  >
                    {item.lucideIcon}
                  </div>
                  <span className="text-sm mt-1 font-bold text-gray-700 hidden sm:block">
                    Add {item.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Balance + Line Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1">
            <BalanceCard refreshTrigger={refreshTrigger} />
          </div>

          <div className="lg:col-span-3 rounded-xl">
            <ExpensesLineChart />
          </div>
        </div>

        {/* Four Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {dashboardData.map((item, index) => (
            <StatCard
              key={index}
              icon={item.icon}
              label={
                item.title as "income" | "expenses" | "saving" | "investment"
              }
              labelColor={item.labelColor}
            />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MonthlyBarChart />
          <ExpensesPieChart />
        </div>
      </div>
    </main>
  );
}
