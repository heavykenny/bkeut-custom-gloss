import { TubePreview } from "../customizer/TubePreview";
import { CASINGS } from "../../data/casings";
import { SHADES } from "../../data/shades";
import { SCENTS } from "../../data/scents";
import type { BagItem } from "../../hooks/use-bag";

type Props = {
  items: BagItem[];
  index: number;
  onIndexChange: (i: number) => void;
};

export function PreviewCarousel({ items, index, onIndexChange }: Props) {
  const item = items[index];

  if (!item) {
    return <p className="text-sm text-foreground/50">Bag is empty.</p>;
  }

  const casing = CASINGS.find((c) => c.id === item.casingId) ?? CASINGS[0];
  const shade = SHADES.find((s) => s.name === item.shadeName) ?? SHADES[0];
  const scent = SCENTS.find((s) => s.name === item.scentName) ?? SCENTS[0];

  return (
    <div className="flex flex-col items-center gap-4">
      <TubePreview casing={casing} shade={shade} scent={scent} label={item.label} size="sm" />
      {items.length > 1 && (
        <div className="flex gap-2">
          {items.map((it, i) => (
            <button
              key={it.id}
              type="button"
              aria-label={`Preview item ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => onIndexChange(i)}
              className={`size-2 rounded-full ${i === index ? "bg-foreground" : "bg-foreground/25"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
