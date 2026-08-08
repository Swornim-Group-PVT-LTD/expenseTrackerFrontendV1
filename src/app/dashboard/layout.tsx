"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "../components/sidenav";
import Topbar from "../components/topbar";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CurrencyProvider } from "@/app/context/CurrencyContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <CurrencyProvider>
      <div
        className={`bg-[#F0F2F5] dark:bg-gray-900 min-h-screen p-4 pb-28 md:p-6 pt-16 md:pt-16 transition-all duration-500 ${
          collapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        {children}
      </div>
    </CurrencyProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Topbar />
        <Sidebar />
        <ToastContainer position="top-right" autoClose={2000} />
        <DashboardContent>{children}</DashboardContent>
      </div>
    </SidebarProvider>
  );
}
