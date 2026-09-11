import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Heart, Share2, Minus, Plus, RotateCw, Truck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { getProduct, products, formatPrice, type Product } from "@/lib/products";
import { useShop } from "@/store/shop";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: `${shopConfig.shopName} piece unavailable` }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.product;
    return {
      meta: [
        { title: `${p.name} — ${shopConfig.shopName}` },
        { name: "description", content: p.description },
        { property: "og:title", content: `${p.name} — ${shopConfig.shopName}` },
        { property: "og:description", content: p.description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/product/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/product/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.name,
            description: p.description,
            brand: { "@type": "Brand", name: shopConfig.shopName },
            offers: {
              "@type": "Offer",
              price: p.price,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
          }),
        },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: Product };
  const addToCart = useShop((s) => s.addToCart);
  const wishlist = useShop((s) => s.wishlist);
  const toggleWishlist = useShop((s) => s.toggleWishlist);

  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState(product.colors[0]?.name ?? "Obsidian");
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [spin, setSpin] = useState(0);
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });

  const saved = wishlist.includes(product.slug);
  const related = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="pt-28 md:pt-32">
      <nav aria-label="Breadcrumb" className="mx-auto max-w-[1600px] px-5 py-6 md:px-10">
        <ol className="flex gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <li><Link to="/" className="hover:text-gold">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to="/shop" className="hover:text-gold">Shop</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground">{product.name}</li>
        </ol>
      </nav>

      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 pb-28 md:px-10 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
        {/* Gallery */}
        <div>
          <div
            className="relative aspect-[4/5] overflow-hidden bg-surface-2"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setZoom({
                on: true,
                x: ((e.clientX - r.left) / r.width) * 100,
                y: ((e.clientY - r.top) / r.height) * 100,
              });
            }}
            onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
          >
            <motion.img
              key={active}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              src={product.gallery[active] ?? product.image}
              alt={`${product.name}, view ${active + 1}`}
              style={{
                transformOrigin: `${zoom.x}% ${zoom.y}%`,
                transform: `rotateY(${spin}deg) scale(${zoom.on ? 1.7 : 1})`,
              }}
              className="size-full object-cover transition-transform duration-500"
            />
            <button
              onClick={() => setSpin((s) => s + 45)}
              className="glass absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2.5 text-[10px] uppercase tracking-[0.25em] text-gold"
              aria-label="Rotate product 360 degrees"
            >
              <RotateCw className="size-3.5" /> 360°
            </button>
          </div>

          <div className="mt-4 flex gap-3">
            {product.gallery.map((g, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                className={cn(
                  "size-20 overflow-hidden border transition-colors",
                  active === i ? "border-gold" : "border-border",
                )}
              >
                <img src={g} alt="" loading="lazy" className="size-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Purchase panel */}
        <div className="lg:sticky lg:top-28 lg:h-fit">
          {product.badge && <p className="eyebrow text-gold">{product.badge}</p>}
          <h1 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05]">
            {product.name}
          </h1>
          <p className="mt-4 font-display text-xl">{formatPrice(product.price)}</p>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-10">
            <p className="eyebrow">Colour — {color}</p>
            <div className="mt-4 flex gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  aria-label={c.name}
                  aria-pressed={color === c.name}
                  className={cn(
                    "size-8 rounded-full border-2 transition-transform hover:scale-110",
                    color === c.name ? "border-gold" : "border-border",
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <p className="eyebrow">Size</p>
              <button className="text-[11px] uppercase tracking-widest text-muted-foreground hover:text-gold">
                Size guide
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  className={cn(
                    "min-h-11 min-w-14 border px-4 text-xs uppercase tracking-widest transition-colors",
                    size === s
                      ? "border-gold text-gold"
                      : "border-border text-muted-foreground hover:border-foreground/50",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center gap-4 border border-border px-4 py-3">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                <Minus className="size-3.5" />
              </button>
              <span className="w-6 text-center text-sm">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
                <Plus className="size-3.5" />
              </button>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (!size) {
                  toast.error("Please select a size");
                  return;
                }
                addToCart({
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  size,
                  color,
                  qty,
                });
                toast.success(`${product.name} added to your bag`);
              }}
              className="flex-1 bg-foreground py-4 font-display text-[0.7rem] uppercase tracking-[0.3em] text-background transition-colors hover:bg-gold"
            >
              Add to bag
            </motion.button>
          </div>

          <div className="mt-5 flex gap-6">
            <button
              onClick={() => toggleWishlist(product.slug)}
              className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground hover:text-gold"
            >
              <Heart className={cn("size-3.5", saved && "fill-gold text-gold")} />
              {saved ? "Saved" : "Save"}
            </button>
            <button
              onClick={() => {
                void navigator.clipboard?.writeText(window.location.href);
                toast.success("Link copied");
              }}
              className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground hover:text-gold"
            >
              <Share2 className="size-3.5" /> Share
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 border-y border-border py-5 text-[11px] uppercase tracking-widest text-muted-foreground">
            <span className="flex items-center gap-2"><Truck className="size-3.5 text-gold" /> Free shipping</span>
            <span className="flex items-center gap-2"><ShieldCheck className="size-3.5 text-gold" /> Lifetime repair</span>
          </div>

          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="details">
              <AccordionTrigger className="font-display text-sm uppercase tracking-[0.2em]">
                Composition & care
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {product.details.map((d) => (
                    <li key={d}>— {d}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger className="font-display text-sm uppercase tracking-[0.2em]">
                Shipping & returns
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Complimentary express shipping worldwide on orders over $500. Returns accepted
                within 30 days, unworn with the atelier seal intact.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Frequently bought together */}
      <section className="mx-auto max-w-[1600px] border-t border-border px-5 py-20 md:px-10">
        <Reveal>
          <p className="eyebrow">Styled together</p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            {[product, ...related.slice(0, 2)].map((p, i) => (
              <div key={p.id} className="flex items-center gap-6">
                {i > 0 && <span className="font-display text-2xl text-gold">+</span>}
                <img src={p.image} alt={p.name} loading="lazy" className="h-28 w-24 object-cover" />
              </div>
            ))}
            <div className="ml-auto text-right">
              <p className="text-sm text-muted-foreground">Total for three pieces</p>
              <p className="font-display text-2xl">
                {formatPrice([product, ...related.slice(0, 2)].reduce((s, p) => s + p.price, 0))}
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Related */}
      <section className="mx-auto max-w-[1600px] px-5 pb-32 md:px-10">
        <Reveal className="mb-12">
          <p className="eyebrow">You may also like</p>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-5 gap-y-14 lg:grid-cols-4">
          {related.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
