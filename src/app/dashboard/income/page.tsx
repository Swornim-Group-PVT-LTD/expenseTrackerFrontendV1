"use client";

import { Home } from "lucide-react";

import { useState } from "react";

import IncomeForm from "./components/IncomeForm";
import BalanceCard from "@/app/components/BalanceCard";
import IncomeLineChart from "./components/IncomeLineChart";
import DateFilter from "@/app/components/DateFilter";
import IncomeTable from "./components/IncomeTable";
import IncomeBarChart from "./components/IncomeBarChart";
import { useEffect } from "react";
import { toast } from "react-toastify";

import { getIncomeCategoriesService } from "@/app/services/catalogueServices/incomeCatalogueService";
import { IncomeCategoryResponse } from "@/app/types/catalolgueType/incomeCatalogueType";
import { getIncomeByDateRangeService } from "@/app/services/incomeService";
import { IncomeResponse } from "@/app/types/incomeType";
import { downloadService } from "@/app/services/downloadService";

function Income() {
  const [filteredData, setFilteredData] = useState<IncomeResponse[]>([]);
  const [allData, setAllData] = useState<IncomeResponse[]>([]);
  const [isFilterActive, setIsFilterActive] = useState(true);
  const [currentDateRange, setCurrentDateRange] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = async () => {
    setRefreshTrigger((prev) => prev + 1);
    if (isFilterActive) {
      try {
        const response = await getIncomeByDateRangeService(
          currentDateRange?.start,
          currentDateRange?.end,
          currentCategory || undefined,
        );
        setFilteredData(response);
      } catch (error) {
        console.error("Failed to re-apply filter:", error);
      }
    }
  };

  const handleFilter = (
    data: IncomeResponse[],
    startDate?: string,
    endDate?: string,
    category?: string, // NEW
  ) => {
    setFilteredData(data);
    setIsFilterActive(true);
    setCurrentDateRange(
      startDate && endDate ? { start: startDate, end: endDate } : null,
    );
    setCurrentCategory(category || null); // NEW state
  };
  const clearFilter = () => {
    setFilteredData([]);
    setIsFilterActive(false);
    setCurrentDateRange(null);
  };

  const [categories, setCategories] = useState<IncomeCategoryResponse[]>([]);
  // Fetch income categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getIncomeCategoriesService();
        setCategories(data);
      } catch (err) {
        toast.error("Failed to fetch income categories");
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="">
      <div className="flex items-center gap-1 text-md mb-1 md:mb-4 mt-4">
        <Home className="w-4 h-4" />
        <span>/Add Income</span>
      </div>
      <h1 className="text-2xl font-bold mb-4">Add Income</h1>
      <div className="grid grid-cols-1 items-center lg:grid-cols-4 gap-4">
        <BalanceCard refreshTrigger={refreshTrigger} />
        <IncomeForm onSuccess={handleRefresh} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
        <div className="h-80">
          <IncomeLineChart refreshTrigger={refreshTrigger} />
        </div>
        <div className="h-80">
          <IncomeBarChart refreshTrigger={refreshTrigger} />
        </div>
      </div>
      <DateFilter
        initialFrom={
          new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
        initialTo={
          new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
        }
        fetchService={getIncomeByDateRangeService}
        onFilter={handleFilter}
        categories={categories}
        categoryKey="income_category"
        onDownloadPDF={() => {
          const data = isFilterActive ? filteredData : allData;
          if (data.length === 0) {
            toast.warning(
              "No data to download. Please apply filters or wait for data to load.",
            );
            return;
          }
          downloadService.downloadPDF(
            data,
            [
              { header: "ID", field: "id" },
              { header: "Income", field: "add_income" },
              { header: "Category", field: "income_category" },
              { header: "Total Income", field: "total_income" },
              { header: "Date", field: "created_date" },
            ],
            "Income_Report",
          );
        }}
        onDownloadExcel={() => {
          const data = isFilterActive ? filteredData : allData;
          if (data.length === 0) {
            toast.warning(
              "No data to download. Please apply filters or wait for data to load.",
            );
            return;
          }
          downloadService.downloadExcel(
            data,
            [
              { header: "ID", field: "id" },
              { header: "Income", field: "add_income" },
              { header: "Category", field: "income_category" },
              { header: "Total Income", field: "total_income" },
              { header: "Date", field: "created_date" },
            ],
            "Income_Report",
          );
        }}
      />

      {isFilterActive && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Showing {filteredData.length} filtered results
          </span>
          <button
            onClick={clearFilter}
            className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
          >
            Show All
          </button>
        </div>
      )}
      <IncomeTable
        refreshTrigger={refreshTrigger}
        filteredData={isFilterActive ? filteredData : null}
        onSuccess={handleRefresh}
        onDataLoad={setAllData}
        isFilterActive={isFilterActive}
      />
    </div>
  );
}

export default Income;
