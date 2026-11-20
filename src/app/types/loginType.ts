import type { User } from "@/context/AuthContext";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  message: string;
  user: User;
}
