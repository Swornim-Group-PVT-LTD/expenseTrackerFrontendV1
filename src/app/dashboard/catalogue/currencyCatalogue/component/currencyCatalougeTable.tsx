import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { getCurrencyService } from "@/app/services/catalogueServices/currencyCatalogueService";

// Interface from your types
import { CurrencyResponse } from "@/app/types/currencyType";

export default function CurrencyCatalogueTable({
  refreshTrigger,
}: {
  refreshTrigger: number;
}) {
  const [data, setData] = useState<CurrencyResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // 🔹 Fetch Currency Data
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getCurrencyService();
      setData(result);
    } catch (err) {
      console.error("Failed to fetch currency data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  // 🔹 Search Filter
  const filteredData = data.filter((item) =>
    `${item.country_name} ${item.currency} ${item.symbol}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      {/* 🔍 Search Box */}
      <div className="flex justify-end mb-2">
        <input
          type="text"
          className="px-3 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Desktop TABLE */}
      <div className="hidden lg:block overflow-x-auto w-full mt-4">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Country</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Currency</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Symbol</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Created Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Updated Date</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  <ClipLoader size={22} color="#000" />
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.id}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.country_name}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.currency}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.symbol}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.created_at}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.updated_at}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-3 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 mt-4">
        {loading ? (
          <div className="text-center font-medium text-gray-500">
            <ClipLoader size={22} color="#000" />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center font-medium text-gray-500">No records found</div>
        ) : (
          filteredData.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 flex flex-col gap-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-800">ID {item.id}</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Country:</span>
                  <span className="font-semibold">{item.country_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Currency:</span>
                  <span className="font-semibold">{item.currency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Symbol:</span>
                  <span className="font-semibold text-lg">{item.symbol}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-400 mt-1 pt-2 border-t">
                  <span>Created: {item.created_at}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>Updated: {item.updated_at}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
