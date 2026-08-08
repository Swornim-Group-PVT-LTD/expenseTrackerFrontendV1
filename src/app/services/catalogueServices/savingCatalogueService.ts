// services/savingCatalogueService.ts
import axios from "axios";
import BASE_URL from "@/app/urlConfig/urlConfig";
import { AddSavingCategoryPayload, SavingCategoryResponse } from "../../types/catalolgueType/savingCatalogueType";

// Helper to get token from cookies
const getToken = (): string => {
  const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
  if (!match) throw new Error("No access_token found in cookies. Please login first.");
  return match[2];
};

// Add new saving category
export const addSavingCategoryService = async (
  payload: AddSavingCategoryPayload
): Promise<SavingCategoryResponse> => {
  try {
    const token = getToken();
    const response = await axios.post<SavingCategoryResponse>(
      `${BASE_URL}/api/savingCategory/add`,
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
      error.response?.data?.message || error.message || "Failed to add saving category"
    );
  }
};

// Get all saving categories
export const getSavingCategoriesService = async (): Promise<SavingCategoryResponse[]> => {
  try {
    const token = getToken();
    const response = await axios.get(`${BASE_URL}/api/savingCategory/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Extract array safely
    const categories: SavingCategoryResponse[] = Array.isArray(response.data)
      ? response.data
      : response.data?.data ?? [];

    // Sort by id ascending if array exists
    if (categories.length > 0) {
      categories.sort((a, b) => a.id - b.id);
    }

    return categories;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch saving categories"
    );
  }
};


export const deleteSavingCategoryService = async (id: number): Promise<void> => {
  try {
    const token = getToken();
    await axios.delete(`${BASE_URL}/api/savingCategory/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to delete saving category"
    );
  }
};


export const updateSavingCategoryService = async (
  id: number,
  payload: Partial<AddSavingCategoryPayload>
): Promise<SavingCategoryResponse> => {
  try {
    const token = getToken();
    const response = await axios.put<SavingCategoryResponse>(
      `${BASE_URL}/api/savingCategory/${id}`,
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
      error.response?.data?.message || error.message || "Failed to update saving category"
    );
  }
};
