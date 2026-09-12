/**
 * Central shop configuration — the ONLY place client-specific data lives.
 *
 * This repo is a template clone. To onboard a new client, duplicate the repo,
 * then edit THIS FILE only (plus render.yaml + .env.example). Components read
 * every client detail from here — never hardcode shop data in JSX/TSX.
 *
 * NOTE ON ENV OVERRIDES: each value falls back to the VITE_* env var when set
 * at build time (Render dashboard → Environment). Keep the names EXACTLY as
 * written here — env var names are case-sensitive on Render (BUG 4.4).
 */

const env = import.meta.env as Record<string, string | undefined>;

export const shopConfig = {
  /** Display name — shown in nav logo, footer, page titles, JSON-LD. */
  shopName: env["VITE_SHOP_NAME"] ?? "Shreya Creation",

  /** Short brand line — used in hero subtitle and footer blurb. */
  tagline:
    env["VITE_SHOP_TAGLINE"] ??
    "Designer boutique, custom stitching & fashion designing institute in Patna",

  tagline_footer:
    env["VITE_SHOP_TAGLINE"] ??
    "Shreya Creation is a designer boutique and fashion designing institute on East Boring Canal Road, Patna, specialising in bridal couture, designer blouses, lehengas, suits, gowns, custom stitching and practical fashion-designing courses.",

  /** Year the store was founded — used in the "House" story. */
  foundedYear: env["VITE_SHOP_FOUNDED_YEAR"] ?? "2012",

  /** Brand accent — primary color from brand identity. */
  primaryColor: "#1A1A1A",
  /** Secondary brand color — complementary shade. */
  secondaryColor: "#FFFFFF",

  /**
   * WhatsApp number — DIGITS ONLY + country code (91XXXXXXXXXX format).
   * No "+", no spaces, no dashes or the wa.me link breaks (BUG 4.2).
   */
  whatsappNumber: env["VITE_WHATSAPP_NUMBER"] ?? "+91 90311 05666",

  /** Instagram handle (no "@" required in value, kept for display). */
  instagramHandle:
    env["VITE_INSTAGRAM_HANDLE"] ?? "shreya.creationss",

  /** Public contact email — footer, account profile, JSON-LD. */
  contactEmail:
    env["VITE_CONTACT_EMAIL"] ?? "hello@shreyacreations.in",

  /** Deployed site URL — JSON-LD `sameAs` + OG URL. */
  websiteUrl:
    env["VITE_WEBSITE_URL"] ?? "https://shreyacreation.com",

  /**
   * Products: this template ships a STATIC catalog in `src/lib/products.ts`
   * (no backend — static frontend only). Products live in that file because
   * they need bundled image imports; components consume them via the
   * `products` export. Swap the file contents to change the catalog.
   */
  productsSource: "static", // "static" (no backend in this repo)

  /** Store location — footer "Visit the store" + JSON-LD. */
  address: {
    street:
      env["VITE_SHOP_STREET"] ??
      "Sisodiya Place, East Boring Canal Road",
    locality:
      env["VITE_SHOP_LOCALITY"] ??
      "Boring Road",
    city: env["VITE_SHOP_CITY"] ?? "Patna",
    region: env["VITE_SHOP_REGION"] ?? "Bihar",
    postalCode: env["VITE_SHOP_POSTAL"] ?? "800001",
    country: "India",
  },

  /**
   * Google Maps listing link — used by the "Find us on Map" button.
   */
  googleMapsUrl:
    env["VITE_GOOGLE_MAPS_URL"] ??
    "https://www.google.com/maps/place/Shreya+creation+Boutique+Institute/@25.6103359,85.0998075,15z/data=!4m10!1m2!2m1!1sShreya+Creation!3m6!1s0x39ed583a14b55e6f:0x54c53b073707ea7e!8m2!3d25.6103359!4d85.1188619!15sCg9TaHJleWEgQ3JlYXRpb25aESIPc2hyZXlhIGNyZWF0aW9ukgEIYm91dGlxdWXgAQA!16s%2Fg%2F11st7djpls?entry=ttu&g_ep=EgoyMDI2MDkwOS4wIKXMDSoASAFQAw%3D%3D",

  /** Google Maps embed (iframe) URL — leave "" until an embed link is provided. */
  googleMapsEmbedUrl: env["VITE_GOOGLE_MAPS_EMBED_URL"] ?? "",

  /** Display phone (spaces fine) + tel: href (digits only). */
  phone: "+91 90311 05666",
  phoneHref: "+919031105666",

  /** Opening hours line — footer + boutiques. */
  hours:
    env["VITE_SHOP_HOURS"] ?? "Mon–Sat · 10 AM - 8 PM · Closed Sunday",

  /** Geo coordinates for JSON-LD — from the provided Google Maps listing. */
  lat: 25.6103359,
  lng: 85.1188619,

  /** Hero headline — first line white, second line gold italic. */
  hero: {
    part1: "Shreya Creation",
    part2: "Boutique, Patna",
  },

  /**
   * Today's Fashion configuration — when set, replaces the default shop
   * configuration for a "Today's Fashion" brand setup. All values fall back
   * to the shopConfig defaults when empty strings are provided.
   */
  todayFashion: {
    /** Enable Today's Fashion brand mode. */
    enabled:
      env["VITE_TODAY_FASHION_ENABLED"] !== "false",

    /** Display name — shown in nav logo, footer, page titles, JSON-LD. */
    shopName:
      env["VITE_TODAY_FASHION_SHOP_NAME"] ??
      "Shreya Creation Boutique & Institute",

    /** City — used in page titles and descriptions. */
    city:
      env["VITE_TODAY_FASHION_CITY"] ??
      "Patna",

    /** Street address — footer "Visit the store". */
    street:
      env["VITE_TODAY_FASHION_STREET"] ??
      "Sisodiya Place, East Boring Canal Road",

    /** Locality — used in full address. */
    locality:
      env["VITE_TODAY_FASHION_LOCALITY"] ??
      "Boring Road",

    /** Region — used in full address. */
    region:
      env["VITE_TODAY_FASHION_REGION"] ??
      "Bihar",

    /** Postal code. */
    postalCode:
      env["VITE_TODAY_FASHION_POSTAL"] ??
      "800001",

    /** Country. */
    country: "India",

    /** Google Maps URL. */
    googleMapsUrl:
      env["VITE_TODAY_FASHION_GOOGLE_MAPS_URL"] ??
      "https://www.google.com/maps/place/Shreya+creation+Boutique+Institute/@25.6103359,85.0998075,15z/data=!4m10!1m2!2m1!1sShreya+Creation!3m6!1s0x39ed583a14b55e6f:0x54c53b073707ea7e!8m2!3d25.6103359!4d85.1188619!15sCg9TaHJleWEgQ3JlYXRpb25aESIPc2hyZXlhIGNyZWF0aW9ukgEIYm91dGlxdWXgAQA!16s%2Fg%2F11st7djpls?entry=ttu&g_ep=EgoyMDI2MDkwOS4wIKXMDSoASAFQAw%3D%3D",

    /** Contact email. */
    contactEmail:
      env["VITE_TODAY_FASHION_CONTACT_EMAIL"] ??
      "hello@shreyacreations.in",

    /** Instagram handle. */
    instagramHandle:
      env["VITE_TODAY_FASHION_INSTAGRAM_HANDLE"] ??
      "@shreya.creationss",

    /** WhatsApp number. */
    whatsappNumber:
      env["VITE_TODAY_FASHION_WHATSAPP_NUMBER"] ??
      "919031105666",

    /** Opening hours. */
    hours:
      env["VITE_TODAY_FASHION_HOURS"] ??
      "Mon–Sat · 10:00 – 20:00 · Closed Sunday",

    /** Latitude for JSON-LD. */
    lat: env["VITE_TODAY_FASHION_LAT"]
      ? parseFloat(env["VITE_TODAY_FASHION_LAT"])
      : 25.6103359,

    /** Longitude for JSON-LD. */
    lng: env["VITE_TODAY_FASHION_LNG"]
      ? parseFloat(env["VITE_TODAY_FASHION_LNG"])
      : 85.1188619,
  } as const,
} as const;

/** Short hand for components: shopName + city for descriptions. */
export const shop = {
  name:
    shopConfig.todayFashion.enabled && shopConfig.todayFashion.shopName
      ? shopConfig.todayFashion.shopName
      : shopConfig.shopName,

  city:
    shopConfig.todayFashion.enabled && shopConfig.todayFashion.city
      ? shopConfig.todayFashion.city
      : shopConfig.address.city,

  tagline:
    shopConfig.todayFashion.enabled && shopConfig.todayFashion.shopName
      ? `${shopConfig.todayFashion.shopName} — Fashion Store in ${shopConfig.todayFashion.city}`
      : shopConfig.tagline,

  fullAddress:
    shopConfig.todayFashion.enabled && shopConfig.todayFashion.shopName
      ? `${shopConfig.todayFashion.street}, ${shopConfig.todayFashion.locality}, ${shopConfig.todayFashion.city}, ${shopConfig.todayFashion.region} ${shopConfig.todayFashion.postalCode}, ${shopConfig.todayFashion.country}`
      : `${shopConfig.address.street}, ${shopConfig.address.locality}, ${shopConfig.address.city}, ${shopConfig.address.region} ${shopConfig.address.postalCode}, ${shopConfig.address.country}`,
} as const;