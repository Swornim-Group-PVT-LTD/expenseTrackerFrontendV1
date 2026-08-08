// ----------------------------
// Get Token From Cookies
// ----------------------------
const getToken = (): string => {
  // Handles: access_token=xxxx OR access_token="xxxx"
  const match = document.cookie.match(/access_token="?([^";]+)"?/);
  if (!match) throw new Error("No access_token found in cookies. Please login first.");
  return match[1];
};


const axios = require("axios");
import BASE_URL from "@/app/urlConfig/urlConfig";
// ----------------------------
// Get Filtered Cards Data
// ----------------------------
export const getFilteredCardsDataService = async (
  filterType: string,
  category: string
): Promise<any> => {
  try {
    const token = getToken();  
    
    const response = await axios.get(`${BASE_URL}/api/${category}/total?filter=${filterType}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch filtered cards data"
    );
  }
};