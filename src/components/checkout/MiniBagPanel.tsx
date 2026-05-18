import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { TRANSITIONS } from "../../lib/motion";
import { useBag } from "../../hooks/use-bag";
import { CASINGS } from "../../data/casings";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MiniBagPanel({ open, onClose }: Props) {
  const { items, remove, subtotal } = useBag();
  const navigate = useNavigate();

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
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={TRANSITIONS.panel}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border z-50 flex flex-col"
            aria-label="Your bag"
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
              {items.map((it) => {
                const casing = CASINGS.find((c) => c.id === it.casingId);
                return (
                  <div key={it.id} className="flex gap-4 items-start">
                    <div
                      className="size-12 rounded-md shrink-0 bg-secondary flex items-center justify-center"
                      style={{ boxShadow: `inset 0 -6px 12px ${it.shadeHex}` }}
                    >
                      {casing && (
                        <img src={casing.image} alt="" className="w-full h-full object-contain p-1" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        {casing?.name ?? it.casingId} · {it.shadeName} · {it.scentName}
                      </p>
                      <p className="font-serif italic text-sm text-foreground/70 truncate">
                        “{it.label}”
                      </p>
                      <p className="text-xs text-foreground/50 mt-1">
                        ×{it.qty} · £{(it.unitPrice * it.qty).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => remove(it.id)}
                      aria-label={`Remove ${it.label}`}
                      className="text-foreground/40 hover:text-foreground p-1"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            <footer className="border-t border-border p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-foreground/60">Subtotal</span>
                <span className="font-mono">£{subtotal.toFixed(2)}</span>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full"
              >
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
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
