import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Snapshot of a work at the time it was added, so any marketplace can put items in the cart. */
export interface CartItem {
  id: string;
  title: string;
  artist: string;
  mediumLabel: string;
  price: number;
  image?: string;
  city?: string;
  edition: string;
}

interface CartState {
  items: CartItem[];
  toggleItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      toggleItem: (item) =>
        set((s) => ({
          items: s.items.some((i) => i.id === item.id)
            ? s.items.filter((i) => i.id !== item.id)
            : [...s.items, item],
        })),
      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    { name: "artspace-cart-v2", skipHydration: true }
  )
);
