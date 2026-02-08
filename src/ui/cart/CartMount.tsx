"use client";

import dynamic from "next/dynamic";

const CartDrawer = dynamic(() => import("@/src/ui/cart/CartDrawer"), {
  ssr: false,
});

export default function CartMount() {
  return <CartDrawer />;
}
