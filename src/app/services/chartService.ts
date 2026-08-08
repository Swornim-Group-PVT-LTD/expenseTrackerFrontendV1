import axios from "axios";
import BASE_URL from "@/app/urlConfig/urlConfig";

// Helper to get token from cookies
const getToken = (): string => {
  const match = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
  if (!match) throw new Error("No access_token found in cookies. Please login first.");
  return match[2];
};

// Get Chart Data
export const dashboardBarChartService = async (filter_type:string): Promise<any> => {
  try {
    const token = getToken();
    const response = await axios.get(`${BASE_URL}/api/dashboard-graph?filter=${filter_type}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch chart data"
    );
  }
};

// Get Daily Line Chart Data for expense, income, savings, investments
export const dailyLineChartService = async (category:string): Promise<any> => {
  try {
    const token = getToken();
    const response = await axios.get(`${BASE_URL}/api/${category}/graph/daily`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch daily line chart data"
    );
  }
};


//get Monthly Bar Chart Data for expense, income, savings, investments
export const monthlyBarChartService = async (category:string): Promise<any> => {
  try {
    const token = getToken();
    const response = await axios.get(`${BASE_URL}/api/${category}/graph/monthly`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch monthly bar chart data"
    );
  }
};


//Get Category-wise Pie Chart Data for expense including date filter
export const expensePieChartService = async (filter_type:string, startDate?:string, endDate?:string): Promise<any> => {
  try {
    const token = getToken();
    const response = await axios.get(`${BASE_URL}/api/expenses/category-wise?filter_type=${filter_type}&start_date=${startDate}&end_date=${endDate}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch category pie chart data"
    );
  }
};
