"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Plus, Info } from "lucide-react";
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
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-end gap-3">
        {/* Currency Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Select Currency
          </label>
          <div className="relative">
            <select
              className="appearance-none w-28 h-12 pl-3 pr-8 text-base font-medium text-gray-800 border border-gray-300 rounded-lg cursor-pointer bg-white outline-none focus:border-green-600"
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

            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Amount Input */}
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            placeholder="40,000"
            className="w-full h-12 px-3 text-base text-gray-800 border border-gray-300 rounded-lg bg-gray-50 outline-none focus:border-green-600"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleAddBalance}
          disabled={loading}
          className="flex items-center gap-1.5 bg-[#297513] hover:bg-green-800 text-white font-semibold text-base px-6 h-12 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Plus className="w-4 h-4" strokeWidth={3} />
          {loading ? "Saving..." : "Add"}
        </button>
      </div>

      {/* Helper text */}
      <div className="flex items-center gap-1.5 mt-3 text-sm text-gray-500">
        <Info className="w-4 h-4" />
        <span>This amount will be added to your total balance.</span>
      </div>
    </div>
  );
}
