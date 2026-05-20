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
    <nav className="sticky top-0 z-30 border-b border-border bg-background/90 px-4 py-3 backdrop-blur-md sm:px-6 md:px-8 md:py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="font-serif text-xl font-bold sm:text-2xl">
          BKEUT&amp;Co.
        </Link>
        <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.14em] sm:gap-6 sm:text-xs sm:tracking-[0.2em]">
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
