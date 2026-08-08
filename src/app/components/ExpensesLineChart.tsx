"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getBalancesService } from "@/app/services/balanceService";
import { BalanceResponse } from "@/app/types/balanceType";

const data = [
  { name: "Income", value: 60, color: "#5EAC24" },
  { name: "Expenses", value: 40, color: "#4EAABB" },
  { name: "Investment", value: 20, color: "#EE8B44" },
  { name: "Saving", value: 10, color: "#FF6384" },
];

export default function ExpensesLineChart() {
  const [currency, setCurrency] = useState("Rs");
  const loadCurrencySymbol = async () => {
    try {
      const balances: BalanceResponse[] = await getBalancesService();
      if (balances.length > 0) {
        setCurrency(balances[0].currency.symbol);
      }
    } catch (error) {
      console.error("Failed to load currency symbol:", error);

      setCurrency("$");
    }
  };

  useEffect(() => {
    loadCurrencySymbol();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        borderRadius: "12px",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`${currency}. ${value}`]} />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#0088FE"
            strokeWidth={3}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
