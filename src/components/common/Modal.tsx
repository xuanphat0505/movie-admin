"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

// Component Modal dùng chung với thiết kế kính mờ (glassmorphism) và hỗ trợ Dark Mode
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  // Ngăn cuộn trang chính khi Modal đang mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Xác định chiều rộng tối đa của modal tùy thuộc vào size truyền vào
  const sizeClasses = {
    sm: "max-w-md",     // ~448px
    md: "max-w-xl",     // ~576px
    lg: "max-w-4xl",     // ~896px (rộng hơn để hiển thị chi tiết phim)
    xl: "max-w-6xl",     // ~1152px
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Lớp nền mờ click để đóng modal */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Hộp nội dung chính của Modal */}
      <div
        className={`relative w-full ${sizeClasses[size]} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 max-h-[90vh] flex flex-col`}
      >
        {/* Thanh tiêu đề của Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            {title || "Chi tiết"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nội dung bên trong Modal */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
