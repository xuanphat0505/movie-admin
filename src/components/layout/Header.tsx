"use client";

import React from "react";
import { Search, Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect } from "react";

// Component Header chứa thanh tìm kiếm, đổi giao diện, thông báo và thông tin admin đăng nhập
export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Thiết lập trạng thái mounted sau khi component được render lần đầu trên client
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="h-20 border-b border-slate-200 bg-white/85 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-50 transition-all duration-300 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] dark:shadow-none dark:bg-slate-950/40 dark:border-slate-900/60">
      {/* Search Bar */}
      <div className="relative w-96">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
        <input
          type="text"
          placeholder="Search movies, users, or reports..."
          className="w-full bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-full py-2 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#ff8300]/50 focus:bg-white transition-all dark:bg-slate-900/60 dark:border-slate-800/80 dark:hover:border-slate-700 dark:text-slate-300 dark:placeholder-slate-500 dark:focus:bg-slate-900/80"
        />
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center gap-6">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all dark:hover:bg-slate-900/60 dark:text-slate-400 dark:hover:text-white"
          title="Toggle Theme"
        >
          {mounted ? (
            theme === "dark" ? <Sun size={18} /> : <Moon size={18} />
          ) : (
            <div className="w-[18px] h-[18px]" />
          )}
        </button>

        {/* Notification Bell */}
        <button className="relative p-2.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all dark:hover:bg-slate-900/60 dark:text-slate-400 dark:hover:text-white">
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-amber-500 rounded-full"></span>
        </button>

        {/* User Info & Avatar */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-6 dark:border-slate-800/80">
          <div className="text-right">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
              Admin Noir
            </h3>
            <span className="text-[10px] font-bold text-[#ff8300] tracking-wider uppercase">
              Super Admin
            </span>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center dark:border-slate-800 dark:bg-slate-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/drngsxvb3/image/upload/q_auto/f_auto/v1776490861/user_rnttki.png"
              alt="Admin Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
