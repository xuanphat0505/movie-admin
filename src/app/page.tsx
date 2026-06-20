import { Plus } from "lucide-react";
import {
  StatCards,
  ViewsChart,
  GenderChart,
  NewMoviesTable,
} from "@/components/dashboard";

// Trang chủ Dashboard tổng quan hệ thống quản trị website phim
export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      {/* Dashboard Top Header Title & Actions */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Chào mừng bạn quay trở lại, Noir Admin! Dưới đây là hoạt động hệ
            thống hôm nay.
          </p>
        </div>

        {/* Nút tác vụ nhanh: Thêm phim mới */}
        <button className="bg-[#ff8300] hover:bg-[#ff8300]/90 text-white font-semibold text-xs py-2.5 px-4.5 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-[#ff8300]/10 cursor-pointer">
          <Plus size={16} />
          <span>Add New Movie</span>
        </button>
      </div>

      {/* 4 Thẻ thống kê chính */}
      <StatCards />

      {/* Hàng chứa biểu đồ lượt xem và tỷ lệ danh mục */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8 items-stretch">
        <ViewsChart />
        <GenderChart />
      </div>

      {/* Bảng phim cập nhật gần đây */}
      <NewMoviesTable />
    </div>
  );
}
