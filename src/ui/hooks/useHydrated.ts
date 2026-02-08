"use client";

import { useSyncExternalStore } from "react";

export default function useHydrated() {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
}
