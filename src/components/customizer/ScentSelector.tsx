import { Button } from "../ui/button";
import { Label } from "../ui/label";
import type { Scent } from "../../data/scents";

type Props = {
  scents: readonly Scent[];
  active: Scent;
  onSelect: (scent: Scent) => void;
};

export function ScentSelector({ scents, active, onSelect }: Props) {
  return (
    <div>
      <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/60 mb-3 block">
        1 · Scent
      </Label>
      <div className="flex flex-wrap gap-2">
        {scents.map((s) => (
          <Button
            key={s.name}
            type="button"
            variant={active.name === s.name ? "default" : "outline"}
            size="sm"
            onClick={() => onSelect(s)}
            className="text-[11px] rounded-full"
          >
            {s.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
