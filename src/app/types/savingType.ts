export interface AddSavingPayload {
  add_saving: number;
  saving_category: string;
  want_to_deduct_from_balance: boolean;
}

export interface SavingResponse {
  id: number;
  sn: string;
  customerid: string;
  add_saving: number;
  total_saving: number;
  saving_category: string;
  created_date: string; // or Date
  updated_date: string; // or Date
  want_to_deduct_from_balance: boolean;
  currency?: string;
  symbol?: string;
}

export interface TotalSavingResponse {
  message: string;
  total_saving: number;
  currency: string;
  symbol: string;
}

