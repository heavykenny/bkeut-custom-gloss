import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FADE_UP } from "../../lib/motion";
import type { Product } from "../../data/products";

type Props = {
  product: Product;
};

function LipglossPreview() {
  return (
    <div className="relative h-[78%] w-[34%]">
      <div className="absolute left-1/2 top-0 h-[34%] w-[70%] -translate-x-1/2 rounded-t-full rounded-b-sm border border-black/10 bg-[linear-gradient(90deg,#f8f8f6,#9d9994_20%,#fff_35%,#191715_52%,#f3eee7_75%,#9b9690)] shadow-inner" />
      <div className="absolute left-1/2 top-[31%] h-[5%] w-[78%] -translate-x-1/2 rounded-sm bg-foreground/18" />
      <div className="absolute bottom-0 left-1/2 h-[64%] w-[56%] -translate-x-1/2 overflow-hidden rounded-t-sm rounded-b-full border border-black/10 bg-white/55 shadow-inner">
        <div className="absolute inset-x-[13%] bottom-[6%] top-[8%] rounded-b-full bg-[#8E533F] shadow-[inset_0_-18px_28px_rgba(0,0,0,0.28)]" />
        <div className="absolute left-1/2 top-[40%] h-[18%] w-[120%] -translate-x-1/2 bg-white/88" />
      </div>
    </div>
  );
}

export function ProductTile({ product }: Props) {
  const isLive = product.href !== null;
  const body = (
    <motion.div variants={FADE_UP} className="space-y-3">
      <div
        className={`flex aspect-square items-center justify-center overflow-hidden rounded-md border border-border/70 bg-card/70 shadow-sm ${isLive ? "" : "opacity-60"}`}
      >
        {product.id === "lipgloss" ? (
          <LipglossPreview />
        ) : product.previewImage ? (
          <img
            src={product.previewImage}
            alt={product.name}
            className="w-full h-full object-contain p-6"
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
