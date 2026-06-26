import React from "react";
import { User, Lock, Bell, Settings2 } from "lucide-react";

export type TabId = "profile" | "security" | "notifications" | "system";

export interface SettingTab {
  id: TabId;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

export const SETTINGS_TABS: SettingTab[] = [
  {
    id: "profile",
    title: "Hồ sơ cá nhân",
    description: "Cập nhật thông tin định danh và ảnh đại diện của bạn",
    icon: User,
  },
  {
    id: "security",
    title: "Bảo mật & Mật khẩu",
    description: "Đổi mật khẩu và thiết lập bảo vệ tài khoản",
    icon: Lock,
  },
  {
    id: "notifications",
    title: "Cấu hình nhận thông báo",
    description: "Lựa chọn kênh nhận thông báo tự động",
    icon: Bell,
  },
  {
    id: "system",
    title: "Cấu hình hệ thống",
    description: "Bảo trì và các tham số vận hành chung của website",
    icon: Settings2,
  },
];

interface SettingsTabsProps {
  activeTab: TabId;
  setActiveTab: (id: TabId) => void;
  onTabChange?: () => void;
}

// Component chứa danh sách các tab điều hướng cấu hình bên trái trang Settings
export default function SettingsTabs({
  activeTab,
  setActiveTab,
  onTabChange,
}: SettingsTabsProps) {
  return (
    <div className="lg:col-span-1 flex flex-col gap-2">
      {SETTINGS_TABS.map((tab) => {
        const TabIcon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (onTabChange) onTabChange();
            }}
            className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
              isActive
                ? "bg-[#ff8300]/10 border-[#ff8300]/30 text-[#ff8300]"
                : "bg-white border-slate-200/80 hover:bg-slate-50 text-slate-600 dark:bg-slate-900/40 dark:border-slate-900/60 dark:hover:bg-slate-800/40 dark:text-slate-400"
            }`}
          >
            <TabIcon size={18} className="shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="font-bold text-xs">{tab.title}</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate leading-relaxed">
                {tab.description}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
