import { useState } from "react";
import { motion } from "framer-motion";
import { RectangleHorizontal, RectangleVertical } from "lucide-react";
import { Button } from "../ui/button";
import { CASINGS } from "../../data/casings";
import { SHADES } from "../../data/shades";
import { SCENTS } from "../../data/scents";
import { LIPGLOSS } from "../../data/products";
import { CasingPicker } from "./CasingPicker";
import { ProductHeader } from "./ProductHeader";
import { ScentSelector } from "./ScentSelector";
import { ShadeSelector } from "./ShadeSelector";
import { LabelInput } from "./LabelInput";
import { QuantitySelector } from "./QuantitySelector";
import { TubePreview, type PreviewOrientation } from "./TubePreview";
import { useBag } from "../../hooks/use-bag";
import { FADE_UP, STAGGER, TRANSITIONS } from "../../lib/motion";

type Props = {
  onAdded: () => void;
};

const UNIT_PRICE = LIPGLOSS.fromPrice ?? 0;
const ORIENTATION_OPTIONS: readonly {
  value: PreviewOrientation;
  label: string;
  icon: typeof RectangleVertical;
}[] = [
  { value: "vertical", label: "Standing", icon: RectangleVertical },
  { value: "horizontal", label: "Flat lay", icon: RectangleHorizontal },
];

export function CustomizerScreen({ onAdded }: Props) {
  const [casing, setCasing] = useState(CASINGS[0]);
  const [shade, setShade] = useState(SHADES[0]);
  const [scent, setScent] = useState(SCENTS[0]);
  const [label, setLabel] = useState("");
  const [qty, setQty] = useState(1);
  const [orientation, setOrientation] = useState<PreviewOrientation>("vertical");
  const { add } = useBag();

  const lineTotal = UNIT_PRICE * qty;
  const canAdd = label.trim().length > 0;

  const handleAdd = () => {
    if (!canAdd) return;
    add({
      casingId: casing.id,
      shadeName: shade.name,
      shadeHex: shade.hex,
      scentName: scent.name,
      label: label.trim(),
      qty,
      unitPrice: UNIT_PRICE,
    });
    onAdded();
  };

  return (
    <motion.section
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={TRANSITIONS.slide}
      className="mx-auto grid min-h-[calc(100svh-69px)] max-w-7xl grid-cols-1 gap-5 px-4 py-5 sm:px-6 md:grid-cols-[minmax(0,0.92fr)_minmax(360px,0.88fr)] md:gap-8 md:px-8 md:py-8 lg:gap-10"
    >
      <motion.div
        variants={STAGGER}
        initial="hidden"
        animate="visible"
        className="order-2 self-center rounded-md border border-border/80 bg-card/90 p-4 shadow-[0_18px_50px_rgba(34,24,32,0.07)] backdrop-blur-sm sm:p-5 md:order-1 lg:p-6"
      >
        <motion.div variants={FADE_UP}>
          <ProductHeader name={LIPGLOSS.name} blurb={LIPGLOSS.tagline} />
        </motion.div>
        <motion.div variants={FADE_UP} className="mt-6">
          <CasingPicker casings={CASINGS} active={casing} onSelect={setCasing} />
        </motion.div>
        <motion.div variants={FADE_UP} className="mt-6 space-y-5">
          <ScentSelector scents={SCENTS} active={scent} onSelect={setScent} />
          <ShadeSelector shades={SHADES} active={shade} onSelect={setShade} />
          <LabelInput value={label} onChange={setLabel} />
          <QuantitySelector qty={qty} onChange={setQty} />
        </motion.div>
        <motion.div variants={FADE_UP} whileTap={{ scale: canAdd ? 0.985 : 1 }} className="mt-6">
          <Button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className="h-auto w-full rounded-md bg-foreground px-8 py-4 text-sm font-bold uppercase tracking-[0.14em] text-background shadow-[0_14px_30px_rgba(34,24,32,0.16)] hover:bg-foreground/94 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add to bag · £{lineTotal}
          </Button>
        </motion.div>
      </motion.div>

      <div className="order-1 md:order-2 md:sticky md:top-24">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/50">
            Live preview
          </p>
          <div className="inline-flex rounded-full border border-border bg-card p-1 shadow-sm">
            {ORIENTATION_OPTIONS.map(({ value, label: optionLabel, icon: Icon }) => {
              const active = orientation === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setOrientation(value)}
                  className={`inline-flex h-9 items-center gap-2 rounded-full px-3 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    active
                      ? "bg-foreground text-background shadow-sm"
                      : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                  <span>{optionLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
        <TubePreview
          casing={casing}
          shade={shade}
          scent={scent}
          label={label}
          orientation={orientation}
        />
      </div>
    </motion.section>
  );
}
