import React, { useState } from "react";
import { Loader2, Save, Eye, EyeOff } from "lucide-react";
import { authApi } from "@/apis/authApi";
import { toast } from "@/utils/toast";

interface SecurityFormProps {
  currentAdmin: any;
}

// Component chứa biểu mẫu thay đổi mật khẩu của quản trị viên
export default function SecurityForm({
  currentAdmin,
}: SecurityFormProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Gọi API thay đổi mật khẩu mới
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAdmin?._id) return;

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Mật khẩu xác nhận không trùng khớp!");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải dài tối thiểu 6 ký tự!");
      return;
    }

    setLoading(true);

    try {
      const res = await authApi.updateProfile(currentAdmin._id, {
        password: passwordForm.newPassword,
        currentPassword: passwordForm.currentPassword,
      });

      if (res.data?.success) {
        toast.success("Thay đổi mật khẩu tài khoản thành công!");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error: any) {
      console.error("Lỗi đổi mật khẩu:", error);
      toast.error(error.response?.data?.message || "Lỗi thay đổi mật khẩu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSavePassword} className="space-y-6 text-xs">
      <div className="border-b border-slate-100 dark:border-slate-800/50 pb-4 mb-4">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white">
          Bảo mật & Mật khẩu
        </h3>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Đổi mật khẩu tài khoản để giữ an toàn tối đa cho Control Panel.
        </p>
      </div>

      <div className="space-y-4 max-w-md">
        {/* Mật khẩu cũ */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-355 mb-1.5">
            Mật khẩu cũ *
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? "text" : "password"}
              required
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  currentPassword: e.target.value,
                })
              }
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
              placeholder="Nhập mật khẩu đang sử dụng"
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords({
                  ...showPasswords,
                  current: !showPasswords.current,
                })
              }
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showPasswords.current ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Mật khẩu mới */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-355 mb-1.5">
            Mật khẩu mới *
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? "text" : "password"}
              required
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
              placeholder="Tối thiểu 6 ký tự"
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords({ ...showPasswords, new: !showPasswords.new })
              }
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-455 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showPasswords.new ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Xác nhận mật khẩu mới */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-355 mb-1.5">
            Xác nhận mật khẩu mới *
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              required
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
              placeholder="Nhập lại mật khẩu mới"
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords({
                  ...showPasswords,
                  confirm: !showPasswords.confirm,
                })
              }
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-455 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showPasswords.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
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
          Đổi mật khẩu
        </button>
      </div>
    </form>
  );
}
