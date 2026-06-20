"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Film, CheckCircle, Copy, Check } from "lucide-react";
import MovieFilterBar from "@/components/movies/MovieFilterBar";
import MovieTable, { Movie } from "@/components/movies/MovieTable";
import Pagination from "@/components/movies/Pagination";
import Modal from "@/components/common/Modal";

// Trang quản lý phim, hiển thị danh sách phim và các thao tác lọc/tìm kiếm trực tiếp từ KKPhim
export default function MoviesPage() {
  // States lưu danh sách phim và trạng thái tải trang
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // States quản lý bộ lọc
  const [keyword, setKeyword] = useState<string>("");
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("hanh-dong");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // States quản lý Modal chi tiết phim
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [movieDetail, setMovieDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [selectedServerIndex, setSelectedServerIndex] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState<string>("");

  // Hook xử lý Debounce cho ô tìm kiếm
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setCurrentPage(1); // Reset trang về 1 khi từ khóa thay đổi
    }, 600);

    return () => clearTimeout(handler);
  }, [keyword]);

  // Hook reset trang về 1 khi các bộ lọc thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGenre, selectedCountry, selectedYear]);

  // Hook gọi API tải danh sách phim từ KKPhim (phimapi.com)
  useEffect(() => {
    const fetchMoviesList = async () => {
      setLoading(true);
      try {
        let apiUrl = "";
        
        // Nếu có từ khóa tìm kiếm, gọi API Tìm kiếm
        if (debouncedKeyword.trim()) {
          apiUrl = `https://phimapi.com/v1/api/tim-kiem?keyword=${encodeURIComponent(
            debouncedKeyword
          )}&page=${currentPage}`;
        } else {
          // Ngược lại gọi API theo Thể loại và các tham số lọc quốc gia, năm
          const countryParam = selectedCountry ? `&country=${selectedCountry}` : "";
          const yearParam = selectedYear ? `&year=${selectedYear}` : "";
          apiUrl = `https://phimapi.com/v1/api/the-loai/${selectedGenre}?page=${currentPage}${countryParam}${yearParam}`;
        }

        const res = await fetch(apiUrl);
        const data = await res.json();
        
        if (data && data.status && data.data) {
          setMovies(data.data.items || []);
          
          const pagination = data.data.params?.pagination;
          if (pagination) {
            setTotalPages(pagination.totalPages || 1);
          } else {
            setTotalPages(1);
          }
        } else {
          setMovies([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách phim:", error);
        setMovies([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesList();
  }, [debouncedKeyword, selectedGenre, selectedCountry, selectedYear, currentPage]);

  // Hàm xử lý khi mở Modal xem chi tiết tập phim & server phát
  const handleViewDetails = async (slug: string) => {
    setIsModalOpen(true);
    setLoadingDetail(true);
    setMovieDetail(null);
    setSelectedServerIndex(0);
    setCopiedLink("");
    try {
      const res = await fetch(`https://phimapi.com/phim/${slug}`);
      const data = await res.json();
      if (data && data.status && data.movie) {
        setMovieDetail({
          movie: data.movie,
          episodes: data.episodes || [],
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải chi tiết phim:", error);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Hàm đặt lại toàn bộ bộ lọc về trạng thái ban đầu
  const handleResetFilters = () => {
    setKeyword("");
    setSelectedGenre("hanh-dong");
    setSelectedCountry("");
    setSelectedYear("");
    setCurrentPage(1);
  };

  // Hàm sao chép link stream vào clipboard
  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);
    setTimeout(() => setCopiedLink(""), 2000);
  };

  return (
    <div className="flex flex-col h-full font-sans">
      {/* Header trang */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Film className="text-[#ff8300]" size={24} />
            <span>Quản lý danh sách phim</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
            Duyệt, tìm kiếm và kiểm duyệt nguồn phim trực tiếp từ hệ sinh thái KKPhim API.
          </p>
        </div>
      </div>

      {/* Bộ lọc phim */}
      <MovieFilterBar
        keyword={keyword}
        onKeywordChange={setKeyword}
        selectedGenre={selectedGenre}
        onGenreChange={setSelectedGenre}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        onReset={handleResetFilters}
      />

      {/* Bảng phim */}
      <MovieTable
        movies={movies}
        loading={loading}
        onViewDetails={handleViewDetails}
      />

      {/* Phân trang */}
      {!loading && movies.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Modal chi tiết và link stream tập phim */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={movieDetail ? movieDetail.movie.name : "Đang tải chi tiết..."}
        size="lg"
      >
        {loadingDetail ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-[#ff8300]" size={40} />
            <span className="text-sm text-slate-500">Đang đồng bộ chi tiết tập phim...</span>
          </div>
        ) : movieDetail ? (
          <div className="flex flex-col gap-6 text-sm text-slate-600 dark:text-slate-300">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Ảnh bìa */}
              <div className="col-span-1">
                <div className="w-full aspect-2/3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-800 shadow">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={movieDetail.movie.poster_url || movieDetail.movie.thumb_url}
                    alt={movieDetail.movie.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300";
                    }}
                  />
                </div>
              </div>

              {/* Thông tin mô tả */}
              <div className="col-span-3 flex flex-col gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                    {movieDetail.movie.name}
                  </h2>
                  <h4 className="text-xs text-slate-500 font-semibold dark:text-slate-400 mt-0.5">
                    {movieDetail.movie.origin_name} ({movieDetail.movie.year})
                  </h4>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ff8300]/10 text-[#ff8300] uppercase tracking-wider">
                    {movieDetail.movie.type === "series" ? "Phim Bộ" : "Phim Lẻ"}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 uppercase tracking-wider">
                    {movieDetail.movie.status === "ongoing" ? "Đang chiếu" : "Hoàn thành"}
                  </span>
                  {movieDetail.movie.episode_current && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500 uppercase tracking-wider">
                      {movieDetail.movie.episode_current}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs">
                  <p><span className="font-semibold text-slate-800 dark:text-white">Đạo diễn:</span> {movieDetail.movie.director?.join(", ") || "N/A"}</p>
                  <p><span className="font-semibold text-slate-800 dark:text-white">Diễn viên:</span> {movieDetail.movie.actor?.slice(0, 8).join(", ") || "N/A"}</p>
                  <p><span className="font-semibold text-slate-800 dark:text-white">Thể loại:</span> {movieDetail.movie.category?.map((c: any) => c.name).join(", ") || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Nội dung tóm tắt */}
            <div className="space-y-1.5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <h5 className="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider">
                Nội dung phim
              </h5>
              <p className="text-xs leading-relaxed text-justify text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/20 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                {movieDetail.movie.content ? movieDetail.movie.content.replace(/<[^>]*>/g, "") : "Chưa có mô tả nội dung."}
              </p>
            </div>

            {/* Danh sách tập phim & servers */}
            {movieDetail.episodes && movieDetail.episodes.length > 0 ? (
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider">
                    Danh sách tập phim & Link Server
                  </h5>
                  {/* Select Server nếu phim có nhiều server phát */}
                  {movieDetail.episodes.length > 1 && (
                    <select
                      value={selectedServerIndex}
                      onChange={(e) => setSelectedServerIndex(Number(e.target.value))}
                      className="bg-slate-100 border border-slate-200 rounded-lg py-1 px-2.5 text-xs focus:outline-none dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
                    >
                      {movieDetail.episodes.map((server: any, idx: number) => (
                        <option key={idx} value={idx}>
                          {server.server_name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/20 rounded-xl p-4 border border-slate-200/50 dark:border-slate-800/50">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle size={14} className="text-emerald-500" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Server phát hiện tại: {movieDetail.episodes[selectedServerIndex]?.server_name}
                    </span>
                  </div>

                  {/* Danh sách tập dưới dạng Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1">
                    {movieDetail.episodes[selectedServerIndex]?.server_data?.map((ep: any, idx: number) => {
                      const isCopied = copiedLink === ep.link_m3u8 || copiedLink === ep.link_embed;

                      return (
                        <div
                          key={idx}
                          className="flex flex-col justify-between border border-slate-200 rounded-lg p-2 bg-white hover:border-[#ff8300]/50 transition-all dark:bg-slate-900 dark:border-slate-800"
                        >
                          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block truncate">
                            {ep.name || `Tập ${idx + 1}`}
                          </span>
                          <div className="flex gap-1.5 mt-2 justify-end">
                            {/* Copy HLS link */}
                            {ep.link_m3u8 && (
                              <button
                                onClick={() => handleCopyLink(ep.link_m3u8)}
                                className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-[#ff8300] dark:bg-slate-800 dark:text-slate-400"
                                title="Copy link M3U8 (HLS)"
                              >
                                {isCopied && copiedLink === ep.link_m3u8 ? (
                                  <Check size={10} className="text-emerald-500" />
                                ) : (
                                  <Copy size={10} />
                                )}
                              </button>
                            )}
                            {/* Copy Embed link */}
                            {ep.link_embed && (
                              <button
                                onClick={() => handleCopyLink(ep.link_embed)}
                                className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-blue-500 dark:bg-slate-800 dark:text-slate-400"
                                title="Copy link Embed iframe"
                              >
                                {isCopied && copiedLink === ep.link_embed ? (
                                  <Check size={10} className="text-emerald-500" />
                                ) : (
                                  <span className="text-[8px] font-bold">EMB</span>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800/80">
                Chưa có danh sách tập phim nào cho bộ phim này.
              </div>
            )}
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
