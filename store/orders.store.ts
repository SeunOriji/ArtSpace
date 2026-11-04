import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "./cart.store";

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  placedAt: string;
  status: "in-escrow" | "shipped" | "delivered";
}

interface OrdersState {
  orders: Order[];
  placeOrder: (order: Omit<Order, "id" | "placedAt" | "status">) => Order;
}

function orderNumber() {
  return `ASP-${Date.now().toString(36).slice(-5).toUpperCase()}`;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      placeOrder: (input) => {
        const order: Order = {
          ...input,
          id: orderNumber(),
          placedAt: new Date().toISOString(),
          status: "in-escrow",
        };
        set((s) => ({ orders: [order, ...s.orders] }));
        return order;
      },
    }),
    { name: "artspace-orders", skipHydration: true }
  )
);
