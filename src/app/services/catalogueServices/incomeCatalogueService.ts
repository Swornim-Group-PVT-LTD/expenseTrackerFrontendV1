// services/incomeCatalogueService.ts
import axios from "axios";
import BASE_URL from "@/app/urlConfig/urlConfig";
import { AddIncomeCategoryPayload, IncomeCategoryResponse } from "../../types/catalolgueType/incomeCatalogueType";

// Helper to get token from cookies
const getToken = (): string => {
  const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
  if (!match) throw new Error("No access_token found in cookies. Please login first.");
  return match[2];
};

// Add new income category
export const addIncomeCategoryService = async (
  payload: AddIncomeCategoryPayload
): Promise<IncomeCategoryResponse> => {
  try {
    const token = getToken();
    const response = await axios.post<IncomeCategoryResponse>(
      `${BASE_URL}/api/incomeCategory/add`,
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
      error.response?.data?.message || error.message || "Failed to add income category"
    );
  }
};

// Get all income categories
export const getIncomeCategoriesService = async (): Promise<IncomeCategoryResponse[]> => {
  try {
    const token = getToken();
    const response = await axios.get(`${BASE_URL}/api/incomeCategory/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Extract array safely
    const categories: IncomeCategoryResponse[] = Array.isArray(response.data)
      ? response.data
      : response.data?.data ?? [];

    // Sort by id if there is data
    if (categories.length > 0) {
      categories.sort((a, b) => a.id - b.id);
    }

    return categories;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch income categories"
    );
  }
};


export const deleteIncomeCategoryService = async (id: number): Promise<void> => {
  try {
    const token = getToken();
    await axios.delete(`${BASE_URL}/api/incomeCategory/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to delete income category"
    );
  }
};

export const updateIncomeCategoryService = async (
  id: number,
  payload: AddIncomeCategoryPayload
): Promise<IncomeCategoryResponse> => {
  try {
    const token = getToken();
    const response = await axios.put<IncomeCategoryResponse>(
      `${BASE_URL}/api/incomeCategory/${id}`,
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
      error.response?.data?.message || error.message || "Failed to update income category"
    );
  }
};

