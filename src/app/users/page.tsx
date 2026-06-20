"use client";

import { useState, useEffect } from "react";
import { userApi } from "@/apis/userApi";
import apiClient from "@/apis/apiClient";
import {
  UserHeader,
  UserStatsCards,
  UserFilterBar,
  UserTable,
  UserModalForm,
  UserDeleteModal,
} from "@/components/users";

// Định nghĩa kiểu dữ liệu User tương ứng với model từ database backend
export interface UserType {
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

  // State xác định tài khoản admin đang đăng nhập hiện tại
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);

  // States quản lý đóng mở Modal và các biểu mẫu nhập liệu
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);

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

  // Xử lý Debounce cho ô tìm kiếm keyword
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
      const admins = adminsRes.data?.pagination
        ? adminsRes.data?.pagination.totalPages
        : 0;
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
    setIsFormOpen(true);
  };

  // Thiết lập dữ liệu khi mở biểu mẫu Sửa người dùng
  const handleOpenEditModal = (user: UserType) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  // Chuẩn bị xóa người dùng
  const handleOpenDeleteConfirm = (user: UserType) => {
    if (user._id === currentAdmin?.id) {
      alert("Bạn không thể tự xóa tài khoản của chính mình!");
      return;
    }
    if (user.role === "admin") {
      alert(
        "Hệ thống không cho phép xóa tài khoản quản trị viên trực tiếp từ đây!",
      );
      return;
    }
    setUserToDelete(user);
    setIsDeleteOpen(true);
  };

  // Callback sau khi thêm/sửa/xóa thành công để tải lại dữ liệu mới nhất
  const handleSuccess = () => {
    loadUsersList();
    loadStats();
  };

  return (
    <div className="flex flex-col h-full font-sans">
      {/* Tiêu đề trang */}
      <UserHeader handleOpenAddModal={handleOpenAddModal} />

      {/* Thẻ thống kê nhanh */}
      <UserStatsCards stats={stats} />

      {/* Thanh công cụ tìm kiếm và lọc */}
      <UserFilterBar
        keyword={keyword}
        setKeyword={setKeyword}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {/* Bảng danh sách người dùng */}
      <UserTable
        users={users}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        currentAdminId={currentAdmin?.id}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteConfirm}
      />

      {/* Modal biểu mẫu Thêm/Sửa tài khoản */}
      <UserModalForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editingUser={editingUser}
        onSuccess={handleSuccess}
      />

      {/* Modal xác nhận xóa người dùng */}
      <UserDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        userToDelete={userToDelete}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
