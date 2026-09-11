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
  shopName: env["VITE_SHOP_NAME"] ?? "Aangan Boutique",

  /** Short brand line — used in hero subtitle and footer blurb. */
  tagline:
    env["VITE_SHOP_TAGLINE"] ??
    "Sophisticated ethnic & western wear for the modern wardrobe",

  tagline_footer:
    env["VITE_SHOP_TAGLINE"] ??
    "A designer boutique in Bodakdev, Ahmedabad, located on Sindhu Bhavan Marg opposite Bajrang Super Market. Specialising in ethnic, Indo-western, bridal and festive wear, with bespoke tailoring.",

  /** Year the store was founded — used in the "House" story. */
  foundedYear: env["VITE_SHOP_FOUNDED_YEAR"] ?? "2024",

  /** Brand accent — primary color from brand identity. */
  primaryColor: "#1A1A1A",
  /** Secondary brand color — complementary shade. */
  secondaryColor: "#FFFFFF",

  /**
   * WhatsApp number — DIGITS ONLY + country code (91XXXXXXXXXX format).
   * No "+", no spaces, no dashes or the wa.me link breaks (BUG 4.2).
   * From the client's official website.
   */
  whatsappNumber: env["VITE_WHATSAPP_NUMBER"] ?? "+91 79489 23535",

  /** Instagram handle (no "@" required in value, kept for display). */
  instagramHandle: env["VITE_INSTAGRAM_HANDLE"] ?? "@aanganboutique",

  /** Public contact email — footer, account profile, JSON-LD. */
  contactEmail: env["VITE_CONTACT_EMAIL"] ?? "info@aanganboutique.in",

  /** Deployed site URL — JSON-LD `sameAs` + OG URL. */
  websiteUrl: env["VITE_WEBSITE_URL"] ?? "https://www.aanganboutique.in",

  /**
   * Products: this template ships a STATIC catalog in `src/lib/products.ts`
   * (no backend — static frontend only). Products live in that file because
   * they need bundled image imports; components consume them via the
   * `products` export. Swap the file contents to change the catalog.
   */
  productsSource: "static", // "static" (no backend in this repo)

  /** Store location — footer "Visit the store" + JSON-LD. */
  address: {
    street: env["VITE_SHOP_STREET"] ?? "K-158",
    locality: env["VITE_SHOP_LOCALITY"] ?? "Sindhu Bhawan Marg",
    city: env["VITE_SHOP_CITY"] ?? "Ahmedabad",
    region: env["VITE_SHOP_REGION"] ?? "Gujarat",
    postalCode: env["VITE_SHOP_POSTAL"] ?? "380001",
    country: "India",
  },

  /**
   * Google Maps listing link — used by the "Find us on Map" button (BUG 4.7:
   * if this is left "" the button renders as "Map coming soon" instead).
   * User-provided: Aangan Boutique K-158 Sindhu Bhawan Marg Ahmedabad.
   */
  googleMapsUrl:
    env["VITE_GOOGLE_MAPS_URL"] ??
    "https://www.google.com/maps/search/?api=1&query=Aangan+Boutique+K-158+Sindhu+Bhavan+Marg+Ahmedabad",

  /** Google Maps embed (iframe) URL — leave "" until an embed link is provided. */
  googleMapsEmbedUrl: env["VITE_GOOGLE_MAPS_EMBED_URL"] ?? "",

  /** Display phone (spaces fine) + tel: href (digits only). */
  phone: "+91 79489 23535",
  phoneHref: "+9179489 23535",

  /** Opening hours line — footer + boutiques. */
  hours: "Open Daily · 10 AM - 9 PM",

  /** Geo coordinates for JSON-LD — approximate for Ahmedabad. */
  lat: 23.0225,
  lng: 72.5714,

  /** Hero headline — first line white, second line gold italic. */
  hero: {
    part1: "Aangan Boutique",
    part2: "Besoke Culture",
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
      env["VITE_TODAY_FASHION_SHOP_NAME"] ?? "Today's Fashion",
    /** City — used in page titles and descriptions. */
    city: env["VITE_TODAY_FASHION_CITY"] ?? "Patna",
    /** Street address — footer "Visit the store". */
    street: env["VITE_TODAY_FASHION_STREET"] ?? "Prakash Paradise Building",
    /** Locality — used in full address. */
    locality: env["VITE_TODAY_FASHION_LOCALITY"] ?? "Lalbagh",
    /** Region — used in full address. */
    region: env["VITE_TODAY_FASHION_REGION"] ?? "Bihar",
    /** Postal code. */
    postalCode: env["VITE_TODAY_FASHION_POSTAL"] ?? "800004",
    /** Country. */
    country: "India",
    /** Google Maps URL. */
    googleMapsUrl:
      env["VITE_TODAY_FASHION_GOOGLE_MAPS_URL"] ??
      "https://www.google.com/maps/place/Today's+Fashion/@25.6190378,84.5521472,10z/data=!4m10!1m2!2m1!1sDelhi+fashion+clothes+shop!3m6!1s0x39ed58e58c02b0e7:0xa97ec9d9d12f23af!8m2!3d25.6190378!4d85.1618884!15sChpEZWxoaSBmYXNoaW9uIGNsb3RoZXMgc2hvcFocIhpkZWxoaSBmYXNoaW9uIGNsb3RoZXMgc2hvcJIBDmNsb3RoaW5nX3N0b3Jl4AEA!16s%2Fg%2F11b7w6gpc_?entry=ttu&g_ep=EgoyMDI2MDgwMy4wIKXMDSoASAFQAw%3D%3D",
    /** Contact email. */
    contactEmail: env["VITE_TODAY_FASHION_CONTACT_EMAIL"] ?? "info@todayfashion.co.in",
    /** Instagram handle. */
    instagramHandle: env["VITE_TODAY_FASHION_INSTAGRAM_HANDLE"] ?? "@todaysfashion",
    /** WhatsApp number. */
    whatsappNumber: env["VITE_TODAY_FASHION_WHATSAPP_NUMBER"] ?? "919334110962",
    /** Opening hours. */
    hours: env["VITE_TODAY_FASHION_HOURS"] ?? "Open daily · 10:00 – 21:00",
    /** Latitude for JSON-LD. */
    lat: env["VITE_TODAY_FASHION_LAT"]
      ? parseFloat(env["VITE_TODAY_FASHION_LAT"])
      : 25.6190378,
    /** Longitude for JSON-LD. */
    lng: env["VITE_TODAY_FASHION_LNG"]
      ? parseFloat(env["VITE_TODAY_FASHION_LNG"])
      : 85.1618884,
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