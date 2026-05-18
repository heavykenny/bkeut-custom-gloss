import type { Transition, Variants } from "framer-motion";

export const TRANSITIONS = {
  slide:     { duration: 0.45, ease: [0.32, 0.72, 0, 1] },
  crossfade: { duration: 0.25, ease: "easeInOut" },
  halo:      { duration: 0.80, ease: "easeInOut" },
  panel:     { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  spring:    { type: "spring" as const, stiffness: 400, damping: 30 },
} satisfies Record<string, Transition>;

export const STAGGER: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};
