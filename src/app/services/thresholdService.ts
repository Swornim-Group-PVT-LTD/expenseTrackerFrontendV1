// services/thresholdService.ts
import axios from "axios";
import BASE_URL from "@/app/urlConfig/urlConfig";
import { AddThresholdPayload, CompareExpenseAndThresholdResponse, ThresholdResponse } from "../types/thresholdType";

// Helper to get token from cookies
const getToken = (): string => {
    const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
    if (!match) throw new Error("No access_token found in cookies. Please login first.");
    return match[2];
};

// Add new Threshold
export const addThresholdService = async (
    payload: AddThresholdPayload
): Promise<ThresholdResponse> => {
    try {
        const token = getToken();
        const response = await axios.post<ThresholdResponse>(
            `${BASE_URL}/api/expense-thresholds`,
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                withCredentials: true,
            }
        );
        const data = response.data as any;
        return {
            ...response.data,
            isEnable: data.isEnable === 1 || data.isEnable === "1" || data.isEnable === true || data.isEnable === "true"
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to add threshold");
    }
};

// Get all Thresholds
export const getThresholdsService = async (): Promise<ThresholdResponse[]> => {
    try {
        const token = getToken();
        const response = await axios.get(`${BASE_URL}/api/expense-thresholds`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const thresholds: ThresholdResponse[] = (response.data?.data || []).map((item: any) => ({
            ...item,
            // Convert to boolean: handles 1, "1", true, "true" as true
            isEnable: item.isEnable === 1 || item.isEnable === "1" || item.isEnable === true || item.isEnable === "true"
        }));

        // Sort by id descending to show newest first
        if (thresholds.length > 0) {
            thresholds.sort((a, b) => b.id - a.id);
        }

        return thresholds;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || error.message || "Failed to fetch thresholds"
        );
    }
};

// Delete Threshold
export const deleteThresholdService = async (sn: string): Promise<void> => {
    try {
        const token = getToken();
        await axios.delete(`${BASE_URL}/api/expense-thresholds/${sn}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || error.message || "Failed to delete threshold"
        );
    }
};

// Update Threshold
export const updateThresholdService = async (sn: string, payload: AddThresholdPayload): Promise<ThresholdResponse> => {
    try {
        const token = getToken();
        const response = await axios.put<ThresholdResponse>(
            `${BASE_URL}/api/expense-thresholds/${sn}`,
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                withCredentials: true,
            }
        );
        const data = response.data as any;
        return {
            ...response.data,
            isEnable: data.isEnable === 1 || data.isEnable === "1" || data.isEnable === true || data.isEnable === "true"
        };
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message || "Failed to update threshold");
    }
};



//Compare threshold with expenses
export const compareThresholdWithExpensesService = async (filterType: string): Promise<CompareExpenseAndThresholdResponse> => {
    try {
        const token = getToken();
        const response = await axios.get(`${BASE_URL}/api/expense-threshold/compare?filter=${filterType}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || error.message || "Failed to compare threshold with expenses"
        );
    }
};