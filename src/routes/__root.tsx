import { createFileRoute, createRootRouteWithContext, Link, HeadContent, Scripts, Outlet, useRouter } from "@tanstack/react-router";
import { useState, useEffect, ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Heart, Package, MapPin, UserRound } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { products, formatPrice } from "@/lib/products";
import { useShop } from "@/store/shop";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { shopConfig } from "@/config/shop.config";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import { Toaster } from "@/components/ui/sonner";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { useSpring, motion, useScroll } from "motion/react";
import appCss from "@/styles.css?url";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { reportLovableError } from "@/lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-4 font-display text-6xl">Off the runway</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This page has been archived or never existed.
        </p>
        <Link
          to="/"
          className="eyebrow lux-underline mt-8 inline-block text-gold"
        >
          Return to the house
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">Something interrupted</p>
        <h1 className="mt-4 font-display text-4xl">This page didn't load</h1>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="bg-foreground px-6 py-3 font-display text-[0.7rem] uppercase tracking-[0.3em] text-background"
          >
            Try again
          </button>
          <a
            href="/"
            className="border border-border px-6 py-3 font-display text-[0.7rem] uppercase tracking-[0.3em]"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${shopConfig.shopName} — Luxury Fashion House` },
      {
        name: "description",
        content:
          `${shopConfig.shopName}: modern tailoring, cashmere and leather, made in small ateliers across Europe.`,
      },
      { property: "og:site_name", content: shopConfig.shopName },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#090909" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ClothingStore",
          name: shopConfig.shopName,
          description:
            `${shopConfig.tagline} ${shopConfig.address.city}.`,
          address: {
            "@type": "PostalAddress",
            streetAddress: shopConfig.address.street,
            addressLocality: shopConfig.address.locality,
            addressRegion: shopConfig.address.region,
            postalCode: shopConfig.address.postalCode,
            addressCountry: shopConfig.address.country,
          },
          geo: { "@type": "GeoCoordinates", latitude: shopConfig.lat, longitude: shopConfig.lng },
          telephone: shopConfig.phoneHref,
          openingHours: shopConfig.hours,
          hasMap: shopConfig.googleMapsUrl,
          sameAs: [shopConfig.websiteUrl],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SmoothScroll />
      <ScrollProgress />
      <Nav />
      <main id="main">
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <Toaster position="bottom-left" />
    </QueryClientProvider>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  return (
    <motion.div
      style={{ scaleX }}
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[90] h-px origin-left bg-gold"
    />
  );
}

function SmoothScroll() {
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let cancelled = false;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, [reduced]);
  return null;
}