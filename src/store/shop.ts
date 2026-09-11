import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  qty: number;
};

type ShopState = {
  cart: CartLine[];
  wishlist: string[];
  cartOpen: boolean;
  coupon: string | null;
  addToCart: (line: Omit<CartLine, "id">) => void;
  removeLine: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => void;
  setCartOpen: (open: boolean) => void;
  applyCoupon: (code: string) => boolean;
};

export const COUPONS: Record<string, number> = { NOIR10: 0.1, ATELIER20: 0.2 };

export const useShop = create<ShopState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      cartOpen: false,
      coupon: null,
      addToCart: (line) =>
        set((s) => {
          const key = `${line.slug}-${line.size}-${line.color}`;
          const existing = s.cart.find((l) => l.id === key);
          return {
            cartOpen: true,
            cart: existing
              ? s.cart.map((l) => (l.id === key ? { ...l, qty: l.qty + line.qty } : l))
              : [...s.cart, { ...line, id: key }],
          };
        }),
      removeLine: (id) => set((s) => ({ cart: s.cart.filter((l) => l.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          cart: s.cart.map((l) => (l.id === id ? { ...l, qty: Math.max(1, qty) } : l)),
        })),
      clearCart: () => set({ cart: [], coupon: null }),
      toggleWishlist: (slug) =>
        set((s) => ({
          wishlist: s.wishlist.includes(slug)
            ? s.wishlist.filter((w) => w !== slug)
            : [...s.wishlist, slug],
        })),
      setCartOpen: (cartOpen) => set({ cartOpen }),
      applyCoupon: (code) => {
        const key = code.trim().toUpperCase();
        if (COUPONS[key]) {
          set({ coupon: key });
          return true;
        }
        void get();
        return false;
      },
    }),
    { name: "maison-noir-shop" },
  ),
);

export const cartSubtotal = (cart: CartLine[]) =>
  cart.reduce((sum, l) => sum + l.price * l.qty, 0);

export const cartCount = (cart: CartLine[]) => cart.reduce((n, l) => n + l.qty, 0);
