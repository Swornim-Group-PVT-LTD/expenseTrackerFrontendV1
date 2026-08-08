import axios from "axios";
import BASE_URL from "@/app/urlConfig/urlConfig";
import { StatementEntry, StatementResponse } from "../types/statementType";

const getToken = (): string => {
  const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
  if (!match) throw new Error("No access_token found in cookies. Please login first.");
  return match[2];
};

export const getStatementByDateRangeService = async (from?: string, to?: string): Promise<StatementResponse> => {
  try {
    const token = getToken();

    const params: any = {};
    if (from && to) {
      params.from_date = from;
      params.to_date = to;
    }

    const response = await axios.get(`${BASE_URL}/api/balances/account-statement`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch statement data"
    );
  }
};