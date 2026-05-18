import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { useScrollReveal } from "../hooks/use-scroll-reveal";
import tubeImage from "../assets/lipgloss-tube.png";

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

const SCENTS = [
  { name: "Unscented" },
  { name: "Vanilla" },
  { name: "Mint" },
  { name: "Chocolate" },
  { name: "Coconut" },
  { name: "Berry" },
];

const OCCASIONS = ["Birthday", "Wedding", "Bridesmaids", "Quote", "Just Because"];
const MAX_CHARS = 14;
const UNIT_PRICE = 24;

function generateOrderId() {
  return `BKEUT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

type OrderPayload = {
  brand: string;
  label: string;
  shade: string;
  shadeHex: string;
  scent: string;
  occasion: string;
  quantity: number;
  unitPrice: number;
  total: number;
  customShadeRequest: string | null;
  paymentMethod: string;
  status: string;
  orderId: string;
  placedAt: string;
};

function buildOrderPayload(
  text: string,
  shade: (typeof SHADES)[number],
  scent: (typeof SCENTS)[number],
  occasion: string,
  qty: number,
  total: number,
  customShade: string,
): OrderPayload {
  return {
    brand: "BKEUT&Co. Lipgloss",
    label: text,
    shade: shade.name,
    shadeHex: shade.hex,
    scent: scent.name,
    occasion,
    quantity: qty,
    unitPrice: UNIT_PRICE,
    total,
    customShadeRequest: customShade || null,
    paymentMethod: "monzo_link",
    status: "pending",
    orderId: generateOrderId(),
    placedAt: new Date().toISOString(),
  };
}

function OccasionSelector({
  occasion,
  setOccasion,
}: {
  occasion: string;
  setOccasion: (o: string) => void;
}) {
  return (
    <div>
      <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/60 mb-3 block">
        1. Occasion
      </Label>
      <div className="flex flex-wrap gap-2">
        {OCCASIONS.map((o) => (
          <Button
            key={o}
            variant={occasion === o ? "default" : "outline"}
            size="sm"
            onClick={() => setOccasion(o)}
            className="text-[10px] uppercase tracking-widest rounded-full"
          >
            {o}
          </Button>
        ))}
      </div>
    </div>
  );
}

function ScentSelector({
  scent,
  setScent,
}: {
  scent: (typeof SCENTS)[number];
  setScent: (s: (typeof SCENTS)[number]) => void;
}) {
  return (
    <div>
      <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/60 mb-3 block">
        2. Choose your scent
      </Label>
      <div className="flex flex-wrap gap-2">
        {SCENTS.map((s) => (
          <Button
            key={s.name}
            variant={scent.name === s.name ? "default" : "outline"}
            size="sm"
            onClick={() => setScent(s)}
            className="text-[11px] rounded-full"
          >
            {s.name}
          </Button>
        ))}
      </div>
    </div>
  );
}

function LabelInput({ text, setText }: { text: string; setText: (t: string) => void }) {
  return (
    <div>
      <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/60 mb-3 block">
        3. Label your text
      </Label>
      <div className="relative">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
          placeholder="e.g. Evelyn's Glow"
          className="bg-secondary border-border font-serif italic text-xl h-auto px-4 py-3"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] text-foreground/40 pointer-events-none">
          {text.length}/{MAX_CHARS}
        </span>
      </div>
      <p className="mt-1.5 text-[11px] text-foreground/40 font-medium">
        {text
          ? "This text will appear on your tube label."
          : "Enter a name, date, or short message."}
      </p>
    </div>
  );
}

function ShadeSelector({
  shade,
  setShade,
  requestOpen,
  setRequestOpen,
  customShade,
  setCustomShade,
}: {
  shade: (typeof SHADES)[number];
  setShade: (s: (typeof SHADES)[number]) => void;
  requestOpen: boolean;
  setRequestOpen: (v: boolean) => void;
  customShade: string;
  setCustomShade: (v: string) => void;
}) {
  return (
    <div>
      <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/60 mb-3 block">
        4. Choose your shade —{" "}
        <span className="italic font-serif normal-case tracking-normal text-foreground/80">
          {shade.name}
        </span>
      </Label>
      <div className="flex flex-wrap gap-3">
        {SHADES.map((s) => (
          <button
            key={s.name}
            onClick={() => setShade(s)}
            aria-label={s.name}
            style={{ background: s.hex }}
            className={`size-10 rounded-full shadow-inner transition-transform hover:scale-110 ${
              shade.name === s.name
                ? "ring-2 ring-offset-2 ring-foreground"
                : "ring-1 ring-foreground/10"
            }`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
        {SHADES.map((s) => (
          <span
            key={s.name}
            className={`text-[10px] font-mono ${shade.name === s.name ? "text-foreground" : "text-foreground/30"}`}
          >
            {s.name}
          </span>
        ))}
      </div>
      <Button
        variant="link"
        size="sm"
        onClick={() => setRequestOpen((v) => !v)}
        className="mt-3 text-[11px] underline-offset-4 font-semibold text-foreground/60 hover:text-foreground h-auto p-0"
      >
        {requestOpen ? "Close" : "Request a custom shade"}
      </Button>
      {requestOpen && (
        <Input
          value={customShade}
          onChange={(e) => setCustomShade(e.target.value)}
          placeholder="Describe the shade you're dreaming of..."
          className="mt-3 bg-secondary border-border"
        />
      )}
    </div>
  );
}

function QuantitySelector({ qty, setQty }: { qty: number; setQty: (q: number) => void }) {
  return (
    <div>
      <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/60 mb-3 block">
        5. Quantity
      </Label>
      <div className="flex items-center border border-border rounded-lg w-fit">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setQty(Math.max(1, qty - 1))}
          className="px-4 py-3 h-auto rounded-none rounded-l-lg"
        >
          −
        </Button>
        <span className="px-5 py-3 font-mono border-x border-border min-w-[3rem] text-center text-sm">
          {String(qty).padStart(2, "0")}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setQty(qty + 1)}
          className="px-4 py-3 h-auto rounded-none rounded-r-lg"
        >
          +
        </Button>
      </div>
    </div>
  );
}

function TubePreview({
  shade,
  text,
  scent,
}: {
  shade: (typeof SHADES)[number];
  text: string;
  scent: (typeof SCENTS)[number];
}) {
  return (
    <div className="relative animate-reveal" style={{ animationDelay: "200ms" }}>
      <div className="sticky top-28 flex justify-center">
        <div className="relative w-[360px] md:w-[480px] h-[720px] md:h-[860px]">
          <div
            aria-hidden
            className="absolute transition-colors duration-700"
            style={{
              left: "41.5%",
              right: "41.5%",
              top: "32.5%",
              bottom: "7%",
              background: `linear-gradient(180deg, ${shade.hex} 0%, ${shade.hex} 100%)`,
              borderRadius: "6% 6% 28% 28% / 2% 2% 8% 8%",
              boxShadow: `inset 0 -30px 60px rgba(0,0,0,0.35), inset 0 20px 40px rgba(255,255,255,0.08)`,
            }}
          />
          <img
            src={tubeImage}
            alt="BKEUT&Co. lip gloss tube with silver cap"
            width={1024}
            height={1024}
            loading="lazy"
            className="relative w-full h-full object-contain drop-shadow-[0_40px_60px_rgba(62,36,24,0.35)]"
          />
          <div
            className="absolute flex flex-col items-center justify-center pointer-events-none"
            style={{ left: "44.5%", right: "44.5%", top: "39%", height: "33%" }}
          >
            <span className="font-serif italic text-foreground/80 text-center text-sm md:text-base leading-tight px-1 break-words">
              {text || "Your text"}
            </span>
            {scent.name !== "Unscented" && (
              <span className="font-mono text-[9px] md:text-[10px] text-foreground/40 mt-1 tracking-wide uppercase">
                {scent.name}
              </span>
            )}
          </div>
        </div>
        <div className="absolute -bottom-12 -right-8 size-40 bg-accent/20 rounded-full blur-3xl -z-10" />
        <div className="absolute top-12 -left-12 size-32 bg-foreground/10 rounded-full blur-2xl -z-10" />
      </div>
    </div>
  );
}

function ConfirmationBanner({ confirmed }: { confirmed: OrderPayload }) {
  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-accent text-lg">✦</span>
          </div>
          <div>
            <p className="font-serif italic text-lg">Booking received</p>
            <p className="text-xs text-foreground/50 font-mono tracking-wide">
              {confirmed.orderId}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-foreground/40">Label</span>
            <p className="font-medium">{confirmed.label}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-foreground/40">Shade</span>
            <p className="font-medium">{confirmed.shade}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-foreground/40">Scent</span>
            <p className="font-medium">{confirmed.scent}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-foreground/40">
              Occasion
            </span>
            <p className="font-medium">{confirmed.occasion}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-foreground/40">
              Quantity
            </span>
            <p className="font-medium">×{confirmed.quantity}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-foreground/40">Total</span>
            <p className="font-medium">£{confirmed.total.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <span className="size-2 rounded-full bg-amber-500" />
          <span className="text-xs text-foreground/50">
            Payment pending — complete in the Monzo tab
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function GlossCustomizer() {
  const [text, setText] = useState("");
  const [shade, setShade] = useState(SHADES[0]);
  const [scent, setScent] = useState(SCENTS[0]);
  const [qty, setQty] = useState(1);
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [requestOpen, setRequestOpen] = useState(false);
  const [customShade, setCustomShade] = useState("");
  const [confirmed, setConfirmed] = useState<OrderPayload | null>(null);

  const total = useMemo(() => qty * UNIT_PRICE, [qty]);
  const canCheckout = text.trim().length > 0;

  const { ref, visible } = useScrollReveal(0.05);

  const handleCheckout = () => {
    if (!canCheckout) return;
    const payload = buildOrderPayload(text.trim(), shade, scent, occasion, qty, total, customShade);
    setConfirmed(payload);
    window.open(
      `https://monzo.me/?amount=${total.toFixed(2)}&description=${encodeURIComponent(`BKEUT Gloss x${qty}`)}`,
      "_blank",
    );
  };

  return (
    <section
      id="customize"
      ref={ref}
      className={`max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-28 grid md:grid-cols-2 gap-12 lg:gap-20 items-start transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] font-semibold text-muted-foreground mb-6">
          The Studio
        </p>
        <h1 className="font-serif text-6xl md:text-8xl leading-[0.88] tracking-tighter mb-8">
          Your Signature
          <br />
          <span className="italic text-accent">Shine.</span>
        </h1>
        <p className="text-lg max-w-md mb-12 leading-relaxed text-foreground/75">
          Bespoke high-viscosity gloss rich in colours, personalised for your most indulgent
          moments. Labeled by hand, poured for you.
        </p>

        <Card className="bg-card ring-1 ring-foreground/5 rounded-2xl shadow-[0_30px_80px_-40px_rgba(62,36,24,0.25)]">
          <CardContent className="p-6 md:p-8 space-y-8">
            <OccasionSelector occasion={occasion} setOccasion={setOccasion} />
            <ScentSelector scent={scent} setScent={setScent} />
            <LabelInput text={text} setText={setText} />
            <ShadeSelector
              shade={shade}
              setShade={setShade}
              requestOpen={requestOpen}
              setRequestOpen={setRequestOpen}
              customShade={customShade}
              setCustomShade={setCustomShade}
            />

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end pt-2">
              <QuantitySelector qty={qty} setQty={setQty} />
              <div className="flex-1 space-y-1.5">
                <Button
                  onClick={handleCheckout}
                  disabled={!canCheckout}
                  className="w-full bg-foreground text-background hover:bg-foreground/95 px-6 py-4 rounded-xl font-bold text-sm tracking-[0.15em] uppercase shadow-xl shadow-foreground/20 h-auto disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Pay £{total.toFixed(2)} with Monzo
                </Button>
                <p className="text-[10px] text-foreground/40 text-right font-medium">
                  £{UNIT_PRICE} each × {qty}
                </p>
              </div>
            </div>

            {confirmed && <ConfirmationBanner confirmed={confirmed} />}
          </CardContent>
        </Card>
      </div>

      <TubePreview shade={shade} text={text} scent={scent} />
    </section>
  );
}
