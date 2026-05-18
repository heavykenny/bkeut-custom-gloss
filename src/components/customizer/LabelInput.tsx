import { Input } from "../ui/input";
import { Label } from "../ui/label";

export const MAX_LABEL_CHARS = 14;

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function LabelInput({ value, onChange }: Props) {
  return (
    <div>
      <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/60 mb-3 block">
        3 · Label
      </Label>
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_LABEL_CHARS))}
          placeholder="e.g. Evelyn's Glow"
          className="bg-secondary border-border font-serif italic text-xl h-auto px-4 py-3"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] text-foreground/40 pointer-events-none">
          {value.length}/{MAX_LABEL_CHARS}
        </span>
      </div>
    </div>
  );
}
