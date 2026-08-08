"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import SearchInput from "@/app/components/SearchInput";

import { AddIncomePayload } from "@/app/types/incomeType";
import { addIncomeService } from "@/app/services/incomeService";
import { getTotalIncomeService } from "@/app/services/incomeService";
import { getIncomeCategoriesService } from "@/app/services/catalogueServices/incomeCatalogueService";
import { getBalancesService } from "@/app/services/balanceService";

import { IncomeCategoryResponse } from "@/app/types/catalolgueType/incomeCatalogueType";
import { BalanceResponse } from "@/app/types/balanceType";

interface IncomeFormProps {
  onSuccess?: () => void;
}

const IncomeForm = ({ onSuccess }: IncomeFormProps) => {
  const [amount, setAmount] = useState<number | "">(0);
  const [currency, setCurrency] = useState(""); // SYMBOL FROM BALANCE API
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<IncomeCategoryResponse[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);

  // ============================================================
  // 1️⃣ Fetch currency SYMBOL from BALANCE API
  // ============================================================
  const loadCurrencySymbol = async () => {
    try {
      const balances: BalanceResponse[] = await getBalancesService();

      if (balances.length > 0) {
        // IMPORTANT — Correct symbol path
        setCurrency(balances[0].currency.symbol);
      }
    } catch (error) {
      console.error("Failed to load currency symbol:", error);
      setCurrency("$"); // fallback
    }
  };

  useEffect(() => {
    loadCurrencySymbol();
  }, []);

  // ============================================================
  // 2️⃣ Fetch income categories
  // ============================================================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getIncomeCategoriesService();
        setCategories(data);

        // Keep field empty for search input
      } catch (err) {
        toast.error("Failed to fetch income categories");
      }
    };

    fetchCategories();
  }, []);

  // ============================================================
  // 3️⃣ Fetch Total Income
  // ============================================================
  const loadTotalIncome = async () => {
    try {
      const total = await getTotalIncomeService();
      setTotalIncome(total);
    } catch (error) {
      console.error("Failed to fetch total income:", error);
      setTotalIncome(0);
    }
  };

  useEffect(() => {
    loadTotalIncome();
  }, []);

  // ============================================================
  // 4️⃣ Add Income
  // ============================================================
  const handleAddIncome = async () => {
    // Validate category
    const categoryExists = categories.some(
      (cat) => cat.income_category.toLowerCase() === remarks.toLowerCase()
    );

    if (!categoryExists) {
      toast.error("Please select a valid category from the list");
      return;
    }

    try {
      setLoading(true);

      const payload: AddIncomePayload = {
        add_income: Number(amount),
        income_category: remarks,
      };

      await addIncomeService(payload);

      toast.success(`Income of ${currency}${amount} added successfully.`);

      setAmount(0);
      onSuccess && onSuccess();
      loadTotalIncome();
    } catch (error: any) {
      toast.error(error.message || "Failed to add income");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-span-full lg:col-span-3 h-fit">
      <div className="bg-white rounded-md p-4 w-full h-full flex flex-col gap-4">
        {/* TOTAL INCOME */}
        <div className="mb-4 p-3 rounded-lg bg-[#5eac24] border border-[#38A169]/30 flex items-center justify-between">
          <span className="text-md font-semibold text-[#FFFFFF]">
            Total Income
          </span>
          <span className="text-xl font-bold text-[#FFFFFF]">
            {currency}
            {totalIncome?.toLocaleString()}
          </span>
        </div>

        {/* INPUT ROW */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-stretch sm:items-center">
          {/* AUTO SYMBOL (from balance API) */}
          <div className="relative w-full sm:w-24">
            <input
              type="text"
              className="w-full h-12 px-2 text-md font-bold text-[#716A6A]
                         border border-[#574A4A]/50 rounded bg-gray-100 cursor-not-allowed"
              value={currency}
              disabled
            />
          </div>

          {/* Amount Input */}
          <input
            type="number"
            placeholder="400000"
            className="flex-1 h-12 min-h-[48px] px-3 text-md font-bold text-[#716A6A] 
                   border border-[#574A4A]/50 rounded outline-none 
                   focus:border-[#FFA726]
                   [appearance:textfield] 
                   [&::-webkit-outer-spin-button]:appearance-none 
                   [&::-webkit-inner-spin-button]:appearance-none"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value === "" ? "" : Number(e.target.value))
            }
          />

          {/* Remarks Selector */}
          <SearchInput
            options={categories.map(cat => ({ id: cat.id, value: cat.income_category }))}
            value={remarks}
            onChange={setRemarks}
            placeholder="Type income category..."
            className="w-full sm:w-80"
          />

          {/* Submit Button */}
          <button
            onClick={handleAddIncome}
            disabled={loading}
            className={`bg-[#FFAA00] hover:bg-[#FFAA00]/90 text-white font-bold text-md px-8 h-12 rounded transition-colors disabled:opacity-50 w-full sm:w-auto cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Saving..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomeForm;
