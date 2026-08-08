"use client";

import { useState, useEffect } from "react";
import { Calendar, Download, FileDown } from "lucide-react";
import { toast } from "react-toastify";

interface SimpleDateFilterProps {
    initialFrom?: Date;
    initialTo?: Date;
    fetchService: (from?: string, to?: string) => Promise<any>;
    onFilter: (data: any, startDate?: string, endDate?: string) => void;
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

    const [fromDate, setFromDate] = useState<string>(
        initialFrom ? formatDateForInput(initialFrom) : ""
    );
    const [toDate, setToDate] = useState<string>(
        initialTo ? formatDateForInput(initialTo) : ""
    );
    const [isLoading, setIsLoading] = useState(false);

    // Auto-fetch on component mount
    useEffect(() => {
        if (fromDate && toDate) {
            handleSearch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = async () => {
        if (!fromDate || !toDate) {
            toast.warning("Please select both from and to dates");
            return;
        }

        if (new Date(fromDate) > new Date(toDate)) {
            toast.error("From date cannot be later than To date");
            return;
        }

        setIsLoading(true);
        try {
            const data = await fetchService(fromDate, toDate);
            onFilter(data, fromDate, toDate);
            toast.success("Statement loaded successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to fetch statement");
            console.error("Error fetching statement:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        const defaultFrom = initialFrom || new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const defaultTo = initialTo || new Date();

        setFromDate(formatDateForInput(defaultFrom));
        setToDate(formatDateForInput(defaultTo));
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Date Inputs Section */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* From Date */}
                    <div className="flex flex-col">
                        <label htmlFor="fromDate" className="text-sm font-semibold text-gray-700 mb-2">
                            From Date
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="date"
                                id="fromDate"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* To Date */}
                    <div className="flex flex-col">
                        <label htmlFor="toDate" className="text-sm font-semibold text-gray-700 mb-2">
                            To Date
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="date"
                                id="toDate"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons Section */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-48">
                    <button
                        onClick={handleSearch}
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
                        onClick={handleReset}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        Reset
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
