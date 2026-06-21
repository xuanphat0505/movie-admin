import { PlusCircle, Edit3, Trash2, AlertTriangle, Check } from "lucide-react";

export interface NotificationItemType {
  _id: string;
  type: "add" | "update" | "delete" | "report";
  message: string;
  read: boolean;
  timestamp: string | Date;
}

interface NotificationItemProps {
  item: NotificationItemType;
  onMarkAsRead: (id: string) => void;
}

// Component hiển thị chi tiết thông tin và trạng thái của một dòng thông báo
export default function NotificationItem({
  item,
  onMarkAsRead,
}: NotificationItemProps) {
  // Bản đồ lấy cấu hình giao diện theo loại thông báo
  const getNotificationConfig = (type: string) => {
    const config = {
      add: {
        bg: "bg-emerald-500/10 dark:bg-emerald-500/5",
        text: "text-emerald-500",
        border: "border-emerald-500/20",
        icon: PlusCircle,
      },
      update: {
        bg: "bg-indigo-500/10 dark:bg-indigo-500/5",
        text: "text-indigo-500",
        border: "border-indigo-500/20",
        icon: Edit3,
      },
      delete: {
        bg: "bg-rose-500/10 dark:bg-rose-500/5",
        text: "text-rose-500",
        border: "border-rose-500/20",
        icon: Trash2,
      },
      report: {
        bg: "bg-amber-500/10 dark:bg-amber-500/5",
        text: "text-[#ff8300]",
        border: "border-amber-500/20",
        icon: AlertTriangle,
      },
    }[type] || {
      bg: "bg-slate-500/10",
      text: "text-slate-500",
      border: "border-slate-500/20",
      icon: AlertTriangle,
    };
    return config;
  };

  const config = getNotificationConfig(item.type);
  const IconComponent = config.icon;

  return (
    <div
      className={`group relative flex items-start gap-3 p-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/25 ${
        !item.read ? "bg-slate-50/40 dark:bg-slate-900/10" : ""
      }`}
    >
      {/* Cột trái: Icon đại diện cho từng loại thông báo */}
      <div className={`p-2 rounded-xl shrink-0 ${config.bg} ${config.text}`}>
        <IconComponent size={15} />
      </div>

      {/* Cột giữa: Nội dung thông báo và thời gian tương ứng */}
      <div className="flex-1 min-w-0 text-xs">
        <p
          className={`leading-relaxed text-slate-650 dark:text-slate-300 ${
            !item.read ? "font-semibold" : "font-normal"
          }`}
          dangerouslySetInnerHTML={{ __html: item.message }}
        />
        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 block">
          {new Date(item.timestamp).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          -{" "}
          {new Date(item.timestamp).toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "short",
          })}
        </span>
      </div>

      {/* Cột phải: Hiển thị chấm tròn chưa đọc hoặc nút tích khi hover */}
      <div className="flex items-center justify-center shrink-0 w-5 h-5 ml-1">
        {!item.read ? (
          <>
            {/* Chấm tròn báo trạng thái chưa đọc */}
            <span className="w-2 h-2 rounded-full bg-[#ff8300] group-hover:hidden animate-pulse" />

            {/* Nút tích để đánh dấu nhanh trạng thái đã đọc */}
            <button
              onClick={() => onMarkAsRead(item._id)}
              className="hidden group-hover:flex items-center justify-center w-5 h-5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer focus:outline-none"
              title="Đánh dấu đã đọc"
            >
              <Check size={12} />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
