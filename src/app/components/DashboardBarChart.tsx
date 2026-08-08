import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

import { dashboardBarChartService } from "../services/chartService";
import { useCurrency } from "@/app/context/CurrencyContext";

interface DashboardBarChartProps {
  name: string;
  value: number;
  color: string;
}

export default function DashboardBarChart() {
  const [filterType, setFilterType] = useState("monthly");
  const [chartData, setChartData] = useState<DashboardBarChartProps[]>([
    { name: "Income", value: 0, color: "#5EAC24" },
    { name: "Expenses", value: 0, color: "#FF6384" },
    { name: "Investment", value: 0, color: "#EE8B44" },
    { name: "Saving", value: 0, color: "#4EAABB" },
  ]);

  const { currency } = useCurrency();

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await dashboardBarChartService(filterType);
        const transformedData = [
          { name: "Income", value: Number(response.income), color: "#5EAC24" },
          {
            name: "Expenses",
            value: Number(response.expenses),
            color: "#FF6384",
          },
          {
            name: "Investment",
            value: Number(response.investment),
            color: "#EE8B44",
          },
          { name: "Saving", value: Number(response.saving), color: "#4EAABB" },
        ];
        setChartData(transformedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };
    fetchChartData();
  }, [filterType]);

  return (
    <div
      style={{
        width: "100%",
        height: 400,
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <div className="relative w-32 mb-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="appearance-none w-full  py-1 px-2 text-sm font-medium text-[#716A6A] border border-[#574A4A]/50 rounded-lg bg-white cursor-pointer"
        >
          <option value="yearly">Yearly</option>
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
          <option value="daily">Daily</option>
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#716A6A] pointer-events-none" />
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`${currency}. ${value}`]} />

          <Bar dataKey="value">
            {chartData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
