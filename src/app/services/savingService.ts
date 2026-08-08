// services/SavingService.ts
import axios from "axios";
import BASE_URL from "@/app/urlConfig/urlConfig";

import { AddSavingPayload, SavingResponse,TotalSavingResponse } from "@/app/types/savingType";

// Helper to get token from cookies
const getToken = (): string => {
  const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
  if (!match) throw new Error("No access_token found in cookies. Please login first.");
  return match[2];
};

// Add new income
export const addSavingService = async (
  payload: AddSavingPayload
): Promise<SavingResponse> => {
  try {
    const token = getToken();
    const response = await axios.post<SavingResponse>(
      `${BASE_URL}/api/savings`,
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
    throw new Error(error.response?.data?.message || error.message || "Failed to add savings");
  }
};

// Get all Savings
export const getSavingService = async (): Promise<SavingResponse[]> => {
  try {
    const token = getToken();

    const response = await axios.get(`${BASE_URL}/api/savings`, {
      headers: { "Authorization": `Bearer ${token}` },
    });

    // Extract array
    const savings: SavingResponse[] = response.data.data;
    const currencySymbol = response.data?.symbol || "NPR";

    // Attach currency symbol to each saving
    const savingsWithCurrency = savings.map(saving => ({
      ...saving,
      symbol: currencySymbol
    }));

    // Sort only if there are items
    if (savingsWithCurrency.length > 0) {
      savingsWithCurrency.sort((a, b) => a.id - b.id);
    }

    return savingsWithCurrency;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch saving"
    );
  }
};



export const updateSavingService = async (
  sn: string,
  payload: Partial<AddSavingPayload>
): Promise<SavingResponse[]> => {
  try {
    const token = getToken();
    const response = await axios.put<SavingResponse[]>(
      `${BASE_URL}/api/savings/update/${sn}`,
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
      error.response?.data?.message || error.message || "Failed to update saving"
    );
  }
};


export const deleteSavingService = async (sn: string): Promise<void> => {
  try {
    const token = getToken();
    await axios.delete(`${BASE_URL}/api/savings/delete/${sn}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to delete saving"
    );
  }
};



//get saving by date range
export const getSavingByDateRangeService = async (from?: string, to?: string, category?: string): Promise<SavingResponse[]> => {
  try {
    const token = getToken();

    const params: any = {};
    if (from && to) {
      params.start_date = from;
      params.end_date = to;
    }
    if (category) {
      params.saving_category = category;
    }

    const response = await axios.get(`${BASE_URL}/api/savings`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });

    // Safely extract array from response
    const savings: SavingResponse[] = response.data?.data || [];
    const currencySymbol = response.data?.symbol || "NPR";

    // Attach currency symbol to each saving
    const savingsWithCurrency = savings.map(saving => ({
      ...saving,
      symbol: currencySymbol
    }));

    return savingsWithCurrency;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch savings by date range"
    );
  }
};



// ----------------------------
// Get Total Saving
// ----------------------------
export const getTotalSavingService = async (): Promise<number> => {
  try {
    const token = getToken();
    const response = await axios.get<TotalSavingResponse>(`${BASE_URL}/api/saving/total`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    
    return Number(response.data.total_saving || 0);
  } catch (error: any) {
    console.error("Failed to fetch total saving:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch total saving"
    );
  }
};
