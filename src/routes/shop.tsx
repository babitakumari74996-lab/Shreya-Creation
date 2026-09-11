import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SlidersHorizontal, X } from "lucide-react";
import { z } from "zod";
import { products, categories, formatPrice } from "@/lib/products";
import { ProductCard, ProductCardSkeleton } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { shopConfig } from "@/config/shop.config";

const searchSchema = z.object({
  category: z.string().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: `Shop All — ${shopConfig.shopName}` },
      {
        name: "description",
        content:
          `Browse the full ${shopConfig.shopName} collection: outerwear, knitwear, footwear and accessories. Filter by category, colour, size and price.`,
      },
      { property: "og:title", content: `Shop All — ${shopConfig.shopName}` },
      {
        property: "og:description",
        content: `${shopConfig.tagline}, outerwear, knitwear, footwear and accessories, cut once and never restocked.`,
      },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: Shop,
});

const ALL_COLORS = ["Obsidian", "Bone", "Oat", "Ash"];
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "One Size"];
const SORTS = ["Featured", "Price: Low", "Price: High", "Newest"] as const;

function Shop() {
  const { category } = Route.useSearch();
  const navigate = Route.useNavigate();

  const [maxPrice, setMaxPrice] = useState(2000);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Featured");
  const [visible, setVisible] = useState(6);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (category && p.category !== category) return false;
      if (p.price > maxPrice) return false;
      if (colors.length && !p.colors.some((c) => colors.includes(c.name))) return false;
      if (sizes.length && !p.sizes.some((s) => sizes.includes(s))) return false;
      return true;
    });
    if (sort === "Price: Low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "Price: High") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "Newest") list = [...list].reverse();
    return list;
  }, [category, maxPrice, colors, sizes, sort]);

  // Infinite scroll
  useEffect(() => {
    const onScroll = () => {
      if (window.innerHeight + window.scrollY > document.body.offsetHeight - 600) {
        setVisible((v) => (v < filtered.length ? v + 4 : v));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [filtered.length]);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const filterPanel = (
    <div className="space-y-10">
      <div>
        <p className="eyebrow">Category</p>
        <ul className="mt-4 space-y-2.5">
          <li>
            <button
              onClick={() => navigate({ search: {} })}
              className={cn("text-sm hover:text-gold", !category ? "text-gold" : "text-muted-foreground")}
            >
              All pieces
            </button>
          </li>
          {categories.map((c) => (
            <li key={c}>
              <button
                onClick={() => navigate({ search: { category: c } })}
                className={cn(
                  "text-sm hover:text-gold",
                  category === c ? "text-gold" : "text-muted-foreground",
                )}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="eyebrow">Price — up to {formatPrice(maxPrice)}</p>
        <Slider
          value={[maxPrice]}
          onValueChange={([v]) => setMaxPrice(v ?? 2000)}
          min={200}
          max={2000}
          step={50}
          className="mt-5"
          aria-label="Maximum price"
        />
      </div>

      <div>
        <p className="eyebrow">Colour</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {ALL_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => toggle(colors, setColors, c)}
              aria-pressed={colors.includes(c)}
              className={cn(
                "border px-3 py-1.5 text-[11px] uppercase tracking-widest transition-colors",
                colors.includes(c)
                  ? "border-gold text-gold"
                  : "border-border text-muted-foreground hover:border-foreground/40",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="eyebrow">Size</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggle(sizes, setSizes, s)}
              aria-pressed={sizes.includes(s)}
              className={cn(
                "min-w-11 border px-3 py-1.5 text-[11px] uppercase tracking-widest transition-colors",
                sizes.includes(s)
                  ? "border-gold text-gold"
                  : "border-border text-muted-foreground hover:border-foreground/40",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-32 pt-32 md:px-10 md:pt-40">
      <Reveal>
        <p className="eyebrow">{category ?? "All Pieces"}</p>
        <h1 className="mt-4 font-display text-[clamp(2.25rem,7vw,5.5rem)] leading-none">
          {category ?? "The Collection"}
        </h1>
        <p className="mt-5 max-w-lg text-sm text-muted-foreground">
          {filtered.length} pieces available. Each style is produced once and never restocked.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-28">{filterPanel}</div>
        </aside>

        <div>
          <div className="mb-8 flex items-center justify-between gap-4 border-b border-border pb-4">
            <button
              onClick={() => setFiltersOpen(true)}
              className="eyebrow flex items-center gap-2 text-foreground lg:invisible"
            >
              <SlidersHorizontal className="size-3.5" /> Filters
            </button>
            <div className="flex flex-wrap items-center gap-4">
              {SORTS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={cn(
                    "text-[11px] uppercase tracking-[0.2em] transition-colors",
                    sort === s ? "text-gold" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-14 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="border border-border py-32 text-center">
              <p className="font-display text-3xl">Nothing matches</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Try widening the price range or clearing a filter.
              </p>
              <button
                onClick={() => {
                  setColors([]);
                  setSizes([]);
                  setMaxPrice(2000);
                  navigate({ search: {} });
                }}
                className="eyebrow lux-underline mt-6 text-gold"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-5 gap-y-14 lg:grid-cols-3">
                {filtered.slice(0, visible).map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
              {visible < filtered.length && (
                <p className="mt-16 text-center text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                  Loading more pieces…
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] overflow-y-auto bg-background p-6 lg:hidden"
          >
            <div className="mb-10 flex items-center justify-between">
              <span className="eyebrow">Filters</span>
              <button onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                <X className="size-5" />
              </button>
            </div>
            {filterPanel}
            <button
              onClick={() => setFiltersOpen(false)}
              className="mt-12 w-full bg-foreground py-4 font-display text-[0.7rem] uppercase tracking-[0.3em] text-background"
            >
              Show {filtered.length} pieces
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
