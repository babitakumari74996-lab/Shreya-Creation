import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, X, Lock, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { useShop, cartSubtotal, COUPONS } from "@/store/shop";
import { formatPrice } from "@/lib/products";

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeLine, setQty, coupon, applyCoupon, clearCart } =
    useShop();
  const [code, setCode] = useState("");

  const subtotal = cartSubtotal(cart);
  const discount = coupon ? subtotal * (COUPONS[coupon] ?? 0) : 0;
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 25;
  const total = subtotal - discount + shipping;

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm"
          />
          <motion.aside
            role="dialog"
            aria-label="Shopping bag"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 z-[80] flex h-dvh w-full max-w-[460px] flex-col border-l border-border bg-surface-2"
          >
            <header className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="font-display text-sm tracking-[0.3em]">
                YOUR BAG ({cart.length})
              </h2>
              <button onClick={() => setCartOpen(false)} aria-label="Close bag">
                <X className="size-5 text-muted-foreground hover:text-gold" />
              </button>
            </header>

            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-10 text-center">
                <p className="font-display text-3xl">Your bag is empty</p>
                <p className="text-sm text-muted-foreground">
                  Pieces you save will appear here, held for 24 hours.
                </p>
                <Link
                  to="/shop"
                  onClick={() => setCartOpen(false)}
                  className="eyebrow lux-underline mt-2 text-gold"
                >
                  Discover the collection
                </Link>
              </div>
            ) : (
              <div className="flex-1 divide-y divide-border overflow-y-auto px-6">
                {cart.map((l) => (
                  <motion.div
                    key={l.id}
                    layout
                    exit={{ opacity: 0, x: 40 }}
                    className="grid grid-cols-[84px_minmax(0,1fr)_auto] gap-4 py-6"
                  >
                    <img
                      src={l.image}
                      alt={l.name}
                      loading="lazy"
                      className="h-28 w-[84px] object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-display text-sm">{l.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {l.color} · Size {l.size}
                      </p>
                      <div className="mt-4 flex items-center gap-3 border border-border px-2 py-1 w-fit">
                        <button
                          onClick={() => setQty(l.id, l.qty - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-5 text-center text-xs">{l.qty}</span>
                        <button
                          onClick={() => setQty(l.id, l.qty + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <span className="font-display text-sm">{formatPrice(l.price * l.qty)}</span>
                      <button
                        onClick={() => removeLine(l.id)}
                        className="text-[11px] uppercase tracking-widest text-muted-foreground hover:text-gold"
                      >
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <footer className="border-t border-border px-6 py-6">
                <div className="flex gap-2">
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Promotion code"
                    aria-label="Promotion code"
                    className="min-w-0 flex-1 border border-border bg-transparent px-3 py-3 text-xs tracking-widest uppercase placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={() =>
                      applyCoupon(code)
                        ? toast.success(`Code ${code.toUpperCase()} applied`)
                        : toast.error("That code isn't valid")
                    }
                    className="border border-gold px-4 text-[11px] uppercase tracking-[0.2em] text-gold"
                  >
                    Apply
                  </button>
                </div>

                <dl className="mt-6 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <dt>Subtotal</dt>
                    <dd>{formatPrice(subtotal)}</dd>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-gold">
                      <dt>Discount ({coupon})</dt>
                      <dd>−{formatPrice(discount)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <dt>Shipping</dt>
                    <dd>{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3 font-display text-base">
                    <dt>Total</dt>
                    <dd>{formatPrice(total)}</dd>
                  </div>
                </dl>

                <button
                  onClick={() => {
                    toast.success("Order placed — a stylist will confirm shortly.");
                    clearCart();
                    setCartOpen(false);
                  }}
                  className="mt-6 w-full bg-foreground py-4 font-display text-[0.7rem] uppercase tracking-[0.3em] text-background transition-colors hover:bg-gold"
                >
                  Secure Checkout
                </button>
                <div className="mt-4 flex items-center justify-center gap-5 text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Lock className="size-3" /> Encrypted
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Truck className="size-3" /> Free over $500
                  </span>
                </div>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
