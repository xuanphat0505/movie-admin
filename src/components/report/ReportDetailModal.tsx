import { AlertCircle, Clock, CheckCircle2, Ban } from "lucide-react";
import Modal from "@/components/common/Modal";
import { ErrorReport } from "@/app/reports/page";

interface ReportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ErrorReport | null;
  onUpdateStatus: (id: string, newStatus: ErrorReport["status"]) => void;
  onSave: () => void;
}

// Component hiển thị Modal xem chi tiết và cập nhật trạng thái báo cáo lỗi
export default function ReportDetailModal({
  isOpen,
  onClose,
  report,
  onUpdateStatus,
  onSave,
}: ReportDetailModalProps) {
  if (!report) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Báo cáo: ${report.id}`}
      size="md"
    >
      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 block">Tên phim</span>
            <span className="font-bold text-slate-800 dark:text-white text-sm">
              {report.movieName}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Tập phim</span>
            <span className="font-bold text-slate-800 dark:text-white text-sm">
              {report.episode}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] text-slate-400 block">Người báo cáo</span>
            <span className="font-semibold text-slate-750 dark:text-slate-300">
              {report.reportedBy}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Email liên hệ</span>
            <span className="font-semibold text-slate-750 dark:text-slate-300">
              {report.email}
            </span>
          </div>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 block">
            Nội dung mô tả sự cố
          </span>
          <p className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-330 mt-1 leading-relaxed">
            {report.description}
          </p>
        </div>

        {/* Bộ điều khiển trạng thái sự cố */}
        <div className="pt-2">
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Cập nhật trạng thái xử lý lỗi:
          </label>
          <div className="flex flex-wrap gap-2.5">
            {/* Nút Pending */}
            <button
              type="button"
              onClick={() => onUpdateStatus(report.id, "pending")}
              className={`px-3 py-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                report.status === "pending"
                  ? "bg-rose-500/10 text-rose-500 border-rose-500/50"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700"
              }`}
            >
              <AlertCircle size={12} className="inline mr-1 -mt-0.5" />
              Chưa xử lý
            </button>

            {/* Nút Resolving */}
            <button
              type="button"
              onClick={() => onUpdateStatus(report.id, "resolving")}
              className={`px-3 py-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                report.status === "resolving"
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/50"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700"
              }`}
            >
              <Clock size={12} className="inline mr-1 -mt-0.5" />
              Đang sửa
            </button>

            {/* Nút Resolved */}
            <button
              type="button"
              onClick={() => onUpdateStatus(report.id, "resolved")}
              className={`px-3 py-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                report.status === "resolved"
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/50"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700"
              }`}
            >
              <CheckCircle2 size={12} className="inline mr-1 -mt-0.5" />
              Đã khắc phục
            </button>

            {/* Nút Dismissed */}
            <button
              type="button"
              onClick={() => onUpdateStatus(report.id, "dismissed")}
              className={`px-3 py-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                report.status === "dismissed"
                  ? "bg-slate-500/10 text-slate-550 border-slate-400/50"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700"
              }`}
            >
              <Ban size={12} className="inline mr-1 -mt-0.5" />
              Bỏ qua
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
          <button
            type="button"
            onClick={onSave}
            className="px-5 py-2 bg-[#ff8300] hover:bg-[#e07300] text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            Hoàn tất & Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
}
