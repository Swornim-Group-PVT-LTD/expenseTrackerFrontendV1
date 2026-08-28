"use client";

import { useState, useEffect } from "react";
import { Calendar, Download, FileDown } from "lucide-react";
import { toast } from "react-toastify";

interface SimpleDateFilterProps {
  initialFrom?: Date;
  initialTo?: Date;
  fetchService: (from?: string, to?: string) => Promise<any>;
  onFilter: (
    data: any,
    startDate?: string,
    endDate?: string,
  ) => void | Promise<void>;
  onDownloadPDF?: () => void;
  onDownloadExcel?: () => void;
}

export default function SimpleDateFilter({
  initialFrom,
  initialTo,
  fetchService,
  onFilter,
  onDownloadPDF,
  onDownloadExcel,
}: SimpleDateFilterProps) {
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Today's date
  const today = new Date();
  const todayString = formatDateForInput(today);

  // From Date always today
  const [fromDate, setFromDate] = useState(todayString);

  // To Date can use prop or today
  const [toDate, setToDate] = useState(
    initialTo ? formatDateForInput(initialTo) : todayString,
  );

  const [isLoading, setIsLoading] = useState(false);

  // Auto-load today's statement
  useEffect(() => {
    handleSearch(todayString, toDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (
    startDate: string = fromDate,
    endDate: string = toDate,
  ) => {
    if (!startDate || !endDate) {
      toast.warning("Please select both dates");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("From date cannot be later than To date");
      return;
    }

    setIsLoading(true);

    try {
      const data = await fetchService(startDate, endDate);
      await onFilter(data, startDate, endDate);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch statement");
      console.error("Error fetching statement:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToday = () => {
    setFromDate(todayString);
    setToDate(todayString);

    handleSearch(todayString, todayString);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
        {/* Date Inputs */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
          {/* From Date */}
          <div className="flex flex-col">
            <label
              htmlFor="fromDate"
              className="text-sm font-semibold text-gray-700 mb-2"
            >
              From Date
            </label>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="date"
                id="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors [appearance:none] [-webkit-appearance:none]"
              />
            </div>
          </div>

          {/* To Date */}
          <div className="flex flex-col">
            <label
              htmlFor="toDate"
              className="text-sm font-semibold text-gray-700 mb-2"
            >
              To Date
            </label>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              <input
                type="date"
                id="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors [appearance:none] [-webkit-appearance:none]"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-48">
          <button
            onClick={() => handleSearch()}
            disabled={isLoading}
            className="flex-1 bg-[var(--color2)] hover:bg-yellow-600 disabled:bg-yellow-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                Search
              </>
            )}
          </button>

          <button
            onClick={handleToday}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      {/* Download Buttons */}
      {(onDownloadPDF || onDownloadExcel) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {onDownloadPDF && (
              <button
                onClick={onDownloadPDF}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                <FileDown className="w-4 h-4" />
                Download PDF
              </button>
            )}

            {onDownloadExcel && (
              <button
                onClick={onDownloadExcel}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Download Excel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
