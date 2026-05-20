import { Label } from "../ui/label";
import { SCENT_MOOD, type Scent } from "../../data/scents";

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
        {scents.map((s) => {
          const isActive = active.name === s.name;
          return (
            <button
              key={s.name}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(s)}
              className={`box-border h-9 rounded-full border px-3 text-center text-[11px] font-semibold leading-none shadow-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background/72 text-foreground hover:border-foreground/25"
              }`}
            >
              {s.name}
            </button>
          );
        })}
      </div>
      <div className="mt-3 min-h-[4.5rem] rounded-md border border-border bg-background/58 p-3">
        <div className="mb-2 flex items-center gap-2">
          <span
            aria-hidden
            className="size-3 rounded-full border border-foreground/10"
            style={{ backgroundColor: SCENT_MOOD[active.name].halo1 }}
          />
          <span
            aria-hidden
            className="size-3 rounded-full border border-foreground/10"
            style={{ backgroundColor: SCENT_MOOD[active.name].halo2 }}
          />
          <span className="text-xs font-semibold text-foreground">{active.notes}</span>
        </div>
        <p className="text-sm leading-relaxed text-foreground/62">{active.description}</p>
      </div>
    </div>
  );
}
