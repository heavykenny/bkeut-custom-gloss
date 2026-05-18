import { Card, CardContent } from "../ui/card";
import type { BagItem } from "../../hooks/use-bag";

type Props = {
  orderId: string;
  items: BagItem[];
  total: number;
};

export function ConfirmationBanner({ orderId, items, total }: Props) {
  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-accent text-lg">✦</span>
          </div>
          <div>
            <p className="font-serif italic text-lg">Booking received</p>
            <p className="text-xs text-foreground/50 font-mono tracking-wide">{orderId}</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          {items.map((it) => (
            <li key={it.id} className="flex justify-between gap-4">
              <span className="truncate">
                {it.shadeName} · {it.scentName} · “{it.label}” ×{it.qty}
              </span>
              <span className="font-mono shrink-0">£{(it.unitPrice * it.qty).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between pt-3 border-t border-border text-sm">
          <span className="text-foreground/60">Total</span>
          <span className="font-mono">£{total.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <span className="size-2 rounded-full bg-amber-500" />
          <span className="text-xs text-foreground/50">
            Payment pending — complete in the Monzo tab
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
