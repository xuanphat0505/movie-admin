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
    <aside className="w-72 flex flex-col justify-between h-screen sticky top-0 bg-slate-100 text-slate-600 border-r border-slate-200 p-6 flex-shrink-0 transition-colors duration-300 dark:bg-slate-950 dark:border-slate-900 dark:text-slate-300 dark:border-r-slate-900/60">
      <div className="flex flex-col gap-8">
        {/* Logo Brand */}
        <div className="px-2">
          <h1 className="text-xl font-bold text-slate-800 tracking-wide flex items-center gap-2 dark:text-white">
            <span className="text-[#ff8300]">Stream-Lab</span>
          </h1>
          <span className="text-xs text-slate-400 font-medium tracking-wider uppercase block mt-1 dark:text-slate-500">
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#ff8300]/10 text-[#ff8300] border-l-4 border-[#ff8300] rounded-l-none pl-3"
                    : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/40 dark:hover:text-white"
                }`}
              >
                <Icon size={18} className="shrink-0" />
                <span>{item.name}</span>
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
          className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:text-rose-500 font-medium text-[14px] transition-colors w-full text-left dark:text-slate-400 cursor-pointer"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
