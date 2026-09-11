import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { useShop } from "@/store/shop";
import { formatPrice, type Product } from "@/lib/products";
import { TiltCard } from "./Interactions";
import { cn } from "@/lib/utils";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const wishlist = useShop((s) => s.wishlist);
  const toggleWishlist = useShop((s) => s.toggleWishlist);
  const saved = wishlist.includes(product.slug);
  const hover = product.gallery[1] ?? product.image;

  return (
    <motion.article
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <TiltCard>
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="block"
          aria-label={product.name}
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-surface-2">
            <img
              src={product.image}
              alt={`${product.name} — ${product.category}`}
              loading="lazy"
              className="absolute inset-0 size-full object-cover transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:opacity-0"
            />
            <img
              src={hover}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 size-full scale-105 object-cover opacity-0 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100"
            />
            {product.badge && (
              <span className="absolute left-4 top-4 border border-gold/50 bg-background/50 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-gold backdrop-blur-md">
                {product.badge}
              </span>
            )}
            <span className="pointer-events-none absolute inset-x-4 bottom-4 translate-y-3 border border-border bg-background/70 py-3 text-center text-[10px] uppercase tracking-[0.3em] opacity-0 backdrop-blur-md transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100">
              Quick view
            </span>
          </div>
        </Link>
      </TiltCard>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <Link to="/product/$slug" params={{ slug: product.slug }}>
            <h3 className="truncate font-display text-sm tracking-wide">{product.name}</h3>
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">{product.category}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="font-display text-sm">{formatPrice(product.price)}</span>
          <button
            onClick={() => toggleWishlist(product.slug)}
            aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}
            aria-pressed={saved}
          >
            <Heart
              className={cn(
                "size-4 transition-colors",
                saved ? "fill-gold text-gold" : "text-muted-foreground hover:text-gold",
              )}
            />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div>
      <div className="shimmer aspect-[4/5] w-full" />
      <div className="shimmer mt-4 h-3 w-2/3" />
      <div className="shimmer mt-2 h-3 w-1/3" />
    </div>
  );
}
