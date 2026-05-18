import { useState } from "react";
import { motion } from "framer-motion";
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
import { TubePreview } from "./TubePreview";
import { useBag } from "../../hooks/use-bag";
import { TRANSITIONS } from "../../lib/motion";

type Props = {
  onAdded: () => void;  // called after add — parent opens MiniBagPanel
};

const UNIT_PRICE = LIPGLOSS.fromPrice ?? 0;

export function CustomizerScreen({ onAdded }: Props) {
  const [casing, setCasing] = useState(CASINGS[0]);
  const [shade, setShade] = useState(SHADES[0]);
  const [scent, setScent] = useState(SCENTS[0]);
  const [label, setLabel] = useState("");
  const [qty, setQty] = useState(1);
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
      className="max-w-7xl mx-auto px-6 md:px-8 py-10 md:py-16 grid md:grid-cols-2 gap-10 lg:gap-20 items-start"
    >
      <div className="space-y-8">
        <CasingPicker casings={CASINGS} active={casing} onSelect={setCasing} />
        <ProductHeader name={LIPGLOSS.name} price={UNIT_PRICE} blurb={LIPGLOSS.tagline} />
        <div className="space-y-6">
          <ScentSelector scents={SCENTS} active={scent} onSelect={setScent} />
          <ShadeSelector shades={SHADES} active={shade} onSelect={setShade} />
          <LabelInput value={label} onChange={setLabel} />
          <QuantitySelector qty={qty} onChange={setQty} />
        </div>
        <Button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          className="w-full md:w-auto bg-foreground text-background hover:bg-foreground/95 px-8 py-4 rounded-xl font-bold text-sm tracking-[0.15em] uppercase shadow-xl shadow-foreground/20 h-auto disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add to bag · £{lineTotal}
        </Button>
      </div>
      <div className="flex justify-center">
        <TubePreview casing={casing} shade={shade} scent={scent} label={label} />
      </div>
    </motion.section>
  );
}
