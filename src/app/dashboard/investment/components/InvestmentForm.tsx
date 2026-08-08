"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import SearchInput from "@/app/components/SearchInput";

import { AddInvestmentPayload } from "@/app/types/investmentType";
import {
  addInvestmentService,
  getTotalInvestmentService,
} from "@/app/services/investmentService";

import { getBalancesService } from "@/app/services/balanceService";
import { BalanceResponse } from "@/app/types/balanceType";

import { getInvestmentCategoriesService } from "@/app/services/catalogueServices/investmentCatalogueService";
import { InvestmentCategoryResponse } from "@/app/types/catalolgueType/investmentCatalogueType";

interface InvestmentFormProps {
  onSuccess?: () => void;
}

const InvestmentForm = ({ onSuccess }: InvestmentFormProps) => {
  const [amount, setAmount] = useState<number | "">(0);
  const [currency, setCurrency] = useState("");
  const [category, setCategory] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<InvestmentCategoryResponse[]>([]);
  const [totalInvestment, setTotalInvestment] = useState<number>(0);

  // ============================================================
  // 1️⃣ Fetch currency symbol from Balance API
  // ============================================================
  const loadCurrencySymbol = async () => {
    try {
      const balances: BalanceResponse[] = await getBalancesService();

      if (balances.length > 0) {
        setCurrency(balances[0].currency.symbol);
      }
    } catch (error) {
      console.error("Failed to load currency symbol:", error);
      setCurrency("$");
    }
  };

  useEffect(() => {
    loadCurrencySymbol();
  }, []);

  // ============================================================
  // 2️⃣ Fetch investment categories
  // ============================================================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getInvestmentCategoriesService();
        setCategories(data);

        // Keep field empty for search input
      } catch (err) {
        console.error("Failed to fetch investment categories:", err);
        toast.error("Failed to fetch investment categories");
      }
    };

    fetchCategories();
  }, []);

  // ============================================================
  // 3️⃣ Fetch Total Investment
  // ============================================================
  const loadTotalInvestment = async () => {
    try {
      const total = await getTotalInvestmentService();
      setTotalInvestment(total);
    } catch (err) {
      console.error("Failed to fetch total investment:", err);
      setTotalInvestment(0);
    }
  };

  useEffect(() => {
    loadTotalInvestment();
  }, []);

  // ============================================================
  // 4️⃣ Add Investment
  // ============================================================
  const handleAddInvestment = async () => {
    if (amount === "" || Number(amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    // Validate category
    const categoryExists = categories.some(
      (cat) => cat.investment_category.toLowerCase() === category.toLowerCase()
    );

    if (!categoryExists) {
      toast.error("Please select a valid category from the list");
      return;
    }

    try {
      setLoading(true);

      const payload: AddInvestmentPayload = {
        add_investment: Number(amount),
        investment_category: category,
      };

      await addInvestmentService(payload);

      toast.success(`Investment of ${currency}${amount} added successfully.`);

      setAmount(0);
      onSuccess && onSuccess();
      loadTotalInvestment();
    } catch (error: any) {
      toast.error(error.message || "Failed to add investment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-span-full lg:col-span-3 h-fit">
      <div className="bg-white rounded-md p-4 w-full h-full flex flex-col gap-4">

        {/* ⭐ Total Investment Display */}
        <div className="mb-4 p-3 rounded-lg bg-[#ffa726] border border-[#3182CE]/30 flex items-center justify-between">
          <span className="text-md font-semibold text-white">Total Investment</span>
          <span className="text-xl font-bold text-white">
            {currency}{totalInvestment?.toLocaleString()}
          </span>
        </div>

        {/*  Input Section */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-stretch sm:items-center">

          {/* AUTO SYMBOL (from Balance API) */}
          <div className="relative w-full sm:w-24">
            <input
              type="text"
              className="w-full h-12 px-2 text-md font-bold text-[#716A6A]
                         border border-[#574A4A]/50 rounded bg-gray-100 cursor-not-allowed"
              value={currency}
              disabled
            />
          </div>

          {/* Amount input */}
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

          {/* Category dropdown */}
          <SearchInput
            options={categories.map(cat => ({ id: cat.id, value: cat.investment_category }))}
            value={category}
            onChange={setCategory}
            placeholder="Type investment category..."
            className="w-full sm:w-80"
          />

          {/* Submit button */}
          <button
            onClick={handleAddInvestment}
            disabled={loading}
            className={`bg-[#FFAA00] hover:bg-[#FFAA00]/90 text-white font-bold text-md px-8 h-12 rounded transition-colors disabled:opacity-50
            w-full sm:w-auto cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Saving..." : "Add"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default InvestmentForm;
