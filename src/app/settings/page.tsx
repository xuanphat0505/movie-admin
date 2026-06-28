"use client";

import { useState, useEffect } from "react";
import { Settings2 } from "lucide-react";
import { PageHeader } from "@/components/common";
import {
  SettingsTabs,
  ProfileForm,
  SecurityForm,
  MfaForm,
  NotificationsForm,
  SystemForm,
  TabId,
} from "@/components/settings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);

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

      {/* Grid chứa layout chia hai cột (Cột dọc Tab bên trái - Form bên phải) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* HÀNG CỘT TRÁI: DANH SÁCH CÁC TABS ĐIỀU HƯỚNG */}
        <SettingsTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* HÀNG CỘT PHẢI: FORM CẤU HÌNH TƯƠNG ỨNG VỚI TAB ĐANG CHỌN */}
        <div className="lg:col-span-3 bg-white border border-slate-200/85 dark:bg-slate-900/40 dark:border-slate-900/60 rounded-2xl p-6 shadow-sm">
          {activeTab === "profile" && (
            <ProfileForm
              currentAdmin={currentAdmin}
              onProfileUpdate={handleProfileUpdate}
            />
          )}

          {activeTab === "security" && (
            <SecurityForm
              currentAdmin={currentAdmin}
            />
          )}

          {activeTab === "mfa" && (
            <MfaForm
              currentAdmin={currentAdmin}
              onProfileUpdate={handleProfileUpdate}
            />
          )}

          {activeTab === "notifications" && (
            <NotificationsForm
              currentAdmin={currentAdmin}
            />
          )}

          {activeTab === "system" && <SystemForm />}
        </div>
      </div>
    </div>
  );
}
