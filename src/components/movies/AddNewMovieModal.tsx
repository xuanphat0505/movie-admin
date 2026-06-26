"use client";

import { useState, useEffect } from "react";
import { Film, Image as ImageIcon, Plus, X } from "lucide-react";
import Modal from "@/components/common/Modal";

interface AddNewMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (movieData: any) => void;
}

// Component Modal thêm mới phim chứa các trường thông tin chi tiết và link server nguồn phim
export default function AddNewMovieModal({
  isOpen,
  onClose,
  onAdd,
}: AddNewMovieModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    origin_name: "",
    type: "series",
    status: "ongoing",
    year: new Date().getFullYear(),
    episode_current: "Tập 1",
    poster_url: "",
    thumb_url: "",
    director: "",
    actor: "",
    category: "",
    content: "",
    server_name: "Hải Âu",
    link_m3u8: "",
    link_embed: "",
  });

  // Reset form khi đóng hoặc mở modal
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        origin_name: "",
        type: "series",
        status: "ongoing",
        year: new Date().getFullYear(),
        episode_current: "Tập 1",
        poster_url: "",
        thumb_url: "",
        director: "",
        actor: "",
        category: "",
        content: "",
        server_name: "Hải Âu",
        link_m3u8: "",
        link_embed: "",
      });
    }
  }, [isOpen]);

  // Cập nhật giá trị các ô nhập liệu vào state chung
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý gửi biểu mẫu thêm phim mới
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên phim!");
      return;
    }
    onAdd(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Thêm phim mới" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Cột trái: Ảnh bìa và ảnh thu nhỏ */}
          <div className="lg:col-span-1 flex flex-col sm:flex-row lg:flex-col gap-4">
            <div className="w-full max-w-[200px] sm:w-[200px] lg:w-full aspect-2/3 mx-auto lg:mx-0 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-350 dark:border-slate-800 flex flex-col items-center justify-center relative shadow-sm flex-shrink-0">
              {formData.poster_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={formData.poster_url}
                  alt="Poster Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "";
                  }}
                />
              ) : (
                <div className="text-center p-4">
                  <Film
                    className="mx-auto text-slate-400 dark:text-slate-600 mb-2"
                    size={32}
                  />
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium block">
                    Ảnh Poster Preview
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3.5 w-full">
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Đường dẫn Poster
                </label>
                <input
                  type="text"
                  name="poster_url"
                  value={formData.poster_url}
                  onChange={handleChange}
                  placeholder="https://example.com/poster.jpg"
                  className="w-full bg-white border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 rounded-lg h-[34px] px-3 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-[#ff8300]/50 transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Đường dẫn Thumbnail
                </label>
                <input
                  type="text"
                  name="thumb_url"
                  value={formData.thumb_url}
                  onChange={handleChange}
                  placeholder="https://example.com/thumb.jpg"
                  className="w-full bg-white border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 rounded-lg h-[34px] px-3 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-[#ff8300]/50 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Cột phải: Các thông tin văn bản */}
          <div className="lg:col-span-3 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Tên phim <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ví dụ: Tình Yêu Không Hẹn Trước"
                  className="w-full bg-white border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 rounded-lg h-[36px] px-3 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-[#ff8300]/50 transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Tên gốc (Origin Name)
                </label>
                <input
                  type="text"
                  name="origin_name"
                  value={formData.origin_name}
                  onChange={handleChange}
                  placeholder="Ví dụ: Love Untold"
                  className="w-full bg-white border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 rounded-lg h-[36px] px-3 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-[#ff8300]/50 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Loại phim
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 rounded-lg h-[36px] px-2 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-[#ff8300]/50 transition-all"
                >
                  <option value="series">Phim Bộ</option>
                  <option value="single">Phim Lẻ</option>
                  <option value="hoat-hinh">Hoạt Hình</option>
                  <option value="tvshows">TV Show</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Trạng thái
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 rounded-lg h-[36px] px-2 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-[#ff8300]/50 transition-all"
                >
                  <option value="ongoing">Đang chiếu</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="trailer">Trailer</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Năm phát hành
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 rounded-lg h-[36px] px-3 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-[#ff8300]/50 transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Tập hiện tại
                </label>
                <input
                  type="text"
                  name="episode_current"
                  value={formData.episode_current}
                  onChange={handleChange}
                  placeholder="Ví dụ: Tập 12, Full..."
                  className="w-full bg-white border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 rounded-lg h-[36px] px-3 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-[#ff8300]/50 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Đạo diễn
                </label>
                <input
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleChange}
                  placeholder="Đạo diễn 1, Đạo diễn 2..."
                  className="w-full bg-white border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 rounded-lg h-[36px] px-3 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-[#ff8300]/50 transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Diễn viên
                </label>
                <input
                  type="text"
                  name="actor"
                  value={formData.actor}
                  onChange={handleChange}
                  placeholder="Diễn viên 1, Diễn viên 2..."
                  className="w-full bg-white border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 rounded-lg h-[36px] px-3 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-[#ff8300]/50 transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Thể loại
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Hành Động, Cổ Trang, Viễn Tưởng..."
                  className="w-full bg-white border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 rounded-lg h-[36px] px-3 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-[#ff8300]/50 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Tóm tắt nội dung phim
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={3}
                placeholder="Nhập giới thiệu tóm tắt của phim..."
                className="w-full bg-white border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 rounded-lg p-3 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-[#ff8300]/50 transition-all placeholder:text-slate-400 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Khung cấu hình link nguồn video stream */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-5 space-y-4">
          <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-[#ff8300] rounded-sm" />
            Cấu hình Server phát & Tập phim (Nguồn m3u8 / embed)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Tên Server phát
              </label>
              <input
                type="text"
                name="server_name"
                value={formData.server_name}
                onChange={handleChange}
                placeholder="Ví dụ: Vietsub, Thuyết Minh..."
                className="w-full bg-white border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 rounded-lg h-[36px] px-3 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-[#ff8300]/50 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Đường dẫn HLS (M3U8)
              </label>
              <input
                type="text"
                name="link_m3u8"
                value={formData.link_m3u8}
                onChange={handleChange}
                placeholder="https://example.com/video/index.m3u8"
                className="w-full bg-white border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 rounded-lg h-[36px] px-3 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-[#ff8300]/50 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Đường dẫn Embed (Iframe)
              </label>
              <input
                type="text"
                name="link_embed"
                value={formData.link_embed}
                onChange={handleChange}
                placeholder="https://example.com/video/embed"
                className="w-full bg-white border border-slate-200 dark:bg-slate-900/40 dark:border-slate-800/80 rounded-lg h-[36px] px-3 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-[#ff8300]/50 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Nút hành động Lưu/Hủy */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50 transition-all cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="bg-[#ff8300] hover:bg-[#ff8300]/90 text-white font-semibold text-xs py-2 px-5 rounded-lg flex items-center gap-1.5 transition-all shadow-lg shadow-[#ff8300]/10 cursor-pointer"
          >
            <Plus size={14} />
            <span>Thêm phim</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
