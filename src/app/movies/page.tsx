"use client";

import {
  MovieHeader,
  MovieFilterBar,
  Pagination,
  MovieTable,
  ModalMovie,
} from "@/components/movies";
import { useMovies } from "@/hooks/useMovies";

// Trang quản lý phim, hiển thị danh sách phim và các thao tác lọc/tìm kiếm
export default function MoviesPage() {
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

  return (
    <div className="flex flex-col h-full font-sans">
      {/* Header trang */}
      <MovieHeader />

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
      <ModalMovie
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movieDetail={movieDetail}
        loadingDetail={loadingDetail}
      />
    </div>
  );
}
