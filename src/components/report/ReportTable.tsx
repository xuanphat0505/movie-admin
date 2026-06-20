import { Eye } from "lucide-react";
import { ErrorReport } from "@/app/reports/page";

interface ReportTableProps {
  reports: ErrorReport[];
  onOpenDetail: (report: ErrorReport) => void;
}

// Component hiển thị bảng danh sách các báo cáo lỗi từ người dùng
export default function ReportTable({ reports, onOpenDetail }: ReportTableProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl dark:bg-slate-900/40 dark:border-slate-900/60 overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100/50 dark:border-slate-800/50 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">Mã / Tên Phim</th>
              <th className="px-6 py-4">Tập phim</th>
              <th className="px-6 py-4">Loại sự cố</th>
              <th className="px-6 py-4">Người báo cáo</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-slate-100/40 dark:border-slate-800/40 hover:bg-slate-50/30 dark:hover:bg-slate-800/30 text-xs transition-colors"
                >
                  {/* Mã & Tên phim */}
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 dark:text-white">
                      {report.movieName}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                      {report.id}
                    </span>
                  </td>

                  {/* Tập phim */}
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
                    {report.episode}
                  </td>

                  {/* Loại sự cố */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        report.errorType === "link"
                          ? "bg-rose-500/10 text-rose-500"
                          : report.errorType === "lag"
                            ? "bg-amber-500/10 text-amber-500"
                            : report.errorType === "subtitle"
                              ? "bg-indigo-500/10 text-indigo-500"
                              : report.errorType === "copyright"
                                ? "bg-purple-500/10 text-purple-500"
                                : "bg-slate-500/10 text-slate-500"
                      }`}
                    >
                      {report.errorType === "link"
                        ? "Hỏng Link"
                        : report.errorType === "lag"
                          ? "Giật Lag"
                          : report.errorType === "subtitle"
                            ? "Lỗi Sub"
                            : report.errorType === "copyright"
                              ? "Bản Quyền"
                              : "Khác"}
                    </span>
                  </td>

                  {/* Người báo cáo */}
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-700 dark:text-slate-350">
                      {report.reportedBy}
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                      {report.email}
                    </span>
                  </td>

                  {/* Trạng thái xử lý */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          report.status === "pending"
                            ? "bg-rose-500 animate-pulse"
                            : report.status === "resolving"
                              ? "bg-amber-550"
                              : report.status === "resolved"
                                ? "bg-emerald-500"
                                : "bg-slate-500"
                        }`}
                      />
                      <span
                        className={`font-bold capitalize ${
                          report.status === "pending"
                            ? "text-rose-500"
                            : report.status === "resolving"
                              ? "text-amber-500"
                              : report.status === "resolved"
                                ? "text-emerald-500"
                                : "text-slate-500"
                        }`}
                      >
                        {report.status === "pending"
                          ? "Chưa xử lý"
                          : report.status === "resolving"
                            ? "Đang sửa"
                            : report.status === "resolved"
                              ? "Đã khắc phục"
                              : "Bỏ qua"}
                      </span>
                    </div>
                  </td>

                  {/* Thao tác chỉnh sửa */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onOpenDetail(report)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-[#ff8300] bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                    >
                      <Eye size={12} />
                      <span>Xem chi tiết</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-12 text-slate-400 dark:text-slate-500"
                >
                  Không có báo cáo sự cố nào khớp với bộ lọc.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
