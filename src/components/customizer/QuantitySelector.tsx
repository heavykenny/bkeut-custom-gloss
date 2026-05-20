import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

type Props = {
  qty: number;
  onChange: (qty: number) => void;
};

export function QuantitySelector({ qty, onChange }: Props) {
  return (
    <div>
      <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/60 mb-3 block">
        4 · Quantity
      </Label>
      <div className="flex w-fit items-center rounded-md border border-border bg-background/55 shadow-inner">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange(Math.max(1, qty - 1))}
          aria-label="Decrease quantity"
          className="h-11 rounded-none rounded-l-md px-4"
        >
          <Minus className="size-4" />
        </Button>
        <span
          aria-live="polite"
          className="min-w-[3.25rem] border-x border-border px-5 py-3 text-center font-mono text-sm"
        >
          {String(qty).padStart(2, "0")}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange(qty + 1)}
          aria-label="Increase quantity"
          className="h-11 rounded-none rounded-r-md px-4"
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}
