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

import {
  getSavingService,
  deleteSavingService,
  updateSavingService,
} from "@/app/services/savingService";
import { SavingResponse } from "@/app/types/savingType";
import { SavingCategoryResponse } from "@/app/types/catalolgueType/savingCatalogueType";
import { getSavingCategoriesService } from "@/app/services/catalogueServices/savingCatalogueService";
import SearchInput from "@/app/components/SearchInput";
import { on } from "events";

export default function SavingTable({
  refreshTrigger,
  filteredData,
  onSuccess,
  onDataLoad,
}: {
  refreshTrigger: number;
  filteredData?: SavingResponse[] | null;
  onSuccess?: () => void;
  onDataLoad?: (data: SavingResponse[]) => void;
}) {
  const [saving, setSaving] = useState<SavingResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingSn, setEditingSn] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    add_saving: 0,
    saving_category: "",
    want_to_deduct_from_balance: false,
  });

  const [categories, setCategories] = useState<SavingCategoryResponse[]>([]);

  const fetchCategories = async () => {
    try {
      const data = await getSavingCategoriesService();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch saving categories:", err);
      toast.error("Failed to fetch saving categories");
    }
  };

  const fetchSaving = async () => {
    setLoading(true);
    try {
      const data = await getSavingService();
      setSaving(data);
      onDataLoad && onDataLoad(data);
    } catch (error) {
      console.error("Error fetching Saving:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch all data if no filter is active
    if (filteredData) {
      setSaving(filteredData);
      setLoading(false);
    } else {
      fetchSaving();
    }
    fetchCategories();
  }, [refreshTrigger, filteredData]);

  // Start editing a row
  const startEdit = (item: any) => {
    setEditingSn(item.sn);
    setEditForm({
      add_saving: item.add_saving,
      saving_category: item.saving_category,
      want_to_deduct_from_balance: item.want_to_deduct_from_balance || false,
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingSn(null);
    setEditForm({
      add_saving: 0,
      saving_category: "",
      want_to_deduct_from_balance: false,
    });
  };

  // Save update
  const saveEdit = async (sn: string) => {
    // Validate category
    const categoryExists = categories.some(
      (cat) => cat.saving_category.toLowerCase() === editForm.saving_category.toLowerCase()
    );

    if (!categoryExists) {
      toast.error("Please select a valid category from the list");
      return;
    }

    try {
      await updateSavingService(sn, {
        add_saving: editForm.add_saving,
        saving_category: editForm.saving_category,
        want_to_deduct_from_balance: editForm.want_to_deduct_from_balance,
      });

      onSuccess && onSuccess();
      toast.success("Saving updated successfully");
      setSaving((prev) =>
        prev.map((item) =>
          item.sn === sn
            ? {
              ...item,
              add_saving: editForm.add_saving,
              saving_category: editForm.saving_category,
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
    if (!confirm("Are you sure you want to delete this saving?")) return;
    try {
      deleteSavingService(sn);
      onSuccess && onSuccess();
      toast.success("saving deleted successfully");
      setSaving(saving.filter((saving) => saving.sn !== sn));
    } catch (error) {
      console.error("Error deleting saving:", error);
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
                  <TableHeadCell>Saving</TableHeadCell>
                  <TableHeadCell>Deduct from balance</TableHeadCell>
                  <TableHeadCell>Remarks</TableHeadCell>
                  <TableHeadCell>Total Saving</TableHeadCell>
                  <TableHeadCell>Created Date</TableHeadCell>
                  <TableHeadCell>Action</TableHeadCell>
                </TableRow>
              </TableHead>

              {/* TableBody */}
              <TableBody className="divide-y">
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center font-medium text-gray-500"
                    >
                      <ClipLoader size={22} color="#000000" />
                    </TableCell>
                  </TableRow>
                ) : saving.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center font-medium text-gray-500"
                    >
                      No Saving found
                    </TableCell>
                  </TableRow>
                ) : (
                  saving.map((row) => (
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
                            value={editForm.add_saving}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                add_saving: Number(e.target.value),
                              }))
                            }
                          />
                        ) : (
                          Number(row.add_saving).toLocaleString()
                        )}
                      </TableCell>

                      <TableCell>
                        {editingSn === row.sn ? (
                          <input
                            type="checkbox"
                            checked={editForm.want_to_deduct_from_balance || false}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                want_to_deduct_from_balance: e.target.checked,
                              }))
                            }
                          />
                        ) : (
                          <span>
                            {row.want_to_deduct_from_balance ? "Yes" : "No"}
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        {editingSn === row.sn ? (
                          <SearchInput
                            options={categories.map(cat => ({ id: cat.id, value: cat.saving_category }))}
                            value={editForm.saving_category}
                            onChange={(value) => setEditForm(prev => ({ ...prev, saving_category: value }))}
                            placeholder="Type saving category..."
                            className="w-full sm:w-80"
                          />
                        ) : (
                          row.saving_category
                        )}
                      </TableCell>

                      <TableCell>
                        {row.symbol || "NPR"} {row.total_saving.toLocaleString()}
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

                {/* TOTAL SAVING BAR */}
                {saving.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div
                        className="flex justify-between items-center p-4 text-white font-semibold rounded-lg shadow mt-2"
                        style={{ backgroundColor: "#44eeaa" }}
                      >
                        <span>Total Saving</span>
                        <span>
                          {saving[saving.length - 1].symbol || "NPR"}{" "}
                          {saving[saving.length - 1].total_saving?.toLocaleString() ||
                            "0"}
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
        ) : saving.length === 0 ? (
          <div className="text-center font-medium text-gray-500">
            No Saving found
          </div>
        ) : (
          saving.map((row) => (
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
                <div className="flex-1 flex flex-col gap-1">
                  {editingSn === row.sn ? (
                    <>
                      <SearchInput
                        options={categories.map((cat) => ({
                          id: cat.id,
                          value: cat.saving_category,
                        }))}
                        value={editForm.saving_category}
                        onChange={(value) =>
                          setEditForm((prev) => ({
                            ...prev,
                            saving_category: value,
                          }))
                        }
                        placeholder="Category..."
                        className="w-full text-xs"
                      />
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 rounded text-[#FFAA00] focus:ring-[#FFAA00]"
                          checked={editForm.want_to_deduct_from_balance}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              want_to_deduct_from_balance: e.target.checked,
                            }))
                          }
                        />
                        <span className="text-[10px] text-gray-500 font-medium leading-none">Deduct from balance</span>
                      </label>
                    </>
                  ) : (
                    <span className="text-sm text-gray-600">
                      {row.saving_category}
                      {row.want_to_deduct_from_balance && (
                        <span className="text-[10px] ml-1 text-blue-500 font-medium">
                          (Deducted)
                        </span>
                      )}
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
                        value={editForm.add_saving}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            add_saving: Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-gray-800">
                      Saving {row.symbol || "NPR"}{" "}
                      {Number(row.add_saving).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Row 3: Date and Total */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{row.created_date}</span>
                <span className="text-xs font-bold text-gray-700">
                  Total Saving {row.symbol || "NPR"}{" "}
                  {row.total_saving?.toLocaleString() || "0"}
                </span>
              </div>
            </div>
          ))
        )}

        {/* Total Saving Card */}
        {saving.length > 0 && (
          <div
            className="p-4 text-white font-semibold rounded-lg shadow"
            style={{ backgroundColor: "#44eeaa" }}
          >
            <div className="flex justify-between items-center">
              <span>Total Saving</span>
              <span>
                {saving[saving.length - 1].symbol || "NPR"}{" "}
                {saving[saving.length - 1].total_saving?.toLocaleString() ||
                  "0"}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
