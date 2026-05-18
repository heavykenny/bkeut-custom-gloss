export type ScentName =
  | "Unscented"
  | "Vanilla"
  | "Mint"
  | "Chocolate"
  | "Coconut"
  | "Berry";

export type Scent = { name: ScentName };

export const SCENTS: readonly Scent[] = [
  { name: "Unscented" },
  { name: "Vanilla" },
  { name: "Mint" },
  { name: "Chocolate" },
  { name: "Coconut" },
  { name: "Berry" },
] as const;

export type ScentMood = { halo1: string; halo2: string };

export const SCENT_MOOD: Record<ScentName, ScentMood> = {
  Unscented: { halo1: "rgba(245,230,224,0.25)", halo2: "rgba(62,36,24,0.10)" },
  Vanilla:   { halo1: "rgba(235,208,189,0.35)", halo2: "rgba(176,122,91,0.12)" },
  Mint:      { halo1: "rgba(178,209,193,0.30)", halo2: "rgba(60,90,75,0.10)" },
  Chocolate: { halo1: "rgba(92,58,42,0.30)",    halo2: "rgba(40,22,14,0.12)" },
  Coconut:   { halo1: "rgba(245,238,228,0.30)", halo2: "rgba(190,170,140,0.12)" },
  Berry:     { halo1: "rgba(180,90,120,0.28)",  halo2: "rgba(110,40,60,0.12)" },
};
