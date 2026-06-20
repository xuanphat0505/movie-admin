"use client";

import { useState, useEffect } from "react";
import { kkphimApi } from "@/apis/kkphimApi";
import { type Movie } from "@/components/common/GenericMovieTable";

interface UseMoviesOptions {
  type?: "catalog" | "recent";
}

// Hook useMovies đóng gói toàn bộ state quản lý bộ lọc, phân trang, danh sách phim và tải chi tiết tập phim
export function useMovies(options?: UseMoviesOptions) {
  const type = options?.type || "catalog";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // States quản lý bộ lọc và phân trang
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

  // Hook đọc tham số từ URL khi người dùng chuyển hướng từ trang khác tới
  useEffect(() => {
    if (type !== "catalog") return;

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const genreParam = params.get("genre");
      const countryParam = params.get("country");
      if (genreParam) {
        setSelectedGenre(genreParam);
      }
      if (countryParam) {
        setSelectedCountry(countryParam);
      }
    }
  }, [type]);

  // Hook xử lý Debounce cho ô nhập từ khóa tìm kiếm để tránh gửi request liên tục
  useEffect(() => {
    if (type !== "catalog") return;

    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setCurrentPage(1);
    }, 600);

    return () => clearTimeout(handler);
  }, [keyword, type]);

  // Hook tự động đưa trang hiện tại về 1 khi bất kỳ bộ lọc nào thay đổi
  useEffect(() => {
    if (type !== "catalog") return;
    setCurrentPage(1);
  }, [selectedGenre, selectedCountry, selectedYear, type]);

  // Hook gọi API tải danh sách phim mỗi khi các tham số lọc hoặc số trang thay đổi
  useEffect(() => {
    const fetchMoviesList = async () => {
      setLoading(true);
      try {
        let data;
        if (type === "recent") {
          data = await kkphimApi.getRecentMovies(currentPage);
        } else {
          if (debouncedKeyword.trim()) {
            data = await kkphimApi.searchMovies(debouncedKeyword, currentPage);
          } else {
            data = await kkphimApi.getMovies(
              selectedGenre,
              currentPage,
              selectedCountry,
              selectedYear
            );
          }
        }

        if (type === "recent") {
          if (data && data.items) {
            setMovies(data.items || []);
            if (data.pagination) {
              setTotalPages(data.pagination.totalPages || 1);
            } else {
              setTotalPages(1);
            }
          } else {
            setMovies([]);
            setTotalPages(1);
          }
        } else {
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
  }, [
    type,
    debouncedKeyword,
    selectedGenre,
    selectedCountry,
    selectedYear,
    currentPage,
  ]);

  // Hàm tải thông tin chi tiết của bộ phim từ slug và mở modal hiển thị
  const handleViewDetails = async (slug: string) => {
    setIsModalOpen(true);
    setLoadingDetail(true);
    setMovieDetail(null);
    try {
      const data = await kkphimApi.getMovieDetail(slug);
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

  // Hàm đặt lại toàn bộ bộ lọc và trang hiện tại về trạng thái mặc định
  const handleResetFilters = () => {
    setKeyword("");
    setSelectedGenre("hanh-dong");
    setSelectedCountry("");
    setSelectedYear("");
    setCurrentPage(1);
  };

  return {
    movies,
    loading,
    keyword,
    setKeyword,
    selectedGenre,
    setSelectedGenre,
    selectedCountry,
    setSelectedCountry,
    selectedYear,
    setSelectedYear,
    currentPage,
    setCurrentPage,
    totalPages,
    isModalOpen,
    setIsModalOpen,
    movieDetail,
    loadingDetail,
    handleViewDetails,
    handleResetFilters,
  };
}
