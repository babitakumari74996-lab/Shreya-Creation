import { createFileRoute } from "@tanstack/react-router";
import { Reveal, SplitText } from "@/components/site/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import look2 from "@/assets/look-2.jpg";
import coat from "@/assets/p-coat.jpg";
import { shopConfig } from "@/config/shop.config";

export const Route = createFileRoute("/atelier")({
  head: () => ({
    meta: [
      { title: `The Atelier — ${shopConfig.shopName}` },
      {
        name: "description",
        content:
          `Inside ${shopConfig.shopName}: our mills in Biella, the Portuguese knitting floor, our repair promise and boutique locations in Paris, London and New York.`,
      },
      { property: "og:title", content: `The Atelier — ${shopConfig.shopName}` },
      {
        property: "og:description",
        content: "Our mills, our makers, our lifetime repair promise.",
      },
      { property: "og:url", content: "/atelier" },
    ],
    links: [{ rel: "canonical", href: "/atelier" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Do you restock?",
              acceptedAnswer: { "@type": "Answer", text: "No. Every style is cut once." },
            },
            {
              "@type": "Question",
              name: "How do returns work?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "30 days, unworn, with the atelier seal intact.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: Atelier,
});

const stores = [
  [
    "Flagship — Ashok Rajpath",
    "Prakash Paradise Building, Ashok Rajpath Rd, Patna 800004",
    "Open daily 10:00 – 21:00",
  ],
  ["Styling Suite", "By appointment · +91 93341 10962", "Open daily 10–21"],
  ["Alterations Atelier", "Lalbagh, Patna", "Open daily 10–21"],
];


function Atelier() {
  return (
    <div className="pt-32 md:pt-40">
      <header className="mx-auto max-w-[1600px] px-5 md:px-10">
        <p className="eyebrow">The House</p>
        <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.25rem,7vw,6rem)] leading-[0.95]">
          <SplitText text="Twelve pieces. Three ateliers. One season." />
        </h1>
      </header>

      <section className="mx-auto mt-20 grid max-w-[1600px] gap-12 px-5 md:grid-cols-2 md:px-10">
        <Reveal>
          <img src={coat} alt="A wool coat on the atelier stand" loading="lazy" className="w-full object-cover" />
        </Reveal>
        <Reveal delay={0.1} className="md:pt-20">
          <p className="text-sm leading-relaxed text-muted-foreground">
              {shopConfig.shopName} began in 2016 with a single trench and a refusal: no seasonal churn, no
              markdowns, no restocks. We work with three houses — a wool mill in Biella, a knitting
              floor outside Porto, and a leather workshop in Florence — and cap each style at 300
              units.
            </p>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Every garment carries the name of the person who finished it. If it fails, we repair it,
            for as long as you own it.
          </p>
          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
            {[["300", "Units per style"], ["3", "Partner ateliers"], ["∞", "Repair years"]].map(
              ([n, l]) => (
                <div key={l}>
                  <dt className="font-display text-4xl text-gold">{n}</dt>
                  <dd className="mt-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                    {l}
                  </dd>
                </div>
              ),
            )}
          </dl>
        </Reveal>
      </section>

      <section className="relative mt-28 overflow-hidden border-y border-border">
        <img src={look2} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 size-full object-cover opacity-20" />
        <div className="relative mx-auto max-w-3xl px-5 py-28 text-center">
          <Reveal>
            <p className="font-display text-[clamp(1.4rem,3.2vw,2.5rem)] leading-snug">
              “A coat should outlive the person who designed it.”
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10">
        <Reveal>
          <p className="eyebrow">Boutiques</p>
        </Reveal>
        <div className="mt-10 grid gap-px border border-border bg-border md:grid-cols-3">
          {stores.map(([city, addr, hours]) => (
            <div key={city} className="bg-background p-8">
              <p className="font-display text-3xl">{city}</p>
              <p className="mt-4 text-sm text-muted-foreground">{addr}</p>
              <p className="mt-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                {hours}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-5 pb-32 md:px-10">
        <Reveal>
          <p className="eyebrow">FAQ</p>
          <Accordion type="single" collapsible className="mt-8">
            {[
              ["Do you restock?", "No. Every style is cut once and archived when it sells through."],
              ["How do returns work?", "30 days, unworn, with the atelier seal intact. Return shipping is on us."],
              ["Can I book a fitting?", "Yes — private appointments are available in all three boutiques."],
              ["How should I care for cashmere?", "Hand wash cold, dry flat, never hang. We re-pill free of charge, annually."],
            ].map(([q, a]) => (
              <AccordionItem key={q as string} value={q as string}>
                <AccordionTrigger className="text-left font-display text-base">{q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </section>
    </div>
  );
}
