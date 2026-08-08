import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { getMonthlyRemainingBalanceService } from "@/app/services/balanceService";
import { MonthlyRemainingBalanceResponse } from "@/app/types/balanceType";
import { getBalancesService } from "@/app/services/balanceService";
import { BalanceResponse } from "@/app/types/balanceType";
import { useCurrency } from "@/app/context/CurrencyContext";

interface RemainingBalanceChartProps {
  refreshTrigger?: number;
}

const RemainingBalanceChart = ({
  refreshTrigger = 0,
}: RemainingBalanceChartProps) => {
  const [data, setData] = useState<MonthlyRemainingBalanceResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const { currency } = useCurrency();

  // Fetch data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getMonthlyRemainingBalanceService();

      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  // Custom tooltip component
  interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
  }

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-black text-white px-4 py-2 rounded-lg shadow-lg">
          <p className="font-medium">
            {currency}. {Number(value).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  // Format Y-axis values
  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toString();
  };

  // Format month labels to show only first 3 letters
  const formatMonth = (month: string) => {
    return month.substring(0, 3);
  };

  if (loading || !data) {
    return (
      <div className="w-full h-80 bg-white rounded-lg shadow-sm p-6 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading chart...</div>
      </div>
    );
  }

  // Calculate max value for Y-axis (add some padding)
  const maxBalance =
    data.data.length > 0
      ? Math.max(...data.data.map((d) => d.remaining_balance))
      : 0;

  // Determine a suitable step size based on the magnitude of the max balance
  let step = 10000;
  if (maxBalance < 1000) step = 100;
  else if (maxBalance < 10000) step = 1000;
  else if (maxBalance < 100000) step = 10000;
  else step = 50000;

  const yAxisMax = Math.ceil((maxBalance * 1.2) / step) * step || step; // Fallback to step if 0
  const midPoint = yAxisMax / 2;

  if (!data.data || data.data.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Remaining Balance Monthly
        </h2>
        <div className="w-full h-[300px] flex items-center justify-center text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6 mb-4">
      {/* Chart Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Remaining Balance Monthly
      </h2>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data.data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            vertical={false}
          />

          <XAxis
            dataKey="month"
            tickFormatter={formatMonth}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 14 }}
            dy={10}
          />

          <YAxis
            tickFormatter={formatYAxis}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            domain={[0, yAxisMax]}
            // Dynamic ticks for better visual
            ticks={[0, yAxisMax * 0.25, midPoint, yAxisMax * 0.75, yAxisMax]}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "#d1d5db", strokeWidth: 1 }}
          />

          {/* Horizontal reference line in the middle */}
          <ReferenceLine
            y={midPoint}
            stroke="#1f2937"
            strokeWidth={2}
            strokeDasharray="3 3"
          />

          <Line
            type="monotone"
            dataKey="remaining_balance"
            stroke="#bef264"
            strokeWidth={3}
            dot={{ fill: "#bef264", strokeWidth: 2, r: 4 }}
            activeDot={{
              r: 6,
              fill: "#bef264",
              stroke: "#fff",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RemainingBalanceChart;
