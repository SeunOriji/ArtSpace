"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { CheckCircle2, ShieldCheck, ShoppingCart, Tag, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNaira, SHIPPING_PER_ITEM } from "@/lib/collector-works";
import { useCartStore, type CartItem } from "@/store/cart.store";
import { useOrdersStore, type Order } from "@/store/orders.store";
import { useAuthStore } from "@/store/auth.store";
import { useHasMounted } from "@/hooks/use-has-mounted";

const PROMO_CODES: Record<string, number> = { WELCOME10: 0.1 };

/** Cart items from the persisted store; empty until mounted to avoid a hydration mismatch. */
export function useCartItems(): CartItem[] {
  const hasMounted = useHasMounted();
  const items = useCartStore((s) => s.items);
  return hasMounted ? items : [];
}

/** Whether a work is in the cart; false until mounted to avoid a hydration mismatch. */
export function useIsInCart(id: string): boolean {
  const hasMounted = useHasMounted();
  const inCart = useCartStore((s) => s.items.some((i) => i.id === id));
  return hasMounted && inCart;
}

export function cartTotals(items: CartItem[], discountRate = 0) {
  const subtotal = items.reduce((sum, w) => sum + w.price, 0);
  const discount = Math.round(subtotal * discountRate);
  const shipping = items.length * SHIPPING_PER_ITEM;
  return { subtotal, discount, shipping, total: subtotal - discount + shipping };
}

export function itemCountLabel(n: number) {
  return n === 1 ? "1 item" : `${n} items`;
}

interface CartPanelProps {
  onClose?: () => void;
  className?: string;
}

export function CartPanel({ onClose, className }: CartPanelProps) {
  const items = useCartItems();
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clear);
  const placeOrder = useOrdersStore((s) => s.placeOrder);
  const buyerName = useAuthStore((s) => s.user?.name);
  const [promoInput, setPromoInput] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const discountRate = appliedCode ? PROMO_CODES[appliedCode] : 0;
  const totals = cartTotals(items, discountRate);

  function handleApplyPromo(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (PROMO_CODES[code] !== undefined) {
      setAppliedCode(code);
      setPromoError(null);
      setPromoInput("");
    } else {
      setPromoError("That code isn't valid.");
    }
  }

  function handleCheckout() {
    if (items.length === 0) return;
    const order = placeOrder({ items, ...totals });
    clearCart();
    setAppliedCode(null);
    setPlacedOrder(order);
  }

  return (
    <div className={cn("flex h-full min-h-0 flex-col bg-surface", className)}>
      <div className="flex flex-none items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-baseline gap-2">
          <h2 className="font-heading text-lg font-extrabold text-foreground">
            {placedOrder ? "Order placed" : "Your cart"}
          </h2>
          {!placedOrder && (
            <span className="text-sm font-semibold text-foreground-subtle">{itemCountLabel(items.length)}</span>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-raised text-foreground-muted transition-colors hover:text-foreground"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {placedOrder ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 overflow-y-auto px-7 py-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 size={28} />
          </span>
          <p className="font-heading text-lg font-extrabold text-foreground">Thank you for your order</p>
          <p className="text-sm text-foreground-muted">
            Order <span className="font-bold text-foreground">#{placedOrder.id}</span> ·{" "}
            {itemCountLabel(placedOrder.items.length)} · {formatNaira(placedOrder.total)}
          </p>
          <p className="max-w-[280px] text-xs leading-relaxed text-foreground-subtle">
            Your payment is held in escrow and released to the artist only after you confirm delivery. We&apos;ll
            message you when it ships.
          </p>
          <button
            type="button"
            onClick={() => {
              setPlacedOrder(null);
              onClose?.();
            }}
            className="mt-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-hover"
          >
            Continue browsing
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 py-12 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-overlay text-accent">
            <ShoppingCart size={24} />
          </span>
          <p className="font-heading text-base font-extrabold text-foreground">Your cart is empty</p>
          <p className="max-w-[240px] text-sm leading-relaxed text-foreground-subtle">
            Add a work from the marketplace to start building your collection.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
            {items.map((w) => (
              <div key={w.id} className="flex gap-3 rounded-xl border border-border-subtle bg-background p-3">
                <div className="relative h-[76px] w-[68px] flex-shrink-0 overflow-hidden rounded-lg bg-surface-overlay">
                  {w.image && <Image src={w.image} alt={w.title} fill sizes="68px" className="object-cover" />}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate font-heading text-sm font-bold text-foreground">{w.title}</p>
                    <button
                      type="button"
                      onClick={() => removeItem(w.id)}
                      aria-label={`Remove ${w.title} from cart`}
                      className="flex-shrink-0 text-foreground-subtle transition-colors hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="truncate text-xs text-foreground-muted">
                    {w.artist} · {w.mediumLabel}
                  </p>
                  <p className="truncate text-[11px] text-foreground-subtle">
                    Ships from {w.city ?? "the artist's studio"} · 5–8 days
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-1.5">
                    <span className="truncate text-[11px] font-semibold text-emerald-400">{w.edition}</span>
                    <span className="flex-shrink-0 font-heading text-sm font-extrabold text-accent">{formatNaira(w.price)}</span>
                  </div>
                </div>
              </div>
            ))}

            <form
              onSubmit={handleApplyPromo}
              className="flex items-center gap-2.5 rounded-xl border border-dashed border-border px-3 py-2"
            >
              <Tag size={15} className="flex-shrink-0 text-gold" />
              <label htmlFor="promo-code" className="sr-only">
                Promo or gift code
              </label>
              <input
                id="promo-code"
                value={promoInput}
                onChange={(e) => {
                  setPromoInput(e.target.value);
                  setPromoError(null);
                }}
                placeholder={appliedCode ? `${appliedCode} applied` : "Promo or gift code"}
                className="min-w-0 flex-1 bg-transparent py-1 text-sm text-foreground placeholder-foreground-subtle outline-none"
              />
              <button type="submit" className="flex-shrink-0 text-xs font-bold text-gold transition-colors hover:text-gold-hover">
                Apply
              </button>
            </form>
            {promoError && <p className="-mt-1.5 text-xs text-red-400">{promoError}</p>}

            <div className="rounded-xl border border-border-subtle bg-background p-3.5">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-foreground-muted">Deliver to</p>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm leading-relaxed text-foreground-muted">
                  {buyerName || "Your name"}
                  <br />
                  14 Bourdillon Rd, Ikoyi, Lagos
                </p>
                <button type="button" className="flex-shrink-0 text-xs font-bold text-gold transition-colors hover:text-gold-hover">
                  Change
                </button>
              </div>
            </div>
          </div>

          <div className="flex-none border-t border-border bg-surface-raised px-5 py-4">
            <dl className="mb-4 flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-foreground-muted">Subtotal ({items.length})</dt>
                <dd className="font-bold text-foreground">{formatNaira(totals.subtotal)}</dd>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-foreground-muted">Promo ({appliedCode})</dt>
                  <dd className="font-bold text-emerald-400">−{formatNaira(totals.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-foreground-muted">Insured shipping</dt>
                <dd className="font-bold text-foreground">{formatNaira(totals.shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-foreground-muted">Escrow buyer protection</dt>
                <dd className="font-bold text-emerald-400">Free</dd>
              </div>
              <div className="my-0.5 h-px bg-border" />
              <div className="flex items-baseline justify-between">
                <dt className="font-bold text-foreground">Total</dt>
                <dd className="font-heading text-xl font-extrabold text-accent">{formatNaira(totals.total)}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={handleCheckout}
              className="block w-full rounded-xl bg-accent py-3.5 text-center text-sm font-bold text-white transition-colors hover:bg-accent-hover"
            >
              Checkout securely
            </button>
            <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-[11px] text-foreground-subtle">
              <ShieldCheck size={12} className="flex-shrink-0" />
              Paystack · Stripe · Funds held until you confirm delivery
            </p>
          </div>
        </>
      )}
    </div>
  );
}
