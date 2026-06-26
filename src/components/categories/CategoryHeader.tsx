import { Tags } from "lucide-react";
import { PageHeader } from "@/components/common";

export default function CategoryHeader() {
  return (
    <PageHeader
      title="Danh mục Thể loại & Quốc gia"
      description="Phân tích thống kê số lượng nguồn phim đã đồng bộ theo từng danh mục phân loại từ hệ sinh thái phim."
      icon={Tags}
    />
  );
}
