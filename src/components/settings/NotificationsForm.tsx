import React, { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import { authApi } from "@/apis/authApi";
import { toast } from "@/utils/toast";

interface NotificationsFormProps {
  currentAdmin: any;
}

// Component chứa biểu mẫu cấu hình kênh thông báo nhận tin của quản trị viên
export default function NotificationsForm({
  currentAdmin,
}: NotificationsFormProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const [notifyForm, setNotifyForm] = useState({
    mail: true,
    desktop: true,
  });

  // Tự động gán cấu hình nhận thông báo ban đầu của tài khoản
  useEffect(() => {
    if (currentAdmin) {
      setNotifyForm({
        mail: currentAdmin.adminInfo?.notificationOptions?.mail ?? true,
        desktop: currentAdmin.adminInfo?.notificationOptions?.desktop ?? true,
      });
    }
  }, [currentAdmin]);

  // Gửi API lưu cài đặt thông báo
  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAdmin?._id) return;

    setLoading(true);

    try {
      const payload = {
        adminInfo: {
          notificationOptions: {
            mail: notifyForm.mail,
            desktop: notifyForm.desktop,
          },
        },
      };

      const res = await authApi.updateProfile(currentAdmin._id, payload);

      if (res.data?.success && res.data?.data) {
        localStorage.setItem("adminUser", JSON.stringify(res.data.data));
        toast.success("Đã lưu cài đặt thông báo thành công!");
      }
    } catch (error: any) {
      console.error("Lỗi lưu cấu hình thông báo:", error);
      toast.error(
        error.response?.data?.message || "Lỗi lưu cấu hình thông báo!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSaveNotifications} className="space-y-6 text-xs">
      <div className="border-b border-slate-100 dark:border-slate-800/50 pb-4 mb-4">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white">
          Cấu hình nhận thông báo
        </h3>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Tùy chỉnh các kênh và loại sự kiện hệ thống gửi thông báo cho bạn.
        </p>
      </div>

      <div className="space-y-5">
        {/* Email Alert Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/20 border border-slate-150 dark:border-slate-800/50">
          <div className="space-y-1">
            <span className="font-bold text-slate-800 dark:text-white block">
              Thông báo qua Email
            </span>
            <span className="text-[10px] text-slate-400 block max-w-md leading-relaxed">
              Nhận thông tin qua hòm thư điện tử đăng ký khi hệ thống có tài khoản
              mới được kích hoạt hoặc phát sinh sự cố khẩn cấp.
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              setNotifyForm((prev) => ({ ...prev, mail: !prev.mail }))
            }
            className={`w-11 h-6 rounded-full transition-all relative shrink-0 cursor-pointer ${
              notifyForm.mail ? "bg-[#ff8300]" : "bg-slate-200 dark:bg-slate-700"
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                notifyForm.mail ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>

        {/* Desktop Realtime Notification Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/20 border border-slate-150 dark:border-slate-800/50">
          <div className="space-y-1">
            <span className="font-bold text-slate-800 dark:text-white block">
              Thông báo đẩy Desktop (Realtime)
            </span>
            <span className="text-[10px] text-slate-400 block max-w-md leading-relaxed">
              Nhận thông báo nổi trực tiếp trên màn hình Dashboard ngay khi người
              dùng đăng ký hoặc thêm phim mới qua socket.io.
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              setNotifyForm((prev) => ({ ...prev, desktop: !prev.desktop }))
            }
            className={`w-11 h-6 rounded-full transition-all relative shrink-0 cursor-pointer ${
              notifyForm.desktop
                ? "bg-[#ff8300]"
                : "bg-slate-200 dark:bg-slate-700"
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                notifyForm.desktop ? "left-6" : "left-1"
              }`}
            />
          </button>
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
          Lưu thiết lập
        </button>
      </div>
    </form>
  );
}
