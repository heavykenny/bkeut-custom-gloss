import { Link } from "@tanstack/react-router";
import { Instagram, TikTok, SOCIAL_LINKS } from "./social-icons";

export function Footer() {
  return (
    <footer className="bg-foreground text-background/80 pt-20 pb-12 px-6 md:px-8 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="space-y-6 max-w-sm">
          <div className="font-serif text-4xl font-black italic text-background">
            BKEUT&amp;Co.
          </div>
          <p className="text-sm leading-relaxed opacity-70">
            Bespoke gift customization. Labeled by hand, poured for you.
          </p>
          <div className="flex gap-4">
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener" aria-label="Instagram">
              <Instagram className="size-5" />
            </a>
            <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener" aria-label="TikTok">
              <TikTok className="size-5" />
            </a>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Shop</h4>
          <ul className="text-sm space-y-2">
            <li>
              <Link to="/shop" className="hover:text-background">
                Products
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-16 border-t border-background/10 mt-16 flex flex-col md:flex-row justify-between gap-3 text-[10px] uppercase tracking-[0.2em] font-medium">
        <span>© 2026 BKEUT&amp;Co.</span>
        <span>Crafted in the Chocolate District</span>
      </div>
    </footer>
  );
}
