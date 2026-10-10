import { motion, AnimatePresence } from "framer-motion";
import { TRANSITIONS } from "../../lib/motion";
import type { Casing } from "../../data/casings";
import type { Shade } from "../../data/shades";
import { SCENT_MOOD, type Scent } from "../../data/scents";

type Size = "lg" | "sm";
export type PreviewOrientation = "vertical" | "horizontal";

type Props = {
  casing: Casing;
  shade: Shade;
  scent: Scent;
  label: string;
  size?: Size;
  orientation?: PreviewOrientation;
};

const DIMENSIONS: Record<
  Size,
  {
    stage: string;
    bottle: string;
    horizontalStage: string;
    infoCard: string;
    labelText: string;
    metaText: string;
  }
> = {
  lg: {
    stage: "h-[390px] sm:h-[430px] lg:h-[calc(100svh-156px)] lg:min-h-[540px] lg:max-h-[680px]",
    bottle: "h-[250px] w-[96px] sm:h-[300px] sm:w-[116px] lg:h-[390px] lg:w-[150px]",
    horizontalStage:
      "h-[160px] w-[min(88vw,320px)] sm:h-[180px] sm:w-[400px] lg:h-[220px] lg:w-[460px]",
    infoCard: "w-full max-w-sm px-4 py-4 sm:px-5",
    labelText: "text-lg sm:text-xl",
    metaText: "text-xs sm:text-sm",
  },
  sm: {
    stage: "h-[290px]",
    bottle: "h-[170px] w-[66px]",
    horizontalStage: "h-[110px] w-[220px]",
    infoCard: "w-full max-w-[220px] px-3 py-3",
    labelText: "text-sm",
    metaText: "text-[11px]",
  },
};

export function TubePreview({
  casing,
  shade,
  scent,
  label,
  size = "lg",
  orientation = "vertical",
}: Props) {
  const mood = SCENT_MOOD[scent.name];
  const dims = DIMENSIONS[size];
  const isHorizontal = orientation === "horizontal";
  const text = label.trim() || "Your text";

  return (
    <motion.div
      layoutId="tube"
      className={`relative isolate grid w-full place-items-center overflow-hidden rounded-md border border-border/70 bg-card/70 shadow-[0_24px_70px_rgba(34,24,32,0.08)] ${dims.stage}`}
    >
      <motion.div
        aria-hidden
        className="absolute -right-10 bottom-8 size-56 rounded-full blur-3xl"
        animate={{ backgroundColor: mood.halo1 }}
        transition={TRANSITIONS.halo}
      />
      <motion.div
        aria-hidden
        className="absolute -left-10 top-10 size-44 rounded-full blur-2xl"
        animate={{ backgroundColor: mood.halo2 }}
        transition={TRANSITIONS.halo}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(255,255,255,0.42)_48%,rgba(255,255,255,0.74))]"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${casing.id}-${orientation}`}
          className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-4 px-4 py-6 sm:gap-5"
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.985 }}
          transition={TRANSITIONS.crossfade}
        >
          <div className="relative flex items-center justify-center">
            {isHorizontal ? (
              <div
                className={`relative overflow-visible ${dims.horizontalStage}`}
              >
                <div
                  className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 ${dims.bottle}`}
                >
                  <img
                    src={casing.image}
                    alt={`${casing.name} lip gloss bottle preview`}
                    className="h-full w-full object-contain drop-shadow-[0_30px_45px_rgba(25,18,24,0.22)]"
                  />
                </div>
              </div>
            ) : (
              <div
                className={dims.bottle}
              >
                <img
                  src={casing.image}
                  alt={`${casing.name} lip gloss bottle preview`}
                  className="h-full w-full object-contain drop-shadow-[0_30px_45px_rgba(25,18,24,0.22)]"
                />
              </div>
            )}
          </div>

          <div
            className={`rounded-md border border-black/8 bg-white/86 shadow-[0_18px_38px_rgba(24,18,23,0.08)] backdrop-blur-sm ${dims.infoCard}`}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/45">
              Custom label
            </p>
            <p className={`mt-2 font-serif tracking-[0.01em] text-foreground ${dims.labelText}`}>
              {text}
            </p>
            <div className={`mt-3 flex items-center justify-between gap-3 text-foreground/60 ${dims.metaText}`}>
              <span className="truncate">{casing.name}</span>
              <span className="inline-flex min-w-0 items-center gap-2 truncate">
                <motion.span
                  aria-hidden
                  className="size-2.5 shrink-0 rounded-full border border-black/10"
                  animate={{ backgroundColor: shade.hex }}
                  transition={TRANSITIONS.halo}
                  style={{ backgroundColor: shade.hex }}
                />
                <span className="truncate">{shade.name}</span>
              </span>
              <span className="truncate">{scent.name}</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
