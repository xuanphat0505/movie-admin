"use client";

import React, { useState, useEffect } from "react";
import {
  Film,
  Users,
  Heart,
  MessageSquare,
  Minus,
  TrendingUp,
} from "lucide-react";
import { analyticsApi } from "@/apis/analyticsApi";

// Component StatCards hiển thị 4 thẻ thống kê ở đầu trang Dashboard
export default function StatCards() {
  const [totalMovies, setTotalMovies] = useState<string>("Loading...");
  const [localStats, setLocalStats] = useState({
    users: "Loading...",
    favorites: "Loading...",
    comments: "Loading...",
  });

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        // Chạy song song 2 API (PhimAPI ngoài và Backend qua analyticsApi)
        const [phimRes, localRes] = await Promise.all([
          fetch("https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1"),
          analyticsApi.getOverviewStats(),
        ]);

        const phimData = await phimRes.json();
        const localData = localRes.data;

        // Cập nhật số liệu từ PhimAPI
        if (phimData?.pagination) {
          setTotalMovies(
            new Intl.NumberFormat("en-US").format(
              phimData.pagination.totalItems,
            ),
          );
        }

        // Cập nhật số liệu từ Local DB (Users, Favorites, Comments)
        if (localData?.success && localData?.data) {
          setLocalStats({
            users: new Intl.NumberFormat("en-US").format(
              localData.data.totalUsers,
            ),
            favorites: new Intl.NumberFormat("en-US").format(
              localData.data.totalFavorites,
            ),
            comments: new Intl.NumberFormat("en-US").format(
              localData.data.totalComments,
            ),
          });
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        setTotalMovies("N/A");
        setLocalStats({ users: "N/A", favorites: "N/A", comments: "N/A" });
      }
    };
    fetchAllStats();
  }, []);

  const stats = [
    {
      title: "AVAILABLE STREAMS",
      value: totalMovies,
      trend: "PhimAPI Database",
      isPositive: true,
      isNeutral: false,
      icon: Film,
      iconColor: "text-orange-500",
    },
    {
      title: "TOTAL USERS",
      value: localStats.users,
      trend: "Người dùng đăng ký",
      isPositive: true,
      isNeutral: false,
      icon: Users,
      iconColor: "text-blue-500",
    },
    {
      title: "MOVIE FAVORITES",
      value: localStats.favorites,
      trend: "Lượt lưu phim",
      isPositive: true,
      isNeutral: false,
      icon: Heart,
      iconColor: "text-rose-500",
    },
    {
      title: "TOTAL COMMENTS",
      value: localStats.comments,
      trend: "Bình luận hệ thống",
      isPositive: true,
      isNeutral: false,
      icon: MessageSquare,
      iconColor: "text-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all duration-300 dark:bg-slate-900/40 dark:border-slate-900/60 dark:shadow-none hover:dark:border-slate-800/80"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                {item.title}
              </span>
              <Icon className={`${item.iconColor}`} size={20} />
            </div>

            {item.value === "Loading..." ? (
              <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse my-0.5" />
            ) : (
              <h2 className="text-3xl font-extrabold text-slate-800 mb-2 dark:text-white">
                {item.value}
              </h2>
            )}

            <div className="flex items-center gap-1.5 text-xs">
              {item.isNeutral ? (
                <Minus size={14} className="text-slate-500" />
              ) : (
                <TrendingUp
                  size={14}
                  className={
                    item.isPositive ? "text-emerald-500" : "text-rose-500"
                  }
                />
              )}
              <span
                className={`font-semibold ${
                  item.isNeutral
                    ? "text-slate-500"
                    : item.isPositive
                      ? "text-emerald-500"
                      : "text-rose-500"
                }`}
              >
                {item.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
