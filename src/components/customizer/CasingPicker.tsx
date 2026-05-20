import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { TRANSITIONS } from "../../lib/motion";
import type { Casing } from "../../data/casings";

type Props = {
  casings: readonly Casing[];
  active: Casing;
  onSelect: (casing: Casing) => void;
};

function CasingMark({ casingId }: { casingId: string }) {
  const isRound = casingId === "round";
  const isFluted = casingId === "fluted";

  return (
    <span
      aria-hidden
      className="relative h-10 w-4 shrink-0 overflow-hidden rounded-full border border-foreground/18 bg-white/60 shadow-inner"
    >
      <span
        className={`absolute left-1/2 top-0 h-[34%] w-[85%] -translate-x-1/2 rounded-t-full rounded-b-sm ${
          isRound ? "bg-[#d3a64d]" : "bg-[#d8d6d2]"
        }`}
      />
      <span className="absolute left-1/2 top-[32%] h-[5%] w-full -translate-x-1/2 bg-foreground/20" />
      <span className="absolute bottom-[6%] left-1/2 h-[56%] w-[66%] -translate-x-1/2 rounded-b-full bg-[var(--preview-shade)]" />
      {isFluted && (
        <span className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0_5px,rgba(255,255,255,0.5)_5px_6px)]" />
      )}
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
              style={{ "--preview-shade": "#8E533F" } as CSSProperties}
            >
              <CasingMark casingId={c.id} />
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
