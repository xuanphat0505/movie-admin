import { Search } from "lucide-react";

interface UserFilterBarProps {
  keyword: string;
  setKeyword: (val: string) => void;
  selectedRole: string;
  setSelectedRole: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
}

// Component chứa thanh công cụ tìm kiếm và lọc danh sách người dùng
export default function UserFilterBar({
  keyword,
  setKeyword,
  selectedRole,
  setSelectedRole,
  selectedStatus,
  setSelectedStatus,
}: UserFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
      {/* Tìm kiếm theo tên hoặc email */}
      <div className="relative w-full md:w-80">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450"
          size={15}
        />
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
          onChange={(e) => setSelectedRole(e.target.value)}
          className="bg-white border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 rounded-xl h-[38px] px-3 text-xs text-slate-650 dark:text-slate-350 focus:outline-none focus:border-[#ff8300]/50 cursor-pointer"
        >
          <option value="">Tất cả quyền hạn</option>
          <option value="user">Người dùng (User)</option>
          <option value="admin">Quản trị viên (Admin)</option>
        </select>

        {/* Lọc theo Trạng thái */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-white border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 rounded-xl h-[38px] px-3 text-xs text-slate-650 dark:text-slate-350 focus:outline-none focus:border-[#ff8300]/50 cursor-pointer"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="banned">Đang bị khóa</option>
        </select>
      </div>
    </div>
  );
}
