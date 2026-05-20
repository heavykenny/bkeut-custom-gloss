import { Button } from "../ui/button";
import { ConfirmationBanner } from "./ConfirmationBanner";
import type { BagItem } from "../../hooks/use-bag";

type Confirmed = { orderId: string; items: BagItem[]; total: number };

type Props = {
  items: BagItem[];
  subtotal: number;
  confirmed: Confirmed | null;
  onPay: () => void;
};

export function OrderSummary({ items, subtotal, confirmed, onPay }: Props) {
  const disabled = items.length === 0 || confirmed !== null;
  return (
    <div className="space-y-6">
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={it.id} className="text-sm">
            <div className="flex justify-between gap-4">
              <span className="font-medium">
                {i + 1} · {it.shadeName} · {it.scentName}
              </span>
              <span className="font-mono">£{(it.unitPrice * it.qty).toFixed(2)}</span>
            </div>
            <div className="font-semibold text-foreground/60">
              “{it.label}” ×{it.qty}
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t border-border pt-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-foreground/60">Subtotal</span>
          <span className="font-mono">£{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/60">Delivery</span>
          <span className="font-mono">Free UK</span>
        </div>
        <div className="flex justify-between font-medium pt-2 border-t border-border">
          <span>Total</span>
          <span className="font-mono">£{subtotal.toFixed(2)}</span>
        </div>
      </div>

      <Button
        type="button"
        onClick={onPay}
        disabled={disabled}
        className="w-full bg-foreground text-background hover:bg-foreground/95 px-6 py-4 rounded-xl font-bold text-sm tracking-[0.15em] uppercase h-auto"
      >
        Pay £{subtotal.toFixed(2)} with Monzo
      </Button>
      <p className="text-[10px] text-foreground/40 text-center">Secure payment via Monzo link</p>

      {confirmed && (
        <ConfirmationBanner
          orderId={confirmed.orderId}
          items={confirmed.items}
          total={confirmed.total}
        />
      )}
    </div>
  );
}
