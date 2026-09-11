import { AnimatePresence, motion } from "motion/react";
import { X, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.colors.some((c) => c.name.toLowerCase().includes(q))
    );
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleProductClick = (slug: string) => {
    onClose();
    navigate({ to: `/product/${slug}` });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-background/95 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="mx-auto max-w-2xl mt-20 px-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 border-b border-border pb-4">
              <Search className="size-5 text-muted-foreground" />
              <input
                type="search"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground font-display text-lg outline-none"
                aria-label="Search products"
              />
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close search"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-6 max-h-[60vh] overflow-y-auto">
              {query.trim() ? (
                results.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {results.map((p, i) => (
                      <button
                        key={p.id}
                        onClick={() => handleProductClick(p.slug)}
                        className="group"
                      >
                        <ProductCard product={p} index={i} />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-12">
                    No results for "{query}"
                  </p>
                )
              ) : (
                <p className="text-center text-muted-foreground py-12">
                  Type to search products, categories, or colors
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}