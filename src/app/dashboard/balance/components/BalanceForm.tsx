"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Swal from "sweetalert2";

// Services
import {
  addBalanceService,
  getBalancesService,
} from "../../../services/balanceService";
import { getCurrencyService } from "@/app/services/catalogueServices/currencyCatalogueService";

// Types
import { AddBalancePayload, BalanceResponse } from "../../../types/balanceType";
import { CurrencyResponse } from "@/app/types/currencyType";

export default function BalanceForm({ onSuccess }: { onSuccess?: () => void }) {
  const [amount, setAmount] = useState<number | "">(40000);
  const [currencyList, setCurrencyList] = useState<CurrencyResponse[]>([]);
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [currencyId, setCurrencyId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [balanceExists, setBalanceExists] = useState(false);

  // Load balance & currency list
  useEffect(() => {
    const init = async () => {
      try {
        // Check existing balance
        const balance: BalanceResponse = await getBalancesService();

        if (balance) {
          setBalanceExists(true);
        } else {
          setBalanceExists(false);
        }

        // Fetch currency list
        const currencies = await getCurrencyService();
        setCurrencyList(currencies);

        // Set default currency
        if (currencies.length > 0) {
          setCurrencySymbol(currencies[0].symbol);
          setCurrencyId(currencies[0].id);
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        setBalanceExists(false);
      }
    };

    init();
  }, []);
  const handleAddBalance = async () => {
    if (balanceExists) {
      Swal.fire({
        icon: "info",
        title: "Balance Already Added",
        text: "Balance has already been added. Add more through Income.",
      });
      return;
    }

    try {
      setLoading(true);

      const payload: AddBalancePayload = {
        add_opening_balance: Number(amount),
        currency_id: currencyId ?? 0,
      };

      await addBalanceService(payload);

      Swal.fire({
        icon: "success",
        title: "Balance Added!",
        text: `Balance of ${currencySymbol}${amount} added successfully.`,
        timer: 2000,
        showConfirmButton: false,
      });

      setAmount(0);
      setBalanceExists(true);

      if (onSuccess) onSuccess();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.message || "Failed to add balance",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center gap-2">
        {/* Currency Dropdown */}
        <div className="relative">
          <select
            className="appearance-none w-24 h-12 px-2 text-md font-bold text-[#716A6A] border border-[#574A4A]/50 rounded cursor-pointer bg-white"
            value={currencyId ?? ""}
            onChange={(e) => {
              const selected = currencyList.find(
                (item) => item.id === Number(e.target.value),
              );

              if (selected) {
                setCurrencySymbol(selected.symbol);
                setCurrencyId(selected.id);
              }
            }}
          >
            {currencyList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.symbol}
              </option>
            ))}
          </select>

          <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-[#716A6A] pointer-events-none" />
        </div>

        {/* Amount Input */}
        <input
          type="number"
          placeholder="400000"
          className="flex-1 h-12 px-3 text-sm text-[#716A6A] border border-[#574A4A]/50 rounded outline-none focus:border-[#FFA726]"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value === "" ? "" : Number(e.target.value))
          }
        />

        {/* Submit Button */}
        <button
          onClick={handleAddBalance}
          disabled={loading}
          className="bg-[#FFAA00] hover:bg-[#FFAA00]/90 text-white font-bold text-md px-6 h-12 rounded transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Saving..." : "Add"}
        </button>
      </div>
    </div>
  );
}
