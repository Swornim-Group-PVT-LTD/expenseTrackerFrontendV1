// services/investmentCatalogueService.ts
import axios from "axios";
import BASE_URL from "@/app/urlConfig/urlConfig";
import { AddInvestmentCategoryPayload, InvestmentCategoryResponse } from "../../types/catalolgueType/investmentCatalogueType";

// Helper to get token from cookies
const getToken = (): string => {
  const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
  if (!match) throw new Error("No access_token found in cookies. Please login first.");
  return match[2];
};

// Add new investment category
export const addInvestmentCategoryService = async (
  payload: AddInvestmentCategoryPayload
): Promise<InvestmentCategoryResponse> => {
  const token = getToken();
  const response = await axios.post(`${BASE_URL}/api/investmentCategory/add`, payload, {
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    withCredentials: true,
  });
  return response.data;
};

// Get all investment categories
export const getInvestmentCategoriesService = async (): Promise<InvestmentCategoryResponse[]> => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/api/investmentCategory/list`, {
    headers: { "Authorization": `Bearer ${token}` },
  });

  const categories: InvestmentCategoryResponse[] = Array.isArray(response.data)
    ? response.data
    : response.data?.data ?? [];

  if (categories.length > 0) categories.sort((a, b) => a.id - b.id);

  return categories;
};

export const deleteInvestmentCategoryService = async (id: number): Promise<void> => {
  try {
    const token = getToken();
    await axios.delete(`${BASE_URL}/api/investmentCategory/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to delete investment category"
    );
  }
};

export const updateInvestmentCategoryService = async (
  id: number,
  payload: Partial<AddInvestmentCategoryPayload>
): Promise<InvestmentCategoryResponse> => {
  try {
    const token = getToken();
    const response = await axios.put<InvestmentCategoryResponse>(
      `${BASE_URL}/api/investmentCategory/${id}`,
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
      error.response?.data?.message || error.message || "Failed to update investment category"
    );
  }
};
