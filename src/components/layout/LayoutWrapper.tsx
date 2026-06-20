"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// Component Wrapper định hình bố cục trang Admin và kiểm soát quyền truy cập trang
export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Trạng thái kiểm tra xác thực (null: đang kiểm tra, false: chưa xác thực, true: đã xác thực)
  const [authStatus, setAuthStatus] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("adminToken");
      const isLoginPage = pathname === "/login";

      // Kiểm tra trạng thái chuyển hướng (chưa login mà vào trang dashboard hoặc đã login mà vào trang login)
      if (!!token === isLoginPage) {
        setAuthStatus(false);
        router.push(token ? "/" : "/login");
      } else {
        setAuthStatus(true);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Hiển thị màn hình chờ tải khi đang kiểm tra trạng thái đăng nhập
  if (authStatus === null) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-50 dark:bg-[#08080a] gap-3">
        <Loader2 className="animate-spin text-[#ff8300]" size={40} />
        <span className="text-sm font-semibold text-slate-500">Đang xác thực tài khoản...</span>
      </div>
    );
  }

  // Nếu đang chuyển hướng, không render HTML để tránh nhấp nháy giao diện dashboard
  if (authStatus === false) {
    return null;
  }

  const isLoginPage = pathname === "/login";

  // Bỏ qua Sidebar và Header nếu ở trang đăng nhập
  if (isLoginPage) {
    return <>{children}</>;
  }

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
