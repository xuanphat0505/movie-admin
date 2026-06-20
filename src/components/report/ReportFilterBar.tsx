import { FileText, Filter, Clock } from "lucide-react";

interface ReportFilterBarProps {
  typeFilter: string;
  setTypeFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  pendingCount: number;
  resolvingCount: number;
  resolvedCount: number;
}

// Component chứa bộ lọc báo cáo sự cố và tiêu đề mục phản hồi người dùng
export default function ReportFilterBar({
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  pendingCount,
  resolvingCount,
  resolvedCount,
}: ReportFilterBarProps) {
  return (
    <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      <div>
        <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <FileText className="text-[#ff8300]" size={18} />
          <span>Báo cáo sự cố lỗi phim</span>
        </h2>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
          Tổng hợp các phản ánh về chất lượng video, lỗi link tập, sai phụ đề do người xem gửi lên.
        </p>
      </div>

      {/* Hàng bộ lọc báo cáo */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Lọc theo Loại lỗi */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-white border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 rounded-xl px-3 h-[38px]">
          <Filter size={12} />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-transparent border-none text-slate-650 dark:text-slate-350 focus:outline-none cursor-pointer"
          >
            <option value="all">Mọi loại sự cố</option>
            <option value="link">Lỗi hỏng Link</option>
            <option value="lag">Giật lag video</option>
            <option value="subtitle">Lỗi phụ đề</option>
            <option value="copyright">Khiếu nại bản quyền</option>
            <option value="other">Lỗi khác</option>
          </select>
        </div>

        {/* Lọc theo Trạng thái xử lý */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-white border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 rounded-xl px-3 h-[38px]">
          <Clock size={12} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border-none text-slate-650 dark:text-slate-350 focus:outline-none cursor-pointer"
          >
            <option value="all">Mọi trạng thái</option>
            <option value="pending">Chưa xử lý ({pendingCount})</option>
            <option value="resolving">Đang sửa ({resolvingCount})</option>
            <option value="resolved">Đã xong ({resolvedCount})</option>
            <option value="dismissed">Đã bỏ qua</option>
          </select>
        </div>
      </div>
    </div>
  );
}
