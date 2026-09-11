import { Link, createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, type TargetAndTransition } from "motion/react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { ArrowRight, Star, Quote } from "lucide-react";
import { HeroVideo } from "@/components/site/HeroVideo";
import { Reveal, SplitText } from "@/components/site/Reveal";
import { ProductCard } from "@/components/site/ProductCard";
import { MagneticButton } from "@/components/site/Interactions";
import { products, categories, categoryImages, lookbook } from "@/lib/products";
import { scrollToTop } from "@/lib/scroll";
import heroEditorial from "@/assets/hero-editorial.jpg";
import look2 from "@/assets/look-2.jpg";
import { shopConfig } from "../config/shop.config";

let heroVisited = false;

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    heroVisited = true;
  }, []);

  const revisit = heroVisited;
  const init = (hidden: TargetAndTransition): TargetAndTransition | false =>
    revisit ? false : hidden;

  return (
    <section ref={ref} className="relative h-dvh w-full overflow-hidden md:bg-[#0A1011] z-10">
      {/* Background Video Layer */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <HeroVideo />
      </motion.div>
      
      {/* Dull Veil Shade Locked Behind Text & Above Video to Erase Flashing Glow */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-black/60 to-[#0A0D12]" />

      {/* Hero Content Text Layer */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 flex h-full flex-col justify-end px-5 pb-16 md:px-10 md:pb-20"
      >
        <div className="max-w-5xl">
          <motion.p
            initial={init({ opacity: 0 })}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1.2 }}
            className="eyebrow"
          >
            FW-VII — Nocturne
          </motion.p>
          
          {/* Responsive Layout Size Config Secured to Prevent Cutting Edge Artifacts */}
          <h1 className="relative z-50 mt-6 font-display text-[2.7rem] md:text-[8rem] font-medium leading-[0.9] tracking-tight uppercase overflow-visible w-full pr-8 md:pr-16 box-border flex flex-col gap-0">
            <span className="whitespace-nowrap block select-none overflow-visible">
              <SplitText text={shopConfig.hero.part1} delay={0.5} instant={revisit} />
            </span>
            <span className="text-gold italic whitespace-nowrap block select-none mt-0 pt-0 overflow-visible pr-4">
              <SplitText text={shopConfig.hero.part2} delay={0.75} instant={revisit} />
            </span>
          </h1>

          <motion.p
            initial={init({ opacity: 0 })}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-8 max-w-md text-[11px] uppercase tracking-[0.3em] text-muted-foreground"
          >
            Dressed for the Dark Hours
          </motion.p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <motion.p
            initial={init({ opacity: 0, y: 20 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="max-w-md text-sm leading-relaxed text-muted-foreground"
          >
            {shopConfig.tagline}
          </motion.p>
          <motion.div
            initial={init({ opacity: 0, y: 20 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.35, duration: 1 }}
          >
            <Link to="/shop">
              <MagneticButton className="border border-gold text-gold hover:bg-gold hover:text-background">
                Enter the collection
              </MagneticButton>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function Marquee() {
  const todayFashionShopName =
    shopConfig.todayFashion.enabled && shopConfig.todayFashion.shopName
      ? shopConfig.todayFashion.shopName
      : shopConfig.shopName;
  const todayFashionCity =
    shopConfig.todayFashion.enabled && shopConfig.todayFashion.city
      ? shopConfig.todayFashion.city
      : shopConfig.address.city;
  
  const baseItems = [
    todayFashionShopName,
    "Bespoke Couture",
    "Custom Tailoring",
    todayFashionCity,
    "Premium Designer Wear",
  ];
  
  // Explicit Triple Duplication Implemented to Remove Gaps and Prevent Scrolling Jump Errors
  const items = [...baseItems, ...baseItems, ...baseItems];

  return (
    <div className="overflow-hidden border-y border-border py-5 bg-[#0A0D12]">
      <motion.div
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="flex w-max gap-14 whitespace-nowrap"
      >
        {items.map((t, idx) => (
          <span key={`${t}-${idx}`} className="eyebrow flex items-center gap-14 text-foreground/60 uppercase tracking-[0.2em] text-[10px]">
            {t} <span className="text-gold">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
function Home() {
  const trending = products.slice(0, 4);
  const arrivals = products.slice(4, 8);

  useLayoutEffect(() => {
    scrollToTop();
  }, []);

  return (
    <div className="md:bg-[radial-gradient(120%_120%_at_50%_100%,#1A2332_0%,#0A0D12_60%)]">
      <Hero />
      <Marquee />

      {/* Featured collection — editorial split */}
      <section className="mx-auto grid max-w-[1600px] items-center gap-12 px-5 py-28 md:grid-cols-2 md:px-10 md:py-40">
        <Reveal>
          <img
            src={heroEditorial}
            alt="Model wearing the Atelier wool trench from the Nocturne collection"
            loading="lazy"
            width={1280}
            height={1600}
            className="w-full object-cover"
          />
        </Reveal>
        <Reveal delay={0.15} className="md:pl-10">
          <p className="eyebrow">Featured Collection</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,5vw,4rem)] leading-[1.02]">
            Nocturne — a study in weight and shadow
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            Twelve silhouettes built around a single question: how heavy can a garment be before it
            stops moving with the body? Every seam was tested on the street, at night, in rain.
          </p>
          <Link
            to="/lookbook"
            className="eyebrow lux-underline mt-8 inline-flex items-center gap-2 text-gold"
          >
            View the lookbook <ArrowRight className="size-3.5" />
          </Link>
        </Reveal>
      </section>

      {/* Trending */}
      <section className="mx-auto max-w-[1600px] px-5 pb-28 md:px-10 md:pb-40">
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Trending</p>
            <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,3rem)]">Most desired</h2>
          </div>
          <Link to="/shop" className="eyebrow lux-underline text-foreground/70">
            All pieces
          </Link>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-5 gap-y-14 lg:grid-cols-4">
          {trending.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="border-y border-border">
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 divide-x divide-border md:grid-cols-5">
          {categories.map((c, i) => (
            <Reveal key={c} delay={i * 0.06}>
              <Link
                to="/shop"
                search={{ category: c }}
                className="group relative flex h-40 flex-col justify-between overflow-hidden p-6 transition-colors hover:bg-surface-2 md:h-56"
              >
                <img
                  src={categoryImages[c]}
                  alt={c}
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover opacity-80 transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <span className="eyebrow relative z-10">0{i + 1}</span>
                <span className="relative z-10 font-display text-xl transition-colors group-hover:text-gold md:text-2xl">
                  {c}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Lookbook strip */}
      <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
        <Reveal>
          <p className="eyebrow">Lookbook</p>
          <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.75rem,4.5vw,3.5rem)] leading-tight">
            Shot at 4am on the Rue de Turenne
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {lookbook.slice(0, 3).map((src, i) => (
            <Reveal key={src} delay={i * 0.1} className={i === 1 ? "md:mt-16" : ""}>
              <div className="group overflow-hidden">
                <img
                  src={src}
                  alt={`Nocturne lookbook, frame ${i + 1}`}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="mx-auto max-w-[1600px] px-5 pb-28 md:px-10 md:pb-40">
        <Reveal className="mb-12">
          <p className="eyebrow">New Arrivals</p>
          <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,3rem)]">Just released</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-5 gap-y-14 lg:grid-cols-4">
          {arrivals.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

{/* Brand story */}
      <section className="relative overflow-hidden border-y border-border">
        <img
          src={look2}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 size-full object-cover opacity-25"
        />
        <div className="relative mx-auto max-w-3xl px-5 py-32 text-center md:py-48">
          <Reveal>
            <p className="eyebrow">The House</p>
            <p className="mt-8 font-display text-[clamp(1.5rem,3.6vw,2.75rem)] leading-[1.2]">
              "We don't design for the season. We design for the twelve years after it."
            </p>
            <p className="mt-8 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Elise Marchand — Creative Director
            </p>
            <Link to="/atelier" className="eyebrow lux-underline mt-10 inline-block text-gold">
              Inside the atelier
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Bottom Continuous Dynamic Scrolling Marquee Loop */}
      <section className="overflow-hidden border-t border-border py-12 bg-[#0A0D12]">
        <div className="flex w-max gap-14 whitespace-nowrap animate-marquee">
          {[...Array(3)].flatMap((_, outerIdx) => 
            [
              shopConfig.shopName,
              "Bespoke Couture",
              "Custom Tailoring",
              shopConfig.address.city,
              "Premium Designer Wear"
            ].map((textItem, innerIdx) => (
              <span key={`bottom-marquee-${outerIdx}-${innerIdx}`} className="eyebrow flex items-center gap-14 text-foreground/40 uppercase tracking-[0.25em] text-[10px]">
                {textItem} <span className="text-gold">✦</span>
              </span>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export const Route = createFileRoute('/')({
  component: Home,
});
