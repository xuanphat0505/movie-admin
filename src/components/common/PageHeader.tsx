import React from "react";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionButton?: React.ReactNode;
}

// Component PageHeader dùng chung cho các tiêu đề trang quản trị hệ thống
export default function PageHeader({
  title,
  description,
  icon: Icon,
  actionButton,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          {Icon && <Icon className="text-[#ff8300] shrink-0" size={24} />}
          <span>{title}</span>
        </h1>
        {description && (
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>

      {actionButton && (
        <div className="flex items-center gap-3 shrink-0">{actionButton}</div>
      )}
    </div>
  );
}
