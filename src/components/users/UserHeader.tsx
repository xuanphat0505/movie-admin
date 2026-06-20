import { Users, UserPlus } from "lucide-react";

export default function UserHeader({
  handleOpenAddModal,
}: {
  handleOpenAddModal: () => void;
}) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Users className="text-[#ff8300]" size={24} />
          <span>Quản lý người dùng</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
          Xem danh sách thành viên, cập nhật thông tin chi tiết và phân quyền
          tài khoản quản trị viên.
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
  );
}
