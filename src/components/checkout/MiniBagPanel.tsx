import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { TRANSITIONS } from "../../lib/motion";
import { useBag } from "../../hooks/use-bag";
import { BagItemRow } from "./BagItemRow";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MiniBagPanel({ open, onClose }: Props) {
  const { items, remove, subtotal } = useBag();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const goCheckout = () => {
    onClose();
    navigate({ to: "/", search: { screen: "review" } });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={TRANSITIONS.panel}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-40"
          />
          <motion.dialog
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={TRANSITIONS.panel}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border z-50 flex flex-col"
            aria-label="Your bag"
            open
          >
            <header className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-serif text-xl">Your bag</h2>
              <button onClick={onClose} aria-label="Close bag" className="p-1">
                <X className="size-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 && (
                <p className="text-sm text-foreground/50">Your bag is empty.</p>
              )}
              {items.map((it) => (
                <BagItemRow key={it.id} item={it} onRemove={remove} />
              ))}
            </div>

            <footer className="border-t border-border p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-foreground/60">Subtotal</span>
                <span className="font-mono">£{subtotal.toFixed(2)}</span>
              </div>
              <Button type="button" variant="outline" onClick={onClose} className="w-full">
                Continue customizing
              </Button>
              <Button
                type="button"
                onClick={goCheckout}
                disabled={items.length === 0}
                className="w-full bg-foreground text-background hover:bg-foreground/95"
              >
                Checkout · £{subtotal.toFixed(2)}
              </Button>
            </footer>
          </motion.dialog>
        </>
      )}
    </AnimatePresence>
  );
}
