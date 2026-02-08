export const LOCATIONS = ["Sector H-13", "Bahria Phase 8"] as const;

export type Location = (typeof LOCATIONS)[number];

export const DELIVERABLE_BY_LOCATION: Record<Location, string[]> = {
  "Sector H-13": ["royal-cash-and-carry"],
  "Bahria Phase 8": ["hash-mart"],
};

export const DEFAULT_LOCATION: Location = LOCATIONS[0];

export function getDeliverableSlugs(location: string): string[] {
  if ((LOCATIONS as readonly string[]).includes(location)) {
    return DELIVERABLE_BY_LOCATION[location as Location];
  }
  return DELIVERABLE_BY_LOCATION[DEFAULT_LOCATION];
}
