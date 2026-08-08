export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string; // JWT or session token
  message: string;      // Response message (e.g. "Login successful")
}
