export interface AddExpensePayload {
  add_expenses: number;
  expense_category: string;
}

export interface ExpenseResponse {
  id: number;
  sn: string;
  customerid: string;
  add_expenses: number;
  total_expenses: number;
  expense_category: string;
  created_date: string; // or Date
  updated_date: string; // or Date
  currency?: string;
  symbol?: string;
}


export interface TotalExpenseResponse {
  message: string;
  total_expenses: number;
  currency: string;
  symbol: string;
}
