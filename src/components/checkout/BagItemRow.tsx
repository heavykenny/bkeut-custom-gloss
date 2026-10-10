import { X } from "lucide-react";
import type { BagItem } from "../../hooks/use-bag";
import { CASINGS } from "../../data/casings";

type Props = {
  item: BagItem;
  onRemove: (id: string) => void;
};

function MiniTube({ image }: { image: string }) {
  return (
    <span className="flex size-10 items-center justify-center overflow-hidden rounded-md bg-white/70 p-1 shadow-inner">
      <img src={image} alt="" className="h-full w-full object-contain" />
    </span>
  );
}

export function BagItemRow({ item, onRemove }: Props) {
  const casing = CASINGS.find((c) => c.id === item.casingId);
  return (
    <div className="flex gap-4 items-start">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-md border border-border bg-background/70 shadow-inner">
        {casing ? <MiniTube image={casing.image} /> : <span className="text-sm">B</span>}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          {casing?.name ?? item.casingId} · {item.shadeName} · {item.scentName}
        </p>
        <p className="truncate text-sm font-semibold text-foreground/70">“{item.label}”</p>
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
