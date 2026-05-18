import { X } from "lucide-react";
import type { BagItem } from "../../hooks/use-bag";
import { CASINGS } from "../../data/casings";

type Props = {
  item: BagItem;
  onRemove: (id: string) => void;
};

export function BagItemRow({ item, onRemove }: Props) {
  const casing = CASINGS.find((c) => c.id === item.casingId);
  return (
    <div className="flex gap-4 items-start">
      <div
        className="size-12 rounded-md shrink-0 bg-secondary flex items-center justify-center"
        style={{ boxShadow: `inset 0 -6px 12px ${item.shadeHex}` }}
      >
        {casing && (
          <img src={casing.image} alt="" className="w-full h-full object-contain p-1" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          {casing?.name ?? item.casingId} · {item.shadeName} · {item.scentName}
        </p>
        <p className="font-serif italic text-sm text-foreground/70 truncate">
          “{item.label}”
        </p>
        <p className="text-xs text-foreground/50 mt-1">
          ×{item.qty} · £{(item.unitPrice * item.qty).toFixed(2)}
        </p>
      </div>
      <button
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.label}`}
        className="text-foreground/40 hover:text-foreground p-1"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
