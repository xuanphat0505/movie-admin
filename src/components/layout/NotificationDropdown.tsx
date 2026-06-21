import { useEffect } from "react";
import { CheckCheck, BellOff } from "lucide-react";
import { NotificationItem } from "@/components/common";
import { NotificationItemType } from "@/components/common/NotificationItem";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItemType[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

// Component Dropdown hiển thị danh sách các thông báo hệ thống của admin
export default function NotificationDropdown({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationDropdownProps) {
  // Tự động đóng dropdown khi click chuột ra bên ngoài vùng chứa
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = () => onClose();
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Tính số lượng các thông báo chưa đọc
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      onClick={(e) => e.stopPropagation()} // Tránh kích hoạt sự kiện đóng khi click vào bên trong dropdown
      className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xl z-[100] overflow-hidden font-sans animate-fadeIn"
    >
      {/* Tiêu đề & Thanh hành động nhanh */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40">
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-white">Thông báo</h4>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Bạn có <span className="font-semibold text-[#ff8300]">{unreadCount}</span> thông báo chưa đọc
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1 text-[10px] font-bold text-[#ff8300] hover:text-[#e07300] transition-colors cursor-pointer focus:outline-none"
          >
            <CheckCheck size={12} />
            <span>Đọc tất cả</span>
          </button>
        )}
      </div>

      {/* Danh sách các thẻ thông báo */}
      <div className="max-h-[350px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/40 custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3">
              <BellOff size={18} />
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Không có thông báo nào
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
              Hệ thống sẽ hiển thị thông báo khi có các hoạt động mới diễn ra.
            </p>
          </div>
        ) : (
          notifications.map((item) => (
            <NotificationItem
              key={item._id}
              item={item}
              onMarkAsRead={onMarkAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
}
