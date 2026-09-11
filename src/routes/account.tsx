import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Heart, Package, MapPin, UserRound } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { products, formatPrice } from "@/lib/products";
import { useShop } from "@/store/shop";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { shopConfig } from "@/config/shop.config";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: `Account — ${shopConfig.shopName}` },
      {
        name: "description",
        content:
          `Sign in to your ${shopConfig.shopName} account to view orders, saved pieces, addresses and profile details.`,
      },
      { property: "og:title", content: `Account — ${shopConfig.shopName}` },
      { property: "og:description", content: "Orders, wishlist and addresses." },
      { property: "og:url", content: "/account" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/account" }],
  }),
  component: Account,
});

type AuthMode = "login" | "register" | "forgot";
type FormValues = { name?: string; email: string; password?: string };

function Account() {
  const [signedIn, setSignedIn] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const wishlist = useShop((s) => s.wishlist);
  const saved = products.filter((p) => wishlist.includes(p.slug));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  if (!signedIn) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-32">
        <Reveal>
          <p className="eyebrow">
            {mode === "login" ? "Welcome back" : mode === "register" ? "Join the house" : "Recover"}
          </p>
          <h1 className="mt-4 font-display text-5xl">
            {mode === "login" ? "Sign in" : mode === "register" ? "Create account" : "Reset password"}
          </h1>

          <form
            className="mt-10 space-y-6"
            onSubmit={handleSubmit(async () => {
              await new Promise((r) => setTimeout(r, 700));
              if (mode === "forgot") {
                toast.success("Reset link sent — check your inbox.");
                setMode("login");
                return;
              }
              toast.success(`Welcome to ${shopConfig.shopName}.`);
              setSignedIn(true);
            })}
          >
            {mode === "register" && (
              <div>
                <label htmlFor="name" className="eyebrow">Full name</label>
                <input
                  id="name"
                  {...register("name", { required: true })}
                  className="mt-3 w-full border-b border-border bg-transparent py-3 text-sm focus:border-gold"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="eyebrow">Email</label>
              <input
                id="email"
                type="email"
                {...register("email", { required: "Email is required" })}
                className="mt-3 w-full border-b border-border bg-transparent py-3 text-sm focus:border-gold"
              />
              {errors.email && (
                <p className="mt-2 text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
            {mode !== "forgot" && (
              <div>
                <label htmlFor="password" className="eyebrow">Password</label>
                <input
                  id="password"
                  type="password"
                  {...register("password", { required: "Password is required", minLength: 6 })}
                  className="mt-3 w-full border-b border-border bg-transparent py-3 text-sm focus:border-gold"
                />
                {errors.password && (
                  <p className="mt-2 text-xs text-destructive">Minimum 6 characters</p>
                )}
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-foreground py-4 font-display text-[0.7rem] uppercase tracking-[0.3em] text-background transition-colors hover:bg-gold disabled:opacity-50"
            >
              {isSubmitting ? "One moment…" : mode === "forgot" ? "Send reset link" : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="mt-8 flex flex-wrap gap-6 text-[11px] uppercase tracking-widest text-muted-foreground">
            {mode !== "login" && (
              <button onClick={() => setMode("login")} className="hover:text-gold">Sign in</button>
            )}
            {mode !== "register" && (
              <button onClick={() => setMode("register")} className="hover:text-gold">Create account</button>
            )}
            {mode !== "forgot" && (
              <button onClick={() => setMode("forgot")} className="hover:text-gold">Forgot password</button>
            )}
          </div>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-32 pt-32 md:px-10 md:pt-40">
      <Reveal>
        <p className="eyebrow">Account</p>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,4rem)]">Good evening, Elise</h1>
      </Reveal>

      <Tabs defaultValue="orders" className="mt-14">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
          {[
            ["orders", "Orders", Package],
            ["wishlist", "Wishlist", Heart],
            ["addresses", "Addresses", MapPin],
            ["profile", "Profile", UserRound],
          ].map(([v, label, Icon]) => {
            const I = Icon as typeof Package;
            return (
              <TabsTrigger
                key={v as string}
                value={v as string}
                className="gap-2 rounded-none border border-border px-5 py-3 text-[11px] uppercase tracking-widest data-[state=active]:border-gold data-[state=active]:text-gold"
              >
                <I className="size-3.5" />
                {label as string}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="orders" className="mt-10">
          <ul className="divide-y divide-border border-y border-border">
            {[
              ["MN-40219", "Delivered", "Atelier Wool Trench", 1890],
              ["MN-39884", "In transit", "Noir Cashmere Hoodie", 690],
            ].map(([id, status, item, total]) => (
              <li key={id as string} className="grid gap-3 py-6 sm:grid-cols-4 sm:items-center">
                <span className="font-display text-sm">{id as string}</span>
                <span
                  className={cn(
                    "text-[11px] uppercase tracking-widest",
                    status === "Delivered" ? "text-muted-foreground" : "text-gold",
                  )}
                >
                  {status as string}
                </span>
                <span className="text-sm text-muted-foreground">{item as string}</span>
                <span className="font-display text-sm sm:text-right">
                  {formatPrice(total as number)}
                </span>
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="wishlist" className="mt-10">
          {saved.length === 0 ? (
            <div className="border border-border py-24 text-center">
              <p className="font-display text-2xl">Nothing saved yet</p>
              <Link to="/shop" className="eyebrow lux-underline mt-5 inline-block text-gold">
                Browse the collection
              </Link>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
              {saved.map((p) => (
                <li key={p.id}>
                  <Link to="/product/$slug" params={{ slug: p.slug }}>
                    <img src={p.image} alt={p.name} loading="lazy" className="aspect-[4/5] w-full object-cover" />
                    <p className="mt-3 font-display text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{formatPrice(p.price)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="addresses" className="mt-10 grid gap-5 sm:grid-cols-2">
          {[
            ["Home", "18 Rue Charlot, 75003 Paris, France"],
            ["Studio", "39 Redchurch Street, London E2 7DJ, UK"],
          ].map(([label, addr]) => (
            <div key={label} className="glass p-6">
              <p className="eyebrow text-gold">{label}</p>
              <p className="mt-4 text-sm text-muted-foreground">{addr}</p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="profile" className="mt-10 max-w-md space-y-6">
          <div>
            <p className="eyebrow">Name</p>
            <p className="mt-2 text-sm">Elise Marchand</p>
          </div>
<div>
              <p className="eyebrow">Email</p>
              <p className="mt-2 text-sm">{shopConfig.contactEmail}</p>
            </div>
          <button
            onClick={() => {
              setSignedIn(false);
              toast("Signed out");
            }}
            className="border border-border px-6 py-3 text-[11px] uppercase tracking-widest hover:border-gold hover:text-gold"
          >
            Sign out
          </button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
