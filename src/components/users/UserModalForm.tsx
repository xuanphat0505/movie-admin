import { useState, useEffect } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Modal from "@/components/common/Modal";
import { UserType } from "@/app/users/page";
import { userApi } from "@/apis/userApi";

interface UserModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingUser: UserType | null;
  onSuccess: () => void;
}

// Component chứa Modal biểu mẫu thêm hoặc sửa thông tin tài khoản người dùng
export default function UserModalForm({
  isOpen,
  onClose,
  editingUser,
  onSuccess,
}: UserModalFormProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    gender: "male" as "male" | "female" | "other",
    role: "user" as "user" | "admin",
    status: "active" as "active" | "banned",
    avatar: "",
    position: "Staff",
    department: "General",
    notes: "",
  });

  // Reset form và thiết lập dữ liệu ban đầu khi mở Modal
  useEffect(() => {
    if (isOpen) {
      setFormError("");
      setShowPassword(false);
      if (editingUser) {
        setFormData({
          username: editingUser.username || "",
          email: editingUser.email || "",
          password: "",
          phone: editingUser.phone || "",
          gender: editingUser.gender || "male",
          role: editingUser.role || "user",
          status: editingUser.status || "active",
          avatar: editingUser.avatar || "",
          position: editingUser.adminInfo?.position || "Staff",
          department: editingUser.adminInfo?.department || "General",
          notes: editingUser.adminInfo?.notes || "",
        });
      } else {
        setFormData({
          username: "",
          email: "",
          password: "",
          phone: "",
          gender: "male",
          role: "user",
          status: "active",
          avatar: "",
          position: "Staff",
          department: "General",
          notes: "",
        });
      }
    }
  }, [isOpen, editingUser]);

  // Xử lý submit gửi API thêm mới hoặc cập nhật tài khoản
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    if (!formData.username.trim() || !formData.email.trim()) {
      setFormError("Vui lòng nhập đầy đủ Tên tài khoản và Email");
      setSubmitting(false);
      return;
    }

    if (!editingUser && !formData.password) {
      setFormError("Vui lòng nhập mật khẩu cho tài khoản mới");
      setSubmitting(false);
      return;
    }

    try {
      const payload: any = {
        username: formData.username,
        email: formData.email,
        phone: formData.phone || undefined,
        gender: formData.gender,
        role: formData.role,
        status: formData.status,
        avatar: formData.avatar || undefined,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (formData.role === "admin") {
        payload.position = formData.position;
        payload.department = formData.department;
        payload.notes = formData.notes;
      }

      let res;
      if (editingUser) {
        res = await userApi.updateUser(editingUser._id, payload);
      } else {
        res = await userApi.addUser(payload);
      }

      if (res.data?.success) {
        onSuccess();
        onClose();
      } else {
        setFormError(res.data?.message || "Có lỗi xảy ra");
      }
    } catch (error: any) {
      console.error("Lỗi khi gửi biểu mẫu:", error);
      setFormError(error.response?.data?.message || "Lỗi máy chủ hệ thống");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        editingUser
          ? `Chỉnh sửa: ${editingUser.username}`
          : "Thêm tài khoản mới"
      }
      size="md"
    >
      <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
        {formError && (
          <div className="p-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl font-bold">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tên tài khoản */}
          <div>
            <label className="block font-bold text-slate-750 dark:text-slate-300 mb-1.5">
              Tên tài khoản *
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
              placeholder="Nhập tên tài khoản"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-bold text-slate-750 dark:text-slate-300 mb-1.5">
              Địa chỉ Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mật khẩu */}
          <div>
            <label className="block font-bold text-slate-750 dark:text-slate-300 mb-1.5">
              {editingUser
                ? "Mật khẩu mới (bỏ trống nếu giữ nguyên)"
                : "Mật khẩu *"}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
                placeholder={
                  editingUser ? "••••••••" : "Nhập mật khẩu tài khoản"
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-650 transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block font-bold text-slate-750 dark:text-slate-300 mb-1.5">
              Số điện thoại
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
              placeholder="Nhập số điện thoại"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Giới tính */}
          <div>
            <label className="block font-bold text-slate-750 dark:text-slate-300 mb-1.5">
              Giới tính
            </label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value as any })
              }
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors cursor-pointer"
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          {/* Quyền hạn */}
          <div>
            <label className="block font-bold text-slate-750 dark:text-slate-300 mb-1.5">
              Quyền hạn
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value as any })
              }
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors cursor-pointer"
            >
              <option value="user">Người dùng (User)</option>
              <option value="admin">Quản trị viên (Admin)</option>
            </select>
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block font-bold text-slate-750 dark:text-slate-300 mb-1.5">
              Trạng thái
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as any })
              }
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors cursor-pointer"
            >
              <option value="active">Hoạt động</option>
              <option value="banned">Bị khóa</option>
            </select>
          </div>
        </div>

        {/* Đường dẫn Avatar */}
        <div>
          <label className="block font-bold text-slate-750 dark:text-slate-300 mb-1.5">
            Đường dẫn ảnh đại diện (URL)
          </label>
          <input
            type="text"
            value={formData.avatar}
            onChange={(e) =>
              setFormData({ ...formData, avatar: e.target.value })
            }
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        {/* Các trường bổ sung nếu quyền hạn là Admin */}
        {formData.role === "admin" && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 rounded-2xl space-y-4">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Thông tin phòng ban quản trị
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Chức vụ
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
                  placeholder="Ví dụ: Staff, Manager"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Phòng ban
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
                  placeholder="Ví dụ: Content, Operations"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Ghi chú
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={2}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors resize-none"
                placeholder="Ghi chú thêm về nhân sự quản trị..."
              />
            </div>
          </div>
        )}

        {/* Thanh chân của Form */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#ff8300] hover:bg-[#e07300] text-white rounded-xl font-bold shadow-sm transition-colors disabled:opacity-40 cursor-pointer"
          >
            {submitting && <Loader2 className="animate-spin" size={14} />}
            <span>{editingUser ? "Cập nhật" : "Tạo tài khoản"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
