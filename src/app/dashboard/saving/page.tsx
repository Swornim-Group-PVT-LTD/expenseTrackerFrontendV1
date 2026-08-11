  "use client";

  import { Home } from "lucide-react";
  import { useState, useEffect } from "react";
  import SavingForm from "./components/SavingForm";
  import BalanceCard from "@/app/components/BalanceCard";
  import SavingLineChart from "./components/SavingLineChart";
  import DateFilter from "@/app/components/DateFilter";
  import SavingTable from "./components/SavingTable";
  import SavingBarChart from "./components/SavingBarChart";
  import { toast } from "react-toastify";
  import { getSavingCategoriesService } from "@/app/services/catalogueServices/savingCatalogueService";
  import { SavingCategoryResponse } from "@/app/types/catalolgueType/savingCatalogueType";
  import { getSavingByDateRangeService } from "@/app/services/savingService";
  import { SavingResponse } from "@/app/types/savingType";
  import { downloadService } from "@/app/services/downloadService";

  function Saving() {
    const [categories, setCategories] = useState<SavingCategoryResponse[]>([]);
    const [currentCategory, setCurrentCategory] = useState<string | null>(null);
    const [filteredData, setFilteredData] = useState<SavingResponse[]>([]);
    const [allData, setAllData] = useState<SavingResponse[]>([]);
    const [isFilterActive, setIsFilterActive] = useState(false);
    const [currentDateRange, setCurrentDateRange] = useState<{
      start: string;
      end: string;
    } | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleRefresh = async () => {
      setRefreshTrigger((prev) => prev + 1);
      if (isFilterActive) {
        try {
          const response = await getSavingByDateRangeService(
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
      data: SavingResponse[],
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

    // Fetch income categories once
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const data = await getSavingCategoriesService();
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
          <span>/Add Saving</span>
        </div>

        <h1 className="text-2xl font-bold mb-4">Add Saving</h1>

        <div className="grid grid-cols-1 items-center lg:grid-cols-4 gap-4">
          <BalanceCard refreshTrigger={refreshTrigger} />
          <SavingForm onSuccess={handleRefresh} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
          <div className="h-80">
            <SavingLineChart refreshTrigger={refreshTrigger} />
          </div>

          <div className="h-80">
            <SavingBarChart refreshTrigger={refreshTrigger} />
          </div>
        </div>

        {/* Added mt-10 here */}
        <div className="mt-10">
          <DateFilter
            fetchService={getSavingByDateRangeService}
            onFilter={handleFilter}
            categories={categories}
            categoryKey="saving_category"
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
                  { header: "Saving", field: "add_saving" },
                  { header: "Category", field: "saving_category" },
                  { header: "Total Saving", field: "total_saving" },
                  { header: "Date", field: "created_date" },
                ],
                "Saving_Report",
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
                  { header: "Saving", field: "add_saving" },
                  { header: "Category", field: "saving_category" },
                  { header: "Total Saving", field: "total_saving" },
                  { header: "Date", field: "created_date" },
                ],
                "Saving_Report",
              );
            }}
          />
        </div>

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

        <SavingTable
          refreshTrigger={refreshTrigger}
          filteredData={isFilterActive ? filteredData : null}
          onSuccess={handleRefresh}
          onDataLoad={setAllData}
        />
      </div>
    );
  }

  export default Saving;
