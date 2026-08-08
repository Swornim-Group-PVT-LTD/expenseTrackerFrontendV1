"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import SearchInput from "@/app/components/SearchInput";

import { AddSavingPayload } from "@/app/types/savingType";
import { addSavingService } from "@/app/services/savingService";
import { getTotalSavingService } from "@/app/services/savingService";
import { getSavingCategoriesService } from "@/app/services/catalogueServices/savingCatalogueService";
import { SavingCategoryResponse } from "@/app/types/catalolgueType/savingCatalogueType";

import { getBalancesService } from "@/app/services/balanceService";
import { BalanceResponse } from "@/app/types/balanceType";

interface SavingFormProps {
  onSuccess?: () => void;
}

const SavingForm = ({ onSuccess }: SavingFormProps) => {
  const [amount, setAmount] = useState<number | "">(0);
  const [currency, setCurrency] = useState(""); // Auto from Balance API
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [deductBalance, setDeductBalance] = useState(false);
  const [categories, setCategories] = useState<SavingCategoryResponse[]>([]);
  const [totalSaving, setTotalSaving] = useState<number>(0);

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
      setCurrency("$"); // fallback
    }
  };

  useEffect(() => {
    loadCurrencySymbol();
  }, []);

  // ============================================================
  // 2️⃣ Fetch saving categories
  // ============================================================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getSavingCategoriesService();
        setCategories(data);

        // Keep field empty for search input
      } catch (err) {
        console.error("Failed to fetch saving categories:", err);
        toast.error("Failed to fetch saving categories");
      }
    };

    fetchCategories();
  }, []);

  // ============================================================
  // 3️⃣ Fetch total saving
  // ============================================================
  const loadTotalSaving = async () => {
    try {
      const total = await getTotalSavingService();
      setTotalSaving(total);
    } catch (err) {
      console.error("Failed to fetch total saving:", err);
      setTotalSaving(0);
    }
  };

  useEffect(() => {
    loadTotalSaving();
  }, []);

  // ============================================================
  // 4️⃣ Add Saving
  // ============================================================
  const handleAddSaving = async () => {
    // Validate category
    const categoryExists = categories.some(
      (cat) => cat.saving_category.toLowerCase() === remarks.toLowerCase()
    );

    if (!categoryExists) {
      toast.error("Please select a valid category from the list");
      return;
    }

    try {
      setLoading(true);

      const payload: AddSavingPayload = {
        add_saving: Number(amount),
        saving_category: remarks,
        want_to_deduct_from_balance: deductBalance,
      };

      await addSavingService(payload);

      toast.success(
        `Saving of ${currency}${amount} added successfully.` +
        (deductBalance ? " (deducted from balance)" : "")
      );

      setAmount(0);
      setDeductBalance(false);
      onSuccess && onSuccess();
      loadTotalSaving();
    } catch (error: any) {
      toast.error(error.message || "Failed to add saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-span-full lg:col-span-3 h-fit">
      <div className="bg-white rounded-md p-4 w-full flex flex-col gap-4">

        {/* ⭐ Total Saving Display */}
        <div className="mb-4 p-3 rounded-lg bg-[#44eeaa] border border-[#38A169]/30 flex items-center justify-between">
          <span className="text-md font-semibold text-white">Total Saving</span>
          <span className="text-xl font-bold text-white">
            {currency}{totalSaving?.toLocaleString()}
          </span>
        </div>

        {/* ⭐ Input Row */}
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
            options={categories.map(cat => ({ id: cat.id, value: cat.saving_category }))}
            value={remarks}
            onChange={setRemarks}
            placeholder="Type saving category..."
            className="w-full sm:w-80"
          />

          {/* Submit Button */}
          <button
            onClick={handleAddSaving}
            disabled={loading}
            className={`bg-[#FFAA00] hover:bg-[#FFAA00]/90 text-white font-bold text-md px-8 h-12 rounded transition-colors 
              disabled:opacity-50 w-full sm:w-auto cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Saving..." : "Add"}
          </button>
        </div>

        {/* Deduct from balance checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="deductBalance"
            checked={deductBalance}
            onChange={(e) => setDeductBalance(e.target.checked)}
            className="h-4 w-4 accent-[#FFAA00]"
          />
          <label htmlFor="deductBalance" className="text-sm font-medium">
            Deduct From Balance
          </label>
        </div>

      </div>
    </div>
  );
};

export default SavingForm;
