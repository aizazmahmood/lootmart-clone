import type { MetadataRoute } from "next";
import { prisma } from "@/src/lib/prisma";

export const runtime = "nodejs";

function getBaseUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const stores = await prisma.store.findMany({
    select: { slug: true },
    orderBy: { name: "asc" },
  });

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      changeFrequency: "daily",
      priority: 1,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/checkout`,
      changeFrequency: "weekly",
      priority: 0.6,
      lastModified: new Date(),
    },
    ...stores.map((store) => ({
      url: `${baseUrl}/stores/${store.slug}`,
      changeFrequency: "daily",
      priority: 0.8,
      lastModified: new Date(),
    })),
  ];

  return routes;
}
