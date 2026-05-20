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
  { stage: string; verticalTube: string; horizontalTube: string; labelText: string }
> = {
  lg: {
    stage: "h-[390px] sm:h-[430px] lg:h-[calc(100svh-156px)] lg:min-h-[540px] lg:max-h-[680px]",
    verticalTube: "h-[340px] w-[132px] sm:h-[390px] sm:w-[150px] lg:h-[520px] lg:w-[198px]",
    horizontalTube:
      "h-[132px] w-[min(88vw,350px)] sm:h-[150px] sm:w-[430px] lg:h-[170px] lg:w-[460px]",
    labelText: "text-sm sm:text-base",
  },
  sm: {
    stage: "h-[290px]",
    verticalTube: "h-[250px] w-[96px]",
    horizontalTube: "h-[92px] w-[240px]",
    labelText: "text-xs",
  },
};

const CHROME: Record<string, { cap: string; collar: string; ridge?: string }> = {
  slim: {
    cap: "linear-gradient(90deg, #f8f8f6 0%, #9c9a96 18%, #ffffff 32%, #171614 50%, #f6f2ec 72%, #9b9690 100%)",
    collar:
      "linear-gradient(90deg, #d7d3cc 0%, #ffffff 28%, #282522 50%, #f4efe7 72%, #8c8780 100%)",
  },
  fluted: {
    cap: "repeating-linear-gradient(90deg, #f7f4ef 0 10px, #d6d0c7 10px 18px, #ffffff 18px 28px, #57504a 28px 36px)",
    collar:
      "linear-gradient(90deg, #cfc6bb 0%, #fffaf3 28%, #5f534a 50%, #f7efe4 72%, #a99b8c 100%)",
    ridge:
      "repeating-linear-gradient(90deg, transparent 0 14px, rgba(255,255,255,0.32) 14px 16px, transparent 16px 28px)",
  },
  round: {
    cap: "linear-gradient(90deg, #f8e7bd 0%, #b98b3d 18%, #fff2c8 36%, #4a3617 52%, #f5db95 72%, #9d7028 100%)",
    collar:
      "linear-gradient(90deg, #c89638 0%, #fff0b8 30%, #523a13 50%, #f2d17a 72%, #94681f 100%)",
  },
};

function casingChrome(casing: Casing) {
  return CHROME[casing.id] ?? CHROME.slim;
}

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
  const chrome = casingChrome(casing);
  const isHorizontal = orientation === "horizontal";
  const tubeClass = isHorizontal ? dims.horizontalTube : dims.verticalTube;
  const horizontalLabelClass =
    size === "sm" ? "left-[41%] right-[7%] h-[40%] px-2" : "left-[43%] right-[10%] h-[38%] px-4";
  const verticalLabelClass =
    size === "sm"
      ? "left-1/2 top-[42%] h-[44%] w-[30%] -translate-x-1/2 px-1"
      : "left-1/2 top-[41%] h-[45%] w-[30%] -translate-x-1/2 px-1";
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
          aria-label={`${casing.name} lip gloss tube preview`}
          role="img"
          className={`relative z-10 ${tubeClass} drop-shadow-[0_30px_45px_rgba(25,18,24,0.22)]`}
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.985 }}
          transition={TRANSITIONS.crossfade}
        >
          {isHorizontal ? (
            <>
              <div
                aria-hidden
                className="absolute left-0 top-1/2 h-[62%] w-[35%] -translate-y-1/2 overflow-hidden rounded-l-full rounded-r-md border border-black/15 shadow-[inset_0_0_12px_rgba(255,255,255,0.8),inset_0_-16px_24px_rgba(0,0,0,0.18)]"
                style={{ background: chrome.cap }}
              />
              <div
                aria-hidden
                className="absolute left-[31.5%] top-1/2 h-[69%] w-[5%] -translate-y-1/2 rounded-sm border border-black/15 shadow-sm"
                style={{ background: chrome.collar }}
              />
              <div className="absolute right-[1.5%] top-1/2 h-[52%] w-[64%] -translate-y-1/2 overflow-hidden rounded-l-md rounded-r-full border border-black/15 bg-white/45 shadow-[inset_0_0_20px_rgba(255,255,255,0.86),inset_0_-16px_28px_rgba(0,0,0,0.13)]">
                <motion.div
                  aria-hidden
                  className="absolute inset-y-[10%] left-[6%] right-[5%] rounded-l-sm rounded-r-full"
                  animate={{ backgroundColor: shade.hex }}
                  transition={TRANSITIONS.halo}
                  style={{
                    backgroundColor: shade.hex,
                    boxShadow:
                      "inset 0 -22px 38px rgba(0,0,0,0.28), inset 0 18px 28px rgba(255,255,255,0.22)",
                  }}
                />
                {chrome.ridge && (
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-80"
                    style={{ background: chrome.ridge }}
                  />
                )}
                <div
                  aria-hidden
                  className="absolute inset-y-[8%] left-[13%] w-[10%] rounded-full bg-white/45 blur-[2px]"
                />
                <div
                  aria-hidden
                  className="absolute inset-y-[12%] right-[12%] w-[5%] rounded-full bg-black/10 blur-[3px]"
                />
              </div>
              <div
                className={`absolute top-1/2 flex -translate-y-1/2 items-center justify-center rounded-sm border-y border-black/10 bg-white/88 shadow-[0_10px_26px_rgba(24,18,23,0.08)] backdrop-blur-sm ${horizontalLabelClass}`}
              >
                <span
                  className={`max-w-full truncate font-sans font-semibold text-foreground/80 ${dims.labelText}`}
                >
                  {text}
                </span>
              </div>
            </>
          ) : (
            <>
              <div
                aria-hidden
                className="absolute left-1/2 top-0 h-[34%] w-[63%] -translate-x-1/2 overflow-hidden rounded-t-full rounded-b-md border border-black/15 shadow-[inset_0_0_12px_rgba(255,255,255,0.8),inset_-12px_0_24px_rgba(0,0,0,0.18)]"
                style={{ background: chrome.cap }}
              />
              <div
                aria-hidden
                className="absolute left-1/2 top-[31%] h-[5%] w-[69%] -translate-x-1/2 rounded-sm border border-black/15 shadow-sm"
                style={{ background: chrome.collar }}
              />
              <div className="absolute bottom-[1.5%] left-1/2 h-[64%] w-[52%] -translate-x-1/2 overflow-hidden rounded-t-md rounded-b-full border border-black/15 bg-white/45 shadow-[inset_0_0_20px_rgba(255,255,255,0.86),inset_-14px_0_28px_rgba(0,0,0,0.13)]">
                <motion.div
                  aria-hidden
                  className="absolute inset-x-[10%] bottom-[5%] top-[7%] rounded-t-sm rounded-b-full"
                  animate={{ backgroundColor: shade.hex }}
                  transition={TRANSITIONS.halo}
                  style={{
                    backgroundColor: shade.hex,
                    boxShadow:
                      "inset 0 -30px 44px rgba(0,0,0,0.30), inset 0 24px 34px rgba(255,255,255,0.2)",
                  }}
                />
                {chrome.ridge && (
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-80"
                    style={{ background: chrome.ridge }}
                  />
                )}
                <div
                  aria-hidden
                  className="absolute bottom-[8%] left-[22%] top-[9%] w-[13%] rounded-full bg-white/45 blur-[2px]"
                />
                <div
                  aria-hidden
                  className="absolute bottom-[12%] right-[16%] top-[12%] w-[7%] rounded-full bg-black/10 blur-[3px]"
                />
              </div>
              <div
                className={`absolute flex items-center justify-center rounded-sm border-x border-black/10 bg-white/90 shadow-[0_10px_26px_rgba(24,18,23,0.08)] backdrop-blur-sm ${verticalLabelClass}`}
              >
                <span
                  className={`block max-w-none -rotate-90 whitespace-nowrap font-sans font-semibold text-foreground/80 ${dims.labelText}`}
                >
                  {text}
                </span>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
