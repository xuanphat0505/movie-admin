"use client";

import { GenericMovieTable } from "@/components/common";
import { ModalMovie } from "@/components/movies";
import { useMovies } from "@/hooks/useMovies";
import Link from "next/link";

export default function NewMoviesTable() {
  const {
    movies,
    loading,
    isModalOpen,
    setIsModalOpen,
    movieDetail,
    loadingDetail,
    handleViewDetails,
  } = useMovies({ type: "recent" });

  return (
    <div className="w-full">
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

      {/* Tái sử dụng ModalMovie chi tiết tập phim */}
      <ModalMovie
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movieDetail={movieDetail}
        loadingDetail={loadingDetail}
      />
    </div>
  );
}
