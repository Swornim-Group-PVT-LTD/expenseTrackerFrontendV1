"use client";

import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";

import SearchInput from "@/app/components/SearchInput";

import {
  getInvestmentService,
  deleteInvestmentService,
  updateInvestmentService,
} from "@/app/services/investmentService";
import { InvestmentResponse } from "@/app/types/investmentType";
import { getInvestmentCategoriesService } from "@/app/services/catalogueServices/investmentCatalogueService";
import { InvestmentCategoryResponse } from "@/app/types/catalolgueType/investmentCatalogueType";
import { on } from "events";

export default function InvestmentTable({
  refreshTrigger,
  filteredData,
  onSuccess,
  onDataLoad,
}: {
  refreshTrigger: number;
  filteredData?: InvestmentResponse[] | null;
  onSuccess: () => void;
  onDataLoad?: (data: InvestmentResponse[]) => void;
}) {
  const [investment, setInvestment] = useState<InvestmentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingSn, setEditingSn] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    add_investment: 0,
    investment_category: "",
  });
  const [categories, setCategories] = useState<InvestmentCategoryResponse[]>(
    []
  );

  const fetchCategories = async () => {
    try {
      const data = await getInvestmentCategoriesService();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch investment categories:", err);
    }
  };

  const fetchInvestment = async () => {
    setLoading(true);
    try {
      const data = await getInvestmentService();
      setInvestment(data);
      onDataLoad && onDataLoad(data);
    } catch (error) {
      console.error("Error fetching Investment:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Only fetch all data if no filter is active
    if (filteredData) {
      setInvestment(filteredData);
      setLoading(false);
    } else {
      fetchInvestment();
    }
    fetchCategories();
  }, [refreshTrigger, filteredData]);

  // Start editing a row
  const startEdit = (item: any) => {
    setEditingSn(item.sn);
    setEditForm({
      add_investment: item.add_investment,
      investment_category: item.investment_category,
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingSn(null);
    setEditForm({ add_investment: 0, investment_category: "" });
  };

  // Save update
  const saveEdit = async (sn: string) => {
    // Validate category
    const categoryExists = categories.some(
      (cat) => cat.investment_category.toLowerCase() === editForm.investment_category.toLowerCase()
    );

    if (!categoryExists) {
      toast.error("Please select a valid category from the list");
      return;
    }

    try {
      await updateInvestmentService(sn, {
        add_investment: editForm.add_investment,
        investment_category: editForm.investment_category,
      });

      onSuccess && onSuccess();
      toast.success("Investment updated successfully");

      setInvestment((prev) =>
        prev.map((item) =>
          item.sn === sn
            ? {
              ...item,
              add_investment: editForm.add_investment,
              investment_category: editForm.investment_category,
            }
            : item
        )
      );

      cancelEdit();
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  };

  const handleDelete = (sn: string) => {
    if (!confirm("Are you sure you want to delete this investment?")) return;
    try {
      deleteInvestmentService(sn);
      onSuccess && onSuccess();
      toast.success("investment deleted successfully");
      setInvestment(investment.filter((investment) => investment.sn !== sn));
    } catch (error) {
      console.error("Error deleting investment:", error);
    }
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <Table striped className="min-w-[800px]">
              {/* TableHead */}
              <TableHead className="text-lg">
                <TableRow>
                  <TableHeadCell>ID</TableHeadCell>
                  <TableHeadCell>Investment</TableHeadCell>
                  <TableHeadCell>Remarks</TableHeadCell>
                  <TableHeadCell>Total Investment</TableHeadCell>
                  <TableHeadCell>Created Date</TableHeadCell>
                  <TableHeadCell>Action</TableHeadCell>
                </TableRow>
              </TableHead>

              {/* TableBody */}
              <TableBody className="divide-y">
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center font-medium text-gray-500"
                    >
                      <ClipLoader size={22} color="#000000" />
                    </TableCell>
                  </TableRow>
                ) : investment.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center font-medium text-gray-500"
                    >
                      No Investment found
                    </TableCell>
                  </TableRow>
                ) : (
                  investment.map((row) => (
                    <TableRow
                      key={row.id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {row.id}
                      </TableCell>
                      <TableCell>
                        {row.symbol || "NPR"}{" "}
                        {editingSn === row.sn ? (
                          <input
                            className="p-2 border rounded-md border-gray-300"
                            value={editForm.add_investment}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                add_investment: Number(e.target.value),
                              }))
                            }
                          />
                        ) : (
                          Number(row.add_investment).toLocaleString()
                        )}
                      </TableCell>
                      <TableCell>
                        {editingSn === row.sn ? (

                          <SearchInput
                            options={categories.map(cat => ({ id: cat.id, value: cat.investment_category }))}
                            value={editForm.investment_category}
                            onChange={(value) => setEditForm(prev => ({ ...prev, investment_category: value }))}
                            placeholder="Type investment category..."
                            className="w-full sm:w-80"
                          />
                        ) : (
                          row.investment_category
                        )}
                      </TableCell>
                      <TableCell>
                        {row.symbol || "NPR"} {row.total_investment.toLocaleString()}
                      </TableCell>
                      <TableCell>{row.created_date}</TableCell>
                      <TableCell>
                        {editingSn === row.sn ? (
                          <>
                            <button
                              className="text-green-600 mr-2 cursor-pointer"
                              onClick={() => saveEdit(row.sn)}
                            >
                              Save
                            </button>
                            <button
                              className="text-gray-600 cursor-pointer"
                              onClick={cancelEdit}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            className="text-blue-600 cursor-pointer"
                            onClick={() => startEdit(row)}
                          >
                            Edit
                          </button>
                        )}
                        <a
                          href="#"
                          className="font-medium text-red-600 hover:underline dark:text-red-500 ml-2"
                          onClick={() => handleDelete(row.sn)}
                        >
                          Delete
                        </a>
                      </TableCell>
                    </TableRow>
                  ))
                )}

                {/* TOTAL INVESTMENT BAR */}
                {investment.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div
                        className="flex justify-between items-center p-4 text-white font-semibold rounded-lg shadow mt-2"
                        style={{ backgroundColor: "#ffa726" }}
                      >
                        <span>Total Investment</span>
                        <span>
                          {investment[investment.length - 1].symbol || "NPR"}{" "}
                          {investment[
                            investment.length - 1
                          ].total_investment?.toLocaleString() || "0"}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {loading ? (
          <div className="text-center font-medium text-gray-500">
            <ClipLoader size={22} color="#000000" />
          </div>
        ) : investment.length === 0 ? (
          <div className="text-center font-medium text-gray-500">
            No Investment found
          </div>
        ) : (
          investment.map((row) => (
            <div
              key={row.id}
              className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 flex flex-col gap-2"
            >
              {/* Row 1: ID and Actions */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-800">
                  ID {row.id}
                </span>
                <div className="flex gap-1 text-xs font-bold">
                  {editingSn === row.sn ? (
                    <>
                      <button
                        onClick={() => saveEdit(row.sn)}
                        className="text-green-600 hover:underline"
                      >
                        Save
                      </button>
                      <span className="text-gray-300">/</span>
                      <button
                        onClick={() => cancelEdit()}
                        className="text-gray-500 hover:underline"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(row)}
                        className="text-[#FFAA00] hover:underline"
                      >
                        Edit
                      </button>
                      <span className="text-gray-300">/</span>
                      <button
                        onClick={() => handleDelete(row.sn)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Row 2: Category and Amount */}
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  {editingSn === row.sn ? (
                    <SearchInput
                      options={categories.map((cat) => ({
                        id: cat.id,
                        value: cat.investment_category,
                      }))}
                      value={editForm.investment_category}
                      onChange={(value) =>
                        setEditForm((prev) => ({
                          ...prev,
                          investment_category: value,
                        }))
                      }
                      placeholder="Category..."
                      className="w-full text-xs"
                    />
                  ) : (
                    <span className="text-sm text-gray-600">
                      {row.investment_category}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  {editingSn === row.sn ? (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">{row.symbol || "NPR"}</span>
                      <input
                        type="number"
                        className="w-24 p-1 text-sm border rounded focus:ring-1 focus:ring-[#FFAA00]"
                        value={editForm.add_investment}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            add_investment: Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-gray-800">
                      Investment {row.symbol || "NPR"}{" "}
                      {Number(row.add_investment).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Row 3: Date and Total */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{row.created_date}</span>
                <span className="text-xs font-bold text-gray-700">
                  Total Investment {row.symbol || "NPR"}{" "}
                  {row.total_investment?.toLocaleString() || "0"}
                </span>
              </div>
            </div>
          ))
        )}

        {/* Total Investment Card */}
        {investment.length > 0 && (
          <div
            className="p-4 text-white font-semibold rounded-lg shadow"
            style={{ backgroundColor: "#ffa726" }}
          >
            <div className="flex justify-between items-center">
              <span>Total Investment</span>
              <span>
                {investment[investment.length - 1].symbol || "NPR"}{" "}
                {investment[
                  investment.length - 1
                ].total_investment?.toLocaleString() || "0"}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
