import { motion } from "framer-motion";
import { TRANSITIONS } from "../../lib/motion";
import type { Casing } from "../../data/casings";

type Props = {
  casings: readonly Casing[];
  active: Casing;
  onSelect: (casing: Casing) => void;
};

export function CasingPicker({ casings, active, onSelect }: Props) {
  if (casings.length <= 1) return null;
  return (
    <div className="flex gap-3 items-center">
      {casings.map((c) => {
        const isActive = c.id === active.id;
        return (
          <motion.button
            key={c.id}
            type="button"
            aria-label={c.name}
            aria-pressed={isActive}
            onClick={() => onSelect(c)}
            animate={{ scale: isActive ? 1.05 : 1, opacity: isActive ? 1 : 0.6 }}
            whileTap={{ scale: 0.97 }}
            transition={TRANSITIONS.spring}
            className={`size-16 rounded-xl overflow-hidden bg-secondary border ${isActive ? "border-foreground" : "border-border"}`}
          >
            <img src={c.image} alt="" className="w-full h-full object-contain p-2" />
          </motion.button>
        );
      })}
    </div>
  );
}
