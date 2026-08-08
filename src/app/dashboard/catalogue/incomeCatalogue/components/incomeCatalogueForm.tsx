"use client";

import { useState } from "react";
import { addIncomeCategoryService } from "../../../../services/catalogueServices/incomeCatalogueService";
import { AddIncomeCategoryPayload } from "../../../../types/catalolgueType/incomeCatalogueType";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface IncomeCatalogueFormProps {
  onSuccess?: () => void;
}

export default function IncomeCatalogueForm({ onSuccess }: IncomeCatalogueFormProps) {
  const [category, setCategory] = useState("");
  const [additional1, setAdditional1] = useState("");
  const [additional2, setAdditional2] = useState("");
  const [additional3, setAdditional3] = useState("");
  const [additional4, setAdditional4] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!category.trim()) newErrors.category = "Please input category";

    const numberFields = [
      { value: additional1, name: "additional1" },
      { value: additional2, name: "additional2" },
      { value: additional3, name: "additional3" },
      { value: additional4, name: "additional4" },
    ];

    numberFields.forEach((field) => {
      if (field.value && isNaN(Number(field.value))) {
        newErrors[field.name] = "Please input number";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const payload: AddIncomeCategoryPayload = {
        static_value: "INCOME",
        income_category: category,
        additional_value1: additional1 || null,
        additional_value2: additional2 || null,
        additional_value3: additional3 || null,
        additional_value4: additional4 || null,
      };

      await addIncomeCategoryService(payload);
      onSuccess && onSuccess();
      toast.success("Income category added successfully!");

      // Clear form
      setCategory("");
      setAdditional1("");
      setAdditional2("");
      setAdditional3("");
      setAdditional4("");
      setErrors({});
    } catch (err: any) {
      setErrors({ form: err.message || "Failed to add income category" });
      toast.error(err.message || "Failed to add income category");
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {/* Catalogue */}
        <div className="lg:col-span-1">
          <label className="block mb-1 text-gray-700">Catalogue</label>
          <input
            type="text"
            value="INCOME"
            readOnly
            className="w-full px-3 py-2 border rounded-md bg-gray-200 cursor-not-allowed"
          />
        </div>

        {/* Income Category */}
        <div className="lg:col-span-1">
          <label className="block mb-1 text-gray-700">Income Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Salary"
            className={inputClass("category")}
          />
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
        </div>

        {/* Additional Values */}
        {[additional1, additional2, additional3, additional4].map((val, idx) => (
          <div className="lg:col-span-1" key={idx}>
            <label className="block mb-1 text-gray-700">
              Additional {idx + 1}
            </label>
            <input
              type="text"
              value={val}
              onChange={(e) => {
                const setters = [setAdditional1, setAdditional2, setAdditional3, setAdditional4];
                setters[idx](e.target.value);
              }}
              className={inputClass(`additional${idx + 1}`)}
            />
            {errors[`additional${idx + 1}`] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[`additional${idx + 1}`]}
              </p>
            )}
          </div>
        ))}

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
