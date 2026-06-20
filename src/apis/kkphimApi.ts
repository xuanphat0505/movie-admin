// Định nghĩa base URL cho KKPhim API dùng chung
const KKPHIM_BASE_URL = "https://phimapi.com";

export const kkphimApi = {
  // Lấy danh sách phim theo thể loại kết hợp phân trang và các bộ lọc phụ
  getMovies: async (
    genre: string,
    page: number,
    country?: string,
    year?: string
  ) => {
    const countryParam = country ? `&country=${country}` : "";
    const yearParam = year ? `&year=${year}` : "";
    const res = await fetch(
      `${KKPHIM_BASE_URL}/v1/api/the-loai/${genre}?page=${page}${countryParam}${yearParam}`
    );
    return res.json();
  },

  // Tìm kiếm danh sách phim theo từ khóa nhập vào kết hợp phân trang
  searchMovies: async (keyword: string, page: number) => {
    const res = await fetch(
      `${KKPHIM_BASE_URL}/v1/api/tim-kiem?keyword=${encodeURIComponent(
        keyword
      )}&page=${page}`
    );
    return res.json();
  },

  // Lấy thông tin chi tiết của một bộ phim bao gồm danh sách tập phim và các link stream
  getMovieDetail: async (slug: string) => {
    const res = await fetch(`${KKPHIM_BASE_URL}/phim/${slug}`);
    return res.json();
  },

  // Lấy danh sách phim mới cập nhật gần đây nhất từ trang chủ
  getRecentMovies: async (page: number = 1) => {
    const res = await fetch(
      `${KKPHIM_BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${page}`
    );
    return res.json();
  },
};
