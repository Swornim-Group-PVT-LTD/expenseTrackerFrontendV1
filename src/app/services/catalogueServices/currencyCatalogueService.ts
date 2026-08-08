import axios from "axios";
import BASE_URL from "@/app/urlConfig/urlConfig";
import { CurrencyPayload, CurrencyResponse } from "../../types/currencyType";

// Helper to get token from cookies
const getToken = (): string => {
  const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
  if (!match) throw new Error("No access_token found in cookies. Please login first.");
  return match[2];
};


export const addCurrencyService = async (payload: CurrencyPayload): Promise<CurrencyResponse> => {
  try {
    const response = await axios.post(`${BASE_URL}/api/currency/add`, payload, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrencyService = async (): Promise<CurrencyResponse[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/currency/all`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};