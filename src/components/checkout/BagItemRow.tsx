import { X } from "lucide-react";
import type { BagItem } from "../../hooks/use-bag";
import { CASINGS } from "../../data/casings";

type Props = {
  item: BagItem;
  onRemove: (id: string) => void;
};

function MiniTube({ casingId, shadeHex }: { casingId: string; shadeHex: string }) {
  const capClass = casingId === "round" ? "bg-[#d3a64d]" : "bg-[#d8d6d2]";

  return (
    <span
      aria-hidden
      className="relative h-11 w-4 overflow-hidden rounded-full border border-foreground/16 bg-white/70 shadow-inner"
    >
      <span
        className={`absolute left-1/2 top-0 h-[34%] w-[90%] -translate-x-1/2 rounded-t-full rounded-b-sm ${capClass}`}
      />
      <span className="absolute left-1/2 top-[32%] h-[5%] w-full -translate-x-1/2 bg-foreground/18" />
      <span
        className="absolute bottom-[6%] left-1/2 h-[56%] w-[68%] -translate-x-1/2 rounded-b-full"
        style={{ backgroundColor: shadeHex }}
      />
      <span className="absolute bottom-[26%] left-1/2 h-[18%] w-full -translate-x-1/2 bg-white/85" />
    </span>
  );
}

export function BagItemRow({ item, onRemove }: Props) {
  const casing = CASINGS.find((c) => c.id === item.casingId);
  return (
    <div className="flex gap-4 items-start">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-md border border-border bg-background/70 shadow-inner">
        <MiniTube casingId={item.casingId} shadeHex={item.shadeHex} />
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
