import { prisma } from "@/src/lib/prisma";
import CheckoutPageClient from "@/src/ui/checkout/CheckoutPageClient";

export const runtime = "nodejs";

type PageProps = {
  searchParams?: Promise<{ store?: string }> | { store?: string };
};

export default async function CheckoutPage({ searchParams }: PageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const slug = typeof resolvedParams.store === "string" ? resolvedParams.store : "";

  const storeMeta = slug
    ? await prisma.store.findUnique({
        where: { slug },
        select: {
          slug: true,
          name: true,
          deliveryCharges: true,
          freeDeliveryThreshold: true,
        },
      })
    : null;

  return (
    <div className="min-h-screen bg-[#f8f5f0] font-sans text-[#0f1b2d]">
      <CheckoutPageClient storeMeta={storeMeta} />
    </div>
  );
}
