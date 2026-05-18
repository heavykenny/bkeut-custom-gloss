import tubeImage from "../assets/lipgloss-tube.png";

export type Casing = {
  id: string;
  name: string;
  blurb: string;
  image: string;
};

// All three reuse the same image for now; real art swaps in by editing this file.
export const CASINGS: readonly Casing[] = [
  {
    id: "slim",
    name: "Slim tube",
    blurb: "14ml · doe-foot applicator · silver cap",
    image: tubeImage,
  },
  {
    id: "fluted",
    name: "Fluted",
    blurb: "14ml · sculpted ridges · matte cap",
    image: tubeImage,
  },
  {
    id: "round",
    name: "Round",
    blurb: "12ml · soft cylinder · gold cap",
    image: tubeImage,
  },
] as const;
