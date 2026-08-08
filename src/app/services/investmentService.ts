// services/InvestmentService.ts
import axios from "axios";
import BASE_URL from "@/app/urlConfig/urlConfig";
import { AddInvestmentPayload, InvestmentResponse,TotalInvestmentResponse } from "../types/investmentType";

// Helper to get token from cookies
const getToken = (): string => {
  const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
  if (!match) throw new Error("No access_token found in cookies. Please login first.");
  return match[2];
};

// Add new Investment
export const addInvestmentService = async (
  payload: AddInvestmentPayload
): Promise<InvestmentResponse> => {
  try {
    const token = getToken();
    const response = await axios.post<InvestmentResponse>(
      `${BASE_URL}/api/investments`,
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
    throw new Error(error.response?.data?.message || error.message || "Failed to add Investments");
  }
};

// Get all Investments
export const getInvestmentService = async (): Promise<InvestmentResponse[]> => {
  try {
    const token = getToken();

    const response = await axios.get(`${BASE_URL}/api/investments`, {
      headers: { "Authorization": `Bearer ${token}` },
    });

    // Extract array
    const investments: InvestmentResponse[] = response.data.data;
    const currencySymbol = response.data?.symbol || "NPR";

    // Attach currency symbol to each investment
    const investmentsWithCurrency = investments.map(investment => ({
      ...investment,
      symbol: currencySymbol
    }));

    // Sort by id ascending
    // Sort only if there are items
    if (investmentsWithCurrency.length > 0) {
      investmentsWithCurrency.sort((a, b) => a.id - b.id);
    }

    return investmentsWithCurrency;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch Investment"
    );
  }
};


export const deleteInvestmentService = async (sn: string): Promise<void> => {
  try {
    const token = getToken();
    await axios.delete(`${BASE_URL}/api/investments/delete/${sn}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to delete Investment"
    );
  }
};


export const updateInvestmentService = async (
  sn: string,
  payload: Partial<AddInvestmentPayload>
): Promise<InvestmentResponse> => {
  try {
    const token = getToken();
    const response = await axios.put<InvestmentResponse>(
      `${BASE_URL}/api/investments/update/${sn}`,
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
      error.response?.data?.message || error.message || "Failed to update Investment"
    );
  }
};


//get investments by date range
export const getInvestmentByDateRangeService = async (from?: string, to?: string, category?: string): Promise<InvestmentResponse[]> => {
  try {
    const token = getToken();

    const params: any = {};
    if (from && to) {
      params.start_date = from;
      params.end_date = to;
    }
    if (category) {
      params.investment_category = category;
    }

    const response = await axios.get(`${BASE_URL}/api/investments`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    
    // Safely extract array from response
    const investments: InvestmentResponse[] = response.data?.data || [];
    const currencySymbol = response.data?.symbol || "NPR";

    // Attach currency symbol to each investment
    const investmentsWithCurrency = investments.map(investment => ({
      ...investment,
      symbol: currencySymbol
    }));

    return investmentsWithCurrency;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch investments by date range"
    );
  }
};

// ----------------------------
// Get Total Investment
// ----------------------------
export const getTotalInvestmentService = async (): Promise<number> => {
  try {
    const token = getToken();
    const response = await axios.get<TotalInvestmentResponse>(`${BASE_URL}/api/investment/total`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    
    return Number(response.data.total_investment || 0);
  } catch (error: any) {
    console.error("Failed to fetch total investment:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch total investment"
    );
  }
};