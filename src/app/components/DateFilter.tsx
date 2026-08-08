import { ChevronDown } from "lucide-react";
import { Datepicker } from "flowbite-react";
import { toast } from "react-toastify";
import SearchInput from "@/app/components/SearchInput";

import { useState, useEffect } from "react";

interface DateFilterProps {
  fetchService: Function;
  onFilter: Function;
  categories: any[];
  categoryKey: string;
  onDownloadPDF?: () => void;
  onDownloadExcel?: () => void;
  initialFrom?: Date;
  initialTo?: Date;
}

export default function DateFilter({
  fetchService,
  onFilter,
  categories,
  categoryKey,
  onDownloadPDF,
  onDownloadExcel,
  initialFrom,
  initialTo,
}: DateFilterProps) {
  const [from, setFrom] = useState<Date | undefined>(initialFrom || new Date());
  const [to, setTo] = useState<Date | undefined>(initialTo || new Date());
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [useDateRange, setUseDateRange] = useState<boolean>(false); // disabled by default

  const formatLocalDate = (d: Date) =>
    d
      ? new Date(d.getTime() - d.getTimezoneOffset() * 60000)
          .toISOString()
          .split("T")[0]
      : "";

  const handleSearch = async () => {
    setError("");

    // Validate date range if both dates are provided
    if (useDateRange && from && to && from > to) {
      setError("'From' date cannot be later than 'To' date.");
      return;
    }

    // Validate category if provided
    if (selectedCategory && selectedCategory.trim() !== "") {
      const categoryExists = categories.some(
        (cat) =>
          cat[categoryKey].toLowerCase() === selectedCategory.toLowerCase(),
      );

      if (!categoryExists) {
        toast.error("Please select a valid category from the list");
        return;
      }
    }

    const start_date = useDateRange && from ? formatLocalDate(from) : undefined;
    const end_date = useDateRange && to ? formatLocalDate(to) : undefined;
    console.log(
      "Fetching data from",
      start_date,
      "to",
      end_date,
      "for category",
      selectedCategory,
    );

    try {
      const response = await fetchService(
        start_date,
        end_date,
        selectedCategory || undefined,
      );
      onFilter(response, start_date, end_date, selectedCategory);
    } catch (err: any) {
      setError(
        err.message || "Failed to fetch data for the selected date range.",
      );
    }
  };

  useEffect(() => {
    if (initialFrom && initialTo) {
      handleSearch();
    }
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col gap-4">
        {/* Export Buttons - Top Right */}
        <div className="flex justify-end gap-3 -mb-2">
          {onDownloadExcel && (
            <img
              src="/excel-logo.svg"
              alt="excel_logo"
              className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={onDownloadExcel}
            />
          )}
          {onDownloadPDF && (
            <img
              src="/pdf-logo.svg"
              alt="pdf_logo"
              className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={onDownloadPDF}
            />
          )}
        </div>

        {/* Date range enable/disable checkbox */}
        <div className="flex items-center gap-2 -mb-1">
          <input
            id="useDateRange"
            type="checkbox"
            checked={useDateRange}
            onChange={(e) => setUseDateRange(e.target.checked)}
            className="w-4 h-4 accent-[#FFAA00] cursor-pointer"
          />
          <label
            htmlFor="useDateRange"
            className="text-sm font-semibold text-[#716A6A] cursor-pointer select-none"
          >
            Filter by date range
          </label>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4">
          {/* From Date */}
          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-sm font-semibold text-[#716A6A]">From</span>
            <div
              className={`relative ${!useDateRange ? "opacity-50 pointer-events-none" : ""}`}
            >
              <Datepicker
                value={from}
                disabled={!useDateRange}
                onChange={(date: Date | null) => {
                  setFrom(date || undefined);
                }}
              />
            </div>
          </div>

          {/* To Date */}
          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-sm font-semibold text-[#716A6A]">To</span>
            <div
              className={`relative ${!useDateRange ? "opacity-50 pointer-events-none" : ""}`}
            >
              <Datepicker
                value={to}
                disabled={!useDateRange}
                onChange={(date: Date | null) => {
                  setTo(date || undefined);
                }}
              />
            </div>
          </div>

          {/* Category Search Input */}
          <div className="flex flex-col gap-1.5 flex-1 lg:max-w-xs">
            <span className="text-sm font-semibold text-[#716A6A]">
              Category
            </span>
            <SearchInput
              options={
                categories?.map((cat) => ({
                  id: cat.id,
                  value: cat[categoryKey],
                })) || []
              }
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="All Categories"
              className="w-full"
            />
          </div>

          {/* Search Button */}
          <button
            className="bg-[#FFAA00] hover:bg-[#FF9900] text-white font-bold text-lg h-[46px] rounded-lg transition-colors cursor-pointer w-full lg:px-10 lg:w-auto mt-2 lg:mt-0"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </div>
  );
}
