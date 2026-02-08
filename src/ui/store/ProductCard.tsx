"use client";

import Image from "next/image";
import type { ProductItem, ViewMode } from "@/src/ui/store/types";
import { useCartStore } from "@/src/ui/cart/cartStore";
import { Button } from "@/src/ui/primitives/Button";
import { Card } from "@/src/ui/primitives/Card";

type ProductCardProps = {
  product: ProductItem;
  view: ViewMode;
  storeSlug: string;
  storeName?: string;
};

function resolveImageSrc(product: ProductItem) {
  if (product.primaryImagePath) {
    return { src: `/${product.primaryImagePath}`, isLocal: true };
  }
  if (product.primaryImageUrl) {
    return { src: product.primaryImageUrl, isLocal: false };
  }
  return { src: "", isLocal: false };
}

export default function ProductCard({
  product,
  view,
  storeSlug,
  storeName,
}: ProductCardProps) {
  const image = resolveImageSrc(product);
  const isList = view === "list";
  const sizes = isList
    ? "96px"
    : "(min-width: 1536px) 220px, (min-width: 1280px) 200px, (min-width: 1024px) 180px, (min-width: 640px) 160px, 50vw";
  const qty = useCartStore((state) => state.items[product.id]?.qty ?? 0);
  const addItem = useCartStore((state) => state.addItem);
  const inc = useCartStore((state) => state.inc);
  const dec = useCartStore((state) => state.dec);

  const payload = {
    productId: product.id,
    title: product.title,
    price: product.price,
    primaryImagePath: product.primaryImagePath ?? null,
    primaryImageUrl: product.primaryImageUrl ?? null,
    brandName: product.brand?.name ?? null,
  };

  return (
    <Card
      className={`flex rounded-2xl p-4 shadow-[0_8px_20px_rgba(17,24,39,0.06)] ${
        isList ? "flex-row gap-4" : "flex-col gap-3"
      }`}
    >
      <div
        className={`relative overflow-hidden rounded-xl bg-[#f4efe8] ${
          isList ? "h-24 w-24" : "h-40 w-full"
        }`}
      >
        {image.src ? (
          <Image
            src={image.src}
            alt={product.title}
            fill
            sizes={sizes}
            loading="lazy"
            placeholder="empty"
            className="object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-[#9aa3b2]">
            No image
          </div>
        )}
        {!product.inStock ? (
          <span className="absolute left-3 top-3 rounded-full bg-[#ffe4e4] px-2 py-1 text-[10px] font-semibold text-[#b42318]">
            Out of stock
          </span>
        ) : null}
      </div>

      <div className={`flex flex-1 flex-col ${isList ? "gap-2" : "gap-1"}`}>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#9aa3b2]">
          {product.brand?.name ?? "Lootmart"}
        </p>
        <h3
          className="min-h-[2.5rem] text-sm font-semibold text-[#1f2a44]"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.title}
        </h3>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm font-semibold text-[#0f1b2d]">
            Rs. {product.price}
          </span>
          {qty === 0 ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => addItem(payload, storeSlug, storeName)}
              className="border-[#f4c44f] text-[#1b2a3b]"
            >
              Add
            </Button>
          ) : (
            <div className="flex items-center gap-2 rounded-full border border-[#efe6da] bg-[#fbf8f3] px-2 py-1">
              <Button
                type="button"
                onClick={() => dec(product.id)}
                variant="secondary"
                size="sm"
                className="h-6 w-6 rounded-full p-0"
                aria-label={`Decrease quantity of ${product.title}`}
              >
                −
              </Button>
              <span className="min-w-[18px] text-center text-xs font-semibold text-[#1f2a44]">
                {qty}
              </span>
              <Button
                type="button"
                onClick={() => inc(product.id)}
                variant="secondary"
                size="sm"
                className="h-6 w-6 rounded-full p-0"
                aria-label={`Increase quantity of ${product.title}`}
              >
                +
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
