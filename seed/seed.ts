import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import "dotenv/config";


neonConfig.webSocketConstructor = ws;

// Seeder connects using DATABASE_URL (pooled). This is fine for dev seed.
// If you ever face pool issues, we can switch seed to DIRECT_URL.
const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
});

type StoreIn = {
  id: number;
  slug: string;
  name: string;
  description?: string;
  store_type?: string;
  same_day_delivery?: boolean;
  delivery_charges?: number;
  min_order_value?: number;
  free_delivery_threshold?: number;
};

type ProductIn = {
  id: number;
  store_id: number;
  store_slug: string;
  title: string;
  description?: string | null;
  price: number;
  currency?: string;
  in_stock?: boolean;
  effective_stock?: number | null;
  is_less_than_10?: boolean;
  review_count?: number;
  average_rating?: number;
  brand?: { id?: number | null; name?: string | null } | null;
  category_chain?: { id?: number | null; name?: string | null; parent_id?: number | null }[];
  images?: {
    src?: string | null;
    alt?: string | null;
    width?: number | null;
    height?: number | null;
    sort_order?: number | null;
  }[];
  primary_image_url?: string | null;
  primary_image_local_path?: string | null;
};

function readJson<T>(p: string): T {
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function cleanUrl(u?: string | null) {
  if (!u) return null;
  const s = u.trim();
  return s.endsWith("?") ? s.slice(0, -1) : s;
}

async function main() {
  const storesPath = path.join(process.cwd(), "seed", "input", "stores.json");
  const productsPath = path.join(process.cwd(), "seed", "input", "products.json");

  if (!fs.existsSync(storesPath)) throw new Error(`Missing: ${storesPath}`);
  if (!fs.existsSync(productsPath)) throw new Error(`Missing: ${productsPath}`);

  const stores = readJson<StoreIn[]>(storesPath);
  const products = readJson<ProductIn[]>(productsPath);

  // Reset (dev-safe)
  await prisma.productCategory.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.store.deleteMany();

  // Stores
  await prisma.store.createMany({
    data: stores.map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      description: s.description || null,
      storeType: s.store_type || null,
      sameDayDelivery: !!s.same_day_delivery,
      deliveryCharges: s.delivery_charges ?? null,
      minOrderValue: s.min_order_value ?? null,
      freeDeliveryThreshold: s.free_delivery_threshold ?? null,
    })),
  });

  // Brands (dedupe by name)
  const brandNames = new Set<string>();
  for (const p of products) {
    const n = p.brand?.name?.trim();
    if (n) brandNames.add(n);
  }
  for (const name of brandNames) {
    await prisma.brand.create({ data: { name } });
  }
  const brands = await prisma.brand.findMany();
  const brandIdByName = new Map(brands.map((b) => [b.name, b.id]));

  // Categories (dedupe by extId+name+parentExt)
  const categoryKeySet = new Set<string>();
  for (const p of products) {
    for (const c of p.category_chain ?? []) {
      if (!c?.name) continue;
      categoryKeySet.add(`${c.id ?? "null"}::${c.name}::${c.parent_id ?? "null"}`);
    }
  }

  for (const key of categoryKeySet) {
    const [extStr, name, parentExtStr] = key.split("::");
    const externalId = extStr === "null" ? null : Number(extStr);
    const parentExt = parentExtStr === "null" ? null : Number(parentExtStr);

    await prisma.category.create({
      data: { externalId, name, parentExt },
    });
  }

  const categories = await prisma.category.findMany();
  const catIdByKey = new Map(categories.map((c) => [`${c.externalId ?? "null"}::${c.name}::${c.parentExt ?? "null"}`, c.id]));

  // Products + images + category links
  for (const p of products) {
    const brandName = p.brand?.name?.trim();
    const brandId = brandName ? (brandIdByName.get(brandName) ?? null) : null;

    await prisma.product.create({
      data: {
        id: p.id,
        storeId: p.store_id,
        title: p.title,
        description: p.description ?? null,
        price: p.price,
        currency: p.currency ?? "PKR",
        inStock: p.in_stock ?? true,
        effectiveStock: p.effective_stock ?? null,
        isLessThan10: p.is_less_than_10 ?? false,
        reviewCount: p.review_count ?? 0,
        averageRating: p.average_rating ?? 0,
        brandId,
        primaryImageUrl: cleanUrl(p.primary_image_url) ?? null,
        primaryImagePath: p.primary_image_local_path ?? null,
      },
    });

    // Product images (dedupe by unique constraint)
    for (const im of p.images ?? []) {
      const src = cleanUrl(im.src);
      if (!src) continue;

      await prisma.productImage.upsert({
        where: { productId_src: { productId: p.id, src } },
        update: {},
        create: {
          productId: p.id,
          src,
          alt: im.alt ?? null,
          width: im.width ?? null,
          height: im.height ?? null,
          sortOrder: im.sort_order ?? null,
        },
      });
    }

    // Category links
    for (const c of p.category_chain ?? []) {
      if (!c?.name) continue;
      const key = `${c.id ?? "null"}::${c.name}::${c.parent_id ?? "null"}`;
      const categoryId = catIdByKey.get(key);
      if (!categoryId) continue;

      await prisma.productCategory.create({
        data: { productId: p.id, categoryId },
      });
    }
  }

  console.log("Seed complete:", { stores: stores.length, products: products.length });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
