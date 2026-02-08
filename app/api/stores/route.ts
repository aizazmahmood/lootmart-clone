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

export async function GET() {
  try {
    const stores = await prisma.store.findMany({
      orderBy: { name: "asc" },
      select: storeSelect,
    });

    return jsonWithCache(stores);
  } catch (error) {
    console.error(
      JSON.stringify({
        route: "/api/stores",
        message: "GET /api/stores failed",
        error: error instanceof Error ? error.message : String(error),
      }),
    );
    return jsonError("Internal Server Error", 500);
  }
}

// curl -s http://localhost:3000/api/stores
