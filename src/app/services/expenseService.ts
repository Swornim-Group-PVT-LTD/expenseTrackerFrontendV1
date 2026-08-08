// services/expenseService.ts
import axios from "axios";
import BASE_URL from "@/app/urlConfig/urlConfig";
import { AddExpensePayload, ExpenseResponse,TotalExpenseResponse } from "../types/expenseType";


// Helper to get token from cookies
const getToken = (): string => {
  const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
  if (!match) throw new Error("No access_token found in cookies. Please login first.");
  return match[2];
};

// Add new Expense
export const addExpenseService = async (
  payload: AddExpensePayload
): Promise<ExpenseResponse> => {
  try {
    const token = getToken();
    const response = await axios.post<ExpenseResponse>(
      `${BASE_URL}/api/expenses`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Failed to add expenses");
  }
};

// Get all Expenses
export const getExpenseService = async (): Promise<ExpenseResponse[]> => {
  try {
    const token = getToken();
    const response = await axios.get(`${BASE_URL}/api/expenses`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Safely extract array from response
    const expenses: ExpenseResponse[] = response.data?.data || [];
    const currencySymbol = response.data?.symbol || "NPR";

    // Attach currency symbol to each expense
    const expensesWithCurrency = expenses.map(expense => ({
      ...expense,
      symbol: currencySymbol
    }));

    // Sort by id ascending if array is not empty
    if (expensesWithCurrency.length > 0) {
      expensesWithCurrency.sort((a, b) => a.id - b.id);
    }

    return expensesWithCurrency;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch expenses"
    );
  }
};


export const deleteExpenseService = async (sn: string): Promise<void> => {
  try {
    const token = getToken();
    await axios.delete(`${BASE_URL}/api/expenses/delete/${sn}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to delete expense"
    );
  }
};


export const updateExpenseService = async (sn: string, payload: AddExpensePayload): Promise<ExpenseResponse> => {
  try {
    const token = getToken();
    const response = await axios.put<ExpenseResponse>(
      `${BASE_URL}/api/expenses/update/${sn}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Failed to update expense");
  }
};


//get expense by date range
export const getExpenseByDateRangeService = async (from?: string, to?: string, category?: string): Promise<ExpenseResponse[]> => {
  try {
    const token = getToken();

    const params: any = {};
    if (from && to) {
      params.start_date = from;
      params.end_date = to;
    }
    if (category) {
      params.expense_category = category;
    }

    const response = await axios.get(`${BASE_URL}/api/expenses`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    
    // Safely extract array from response
    const expenses: ExpenseResponse[] = response.data?.data || [];
    const currencySymbol = response.data?.symbol || "NPR";

    // Attach currency symbol to each expense
    const expensesWithCurrency = expenses.map(expense => ({
      ...expense,
      symbol: currencySymbol
    }));

    return expensesWithCurrency;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch expenses by date range"
    );
  }
};



// ----------------------------
// Get Total Expenses
// ----------------------------
export const getTotalExpenseService = async (): Promise<number> => {
  try {
    const token = getToken();
    const response = await axios.get<TotalExpenseResponse>(`${BASE_URL}/api/expenses/total`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    
    return Number(response.data.total_expenses || 0);
  } catch (error: any) {
    console.error("Failed to fetch total expenses:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch total expenses"
    );
  }
};
