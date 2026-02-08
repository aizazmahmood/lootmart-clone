"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useCartStore } from "@/src/ui/cart/cartStore";
import { Button } from "@/src/ui/primitives/Button";
import { Card } from "@/src/ui/primitives/Card";

type StoreMeta = {
  slug: string;
  name: string;
  deliveryCharges: number | null;
  freeDeliveryThreshold: number | null;
} | null;

type OrderSummaryProps = {
  phone: string;
  paymentMethod: "cod" | "card";
  storeMeta: StoreMeta;
  onPlaceOrder: () => void;
};

function resolveImageSrc(item: {
  primaryImagePath?: string | null;
  primaryImageUrl?: string | null;
}) {
  if (item.primaryImagePath) {
    return { src: `/${item.primaryImagePath}`, isLocal: true };
  }
  if (item.primaryImageUrl) {
    return { src: item.primaryImageUrl, isLocal: false };
  }
  return { src: "", isLocal: false };
}

export default function OrderSummary({
  phone,
  paymentMethod,
  storeMeta,
  onPlaceOrder,
}: OrderSummaryProps) {
  const itemsMap = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal);

  const items = useMemo(() => Object.values(itemsMap), [itemsMap]);

  const freeThreshold = storeMeta?.freeDeliveryThreshold ?? null;
  const deliveryCharges = storeMeta?.deliveryCharges ?? null;

  const isFree = freeThreshold !== null && subtotal >= freeThreshold;
  const deliveryAmount = isFree ? 0 : deliveryCharges ?? 0;
  const total = subtotal + deliveryAmount;

  return (
    <Card className="flex h-fit flex-col gap-5 p-6">
      <h2 className="text-lg font-semibold text-[#0f1b2d]">Order Summary</h2>

      <Card variant="soft" className="rounded-2xl p-4 shadow-none">
        <p className="text-xs uppercase tracking-wide text-[#9aa3b2]">
          Payment Method
        </p>
        <p className="mt-2 text-sm font-semibold text-[#1f2a44]">
          {paymentMethod === "cod" ? "Cash on Delivery" : "Card"}
        </p>
      </Card>

      <div className="flex flex-col gap-3">
        {items.length === 0 ? (
          <Card variant="soft" className="rounded-2xl p-4 text-sm text-[#6b7280] shadow-none">
            No items in cart.
          </Card>
        ) : (
          items.map((item) => {
            const image = resolveImageSrc(item);
            return (
              <Card
                key={item.productId}
                className="flex items-center gap-3 rounded-2xl p-3 shadow-[0_8px_20px_rgba(17,24,39,0.06)]"
              >
                <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-[#f4efe8]">
                  {image.src ? (
                    image.isLocal ? (
                      <Image
                        src={image.src}
                        alt={item.title}
                        fill
                        sizes="48px"
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
                  <p className="text-sm font-semibold text-[#1f2a44]">
                    {item.title}
                  </p>
                  <p className="text-xs text-[#6b7280]">Qty {item.qty}</p>
                </div>
                <p className="text-sm font-semibold text-[#1f2a44]">
                  Rs. {item.price * item.qty}
                </p>
              </Card>
            );
          })
        )}
      </div>

      <div className="flex flex-col gap-3 text-sm font-medium text-[#1f2a44]">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span>Rs. {subtotal}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Delivery</span>
          <span>
            {isFree ? "FREE" : `Rs. ${deliveryAmount}`}
          </span>
        </div>
        <div className="flex items-center justify-between text-base font-semibold">
          <span>Total</span>
          <span>Rs. {total}</span>
        </div>
      </div>

      <Button
        type="button"
        disabled={!phone.trim()}
        onClick={onPlaceOrder}
        className="w-full"
      >
        Place Order
      </Button>
    </Card>
  );
}
