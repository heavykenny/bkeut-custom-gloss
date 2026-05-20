export type ScentName = "Unscented" | "Vanilla" | "Mint" | "Chocolate" | "Coconut" | "Berry";

export type Scent = {
  name: ScentName;
  notes: string;
  description: string;
};

export const SCENTS: readonly Scent[] = [
  {
    name: "Unscented",
    notes: "Clean finish",
    description: "No added fragrance, so the shade, shine, and custom label stay at the front.",
  },
  {
    name: "Vanilla",
    notes: "Vanilla cream · soft sugar",
    description: "Warm and smooth, with a gentle bakery sweetness that feels soft and familiar.",
  },
  {
    name: "Mint",
    notes: "Mint leaf · cool air",
    description: "Fresh and crisp, made for a light cooling feel without overpowering the gloss.",
  },
  {
    name: "Chocolate",
    notes: "Cocoa · ganache",
    description:
      "Rich and cozy, with a soft cocoa mood that pairs naturally with brown gloss shades.",
  },
  {
    name: "Coconut",
    notes: "Coconut milk · warm skin",
    description: "Creamy and mellow, with a subtle tropical warmth that still feels clean.",
  },
  {
    name: "Berry",
    notes: "Red berries · glossed sugar",
    description: "Juicy and playful, with a soft fruit sweetness for a brighter custom gloss.",
  },
] as const;

export type ScentMood = { halo1: string; halo2: string };

export const SCENT_MOOD: Record<ScentName, ScentMood> = {
  Unscented: { halo1: "rgba(245,230,224,0.25)", halo2: "rgba(62,36,24,0.10)" },
  Vanilla: { halo1: "rgba(235,208,189,0.35)", halo2: "rgba(176,122,91,0.12)" },
  Mint: { halo1: "rgba(178,209,193,0.30)", halo2: "rgba(60,90,75,0.10)" },
  Chocolate: { halo1: "rgba(92,58,42,0.30)", halo2: "rgba(40,22,14,0.12)" },
  Coconut: { halo1: "rgba(245,238,228,0.30)", halo2: "rgba(190,170,140,0.12)" },
  Berry: { halo1: "rgba(180,90,120,0.28)", halo2: "rgba(110,40,60,0.12)" },
};
