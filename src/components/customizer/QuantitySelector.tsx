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
      <div className="flex items-center border border-border rounded-lg w-fit">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange(Math.max(1, qty - 1))}
          className="px-4 py-3 h-auto rounded-none rounded-l-lg"
        >
          −
        </Button>
        <span className="px-5 py-3 font-mono border-x border-border min-w-[3rem] text-center text-sm">
          {String(qty).padStart(2, "0")}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange(qty + 1)}
          className="px-4 py-3 h-auto rounded-none rounded-r-lg"
        >
          +
        </Button>
      </div>
    </div>
  );
}
