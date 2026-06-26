import { PageHeader } from "@/components/common";
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
      <PageHeader
        title="Dashboard Overview"
        description="Chào mừng bạn quay trở lại, Noir Admin! Dưới đây là hoạt động hệ thống hôm nay."
      />

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
