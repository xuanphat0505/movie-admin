"use client";

import { useState } from "react";
import { CategoryHeader, CategoryTab,CategoryList } from "@/components/categories";
import { GENRES, COUNTRIES } from "@/constants/categoryConstant";

export type Category = {
  name: string;
  slug: string;
  count: number;
  percentage: number;
};

// Trang quản lý danh mục và phân tích danh mục/quốc gia
export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState<"genres" | "countries">("genres");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Lấy danh sách hiển thị tương ứng với tab đang chọn và lọc theo từ khóa tìm kiếm
  const currentList = activeTab === "genres" ? GENRES : COUNTRIES;
  const filteredList = currentList.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full font-sans">
      {/* Header giới thiệu trang */}
      <CategoryHeader />

      {/* Tabs điều hướng và thanh tìm kiếm */}
      <CategoryTab
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        genresCount={GENRES.length}
        countriesCount={COUNTRIES.length}
      />

      {/* Grid danh sách thẻ danh mục */}
      {filteredList.length > 0 ? (
        <CategoryList filteredList={filteredList} activeTab={activeTab} />
      ) : (
        <div className="text-center py-20 text-slate-450 dark:text-slate-550 bg-white border border-slate-200 rounded-2xl dark:bg-slate-900/40 dark:border-slate-900/60">
          Không tìm thấy danh mục hay quốc gia nào khớp với từ khóa tìm kiếm.
        </div>
      )}
    </div>
  );
}
