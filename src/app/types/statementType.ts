export interface StatementEntry {
  id: number;
  date: string;
  type: string;
  description: string;
  credit: number;
  debit: number;
  balance: number;
}

export interface CurrencyInfo {
  country: string;
  currency: string;
  symbol: string;
}

export interface StatementResponse {
  message: string;
  currency: CurrencyInfo;
  opening_balance: number;
  closing_balance: number;
  data: StatementEntry[];
}

export interface GroupedStatement {
  date: string;
  opening_balance: number;
  closing_balance: number;
  transactions: StatementEntry[];
}