"use client";

import Image from "next/image";
import type { CartItem } from "@/src/ui/cart/cartStore";
import { useCartStore } from "@/src/ui/cart/cartStore";

type CartItemRowProps = {
  item: CartItem;
};

function resolveImageSrc(item: CartItem) {
  if (item.primaryImagePath) {
    return { src: `/${item.primaryImagePath}`, isLocal: true };
  }
  if (item.primaryImageUrl) {
    return { src: item.primaryImageUrl, isLocal: false };
  }
  return { src: "", isLocal: false };
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const inc = useCartStore((state) => state.inc);
  const dec = useCartStore((state) => state.dec);
  const remove = useCartStore((state) => state.remove);
  const image = resolveImageSrc(item);

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#efe6da] bg-white p-3">
      <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-[#f4efe8]">
        {image.src ? (
          image.isLocal ? (
            <Image
              src={image.src}
              alt={item.title}
              fill
              sizes="56px"
              className="object-contain"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.src}
              alt={item.title}
              className="h-full w-full object-contain"
            />
          )
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] text-[#9aa3b2]">
            No image
          </div>
        )}
      </div>

      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#9aa3b2]">
          {item.brandName ?? "Lootmart"}
        </p>
        <p className="text-sm font-semibold text-[#1f2a44]">{item.title}</p>
        <p className="text-xs text-[#6b7280]">Rs. {item.price}</p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2 rounded-full border border-[#efe6da] bg-[#fbf8f3] px-2 py-1">
          <button
            type="button"
            onClick={() => dec(item.productId)}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#1b2a3b] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c44f]"
            aria-label={`Decrease quantity of ${item.title}`}
          >
            −
          </button>
          <span className="min-w-[20px] text-center text-sm font-semibold text-[#1f2a44]">
            {item.qty}
          </span>
          <button
            type="button"
            onClick={() => inc(item.productId)}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#1b2a3b] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c44f]"
            aria-label={`Increase quantity of ${item.title}`}
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={() => remove(item.productId)}
          className="text-xs font-semibold text-[#b42318] hover:text-[#8f1f16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c44f]"
          aria-label={`Remove ${item.title}`}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
