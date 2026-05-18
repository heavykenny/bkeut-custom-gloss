import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { TubePreview } from "../customizer/TubePreview";
import { CASINGS } from "../../data/casings";
import { SHADES } from "../../data/shades";
import { SCENTS } from "../../data/scents";
import { useBag } from "../../hooks/use-bag";
import { TRANSITIONS } from "../../lib/motion";
import { ConfirmationBanner } from "./ConfirmationBanner";

function generateOrderId(): string {
  return `BKEUT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function ReviewScreen() {
  const { items, subtotal } = useBag();
  const navigate = useNavigate();
  // Show the most recently added item first so the layoutId tube morph is continuous
  const orderedItems = useMemo(() => [...items].reverse(), [items]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [confirmed, setConfirmed] = useState<{ orderId: string } | null>(null);

  const handlePay = () => {
    if (items.length === 0) return;
    const orderId = generateOrderId();
    setConfirmed({ orderId });
    const description = encodeURIComponent(
      `BKEUT ${items.length === 1 ? "Gloss" : `Gloss x${items.length}`}`,
    );
    window.open(
      `https://monzo.me/?amount=${subtotal.toFixed(2)}&description=${description}`,
      "_blank",
    );
  };

  const previewItem = orderedItems[previewIndex];
  const previewCasing = previewItem
    ? CASINGS.find((c) => c.id === previewItem.casingId) ?? CASINGS[0]
    : CASINGS[0];
  const previewShade = previewItem
    ? SHADES.find((s) => s.name === previewItem.shadeName) ?? SHADES[0]
    : SHADES[0];
  const previewScent = previewItem
    ? SCENTS.find((s) => s.name === previewItem.scentName) ?? SCENTS[0]
    : SCENTS[0];

  return (
    <motion.section
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={TRANSITIONS.slide}
      className="max-w-5xl mx-auto px-6 md:px-8 py-10 md:py-16"
    >
      <div className="flex items-center justify-between mb-10">
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate({ to: "/", search: {} })}
          className="gap-2"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <h1 className="font-serif text-2xl md:text-3xl">Review your order</h1>
        <span className="w-16" aria-hidden />
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div className="flex flex-col items-center gap-4">
          {previewItem ? (
            <>
              <TubePreview
                casing={previewCasing}
                shade={previewShade}
                scent={previewScent}
                label={previewItem.label}
                size="sm"
              />
              {orderedItems.length > 1 && (
                <div className="flex gap-2">
                  {orderedItems.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Preview item ${i + 1}`}
                      onClick={() => setPreviewIndex(i)}
                      className={`size-2 rounded-full ${i === previewIndex ? "bg-foreground" : "bg-foreground/25"}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-foreground/50">Bag is empty.</p>
          )}
        </div>

        <div className="space-y-6">
          <ul className="space-y-3">
            {orderedItems.map((it, i) => (
              <li key={it.id} className="text-sm">
                <div className="flex justify-between gap-4">
                  <span className="font-medium">
                    {i + 1} · {it.shadeName} · {it.scentName}
                  </span>
                  <span className="font-mono">£{(it.unitPrice * it.qty).toFixed(2)}</span>
                </div>
                <div className="text-foreground/60 italic font-serif">
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
            onClick={handlePay}
            disabled={items.length === 0}
            className="w-full bg-foreground text-background hover:bg-foreground/95 px-6 py-4 rounded-xl font-bold text-sm tracking-[0.15em] uppercase h-auto"
          >
            Pay £{subtotal.toFixed(2)} with Monzo
          </Button>
          <p className="text-[10px] text-foreground/40 text-center">
            Secure payment via Monzo link
          </p>

          {confirmed && (
            <ConfirmationBanner orderId={confirmed.orderId} items={items} total={subtotal} />
          )}
        </div>
      </div>
    </motion.section>
  );
}
