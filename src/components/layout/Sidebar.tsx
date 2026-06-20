"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  Tags,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { authApi } from "@/apis/authApi";

// Component Sidebar hiển thị menu điều hướng chính của trang quản trị
export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // Xử lý đăng xuất tài khoản quản trị viên
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

  const menuItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Movie Management", href: "/movies", icon: Film },
    { name: "Category & Country", href: "/categories", icon: Tags },
    { name: "User Management", href: "/users", icon: Users },
    { name: "Reports", href: "/reports", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-16 md:w-72 flex flex-col justify-between h-screen sticky top-0 bg-slate-100 text-slate-600 border-r border-slate-200 p-3 md:p-6 shrink-0 transition-all duration-300 ease-in-out overflow-x-hidden dark:bg-slate-950 dark:border-slate-900 dark:text-slate-300 dark:border-r-slate-900/60">
      <div className="flex flex-col gap-8">
        {/* Logo Brand */}
        <div className="px-1 md:px-2 text-center md:text-left">
          <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-wide flex items-center justify-center md:justify-start dark:text-white whitespace-nowrap">
            <span className="text-[#ff8300]">S</span>
            <span className="text-[#ff8300] hidden md:inline">tream-Lab</span>
          </h1>
          <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-1 dark:text-slate-500 hidden md:block whitespace-nowrap">
            Noir Admin
          </span>
        </div>

        {/* Menu Navigation */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-center md:justify-start gap-3 py-3 pr-3 md:pr-4 pl-2.5 md:pl-3 rounded-lg text-[14px] font-medium transition-all duration-200 whitespace-nowrap outline-none border-l-4 ${
                  isActive
                    ? "bg-[#ff8300]/10 text-[#ff8300] border-[#ff8300] rounded-l-none"
                    : "border-transparent text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/40 dark:hover:text-white"
                }`}
                title={item.name}
              >
                <Icon size={18} className="shrink-0" />
                <span className="hidden md:inline">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Sidebar (Upgrade & Logout) */}
      <div className="flex flex-col gap-6">
        {/* Logout Link */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center md:justify-start gap-3 px-3 py-2 text-slate-600 hover:text-rose-500 font-medium text-[14px] transition-colors w-full dark:text-slate-400 cursor-pointer whitespace-nowrap"
          title="Logout"
        >
          <LogOut size={18} />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </aside>
  );
}
