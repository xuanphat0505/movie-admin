"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Lock,
  Bell,
  Settings2,
  Upload,
  Loader2,
  Save,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { authApi } from "@/apis/authApi";

// Định nghĩa kiểu dữ liệu cho một Tab cài đặt
interface SettingTab {
  id: "profile" | "security" | "notifications" | "system";
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

// Khai báo danh sách các Tabs cấu hình trong trang Settings
const SETTINGS_TABS: SettingTab[] = [
  {
    id: "profile",
    title: "Hồ sơ cá nhân",
    description: "Cập nhật thông tin định danh và ảnh đại diện của bạn",
    icon: User,
  },
  {
    id: "security",
    title: "Bảo mật & Mật khẩu",
    description: "Đổi mật khẩu và thiết lập bảo vệ tài khoản",
    icon: Lock,
  },
  {
    id: "notifications",
    title: "Cấu hình nhận thông báo",
    description: "Lựa chọn kênh nhận thông báo tự động",
    icon: Bell,
  },
  {
    id: "system",
    title: "Cấu hình hệ thống",
    description: "Bảo trì và các tham số vận hành chung của website",
    icon: Settings2,
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingTab["id"]>("profile");
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  // State thông báo thành công hoặc lỗi trên giao diện
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Khai báo ref cho thẻ input file upload ẩn
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States các trường của Form thông tin cá nhân
  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
    phone: "",
    gender: "male",
    avatar: "",
    department: "N/A",
    position: "N/A",
  });

  // States Form đổi mật khẩu
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

  // States Tùy chọn thông báo
  const [notifyForm, setNotifyForm] = useState({
    mail: true,
    desktop: true,
  });

  // States Cấu hình hệ thống chung (Giả lập)
  const [systemForm, setSystemForm] = useState({
    maintenanceMode: false,
    pageLimit: 12,
    hotline: "1900 6789",
    facebookUrl: "https://facebook.com/streamlab.vn",
  });

  // Tự động đọc dữ liệu tài khoản admin hiện tại từ localStorage khi mount component
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("adminUser");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setCurrentAdmin(parsed);
          setProfileForm({
            username: parsed.username || "",
            email: parsed.email || "",
            phone: parsed.phone || "",
            gender: parsed.gender || "male",
            avatar: parsed.avatar || "",
            department: parsed.adminInfo?.department || "Chưa phân bộ phận",
            position: parsed.adminInfo?.position || "Quản trị viên",
          });
          setNotifyForm({
            mail: parsed.adminInfo?.notificationOptions?.mail ?? true,
            desktop: parsed.adminInfo?.notificationOptions?.desktop ?? true,
          });
        } catch (e) {
          console.error("Lỗi khi giải mã thông tin admin:", e);
        }
      }
    }
  }, []);

  // Tự động ẩn thông báo alert sau 4 giây
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Xử lý sự kiện click để kích hoạt tải ảnh lên
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Gửi file ảnh lên server và lấy URL Cloudinary về cập nhật avatar
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Chỉ cho phép ảnh có kích thước dưới 3MB
    if (file.size > 3 * 1024 * 1024) {
      setAlert({ type: "error", message: "Kích thước ảnh đại diện không được vượt quá 3MB!" });
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    setUploading(true);
    setAlert(null);

    try {
      const res = await authApi.uploadAvatar(formData);
      if (res.data?.success && res.data?.url) {
        setProfileForm((prev) => ({ ...prev, avatar: res.data.url }));
        setAlert({ type: "success", message: "Tải ảnh đại diện lên thành công!" });
      } else {
        setAlert({ type: "error", message: res.data?.message || "Tải ảnh lên thất bại." });
      }
    } catch (error: any) {
      console.error("Lỗi upload avatar:", error);
      setAlert({ type: "error", message: error.response?.data?.message || "Lỗi đường truyền tải ảnh!" });
    } finally {
      setUploading(false);
    }
  };

  // Lưu thông tin cá nhân của admin
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAdmin?._id) return;

    setLoading(true);
    setAlert(null);

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
        // Đồng bộ dữ liệu admin mới vào localStorage
        const updatedAdmin = res.data.data;
        localStorage.setItem("adminUser", JSON.stringify(updatedAdmin));
        setCurrentAdmin(updatedAdmin);

        setAlert({ type: "success", message: "Cập nhật hồ sơ cá nhân thành công! Giao diện sẽ tải lại để áp dụng..." });

        // Tự động reload lại trang sau 1.5 giây để đồng bộ ảnh đại diện trên Header & Sidebar
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error: any) {
      console.error("Lỗi cập nhật hồ sơ:", error);
      setAlert({ type: "error", message: error.response?.data?.message || "Có lỗi xảy ra khi lưu hồ sơ." });
    } finally {
      setLoading(false);
    }
  };

  // Lưu mật khẩu bảo mật mới
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAdmin?._id) return;

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setAlert({ type: "error", message: "Mật khẩu xác nhận không trùng khớp!" });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setAlert({ type: "error", message: "Mật khẩu mới phải dài tối thiểu 6 ký tự!" });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      // Gửi request đổi mật khẩu lên API profile của admin
      const res = await authApi.updateProfile(currentAdmin._id, {
        password: passwordForm.newPassword,
        currentPassword: passwordForm.currentPassword,
      });

      if (res.data?.success) {
        setAlert({ type: "success", message: "Thay đổi mật khẩu tài khoản thành công!" });
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error: any) {
      console.error("Lỗi đổi mật khẩu:", error);
      setAlert({ type: "error", message: error.response?.data?.message || "Lỗi thay đổi mật khẩu!" });
    } finally {
      setLoading(false);
    }
  };

  // Lưu tùy chọn cấu hình kênh thông báo của admin
  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAdmin?._id) return;

    setLoading(true);
    setAlert(null);

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
        setAlert({ type: "success", message: "Đã lưu cài đặt thông báo thành công!" });
      }
    } catch (error: any) {
      console.error("Lỗi lưu cấu hình thông báo:", error);
      setAlert({ type: "error", message: error.response?.data?.message || "Lỗi lưu cấu hình thông báo!" });
    } finally {
      setLoading(false);
    }
  };

  // Lưu cấu hình hệ thống giả lập
  const handleSaveSystemConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    setTimeout(() => {
      setLoading(false);
      setAlert({ type: "success", message: "Đã lưu cấu hình vận hành hệ thống thành công (Mô phỏng)!" });
    }, 800);
  };

  return (
    <div className="flex flex-col h-full font-sans">
      {/* Tiêu đề cài đặt */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Settings2 className="text-[#ff8300]" size={24} />
          <span>Cài đặt hệ thống</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
          Quản lý tài khoản quản trị viên cá nhân và tinh chỉnh các tham số vận hành nền tảng.
        </p>
      </div>

      {/* Hiển thị Alert Banner báo trạng thái */}
      {alert && (
        <div
          className={`mb-6 p-4 rounded-xl border flex items-center gap-3 text-xs font-semibold animate-fadeIn ${
            alert.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
              : "bg-rose-500/10 border-rose-500/30 text-rose-500"
          }`}
        >
          {alert.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Grid chứa layout chia hai cột (Cột dọc Tab bên trái - Form bên phải) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* HÀNG CỘT TRÁI: DANH SÁCH CÁC TABS ĐIỀU HƯỚNG */}
        <div className="lg:col-span-1 flex flex-col gap-2">
          {SETTINGS_TABS.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setAlert(null);
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                  isActive
                    ? "bg-[#ff8300]/10 border-[#ff8300]/30 text-[#ff8300]"
                    : "bg-white border-slate-200/80 hover:bg-slate-50 text-slate-600 dark:bg-slate-900/40 dark:border-slate-900/60 dark:hover:bg-slate-800/40 dark:text-slate-400"
                }`}
              >
                <TabIcon size={18} className="shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="font-bold text-xs">{tab.title}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate leading-relaxed">
                    {tab.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* HÀNG CỘT PHẢI: FORM CẤU HÌNH TƯƠNG ỨNG VỚI TAB ĐANG CHỌN */}
        <div className="lg:col-span-3 bg-white border border-slate-200/85 dark:bg-slate-900/40 dark:border-slate-900/60 rounded-2xl p-6 shadow-sm">
          {/* TAB 1: FORM THÔNG TIN HỒ SƠ CÁ NHÂN */}
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
              <div className="border-b border-slate-100 dark:border-slate-800/50 pb-4 mb-4">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">Hồ sơ cá nhân</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Cập nhật ảnh đại diện và các trường thông tin cơ bản liên hệ.</p>
              </div>

              {/* Upload Avatar */}
              <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50 dark:bg-slate-800/20 p-4 rounded-2xl border border-slate-150 dark:border-slate-800/50">
                <div className="relative w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  {profileForm.avatar ? (
                    <img src={profileForm.avatar} alt="Avatar Admin" className="w-full h-full object-cover" />
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
                  <div className="text-xs font-bold text-slate-800 dark:text-white">Ảnh đại diện tài khoản</div>
                  <p className="text-[10px] text-slate-400">Định dạng hỗ trợ JPG, PNG, WEBP kích thước tối đa 3MB.</p>
                  
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
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        Gỡ bỏ
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Nhập trực tiếp URL ảnh nếu không muốn upload file */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-350 mb-1.5">Hoặc nhập URL ảnh đại diện:</label>
                <input
                  type="text"
                  value={profileForm.avatar}
                  onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
                  placeholder="https://example.com/avatar.png"
                />
              </div>

              {/* Nhóm các input thông tin liên hệ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-350 mb-1.5">Tên tài khoản (Username) *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.username}
                    onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-350 mb-1.5">Email liên hệ *</label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-350 mb-1.5">Số điện thoại</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
                    placeholder="Chưa cập nhật số điện thoại"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-350 mb-1.5">Giới tính</label>
                  <select
                    value={profileForm.gender}
                    onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors cursor-pointer"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              {/* Thông tin phòng ban read-only */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/10 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Quyền hạn hệ thống</span>
                  <span className="font-bold text-rose-500 uppercase flex items-center gap-1.5">
                    {currentAdmin?.adminInfo?.isSuper ? "Super Admin" : "Quản trị viên"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Phòng ban hoạt động</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{profileForm.department}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Chức vụ phụ trách</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{profileForm.position}</span>
                </div>
              </div>

              <div className="flex items-center justify-end border-t border-slate-100 dark:border-slate-800/50 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-1.5 bg-[#ff8300] hover:bg-[#e07300] text-white font-bold px-5 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-40"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Lưu thay đổi
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: ĐỔI MẬT KHẨU BẢO MẬT */}
          {activeTab === "security" && (
            <form onSubmit={handleSavePassword} className="space-y-6 text-xs">
              <div className="border-b border-slate-100 dark:border-slate-800/50 pb-4 mb-4">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">Bảo mật & Mật khẩu</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Đổi mật khẩu tài khoản để giữ an toàn tối đa cho Control Panel.</p>
              </div>

              <div className="space-y-4 max-w-md">
                {/* Mật khẩu cũ */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-350 mb-1.5">Mật khẩu cũ *</label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
                      placeholder="Nhập mật khẩu đang sử dụng"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showPasswords.current ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Mật khẩu mới */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-350 mb-1.5">Mật khẩu mới *</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      required
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
                      placeholder="Tối thiểu 6 ký tự"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-455 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showPasswords.new ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Xác nhận mật khẩu mới */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-350 mb-1.5">Xác nhận mật khẩu mới *</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      required
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
                      placeholder="Nhập lại mật khẩu mới"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
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
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Đổi mật khẩu
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: THIẾT LẬP THÔNG BÁO TỰ ĐỘNG */}
          {activeTab === "notifications" && (
            <form onSubmit={handleSaveNotifications} className="space-y-6 text-xs">
              <div className="border-b border-slate-100 dark:border-slate-800/50 pb-4 mb-4">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">Cấu hình nhận thông báo</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Tùy chỉnh các kênh và loại sự kiện hệ thống gửi thông báo cho bạn.</p>
              </div>

              <div className="space-y-5">
                {/* Email Alert Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/20 border border-slate-150 dark:border-slate-800/50">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-800 dark:text-white block">Thông báo qua Email</span>
                    <span className="text-[10px] text-slate-400 block max-w-md leading-relaxed">
                      Nhận thông tin qua hòm thư điện tử đăng ký khi hệ thống có tài khoản mới được kích hoạt hoặc phát sinh sự cố khẩn cấp.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifyForm((prev) => ({ ...prev, mail: !prev.mail }))}
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
                    <span className="font-bold text-slate-800 dark:text-white block">Thông báo đẩy Desktop (Realtime)</span>
                    <span className="text-[10px] text-slate-400 block max-w-md leading-relaxed">
                      Nhận thông báo nổi trực tiếp trên màn hình Dashboard ngay khi người dùng đăng ký hoặc thêm phim mới qua socket.io.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifyForm((prev) => ({ ...prev, desktop: !prev.desktop }))}
                    className={`w-11 h-6 rounded-full transition-all relative shrink-0 cursor-pointer ${
                      notifyForm.desktop ? "bg-[#ff8300]" : "bg-slate-200 dark:bg-slate-700"
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
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Lưu thiết lập
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: CÀI ĐẶT HỆ THỐNG VẬN HÀNH CHUNG (GIẢ LẬP) */}
          {activeTab === "system" && (
            <form onSubmit={handleSaveSystemConfig} className="space-y-6 text-xs">
              <div className="border-b border-slate-100 dark:border-slate-800/50 pb-4 mb-4">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">Cấu hình hệ thống</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Thiết lập các chế độ và tham số môi trường của website phim.</p>
              </div>

              <div className="space-y-5">
                {/* Maintenance Mode Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/20 border border-slate-150 dark:border-slate-800/50">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-800 dark:text-white block">Chế độ bảo trì hệ thống</span>
                    <span className="text-[10px] text-slate-400 block max-w-md leading-relaxed">
                      Khi kích hoạt, trang xem phim bên phía client sẽ chuyển sang màn hình bảo trì tạm thời. Admin vẫn có quyền truy cập quản trị.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSystemForm((prev) => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
                    className={`w-11 h-6 rounded-full transition-all relative shrink-0 cursor-pointer ${
                      systemForm.maintenanceMode ? "bg-rose-500" : "bg-slate-200 dark:bg-slate-700"
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
                    <label className="block font-bold text-slate-700 dark:text-slate-350 mb-1.5">Số phim hiển thị / trang</label>
                    <input
                      type="number"
                      required
                      value={systemForm.pageLimit}
                      onChange={(e) => setSystemForm({ ...systemForm, pageLimit: parseInt(e.target.value) || 12 })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
                    />
                  </div>

                  {/* Hotline */}
                  <div className="col-span-1">
                    <label className="block font-bold text-slate-700 dark:text-slate-350 mb-1.5">Hotline hỗ trợ kỹ thuật</label>
                    <input
                      type="text"
                      required
                      value={systemForm.hotline}
                      onChange={(e) => setSystemForm({ ...systemForm, hotline: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
                    />
                  </div>

                  {/* Facebook url */}
                  <div className="col-span-1">
                    <label className="block font-bold text-slate-700 dark:text-slate-350 mb-1.5">Liên kết Facebook Fanpage</label>
                    <input
                      type="text"
                      required
                      value={systemForm.facebookUrl}
                      onChange={(e) => setSystemForm({ ...systemForm, facebookUrl: e.target.value })}
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
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Lưu cấu hình hệ thống
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
