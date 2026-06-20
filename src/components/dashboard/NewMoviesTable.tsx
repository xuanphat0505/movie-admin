"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Modal, GenericMovieTable } from "@/components/common";
import { type Movie } from "@/components/common/GenericMovieTable";
import Link from "next/link";

// hiển thị danh sách 10 phim mới thêm gần đây nhất
export default function NewMoviesTable() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // States quản lý Modal chi tiết phim
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [movieDetail, setMovieDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

  // Gọi API lấy danh sách phim mới nhất ở trang 1 khi mount component
  useEffect(() => {
    const fetchRecentMovies = async () => {
      try {
        const res = await fetch(
          "https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1",
        );
        const data = await res.json();
        if (data && data.items) {
          setMovies(data.items);
        }
      } catch (error) {
        console.error("Lỗi khi fetch phim mới:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentMovies();
  }, []);

  // Hàm xử lý mở modal và gọi API lấy chi tiết phim
  const handleViewDetails = async (slug: string) => {
    setIsModalOpen(true);
    setLoadingDetail(true);
    setMovieDetail(null);
    try {
      const res = await fetch(`https://phimapi.com/phim/${slug}`);
      const data = await res.json();
      if (data && data.status && data.movie) {
        setMovieDetail(data.movie);
      }
    } catch (error) {
      console.error("Lỗi khi fetch chi tiết phim:", error);
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div className="w-full">
      {/* Tái sử dụng bảng dùng chung GenericMovieTable */}
      <GenericMovieTable
        movies={movies}
        loading={loading}
        onViewDetails={handleViewDetails}
        showAddedDate={true}
        showStatus={true}
        title="New Movies Table"
        headerAction={
          <Link
            href="/movies"
            className="text-xs font-semibold text-[#ff8300] hover:underline"
          >
            View All Movies &gt;
          </Link>
        }
      />

      {/* Modal chi tiết phim */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={movieDetail ? movieDetail.name : "Đang tải chi tiết..."}
        size="lg"
      >
        {loadingDetail ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="animate-spin text-[#ff8300]" size={36} />
            <span className="text-sm text-slate-500">
              Đang tải thông tin phim...
            </span>
          </div>
        ) : movieDetail ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cột ảnh poster & thông tin nhanh */}
            <div className="md:col-span-1 flex flex-col gap-6">
              <div className="w-full aspect-[2/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-800 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={movieDetail.poster_url || movieDetail.thumb_url}
                  alt={movieDetail.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&auto=format&fit=crop&q=60";
                  }}
                />
              </div>
              <div className="space-y-3 text-sm bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-100 dark:border-slate-900/60">
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500">Năm:</span>
                  <span className="font-semibold text-slate-800 dark:text-white">
                    {movieDetail.year}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500">Thời lượng:</span>
                  <span className="font-semibold text-slate-800 dark:text-white">
                    {movieDetail.time || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500">Chất lượng:</span>
                  <span className="font-semibold px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white">
                    {movieDetail.quality}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Ngôn ngữ:</span>
                  <span className="font-semibold px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white">
                    {movieDetail.lang}
                  </span>
                </div>
              </div>
            </div>

            {/* Cột thông tin chi tiết chính */}
            <div className="md:col-span-2 flex flex-col gap-6 text-sm text-slate-600 dark:text-slate-300">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-1.5">
                  {movieDetail.name}
                </h2>
                <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {movieDetail.origin_name} ({movieDetail.year})
                </h4>
              </div>

              {/* Nhãn trạng thái */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#ff8300]/10 text-[#ff8300] uppercase tracking-wider">
                  {movieDetail.type === "series" ? "TV Series" : "Movie"}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 uppercase tracking-wider">
                  {movieDetail.status === "ongoing"
                    ? "Đang chiếu"
                    : "Hoàn thành"}
                </span>
                {movieDetail.episode_current && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500 uppercase tracking-wider">
                    {movieDetail.episode_current} /{" "}
                    {movieDetail.episode_total || "?"} tập
                  </span>
                )}
              </div>

              {/* Tóm tắt nội dung */}
              <div className="space-y-2">
                <h5 className="font-bold text-slate-800 dark:text-white">
                  Nội dung tóm tắt:
                </h5>
                <p className="leading-relaxed bg-slate-50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-150 dark:border-slate-900/60 text-justify text-slate-600 dark:text-slate-300">
                  {movieDetail.content
                    ? movieDetail.content.replace(/<[^>]*>/g, "")
                    : "Chưa có tóm tắt cho bộ phim này."}
                </p>
              </div>

              {/* Thể loại & Quốc gia */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <h5 className="font-bold text-slate-800 dark:text-white">
                    Thể loại:
                  </h5>
                  <span className="text-slate-500 dark:text-slate-400">
                    {movieDetail.category?.map((c: any) => c.name).join(", ") ||
                      "N/A"}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h5 className="font-bold text-slate-800 dark:text-white">
                    Quốc gia:
                  </h5>
                  <span className="text-slate-500 dark:text-slate-400">
                    {movieDetail.country?.map((c: any) => c.name).join(", ") ||
                      "N/A"}
                  </span>
                </div>
              </div>

              {/* Thông tin đoàn làm phim */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex gap-3">
                  <span className="font-bold text-slate-800 dark:text-white min-w-[80px]">
                    Đạo diễn:
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {movieDetail.director?.join(", ") || "N/A"}
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-slate-800 dark:text-white min-w-[80px]">
                    Diễn viên:
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    {movieDetail.actor?.slice(0, 10).join(", ") || "N/A"}
                    {movieDetail.actor &&
                      movieDetail.actor.length > 10 &&
                      "..."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500">
            Không tìm thấy thông tin chi tiết phim.
          </div>
        )}
      </Modal>
    </div>
  );
}
