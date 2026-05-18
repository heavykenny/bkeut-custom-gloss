import { motion, AnimatePresence } from "framer-motion";
import { TRANSITIONS } from "../../lib/motion";
import type { Casing } from "../../data/casings";
import type { Shade } from "../../data/shades";
import { SCENT_MOOD, type Scent } from "../../data/scents";

type Size = "lg" | "sm";

type Props = {
  casing: Casing;
  shade: Shade;
  scent: Scent;
  label: string;
  size?: Size;
};

const DIMENSIONS: Record<Size, { w: string; h: string; labelText: string }> = {
  lg: { w: "w-[360px] md:w-[480px]", h: "h-[720px] md:h-[860px]", labelText: "text-sm md:text-base" },
  sm: { w: "w-[200px]",              h: "h-[400px]",              labelText: "text-xs" },
};

export function TubePreview({ casing, shade, scent, label, size = "lg" }: Props) {
  const mood = SCENT_MOOD[scent.name];
  const dims = DIMENSIONS[size];

  return (
    <motion.div layoutId="tube" className={`relative ${dims.w} ${dims.h}`}>
      {/* Halo behind the tube — tinted by scent */}
      <motion.div
        aria-hidden
        className="absolute -bottom-12 -right-8 size-40 rounded-full blur-3xl -z-10"
        animate={{ backgroundColor: mood.halo1 }}
        transition={TRANSITIONS.halo}
      />
      <motion.div
        aria-hidden
        className="absolute top-12 -left-12 size-32 rounded-full blur-2xl -z-10"
        animate={{ backgroundColor: mood.halo2 }}
        transition={TRANSITIONS.halo}
      />

      {/* Gloss color fill behind the casing */}
      <div
        aria-hidden
        className="absolute transition-colors duration-700"
        style={{
          left: "41.5%",
          right: "41.5%",
          top: "32.5%",
          bottom: "7%",
          background: shade.hex,
          borderRadius: "6% 6% 28% 28% / 2% 2% 8% 8%",
          boxShadow:
            "inset 0 -30px 60px rgba(0,0,0,0.35), inset 0 20px 40px rgba(255,255,255,0.08)",
        }}
      />

      {/* Casing image — crossfades when casing changes */}
      <AnimatePresence mode="wait">
        <motion.img
          key={casing.id}
          src={casing.image}
          alt={`${casing.name} lip gloss tube`}
          width={1024}
          height={1024}
          loading="lazy"
          className="relative w-full h-full object-contain drop-shadow-[0_40px_60px_rgba(62,36,24,0.35)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={TRANSITIONS.crossfade}
        />
      </AnimatePresence>

      {/* Horizontal sleeve label wrapped around the tube body */}
      <div
        className="absolute pointer-events-none flex items-center justify-center"
        style={{ left: "32%", right: "32%", top: "55%", height: "10%" }}
      >
        <div className="w-full h-full bg-background/85 backdrop-blur-sm border-y border-foreground/15 flex items-center justify-center">
          <span className={`font-serif italic text-foreground/80 ${dims.labelText} px-2 truncate`}>
            {label || "Your text"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
