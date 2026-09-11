import hoodie from "@/assets/p-hoodie.jpg";
import sneaker from "@/assets/p-sneaker.jpg";
import coat from "@/assets/p-coat.jpg";
import knit from "@/assets/p-knit.jpg";
import bag from "@/assets/p-bag.jpg";
import look1 from "@/assets/look-1.jpg";
import look2 from "@/assets/look-2.jpg";

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: "Outerwear" | "Knitwear" | "Footwear" | "Accessories" | "Essentials";
  colors: { name: string; hex: string }[];
  sizes: string[];
  image: string;
  gallery: string[];
  badge?: string;
  description: string;
  details: string[];
};

export const products: Product[] = [
      {
        id: "1",
        slug: "atelier-wool-trench",
        name: "Atelier Wool Trench",
        price: 1890,
        category: "Outerwear",
        colors: [
          { name: "Obsidian", hex: "#111111" },
          { name: "Ash", hex: "#6b6b6b" },
        ],
        sizes: ["XS", "S", "M", "L", "XL"],
        image: coat,
        gallery: [coat, look2, look1],
        badge: "Icon",
        description:
          "A double-faced Italian wool trench cut with a sculpted shoulder and a fluid, floor-skimming drape. Made in a family atelier in Biella.",
        details: [
          "100% double-faced virgin wool",
          "Hand-finished horn buttons",
          "Bemberg cupro lining",
          "Made in Italy",
        ],
      },
      {
        id: "2",
        slug: "noir-cashmere-hoodie",
        name: "Noir Cashmere Hoodie",
        price: 690,
        category: "Essentials",
        colors: [
          { name: "Obsidian", hex: "#111111" },
          { name: "Bone", hex: "#e8e2d8" },
        ],
        sizes: ["S", "M", "L", "XL"],
        image: hoodie,
        gallery: [hoodie, look2],
        badge: "Best Seller",
        description:
          "Grade-A Mongolian cashmere brushed to a cloud-soft hand. Boxy, weighted, and quietly perfect.",
        details: ["100% Mongolian cashmere", "Garment dyed", "Ribbed hem", "Made in Portugal"],
      },
      {
        id: "3",
        slug: "monolith-low-sneaker",
        name: "Monolith Low Sneaker",
        price: 540,
        category: "Footwear",
        colors: [
          { name: "Bone", hex: "#e8e2d8" },
          { name: "Obsidian", hex: "#111111" },
        ],
        sizes: ["39", "40", "41", "42", "43", "44", "45"],
        image: sneaker,
        gallery: [sneaker, look1],
        badge: "New",
        description:
          "Full-grain Italian calfskin over a hand-stitched vulcanised sole. Deliberately undesigned.",
        details: ["Full-grain calfskin", "Vulcanised rubber sole", "Cotton laces", "Made in Italy"],
      },
      {
        id: "4",
        slug: "ribbed-merino-crew",
        name: "Ribbed Merino Crew",
        price: 420,
        category: "Knitwear",
        colors: [
          { name: "Oat", hex: "#ded3bd" },
          { name: "Obsidian", hex: "#111111" },
        ],
        sizes: ["XS", "S", "M", "L", "XL"],
        image: knit,
        gallery: [knit, look2],
        description:
          "Extra-fine merino knitted on vintage gauge machines, with a fully-fashioned rib that holds its line.",
        details: ["Extra-fine merino wool", "Fully-fashioned rib", "Made in Scotland"],
      },
      {
        id: "5",
        slug: "structured-leather-tote",
        name: "Structured Leather Tote",
        price: 1250,
        category: "Accessories",
        colors: [{ name: "Obsidian", hex: "#111111" }],
        sizes: ["One Size"],
        image: bag,
        gallery: [bag, look1],
        badge: "Limited",
        description:
          "A single panel of vegetable-tanned leather, folded and saddle-stitched into an architectural silhouette.",
        details: ["Vegetable-tanned leather", "Saddle-stitched by hand", "Suede interior"],
      },
      {
        id: "6",
        slug: "shadow-tailored-coat",
        name: "Shadow Tailored Coat",
        price: 1490,
        category: "Outerwear",
        colors: [{ name: "Obsidian", hex: "#111111" }],
        sizes: ["S", "M", "L"],
        image: look1,
        gallery: [look1, coat],
        description:
          "The runway silhouette from FW-VII, rendered in a matte wool-cashmere blend with a concealed placket.",
        details: ["Wool-cashmere blend", "Concealed placket", "Made in Italy"],
      },
      {
        id: "7",
        slug: "off-shoulder-knit-dress",
        name: "Off-Shoulder Knit Dress",
        price: 780,
        category: "Knitwear",
        colors: [{ name: "Obsidian", hex: "#111111" }],
        sizes: ["XS", "S", "M", "L"],
        image: look2,
        gallery: [look2, knit],
        description:
          "A single-seam tubular knit that follows the body without gripping it. Cut to fall from the shoulder.",
        details: ["Merino-silk blend", "Seamless tubular knit", "Made in Portugal"],
      },
      {
        id: "8",
        slug: "essential-cashmere-scarf",
        name: "Essential Cashmere Scarf",
        price: 290,
        category: "Accessories",
        colors: [
          { name: "Oat", hex: "#ded3bd" },
          { name: "Obsidian", hex: "#111111" },
        ],
        sizes: ["One Size"],
        image: knit,
        gallery: [knit],
        description: "Two metres of double-ply cashmere, brushed and hand-fringed.",
        details: ["Double-ply cashmere", "Hand-fringed", "200 × 40 cm"],
      },
    ]

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const categories = [
  "Outerwear",
  "Knitwear",
  "Footwear",
  "Accessories",
  "Essentials",
] as const;

export const categoryImages: Record<(typeof categories)[number], string> = {
  Outerwear: coat,
  Knitwear: knit,
  Footwear: sneaker,
  Accessories: bag,
  Essentials: hoodie,
};

export const lookbook = [look1, look2, coat, hoodie];
export const heroLook = look1;

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    .format(n);
