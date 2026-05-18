import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { TRANSITIONS } from "../../lib/motion";
import { useBag, type BagItem } from "../../hooks/use-bag";
import { PreviewCarousel } from "./PreviewCarousel";
import { OrderSummary } from "./OrderSummary";

type Confirmed = { orderId: string; items: BagItem[]; total: number };

function generateOrderId(): string {
  return `BKEUT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function ReviewScreen() {
  const { items, subtotal } = useBag();
  const navigate = useNavigate();
  const orderedItems = useMemo(() => [...items].reverse(), [items]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [confirmed, setConfirmed] = useState<Confirmed | null>(null);

  const handlePay = () => {
    if (items.length === 0 || confirmed) return;
    const orderId = generateOrderId();
    setConfirmed({ orderId, items: [...items], total: subtotal });
    const description = encodeURIComponent(
      `BKEUT ${items.length === 1 ? "Gloss" : `Gloss x${items.length}`}`,
    );
    window.open(
      `https://monzo.me/?amount=${subtotal.toFixed(2)}&description=${description}`,
      "_blank",
    );
  };

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
        <PreviewCarousel
          items={orderedItems}
          index={previewIndex}
          onIndexChange={setPreviewIndex}
        />
        <OrderSummary
          items={items}
          subtotal={subtotal}
          confirmed={confirmed}
          onPay={handlePay}
        />
      </div>
    </motion.section>
  );
}
