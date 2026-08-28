import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

import { getFilteredCardsDataService } from "../services/cardFitlerService";
import { useBalanceVisibility } from "@/app/context/BalanceHideShowContext";
import { maskAmount } from "@/app/utils/maskAmount";

interface StatCardProps {
  icon: string;
  label: "income" | "expenses" | "saving" | "investment";
  labelColor: string;
}

type FilterType = "daily" | "weekly" | "monthly" | "yearly" | "total";

const periodText: Record<FilterType, string> = {
  daily: "Today",
  weekly: "This Week",
  monthly: "This Month",
  yearly: "This Year",
  total: "Total",
};

const labelTitle: Record<StatCardProps["label"], string> = {
  income: "Total Income",
  expenses: "Total Expenses",
  saving: "Total Savings",
  investment: "Total Investments",
};

export default function StatCard({ icon, label, labelColor }: StatCardProps) {
  const router = useRouter();
  const { isVisible } = useBalanceVisibility();

  const handleClick = () => {
    router.push(`/dashboard/${label.toLowerCase()}`);
  };

  const getInitialValue = (label: string): FilterType => {
    switch (label.toLowerCase()) {
      case "income":
        return "monthly";
      case "expenses":
        return "monthly";
      case "saving":
        return "total";
      case "investment":
        return "total";
      default:
        return "total";
    }
  };

  const [filterType] = useState<FilterType>(() => getInitialValue(label));
  const [value, setValue] = useState<number>(0);
  const [changePercent, setChangePercent] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("Rs");

  useEffect(() => {
    fetchStat();
  }, [filterType]);

  const fetchStat = async () => {
    setLoading(true);
    try {
      const res = await getFilteredCardsDataService(
        filterType,
        label.toLowerCase(),
      );
      const total = res[`total_${label.toLowerCase()}`] ?? 0;
      setValue(Number(total));
      setCurrency(res.currency?.symbol || "Rs");

      // Optional: percentage vs last period, if the API returns it
      if (typeof res.change_percent === "number") {
        setChangePercent(res.change_percent);
      } else {
        setChangePercent(null);
      }
    } catch (error) {
      console.error(`Failed to fetch ${label} data:`, error);
      setValue(0);
      setChangePercent(null);
    } finally {
      setLoading(false);
    }
  };

  const renderBalanceValue = () => {
    if (loading) {
      return <ClipLoader size={20} color={labelColor} />;
    }
    return maskAmount(value, isVisible, currency);
  };

  const isPositive = (changePercent ?? 0) >= 0;

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition-shadow hover:cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${labelColor}1A` }}
          >
            <img
              src={icon}
              alt={label}
              className="w-7 h-7 md:w-8 md:h-8 object-contain"
            />
          </div>

          <div className="flex flex-col min-w-0">
            <span
              className="text-base font-semibold"
              style={{ color: labelColor }}
            >
              {labelTitle[label.toLowerCase() as StatCardProps["label"]]}
            </span>
            <span className="text-2xl font-semibold text-[#07371B] truncate">
              {renderBalanceValue()}
            </span>
            <span className="text-sm text-gray-400">
              {periodText[filterType]}
            </span>
          </div>
        </div>

        {changePercent !== null && (
          <div className="flex flex-col items-end shrink-0">
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-bold"
              style={{
                backgroundColor: isPositive ? "#E6F4EA" : "#FCE8E6",
                color: isPositive ? "#2E7D32" : "#C62828",
              }}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {Math.abs(changePercent)}%
            </div>
            <span className="text-xs text-gray-400 mt-1">vs last month</span>
          </div>
        )}
      </div>

      {/* Bottom row: view details link */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="text-sm font-medium" style={{ color: labelColor }}>
          View {label} details
        </span>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
}
