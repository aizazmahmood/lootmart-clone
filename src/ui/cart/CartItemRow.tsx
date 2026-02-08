"use client";

import Image from "next/image";
import type { CartItem } from "@/src/ui/cart/cartStore";
import { useCartStore } from "@/src/ui/cart/cartStore";
import { Button } from "@/src/ui/primitives/Button";
import { Card } from "@/src/ui/primitives/Card";

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
    <Card className="flex items-center gap-4 rounded-2xl p-3 shadow-[0_8px_20px_rgba(17,24,39,0.06)]">
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
          <Button
            type="button"
            onClick={() => dec(item.productId)}
            variant="secondary"
            size="sm"
            className="h-6 w-6 rounded-full p-0 text-sm"
            aria-label={`Decrease quantity of ${item.title}`}
          >
            −
          </Button>
          <span className="min-w-[20px] text-center text-sm font-semibold text-[#1f2a44]">
            {item.qty}
          </span>
          <Button
            type="button"
            onClick={() => inc(item.productId)}
            variant="secondary"
            size="sm"
            className="h-6 w-6 rounded-full p-0 text-sm"
            aria-label={`Increase quantity of ${item.title}`}
          >
            +
          </Button>
        </div>
        <Button
          type="button"
          onClick={() => remove(item.productId)}
          variant="ghost"
          size="sm"
          className="h-auto px-2 py-1 text-xs text-[#b42318] hover:text-[#8f1f16]"
          aria-label={`Remove ${item.title}`}
        >
          ✕
        </Button>
      </div>
    </Card>
  );
}
