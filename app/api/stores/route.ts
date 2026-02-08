import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/src/lib/prisma";
import { withCacheHeaders } from "@/src/lib/cache";

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

    return withCacheHeaders(NextResponse.json(stores));
  } catch (error) {
    console.error("GET /api/stores failed", error);
    return withCacheHeaders(
      NextResponse.json({ error: "Internal Server Error" }, { status: 500 }),
    );
  }
}

// curl -s http://localhost:3000/api/stores
