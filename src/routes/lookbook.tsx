import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal, SplitText } from "@/components/site/Reveal";
import { lookbook } from "@/lib/products";
import heroEditorial from "@/assets/hero-editorial.jpg";
import { shopConfig } from "@/config/shop.config";

export const Route = createFileRoute("/lookbook")({
  head: () => ({
    meta: [
      { title: `Nocturne Lookbook — ${shopConfig.shopName}` },
      {
        name: "description",
        content:
          `The FW-VII Nocturne lookbook: twelve silhouettes photographed at 4am on the Rue de Turenne, Paris.`,
      },
      { property: "og:title", content: `Nocturne Lookbook — ${shopConfig.shopName}` },
      {
        property: "og:description",
        content: `Twelve silhouettes photographed at 4am in Paris.`,
      },
      { property: "og:url", content: "/lookbook" },
    ],
    links: [{ rel: "canonical", href: "/lookbook" }],
  }),
  component: Lookbook,
});

function Lookbook() {
  return (
    <div className="pt-32 md:pt-40">
      <header className="mx-auto max-w-[1600px] px-5 md:px-10">
        <p className="eyebrow">FW-VII</p>
        <h1 className="mt-5 font-display text-[clamp(2.5rem,10vw,9rem)] leading-none">
          <SplitText text="Nocturne" />
        </h1>
        <p className="mt-8 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Photographed between 3 and 6am across the third arrondissement. No lighting rig, no
          retouching — only streetlight, rain and the fabric doing what it does.
        </p>
      </header>

      <div className="mx-auto mt-24 max-w-[1600px] space-y-24 px-5 pb-32 md:px-10">
        {[heroEditorial, ...lookbook].map((src, i) => (
          <Reveal key={i} delay={0.05}>
            <figure
              className={
                i % 3 === 0
                  ? "grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-end"
                  : "grid gap-6 md:grid-cols-[1fr_1.4fr] md:items-end"
              }
            >
              <img
                src={src}
                alt={`Nocturne look ${i + 1}`}
                loading="lazy"
                className="w-full object-cover"
              />
              <figcaption className="pb-4">
                <p className="eyebrow">Look {String(i + 1).padStart(2, "0")}</p>
                <p className="mt-4 max-w-sm font-display text-2xl leading-snug md:text-3xl">
                  {
                    [
                      "The trench, worn open over nothing.",
                      "Two coats, one shadow.",
                      "Cashmere against bare shoulder.",
                      "Wool that holds rain like skin.",
                      "The last frame before sunrise.",
                    ][i % 5]
                  }
                </p>
                <Link to="/shop" className="eyebrow lux-underline mt-6 inline-block text-gold">
                  Shop this look
                </Link>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
