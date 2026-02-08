import { Prisma } from "@prisma/client";
import { prisma } from "@/src/lib/prisma";
import { jsonError, jsonWithCache } from "@/src/lib/http";

export const runtime = "nodejs";

const storeSelect = {
  id: true,
  slug: true,
  name: true,
  description: true,
  storeType: true,
  sameDayDelivery: true,
  deliveryCharges: true,
  minOrderValue: true,
  freeDeliveryThreshold: true,
} satisfies Prisma.StoreSelect;

type RouteContext = {
  params: Promise<{
    slug?: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const normalizedSlug = typeof slug === "string" ? slug.trim() : "";

  if (!normalizedSlug) {
    return jsonError("Invalid slug", 400);
  }

  try {
    const store = await prisma.store.findUnique({
      where: { slug: normalizedSlug },
      select: storeSelect,
    });

    if (!store) {
      return jsonError("Store not found", 404);
    }

    return jsonWithCache(store);
  } catch (error) {
    console.error("GET /api/stores/[slug] failed", error);
    return jsonError("Internal Server Error", 500);
  }
}

// curl -s http://localhost:3000/api/stores/hash-mart
