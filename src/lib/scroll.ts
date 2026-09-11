type LenisLike = {
  scrollTo: (target: number, options?: { immediate?: boolean }) => void;
};

let lenis: LenisLike | null = null;
let pendingTarget: number | null = null;

/** Register the active Lenis instance so scroll commands go through it. */
export function registerLenis(instance: LenisLike | null) {
  lenis = instance;
  if (instance && pendingTarget !== null) {
    const target = pendingTarget;
    pendingTarget = null;
    instance.scrollTo(target, { immediate: true });
  }
}

/**
 * Scroll to the top of the page.
 *
 * Lenis keeps its own animated scroll target and overwrites plain
 * `window.scrollTo` calls on every frame, so it must be driven directly —
 * otherwise returning home after scrolling down snaps back to the bottom.
 *
 * Lenis registers asynchronously (after the route mounts), so if it isn't
 * available yet the request is queued and applied the moment it registers.
 * This makes a single call reliable — no retry loops required.
 */
export function scrollToTop() {
  if (lenis) {
    lenis.scrollTo(0, { immediate: true });
  }
  // Reset the raw window scroll too: Lenis re-applies its own target on the
  // next frame (which is 0 after the call above), and this covers the brief
  // window before Lenis registers.
  window.scrollTo(0, 0);
  if (!lenis) {
    pendingTarget = 0;
  }
}
