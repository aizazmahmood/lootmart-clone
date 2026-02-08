"use client";

import { useEffect, useId, useMemo, useState } from "react";
import StoreSearchBar from "@/src/ui/store/StoreSearchBar";
import StoreFilters from "@/src/ui/store/StoreFilters";
import ProductGrid from "@/src/ui/store/ProductGrid";
import type { CategoryChip, SortOption, ViewMode } from "@/src/ui/store/types";
import { useCartStore } from "@/src/ui/cart/cartStore";

type StoreBrowseSectionProps = {
  storeSlug: string;
  storeName: string;
  categories: CategoryChip[];
};

export default function StoreBrowseSection({
  storeSlug,
  storeName,
  categories,
}: StoreBrowseSectionProps) {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [view, setView] = useState<ViewMode>("grid");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("relevance");
  const categoriesLoading = false;
  const searchInputId = useId();
  const openCart = useCartStore((state) => state.open);
  const closeCart = useCartStore((state) => state.close);

  useEffect(() => {
    const isEditableTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toLowerCase();
      return (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target.isContentEditable
      );
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isEditableTarget(event.target)) {
        return;
      }

      if (event.key === "/") {
        event.preventDefault();
        const input = document.getElementById(searchInputId) as HTMLInputElement | null;
        input?.focus();
      }

      if (event.key.toLowerCase() === "c") {
        openCart();
      }

      if (event.key === "Escape") {
        closeCart();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [searchInputId, openCart, closeCart]);

  const activeCategory = useMemo(
    () => categories.find((cat) => cat.id === categoryId) ?? null,
    [categories, categoryId],
  );

  const handleCategorySelect = (nextId: number | null) => {
    setCategoryId(nextId);
    setQuery("");
  };

  const handleQuickSearch = (term: string) => {
    setQuery(term);
    setCategoryId(null);
  };

  return (
    <section className="flex flex-col gap-6">
      <StoreSearchBar
        storeName={storeName}
        query={query}
        inputId={searchInputId}
        onQueryChange={(value) => {
          setQuery(value);
          if (value.trim()) setCategoryId(null);
        }}
        categories={categories}
        categoriesLoading={categoriesLoading}
        activeCategory={activeCategory}
        onCategorySelect={handleCategorySelect}
        onQuickSearch={handleQuickSearch}
      />
      <StoreFilters
        view={view}
        onViewChange={setView}
        inStockOnly={inStockOnly}
        onInStockChange={setInStockOnly}
        sort={sort}
        onSortChange={setSort}
      />
      <ProductGrid
        storeSlug={storeSlug}
        storeName={storeName}
        categoryId={categoryId}
        query={query}
        inStockOnly={inStockOnly}
        sort={sort}
        view={view}
      />
    </section>
  );
}
