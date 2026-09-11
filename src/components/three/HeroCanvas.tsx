import { Suspense, lazy } from "react";
import { useMounted, usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

const HeroScene = lazy(() => import("./HeroScene"));

/** Renders the R3F scene only in the browser, after hydration. */
export function HeroCanvas() {
  const mounted = useMounted();
  const reduced = usePrefersReducedMotion();
  if (!mounted) return <div className="absolute inset-0 bg-background" aria-hidden="true" />;
  return (
    <Suspense fallback={<div className="absolute inset-0 bg-background" aria-hidden="true" />}>
      <HeroScene reduced={reduced} />
    </Suspense>
  );
}
