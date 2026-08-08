import axios from "axios";
import BASE_URL from "@/app/urlConfig/urlConfig";
import { LoginPayload, LoginResponse } from "../types/loginType";

export const loginService = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${BASE_URL}/api/login`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};
