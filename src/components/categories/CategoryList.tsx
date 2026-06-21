import { Category } from "@/app/categories/page";
import { CategoryCard } from "@/components/categories";

interface CategoryListProps {
  filteredList: Category[];
  activeTab: "genres" | "countries";
}

export default function CategoryList({
  filteredList,
  activeTab,
}: CategoryListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredList.map((item: Category) => {
        const redirectUrl =
          activeTab === "genres"
            ? `/movies?genre=${item.slug}`
            : `/movies?country=${item.slug}`;

        return (
          <CategoryCard
            key={item.slug}
            item={item}
            activeTab={activeTab}
            redirectUrl={redirectUrl}
          />
        );
      })}
    </div>
  );
}
