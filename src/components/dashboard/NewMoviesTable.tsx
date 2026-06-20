"use client";

import { useState, useEffect } from "react";
import { Edit2, Trash2, Star, CheckCircle, Loader2, Eye } from "lucide-react";
import Modal from "@/components/common/Modal";

interface Movie {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  poster_url: string;
  year: number;
  modified: {
    time: string;
  };
  tmdb: {
    type: string;
    vote_average?: number;
  };
}

// hiển thị danh sách 10 phim mới thêm gần đây nhất từ PhimAPI
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
    <div className="w-full p-6 rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-slate-900/40 dark:border-slate-900/60 dark:shadow-none">
      {/* Table Header Controls */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
          Recently Added Movies
        </h3>
        <button className="text-xs font-semibold text-[#ff8300] hover:underline">
          View All Movies &gt;
        </button>
      </div>

      {/* Table Canvas */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800/80 text-[10px] font-bold text-slate-500 tracking-wider uppercase">
              <th className="pb-4 pl-2">Movie</th>
              <th className="pb-4">Category</th>
              <th className="pb-4">Added Date</th>
              <th className="pb-4">Rating</th>
              <th className="pb-4">Status</th>
              <th className="pb-4 text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
            {loading
              ? // Hiển thị 10 dòng Skeleton khi đang tải trang
                Array.from({ length: 10 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-12 rounded bg-slate-200 dark:bg-slate-800" />
                        <div className="space-y-2">
                          <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                          <div className="h-2 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                    </td>
                    <td className="py-4">
                      <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                    </td>
                    <td className="py-4">
                      <div className="h-3 w-8 bg-slate-200 dark:bg-slate-800 rounded" />
                    </td>
                    <td className="py-4">
                      <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
                    </td>
                    <td className="py-4 text-right pr-2">
                      <div className="h-6 w-12 bg-slate-200 dark:bg-slate-800 rounded ml-auto" />
                    </td>
                  </tr>
                ))
              : movies.map((movie) => {
                  const isTvSeries = movie.tmdb?.type === "tv";
                  const rating =
                    movie.tmdb?.vote_average && movie.tmdb.vote_average > 0
                      ? movie.tmdb.vote_average
                      : 4.5;

                  const addedDate = new Date(
                    movie.modified.time,
                  ).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });

                  return (
                    <tr
                      key={movie._id}
                      className="text-xs text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900/10"
                    >
                      {/* Cột Movie poster và title */}
                      <td className="py-4 pl-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-12 rounded-md overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200 dark:bg-slate-800 dark:border-slate-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={movie.poster_url}
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
                              className="font-semibold text-slate-800 block dark:text-white truncate max-w-[200px]"
                              title={movie.name}
                            >
                              {movie.name}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {movie.year}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Cột Category */}
                      <td className="py-4 font-medium">
                        {isTvSeries ? "TV Series" : "Movie"}
                      </td>

                      {/* Cột Added Date */}
                      <td className="py-4 text-slate-500 dark:text-slate-400">
                        {addedDate}
                      </td>

                      {/* Cột Rating */}
                      <td className="py-4">
                        <div className="flex items-center gap-1">
                          <Star
                            size={13}
                            className="fill-amber-500 text-amber-500"
                          />
                          <span className="font-semibold text-slate-800 dark:text-white">
                            {rating.toFixed(1)}
                          </span>
                        </div>
                      </td>

                      {/* Cột Status */}
                      <td className="py-4">
                        {isTvSeries ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-orange-500/10 text-[#ff8300]">
                            <Loader2 size={10} className="animate-spin" />
                            Ongoing
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500">
                            <CheckCircle size={10} />
                            Completed
                          </span>
                        )}
                      </td>

                      {/* Cột Actions */}
                      <td className="py-4 text-right pr-2">
                        <div className="flex items-center justify-end gap-2.5">
                          {/* Nút xem chi tiết */}
                          <button
                            onClick={() => handleViewDetails(movie.slug)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#ff8300] transition-all dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white"
                            title="Xem chi tiết"
                          >
                            <Eye size={13} />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white">
                            <Edit2 size={13} />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-rose-500 transition-all dark:hover:bg-slate-800 dark:text-slate-400">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

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
