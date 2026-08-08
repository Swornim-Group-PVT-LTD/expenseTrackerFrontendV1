"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import SearchInput from "@/app/components/SearchInput";

import { AddExpensePayload } from "@/app/types/expenseType";
import { addExpenseService } from "@/app/services/expenseService";
import { getTotalExpenseService } from "@/app/services/expenseService";
import { getExpenseCategoriesService } from "@/app/services/catalogueServices/expenseCatalogueService";
import { getBalancesService } from "@/app/services/balanceService";

import { ExpenseCategoryResponse } from "@/app/types/catalolgueType/expenseCatalogueType";
import { BalanceResponse } from "@/app/types/balanceType";

interface ExpenseFormProps {
  onSuccess?: () => void;
}

const ExpenseForm = ({ onSuccess }: ExpenseFormProps) => {
  const [amount, setAmount] = useState<number | "">(0);
  const [currency, setCurrency] = useState(""); // auto from Balance API
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ExpenseCategoryResponse[]>([]);
  const [totalExpense, setTotalExpense] = useState<number>(0);

  // ============================================================
  // 1️⃣ Fetch currency symbol from Balance API
  // ============================================================
  const loadCurrencySymbol = async () => {
    try {
      const balances: BalanceResponse[] = await getBalancesService();

      if (balances.length > 0) {
        setCurrency(balances[0].currency.symbol); // correct symbol path
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
  // 2️⃣ Fetch expense categories
  // ============================================================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getExpenseCategoriesService();
        setCategories(data);

        // Keep field empty for search input
      } catch (err) {
        console.error("Failed to fetch expense categories:", err);
        toast.error("Failed to fetch expense categories");
      }
    };

    fetchCategories();
  }, []);

  // ============================================================
  // 3️⃣ Fetch Total Expense
  // ============================================================
  const loadTotalExpense = async () => {
    try {
      const total = await getTotalExpenseService();
      setTotalExpense(total);
    } catch (err) {
      console.error("Failed to fetch total expense:", err);
      setTotalExpense(0);
    }
  };

  useEffect(() => {
    loadTotalExpense();
  }, []);

  // ============================================================
  // 4️⃣ Add Expense
  // ============================================================
  const handleAddExpense = async () => {
    // Validate category
    const categoryExists = categories.some(
      (cat) => cat.expense_category.toLowerCase() === remarks.toLowerCase()
    );

    if (!categoryExists) {
      toast.error("Please select a valid category from the list");
      return;
    }

    try {
      setLoading(true);

      const payload: AddExpensePayload = {
        add_expenses: Number(amount),
        expense_category: remarks,
      };

      await addExpenseService(payload);

      toast.success(`Expense of ${currency}${amount} added successfully.`);

      setAmount(0);
      onSuccess && onSuccess();
      loadTotalExpense();
    } catch (error: any) {
      toast.error(error.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-span-full lg:col-span-3 h-fit">
      <div className="bg-white rounded-md p-4 w-full h-full flex flex-col gap-4">

        {/* ⭐ Total Expense Display */}
        <div className="mb-4 p-3 rounded-lg bg-[#ff4d4d] border border-[#E53E3E]/30 flex items-center justify-between">
          <span className="text-md font-semibold text-white">Total Expense</span>
          <span className="text-xl font-bold text-white">
            {currency}{totalExpense?.toLocaleString()}
          </span>
        </div>

        {/* ⭐ Input Section */}
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

          {/* Amount input - FIXED with min-height */}
          <input
            type="number"
            inputMode="decimal"
            placeholder="0"
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

          {/* Remarks dropdown */}
          <SearchInput
            options={categories.map(cat => ({ id: cat.id, value: cat.expense_category }))}
            value={remarks}
            onChange={setRemarks}
            placeholder="Type expense category..."
            className="w-full sm:w-80"
          />

          {/* Submit button */}
          <button
            onClick={handleAddExpense}
            disabled={loading}
            className={`bg-[#FFAA00] hover:bg-[#FFAA00]/90 text-white font-bold 
                    text-md px-8 h-12 min-h-[48px] rounded transition-colors 
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

export default ExpenseForm;
