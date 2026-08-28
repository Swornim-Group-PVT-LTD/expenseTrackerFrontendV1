import React from "react";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

import { getBalancesService } from "@/app/services/balanceService";
import { BalanceResponse } from "@/app/types/balanceType";
import { useRouter } from "next/navigation";

import { useBalanceVisibility } from "@/app/context/BalanceHideShowContext";
import { maskAmount } from "@/app/utils/maskAmount";
import { Wallet, EyeOff, Eye, TrendingUp, TrendingDown } from "lucide-react";

interface BalanceCardProps {
  refreshTrigger: number;
}

const BalanceCard = ({ refreshTrigger }: BalanceCardProps) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [changePercent, setChangePercent] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("NPR");
  const { isVisible, toggleVisibility } = useBalanceVisibility();

  const router = useRouter();

  const handleToggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleVisibility();
  };

  const handleClick = () => {
    router.push("/dashboard/balance");
  };

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);

        const balance: BalanceResponse = await getBalancesService();

        const latestBalance = Number(balance.closing_balance || 0);

        setCurrency(balance.currency?.symbol || "NPR");
        setBalance(latestBalance);

        // Optional: percentage vs last month, if the API returns it
        if (typeof (balance as any).change_percent === "number") {
          setChangePercent((balance as any).change_percent);
        } else {
          setChangePercent(null);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance(0);
        setCurrency("NPR");
        setChangePercent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [refreshTrigger]);

  const renderBalanceValue = () => {
    if (loading) {
      return <ClipLoader size={24} color="#07371B" />;
    }
    return maskAmount(balance ?? 0, isVisible, currency);
  };

  const isPositive = (changePercent ?? 0) >= 0;

  return (
    <div
      onClick={handleClick}
      className="relative overflow-hidden rounded-2xl shadow-sm p-5 h-36 flex items-center justify-between gap-4 hover:shadow-md transition-shadow hover:cursor-pointer"
      style={{
        background: "linear-gradient(135deg, #EAF3EC 0%, #F5FAF6 60%)",
      }}
    >
      {/* Left: icon + amount */}
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#0B3D2E] flex items-center justify-center shrink-0 shadow-sm">
          <Wallet className="w-6 h-6 text-white" />
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-[#0B3D2E]">
              Total Balance
            </span>
            <button
              onClick={handleToggleVisibility}
              aria-label={isVisible ? "Hide balance" : "Show balance"}
              title={isVisible ? "Hide balance" : "Show balance"}
              className="text-[#0B3D2E]/50 hover:text-[#0B3D2E] transition-colors cursor-pointer shrink-0"
            >
              {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>

          <span className="text-3xl md:text-4xl font-bold text-[#0B3D2E] mt-1 truncate">
            {renderBalanceValue()}
          </span>

          <span className="text-sm text-[#0B3D2E]/60 mt-1">
            Your current balance
          </span>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
