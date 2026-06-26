"use client";

import { useState, useEffect } from "react";
import { Settings2, CheckCircle, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/common";
import {
  SettingsTabs,
  ProfileForm,
  SecurityForm,
  NotificationsForm,
  SystemForm,
  TabId,
} from "@/components/settings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);

  // State thông báo thành công hoặc lỗi trên giao diện
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Tự động đọc dữ liệu tài khoản admin hiện tại từ localStorage khi mount component
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("adminUser");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setCurrentAdmin(parsed);
        } catch (e) {
          console.error("Lỗi khi giải mã thông tin admin:", e);
        }
      }
    }
  }, []);

  // Tự động ẩn thông báo alert sau 4 giây
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Đồng bộ thông tin admin khi profile thay đổi thành công
  const handleProfileUpdate = (updatedAdmin: any) => {
    localStorage.setItem("adminUser", JSON.stringify(updatedAdmin));
    setCurrentAdmin(updatedAdmin);
  };

  return (
    <div className="flex flex-col h-full font-sans">
      {/* Tiêu đề cài đặt */}
      <PageHeader
        title="Cài đặt hệ thống"
        description="Quản lý tài khoản quản trị viên cá nhân và tinh chỉnh các tham số vận hành nền tảng."
        icon={Settings2}
      />

      {/* Hiển thị Alert Banner báo trạng thái */}
      {alert && (
        <div
          className={`mb-6 p-4 rounded-xl border flex items-center gap-3 text-xs font-semibold animate-fadeIn ${
            alert.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
              : "bg-rose-500/10 border-rose-500/30 text-rose-500"
          }`}
        >
          {alert.type === "success" ? (
            <CheckCircle size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Grid chứa layout chia hai cột (Cột dọc Tab bên trái - Form bên phải) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* HÀNG CỘT TRÁI: DANH SÁCH CÁC TABS ĐIỀU HƯỚNG */}
        <SettingsTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onTabChange={() => setAlert(null)}
        />

        {/* HÀNG CỘT PHẢI: FORM CẤU HÌNH TƯƠNG ỨNG VỚI TAB ĐANG CHỌN */}
        <div className="lg:col-span-3 bg-white border border-slate-200/85 dark:bg-slate-900/40 dark:border-slate-900/60 rounded-2xl p-6 shadow-sm">
          {activeTab === "profile" && (
            <ProfileForm
              currentAdmin={currentAdmin}
              onProfileUpdate={handleProfileUpdate}
              onAlert={setAlert}
            />
          )}

          {activeTab === "security" && (
            <SecurityForm currentAdmin={currentAdmin} onAlert={setAlert} />
          )}

          {activeTab === "notifications" && (
            <NotificationsForm
              currentAdmin={currentAdmin}
              onAlert={setAlert}
            />
          )}

          {activeTab === "system" && <SystemForm onAlert={setAlert} />}
        </div>
      </div>
    </div>
  );
}
