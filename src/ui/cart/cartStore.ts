"use client";

import { useSyncExternalStore } from "react";

export type CartItem = {
  productId: number;
  title: string;
  price: number;
  primaryImagePath?: string | null;
  primaryImageUrl?: string | null;
  brandName?: string | null;
  qty: number;
};

type CartState = {
  storeSlug: string | null;
  storeName: string | null;
  items: Record<number, CartItem>;
  totalItems: number;
  subtotal: number;
  isOpen: boolean;
};

type AddItemInput = {
  productId: number;
  title: string;
  price: number;
  primaryImagePath?: string | null;
  primaryImageUrl?: string | null;
  brandName?: string | null;
};

type CartActions = {
  addItem: (product: AddItemInput, storeSlug: string, storeName?: string) => void;
  inc: (productId: number) => void;
  dec: (productId: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  hydrate: () => void;
};

type CartStore = CartState & CartActions;

const STORAGE_KEY = "lootmart_cart_v1";

const initialState: CartState = {
  storeSlug: null,
  storeName: null,
  items: {},
  totalItems: 0,
  subtotal: 0,
  isOpen: false,
};

const listeners = new Set<() => void>();

let state: CartStore = {
  ...initialState,
  addItem: () => undefined,
  inc: () => undefined,
  dec: () => undefined,
  remove: () => undefined,
  clear: () => undefined,
  open: () => undefined,
  close: () => undefined,
  toggle: () => undefined,
  hydrate: () => undefined,
};

function emitChange() {
  listeners.forEach((listener) => listener());
}

function setState(partial: Partial<CartStore>) {
  state = { ...state, ...partial };
  emitChange();
}

function calculateTotals(items: Record<number, CartItem>) {
  let totalItems = 0;
  let subtotal = 0;
  Object.values(items).forEach((item) => {
    totalItems += item.qty;
    subtotal += item.price * item.qty;
  });
  return { totalItems, subtotal };
}

function persistState() {
  if (typeof window === "undefined") return;
  const snapshot = {
    storeSlug: state.storeSlug,
    storeName: state.storeName,
    items: state.items,
    totalItems: state.totalItems,
    subtotal: state.subtotal,
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // ignore persistence errors
  }
}

function updateItems(nextItems: Record<number, CartItem>, extra?: Partial<CartState>) {
  const totals = calculateTotals(nextItems);
  setState({ items: nextItems, totalItems: totals.totalItems, subtotal: totals.subtotal, ...extra });
  persistState();
}

state.addItem = (product, storeSlug, storeName) => {
  let nextItems = state.items;
  let nextStoreSlug = state.storeSlug;
  let nextStoreName = state.storeName;

  if (!nextStoreSlug) {
    nextStoreSlug = storeSlug;
    nextStoreName = storeName ?? null;
    nextItems = {};
  } else if (nextStoreSlug !== storeSlug) {
    nextStoreSlug = storeSlug;
    nextStoreName = storeName ?? null;
    nextItems = {};
  } else if (storeName && !nextStoreName) {
    nextStoreName = storeName;
  }

  const existing = nextItems[product.productId];
  const qty = existing ? existing.qty + 1 : 1;
  const updatedItem: CartItem = {
    productId: product.productId,
    title: product.title,
    price: product.price,
    primaryImagePath: product.primaryImagePath ?? null,
    primaryImageUrl: product.primaryImageUrl ?? null,
    brandName: product.brandName ?? null,
    qty,
  };

  updateItems(
    {
      ...nextItems,
      [product.productId]: updatedItem,
    },
    {
      storeSlug: nextStoreSlug,
      storeName: nextStoreName,
      isOpen: true,
    },
  );
};

state.inc = (productId) => {
  const existing = state.items[productId];
  if (!existing) return;
  const nextItems = {
    ...state.items,
    [productId]: { ...existing, qty: existing.qty + 1 },
  };
  updateItems(nextItems);
};

state.dec = (productId) => {
  const existing = state.items[productId];
  if (!existing) return;
  const nextQty = existing.qty - 1;
  if (nextQty <= 0) {
    const { [productId]: _removed, ...rest } = state.items;
    updateItems(rest);
    if (Object.keys(rest).length === 0) {
      setState({ storeSlug: null, storeName: null });
      persistState();
    }
    return;
  }
  const nextItems = {
    ...state.items,
    [productId]: { ...existing, qty: nextQty },
  };
  updateItems(nextItems);
};

state.remove = (productId) => {
  const { [productId]: _removed, ...rest } = state.items;
  updateItems(rest);
  if (Object.keys(rest).length === 0) {
    setState({ storeSlug: null, storeName: null });
    persistState();
  }
};

state.clear = () => {
  setState({ ...initialState });
  persistState();
};

state.open = () => setState({ isOpen: true });
state.close = () => setState({ isOpen: false });
state.toggle = () => setState({ isOpen: !state.isOpen });

state.hydrate = () => {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Partial<CartState>;
    if (!parsed || typeof parsed !== "object") return;
    const items = parsed.items && typeof parsed.items === "object" ? parsed.items : {};
    const totals = calculateTotals(items as Record<number, CartItem>);
    setState({
      storeSlug: typeof parsed.storeSlug === "string" ? parsed.storeSlug : null,
      storeName: typeof parsed.storeName === "string" ? parsed.storeName : null,
      items: items as Record<number, CartItem>,
      totalItems: totals.totalItems,
      subtotal: totals.subtotal,
      isOpen: false,
    });
  } catch {
    // ignore hydration errors
  }
};

export function useCartStore<T>(selector: (store: CartStore) => T): T {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => selector(state),
    () => selector(state),
  );
}

export const cartStore = {
  getState: () => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
