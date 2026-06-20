"use client";

import { useState, useEffect } from "react";
import { Bell, Sun, Moon, LogOut, User } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import { authApi } from "@/apis/authApi";

// Component Header chứa thanh tìm kiếm, đổi giao diện, thông báo và thông tin admin đăng nhập
export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();

  // Thiết lập trạng thái mounted và tải thông tin admin từ localStorage khi component render trên client
  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      try {
        setAdminUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Lỗi khi đọc thông tin admin:", error);
      }
    }
  }, []);

  // Tự động đóng dropdown khi click ra ngoài vùng chứa
  useEffect(() => {
    if (!showDropdown) return;
    const handleCloseDropdown = () => setShowDropdown(false);
    window.addEventListener("click", handleCloseDropdown);
    return () => window.removeEventListener("click", handleCloseDropdown);
  }, [showDropdown]);

  // Xử lý đăng xuất tài khoản admin
  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    } finally {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      router.push("/login");
    }
  };

  return (
    <header className="h-20 border-b border-slate-200 bg-white/85 backdrop-blur-md px-4 md:px-8 flex items-center justify-end sticky top-0 z-50 transition-all duration-300 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] dark:shadow-none dark:bg-slate-950/40 dark:border-slate-900/60 font-sans">
      {/* Actions & Profile */}
      <div className="flex items-center gap-6">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all dark:hover:bg-slate-900/60 dark:text-slate-400 dark:hover:text-white cursor-pointer"
          title="Toggle Theme"
        >
          {mounted ? (
            theme === "dark" ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )
          ) : (
            <div className="w-[18px] h-[18px]" />
          )}
        </button>

        {/* Notification Bell */}
        <button className="relative p-2.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all dark:hover:bg-slate-900/60 dark:text-slate-400 dark:hover:text-white cursor-pointer">
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-amber-500 rounded-full"></span>
        </button>

        {/* User Info & Avatar với menu Dropdown */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Tránh kích hoạt sự kiện đóng trên window
              setShowDropdown(!showDropdown);
            }}
            className="flex items-center gap-3 border-l border-slate-200 pl-6 dark:border-slate-800/80 cursor-pointer focus:outline-none group"
          >
            <div className="text-right hidden sm:block">
              <h3 className="text-sm font-semibold text-slate-800 group-hover:text-[#ff8300] transition-colors dark:text-white dark:group-hover:text-[#ff8300]">
                {adminUser?.username || "Admin Noir"}
              </h3>
              <span className="text-[10px] font-bold text-[#ff8300] tracking-wider uppercase block mt-0.5">
                {adminUser?.role || "Super Admin"}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center dark:border-slate-800 dark:bg-slate-900 ring-2 ring-transparent group-hover:ring-[#ff8300]/40 transition-all">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  adminUser?.avatar ||
                  "https://res.cloudinary.com/drngsxvb3/image/upload/q_auto/f_auto/v1776490861/user_rnttki.png"
                }
                alt="Admin Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </button>

          {/* Hộp tùy chọn Dropdown Option */}
          {showDropdown && (
            <div className="absolute right-0 mt-3.5 w-56 rounded-2xl bg-white border border-slate-100 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 dark:bg-slate-900 dark:border-slate-800/80">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  Admin Email
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-350 truncate block mt-1">
                  {adminUser?.email || "admin@streamlab.com"}
                </span>
              </div>

              {/* Option 1: Update Profile */}
              <button
                onClick={() => {
                  setShowDropdown(false);
                  router.push("/settings");
                }}
                className="flex items-center gap-2.5 px-4 py-3 text-slate-600 hover:text-[#ff8300] hover:bg-slate-50 text-xs font-medium transition-colors w-full text-left dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/30 cursor-pointer"
              >
                <User size={14} />
                <span>Chỉnh sửa thông tin</span>
              </button>

              {/* Option 2: Logout */}
              <button
                onClick={() => {
                  setShowDropdown(false);
                  handleLogout();
                }}
                className="flex items-center gap-2.5 px-4 py-3 text-rose-500 hover:bg-rose-500/5 text-xs font-medium transition-colors w-full text-left dark:hover:bg-rose-500/10 cursor-pointer"
              >
                <LogOut size={14} />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
