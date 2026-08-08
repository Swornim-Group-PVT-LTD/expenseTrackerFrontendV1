"use client";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BASE_URL from "@/app/urlConfig/urlConfig";

import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const { login } = useAuth();

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${BASE_URL}/api/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );


      const token = res.data.access_token;
      const userData = res.data.user;

      login(userData);
      document.cookie = `access_token=${token}; path=/; Secure; SameSite=Strict`;
      setMessage(res.data.message);
      router.push("/dashboard");
    } catch (error: any) {
      setMessage(`${error.response?.data?.message || "Login failed"}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen  bg-gray-50 dark:bg-gray-900 px-5  sm-px-0">
      <div className="bg-[var(--color1)] shadow-xl rounded-xl p-8 w-full max-w-md text-white">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/app-logo.png"
            alt="Expense Tracker"
            className="h-20 object-contain mb-4"
          />
          <h2 className="text-2xl font-bold text-center">Login</h2>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium ">Email</label>
            <input
              type="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium ">Password</label>
            <input
              type="password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[var(--color2)] hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Login
          </button>

          <div className="font-bold text-center">
            Don't have an account?
            <Link href="/authentication/register">Register</Link>
          </div>
        </form>
        {message && (
          <p className="bg-red-500 mt-4 text-center text-md text-white p-2 rounded-lg">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
