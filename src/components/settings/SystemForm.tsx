import React, { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "@/utils/toast";
import { settingApi, SystemSettings } from "@/apis/settingApi";

interface SystemFormProps {}

// Component chứa biểu mẫu cấu hình hệ thống bao gồm thông tin bảo trì, hotline, facebook, số bài hiển thị
export default function SystemForm({}: SystemFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);

  const [systemForm, setSystemForm] = useState<SystemSettings>({
    maintenanceMode: false,
    pageLimit: 12,
    hotline: "",
    facebookUrl: "",
  });

  // tải dữ liệu cấu hình hệ thống 
  useEffect(() => {
    const fetchSystemConfig = async () => {
      try {
        const config = await settingApi.getSettings();
        setSystemForm(config);
      } catch (error: any) {
        console.error("Lỗi tải cấu hình hệ thống:", error);
        toast.error("Không thể tải cấu hình hệ thống từ máy chủ!");
      } finally {
        setFetching(false);
      }
    };
    fetchSystemConfig();
  }, []);

  // lưu cấu hình hệ thống mới
  const handleSaveSystemConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = await settingApi.updateSettings(systemForm);
      setSystemForm(config);
      toast.success("Đã lưu cấu hình vận hành hệ thống thành công!");
    } catch (error: any) {
      console.error("Lỗi lưu cấu hình hệ thống:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi lưu cấu hình!"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="animate-spin text-[#ff8300] mb-2" size={24} />
        <span className="text-slate-400 text-xs">Đang tải cấu hình hệ thống...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSaveSystemConfig} className="space-y-6 text-xs">
      <div className="border-b border-slate-100 dark:border-slate-800/50 pb-4 mb-4">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white">
          Cấu hình hệ thống
        </h3>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Thiết lập các chế độ và tham số môi trường của website phim.
        </p>
      </div>

      <div className="space-y-5">
        {/* Maintenance Mode Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/20 border border-slate-150 dark:border-slate-800/50">
          <div className="space-y-1">
            <span className="font-bold text-slate-800 dark:text-white block">
              Chế độ bảo trì hệ thống
            </span>
            <span className="text-[10px] text-slate-400 block max-w-md leading-relaxed">
              Khi kích hoạt, trang xem phim bên phía client sẽ chuyển sang màn hình
              bảo trì tạm thời. Admin vẫn có quyền truy cập quản trị.
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              setSystemForm((prev) => ({
                ...prev,
                maintenanceMode: !prev.maintenanceMode,
              }))
            }
            className={`w-11 h-6 rounded-full transition-all relative shrink-0 cursor-pointer ${
              systemForm.maintenanceMode
                ? "bg-[#ff8300]"
                : "bg-slate-200 dark:bg-slate-700"
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                systemForm.maintenanceMode ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Page limit */}
          <div className="col-span-1">
            <label className="block font-bold text-slate-700 dark:text-slate-355 mb-1.5">
              Số phim hiển thị / trang
            </label>
            <input
              type="number"
              required
              value={systemForm.pageLimit}
              onChange={(e) =>
                setSystemForm({
                  ...systemForm,
                  pageLimit: parseInt(e.target.value) || 12,
                })
              }
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
            />
          </div>

          {/* Hotline */}
          <div className="col-span-1">
            <label className="block font-bold text-slate-700 dark:text-slate-355 mb-1.5">
              Hotline hỗ trợ kỹ thuật
            </label>
            <input
              type="text"
              required
              value={systemForm.hotline}
              onChange={(e) =>
                setSystemForm({ ...systemForm, hotline: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
            />
          </div>

          {/* Facebook url */}
          <div className="col-span-1">
            <label className="block font-bold text-slate-700 dark:text-slate-355 mb-1.5">
              Liên kết Facebook Fanpage
            </label>
            <input
              type="text"
              required
              value={systemForm.facebookUrl}
              onChange={(e) =>
                setSystemForm({ ...systemForm, facebookUrl: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end border-t border-slate-100 dark:border-slate-800/50 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1.5 bg-[#ff8300] hover:bg-[#e07300] text-white font-bold px-5 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-40"
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Save size={14} />
          )}
          Lưu cấu hình hệ thống
        </button>
      </div>
    </form>
  );
}
