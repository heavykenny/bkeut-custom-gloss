import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type Props = {
  name: string;
  blurb: string;
};

export function ProductHeader({ name, blurb }: Props) {
  return (
    <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
      <h1 className="font-serif text-4xl tracking-tight text-foreground sm:text-5xl">{name}</h1>
      <Popover>
        <PopoverTrigger className="pb-1 text-[11px] font-semibold uppercase tracking-widest text-foreground/50 underline underline-offset-4 transition-colors hover:text-foreground">
          About
        </PopoverTrigger>
        <PopoverContent className="max-w-xs rounded-md border-border bg-card text-sm leading-relaxed shadow-xl">
          {blurb}
        </PopoverContent>
      </Popover>
    </div>
  );
}
