"use client";

import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useTheme } from "@/context/ThemeContext";

// Component Wrapper định hình bố cục trang Admin (Sidebar bên trái, Header và nội dung chính bên phải)
export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#08080a] dark:text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
