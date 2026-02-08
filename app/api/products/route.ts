import { Prisma } from "@prisma/client";
import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { jsonError } from "@/src/lib/http";
import { withCacheHeaders } from "@/src/lib/cache";

export const runtime = "nodejs";

const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 60;

const storeSelect = {
  id: true,
  slug: true,
  name: true,
} satisfies Prisma.StoreSelect;

const productSelect = {
  id: true,
  title: true,
  price: true,
  currency: true,
  inStock: true,
  isLessThan10: true,
  reviewCount: true,
  averageRating: true,
  primaryImagePath: true,
  primaryImageUrl: true,
  brand: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.ProductSelect;

const ALLOWED_SORTS = new Set(["relevance", "price_asc", "price_desc", "newest"]);

function createEtag(payload: unknown) {
  const json = JSON.stringify(payload);
  const hash = createHash("sha1").update(json).digest("base64");
  return `"${hash}"`;
}

function matchesEtag(request: Request, etag: string) {
  const ifNoneMatch = request.headers.get("if-none-match");
  if (!ifNoneMatch) return false;
  return ifNoneMatch
    .split(",")
    .map((value) => value.trim())
    .includes(etag);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const storeSlug = searchParams.get("storeSlug")?.trim() ?? "";
  if (!storeSlug) {
    return jsonError("Missing storeSlug", 400);
  }

  const qRaw = searchParams.get("q");
  const q = qRaw?.trim();

  const limitParam = searchParams.get("limit");
  let limit = DEFAULT_LIMIT;
  if (limitParam !== null) {
    const parsedLimit = Number(limitParam);
    if (
      !Number.isInteger(parsedLimit) ||
      parsedLimit <= 0 ||
      parsedLimit > MAX_LIMIT
    ) {
      return jsonError("Invalid limit", 400);
    }
    limit = parsedLimit;
  }

  const cursorParam = searchParams.get("cursor");
  let cursor: number | null = null;
  if (cursorParam !== null) {
    const parsedCursor = Number(cursorParam);
    if (!Number.isInteger(parsedCursor) || parsedCursor <= 0) {
      return jsonError("Invalid cursor", 400);
    }
    cursor = parsedCursor;
  }

  const inStockParam = searchParams.get("inStock");
  let inStock: boolean | undefined;
  if (inStockParam !== null) {
    if (inStockParam === "1") inStock = true;
    else if (inStockParam === "0") inStock = false;
    else return jsonError("Invalid inStock", 400);
  }

  const sortParam = searchParams.get("sort");
  const sort = sortParam?.trim() || "relevance";
  if (sortParam !== null && !ALLOWED_SORTS.has(sort)) {
    return jsonError("Invalid sort", 400);
  }

  try {
    const store = await prisma.store.findUnique({
      where: { slug: storeSlug },
      select: storeSelect,
    });

    if (!store) {
      return jsonError("Store not found", 404);
    }

    const where: Prisma.ProductWhereInput = {
      store: { slug: storeSlug },
    };

    if (q) {
      where.title = { contains: q, mode: "insensitive" };
    }

    if (inStock !== undefined) {
      where.inStock = inStock;
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput[] = [];
    if (sort === "price_asc") {
      orderBy.push({ price: "asc" }, { id: "desc" });
    } else if (sort === "price_desc") {
      orderBy.push({ price: "desc" }, { id: "desc" });
    } else if (sort === "newest") {
      orderBy.push({ id: "desc" });
    } else {
      if (q) orderBy.push({ title: "asc" }, { id: "desc" });
      else orderBy.push({ id: "desc" });
    }

    const take = limit + 1;

    const products = await prisma.product.findMany({
      where,
      orderBy,
      take,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select: productSelect,
    });

    let nextCursor: number | null = null;
    if (products.length > limit) {
      const next = products.pop();
      nextCursor = next?.id ?? null;
    }

    const payload = {
      store,
      items: products,
      nextCursor,
    };

    const etag = createEtag(payload);
    if (matchesEtag(request, etag)) {
      const res = new NextResponse(null, { status: 304 });
      res.headers.set("ETag", etag);
      return withCacheHeaders(res);
    }

    const res = NextResponse.json(payload);
    res.headers.set("ETag", etag);
    return withCacheHeaders(res);
  } catch (error) {
    console.error("GET /api/products failed", error);
    return jsonError("Internal Server Error", 500);
  }
}

// curl -s "http://localhost:3000/api/products?storeSlug=hash-mart"
