export interface AddInvestmentPayload {
  add_investment: number;
  investment_category: string;
}

export interface InvestmentResponse {
  id: number;
  sn: string;
  customerid: string;
  add_investment: number;
  total_investment: number;
  investment_category: string;
  created_date: string; // or Date
  updated_date: string; // or Date
  currency?: string;
  symbol?: string;
}

export interface TotalInvestmentResponse {
  message: string;
  total_investment: number;
  currency: string;
  symbol: string;
}
