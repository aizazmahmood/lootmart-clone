import Header from "@/src/ui/components/Header";
import FeatureCards from "@/src/ui/components/FeatureCards";
import PromoBanner from "@/src/ui/components/PromoBanner";
import StoreCard from "@/src/ui/components/StoreCard";
import { prisma } from "@/src/lib/prisma";
import { Button } from "@/src/ui/primitives/Button";
import { Card } from "@/src/ui/primitives/Card";
import {
  DEFAULT_LOCATION,
  LOCATIONS,
  getDeliverableSlugs,
  type Location,
} from "@/src/config/delivery";

export const revalidate = 60;

type SearchParams = {
  loc?: string | string[];
};

type PageProps = {
  searchParams?: Promise<SearchParams> | SearchParams;
};

function isLocation(value: string): value is Location {
  return (LOCATIONS as readonly string[]).includes(value);
}

function resolveLocation(value?: string | string[]) {
  if (typeof value === "string" && isLocation(value)) {
    return value;
  }
  if (Array.isArray(value) && value.length > 0) {
    const candidate = value[0];
    if (candidate && isLocation(candidate)) {
      return candidate;
    }
  }
  return DEFAULT_LOCATION;
}

export default async function Home({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const location = resolveLocation(params.loc);

  const stores = await prisma.store.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      storeType: true,
      sameDayDelivery: true,
      deliveryCharges: true,
      minOrderValue: true,
      freeDeliveryThreshold: true,
    },
  });

  const deliverableSet = new Set(getDeliverableSlugs(location));
  const deliverableStores = stores.filter((store) =>
    deliverableSet.has(store.slug),
  );
  const allStores = stores.filter((store) => !deliverableSet.has(store.slug));

  return (
    <div className="min-h-screen bg-[#f8f5f0] font-sans text-[#0f1b2d]">
      <Header location={location} />
      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a2771d]">
            Welcome to
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#0f1b2d] sm:text-5xl lg:text-6xl">
            Lootmart
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#556070] sm:text-lg">
            Your one-stop shop for convenient grocery delivery.
          </p>
          <div className="mt-6 flex justify-center">
            <Button
              type="button"
              size="md"
              aria-label={`Delivering to ${location}`}
            >
              Delivering to {location}
            </Button>
          </div>
        </section>

        <FeatureCards />

        <PromoBanner />

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-[#0f1b2d]">
              Stores in {location}
            </h2>
            <p className="text-sm text-[#6b7280]">
              Fresh picks with delivery availability in your area.
            </p>
          </div>
          {deliverableStores.length === 0 ? (
            <Card className="p-6 text-sm text-[#6b7280]">
              No stores are currently available for {location}. Try another
              location to see what delivers.
            </Card>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {deliverableStores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  location={location}
                  deliverable
                />
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-[#0f1b2d]">
              All Stores
            </h2>
            <p className="text-sm text-[#6b7280]">
              Explore the full Lootmart network and upcoming delivery zones.
            </p>
          </div>
          {allStores.length === 0 ? (
            <Card className="p-6 text-sm text-[#6b7280]">
              All stores for this location are already available above.
            </Card>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {allStores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  location={location}
                  deliverable={false}
                />
              ))}
            </div>
          )}
        </section>
      </main>

    </div>
  );
}
