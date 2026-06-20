import { Users, UserCheck, UserX, ShieldAlert } from "lucide-react";

interface UserStatsCardsProps {
  stats: {
    total: number;
    active: number;
    banned: number;
    admins: number;
  };
}

// Component hiển thị các thẻ thống kê nhanh về người dùng
export default function UserStatsCards({ stats }: UserStatsCardsProps) {
  return (
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
  );
}
