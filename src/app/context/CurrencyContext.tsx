"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getBalancesService } from "@/app/services/balanceService";
import { BalanceResponse } from "@/app/types/balanceType";

type CurrencyContextType = {
  currency: string;
  loading: boolean;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "$",
  loading: true,
});

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<string>("$");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
  const loadCurrency = async () => {
    try {
      const balance: BalanceResponse = await getBalancesService();

      if (balance?.currency?.symbol) {
        setCurrency(balance.currency.symbol);
      }
    } catch (error) {
      console.error("Failed to load currency symbol:", error);
    } finally {
      setLoading(false);
    }
  };

  loadCurrency();
}, []);

  return (
    <CurrencyContext.Provider value={{ currency, loading }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
