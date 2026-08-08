// components/investmentCatalogueTable.tsx
"use client";

import { ClipLoader } from "react-spinners";
import React, { useState, useEffect } from "react";
import { InvestmentCategoryResponse } from "../../../../types/catalolgueType/investmentCatalogueType";

import { deleteInvestmentCategoryService, getInvestmentCategoriesService, updateInvestmentCategoryService } from "@/app/services/catalogueServices/investmentCatalogueService";
import { toast } from 'react-toastify'

export default function InvestmentCatalogueTable({ refreshTrigger }: { refreshTrigger: number }) {
  const [data, setData] = useState<InvestmentCategoryResponse[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ investment_category: "" });


  const fetchData = async () => {
    try { setLoading(true); const categories = await getInvestmentCategoriesService(); setData(categories); }
    catch (err) { console.error("Failed to fetch investment categories:", err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [refreshTrigger]);

  const filteredData = data.filter(item =>
    item.investment_category?.toLowerCase().includes(search.toLowerCase()) ||
    item.static_value?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    try {
      if (!confirm("Are you sure you want to delete this investment category?")) return;
      await deleteInvestmentCategoryService(id);
      toast.success('Investment category deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete investment category');
    }
  };

  // Start editing a row
  const startEdit = (item: any) => {
    setEditingId(item.id);
    setEditForm({ investment_category: item.investment_category });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ investment_category: "" });
  };

  // Save update
  const saveEdit = async (id: number) => {
    try {
      const updated = await updateInvestmentCategoryService(id, {
        static_value: "INEVSTMENT",
        investment_category: editForm.investment_category,
        additional_value1: null,
        additional_value2: null,
        additional_value3: null,
        additional_value4: null,
      });

      fetchData(); // Refresh data after update
      toast.success("Investment category updated successfully");

      cancelEdit();
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  };

  return (
    <>
      <div className="flex justify-end mb-2">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="px-3 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto w-full mt-4">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Added Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Static Data</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Investment Category</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? <tr>
              <td colSpan={100} className="text-center py-4">
                <ClipLoader size={22} color="#000000" />
              </td>
            </tr>
              : filteredData.length > 0 ? filteredData.map(item => (
                <tr key={item.id}>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.id}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.created_date}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{item.sn}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {editingId === item.id ? (
                      <input
                        className="border p-1"
                        value={editForm.investment_category}
                        type="string"
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            investment_category: String(e.target.value),
                          }))
                        }
                      />
                    ) : (
                      item.investment_category
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <div className="flex justify-end gap-2">
                      <span className="text-green-500 cursor-pointer hover:underline">
                        {editingId === item.id ? (
                          <>
                            <button
                              className="text-green-600 mr-2 cursor-pointer hover:underline"
                              onClick={() => saveEdit(item.id)}
                            >
                              Save
                            </button>
                            <button
                              className="text-gray-600 cursor-pointer hover:underline"
                              onClick={cancelEdit}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            className="text-green-400 cursor-pointer hover:underline"
                            onClick={() => startEdit(item)}
                          >
                            Update
                          </button>
                        )}
                      </span>
                      <span className="text-red-500 cursor-pointer hover:underline" onClick={() => handleDelete(item.id)}>Delete</span>
                    </div>
                  </td>
                </tr>
              )) : <tr><td colSpan={5} className="px-4 py-2 text-center text-gray-500">No records found</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 mt-4">
        {loading ? (
          <div className="text-center font-medium text-gray-500">
            <ClipLoader size={22} color="#000000" />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center font-medium text-gray-500">No records found</div>
        ) : (
          filteredData.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-800">ID {item.id}</span>
                <div className="flex gap-2 text-xs font-bold">
                  {editingId === item.id ? (
                    <>
                      <button onClick={() => saveEdit(item.id)} className="text-green-600 hover:underline">Save</button>
                      <span className="text-gray-300">/</span>
                      <button onClick={cancelEdit} className="text-gray-500 hover:underline">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(item)} className="text-[#FFAA00] hover:underline">Edit</button>
                      <span className="text-gray-300">/</span>
                      <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">Delete</button>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Category:</span>
                  {editingId === item.id ? (
                    <input
                      className="w-32 p-1 text-sm border rounded focus:ring-1 focus:ring-[#FFAA00]"
                      value={editForm.investment_category}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          investment_category: String(e.target.value),
                        }))
                      }
                    />
                  ) : (
                    <span className="font-semibold">{item.investment_category}</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Static Data:</span>
                  <span className="font-semibold">{item.sn}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
                  <span>Created: {item.created_date}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
