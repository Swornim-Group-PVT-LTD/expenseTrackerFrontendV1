// services/incomeService.ts
import axios from "axios";
import BASE_URL from "@/app/urlConfig/urlConfig";
import { AddIncomePayload, IncomeResponse,TotalIncomeResponse } from "../types/incomeType";

// ----------------------------
// Get Token From Cookies
// ----------------------------
const getToken = (): string => {
  // Handles: access_token=xxxx OR access_token="xxxx"
  const match = document.cookie.match(/access_token="?([^";]+)"?/);
  if (!match) throw new Error("No access_token found in cookies. Please login first.");
  return match[1];
};

// ----------------------------
// Add New Income
// ----------------------------
export const addIncomeService = async (
  payload: AddIncomePayload
): Promise<IncomeResponse> => {
  try {
    const token = getToken();

    const response = await axios.post<IncomeResponse>(
      `${BASE_URL}/api/incomes`,
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
    throw new Error(
      error.response?.data?.message || error.message || "Failed to add incomes"
    );
  }
};

// ----------------------------
// Get All Incomes
// ----------------------------
export const getIncomeService = async (): Promise<IncomeResponse[]> => {
  try {
    const token = getToken();

    const response = await axios.get(`${BASE_URL}/api/incomes`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    // Ensure we always have an array
    const incomes: IncomeResponse[] = Array.isArray(response.data?.data)
      ? response.data.data
      : Array.isArray(response.data)
        ? response.data
        : [];

    const currencySymbol = response.data?.symbol || "NPR";

    // Attach currency symbol to each income
    const incomesWithCurrency = incomes.map(income => ({
      ...income,
      symbol: currencySymbol
    }));

    // Only sort if there are items
    if (incomesWithCurrency.length > 0) {
      incomesWithCurrency.sort((a, b) => a.id - b.id);
    }

    return incomesWithCurrency;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch incomes"
    );
  }
};


export const deleteIncomeService = async (sn: string): Promise<void> => {
  try {
    const token = getToken();
    await axios.delete(`${BASE_URL}/api/incomes/delete/${sn}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to delete income"
    );
  }
};

export const updateIncomeService = async (sn: string, payload: AddIncomePayload): Promise<IncomeResponse> => {
  try {
    const token = getToken();
    const response = await axios.put<IncomeResponse>(
      `${BASE_URL}/api/incomes/update/${sn}`,
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
    throw new Error(error.response?.data?.message || error.message || "Failed to update income");
  }
};


//get income by date range
export const getIncomeByDateRangeService = async (from?: string, to?: string, category?: string): Promise<IncomeResponse[]> => {
  try {
    const token = getToken();

    const params: any = {};
    if (from && to) {
      params.start_date = from;
      params.end_date = to;
    }
    if (category) {
      params.income_category = category;
    }

    const response = await axios.get(`${BASE_URL}/api/incomes`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    
    // Safely extract array from response
    const incomes: IncomeResponse[] = response.data?.data || [];
    const currencySymbol = response.data?.symbol || "NPR";

    // Attach currency symbol to each income
    const incomesWithCurrency = incomes.map(income => ({
      ...income,
      symbol: currencySymbol
    }));

    return incomesWithCurrency;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch incomes by date range"
    );
  }
};


// ----------------------------
// Get Total Income
// ----------------------------
export const getTotalIncomeService = async (): Promise<number> => {
  try {
    const token = getToken();
    const response = await axios.get<TotalIncomeResponse>(`${BASE_URL}/api/income/total`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    
    return Number(response.data.total_income || 0);
  } catch (error: any) {
    console.error("Failed to fetch total income:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch total income"
    );
  }
};
