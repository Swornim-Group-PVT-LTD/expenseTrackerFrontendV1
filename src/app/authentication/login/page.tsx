"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginService } from "@/app/services/loginService";

import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const { login } = useAuth();

  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await loginService({ email, password });

      login(response.user);
      document.cookie = `access_token=${response.access_token}; path=/; Secure; SameSite=Strict`;
      setMessage(response.message);
      router.push("/dashboard");
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Login failed");
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
            Don&apos;t have an account?
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
