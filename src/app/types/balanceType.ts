export interface AddBalancePayload {
  add_opening_balance: number;
  currency_id: number;
}

export interface Currency {
  country: string;
  currency: string;
  symbol: string;
}

export interface BalanceResponse {
  id: number;
  sn: string;
  customerid: string;

  // New API fields
  master_opening_balance: string;
  opening_balance: string;
  closing_balance: string;
  date: string;

  // Optional API fields
  total_credit?: string;
  total_debit?: string;

  currency: Currency;
}

export interface MonthlyRemainingBalanceResponse {
  message: string;
  year: number;
  data: {
    month: string;
    remaining_balance: number;
  }[];
}