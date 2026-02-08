export type ProductItem = {
  id: number;
  title: string;
  price: number;
  currency: string;
  inStock: boolean;
  isLessThan10: boolean;
  reviewCount: number;
  averageRating: number;
  primaryImagePath: string | null;
  primaryImageUrl: string | null;
  brand: { id: number; name: string } | null;
};

export type ProductsResponse = {
  store: { id: number; slug: string; name: string };
  items: ProductItem[];
  nextCursor: number | null;
};

export type ViewMode = "grid" | "list";

export type SortOption = "relevance" | "price_asc" | "price_desc" | "newest";
