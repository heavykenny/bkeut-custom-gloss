import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Instagram, TikTok, SOCIAL_LINKS } from "../layout/social-icons";
import { FADE_UP } from "../../lib/motion";
import type { Product } from "../../data/products";

type Props = {
  product: Product;
  preview?: string; // optional image
};

export function ProductTile({ product, preview }: Props) {
  const isLive = product.href !== null;
  const body = (
    <motion.div variants={FADE_UP} className="space-y-3">
      <div className={`aspect-square rounded-xl bg-secondary flex items-center justify-center overflow-hidden ${isLive ? "" : "opacity-60"}`}>
        {preview ? (
          <img src={preview} alt={product.name} className="w-full h-full object-contain p-6" />
        ) : (
          <span className="font-serif text-5xl text-foreground/30 italic">{product.name[0]}</span>
        )}
      </div>
      <div className="flex items-baseline justify-between">
        <h3 className="font-serif text-xl">{product.name}</h3>
        <span className="text-xs text-foreground/50">
          {product.fromPrice ? `from £${product.fromPrice}` : "Coming soon"}
        </span>
      </div>
      {!isLive && (
        <div className="text-[11px] text-foreground/40 flex items-center gap-2">
          <span>Follow for drops</span>
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener" aria-label="Instagram">
            <Instagram className="size-3.5" />
          </a>
          <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener" aria-label="TikTok">
            <TikTok className="size-3.5" />
          </a>
        </div>
      )}
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
