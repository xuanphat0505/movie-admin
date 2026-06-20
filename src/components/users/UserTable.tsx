import { User as UserIcon, Edit2, Trash2 } from "lucide-react";
import { UserType } from "@/app/users/page";

interface UserTableProps {
  users?: UserType[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  currentAdminId?: string;
  onEdit: (user: UserType) => void;
  onDelete: (user: UserType) => void;
}

// Component hiển thị bảng danh sách người dùng kèm phân trang
export default function UserTable({
  users,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  currentAdminId,
  onEdit,
  onDelete,
}: UserTableProps) {
  return (
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
                <tr
                  key={idx}
                  className="border-b border-slate-100/50 dark:border-slate-800/50 animate-pulse"
                >
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
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
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
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Cột Điện thoại / Giới tính */}
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    <div>{user.phone || "Chưa cập nhật"}</div>
                    <div className="text-[10px] text-slate-400 uppercase mt-0.5 font-bold">
                      {user.gender === "male"
                        ? "Nam"
                        : user.gender === "female"
                          ? "Nữ"
                          : "Khác"}
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
                          user.status === "active"
                            ? "bg-emerald-500 animate-pulse"
                            : "bg-rose-500"
                        }`}
                      />
                      <span
                        className={`font-bold capitalize ${
                          user.status === "active"
                            ? "text-emerald-500"
                            : "text-rose-500"
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
                        onClick={() => onEdit(user)}
                        title="Sửa thông tin"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#ff8300] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(user)}
                        disabled={
                          user._id === currentAdminId || user.role === "admin"
                        }
                        title={
                          user._id === currentAdminId
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
                <td
                  colSpan={5}
                  className="text-center py-16 text-slate-400 dark:text-slate-550"
                >
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
              onClick={() => onPageChange(currentPage - 1)}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-650 dark:text-slate-350 border border-slate-200 dark:border-slate-700/80 rounded-lg transition-all disabled:opacity-40 cursor-pointer"
            >
              Trước
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-650 dark:text-slate-350 border border-slate-200 dark:border-slate-700/80 rounded-lg transition-all disabled:opacity-40 cursor-pointer"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
