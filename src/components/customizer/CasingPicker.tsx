import { motion } from "framer-motion";
import { TRANSITIONS } from "../../lib/motion";
import type { Casing } from "../../data/casings";

type Props = {
  casings: readonly Casing[];
  active: Casing;
  onSelect: (casing: Casing) => void;
};

function CasingMark({ image }: { image: string }) {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-foreground/12 bg-white/70 p-1 shadow-inner">
      <img src={image} alt="" className="h-full w-full object-contain" />
    </span>
  );
}

export function CasingPicker({ casings, active, onSelect }: Props) {
  if (casings.length <= 1) return null;
  return (
    <div>
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60">
        Casing
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {casings.map((c) => {
          const isActive = c.id === active.id;
          return (
            <motion.button
              key={c.id}
              type="button"
              aria-label={c.name}
              aria-pressed={isActive}
              onClick={() => onSelect(c)}
              animate={{ scale: isActive ? 1.015 : 1, opacity: isActive ? 1 : 0.72 }}
              whileTap={{ scale: 0.97 }}
              transition={TRANSITIONS.spring}
              className={`flex min-h-16 items-center gap-3 rounded-md border bg-background/60 p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isActive
                  ? "border-foreground shadow-sm"
                  : "border-border hover:border-foreground/28"
              }`}
            >
              <CasingMark image={c.image} />
              <span className="min-w-0">
                <span className="block text-sm font-semibold leading-tight">{c.name}</span>
                <span className="mt-1 block truncate text-[11px] leading-tight text-foreground/50">
                  {c.blurb}
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
