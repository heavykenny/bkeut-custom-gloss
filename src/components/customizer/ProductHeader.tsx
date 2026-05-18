import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

type Props = {
  name: string;
  price: number;
  blurb: string;
};

export function ProductHeader({ name, price, blurb }: Props) {
  return (
    <div className="flex items-baseline gap-4">
      <h1 className="font-serif text-4xl md:text-5xl tracking-tight">{name}</h1>
      <span className="font-mono text-sm text-foreground/60">£{price}</span>
      <Popover>
        <PopoverTrigger className="text-[11px] uppercase tracking-widest font-semibold text-foreground/50 hover:text-foreground underline-offset-4 underline">
          About
        </PopoverTrigger>
        <PopoverContent className="max-w-xs text-sm leading-relaxed">
          {blurb}
        </PopoverContent>
      </Popover>
    </div>
  );
}
