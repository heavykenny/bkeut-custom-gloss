import { Link } from "@tanstack/react-router";
import { Instagram, TikTok, SOCIAL_LINKS } from "./social-icons";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-background/82 px-4 py-8 text-foreground backdrop-blur sm:px-6 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-md">
          <div className="font-serif text-2xl font-bold">BKEUT&amp;Co.</div>
          <p className="mt-2 text-sm leading-relaxed text-foreground/58">
            Bespoke lip gloss, labeled by hand and poured for you.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-xs font-semibold uppercase tracking-[0.18em]">
          <Link to="/shop" className="text-foreground/70 transition-colors hover:text-foreground">
            Products
          </Link>
          <div className="flex items-center gap-2">
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
              className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground/62 transition-colors hover:text-foreground"
            >
              <Instagram className="size-4" />
            </a>
            <a
              href={SOCIAL_LINKS.tiktok}
              target="_blank"
              rel="noopener"
              aria-label="TikTok"
              className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground/62 transition-colors hover:text-foreground"
            >
              <TikTok className="size-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-2 border-t border-border pt-5 text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/45 md:flex-row md:justify-between">
        <span>© 2026 BKEUT&amp;Co.</span>
        <span>Crafted in the Chocolate District</span>
      </div>
    </footer>
  );
}
