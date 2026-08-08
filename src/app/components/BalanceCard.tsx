import React from "react";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

import { getBalancesService } from "@/app/services/balanceService";
import { BalanceResponse } from "@/app/types/balanceType";
import StatCard from "@/app/components/statcard";
import { useRouter } from "next/navigation";

interface BalanceCardProps {
  refreshTrigger: number;
}

const BalanceCard = ({ refreshTrigger }: BalanceCardProps) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("NPR");

  const router = useRouter();

  const handleClick = () => {
    router.push("/dashboard/balance");
  };


  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        const balances: BalanceResponse[] = await getBalancesService();

        if (balances.length > 0) {
          const latestBalance = Number(
            balances[balances.length - 1].total_balance || 0
          );
          setCurrency(balances[balances.length - 1].currency?.symbol || "NPR");
          setBalance(latestBalance);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [refreshTrigger]);

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
          <div className="text-2xl font-bold text-[#07371B] mb-1">{loading ? (
            <ClipLoader size={22} color="#000000" />
          ) : (
            `${currency} ${balance?.toLocaleString() ?? 0}`
          )}</div>
        </div>
      </div>
      <div className="text-xl text-right">

        <span className="text-black/70 font-bold">Your Balance</span>
      </div>
    </div>
  );
};

export default BalanceCard;



