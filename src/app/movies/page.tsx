"use client";

import { useState } from "react";
import {
  MovieHeader,
  MovieFilterBar,
  Pagination,
  MovieTable,
  ModalMovie,
  AddNewMovieModal,
} from "@/components/movies";
import { useMovies } from "@/hooks/useMovies";
import { toast } from "@/utils/toast";

// Trang quản lý phim, hiển thị danh sách phim và các thao tác lọc/tìm kiếm
export default function MoviesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const {
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
  } = useMovies();

  // Xử lý khi thêm phim mới thành công
  const handleAddMovie = (movieData: any) => {
    console.log("Dữ liệu phim mới:", movieData);
    toast.success(`Đã thêm phim "${movieData.name}" thành công (Mock)!`);
  };

  return (
    <div className="flex flex-col h-full font-sans">
      {/* Header trang */}
      <MovieHeader onOpenAddModal={() => setIsAddModalOpen(true)} />

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
      {!loading && movies && movies.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Modal chi tiết và link stream tập phim */}
      <ModalMovie
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movieDetail={movieDetail}
        loadingDetail={loadingDetail}
      />

      {/* Modal thêm phim mới */}
      <AddNewMovieModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMovie}
      />
    </div>
  );
}
