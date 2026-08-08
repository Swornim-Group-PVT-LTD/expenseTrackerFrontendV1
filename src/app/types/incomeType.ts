export interface AddIncomePayload {
  add_income: number;
  income_category: string;
}

export interface IncomeResponse {
  id: number;
  sn: string;
  customerid: string;
  add_income: number;
  total_income: number;
  income_category: string;
  created_date: string; // or Date
  updated_date: string; // or Date
  currency?: string;
  symbol?: string;
}

export interface TotalIncomeResponse {
  message: string;
  total_income: number;
  currency: string;
  symbol: string;
}

