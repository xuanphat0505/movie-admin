"use client";

import { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  UserX,
  ShieldAlert,
  Search,
  UserPlus,
  Edit2,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  User as UserIcon,
} from "lucide-react";
import { userApi } from "@/apis/userApi";
import apiClient from "@/apis/apiClient";
import Modal from "@/components/common/Modal";

// Định nghĩa kiểu dữ liệu User tương ứng với model từ database backend
interface UserType {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "banned";
  avatar?: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  adminInfo?: {
    position?: string;
    department?: string;
    notes?: string;
    isSuper?: boolean;
  };
  createdAt?: string;
}

// Định nghĩa interface cho bộ lọc tìm kiếm
interface FilterType {
  keyword: string;
  role: string;
  status: string;
  page: number;
  limit: number;
}

export default function UsersPage() {
  // States quản lý dữ liệu người dùng và phân trang
  const [users, setUsers] = useState<UserType[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // States quản lý bộ lọc tìm kiếm
  const [keyword, setKeyword] = useState<string>("");
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // States quản lý số liệu thống kê tổng hợp (Analytics)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    banned: 0,
    admins: 0,
  });

  // State xác định tài khoản admin đang đăng nhập hiện tại (đọc từ localStorage)
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);

  // States quản lý đóng mở Modal và các biểu mẫu nhập liệu
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);

  // States xử lý giao diện biểu mẫu (Form)
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

  // Đọc thông tin Admin đăng nhập khi mount trang
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("adminUser");
      if (stored) {
        try {
          setCurrentAdmin(JSON.parse(stored));
        } catch (e) {
          console.error("Lỗi parse thông tin admin:", e);
        }
      }
    }
  }, []);

  // Xử lý Debounce cho ô tìm kiếm keyword (tránh gọi API liên tục)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [keyword]);

  // Load số liệu thống kê tổng hợp của người dùng
  const loadStats = async () => {
    try {
      const [totalRes, activeRes, adminsRes] = await Promise.all([
        apiClient.get("/analytics/total-users"),
        apiClient.get("/analytics/active-users"),
        userApi.getUsers({ role: "admin", limit: 1, page: 1 }),
      ]);
      const total = totalRes.data?.data || 0;
      const active = activeRes.data?.data || 0;
      const admins = adminsRes.data?.pagination ? adminsRes.data?.pagination.totalPages : 0;
      setStats({
        total,
        active,
        banned: Math.max(0, total - active),
        admins,
      });
    } catch (error) {
      console.error("Lỗi khi tải số liệu thống kê người dùng:", error);
    }
  };

  // Tải danh sách người dùng dựa theo từ khóa, quyền hạn, trạng thái và trang
  const loadUsersList = async () => {
    setLoading(true);
    try {
      const params = {
        keyword: debouncedKeyword,
        role: selectedRole || undefined,
        status: selectedStatus || undefined,
        page: currentPage,
        limit: 10,
      };
      const res = await userApi.getUsers(params);
      if (res.data?.success) {
        setUsers(res.data.data || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Tải lại toàn bộ dữ liệu (bảng + stats) khi bộ lọc thay đổi
  useEffect(() => {
    loadUsersList();
    loadStats();
  }, [debouncedKeyword, selectedRole, selectedStatus, currentPage]);

  // Thiết lập dữ liệu khi mở biểu mẫu Thêm người dùng mới
  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormError("");
    setShowPassword(false);
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
    setIsFormOpen(true);
  };

  // Thiết lập dữ liệu khi mở biểu mẫu Sửa người dùng
  const handleOpenEditModal = (user: UserType) => {
    setEditingUser(user);
    setFormError("");
    setShowPassword(false);
    setFormData({
      username: user.username || "",
      email: user.email || "",
      password: "", // Mật khẩu không bắt buộc khi sửa nên ban đầu để rỗng
      phone: user.phone || "",
      gender: user.gender || "male",
      role: user.role || "user",
      status: user.status || "active",
      avatar: user.avatar || "",
      position: user.adminInfo?.position || "Staff",
      department: user.adminInfo?.department || "General",
      notes: user.adminInfo?.notes || "",
    });
    setIsFormOpen(true);
  };

  // Xử lý gửi biểu mẫu Thêm / Sửa
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    // Kiểm tra đầu vào phía client
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
        setIsFormOpen(false);
        loadUsersList();
        loadStats();
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

  // Chuẩn bị xóa người dùng
  const handleOpenDeleteConfirm = (user: UserType) => {
    if (user._id === currentAdmin?.id) {
      alert("Bạn không thể tự xóa tài khoản của chính mình!");
      return;
    }
    if (user.role === "admin") {
      alert("Hệ thống không cho phép xóa tài khoản quản trị viên trực tiếp từ đây!");
      return;
    }
    setUserToDelete(user);
    setIsDeleteOpen(true);
  };

  // Xác nhận thực thi xóa người dùng từ API
  const handleDeleteExecute = async () => {
    if (!userToDelete) return;
    setSubmitting(true);
    try {
      const res = await userApi.deleteUser(userToDelete._id);
      if (res.data?.success) {
        setIsDeleteOpen(false);
        setUserToDelete(null);
        loadUsersList();
        loadStats();
      } else {
        alert(res.data?.message || "Xóa người dùng thất bại");
      }
    } catch (error: any) {
      console.error("Lỗi khi xóa người dùng:", error);
      alert(error.response?.data?.message || "Lỗi máy chủ khi xóa người dùng");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full font-sans">
      {/* Tiêu đề trang */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Users className="text-[#ff8300]" size={24} />
            <span>Quản lý người dùng</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
            Xem danh sách thành viên, cập nhật thông tin chi tiết và phân quyền tài khoản quản trị viên.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-[#ff8300] hover:bg-[#e07300] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <UserPlus size={15} />
          <span>Thêm tài khoản</span>
        </button>
      </div>

      {/* Thẻ thống kê nhanh (Analytics Summary) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Card 1: Tổng số tài khoản */}
        <div className="bg-white border border-slate-200/80 dark:bg-slate-900/40 dark:border-slate-900/60 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Users size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Tổng người dùng
            </span>
            <span className="text-2xl font-black text-slate-800 dark:text-white block mt-0.5 leading-none">
              {stats.total.toLocaleString("vi-VN")}
            </span>
          </div>
        </div>

        {/* Card 2: Tài khoản đang hoạt động */}
        <div className="bg-white border border-slate-200/80 dark:bg-slate-900/40 dark:border-slate-900/60 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <UserCheck size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Đang hoạt động
            </span>
            <span className="text-2xl font-black text-slate-800 dark:text-white block mt-0.5 leading-none">
              {stats.active.toLocaleString("vi-VN")}
            </span>
          </div>
        </div>

        {/* Card 3: Tài khoản bị khóa */}
        <div className="bg-white border border-slate-200/80 dark:bg-slate-900/40 dark:border-slate-900/60 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <UserX size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Đang bị khóa
            </span>
            <span className="text-2xl font-black text-slate-800 dark:text-white block mt-0.5 leading-none">
              {stats.banned.toLocaleString("vi-VN")}
            </span>
          </div>
        </div>

        {/* Card 4: Ban quản trị */}
        <div className="bg-white border border-slate-200/80 dark:bg-slate-900/40 dark:border-slate-900/60 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <ShieldAlert size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Ban quản trị
            </span>
            <span className="text-2xl font-black text-slate-800 dark:text-white block mt-0.5 leading-none">
              {stats.admins.toLocaleString("vi-VN")}
            </span>
          </div>
        </div>
      </div>

      {/* Thanh công cụ tìm kiếm và lọc */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450" size={15} />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full bg-white border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 rounded-xl h-[38px] pl-9 pr-4 text-xs text-slate-800 dark:text-slate-350 placeholder-slate-400 focus:outline-none focus:border-[#ff8300]/50 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Lọc theo Vai trò */}
          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 rounded-xl h-[38px] px-3 text-xs text-slate-650 dark:text-slate-350 focus:outline-none focus:border-[#ff8300]/50 cursor-pointer"
          >
            <option value="">Tất cả quyền hạn</option>
            <option value="user">Người dùng (User)</option>
            <option value="admin">Quản trị viên (Admin)</option>
          </select>

          {/* Lọc theo Trạng thái */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 rounded-xl h-[38px] px-3 text-xs text-slate-650 dark:text-slate-350 focus:outline-none focus:border-[#ff8300]/50 cursor-pointer"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="banned">Đang bị khóa</option>
          </select>
        </div>
      </div>

      {/* Bảng danh sách người dùng */}
      <div className="flex-1 bg-white border border-slate-200/80 rounded-2xl dark:bg-slate-900/40 dark:border-slate-900/60 overflow-hidden flex flex-col justify-between">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100/50 dark:border-slate-800/50 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Tài khoản</th>
                <th className="px-6 py-4">Điện thoại / Giới tính</th>
                <th className="px-6 py-4">Quyền hạn</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Hiển thị skeleton loading khi chờ tải dữ liệu
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="border-b border-slate-100/50 dark:border-slate-800/50 animate-pulse">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-100 dark:bg-slate-805 rounded-full" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-28 bg-slate-100 dark:bg-slate-805 rounded" />
                        <div className="h-2 w-36 bg-slate-100 dark:bg-slate-805 rounded" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3 w-24 bg-slate-100 dark:bg-slate-805 rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 w-16 bg-slate-100 dark:bg-slate-805 rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 w-20 bg-slate-100 dark:bg-slate-805 rounded-full" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="h-6 w-12 bg-slate-100 dark:bg-slate-805 rounded inline-block" />
                    </td>
                  </tr>
                ))
              ) : users && users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-slate-100/40 dark:border-slate-800/40 hover:bg-slate-50/30 dark:hover:bg-slate-800/30 text-xs transition-colors"
                  >
                    {/* Cột Tài khoản kèm Avatar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200/50 dark:border-slate-750">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon size={16} className="text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                            <span>{user.username}</span>
                            {user.adminInfo?.isSuper && (
                              <span className="text-[9px] bg-red-500/10 text-red-500 font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                                Super
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 block">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Cột Điện thoại / Giới tính */}
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      <div>{user.phone || "Chưa cập nhật"}</div>
                      <div className="text-[10px] text-slate-400 uppercase mt-0.5 font-bold">
                        {user.gender === "male" ? "Nam" : user.gender === "female" ? "Nữ" : "Khác"}
                      </div>
                    </td>

                    {/* Cột Quyền hạn */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          user.role === "admin"
                            ? "bg-[#ff8300]/10 text-[#ff8300] dark:bg-[#ff8300]/20"
                            : "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Cột Trạng thái */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                          }`}
                        />
                        <span
                          className={`font-bold capitalize ${
                            user.status === "active" ? "text-emerald-500" : "text-rose-500"
                          }`}
                        >
                          {user.status === "active" ? "Hoạt động" : "Bị khóa"}
                        </span>
                      </div>
                    </td>

                    {/* Cột Hành động chỉnh sửa/xóa */}
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          title="Sửa thông tin"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#ff8300] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteConfirm(user)}
                          disabled={user._id === currentAdmin?.id || user.role === "admin"}
                          title={
                            user._id === currentAdmin?.id
                              ? "Bạn không thể xóa chính mình"
                              : user.role === "admin"
                              ? "Không thể xóa quản trị viên"
                              : "Xóa tài khoản"
                          }
                          className="p-1.5 rounded-lg text-slate-550 hover:text-rose-500 hover:bg-slate-150 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-slate-400 dark:text-slate-550">
                    Không tìm thấy tài khoản người dùng nào khớp bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Chân trang phân trang (Pagination Footer) */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100/50 dark:border-slate-800/50">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Trang {currentPage} trên {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-650 dark:text-slate-350 border border-slate-200 dark:border-slate-700/80 rounded-lg transition-all disabled:opacity-40 cursor-pointer"
              >
                Trước
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-650 dark:text-slate-350 border border-slate-200 dark:border-slate-700/80 rounded-lg transition-all disabled:opacity-40 cursor-pointer"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Biểu mẫu Thêm/Sửa Tài khoản */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingUser ? `Chỉnh sửa: ${editingUser.username}` : "Thêm tài khoản mới"}
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
              <label className="block font-bold text-slate-750 dark:text-slate-300 mb-1.5">Tên tài khoản *</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
                placeholder="Nhập tên tài khoản"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-bold text-slate-750 dark:text-slate-300 mb-1.5">Địa chỉ Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mật khẩu */}
            <div>
              <label className="block font-bold text-slate-750 dark:text-slate-300 mb-1.5">
                {editingUser ? "Mật khẩu mới (bỏ trống nếu giữ nguyên)" : "Mật khẩu *"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-3.5 pr-10 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
                  placeholder={editingUser ? "••••••••" : "Nhập mật khẩu tài khoản"}
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
              <label className="block font-bold text-slate-750 dark:text-slate-300 mb-1.5">Số điện thoại</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
                placeholder="Nhập số điện thoại"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Giới tính */}
            <div>
              <label className="block font-bold text-slate-750 dark:text-slate-300 mb-1.5">Giới tính</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors cursor-pointer"
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>

            {/* Quyền hạn */}
            <div>
              <label className="block font-bold text-slate-750 dark:text-slate-300 mb-1.5">Quyền hạn</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors cursor-pointer"
              >
                <option value="user">Người dùng (User)</option>
                <option value="admin">Quản trị viên (Admin)</option>
              </select>
            </div>

            {/* Trạng thái */}
            <div>
              <label className="block font-bold text-slate-750 dark:text-slate-300 mb-1.5">Trạng thái</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors cursor-pointer"
              >
                <option value="active">Hoạt động</option>
                <option value="banned">Bị khóa</option>
              </select>
            </div>
          </div>

          {/* Đường dẫn Avatar */}
          <div>
            <label className="block font-bold text-slate-750 dark:text-slate-300 mb-1.5">Đường dẫn ảnh đại diện (URL)</label>
            <input
              type="text"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
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
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Chức vụ</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
                    placeholder="Ví dụ: Staff, Manager"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Phòng ban</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#ff8300] transition-colors"
                    placeholder="Ví dụ: Content, Operations"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Ghi chú</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-650 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
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

      {/* Modal Xác nhận Xóa Người dùng */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Xác nhận xóa tài khoản"
        size="sm"
      >
        <div className="space-y-4 text-xs text-center">
          <div className="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <UserX size={26} />
          </div>
          <div>
            <p className="text-slate-800 dark:text-white font-bold text-sm">
              Bạn có chắc chắn muốn xóa tài khoản này?
            </p>
            <p className="text-slate-400 dark:text-slate-500 mt-1.5">
              Hành động này sẽ xóa vĩnh viễn tài khoản <strong className="text-slate-600 dark:text-slate-350">{userToDelete?.username}</strong> khỏi hệ thống dữ liệu.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-650 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleDeleteExecute}
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold shadow-sm transition-colors disabled:opacity-40 cursor-pointer"
            >
              {submitting && <Loader2 className="animate-spin" size={14} />}
              <span>Xác nhận xóa</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
