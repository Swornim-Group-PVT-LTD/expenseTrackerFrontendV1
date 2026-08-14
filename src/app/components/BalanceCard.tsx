import React from "react";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

import { getBalancesService } from "@/app/services/balanceService";
import { BalanceResponse } from "@/app/types/balanceType";
import StatCard from "@/app/components/statcard";
import { useRouter } from "next/navigation";

import { useBalanceVisibility } from "@/app/context/BalanceHideShowContext";
import { maskAmount } from "@/app/utils/maskAmount";
import { Eye, EyeOff } from "lucide-react";

interface BalanceCardProps {
  refreshTrigger: number;
}

const BalanceCard = ({ refreshTrigger }: BalanceCardProps) => {
  const [balance, setBalance] = useState<number | null>(null);
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
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance(0);
        setCurrency("NPR");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [refreshTrigger]);

  const renderBalanceValue = () => {
    if (loading) {
      return <ClipLoader size={22} color="#000000" />;
    }
    return maskAmount(balance ?? 0, isVisible, currency);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md p-3 flex flex-col gap-4 h-36 mt-2 hover:shadow-lg transition-shadow hover:scale-[1.02] hover:cursor-pointer"
    >
      <div className="relative flex items-start gap-2 mb-1">
        <img
          src="/balance-logo.svg"
          alt="Balance"
          className="absolute -top-8 left-6 w-12 h-12 md:w-16 md:h-16 shrink-0"
        />
        <div className="flex flex-col items-end w-full align-bottom min-w-0">
          <div className="text-xl font-bold mb-1" style={{ color: "#000000" }}>
            Balance
          </div>
          <div className="text-2xl font-bold text-[#07371B] mb-1 flex items-center gap-2">
            <button
              onClick={handleToggleVisibility}
              aria-label={isVisible ? "Hide balance" : "Show balance"}
              title={isVisible ? "Hide balance" : "Show balance"}
              className="text-[#07371B]/60 hover:text-[#07371B] transition-colors cursor-pointer shrink-0"
            >
              {isVisible ? (
                <Eye size={18} className="md:w-5 md:h-5" />
              ) : (
                <EyeOff size={18} className="md:w-5 md:h-5" />
              )}
            </button>
            {renderBalanceValue()}
          </div>
        </div>
      </div>
      <div className="text-xl text-right">
        <span className="text-black/70 font-bold">Your Balance</span>
      </div>
    </div>
  );
};

export default BalanceCard;
