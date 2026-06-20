"use client";

import { GenericMovieTable } from "@/components/common";
import { type Movie } from "@/components/common/GenericMovieTable";

interface MovieTableProps {
  movies: Movie[];
  loading: boolean;
  onViewDetails: (slug: string) => void;
}

// Component MovieTable tái sử dụng lại GenericMovieTable cho danh sách phim chính
export default function MovieTable({
  movies,
  loading,
  onViewDetails,
}: MovieTableProps) {
  return (
    <GenericMovieTable
      movies={movies}
      loading={loading}
      onViewDetails={onViewDetails}
      showAddedDate={false}
      showStatus={true}
    />
  );
}
