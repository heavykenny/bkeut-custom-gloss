import tubeImage from "../assets/lipgloss-tube.png";

export type Product = {
  id: string;
  name: string;
  href: string | null; // null = coming soon
  fromPrice: number | null; // null = not priced yet
  tagline: string;
  previewImage?: string;
};

export const PRODUCTS: readonly Product[] = [
  {
    id: "lipgloss",
    name: "Lipgloss",
    href: "/",
    fromPrice: 24,
    tagline: "Bespoke high-viscosity gloss, labeled by hand.",
    previewImage: tubeImage,
  },
  {
    id: "perfume",
    name: "Perfume",
    href: null,
    fromPrice: null,
    tagline: "Coming soon",
  },
  {
    id: "candle",
    name: "Candle",
    href: null,
    fromPrice: null,
    tagline: "Coming soon",
  },
  {
    id: "charm",
    name: "Charm",
    href: null,
    fromPrice: null,
    tagline: "Coming soon",
  },
] as const;

export const LIPGLOSS = PRODUCTS[0];
