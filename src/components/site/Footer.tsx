import { Link } from "@tanstack/react-router";
import { MapPin, Phone, MessageCircle, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { categories } from "@/lib/products";
import { shopConfig } from "@/config/shop.config";


export function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="border-t border-border bg-surface-2">
      <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
<p className="font-display text-2xl tracking-[0.3em]">
               {shopConfig.shopName}
             </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {shopConfig.tagline_footer}
            </p>

            <form
              className="mt-8 flex max-w-sm gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!email.includes("@")) {
                  toast.error("Please enter a valid email");
                  return;
                }
                toast.success("Welcome to the house list.");
                setEmail("");
              }}
            >
              <label htmlFor="newsletter" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="min-w-0 flex-1 border-b border-border bg-transparent py-3 text-sm placeholder:text-muted-foreground focus:border-gold"
              />
              <button
                type="submit"
                className="border border-border px-5 text-[10px] uppercase tracking-[0.25em] transition-colors hover:border-gold hover:text-gold"
              >
                Join
              </button>
            </form>
          </div>

          <nav aria-label="Shop">
            <p className="eyebrow">Shop</p>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {categories.map((c) => (
                <li key={c}>
                  <Link to="/shop" search={{ category: c }} className="lux-underline hover:text-foreground">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="House">
            <p className="eyebrow">House</p>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li><Link to="/atelier" className="lux-underline hover:text-foreground">Our Atelier</Link></li>
              <li><Link to="/lookbook" className="lux-underline hover:text-foreground">Lookbook</Link></li>
              <li><Link to="/account" className="lux-underline hover:text-foreground">Account</Link></li>
              <li><Link to="/atelier" className="lux-underline hover:text-foreground">FAQ</Link></li>
            </ul>
          </nav>

          <div>
            <p className="eyebrow">Visit the store</p>
            <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-gold" />
                <a
                  href={shopConfig.googleMapsUrl && shopConfig.googleMapsUrl !== "" && shopConfig.googleMapsUrl !== "https://google.com"
                    ? shopConfig.googleMapsUrl
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shopConfig.shopName)}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="lux-underline hover:text-foreground"
                >
                  Find us on Map
                </a>
              </li>
              </li>
              <li className="flex gap-2">
                <Clock className="mt-0.5 size-3.5 shrink-0 text-gold" />
                <span>{shopConfig.todayFashion.enabled ? shopConfig.todayFashion.hours : shopConfig.hours}</span>
              </li>
              <li className="flex gap-2">
                <Phone className="mt-0.5 size-3.5 shrink-0 text-gold" />
                <a href={`tel:${shopConfig.whatsappNumber}`} className="lux-underline hover:text-foreground">
                  {shopConfig.whatsappNumber}
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-border pt-8 text-[11px] uppercase tracking-[0.2em] text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} {shopConfig.shopName}</span>
          <span className="flex gap-6">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Shipping & Returns</span>
          </span>
        </div>
      </div>

      {/* Floating contact actions (mobile-first) */}
      <div className="fixed bottom-6 right-5 z-40 flex flex-col gap-3">
        <a
          href={`https://wa.me/${shopConfig.whatsappNumber}`}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Chat with a stylist on WhatsApp"
          className="glass grid size-11 place-items-center rounded-full text-gold transition-transform hover:scale-110"
        >
          <MessageCircle className="size-[18px]" />
        </a>
        <a
          href={`tel:${shopConfig.phoneHref}`}
          aria-label="Call the store"
          className="glass grid size-11 place-items-center rounded-full text-gold transition-transform hover:scale-110 md:hidden"
        >
          <Phone className="size-[18px]" />
        </a>

      </div>
    </footer>
  );
}
