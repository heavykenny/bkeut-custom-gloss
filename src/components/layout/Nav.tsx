import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useBag } from "../../hooks/use-bag";

type Props = {
  onOpenBag: () => void;
};

export function Nav({ onOpenBag }: Props) {
  const { items, subtotal } = useBag();
  const count = items.reduce((n, it) => n + it.qty, 0);

  return (
    <nav className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-6 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="font-serif text-2xl font-black tracking-tight italic">
          BKEUT&amp;Co.
        </Link>
        <div className="flex items-center gap-6 text-xs uppercase tracking-[0.2em] font-semibold">
          <Link to="/shop" className="hover:text-accent transition-colors">
            Products
          </Link>
          <button
            type="button"
            onClick={onOpenBag}
            className="flex items-center gap-2 hover:text-accent transition-colors"
            aria-label="Open bag"
          >
            <ShoppingBag className="size-4" />
            <span>
              Bag ({count}) {count > 0 && `· £${subtotal.toFixed(2)}`}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
