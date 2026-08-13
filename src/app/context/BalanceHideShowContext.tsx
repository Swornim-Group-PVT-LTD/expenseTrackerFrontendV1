"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface BalanceVisibilityContextType {
  isVisible: boolean;
  toggleVisibility: () => void;
}

const BalanceVisibilityContext = createContext<
  BalanceVisibilityContextType | undefined
>(undefined);

export function BalanceVisibilityProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("balanceVisible");
    if (stored !== null) setIsVisible(stored === "true");
  }, []);

  const toggleVisibility = () => {
    setIsVisible((prev) => {
      const next = !prev;
      localStorage.setItem("balanceVisible", String(next));
      return next;
    });
  };

  return (
    <BalanceVisibilityContext.Provider value={{ isVisible, toggleVisibility }}>
      {children}
    </BalanceVisibilityContext.Provider>
  );
}

export function useBalanceVisibility() {
  const context = useContext(BalanceVisibilityContext);
  if (!context) {
    throw new Error(
      "useBalanceVisibility must be used within BalanceVisibilityProvider",
    );
  }
  return context;
}
