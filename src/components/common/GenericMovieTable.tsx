"use client";

import React from "react";
import { Star, Eye, Edit2, Trash2, Loader2, CheckCircle } from "lucide-react";

export interface Movie {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  poster_url: string;
  thumb_url: string;
  year: number;
  type?: string;
  modified?: {
    time: string;
  };
  tmdb?: {
    id: string;
    type?: string;
    season?: number;
    vote_average?: number;
    vote_count?: number;
  };
}

interface GenericMovieTableProps {
  movies: Movie[];
  loading: boolean;
  onViewDetails: (slug: string) => void;
  showAddedDate?: boolean;
  showStatus?: boolean;
  title?: string;
  headerAction?: React.ReactNode;
}

// Hàm bổ sung tiền tố cho ảnh tương đối từ KKPhim
const getImageUrl = (url?: string) => {
  if (!url)
    return "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=100&auto=format&fit=crop&q=60";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `https://phimimg.com/${url}`;
};

// Component GenericMovieTable dùng chung hiển thị danh sách phim với các cột động
export default function GenericMovieTable({
  movies,
  loading,
  onViewDetails,
  showAddedDate = false,
  showStatus = false,
  title,
  headerAction,
}: GenericMovieTableProps) {
  // Tính toán số lượng cột để set colSpan khi trống
  const totalColumns = 4 + (showStatus ? 1 : 0) + 1; 

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-6 dark:bg-slate-900/40 dark:border-slate-900/60 dark:shadow-none">
      {/* Header của thẻ card nếu có tiêu đề */}
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
            {title}
          </h3>
          {headerAction}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800/80 text-[10px] font-bold text-slate-500 tracking-wider uppercase">
              <th className="pb-4 pl-2 w-[40%]">Phim</th>
              <th className="pb-4 w-[15%]">Thể loại</th>
              <th className="pb-4 w-[15%]">
                {showAddedDate ? "Ngày thêm" : "Năm phát hành"}
              </th>
              <th className="pb-4 w-[12%]">Đánh giá</th>
              {showStatus && <th className="pb-4 w-[13%]">Trạng thái</th>}
              <th className="pb-4 text-right pr-2 w-[15%]">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
            {loading ? (
              // Hiển thị skeleton loaders
              Array.from({ length: title ? 5 : 8 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-12 rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="space-y-2">
                        <div className="h-3.5 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="h-2.5 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                  </td>
                  <td className="py-4">
                    <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                  </td>
                  <td className="py-4">
                    <div className="h-3 w-10 bg-slate-200 dark:bg-slate-800 rounded" />
                  </td>
                  {showStatus && (
                    <td className="py-4">
                      <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
                    </td>
                  )}
                  <td className="py-4 text-right pr-2">
                    <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded ml-auto" />
                  </td>
                </tr>
              ))
            ) : movies.length > 0 ? (
              movies.map((movie) => {
                const isTvSeries =
                  movie.type === "series" || movie.tmdb?.type === "tv";
                const rating =
                  movie.tmdb?.vote_average && movie.tmdb.vote_average > 0
                    ? movie.tmdb.vote_average
                    : 4.5;

                // Format thời gian hiển thị
                let timeDisplay = movie.year ? String(movie.year) : "N/A";
                if (showAddedDate && movie.modified?.time) {
                  timeDisplay = new Date(
                    movie.modified.time,
                  ).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });
                }

                return (
                  <tr
                    key={movie._id}
                    className="text-xs text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900/10"
                  >
                    {/* Cột Phim */}
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-12 rounded-md overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200 dark:bg-slate-800 dark:border-slate-800">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getImageUrl(
                              movie.thumb_url || movie.poster_url,
                            )}
                            alt={movie.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=100&auto=format&fit=crop&q=60";
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <span
                            className="font-semibold text-slate-800 block dark:text-white truncate max-w-[280px] text-sm"
                            title={movie.name}
                          >
                            {movie.name}
                          </span>
                          <span className="text-[11px] text-slate-500 block truncate max-w-[280px]">
                            {movie.origin_name}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Cột Thể loại */}
                    <td className="py-4 font-medium">
                      {isTvSeries ? (
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-wider">
                          Phim Bộ
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-[#ff8300]/10 text-[#ff8300] text-[10px] font-bold uppercase tracking-wider">
                          Phim Lẻ
                        </span>
                      )}
                    </td>

                    {/* Cột Thời gian (Năm hoặc Ngày thêm) */}
                    <td className="py-4 text-slate-500 dark:text-slate-400 font-semibold">
                      {timeDisplay}
                    </td>

                    {/* Cột Đánh giá */}
                    <td className="py-4 font-semibold text-slate-800 dark:text-white">
                      <div className="flex items-center gap-1">
                        <Star
                          size={13}
                          className="fill-amber-500 text-amber-500"
                        />
                        <span>{rating.toFixed(1)}</span>
                      </div>
                    </td>

                    {/* Cột Trạng thái (chỉ bật khi showStatus=true) */}
                    {showStatus && (
                      <td className="py-4">
                        {isTvSeries ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-[#ff8300]">
                            <Loader2 size={10} className="animate-spin" />
                            Ongoing
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                            <CheckCircle size={10} />
                            Completed
                          </span>
                        )}
                      </td>
                    )}

                    {/* Cột Hành động */}
                    <td className="py-4 text-right pr-2">
                      <div className="flex items-center justify-end gap-2">
                        {/* Chi tiết */}
                        <button
                          onClick={() => onViewDetails(movie.slug)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#ff8300] transition-all dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white"
                          title="Xem chi tiết"
                        >
                          <Eye size={14} />
                        </button>
                        {/* Mock Edit */}
                        <button
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white"
                          title="Sửa phim (Chỉ đọc)"
                        >
                          <Edit2 size={14} />
                        </button>
                        {/* Mock Delete */}
                        <button
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-rose-500 transition-all dark:hover:bg-slate-800 dark:text-slate-400"
                          title="Xóa phim (Chỉ đọc)"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={totalColumns}
                  className="py-8 text-center text-slate-400 dark:text-slate-500"
                >
                  Không tìm thấy kết quả nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
