import React, { useState, useEffect, useRef } from "react";
import { User, Loader2, Upload, Save } from "lucide-react";
import { authApi } from "@/apis/authApi";
import { toast } from "@/utils/toast";

interface ProfileFormProps {
  currentAdmin: any;
  onProfileUpdate: (updatedAdmin: any) => void;
}

// Component chứa biểu mẫu cập nhật thông tin hồ sơ và ảnh đại diện của quản trị viên
export default function ProfileForm({
  currentAdmin,
  onProfileUpdate,
}: ProfileFormProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  // Khai báo ref cho thẻ input file upload ẩn
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
    phone: "",
    gender: "male",
    avatar: "",
    department: "N/A",
    position: "N/A",
  });

  // Tự động gán dữ liệu ban đầu khi thông tin admin thay đổi
  useEffect(() => {
    if (currentAdmin) {
      setProfileForm({
        username: currentAdmin.username || "",
        email: currentAdmin.email || "",
        phone: currentAdmin.phone || "",
        gender: currentAdmin.gender || "male",
        avatar: currentAdmin.avatar || "",
        department: currentAdmin.adminInfo?.department || "Chưa phân bộ phận",
        position: currentAdmin.adminInfo?.position || "Quản trị viên",
      });
    }
  }, [currentAdmin]);

  // Kích hoạt input file
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Upload file avatar lên Cloudinary
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast.error("Kích thước ảnh đại diện không được vượt quá 3MB!");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    setUploading(true);

    try {
      const res = await authApi.uploadAvatar(formData);
      if (res.data?.success && res.data?.url) {
        setProfileForm((prev) => ({ ...prev, avatar: res.data.url }));
        toast.success("Tải ảnh đại diện lên thành công!");
      } else {
        toast.error(res.data?.message || "Tải ảnh lên thất bại.");
      }
    } catch (error: any) {
      console.error("Lỗi upload avatar:", error);
      toast.error(
        error.response?.data?.message || "Lỗi đường truyền tải ảnh!"
      );
    } finally {
      setUploading(false);
    }
  };

  // Gửi API cập nhật thông tin cá nhân
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAdmin?._id) return;

    setLoading(true);

    try {
      const payload = {
        username: profileForm.username,
        email: profileForm.email,
        phone: profileForm.phone,
        gender: profileForm.gender,
        avatar: profileForm.avatar,
      };

      const res = await authApi.updateProfile(currentAdmin._id, payload);

      if (res.data?.success && res.data?.data) {
        const updatedAdmin = res.data.data;
        onProfileUpdate(updatedAdmin);

        toast.success(
          "Cập nhật hồ sơ cá nhân thành công! Giao diện sẽ tải lại để áp dụng..."
        );

        // Tải lại trang để đồng bộ ảnh đại diện trên Header & Sidebar
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error: any) {
      console.error("Lỗi cập nhật hồ sơ:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi lưu hồ sơ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
      <div className="border-b border-slate-100 dark:border-slate-800/50 pb-4 mb-4">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white">
          Hồ sơ cá nhân
        </h3>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Cập nhật ảnh đại diện và các trường thông tin cơ bản liên hệ.
        </p>
      </div>

      {/* Upload Avatar */}
      <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50 dark:bg-slate-800/20 p-4 rounded-2xl border border-slate-150 dark:border-slate-800/50">
        <div className="relative w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
          {profileForm.avatar ? (
            <img
              src={profileForm.avatar}
              alt="Avatar Admin"
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={32} className="text-slate-400" />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Loader2 className="animate-spin text-white" size={20} />
            </div>
          )}
        </div>

        <div className="text-center sm:text-left space-y-2">
          <div className="text-xs font-bold text-slate-800 dark:text-white">
            Ảnh đại diện tài khoản
          </div>
          <p className="text-[10px] text-slate-400">
            Định dạng hỗ trợ JPG, PNG, WEBP kích thước tối đa 3MB.
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarUpload}
            accept="image/*"
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
            <button
              type="button"
              disabled={uploading}
              onClick={triggerFileInput}
              className="flex items-center gap-1.5 bg-[#ff8300]/10 hover:bg-[#ff8300]/20 text-[#ff8300] font-bold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-40"
            >
              <Upload size={13} />
              Tải lên ảnh mới
            </button>
            {profileForm.avatar && (
              <button
                type="button"
                onClick={() => setProfileForm((prev) => ({ ...prev, avatar: "" }))}
                className="bg-slate-100 hover:bg-slate-200 text-slate-650 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
              >
                Gỡ bỏ
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Nhập URL trực tiếp */}
      <div>
        <label className="block font-bold text-slate-700 dark:text-slate-355 mb-1.5">
          Hoặc nhập URL ảnh đại diện:
        </label>
        <input
          type="text"
          value={profileForm.avatar}
          onChange={(e) =>
            setProfileForm({ ...profileForm, avatar: e.target.value })
          }
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
          placeholder="https://example.com/avatar.png"
        />
      </div>

      {/* Thông tin đầu vào */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-355 mb-1.5">
            Tên tài khoản (Username) *
          </label>
          <input
            type="text"
            required
            value={profileForm.username}
            onChange={(e) =>
              setProfileForm({ ...profileForm, username: e.target.value })
            }
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-355 mb-1.5">
            Email liên hệ *
          </label>
          <input
            type="email"
            required
            value={profileForm.email}
            onChange={(e) =>
              setProfileForm({ ...profileForm, email: e.target.value })
            }
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-355 mb-1.5">
            Số điện thoại
          </label>
          <input
            type="text"
            value={profileForm.phone}
            onChange={(e) =>
              setProfileForm({ ...profileForm, phone: e.target.value })
            }
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
            placeholder="Chưa cập nhật số điện thoại"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-355 mb-1.5">
            Giới tính
          </label>
          <select
            value={profileForm.gender}
            onChange={(e) =>
              setProfileForm({ ...profileForm, gender: e.target.value })
            }
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors cursor-pointer"
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>
      </div>

      {/* Thông tin phòng ban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/10 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
        <div>
          <span className="text-[10px] text-slate-400 block mb-0.5">
            Quyền hạn hệ thống
          </span>
          <span className="font-bold text-rose-500 uppercase flex items-center gap-1.5">
            {currentAdmin?.adminInfo?.isSuper ? "Super Admin" : "Quản trị viên"}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block mb-0.5">
            Phòng ban hoạt động
          </span>
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {profileForm.department}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block mb-0.5">
            Chức vụ phụ trách
          </span>
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {profileForm.position}
          </span>
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
          Lưu thay đổi
        </button>
      </div>
    </form>
  );
}
