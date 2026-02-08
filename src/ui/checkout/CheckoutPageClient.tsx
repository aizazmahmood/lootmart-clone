"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CheckoutForm from "@/src/ui/checkout/CheckoutForm";
import OrderSummary from "@/src/ui/checkout/OrderSummary";
import { useCartStore } from "@/src/ui/cart/cartStore";
import { Button } from "@/src/ui/primitives/Button";
import { Card } from "@/src/ui/primitives/Card";
import useHydrated from "@/src/ui/hooks/useHydrated";

type StoreMeta = {
  slug: string;
  name: string;
  deliveryCharges: number | null;
  freeDeliveryThreshold: number | null;
} | null;

type CheckoutPageClientProps = {
  storeMeta: StoreMeta;
};

export default function CheckoutPageClient({ storeMeta }: CheckoutPageClientProps) {
  const router = useRouter();
  const hydrate = useCartStore((state) => state.hydrate);
  const storeSlug = useCartStore((state) => state.storeSlug);
  const storeName = useCartStore((state) => state.storeName);
  const totalItems = useCartStore((state) => state.totalItems);
  const clear = useCartStore((state) => state.clear);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const hydrated = useHydrated();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");

  useEffect(() => {
    if (hydrated) {
      hydrate();
    }
  }, [hydrate, hydrated]);

  const displayStoreName = useMemo(() => {
    if (storeName) return storeName;
    if (storeMeta?.name) return storeMeta.name;
    if (storeSlug) return storeSlug;
    return "your store";
  }, [storeName, storeMeta?.name, storeSlug]);

  const hasItems = hasHydrated && totalItems > 0 && !!storeSlug;

  if (!hydrated || !hasHydrated) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-3">
          <div className="h-7 w-40 rounded-full bg-[#eadfcf]" />
          <div className="h-4 w-56 rounded-full bg-[#eadfcf]" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="h-96 rounded-3xl border border-[#efe6da] bg-white" />
          <div className="h-80 rounded-3xl border border-[#efe6da] bg-white" />
        </div>
      </div>
    );
  }

  if (!hasItems) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <Card className="p-10 text-center shadow-[0_18px_40px_rgba(17,24,39,0.08)]">
          <h1 className="text-2xl font-semibold text-[#0f1b2d]">Checkout</h1>
          <p className="mt-3 text-sm text-[#6b7280]">
            Your cart is empty. Add items from a store to proceed.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Back to stores</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    if (!phone.trim()) return;
    // UI-only confirmation
    window.alert("Order placed (demo)");
    clear();
    router.push("/");
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-semibold text-[#0f1b2d]">Checkout</h1>
        <p className="mt-2 text-sm text-[#6b7280]">
          {totalItems} items from {displayStoreName}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <CheckoutForm
          phone={phone}
          name={name}
          paymentMethod={paymentMethod}
          onPhoneChange={setPhone}
          onNameChange={setName}
          onPaymentMethodChange={setPaymentMethod}
        />
        <OrderSummary
          phone={phone}
          paymentMethod={paymentMethod}
          storeMeta={storeMeta}
          onPlaceOrder={handlePlaceOrder}
        />
      </div>
    </div>
  );
}
