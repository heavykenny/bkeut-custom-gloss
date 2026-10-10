import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FADE_UP } from "../../lib/motion";
import type { Product } from "../../data/products";

type Props = {
  product: Product;
};

export function ProductTile({ product }: Props) {
  const isLive = product.href !== null;
  const body = (
    <motion.div variants={FADE_UP} className="space-y-3">
      <div
        className={`flex aspect-square items-center justify-center overflow-hidden rounded-md border border-border/70 bg-card/70 shadow-sm ${isLive ? "" : "opacity-60"}`}
      >
        {product.previewImage ? (
          <img
            src={product.previewImage}
            alt={product.name}
            className="h-full w-full object-contain p-5"
          />
        ) : (
          <span className="font-serif text-5xl font-semibold text-foreground/30">
            {product.name[0]}
          </span>
        )}
      </div>
      <div className="flex items-baseline justify-between">
        <h3 className="font-serif text-xl">{product.name}</h3>
        <span className="text-xs text-foreground/50">
          {product.fromPrice ? `from £${product.fromPrice}` : "Coming soon"}
        </span>
      </div>
    </motion.div>
  );

  if (isLive && product.href) {
    return (
      <Link to={product.href} className="block hover:opacity-90 transition-opacity">
        {body}
      </Link>
    );
  }
  return <div aria-disabled>{body}</div>;
}
