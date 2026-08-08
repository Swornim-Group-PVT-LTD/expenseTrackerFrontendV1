// services/expenseCatalogueService.ts
import axios from "axios";
import BASE_URL from "@/app/urlConfig/urlConfig";
import { AddExpenseCategoryPayload, ExpenseCategoryResponse } from "../../types/catalolgueType/expenseCatalogueType";

// Helper to get token from cookies
const getToken = (): string => {
  const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
  if (!match) throw new Error("No access_token found in cookies. Please login first.");
  return match[2];
};

// Add new expense category
export const addExpenseCategoryService = async (
  payload: AddExpenseCategoryPayload
): Promise<ExpenseCategoryResponse> => {
  try {
    const token = getToken();
    const response = await axios.post<ExpenseCategoryResponse>(
      `${BASE_URL}/api/expenseCategory/add`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to add expense category"
    );
  }
};

// Get all expense categories
export const getExpenseCategoriesService = async (): Promise<ExpenseCategoryResponse[]> => {
  try {
    const token = getToken();
    const response = await axios.get(`${BASE_URL}/api/expenseCategory/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Ensure we have a data array
    const categories: ExpenseCategoryResponse[] = response.data?.data || [];

    // Sort by id ascending if array exists
    if (categories.length > 0) {
      categories.sort((a, b) => a.id - b.id);
    }

    return categories;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch expense categories"
    );
  }
};

// Delete expense category by ID
export const deleteExpenseCategoryService = async (id: number): Promise<void> => {
  try {
    const token = getToken();
    await axios.delete(`${BASE_URL}/api/expenseCategory/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to delete expense category"
    );
  }
};



export const updateExpenseCategoryService = async (
  id: number,
  payload: AddExpenseCategoryPayload
): Promise<ExpenseCategoryResponse> => {
  try {
    const token = getToken();
    const response = await axios.put<ExpenseCategoryResponse>(
      `${BASE_URL}/api/expenseCategory/${id}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to update expense category"
    );
  }
};