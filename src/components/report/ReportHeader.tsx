import { BarChart3, Download, PlusCircle } from "lucide-react";
import { PageHeader } from "@/components/common";

interface ReportHeaderProps {
  onExportCSV: () => void;
  onOpenCreateModal: () => void;
}

// Component hiển thị tiêu đề trang Báo cáo & Thống kê cùng các nút hành động xuất dữ liệu, tạo báo cáo mới
export default function ReportHeader({
  onExportCSV,
  onOpenCreateModal,
}: ReportHeaderProps) {
  const actionButton = (
    <div className="flex items-center gap-3">
      {/* Nút Xuất CSV */}
      <button
        onClick={onExportCSV}
        className="flex items-center gap-2 bg-white hover:bg-slate-50 dark:bg-slate-900/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
      >
        <Download size={15} />
        <span>Xuất CSV</span>
      </button>

      {/* Nút Tạo báo cáo lỗi */}
      <button
        onClick={onOpenCreateModal}
        className="flex items-center gap-2 bg-[#ff8300] hover:bg-[#e07300] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
      >
        <PlusCircle size={15} />
        <span>Tạo báo cáo lỗi</span>
      </button>
    </div>
  );

  return (
    <PageHeader
      title="Báo cáo & Thống kê"
      description="Phân tích số liệu tương tác hệ thống và quản trị các lỗi/phản hồi từ người xem."
      icon={BarChart3}
      actionButton={actionButton}
    />
  );
}
