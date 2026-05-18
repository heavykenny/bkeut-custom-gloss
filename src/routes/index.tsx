import { createFileRoute } from "@tanstack/react-router";
import { GlossCustomizer } from "../components/GlossCustomizer";
import lookbook1 from "../assets/lookbook-1.jpg";
import lookbook2 from "../assets/lookbook-2.jpg";
import lookbook3 from "../assets/lookbook-3.jpg";
import lookbook4 from "../assets/lookbook-4.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "BKEUT&Co. Lipgloss — Bespoke Labeled Gloss" },
      {
        name: "description",
        content:
          "Customizable luxury lip gloss by BKEUT&Co. Personalize your shade and labeling for birthdays, weddings, quotes, and every indulgent moment.",
      },
      { property: "og:title", content: "BKEUT&Co. Lipgloss — Bespoke Labeled Gloss" },
      { property: "og:description", content: "Bespoke lip gloss, labeled and poured for you." },
    ],
  }),
});

const LOOKBOOK = [
  { src: lookbook1, alt: "Glossy chocolate brown lips macro", delay: 100, mt: "" },
  { src: lookbook2, alt: "Lip gloss tube on cream silk", delay: 200, mt: "mt-12" },
  { src: lookbook3, alt: "Lip gloss with chocolate pieces", delay: 300, mt: "" },
  { src: lookbook4, alt: "Lip color swatches on skin", delay: 400, mt: "mt-12" },
];

function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-6 md:px-8 py-4 flex justify-between items-center">
      <div className="font-serif text-2xl font-black tracking-tight italic">BKEUT&amp;Co.</div>
      <div className="hidden md:flex gap-8 text-xs uppercase tracking-[0.2em] font-semibold">
        <a href="#customize" className="hover:text-accent transition-colors">
          The Studio
        </a>
        <a href="#occasions" className="hover:text-accent transition-colors">
          Occasions
        </a>
        <a href="#lookbook" className="hover:text-accent transition-colors">
          Lookbook
        </a>
      </div>
      <a
        href="#customize"
        className="text-xs font-semibold border-b-2 border-foreground uppercase tracking-widest pb-0.5"
      >
        Start
      </a>
    </nav>
  );
}

function Marquee() {
  const items = ["Birthdays", "Weddings", "Bridesmaids", "Quotes", "Just Because", "Anniversaries"];
  return (
    <div
      id="occasions"
      className="bg-foreground text-background py-6 overflow-hidden border-y border-accent/20"
    >
      <div className="flex gap-24 items-center animate-marquee whitespace-nowrap px-8 w-max">
        {[...items, ...items, ...items].map((label, i) => (
          <span key={i} className="font-serif italic text-2xl flex items-center gap-24">
            {label}
            <span className="text-accent/60 text-xs">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      t: "Define the sentiment",
      d: "Pick the occasion and label up to 14 characters that mean something to you.",
    },
    {
      n: "02",
      t: "Choose your shade",
      d: "Eight curated chocolate-to-nude tones — or request a custom pour just for you.",
    },
    {
      n: "03",
      t: "Pay via Monzo",
      d: "Checkout in one tap with a secure Monzo link. Your booking lands instantly on our end.",
    },
  ];
  return (
    <section className="bg-secondary/40 py-20 md:py-28 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <p className="text-[11px] uppercase tracking-[0.3em] font-semibold text-muted-foreground mb-4">
          The Ritual
        </p>
        <h2 className="font-serif text-4xl md:text-5xl tracking-tight mb-16 max-w-2xl">
          Three steps from <span className="italic">idea</span> to labeled keepsake.
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((s) => (
            <div key={s.n} className="space-y-3">
              <span className="font-mono text-xs text-accent">{s.n}</span>
              <h3 className="font-serif text-2xl">{s.t}</h3>
              <p className="text-foreground/65 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Lookbook() {
  return (
    <section id="lookbook" className="py-20 md:py-28 px-6 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <h2 className="font-serif text-5xl md:text-6xl tracking-tight">
          The Muse
          <br />
          <span className="italic">Lookbook</span>
        </h2>
        <p className="max-w-xs text-sm text-foreground/60 leading-relaxed">
          Captured by our community. Real shades on real skin, reflecting the light of a thousand
          moments.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {LOOKBOOK.map((img) => (
          <div
            key={img.src}
            className={`aspect-[2/3] overflow-hidden rounded-xl animate-reveal ${img.mt}`}
            style={{ animationDelay: `${img.delay}ms` }}
          >
            <img
              src={img.src}
              alt={img.alt}
              width={800}
              height={1200}
              loading="lazy"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground text-background/80 pt-20 pb-12 px-6 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="space-y-6 max-w-sm">
          <div className="font-serif text-4xl font-black italic text-background">BKEUT&amp;Co.</div>
          <p className="text-sm leading-relaxed opacity-70">
            Bespoke beauty for the discerning palate. Luxury, tactile, profoundly glossy — and
            entirely yours.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-12 md:gap-16">
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Shop</h4>
            <ul className="text-sm space-y-2">
              <li>
                <a href="#customize" className="hover:text-background">
                  Custom Gloss
                </a>
              </li>
              <li>
                <button className="hover:text-background cursor-pointer bg-transparent border-none p-0 text-sm">
                  Gift Sets
                </button>
              </li>
              <li>
                <button className="hover:text-background cursor-pointer bg-transparent border-none p-0 text-sm">
                  Limited Drops
                </button>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">
              Support
            </h4>
            <ul className="text-sm space-y-2">
              <li>
                <button className="hover:text-background cursor-pointer bg-transparent border-none p-0 text-sm">
                  Shipping
                </button>
              </li>
              <li>
                <button className="hover:text-background cursor-pointer bg-transparent border-none p-0 text-sm">
                  Ingredients
                </button>
              </li>
              <li>
                <button className="hover:text-background cursor-pointer bg-transparent border-none p-0 text-sm">
                  Contact
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-16 border-t border-background/10 mt-16 flex flex-col md:flex-row justify-between gap-3 text-[10px] uppercase tracking-[0.2em] font-medium">
        <span>© 2026 BKEUT&amp;Co. Lipgloss</span>
        <span>Crafted in the Chocolate District</span>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <GlossCustomizer />
      <Marquee />
      <HowItWorks />
      <Lookbook />
      <Footer />
    </div>
  );
}
