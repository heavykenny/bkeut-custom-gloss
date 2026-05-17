import { useMemo, useState } from "react";
import tubeImage from "@/assets/lipgloss-tube.png";

const SHADES = [
  { name: "Ganache", hex: "#3E2418" },
  { name: "Cocoa", hex: "#5C3A2A" },
  { name: "Praline", hex: "#8E533F" },
  { name: "Caramel", hex: "#B07A5B" },
  { name: "Toffee", hex: "#C2856D" },
  { name: "Honey Nude", hex: "#E0B8A0" },
  { name: "Champagne", hex: "#EBD0BD" },
  { name: "Crystal", hex: "#F5E6E0" },
];

const OCCASIONS = ["Birthday", "Wedding", "Bridesmaids", "Quote", "Just Because"];
const MAX_CHARS = 14;
const UNIT_PRICE = 24;
// Placeholder Monzo link — replace with your monzo.me handle when ready
const MONZO_LINK = "https://monzo.me/";

export function GlossCustomizer() {
  const [text, setText] = useState("");
  const [shade, setShade] = useState(SHADES[0]);
  const [qty, setQty] = useState(1);
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [requestOpen, setRequestOpen] = useState(false);
  const [customShade, setCustomShade] = useState("");
  const [confirmed, setConfirmed] = useState<null | Record<string, unknown>>(null);

  const total = useMemo(() => (qty * UNIT_PRICE).toFixed(2), [qty]);

  const handleCheckout = () => {
    const payload = {
      brand: "BKEUT&Co. Lipgloss",
      engraving: text || "(no text)",
      shade: shade.name,
      shadeHex: shade.hex,
      occasion,
      quantity: qty,
      unitPrice: UNIT_PRICE,
      total: Number(total),
      customShadeRequest: customShade || null,
      paymentMethod: "monzo_link",
      status: "pending",
      placedAt: new Date().toISOString(),
    };
    // Simulate booking arriving on owner's end
    console.log("[BKEUT&Co. order received]", payload);
    setConfirmed(payload);
    window.open(`${MONZO_LINK}?amount=${total}&description=${encodeURIComponent(`BKEUT Gloss x${qty}`)}`, "_blank");
  };

  return (
    <section id="customize" className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-28 grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
      <div className="animate-reveal">
        <p className="text-[11px] uppercase tracking-[0.3em] font-semibold text-muted-foreground mb-6">The Studio</p>
        <h1 className="font-serif text-6xl md:text-8xl leading-[0.88] tracking-tighter mb-8">
          Your Signature<br />
          <span className="italic text-accent">Shine.</span>
        </h1>
        <p className="text-lg max-w-md mb-12 leading-relaxed text-foreground/75">
          Bespoke high-viscosity gloss in rich chocolate tones, personalized for your most indulgent moments. Engraved by hand, poured for you.
        </p>

        <div className="bg-card ring-1 ring-foreground/5 rounded-2xl p-6 md:p-8 space-y-8 shadow-[0_30px_80px_-40px_rgba(62,36,24,0.25)]">
          {/* Occasion */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-3 text-foreground/60">1. Occasion</label>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map((o) => (
                <button
                  key={o}
                  onClick={() => setOccasion(o)}
                  className={`px-4 py-2 text-[10px] uppercase tracking-widest rounded-full transition-all ${
                    occasion === o
                      ? "bg-foreground text-background"
                      : "border border-border text-foreground/70 hover:border-foreground"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          {/* Engraving */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-3 text-foreground/60">2. Engrave your text</label>
            <div className="relative">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
                placeholder="e.g. Evelyn's Glow"
                className="w-full bg-secondary border border-border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10 font-serif italic text-xl"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] text-foreground/40">
                {text.length}/{MAX_CHARS}
              </span>
            </div>
          </div>

          {/* Shade */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-3 text-foreground/60">
              3. Choose your shade — <span className="italic font-serif normal-case tracking-normal text-foreground/80">{shade.name}</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {SHADES.map((s) => (
                <button
                  key={s.name}
                  onClick={() => setShade(s)}
                  aria-label={s.name}
                  style={{ background: s.hex }}
                  className={`size-10 rounded-full shadow-inner transition-transform hover:scale-110 ${
                    shade.name === s.name ? "ring-2 ring-offset-2 ring-foreground" : "ring-1 ring-foreground/10"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setRequestOpen((v) => !v)}
              className="mt-4 text-[11px] underline underline-offset-4 font-semibold text-foreground/60 hover:text-foreground"
            >
              {requestOpen ? "Close" : "Request a custom shade"}
            </button>
            {requestOpen && (
              <input
                value={customShade}
                onChange={(e) => setCustomShade(e.target.value)}
                placeholder="Describe the shade you're dreaming of..."
                className="mt-3 w-full bg-secondary border border-border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10 text-sm"
              />
            )}
          </div>

          {/* Qty + CTA */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end pt-2">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-3 text-foreground/60">4. Quantity</label>
              <div className="flex items-center border border-border rounded-lg w-fit">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 hover:bg-secondary">−</button>
                <span className="px-5 py-3 font-mono border-x border-border min-w-[3rem] text-center">
                  {String(qty).padStart(2, "0")}
                </span>
                <button onClick={() => setQty(qty + 1)} className="px-4 py-3 hover:bg-secondary">+</button>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="flex-1 bg-foreground text-background px-6 py-4 rounded-xl font-bold text-sm tracking-[0.15em] uppercase shadow-xl shadow-foreground/20 hover:scale-[1.01] hover:bg-foreground/95 transition-all"
            >
              Pay £{total} with Monzo
            </button>
          </div>

          {confirmed && (
            <div className="rounded-xl border border-foreground/15 bg-secondary/50 p-5 text-sm animate-reveal">
              <p className="font-serif italic text-lg mb-2">Booking received ✦</p>
              <p className="text-foreground/70 leading-relaxed">
                Thank you. Your bespoke order has been logged and will appear on the studio's end. Complete payment in the Monzo tab — your order remains pending until confirmed.
              </p>
              <pre className="mt-3 font-mono text-[10px] text-foreground/50 overflow-x-auto">
{JSON.stringify(confirmed, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Live preview tube */}
      <div className="relative animate-reveal" style={{ animationDelay: "200ms" }}>
        <div className="sticky top-28 flex justify-center">
          <div className="relative w-[280px] md:w-[360px] h-[560px] md:h-[700px]">
            {/* Tinted liquid layer — sits behind the tube image and shows through the glass */}
            <div
              aria-hidden
              className="absolute transition-colors duration-700"
              style={{
                left: "38%",
                right: "38%",
                top: "32%",
                bottom: "8%",
                background: `linear-gradient(180deg, ${shade.hex} 0%, ${shade.hex}e6 50%, ${shade.hex} 100%)`,
                borderRadius: "40% 40% 45% 45% / 8% 8% 14% 14%",
                mixBlendMode: "multiply",
                filter: "blur(2px)",
              }}
            />
            <img
              src={tubeImage}
              alt="BKEUT&Co. lip gloss tube with silver cap"
              width={1024}
              height={1024}
              loading="lazy"
              className="relative w-full h-full object-contain drop-shadow-[0_40px_60px_rgba(62,36,24,0.35)] animate-shimmer"
            />
            {/* Engraved label */}
            <div
              className="absolute flex items-center justify-center pointer-events-none"
              style={{ left: "40%", right: "40%", top: "40%", height: "22%" }}
            >
              <span className="font-serif italic text-foreground/80 text-center text-sm md:text-base leading-tight px-1 break-words">
                {text || "Your text"}
              </span>
            </div>
          </div>
          <div className="absolute -bottom-12 -right-8 size-40 bg-accent/20 rounded-full blur-3xl -z-10" />
          <div className="absolute top-12 -left-12 size-32 bg-foreground/10 rounded-full blur-2xl -z-10" />
        </div>
      </div>
    </section>
  );
}
