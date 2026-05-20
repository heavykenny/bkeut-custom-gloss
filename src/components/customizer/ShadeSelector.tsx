import { Label } from "../ui/label";
import type { Shade } from "../../data/shades";

type Props = {
  shades: readonly Shade[];
  active: Shade;
  onSelect: (shade: Shade) => void;
};

export function ShadeSelector({ shades, active, onSelect }: Props) {
  return (
    <div>
      <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/60 mb-3 block">
        2 · Shade —{" "}
        <span className="normal-case tracking-normal text-foreground/80">{active.name}</span>
      </Label>
      <div className="flex flex-wrap gap-3">
        {shades.map((s) => {
          const isActive = s.name === active.name;
          return (
            <button
              key={s.name}
              type="button"
              aria-label={s.name}
              onClick={() => onSelect(s)}
              style={{ background: s.hex }}
              className={`size-10 rounded-full shadow-inner transition-transform hover:scale-110 ${
                isActive ? "ring-2 ring-offset-2 ring-foreground" : "ring-1 ring-foreground/10"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
