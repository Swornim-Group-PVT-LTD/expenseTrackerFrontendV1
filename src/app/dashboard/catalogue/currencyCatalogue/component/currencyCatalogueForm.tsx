"use client";

import { useState } from "react";
import { CurrencyPayload, CurrencyResponse } from "@/app/types/currencyType";
import { toast } from "react-toastify";
import { addCurrencyService } from "@/app/services/catalogueServices/currencyCatalogueService";

export default function CurrencyCatalogueForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [country, setCountry] = useState("");
  const [symbol, setSymbol] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!country.trim()) {
      newErrors.country = "Please input country";
    }

    if (!symbol.trim()) {
      newErrors.symbol = "Please input symbol";
    }

    if (!code.trim()) {
      newErrors.code = "Please input code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const payload: CurrencyPayload = {
        country_name: country,
        symbol: symbol,
        currency_code: code,
      };

      await addCurrencyService(payload);
      onSuccess && onSuccess();

      toast.success("Currency added successfully!");

      // Clear form
      setCountry("");
      setSymbol("");
      setCode("");
      setErrors({});
    } catch (err: any) {
      setErrors({ form: err.message || "Failed to add currency" });
      toast.error(err.message || "Failed to add currency");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-3 py-2 border rounded-md ${errors[field] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div className="p-6 bg-gray-50 rounded-md max-w-full mt-6">
      {errors.form && (
        <p className="text-red-500 mb-2 font-medium">{errors.form}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Catalogue */}
        <div className="lg:col-span-1">
          <label className="block mb-1 text-gray-700">Catalogue</label>
          <input
            type="text"
            value="CURRENCY"
            readOnly
            className="w-full px-3 py-2 border rounded-md bg-gray-200 cursor-not-allowed"
          />
        </div>

        {/* Country*/}
        <div className="lg:col-span-1">
          <label className="block mb-1 text-gray-700">Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g., USA"
            className={inputClass("country")}
          />
          {errors.country && (
            <p className="text-red-500 text-sm mt-1">{errors.country}</p>
          )}
        </div>

        {/* Symbol */}
        <div className="lg:col-span-1">
          <label className="block mb-1 text-gray-700">Symbol</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="e.g., $"
            className={inputClass("symbol")}
          />
          {errors.symbol && (
            <p className="text-red-500 text-sm mt-1">{errors.symbol}</p>
          )}
        </div>

        {/* Code */}
        <div className="lg:col-span-1">
          <label className="block mb-1 text-gray-700">Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g., USD"
            className={inputClass("code")}
          />
          {errors.code && (
            <p className="text-red-500 text-sm mt-1">{errors.code}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 lg:col-span-1 flex items-end">
          <button
            onClick={handleAdd}
            disabled={loading}
            className={`w-full px-6 py-2 bg-yellow-400 text-white font-semibold rounded-md hover:bg-yellow-600 transition cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
