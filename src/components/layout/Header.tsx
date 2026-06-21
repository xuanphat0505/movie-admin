"use client";

import { useState, useEffect } from "react";
import { Bell, Sun, Moon, LogOut, User } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import { authApi } from "@/apis/authApi";
import { notificationApi } from "@/apis/notificationApi";
import NotificationDropdown from "@/components/layout/NotificationDropdown";
import { useSocket } from "@/context/SocketContext";

// Component Header chứa thanh tìm kiếm, đổi giao diện, thông báo và thông tin admin đăng nhập
export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Trạng thái cho hệ thống thông báo
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const { socket } = useSocket();
  const router = useRouter();

  // Hàm gọi API lấy danh sách thông báo mới nhất
  const fetchNotificationsList = async () => {
    try {
      const res = await notificationApi.getNotifications();
      if (res.data?.success && Array.isArray(res.data.data)) {
        // Sắp xếp thông báo mới nhất hiển thị trên cùng
        const sorted = [...res.data.data].sort(
          (a: any, b: any) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setNotifications(sorted);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách thông báo:", error);
    }
  };

  // Thiết lập trạng thái mounted và tải thông tin admin từ localStorage khi component render trên client
  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      try {
        setAdminUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Lỗi khi đọc thông tin admin:", error);
      }
    }

    // Tải danh sách thông báo ban đầu
    fetchNotificationsList();

    // Yêu cầu quyền thông báo của trình duyệt khi tải trang
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }
  }, []);

  // Lắng nghe thông báo mới từ Socket.IO Server
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification: any) => {
      // Đẩy thông báo mới lên đầu danh sách hiển thị
      setNotifications((prev) => {
        if (prev.some((item) => item._id === notification._id)) {
          return prev;
        }
        return [notification, ...prev];
      });

      // Hiển thị thông báo màn hình (Desktop Notification) nếu cấu hình admin bật
      if (
        adminUser?.adminInfo?.notificationOptions?.desktop &&
        typeof window !== "undefined" &&
        "Notification" in window
      ) {
        if (Notification.permission === "granted") {
          const cleanMessage = notification.message.replace(/<[^>]*>/g, "");
          new Notification("Stream-Lab Admin", {
            body: cleanMessage,
            icon: "/favicon.ico",
          });
        }
      }
    };

    socket.on("userAdded", handleNewNotification);
    socket.on("userUpdated", handleNewNotification);
    socket.on("userDeleted", handleNewNotification);

    return () => {
      socket.off("userAdded", handleNewNotification);
      socket.off("userUpdated", handleNewNotification);
      socket.off("userDeleted", handleNewNotification);
    };
  }, [socket, adminUser]);

  // Tự động đóng profile dropdown khi click ra ngoài vùng chứa
  useEffect(() => {
    if (!showDropdown) return;
    const handleCloseDropdown = () => setShowDropdown(false);
    window.addEventListener("click", handleCloseDropdown);
    return () => window.removeEventListener("click", handleCloseDropdown);
  }, [showDropdown]);

  // Xử lý đăng xuất tài khoản admin
  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    } finally {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      router.push("/login");
    }
  };

  // Đánh dấu một thông báo cụ thể là đã đọc
  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await notificationApi.readOne(id);
      if (res.data?.success) {
        setNotifications((prev) =>
          prev.map((item) => (item._id === id ? { ...item, read: true } : item))
        );
      }
    } catch (error) {
      console.error("Lỗi khi đọc thông báo:", error);
    }
  };

  // Đánh dấu tất cả thông báo là đã đọc
  const handleMarkAllAsRead = async () => {
    try {
      const res = await notificationApi.readAll();
      if (res.data?.success) {
        setNotifications((prev) =>
          prev.map((item) => ({ ...item, read: true }))
        );
      }
    } catch (error) {
      console.error("Lỗi khi đọc tất cả thông báo:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-20 border-b border-slate-200 bg-white/85 backdrop-blur-md px-4 md:px-8 flex items-center justify-end sticky top-0 z-50 transition-all duration-300 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] dark:shadow-none dark:bg-slate-950/40 dark:border-slate-900/60 font-sans">
      {/* Actions & Profile */}
      <div className="flex items-center gap-6">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all dark:hover:bg-slate-900/60 dark:text-slate-400 dark:hover:text-white cursor-pointer"
          title="Toggle Theme"
        >
          {mounted ? (
            theme === "dark" ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )
          ) : (
            <div className="w-[18px] h-[18px]" />
          )}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowNotifications(!showNotifications);
              setShowDropdown(false); // Đóng profile dropdown nếu đang mở
            }}
            className="relative p-2.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-all dark:hover:bg-slate-900/60 dark:text-slate-400 dark:hover:text-white cursor-pointer focus:outline-none"
            title="Thông báo"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#ff8300] rounded-full animate-pulse" />
            )}
          </button>

          <NotificationDropdown
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        </div>

        {/* User Info & Avatar với menu Dropdown */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Tránh kích hoạt sự kiện đóng trên window
              setShowDropdown(!showDropdown);
              setShowNotifications(false); // Đóng notifications dropdown nếu đang mở
            }}
            className="flex items-center gap-3 border-l border-slate-200 pl-6 dark:border-slate-800/80 cursor-pointer focus:outline-none group"
          >
            <div className="text-right hidden sm:block">
              <h3 className="text-sm font-semibold text-slate-800 group-hover:text-[#ff8300] transition-colors dark:text-white dark:group-hover:text-[#ff8300]">
                {adminUser?.username || "Admin Noir"}
              </h3>
              <span className="text-[10px] font-bold text-[#ff8300] tracking-wider uppercase block mt-0.5">
                {adminUser?.role || "Super Admin"}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center dark:border-slate-800 dark:bg-slate-900 ring-2 ring-transparent group-hover:ring-[#ff8300]/40 transition-all">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  adminUser?.avatar ||
                  "https://res.cloudinary.com/drngsxvb3/image/upload/q_auto/f_auto/v1776490861/user_rnttki.png"
                }
                alt="Admin Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </button>

          {/* Hộp tùy chọn Dropdown Option */}
          {showDropdown && (
            <div className="absolute right-0 mt-3.5 w-56 rounded-2xl bg-white border border-slate-100 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 dark:bg-slate-900 dark:border-slate-800/80">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  Admin Email
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-350 truncate block mt-1">
                  {adminUser?.email || "admin@streamlab.com"}
                </span>
              </div>

              {/* Option 1: Update Profile */}
              <button
                onClick={() => {
                  setShowDropdown(false);
                  router.push("/settings");
                }}
                className="flex items-center gap-2.5 px-4 py-3 text-slate-600 hover:text-[#ff8300] hover:bg-slate-50 text-xs font-medium transition-colors w-full text-left dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/30 cursor-pointer"
              >
                <User size={14} />
                <span>Chỉnh sửa thông tin</span>
              </button>

              {/* Option 2: Logout */}
              <button
                onClick={() => {
                  setShowDropdown(false);
                  handleLogout();
                }}
                className="flex items-center gap-2.5 px-4 py-3 text-rose-500 hover:bg-rose-500/5 text-xs font-medium transition-colors w-full text-left dark:hover:bg-rose-500/10 cursor-pointer"
              >
                <LogOut size={14} />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

