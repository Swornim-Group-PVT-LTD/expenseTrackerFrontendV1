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
  getExpenseService,
  deleteExpenseService,
  updateExpenseService,
} from "@/app/services/expenseService";
import { ExpenseResponse } from "../../../types/expenseType";

import { getExpenseCategoriesService } from "@/app/services/catalogueServices/expenseCatalogueService";
import { ExpenseCategoryResponse } from "@/app/types/catalolgueType/expenseCatalogueType";

interface BalanceCardProps {
  refreshTrigger: number;
}

export default function ExpensesTable({
  refreshTrigger,
  filteredData,
  onSuccess,
  onDataLoad,
  isFilterActive,
}: {
  refreshTrigger: number;
  filteredData?: ExpenseResponse[] | null;
  onSuccess: () => void;
  onDataLoad?: (data: ExpenseResponse[]) => void;
  isFilterActive: boolean;
}) {
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingSn, setEditingSn] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    add_expenses: 0,
    expense_category: "",
  });

  const [categories, setCategories] = useState<ExpenseCategoryResponse[]>([]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await getExpenseService();
      setExpenses(data);
      onDataLoad && onDataLoad(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getExpenseCategoriesService();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch expense categories:", err);
      toast.error("Failed to fetch expense categories");
    }
  };

  useEffect(() => {
    // If filter is active, use filteredData (even if empty) and DO NOT fetch all
    if (isFilterActive) {
      setExpenses(filteredData || []);
      setLoading(false);
    } else {
      fetchExpenses();
    }
    fetchCategories();
  }, [refreshTrigger, filteredData, isFilterActive]);

  // Start editing a row
  const startEdit = (item: any) => {
    setEditingSn(item.sn);
    setEditForm({
      add_expenses: item.add_expenses,
      expense_category: item.expense_category,
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingSn(null);
    setEditForm({ add_expenses: 0, expense_category: "" });
  };

  // Save update
  const saveEdit = async (sn: string) => {
    // Validate category
    const categoryExists = categories.some(
      (cat) => cat.expense_category.toLowerCase() === editForm.expense_category.toLowerCase()
    );

    if (!categoryExists) {
      toast.error("Please select a valid category from the list");
      return;
    }

    try {
      await updateExpenseService(sn, {
        add_expenses: editForm.add_expenses,
        expense_category: editForm.expense_category,
      });
      onSuccess && onSuccess();
      toast.success("Expense updated successfully");
      setExpenses((prev) =>
        prev.map((item) =>
          item.sn === sn
            ? {
              ...item,
              add_expenses: editForm.add_expenses,
              expense_category: editForm.expense_category,
            }
            : item
        )
      );

      cancelEdit();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update expense");
    }
  };

  const handleDelete = async (sn: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    try {
      await deleteExpenseService(sn);
      onSuccess && onSuccess();
      toast.success("Expense deleted successfully");
      setExpenses(expenses.filter((expense) => expense.sn !== sn));
    } catch (error) {
      console.error("Error deleting expense:", error);
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
                  <TableHeadCell>Expenses</TableHeadCell>
                  <TableHeadCell>Remarks</TableHeadCell>
                  <TableHeadCell>Total Expenses</TableHeadCell>
                  <TableHeadCell>Added Date</TableHeadCell>
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
                ) : expenses.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center font-medium text-gray-500"
                    >
                      No expenses found
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.map((row) => (
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
                            value={editForm.add_expenses}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                add_expenses: Number(e.target.value),
                              }))
                            }
                          />
                        ) : (
                          Number(row.add_expenses).toLocaleString()
                        )}
                      </TableCell>
                      <TableCell>
                        {editingSn === row.sn ? (
                          <SearchInput
                            options={categories.map((cat) => ({
                              id: cat.id,
                              value: cat.expense_category,
                            }))}
                            value={editForm.expense_category}
                            onChange={(value) =>
                              setEditForm((prev) => ({
                                ...prev,
                                expense_category: value,
                              }))
                            }
                            placeholder="Type expense category..."
                            className="w-full sm:w-80"
                          />
                        ) : (
                          row.expense_category
                        )}
                      </TableCell>
                      <TableCell>
                        {row.symbol || "NPR"}{" "}
                        {row.total_expenses?.toLocaleString() || "0"}
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
                        <button
                          className="font-medium text-red-600 hover:underline dark:text-red-500 ml-2"
                          onClick={() => handleDelete(row.sn)}
                        >
                          Delete
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}

                {/* TOTAL EXPENSES BAR */}
                {expenses.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div
                        className="flex justify-between items-center p-4 text-white font-semibold rounded-lg shadow mt-2"
                        style={{ backgroundColor: "#ff4d4d" }}
                      >
                        <span>Total Expenses</span>
                        <span>
                          {expenses[expenses.length - 1].symbol || "NPR"}{" "}
                          {expenses[
                            expenses.length - 1
                          ].total_expenses?.toLocaleString() || "0"}
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
        ) : expenses.length === 0 ? (
          <div className="text-center font-medium text-gray-500">
            No expenses found
          </div>
        ) : (
          expenses.map((row) => (
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
                        value: cat.expense_category,
                      }))}
                      value={editForm.expense_category}
                      onChange={(value) =>
                        setEditForm((prev) => ({
                          ...prev,
                          expense_category: value,
                        }))
                      }
                      placeholder="Category..."
                      className="w-full text-xs"
                    />
                  ) : (
                    <span className="text-sm text-gray-600">
                      {row.expense_category}
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
                        value={editForm.add_expenses}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            add_expenses: Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-gray-800">
                      Expenses {row.symbol || "NPR"}{" "}
                      {Number(row.add_expenses).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Row 3: Date and Total */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {row.created_date}
                </span>
                <span className="text-xs font-bold text-gray-700">
                  Total Expenses {row.symbol || "NPR"}{" "}
                  {row.total_expenses?.toLocaleString() || "0"}
                </span>
              </div>
            </div>
          ))
        )}

        {/* Total Expenses Card */}
        {expenses.length > 0 && (
          <div
            className="p-4 text-white font-semibold rounded-lg shadow"
            style={{ backgroundColor: "#ff4d4d" }}
          >
            <div className="flex justify-between items-center">
              <span>Total Expenses</span>
              <span>
                {expenses[expenses.length - 1].symbol || "NPR"}{" "}
                {expenses[expenses.length - 1].total_expenses?.toLocaleString() || "0"}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
