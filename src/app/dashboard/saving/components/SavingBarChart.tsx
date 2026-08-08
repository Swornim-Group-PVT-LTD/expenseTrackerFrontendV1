import { useState, useEffect } from "react";
import { monthlyBarChartService } from "@/app/services/chartService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

import { useCurrency } from "@/app/context/CurrencyContext";

const MonthlySavingsChart = ({
  refreshTrigger,
}: {
  refreshTrigger: number;
}) => {
  const [monthlySavings, setMonthlySavings] = useState<
    { month: string; amount: number }[]
  >([]);
  const { currency } = useCurrency();

  useEffect(() => {
    const fetchMonthlySavings = async () => {
      try {
        const response = await monthlyBarChartService("savings");
        const transformedData = response.months.map(
          (month: string, index: number) => ({
            month: month.substring(0, 3),
            amount: Number(response.totals[index]),
          }),
        );

        // Get only the latest 4 months with non-zero data
        const filteredData = transformedData.slice(-4);
        setMonthlySavings(filteredData);
      } catch (error) {
        console.error("Error fetching monthly savings:", error);
      }
    };

    fetchMonthlySavings();
  }, [refreshTrigger]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        marginTop: "20px",
        backgroundColor: "white",
        borderRadius: "8px",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={monthlySavings}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          {/* Y-Axis (with amount labels) */}
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            interval={0}
            tickCount={6}
          />

          <XAxis dataKey="month" />
          <Tooltip
            formatter={(value) => [
              `${currency}. ${Number(value).toLocaleString()}`,
            ]}
          />

          <Bar dataKey="amount" fill="#44EEAA">
            {/* Amount labels at top of each bar */}
            <LabelList dataKey="amount" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlySavingsChart;
