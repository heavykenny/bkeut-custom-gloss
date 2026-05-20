export type Shade = { name: string; hex: string };

export const SHADES: readonly Shade[] = [
  { name: "Ganache", hex: "#3E2418" },
  { name: "Cocoa", hex: "#5C3A2A" },
  { name: "Praline", hex: "#8E533F" },
  { name: "Caramel", hex: "#B07A5B" },
  { name: "Toffee", hex: "#C2856D" },
  { name: "Honey Nude", hex: "#E0B8A0" },
  { name: "Champagne", hex: "#EBD0BD" },
  { name: "Crystal", hex: "#F5E6E0" },
] as const;
