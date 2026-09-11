import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";
import { Search, ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import { useShop, cartCount } from "@/store/shop";
import { categories } from "@/lib/products";
import { cn } from "@/lib/utils";
import { shopConfig } from "@/config/shop.config";
import { SearchModal } from "@/components/site/SearchModal";

const links = [
  { to: "/shop", label: "Shop" },
  { to: "/lookbook", label: "Lookbook" },
  { to: "/atelier", label: "Atelier" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { scrollY } = useScroll();
  const cart = useShop((s) => s.cart);
  const wishlist = useShop((s) => s.wishlist);
  const setCartOpen = useShop((s) => s.setCartOpen);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        onMouseLeave={() => setMega(false)}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-700",
          scrolled || mega ? "glass" : "bg-transparent",
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto grid max-w-[1600px] grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 md:px-10"
        >
          <div className="flex min-w-0 items-center gap-8">
            <button
              className="md:hidden"
              onClick={() => setMobile(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <ul className="hidden items-center gap-8 md:flex">
              <li>
                <button
                  onMouseEnter={() => setMega(true)}
                  onFocus={() => setMega(true)}
                  className="eyebrow lux-underline text-foreground"
                  aria-expanded={mega}
                >
                  Collections
                </button>
              </li>
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onMouseEnter={() => setMega(false)}
                    className="eyebrow lux-underline text-foreground/80 hover:text-foreground"
                    activeProps={{ className: "text-gold" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

<Link
  to="/"
  className="justify-self-center font-display text-lg tracking-[0.42em] text-foreground md:text-xl"
>
  {shopConfig.shopName}
</Link>

<div className="flex items-center gap-5 justify-self-end">
              <button
                aria-label="Search"
                className="hidden text-foreground/80 hover:text-gold sm:block"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="size-[18px]" />
              </button>
            <Link
              to="/account"
              aria-label="Account"
              className="hidden text-foreground/80 hover:text-gold sm:block"
            >
              <User className="size-[18px]" />
            </Link>
            <Link
              to="/account"
              aria-label={`Wishlist, ${wishlist.length} items`}
              className="relative text-foreground/80 hover:text-gold"
            >
              <Heart className="size-[18px]" />
              {wishlist.length > 0 && (
                <span className="absolute -right-2 -top-2 font-display text-[10px] text-gold">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart, ${cartCount(cart)} items`}
              className="relative text-foreground/80 hover:text-gold"
            >
              <ShoppingBag className="size-[18px]" />
              {cartCount(cart) > 0 && (
                <span className="absolute -right-2 -top-2 font-display text-[10px] text-gold">
                  {cartCount(cart)}
                </span>
              )}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {mega && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="hidden overflow-hidden border-t border-border md:block"
            >
              <div className="mx-auto grid max-w-[1600px] grid-cols-4 gap-10 px-10 py-12">
                <div>
                  <p className="eyebrow">Categories</p>
                  <ul className="mt-5 space-y-3">
                    {categories.map((c) => (
                      <li key={c}>
                        <Link
                          to="/shop"
                          search={{ category: c }}
                          onClick={() => setMega(false)}
                          className="font-display text-2xl text-foreground/70 transition-colors hover:text-gold"
                        >
                          {c}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="eyebrow">Seasonal</p>
                  <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                    <li>FW-VII — Nocturne</li>
                    <li>Resort — Salt & Stone</li>
                    <li>The Archive</li>
                    <li>Made to Order</li>
                  </ul>
                </div>
                <div className="col-span-2">
                  <p className="eyebrow">Featured</p>
                  <p className="mt-5 max-w-md font-display text-3xl leading-tight">
                    Nocturne — twelve pieces cut for the hours after dark.
                  </p>
                  <Link
                    to="/lookbook"
                    onClick={() => setMega(false)}
                    className="eyebrow lux-underline mt-6 inline-block text-gold"
                  >
                    View the film
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background md:hidden"
          >
            <div className="flex items-center justify-between px-5 py-4">
              <span className="font-display tracking-[0.4em]">MENU</span>
              <button onClick={() => setMobile(false)} aria-label="Close menu">
                <X className="size-5" />
              </button>
            </div>
            <ul className="mt-8 space-y-2 px-5">
              {[{ to: "/", label: "Home" }, ...links].map((l, i) => (
                <motion.li
                  key={l.to}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setMobile(false)}
                    className="block border-b border-border py-5 font-display text-4xl"
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mt-10 px-5">
              <p className="eyebrow">Categories</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {categories.map((c) => (
                  <Link
                    key={c}
                    to="/shop"
                    search={{ category: c }}
                    onClick={() => setMobile(false)}
                    className="border border-border px-4 py-2 text-xs tracking-widest text-muted-foreground"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
