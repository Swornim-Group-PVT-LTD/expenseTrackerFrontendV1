import { b, div, filter } from "framer-motion/client";
import {
  Pie,
  PieChart,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { expensePieChartService } from "../services/chartService";
import { useState, useEffect } from "react";
import { ChevronDown, Maximize2, X } from "lucide-react";
import { useCurrency } from "@/app/context/CurrencyContext";

const data = [
  { name: "Income", value: 60, color: "#5EAC24" },
  { name: "Expenses", value: 40, color: "#4EAABB" },
  { name: "Investment", value: 20, color: "#EE8B44" },
  { name: "Saving", value: 10, color: "#FF6384" },
];

export default function ExpensesPieChart() {
  const [filter_type, setFilterType] = useState("monthly");
  const [pieChartData, setPieChartData] = useState<
    { name: string; value: number; color: string }[]
  >([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { currency } = useCurrency();

  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
  ];

  const getDateRange = (filterType: string) => {
    const today = new Date();
    let startDate: Date;

    switch (filterType) {
      case "daily":
        startDate = new Date(today);
        break;
      case "weekly":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 6); // Last 7 days
        break;
      case "monthly":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1); // First day of current month
        break;
      case "yearly":
        startDate = new Date(today.getFullYear(), 0, 1); // First day of current year
        break;
      default:
        startDate = new Date(today.getFullYear(), 0, 1);
    }

    return {
      start: startDate.toISOString().split("T")[0],
      end: today.toISOString().split("T")[0],
    };
  };

  useEffect(() => {
    const fetchPieChartData = async () => {
      try {
        const dateRange = getDateRange(filter_type);

        const response = await expensePieChartService(
          filter_type,
          dateRange.start,
          dateRange.end,
        );

        if (response.data && response.data.length > 0) {
          const transformedData = response.data.map(
            (item: any, index: number) => ({
              name: item.expense_category,
              value: Number(item.total_amount),
              color: colors[index % colors.length],
            }),
          );
          setPieChartData(transformedData);
        } else {
          // Clear data if no data received
          setPieChartData([]);
        }
      } catch (error) {
        console.error("Error fetching expense pie chart data:", error);
        // Clear data on error
        setPieChartData([]);
      }
    };
    fetchPieChartData();
  }, [filter_type]);

  return (
    <>
      <div
        className="w-full min-h-[340px] sm:min-h-[400px]"
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "12px",
          overflow: "visible",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-32">
            <select
              value={filter_type}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none w-full py-1 px-2 text-sm font-medium text-[#716A6A] border border-[#574A4A]/50 rounded-lg bg-white cursor-pointer"
            >
              <option value="yearly">Yearly</option>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#716A6A] pointer-events-none" />
          </div>

          <button
            onClick={() => setIsFullScreen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Full Screen View"
          >
            <Maximize2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {pieChartData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `${currency} ${Number(value).toLocaleString()}`,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
              {pieChartData.map((entry) => (
                <div
                  key={entry.name}
                  className="flex items-center gap-1.5 text-sm"
                >
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-gray-700">{entry.name}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-[340px]">
            <p className="text-gray-500 text-lg">No data found</p>
          </div>
        )}
      </div>

      {/* Full Screen Modal */}
      {isFullScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-6">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full h-full sm:w-[90vw] sm:h-[90vh] max-w-6xl flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Expense Distribution
              </h2>
              <button
                onClick={() => setIsFullScreen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {pieChartData.length > 0 ? (
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius="70%"
                      dataKey="value"
                      label={(entry: any) => {
                        const total = pieChartData.reduce(
                          (sum, item) => sum + item.value,
                          0,
                        );
                        const percent = (
                          (Number(entry.value) / total) *
                          100
                        ).toFixed(1);
                        return `${percent}%`;
                      }}
                      labelLine={false}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => {
                        const total = pieChartData.reduce(
                          (sum, item) => sum + item.value,
                          0,
                        );
                        const percent = ((Number(value) / total) * 100).toFixed(
                          1,
                        );
                        return [
                          `${Number(value).toLocaleString()} (${percent}%)`,
                          "Amount",
                        ];
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-xl">No data found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
