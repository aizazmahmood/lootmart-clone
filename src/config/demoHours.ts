type StoreHours = {
  storeHours: string;
  deliveryHours: string;
};

export const HOURS_BY_STORE_SLUG: Record<string, StoreHours> = {
  "hash-mart": {
    storeHours: "9:00 AM - 11:59 PM",
    deliveryHours: "6:00 PM - 11:30 PM",
  },
  "royal-cash-and-carry": {
    storeHours: "8:30 AM - 11:00 PM",
    deliveryHours: "5:30 PM - 11:00 PM",
  },
};

export const DEFAULT_HOURS: StoreHours = {
  storeHours: "9:00 AM - 11:00 PM",
  deliveryHours: "6:00 PM - 11:00 PM",
};

export function getStoreHours(slug: string): StoreHours {
  return HOURS_BY_STORE_SLUG[slug] ?? DEFAULT_HOURS;
}
