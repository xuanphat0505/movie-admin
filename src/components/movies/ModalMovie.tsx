"use client";

import { useState, useEffect } from "react";
import { Loader2, CheckCircle, Copy, Check } from "lucide-react";
import Modal from "@/components/common/Modal";

interface ModalMovieProps {
  isOpen: boolean;
  onClose: () => void;
  movieDetail: any;
  loadingDetail: boolean;
}

// Component ModalMovie hiển thị thông tin chi tiết của phim và danh sách link stream các tập phim
export default function ModalMovie({
  isOpen,
  onClose,
  movieDetail,
  loadingDetail,
}: ModalMovieProps) {
  const [selectedServerIndex, setSelectedServerIndex] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState<string>("");

  // Hook reset lại server index và trạng thái copy mỗi khi đóng modal hoặc đổi phim khác
  useEffect(() => {
    if (!isOpen || !movieDetail) {
      setSelectedServerIndex(0);
      setCopiedLink("");
    }
  }, [isOpen, movieDetail]);

  // Hàm thực hiện sao chép link tập phim và thông báo thành công trong 2 giây
  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);
    setTimeout(() => setCopiedLink(""), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={movieDetail ? movieDetail.movie.name : "Đang tải chi tiết..."}
      size="lg"
    >
      {loadingDetail ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="animate-spin text-[#ff8300]" size={40} />
          <span className="text-sm text-slate-500">
            Đang đồng bộ chi tiết tập phim...
          </span>
        </div>
      ) : movieDetail ? (
        <div className="flex flex-col gap-6 text-sm text-slate-600 dark:text-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Ảnh bìa */}
            <div className="col-span-1">
              <div className="w-full aspect-2/3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-800 shadow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    movieDetail.movie.poster_url ||
                    movieDetail.movie.thumb_url
                  }
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
                  {movieDetail.movie.status === "ongoing"
                    ? "Đang chiếu"
                    : "Hoàn thành"}
                </span>
                {movieDetail.movie.episode_current && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500 uppercase tracking-wider">
                    {movieDetail.movie.episode_current}
                  </span>
                )}
              </div>

              <div className="space-y-1.5 text-xs">
                <p>
                  <span className="font-semibold text-slate-800 dark:text-white">
                    Đạo diễn:
                  </span>{" "}
                  {movieDetail.movie.director?.join(", ") || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-slate-800 dark:text-white">
                    Diễn viên:
                  </span>{" "}
                  {movieDetail.movie.actor?.slice(0, 8).join(", ") || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-slate-800 dark:text-white">
                    Thể loại:
                  </span>{" "}
                  {movieDetail.movie.category
                    ?.map((c: any) => c.name)
                    .join(", ") || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Nội dung tóm tắt */}
          <div className="space-y-1.5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <h5 className="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider">
              Nội dung phim
            </h5>
            <p className="text-xs leading-relaxed text-justify text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/20 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
              {movieDetail.movie.content
                ? movieDetail.movie.content.replace(/<[^>]*>/g, "")
                : "Chưa có mô tả nội dung."}
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
                    onChange={(e) =>
                      setSelectedServerIndex(Number(e.target.value))
                    }
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
                    Server phát hiện tại:{" "}
                    {movieDetail.episodes[selectedServerIndex]?.server_name}
                  </span>
                </div>

                {/* Danh sách tập dưới dạng Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1">
                  {movieDetail.episodes[
                    selectedServerIndex
                  ]?.server_data?.map((ep: any, idx: number) => {
                    const isCopied =
                      copiedLink === ep.link_m3u8 ||
                      copiedLink === ep.link_embed;

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
                                <span className="text-[8px] font-bold">
                                  EMB
                                </span>
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
  );
}
