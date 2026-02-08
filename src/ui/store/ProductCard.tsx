"use client";

import Image from "next/image";
import type { ProductItem, ViewMode } from "@/src/ui/store/types";

type ProductCardProps = {
  product: ProductItem;
  view: ViewMode;
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

export default function ProductCard({ product, view }: ProductCardProps) {
  const image = resolveImageSrc(product);
  const isList = view === "list";

  return (
    <div
      className={`flex rounded-2xl border border-[#efe6da] bg-white p-4 shadow-[0_8px_20px_rgba(17,24,39,0.06)] ${
        isList ? "flex-row gap-4" : "flex-col gap-3"
      }`}
    >
      <div
        className={`relative overflow-hidden rounded-xl bg-[#f4efe8] ${
          isList ? "h-24 w-24" : "h-40 w-full"
        }`}
      >
        {image.src ? (
          image.isLocal ? (
            <Image
              src={image.src}
              alt={product.title}
              fill
              sizes={isList ? "96px" : "240px"}
              className="object-contain"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.src}
              alt={product.title}
              className="h-full w-full object-contain"
            />
          )
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
          className="text-sm font-semibold text-[#1f2a44]"
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
          <button
            type="button"
            className="rounded-full border border-[#f4c44f] px-3 py-1 text-xs font-semibold text-[#1b2a3b] transition hover:bg-[#fef3d2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c44f]"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
