import { prisma } from "@/src/lib/prisma";

export type StoreCategory = {
  id: number;
  name: string;
  count: number;
};

export async function getCategoriesForStore(
  storeId: number,
  take: number = 12,
): Promise<StoreCategory[]> {
  const grouped = await prisma.productCategory.groupBy({
    by: ["categoryId"],
    where: { product: { storeId } },
    _count: { categoryId: true },
    orderBy: { _count: { categoryId: "desc" } },
    take,
  });

  if (grouped.length === 0) return [];

  const categories = await prisma.category.findMany({
    where: { id: { in: grouped.map((row) => row.categoryId) } },
    select: { id: true, name: true },
  });

  const nameById = new Map(categories.map((cat) => [cat.id, cat.name]));

  return grouped.map((row) => ({
    id: row.categoryId,
    name: nameById.get(row.categoryId) ?? "Category",
    count: row._count.categoryId,
  }));
}
