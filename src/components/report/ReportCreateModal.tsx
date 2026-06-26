import { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import { ErrorReport } from "@/app/reports/page";
import { toast } from "@/utils/toast";

interface ReportCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (reportData: Omit<ErrorReport, "id" | "status" | "createdAt">) => void;
}

// Component chứa Modal nhập thông tin tạo báo cáo lỗi phim mới
export default function ReportCreateModal({
  isOpen,
  onClose,
  onCreate,
}: ReportCreateModalProps) {
  const [newReportData, setNewReportData] = useState({
    movieName: "",
    episode: "",
    errorType: "link" as ErrorReport["errorType"],
    reportedBy: "",
    email: "",
    description: "",
  });

  // Reset form khi mở Modal
  useEffect(() => {
    if (isOpen) {
      setNewReportData({
        movieName: "",
        episode: "",
        errorType: "link",
        reportedBy: "",
        email: "",
        description: "",
      });
    }
  }, [isOpen]);

  // Xử lý gửi sự kiện thêm lỗi lên component cha
  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newReportData.movieName ||
      !newReportData.reportedBy ||
      !newReportData.email
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    onCreate(newReportData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tạo báo cáo lỗi mới"
      size="md"
    >
      <form onSubmit={handleCreateReport} className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-4">
          {/* Tên Phim */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-350 mb-1.5">
              Tên phim bị lỗi *
            </label>
            <input
              type="text"
              required
              value={newReportData.movieName}
              onChange={(e) =>
                setNewReportData({ ...newReportData, movieName: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
              placeholder="Ví dụ: Đấu La Đại Lục"
            />
          </div>

          {/* Tập Phim */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-350 mb-1.5">
              Tập phim bị lỗi
            </label>
            <input
              type="text"
              value={newReportData.episode}
              onChange={(e) =>
                setNewReportData({ ...newReportData, episode: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
              placeholder="Ví dụ: Tập 25 hoặc Full Movie"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Loại sự cố */}
          <div className="col-span-1">
            <label className="block font-bold text-slate-700 dark:text-slate-350 mb-1.5">
              Loại sự cố
            </label>
            <select
              value={newReportData.errorType}
              onChange={(e) =>
                setNewReportData({
                  ...newReportData,
                  errorType: e.target.value as any,
                })
              }
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors cursor-pointer"
            >
              <option value="link">Hỏng Link</option>
              <option value="lag">Giật Lag</option>
              <option value="subtitle">Lỗi phụ đề</option>
              <option value="copyright">Bản Quyền</option>
              <option value="other">Khác</option>
            </select>
          </div>

          {/* Người báo cáo */}
          <div className="col-span-1">
            <label className="block font-bold text-slate-700 dark:text-slate-350 mb-1.5">
              Họ và tên *
            </label>
            <input
              type="text"
              required
              value={newReportData.reportedBy}
              onChange={(e) =>
                setNewReportData({
                  ...newReportData,
                  reportedBy: e.target.value,
                })
              }
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
              placeholder="Nhập tên người gửi"
            />
          </div>

          {/* Email */}
          <div className="col-span-1">
            <label className="block font-bold text-slate-700 dark:text-slate-350 mb-1.5">
              Email liên hệ *
            </label>
            <input
              type="email"
              required
              value={newReportData.email}
              onChange={(e) =>
                setNewReportData({ ...newReportData, email: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
              placeholder="email@example.com"
            />
          </div>
        </div>

        {/* Mô tả chi tiết */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-350 mb-1.5">
            Chi tiết mô tả lỗi *
          </label>
          <textarea
            required
            rows={3}
            value={newReportData.description}
            onChange={(e) =>
              setNewReportData({
                ...newReportData,
                description: e.target.value,
              })
            }
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors resize-none"
            placeholder="Nhập mô tả lỗi chi tiết phát hiện được..."
          />
        </div>

        {/* Footer buttons */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-350 border border-slate-200 dark:border-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#ff8300] hover:bg-[#e07300] text-white rounded-xl font-bold shadow-sm transition-colors cursor-pointer"
          >
            Tạo báo cáo
          </button>
        </div>
      </form>
    </Modal>
  );
}
