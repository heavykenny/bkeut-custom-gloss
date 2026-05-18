# BKEUT&Co. Site Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the site so visitors land on the lipgloss customizer (no scroll, no filler), customize a tube, add to a multi-item bag, and pay via Monzo on a second screen reached by horizontal slide. Add a `/shop` catalog route. Use Framer Motion for the animation system. Delete the old monolithic `GlossCustomizer.tsx`.

**Architecture:** Single page at `/` with two visual screens driven by a `?screen=review` URL search param and Framer Motion's `AnimatePresence`. Bag state in React context, persisted to `localStorage`. Casing/shade/scent/product data lifted into typed modules in `src/data/`. Atomic UI components in feature folders (`customizer/`, `checkout/`, `shop/`, `layout/`). A dedicated `/shop` route for the catalog with coming-soon tiles.

**Tech Stack:** React 19, TanStack Router + Start, TypeScript, Tailwind 4, shadcn/Radix primitives (existing), Framer Motion (new), Vitest + Testing Library (new — only used for the bag hook). Bun for install/scripts.

**Reference spec:** `docs/superpowers/specs/2026-05-18-bkeut-revamp-design.md`.

**Pre-flight note:** The working tree currently has uncommitted modifications to `src/components/GlossCustomizer.tsx` and `src/routes/index.tsx`, plus an untracked `src/hooks/use-scroll-reveal.ts`. These represent the **starting state** for this plan — they should not be discarded before starting. The plan ultimately deletes `GlossCustomizer.tsx` and `use-scroll-reveal.ts`, so any in-progress work in them will be superseded.

---

## File Structure

**Created:**

```
src/
├── data/
│   ├── casings.ts             # 2–3 casing entries with placeholder art
│   ├── shades.ts              # 8 shades lifted from GlossCustomizer
│   ├── scents.ts              # 6 scents + SCENT_MOOD halo color map
│   └── products.ts            # Lipgloss + 3 coming-soon products
├── lib/
│   └── motion.ts              # Shared TRANSITIONS / STAGGER consts
├── hooks/
│   └── use-bag.ts             # Bag context + hook + localStorage
├── components/
│   ├── layout/
│   │   ├── social-icons.tsx   # Shared Instagram + TikTok icons + SOCIAL_LINKS
│   │   ├── Nav.tsx            # Slim nav with bag indicator
│   │   ├── Footer.tsx         # Real socials, dead links removed
│   │   └── SocialStrip.tsx    # Fixed right-edge vertical icons
│   ├── customizer/
│   │   ├── CustomizerScreen.tsx
│   │   ├── CasingPicker.tsx
│   │   ├── TubePreview.tsx    # Sleeve label, halos, layoutId="tube"
│   │   ├── ProductHeader.tsx  # Name + price + about popover
│   │   ├── ScentSelector.tsx
│   │   ├── ShadeSelector.tsx
│   │   ├── LabelInput.tsx
│   │   └── QuantitySelector.tsx
│   ├── checkout/
│   │   ├── ReviewScreen.tsx
│   │   ├── MiniBagPanel.tsx
│   │   └── ConfirmationBanner.tsx  # Multi-item aware
│   └── shop/
│       └── ProductTile.tsx
└── routes/
    └── shop.tsx               # Catalog route
```

**Modified:**

- `src/routes/index.tsx` — becomes a thin orchestrator: reads `?screen=` and renders `CustomizerScreen` or `ReviewScreen` inside `<AnimatePresence>`.
- `package.json` — adds `framer-motion`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, and a `test` script.
- `vite.config.ts` — adds vitest config block.

**Deleted (in Task 12):**

- `src/components/GlossCustomizer.tsx`
- `src/hooks/use-scroll-reveal.ts`
- `src/assets/lookbook-1.jpg`, `lookbook-2.jpg`, `lookbook-3.jpg`, `lookbook-4.jpg`

---

## Task 1: Install dependencies and configure Vitest

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Create: `src/test-setup.ts`

- [ ] **Step 1: Install runtime + test dependencies**

Run:
```bash
bun add framer-motion
bun add -d vitest @testing-library/react @testing-library/jest-dom jsdom @vitest/ui
```

Expected: `bun.lock` updated, `node_modules/framer-motion` exists.

- [ ] **Step 2: Add `test` script to package.json**

Modify the `scripts` block in `package.json` to include:

```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 3: Update `vite.config.ts` for Vitest**

Read the current file first. It looks like:

```ts
import { defineConfig } from "vite";
// ... existing plugins
```

Add the `test` config block. Final file:

```ts
/// <reference types="vitest" />
import { defineConfig } from "vite";
import { lovableTanstackConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  ...lovableTanstackConfig(),
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    globals: true,
  },
});
```

(Adjust to match the actual current contents — only add the `test` block and the triple-slash reference if not present.)

- [ ] **Step 4: Create `src/test-setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 5: Verify the test runner boots**

Run: `bun run test:run`

Expected: vitest runs, reports "No test files found" (no failures). If it errors on jsdom or setup, fix before continuing.

- [ ] **Step 6: Verify the build still works**

Run: `bun run build`

Expected: build completes successfully.

- [ ] **Step 7: Commit**

```bash
git add package.json bun.lock vite.config.ts src/test-setup.ts
git commit -m "chore: add framer-motion and vitest test infrastructure"
```

---

## Task 2: Motion lib and data modules

**Files:**
- Create: `src/lib/motion.ts`
- Create: `src/data/shades.ts`
- Create: `src/data/scents.ts`
- Create: `src/data/casings.ts`
- Create: `src/data/products.ts`

- [ ] **Step 1: Create `src/lib/motion.ts`**

```ts
import type { Transition, Variants } from "framer-motion";

export const TRANSITIONS = {
  slide:     { duration: 0.45, ease: [0.32, 0.72, 0, 1] },
  crossfade: { duration: 0.25, ease: "easeInOut" },
  halo:      { duration: 0.80, ease: "easeInOut" },
  panel:     { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  spring:    { type: "spring" as const, stiffness: 400, damping: 30 },
} satisfies Record<string, Transition>;

export const STAGGER: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};
```

- [ ] **Step 2: Create `src/data/shades.ts`**

```ts
export type Shade = { name: string; hex: string };

export const SHADES: readonly Shade[] = [
  { name: "Ganache",     hex: "#3E2418" },
  { name: "Cocoa",       hex: "#5C3A2A" },
  { name: "Praline",     hex: "#8E533F" },
  { name: "Caramel",     hex: "#B07A5B" },
  { name: "Toffee",      hex: "#C2856D" },
  { name: "Honey Nude",  hex: "#E0B8A0" },
  { name: "Champagne",   hex: "#EBD0BD" },
  { name: "Crystal",     hex: "#F5E6E0" },
] as const;
```

- [ ] **Step 3: Create `src/data/scents.ts`**

```ts
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
```

- [ ] **Step 4: Create `src/data/casings.ts`**

```ts
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
```

- [ ] **Step 5: Create `src/data/products.ts`**

```ts
export type Product = {
  id: string;
  name: string;
  href: string | null;       // null = coming soon
  fromPrice: number | null;  // null = not priced yet
  tagline: string;
};

export const PRODUCTS: readonly Product[] = [
  {
    id: "lipgloss",
    name: "Lipgloss",
    href: "/",
    fromPrice: 24,
    tagline: "Bespoke high-viscosity gloss, labeled by hand.",
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
```

- [ ] **Step 6: Type-check**

Run: `bunx tsc --noEmit`

Expected: no errors. (If `framer-motion` types fail because Step 1 in Task 1 didn't add it, go back.)

- [ ] **Step 7: Commit**

```bash
git add src/lib/motion.ts src/data/
git commit -m "feat: lift shade/scent/casing/product data into typed modules"
```

---

## Task 3: useBag hook + context (TDD)

**Files:**
- Create: `src/hooks/use-bag.ts`
- Create: `src/hooks/use-bag.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `src/hooks/use-bag.test.tsx`:

```tsx
import { renderHook, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { BagProvider, useBag, BAG_STORAGE_KEY } from "./use-bag";
import type { ReactNode } from "react";

const wrapper = ({ children }: { children: ReactNode }) => (
  <BagProvider>{children}</BagProvider>
);

const sampleItem = {
  casingId: "slim",
  shadeName: "Cocoa",
  shadeHex: "#5C3A2A",
  scentName: "Vanilla" as const,
  label: "Mum",
  qty: 1,
  unitPrice: 24,
};

describe("useBag", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("starts empty", () => {
    const { result } = renderHook(() => useBag(), { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.subtotal).toBe(0);
  });

  it("adds an item with a generated id", () => {
    const { result } = renderHook(() => useBag(), { wrapper });
    act(() => result.current.add(sampleItem));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toMatch(/.+/);
    expect(result.current.items[0].casingId).toBe("slim");
  });

  it("computes subtotal as sum of unitPrice * qty", () => {
    const { result } = renderHook(() => useBag(), { wrapper });
    act(() => {
      result.current.add({ ...sampleItem, qty: 2 });
      result.current.add({ ...sampleItem, qty: 1, unitPrice: 30 });
    });
    expect(result.current.subtotal).toBe(2 * 24 + 1 * 30);
  });

  it("setQty updates quantity for a given item", () => {
    const { result } = renderHook(() => useBag(), { wrapper });
    act(() => result.current.add(sampleItem));
    const id = result.current.items[0].id;
    act(() => result.current.setQty(id, 5));
    expect(result.current.items[0].qty).toBe(5);
    expect(result.current.subtotal).toBe(5 * 24);
  });

  it("setQty to 0 or below removes the item", () => {
    const { result } = renderHook(() => useBag(), { wrapper });
    act(() => result.current.add(sampleItem));
    const id = result.current.items[0].id;
    act(() => result.current.setQty(id, 0));
    expect(result.current.items).toHaveLength(0);
  });

  it("remove deletes by id", () => {
    const { result } = renderHook(() => useBag(), { wrapper });
    act(() => {
      result.current.add(sampleItem);
      result.current.add({ ...sampleItem, label: "Sister" });
    });
    const firstId = result.current.items[0].id;
    act(() => result.current.remove(firstId));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].label).toBe("Sister");
  });

  it("clear empties the bag", () => {
    const { result } = renderHook(() => useBag(), { wrapper });
    act(() => result.current.add(sampleItem));
    act(() => result.current.clear());
    expect(result.current.items).toEqual([]);
  });

  it("persists to localStorage and rehydrates", () => {
    const { result, unmount } = renderHook(() => useBag(), { wrapper });
    act(() => result.current.add(sampleItem));
    unmount();

    const raw = localStorage.getItem(BAG_STORAGE_KEY);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!)).toHaveLength(1);

    const { result: result2 } = renderHook(() => useBag(), { wrapper });
    expect(result2.current.items).toHaveLength(1);
    expect(result2.current.items[0].label).toBe("Mum");
  });

  it("ignores corrupt localStorage data", () => {
    localStorage.setItem(BAG_STORAGE_KEY, "not json");
    const { result } = renderHook(() => useBag(), { wrapper });
    expect(result.current.items).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `bun run test:run src/hooks/use-bag.test.tsx`

Expected: FAIL — module `./use-bag` not found.

- [ ] **Step 3: Implement `src/hooks/use-bag.ts`**

```tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ScentName } from "../data/scents";

export const BAG_STORAGE_KEY = "bkeut:bag:v1";

export type BagItem = {
  id: string;
  casingId: string;
  shadeName: string;
  shadeHex: string;
  scentName: ScentName;
  label: string;
  qty: number;
  unitPrice: number;
};

export type BagContextValue = {
  items: BagItem[];
  add: (item: Omit<BagItem, "id">) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
};

const BagContext = createContext<BagContextValue | null>(null);

function loadFromStorage(): BagItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BAG_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as BagItem[]) : [];
  } catch {
    return [];
  }
}

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function BagProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BagItem[]>(loadFromStorage);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const add = useCallback((item: Omit<BagItem, "id">) => {
    setItems((prev) => [...prev, { ...item, id: generateId() }]);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((it) => it.id !== id)
        : prev.map((it) => (it.id === id ? { ...it, qty } : it)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.unitPrice * it.qty, 0),
    [items],
  );

  const value = useMemo(
    () => ({ items, add, remove, setQty, clear, subtotal }),
    [items, add, remove, setQty, clear, subtotal],
  );

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag(): BagContextValue {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error("useBag must be used inside a <BagProvider>");
  return ctx;
}
```

- [ ] **Step 4: Run tests until green**

Run: `bun run test:run src/hooks/use-bag.test.tsx`

Expected: all 9 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/use-bag.ts src/hooks/use-bag.test.tsx
git commit -m "feat: add useBag hook with localStorage persistence"
```

---

## Task 4: TubePreview component

The single source of truth for the rendered tube. Carries `layoutId="tube"` so it can morph between screens. Sleeve label and scent halos live here.

**Files:**
- Create: `src/components/customizer/TubePreview.tsx`

- [ ] **Step 1: Create the file**

```tsx
import { motion, AnimatePresence } from "framer-motion";
import { TRANSITIONS } from "../../lib/motion";
import type { Casing } from "../../data/casings";
import type { Shade } from "../../data/shades";
import type { Scent } from "../../data/scents";
import { SCENT_MOOD } from "../../data/scents";

type Size = "lg" | "sm";

type Props = {
  casing: Casing;
  shade: Shade;
  scent: Scent;
  label: string;
  size?: Size;
};

const DIMENSIONS: Record<Size, { w: string; h: string; labelText: string }> = {
  lg: { w: "w-[360px] md:w-[480px]", h: "h-[720px] md:h-[860px]", labelText: "text-sm md:text-base" },
  sm: { w: "w-[200px]",              h: "h-[400px]",              labelText: "text-xs" },
};

export function TubePreview({ casing, shade, scent, label, size = "lg" }: Props) {
  const mood = SCENT_MOOD[scent.name];
  const dims = DIMENSIONS[size];

  return (
    <motion.div layoutId="tube" className={`relative ${dims.w} ${dims.h}`}>
      {/* Halo behind the tube — tinted by scent */}
      <motion.div
        aria-hidden
        className="absolute -bottom-12 -right-8 size-40 rounded-full blur-3xl -z-10"
        animate={{ backgroundColor: mood.halo1 }}
        transition={TRANSITIONS.halo}
      />
      <motion.div
        aria-hidden
        className="absolute top-12 -left-12 size-32 rounded-full blur-2xl -z-10"
        animate={{ backgroundColor: mood.halo2 }}
        transition={TRANSITIONS.halo}
      />

      {/* Gloss color fill behind the casing */}
      <div
        aria-hidden
        className="absolute transition-colors duration-700"
        style={{
          left: "41.5%",
          right: "41.5%",
          top: "32.5%",
          bottom: "7%",
          background: shade.hex,
          borderRadius: "6% 6% 28% 28% / 2% 2% 8% 8%",
          boxShadow:
            "inset 0 -30px 60px rgba(0,0,0,0.35), inset 0 20px 40px rgba(255,255,255,0.08)",
        }}
      />

      {/* Casing image — crossfades when casing changes */}
      <AnimatePresence mode="wait">
        <motion.img
          key={casing.id}
          src={casing.image}
          alt={`${casing.name} lip gloss tube`}
          width={1024}
          height={1024}
          loading="lazy"
          className="relative w-full h-full object-contain drop-shadow-[0_40px_60px_rgba(62,36,24,0.35)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={TRANSITIONS.crossfade}
        />
      </AnimatePresence>

      {/* Horizontal sleeve label wrapped around the tube body */}
      <div
        className="absolute pointer-events-none flex items-center justify-center"
        style={{ left: "32%", right: "32%", top: "55%", height: "10%" }}
      >
        <div className="w-full h-full bg-background/85 backdrop-blur-sm border-y border-foreground/15 flex items-center justify-center">
          <span className={`font-serif italic text-foreground/80 ${dims.labelText} px-2 truncate`}>
            {label || "Your text"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `bunx tsc --noEmit`

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/customizer/TubePreview.tsx
git commit -m "feat: extract TubePreview with sleeve label, scent halos, and layoutId"
```

---

## Task 5: Customizer form sub-components

Six small, focused components. None of them owns business state — they are controlled inputs whose state lives in `CustomizerScreen`.

**Files:**
- Create: `src/components/customizer/CasingPicker.tsx`
- Create: `src/components/customizer/ProductHeader.tsx`
- Create: `src/components/customizer/ScentSelector.tsx`
- Create: `src/components/customizer/ShadeSelector.tsx`
- Create: `src/components/customizer/LabelInput.tsx`
- Create: `src/components/customizer/QuantitySelector.tsx`

- [ ] **Step 1: Create `CasingPicker.tsx`**

```tsx
import { motion } from "framer-motion";
import { TRANSITIONS } from "../../lib/motion";
import type { Casing } from "../../data/casings";

type Props = {
  casings: readonly Casing[];
  active: Casing;
  onSelect: (casing: Casing) => void;
};

export function CasingPicker({ casings, active, onSelect }: Props) {
  if (casings.length <= 1) return null;
  return (
    <div className="flex gap-3 items-center">
      {casings.map((c) => {
        const isActive = c.id === active.id;
        return (
          <motion.button
            key={c.id}
            type="button"
            aria-label={c.name}
            aria-pressed={isActive}
            onClick={() => onSelect(c)}
            animate={{ scale: isActive ? 1.05 : 1, opacity: isActive ? 1 : 0.6 }}
            whileTap={{ scale: 0.97 }}
            transition={TRANSITIONS.spring}
            className={`size-16 rounded-xl overflow-hidden bg-secondary border ${isActive ? "border-foreground" : "border-border"}`}
          >
            <img src={c.image} alt="" className="w-full h-full object-contain p-2" />
          </motion.button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Create `ProductHeader.tsx`**

```tsx
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
```

- [ ] **Step 3: Create `ScentSelector.tsx`**

```tsx
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import type { Scent } from "../../data/scents";

type Props = {
  scents: readonly Scent[];
  active: Scent;
  onSelect: (scent: Scent) => void;
};

export function ScentSelector({ scents, active, onSelect }: Props) {
  return (
    <div>
      <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/60 mb-3 block">
        1 · Scent
      </Label>
      <div className="flex flex-wrap gap-2">
        {scents.map((s) => (
          <Button
            key={s.name}
            type="button"
            variant={active.name === s.name ? "default" : "outline"}
            size="sm"
            onClick={() => onSelect(s)}
            className="text-[11px] rounded-full"
          >
            {s.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `ShadeSelector.tsx`**

```tsx
import { Label } from "../ui/label";
import type { Shade } from "../../data/shades";

type Props = {
  shades: readonly Shade[];
  active: Shade;
  onSelect: (shade: Shade) => void;
};

export function ShadeSelector({ shades, active, onSelect }: Props) {
  return (
    <div>
      <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/60 mb-3 block">
        2 · Shade —{" "}
        <span className="italic font-serif normal-case tracking-normal text-foreground/80">
          {active.name}
        </span>
      </Label>
      <div className="flex flex-wrap gap-3">
        {shades.map((s) => {
          const isActive = s.name === active.name;
          return (
            <button
              key={s.name}
              type="button"
              aria-label={s.name}
              onClick={() => onSelect(s)}
              style={{ background: s.hex }}
              className={`size-10 rounded-full shadow-inner transition-transform hover:scale-110 ${
                isActive ? "ring-2 ring-offset-2 ring-foreground" : "ring-1 ring-foreground/10"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create `LabelInput.tsx`**

```tsx
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
```

- [ ] **Step 6: Create `QuantitySelector.tsx`**

```tsx
import { Button } from "../ui/button";
import { Label } from "../ui/label";

type Props = {
  qty: number;
  onChange: (qty: number) => void;
};

export function QuantitySelector({ qty, onChange }: Props) {
  return (
    <div>
      <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/60 mb-3 block">
        4 · Quantity
      </Label>
      <div className="flex items-center border border-border rounded-lg w-fit">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange(Math.max(1, qty - 1))}
          className="px-4 py-3 h-auto rounded-none rounded-l-lg"
        >
          −
        </Button>
        <span className="px-5 py-3 font-mono border-x border-border min-w-[3rem] text-center text-sm">
          {String(qty).padStart(2, "0")}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange(qty + 1)}
          className="px-4 py-3 h-auto rounded-none rounded-r-lg"
        >
          +
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Type-check**

Run: `bunx tsc --noEmit`

Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add src/components/customizer/CasingPicker.tsx src/components/customizer/ProductHeader.tsx src/components/customizer/ScentSelector.tsx src/components/customizer/ShadeSelector.tsx src/components/customizer/LabelInput.tsx src/components/customizer/QuantitySelector.tsx
git commit -m "feat: add customizer form sub-components"
```

---

## Task 6: CustomizerScreen orchestrator

Owns the in-progress configuration state. Composes `CasingPicker`, `ProductHeader`, the four selectors, and `TubePreview`. Renders the "Add to bag" CTA.

**Files:**
- Create: `src/components/customizer/CustomizerScreen.tsx`

- [ ] **Step 1: Create the file**

```tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { CASINGS } from "../../data/casings";
import { SHADES } from "../../data/shades";
import { SCENTS } from "../../data/scents";
import { LIPGLOSS } from "../../data/products";
import { CasingPicker } from "./CasingPicker";
import { ProductHeader } from "./ProductHeader";
import { ScentSelector } from "./ScentSelector";
import { ShadeSelector } from "./ShadeSelector";
import { LabelInput } from "./LabelInput";
import { QuantitySelector } from "./QuantitySelector";
import { TubePreview } from "./TubePreview";
import { useBag } from "../../hooks/use-bag";

type Props = {
  onAdded: () => void;  // called after add — parent opens MiniBagPanel
};

const UNIT_PRICE = 24;

export function CustomizerScreen({ onAdded }: Props) {
  const [casing, setCasing] = useState(CASINGS[0]);
  const [shade, setShade] = useState(SHADES[0]);
  const [scent, setScent] = useState(SCENTS[0]);
  const [label, setLabel] = useState("");
  const [qty, setQty] = useState(1);
  const { add } = useBag();

  const lineTotal = UNIT_PRICE * qty;
  const canAdd = label.trim().length > 0;

  const handleAdd = () => {
    if (!canAdd) return;
    add({
      casingId: casing.id,
      shadeName: shade.name,
      shadeHex: shade.hex,
      scentName: scent.name,
      label: label.trim(),
      qty,
      unitPrice: UNIT_PRICE,
    });
    onAdded();
  };

  return (
    <motion.section
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
      className="max-w-7xl mx-auto px-6 md:px-8 py-10 md:py-16 grid md:grid-cols-2 gap-10 lg:gap-20 items-start"
    >
      <div className="space-y-8">
        <CasingPicker casings={CASINGS} active={casing} onSelect={setCasing} />
        <ProductHeader name={LIPGLOSS.name} price={UNIT_PRICE} blurb={LIPGLOSS.tagline} />
        <div className="space-y-6">
          <ScentSelector scents={SCENTS} active={scent} onSelect={setScent} />
          <ShadeSelector shades={SHADES} active={shade} onSelect={setShade} />
          <LabelInput value={label} onChange={setLabel} />
          <QuantitySelector qty={qty} onChange={setQty} />
        </div>
        <Button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          className="w-full md:w-auto bg-foreground text-background hover:bg-foreground/95 px-8 py-4 rounded-xl font-bold text-sm tracking-[0.15em] uppercase shadow-xl shadow-foreground/20 h-auto disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add to bag · £{lineTotal.toFixed(2)}
        </Button>
      </div>
      <div className="flex justify-center">
        <TubePreview casing={casing} shade={shade} scent={scent} label={label} />
      </div>
    </motion.section>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `bunx tsc --noEmit`

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/customizer/CustomizerScreen.tsx
git commit -m "feat: add CustomizerScreen orchestrator with bag integration"
```

---

## Task 7: MiniBagPanel

Slide-in panel from the right. Lists items. Has Continue customizing / Checkout actions.

**Files:**
- Create: `src/components/checkout/MiniBagPanel.tsx`

- [ ] **Step 1: Create the file**

```tsx
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { TRANSITIONS } from "../../lib/motion";
import { useBag } from "../../hooks/use-bag";
import { CASINGS } from "../../data/casings";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MiniBagPanel({ open, onClose }: Props) {
  const { items, remove, subtotal } = useBag();
  const navigate = useNavigate();

  const goCheckout = () => {
    onClose();
    navigate({ to: "/", search: { screen: "review" } });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={TRANSITIONS.panel}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-40"
          />
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={TRANSITIONS.panel}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border z-50 flex flex-col"
            aria-label="Your bag"
          >
            <header className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-serif text-xl">Your bag</h2>
              <button onClick={onClose} aria-label="Close bag" className="p-1">
                <X className="size-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 && (
                <p className="text-sm text-foreground/50">Your bag is empty.</p>
              )}
              {items.map((it) => {
                const casing = CASINGS.find((c) => c.id === it.casingId);
                return (
                  <div key={it.id} className="flex gap-4 items-start">
                    <div
                      className="size-12 rounded-md shrink-0 bg-secondary flex items-center justify-center"
                      style={{ boxShadow: `inset 0 -6px 12px ${it.shadeHex}` }}
                    >
                      {casing && (
                        <img src={casing.image} alt="" className="w-full h-full object-contain p-1" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        {casing?.name ?? it.casingId} · {it.shadeName} · {it.scentName}
                      </p>
                      <p className="font-serif italic text-sm text-foreground/70 truncate">
                        “{it.label}”
                      </p>
                      <p className="text-xs text-foreground/50 mt-1">
                        ×{it.qty} · £{(it.unitPrice * it.qty).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => remove(it.id)}
                      aria-label={`Remove ${it.label}`}
                      className="text-foreground/40 hover:text-foreground p-1"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            <footer className="border-t border-border p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-foreground/60">Subtotal</span>
                <span className="font-mono">£{subtotal.toFixed(2)}</span>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full"
              >
                Continue customizing
              </Button>
              <Button
                type="button"
                onClick={goCheckout}
                disabled={items.length === 0}
                className="w-full bg-foreground text-background hover:bg-foreground/95"
              >
                Checkout · £{subtotal.toFixed(2)}
              </Button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `bunx tsc --noEmit`

Expected: no errors. Note: `useNavigate`'s `search` typing requires `screen` to be a valid search param on `/`. This will be wired in Task 11. If TS complains here, accept the error temporarily — the search-param shape gets defined in Task 11 and this file passes after that. Document the dependency in the commit message.

- [ ] **Step 3: Commit**

```bash
git add src/components/checkout/MiniBagPanel.tsx
git commit -m "feat: add MiniBagPanel slide-in with checkout handoff"
```

---

## Task 8: ReviewScreen + relocated ConfirmationBanner

Screen 2 — final review, item list, total, Monzo pay button. The relocated ConfirmationBanner appears after pay is clicked.

**Files:**
- Create: `src/components/checkout/ConfirmationBanner.tsx`
- Create: `src/components/checkout/ReviewScreen.tsx`

- [ ] **Step 1: Create `ConfirmationBanner.tsx`**

```tsx
import { Card, CardContent } from "../ui/card";
import type { BagItem } from "../../hooks/use-bag";

type Props = {
  orderId: string;
  items: BagItem[];
  total: number;
};

export function ConfirmationBanner({ orderId, items, total }: Props) {
  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-accent text-lg">✦</span>
          </div>
          <div>
            <p className="font-serif italic text-lg">Booking received</p>
            <p className="text-xs text-foreground/50 font-mono tracking-wide">{orderId}</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          {items.map((it) => (
            <li key={it.id} className="flex justify-between gap-4">
              <span className="truncate">
                {it.shadeName} · {it.scentName} · “{it.label}” ×{it.qty}
              </span>
              <span className="font-mono shrink-0">£{(it.unitPrice * it.qty).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between pt-3 border-t border-border text-sm">
          <span className="text-foreground/60">Total</span>
          <span className="font-mono">£{total.toFixed(2)}</span>
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
```

- [ ] **Step 2: Create `ReviewScreen.tsx`**

```tsx
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { TubePreview } from "../customizer/TubePreview";
import { CASINGS } from "../../data/casings";
import { SHADES } from "../../data/shades";
import { SCENTS } from "../../data/scents";
import { useBag } from "../../hooks/use-bag";
import { ConfirmationBanner } from "./ConfirmationBanner";

function generateOrderId(): string {
  return `BKEUT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function ReviewScreen() {
  const { items, subtotal } = useBag();
  const navigate = useNavigate();
  // Show the most recently added item first so the layoutId tube morph is continuous
  const orderedItems = useMemo(() => [...items].reverse(), [items]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [confirmed, setConfirmed] = useState<{ orderId: string } | null>(null);

  const goBack = () => navigate({ to: "/", search: {} });

  const handlePay = () => {
    if (items.length === 0) return;
    const orderId = generateOrderId();
    setConfirmed({ orderId });
    const description = encodeURIComponent(
      `BKEUT ${items.length === 1 ? "Gloss" : `Gloss x${items.length}`}`,
    );
    window.open(
      `https://monzo.me/?amount=${subtotal.toFixed(2)}&description=${description}`,
      "_blank",
    );
  };

  const previewItem = orderedItems[previewIndex];
  const previewCasing = previewItem
    ? CASINGS.find((c) => c.id === previewItem.casingId) ?? CASINGS[0]
    : CASINGS[0];
  const previewShade = previewItem
    ? SHADES.find((s) => s.name === previewItem.shadeName) ?? SHADES[0]
    : SHADES[0];
  const previewScent = previewItem
    ? SCENTS.find((s) => s.name === previewItem.scentName) ?? SCENTS[0]
    : SCENTS[0];

  return (
    <motion.section
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
      className="max-w-5xl mx-auto px-6 md:px-8 py-10 md:py-16"
    >
      <div className="flex items-center justify-between mb-10">
        <Button type="button" variant="ghost" onClick={goBack} className="gap-2">
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <h1 className="font-serif text-2xl md:text-3xl">Review your order</h1>
        <span className="w-16" aria-hidden />
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div className="flex flex-col items-center gap-4">
          {previewItem ? (
            <>
              <TubePreview
                casing={previewCasing}
                shade={previewShade}
                scent={previewScent}
                label={previewItem.label}
                size="sm"
              />
              {orderedItems.length > 1 && (
                <div className="flex gap-2">
                  {orderedItems.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Preview item ${i + 1}`}
                      onClick={() => setPreviewIndex(i)}
                      className={`size-2 rounded-full ${i === previewIndex ? "bg-foreground" : "bg-foreground/25"}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-foreground/50">Bag is empty.</p>
          )}
        </div>

        <div className="space-y-6">
          <ul className="space-y-3">
            {orderedItems.map((it, i) => (
              <li key={it.id} className="text-sm">
                <div className="flex justify-between gap-4">
                  <span className="font-medium">
                    {i + 1} · {it.shadeName} · {it.scentName}
                  </span>
                  <span className="font-mono">£{(it.unitPrice * it.qty).toFixed(2)}</span>
                </div>
                <div className="text-foreground/60 italic font-serif">
                  “{it.label}” ×{it.qty}
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-border pt-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/60">Subtotal</span>
              <span className="font-mono">£{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Delivery</span>
              <span className="font-mono">Free UK</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t border-border">
              <span>Total</span>
              <span className="font-mono">£{subtotal.toFixed(2)}</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handlePay}
            disabled={items.length === 0}
            className="w-full bg-foreground text-background hover:bg-foreground/95 px-6 py-4 rounded-xl font-bold text-sm tracking-[0.15em] uppercase h-auto"
          >
            Pay £{subtotal.toFixed(2)} with Monzo
          </Button>
          <p className="text-[10px] text-foreground/40 text-center">
            Secure payment via Monzo link
          </p>

          {confirmed && (
            <ConfirmationBanner orderId={confirmed.orderId} items={items} total={subtotal} />
          )}
        </div>
      </div>
    </motion.section>
  );
}
```

- [ ] **Step 3: Type-check**

Run: `bunx tsc --noEmit`

Expected: no errors (same caveat as Task 7 — search-param shape is wired in Task 11).

- [ ] **Step 4: Commit**

```bash
git add src/components/checkout/ReviewScreen.tsx src/components/checkout/ConfirmationBanner.tsx
git commit -m "feat: add ReviewScreen and multi-item ConfirmationBanner"
```

---

## Task 9: Nav, Footer, SocialStrip, shared social icons

Replace the inline `Nav` and `Footer` from `routes/index.tsx` with extracted components. Remove the dead links. Add real social icons. Extract the TikTok SVG once so Footer, SocialStrip, and ProductTile (Task 10) all import it.

**Files:**
- Create: `src/components/layout/social-icons.tsx`
- Create: `src/components/layout/Nav.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/components/layout/SocialStrip.tsx`

- [ ] **Step 1: Create `social-icons.tsx`**

```tsx
import { Instagram } from "lucide-react";

export { Instagram };

// TikTok isn't in lucide-react's stable icon set; inline SVG keeps the bundle small.
export function TikTok(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.94a8.16 8.16 0 0 0 4.77 1.52V7a4.85 4.85 0 0 1-1.84-.31z" />
    </svg>
  );
}

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/bkeutco",
  tiktok: "https://tiktok.com/@bkeutco",
} as const;
```

(Replace the URLs with the brand's real handles when known.)

- [ ] **Step 2: Create `Nav.tsx`**

```tsx
import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useBag } from "../../hooks/use-bag";

type Props = {
  onOpenBag: () => void;
};

export function Nav({ onOpenBag }: Props) {
  const { items, subtotal } = useBag();
  const count = items.reduce((n, it) => n + it.qty, 0);

  return (
    <nav className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-6 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="font-serif text-2xl font-black tracking-tight italic">
          BKEUT&amp;Co.
        </Link>
        <div className="flex items-center gap-6 text-xs uppercase tracking-[0.2em] font-semibold">
          <Link to="/shop" className="hover:text-accent transition-colors">
            Products
          </Link>
          <button
            type="button"
            onClick={onOpenBag}
            className="flex items-center gap-2 hover:text-accent transition-colors"
            aria-label="Open bag"
          >
            <ShoppingBag className="size-4" />
            <span>
              Bag ({count}) {count > 0 && `· £${subtotal.toFixed(2)}`}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: Create `Footer.tsx`**

```tsx
import { Link } from "@tanstack/react-router";
import { Instagram, TikTok, SOCIAL_LINKS } from "./social-icons";

export function Footer() {
  return (
    <footer className="bg-foreground text-background/80 pt-20 pb-12 px-6 md:px-8 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="space-y-6 max-w-sm">
          <div className="font-serif text-4xl font-black italic text-background">
            BKEUT&amp;Co.
          </div>
          <p className="text-sm leading-relaxed opacity-70">
            Bespoke gift customization. Labeled by hand, poured for you.
          </p>
          <div className="flex gap-4">
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener" aria-label="Instagram">
              <Instagram className="size-5" />
            </a>
            <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener" aria-label="TikTok">
              <TikTok className="size-5" />
            </a>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Shop</h4>
          <ul className="text-sm space-y-2">
            <li>
              <Link to="/shop" className="hover:text-background">
                Products
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-16 border-t border-background/10 mt-16 flex flex-col md:flex-row justify-between gap-3 text-[10px] uppercase tracking-[0.2em] font-medium">
        <span>© 2026 BKEUT&amp;Co.</span>
        <span>Crafted in the Chocolate District</span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Create `SocialStrip.tsx`**

```tsx
import { Instagram, TikTok, SOCIAL_LINKS } from "./social-icons";

type Props = {
  visible?: boolean;
};

export function SocialStrip({ visible = true }: Props) {
  if (!visible) return null;
  return (
    <div className="hidden md:flex fixed right-2 top-1/2 -translate-y-1/2 z-20 flex-col gap-4 opacity-70 hover:opacity-100 transition-opacity">
      <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener" aria-label="Instagram">
        <Instagram className="size-5" />
      </a>
      <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener" aria-label="TikTok">
        <TikTok className="size-5" />
      </a>
    </div>
  );
}
```

- [ ] **Step 5: Type-check**

Run: `bunx tsc --noEmit`

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/social-icons.tsx src/components/layout/Nav.tsx src/components/layout/Footer.tsx src/components/layout/SocialStrip.tsx
git commit -m "feat: add slim Nav with bag indicator, Footer with socials, SocialStrip, shared social icons"
```

---

## Task 10: /shop route + ProductTile

A new TanStack Router file route. The router's codegen will pick it up automatically.

**Files:**
- Create: `src/components/shop/ProductTile.tsx`
- Create: `src/routes/shop.tsx`

- [ ] **Step 1: Create `ProductTile.tsx`**

```tsx
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Instagram, TikTok, SOCIAL_LINKS } from "../layout/social-icons";
import { FADE_UP } from "../../lib/motion";
import type { Product } from "../../data/products";

type Props = {
  product: Product;
  preview?: string; // optional image
};

export function ProductTile({ product, preview }: Props) {
  const isLive = product.href !== null;
  const body = (
    <motion.div variants={FADE_UP} className="space-y-3">
      <div className={`aspect-square rounded-xl bg-secondary flex items-center justify-center overflow-hidden ${isLive ? "" : "opacity-60"}`}>
        {preview ? (
          <img src={preview} alt={product.name} className="w-full h-full object-contain p-6" />
        ) : (
          <span className="font-serif text-5xl text-foreground/30 italic">{product.name[0]}</span>
        )}
      </div>
      <div className="flex items-baseline justify-between">
        <h3 className="font-serif text-xl">{product.name}</h3>
        <span className="text-xs text-foreground/50">
          {product.fromPrice ? `from £${product.fromPrice}` : "Coming soon"}
        </span>
      </div>
      {!isLive && (
        <div className="text-[11px] text-foreground/40 flex items-center gap-2">
          <span>Follow for drops</span>
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener" aria-label="Instagram">
            <Instagram className="size-3.5" />
          </a>
          <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener" aria-label="TikTok">
            <TikTok className="size-3.5" />
          </a>
        </div>
      )}
    </motion.div>
  );

  if (isLive && product.href) {
    return (
      <Link to={product.href} className="block hover:opacity-90 transition-opacity">
        {body}
      </Link>
    );
  }
  return <div aria-disabled>{body}</div>;
}
```

- [ ] **Step 2: Create `src/routes/shop.tsx`**

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Nav } from "../components/layout/Nav";
import { Footer } from "../components/layout/Footer";
import { SocialStrip } from "../components/layout/SocialStrip";
import { ProductTile } from "../components/shop/ProductTile";
import { PRODUCTS } from "../data/products";
import { STAGGER } from "../lib/motion";
import tubeImage from "../assets/lipgloss-tube.png";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
  head: () => ({
    meta: [
      { title: "BKEUT&Co. — Our range" },
      { name: "description", content: "Bespoke gift customization by BKEUT&Co. Lipgloss live now, more coming soon." },
    ],
  }),
});

function ShopPage() {
  // Bag panel opening is wired from the nav; we route to / to manage it, but the
  // shop nav only opens it if a panel state lives at the route level — for now,
  // the bag button on /shop simply navigates back to /.
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav onOpenBag={() => { window.location.href = "/"; }} />
      <SocialStrip />
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <h1 className="font-serif text-5xl md:text-6xl tracking-tight mb-12">Our range</h1>
        <motion.div
          variants={STAGGER}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {PRODUCTS.map((p) => (
            <ProductTile key={p.id} product={p} preview={p.id === "lipgloss" ? tubeImage : undefined} />
          ))}
        </motion.div>
      </section>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 3: Regenerate the route tree**

Run: `bun run dev` for ~3 seconds to trigger TanStack's plugin to regenerate `src/routeTree.gen.ts`, then stop the server (Ctrl-C).

Alternative: trigger via build: `bun run build` (the plugin runs during build).

Expected: `src/routeTree.gen.ts` is updated to include the `/shop` route.

- [ ] **Step 4: Type-check**

Run: `bunx tsc --noEmit`

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/shop/ProductTile.tsx src/routes/shop.tsx src/routeTree.gen.ts
git commit -m "feat: add /shop catalog route with coming-soon product tiles"
```

---

## Task 11: Wire `?screen=` param + screen-level animation + delete GlossCustomizer

This is where the new architecture replaces the old. `routes/index.tsx` becomes thin: it reads `?screen=`, renders either `CustomizerScreen` or `ReviewScreen` inside `<AnimatePresence>`, and owns the mini-bag panel open/close.

**Files:**
- Modify: `src/routes/index.tsx` (full rewrite)
- Modify: `src/routes/__root.tsx` (wrap with `BagProvider`)
- Delete: `src/components/GlossCustomizer.tsx`

- [ ] **Step 1: Inspect `__root.tsx` to find the right insertion point**

Run: `head -120 src/routes/__root.tsx`

Locate where `<Outlet />` is rendered. The `BagProvider` must wrap it so both `/` and `/shop` share the same bag context.

- [ ] **Step 2: Wrap `<Outlet />` with `<BagProvider>`**

Add this import at the top of `src/routes/__root.tsx`:

```tsx
import { BagProvider } from "../hooks/use-bag";
```

Wrap the `<Outlet />` element (or whatever wraps it inside `QueryClientProvider`) so it looks like:

```tsx
<BagProvider>
  <Outlet />
</BagProvider>
```

If `<Outlet />` is rendered inside an HTML shell, wrap only the `<Outlet />`, not the html/head structure.

- [ ] **Step 3: Rewrite `src/routes/index.tsx`**

Replace the file's contents entirely:

```tsx
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { z } from "zod";
import { CustomizerScreen } from "../components/customizer/CustomizerScreen";
import { ReviewScreen } from "../components/checkout/ReviewScreen";
import { MiniBagPanel } from "../components/checkout/MiniBagPanel";
import { Nav } from "../components/layout/Nav";
import { Footer } from "../components/layout/Footer";
import { SocialStrip } from "../components/layout/SocialStrip";

const indexSearchSchema = z.object({
  screen: z.enum(["review"]).optional(),
});

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: indexSearchSchema,
  head: () => ({
    meta: [
      { title: "BKEUT&Co. Lipgloss — Bespoke Labeled Gloss" },
      {
        name: "description",
        content:
          "Customizable luxury lip gloss by BKEUT&Co. Personalize your shade and labeling for birthdays, weddings, quotes, and every indulgent moment.",
      },
      { property: "og:title", content: "BKEUT&Co. Lipgloss — Bespoke Labeled Gloss" },
      { property: "og:description", content: "Bespoke lip gloss, labeled and poured for you." },
    ],
  }),
});

function Index() {
  const { screen } = Route.useSearch();
  const [bagOpen, setBagOpen] = useState(false);
  const onReview = screen === "review";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav onOpenBag={() => setBagOpen(true)} />
      <SocialStrip visible={!onReview} />
      <LayoutGroup>
        <AnimatePresence mode="wait">
          {onReview ? (
            <ReviewScreen key="review" />
          ) : (
            <CustomizerScreen key="customize" onAdded={() => setBagOpen(true)} />
          )}
        </AnimatePresence>
      </LayoutGroup>
      <MiniBagPanel open={bagOpen} onClose={() => setBagOpen(false)} />
      <Footer />
    </div>
  );
}
```

Note: `LayoutGroup` enables the `layoutId="tube"` shared-element morph between `CustomizerScreen`'s `TubePreview` (size `lg`) and `ReviewScreen`'s `TubePreview` (size `sm`).

- [ ] **Step 4: Delete the old `GlossCustomizer.tsx`**

```bash
git rm src/components/GlossCustomizer.tsx
```

- [ ] **Step 5: Type-check**

Run: `bunx tsc --noEmit`

Expected: no errors. If `zod` isn't yet installed, add it: `bun add zod`. (Check `package.json` — it's likely already there as a transitive dep, but explicitly add if not.)

- [ ] **Step 6: Build the app**

Run: `bun run build`

Expected: build succeeds.

- [ ] **Step 7: Smoke-test in the browser**

Run: `bun run dev`

Manually verify in a browser:

1. `/` loads on screen 1 (customizer) with no scroll required to see the Add-to-bag CTA.
2. Pick a casing → tube preview crossfades.
3. Pick a scent → background halos shift colors.
4. Pick a shade → gloss fill color updates.
5. Type a label → sleeve label on tube updates live; counter shows N/14.
6. Click **Add to bag** → mini-bag panel slides in from the right; bag count in nav increments.
7. Click **Continue customizing** → panel closes; customizer is still there.
8. Click the bag indicator in nav → panel re-opens.
9. Click **Checkout** → URL becomes `/?screen=review`; screens slide; tube morphs to the smaller preview on the right.
10. Click **Back** → URL returns to `/`; slides back; bag still intact.
11. Click **Pay £X with Monzo** → opens Monzo in a new tab; in-page ConfirmationBanner appears.
12. Browser back from `/?screen=review` returns to `/`.
13. Navigate to `/shop` → catalog with Lipgloss + 3 coming-soon tiles.

Stop the dev server after verification.

- [ ] **Step 8: Commit**

```bash
git add src/routes/index.tsx src/routes/__root.tsx
git rm src/components/GlossCustomizer.tsx
git commit -m "feat: wire customizer ↔ review screen transition; delete legacy GlossCustomizer"
```

---

## Task 12: Cleanup pass

Delete the now-unused lookbook assets and the `use-scroll-reveal` hook. Verify nothing else references them.

**Files:**
- Delete: `src/hooks/use-scroll-reveal.ts`
- Delete: `src/assets/lookbook-1.jpg`
- Delete: `src/assets/lookbook-2.jpg`
- Delete: `src/assets/lookbook-3.jpg`
- Delete: `src/assets/lookbook-4.jpg`

- [ ] **Step 1: Verify no references remain**

Run:
```bash
grep -r "use-scroll-reveal" src/ || echo "no refs"
grep -r "lookbook-" src/ || echo "no refs"
grep -r "useScrollReveal\|useScrollSpy" src/ || echo "no refs"
```

Expected: each prints `no refs`. If any reference is found, resolve it before deleting.

- [ ] **Step 2: Delete the files**

```bash
git rm src/hooks/use-scroll-reveal.ts
git rm src/assets/lookbook-1.jpg src/assets/lookbook-2.jpg src/assets/lookbook-3.jpg src/assets/lookbook-4.jpg
```

- [ ] **Step 3: Type-check and lint**

Run: `bunx tsc --noEmit && bun run lint`

Expected: no errors.

- [ ] **Step 4: Final build verification**

Run: `bun run build`

Expected: succeeds.

- [ ] **Step 5: Final test run**

Run: `bun run test:run`

Expected: all `useBag` tests still pass.

- [ ] **Step 6: Commit**

```bash
git commit -m "chore: remove unused lookbook assets and scroll-reveal hook"
```

---

## Out of scope (deferred)

- Real product images for the 3 placeholder casings.
- Buyer email/address capture on the review screen.
- A `/checkout/confirmed` route (waiting on Monzo webhook).
- A second real product beyond Lipgloss.
- Email/SMS notify-me capture for coming-soon tiles.
- Mobile drawer for nav (the slim 3-item nav fits without a hamburger).
