import { ChevronDown } from "lucide-react";
import { Datepicker } from "flowbite-react";

export default function DateFilter() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col gap-4">
        {/* Export Buttons - Top Right */}
        <div className="flex justify-end gap-3 -mb-2">
          <img
            src="/excel-logo.svg"
            alt="excel_logo"
            className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity"
          />
          <img
            src="/pdf-logo.svg"
            alt="pdf_logo"
            className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4">
          {/* From Date */}
          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-sm font-semibold text-[#716A6A]">From</span>
            <div className="relative">
              <Datepicker />
            </div>
          </div>

          {/* To Date */}
          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-sm font-semibold text-[#716A6A]">To</span>
            <div className="relative">
              <Datepicker />
            </div>
          </div>

          {/* Search Button */}
          <button className="bg-[#FFAA00] hover:bg-[#FF9900] text-white font-bold text-lg h-[46px] rounded-lg transition-colors cursor-pointer w-full lg:px-10 lg:w-auto mt-2 lg:mt-0">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}