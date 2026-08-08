export interface AddBalancePayload {
  add_opening_balance: number;
  currency_id: number;
}

export interface BalanceResponse {
  id: number;
  sn: string;
  customerid: string;
  add_opening_balance: number;
  closing_balance: number;
  total_balance: number;
  created_date: string;
  updated_date: string;
  currency: {
    country: string;
    currency: string;
    symbol: string;
  }
}


export interface MonthlyRemainingBalanceResponse {
  message: string;
  year: number;
  data: {
    month: string;
    remaining_balance: number;
  }[];
}
