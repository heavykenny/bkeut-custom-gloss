# BKEUT&Co. Site Revamp — Design Spec

**Date:** 2026-05-18
**Status:** Approved for implementation planning
**Goal:** Rebuild the site so a visitor lands directly on the lipgloss customizer (no scroll required), customizes a tube (casing, shade, scent, label, quantity), adds it to a bag, and pays via Monzo on a second screen reached by a horizontal slide. Drop all filler sections. Lay groundwork for additional products without overbuilding.

## 1. Page architecture & routes

Three routes:

- **`/`** — the customizer. Lands on screen 1 by default. A `screen` URL search param (`?screen=review`) drives the horizontal-slide transition to screen 2 (review/pay). Browser back works natively because the screen state is encoded in the URL.
- **`/shop`** — catalog. Grid of product tiles: Lipgloss (live, links to `/`), plus 2–3 dimmed "Coming Soon" placeholders (perfume, candle, charm). When a second real product launches, it gets its own route (e.g. `/perfume`) and `/shop` continues to be the catalog.
- **Optional, deferred:** `/checkout/confirmed` — a thin success page Monzo could redirect to. Not in scope today.

### Navigation

Sticky top, slim. Three items:

- `BKEUT&Co.` wordmark (links to `/`).
- `Products` link (→ `/shop`).
- `Bag (n) · £X` indicator — clicking opens the mini-bag panel.

Removed: "How It Works", "The Studio", "Lookbook" links. Removed: the section-scrollspy behavior (only one screen is visible at a time now).

## 2. Screen 1 — The Customizer

Fits in a viewport at desktop (≥1024px). On mobile the tube preview stacks above the controls but the section still contains no marketing filler above it.

**Layout (desktop):**

```
┌────────────────────────────────────────────────────────────┐
│ BKEUT&Co.                       Products    Bag(0) · £0    │
├────────────────────────────────────────────────────────────┤
│   [■][□][□]  ← casing thumbnail row                        │
│   ┌──────────┐    Lipgloss      £24    [ about ]           │
│   │  ✵       │                                             │
│   │  TUBE    │    1 · Scent      ○ ● ○ ○ ○ ○               │
│   │ + sleeve │    2 · Shade      ● ● ○ ○ ○ ○ ○ ○           │
│   │  label   │    3 · Label      [ Evelyn's Glow      ]    │
│   │  ✵       │                   14/14                     │
│   └──────────┘    4 · Quantity   − 2 +                     │
│                          [   Add to bag · £48   ]          │
└────────────────────────────────────────────────────────────┘
                                                            ▌  ← socials
```

### Components on screen 1

- **`CasingPicker`** — horizontal row of 2–3 tube thumbnails. Click → crossfade the big preview (Framer `AnimatePresence` keyed on casing id, 250ms). Active thumb has a tight ring and a subtle `scale: 1.05` spring. Inactive at 60% opacity. The row is hidden when only one casing exists.
- **`TubePreview`** — single source of truth for the rendered tube. Renders the casing image + an absolutely-positioned horizontal sleeve label (a `<div>` band wrapped around the tube body) showing the live text. Renders the two scent-tinted halos (Section 4). Carries Framer `layoutId="tube"` so it morphs into screen 2's smaller preview.
- **`ProductHeader`** — product name, price, and an "about" link that opens a small popover with the 1–2 sentence product blurb. Replaces today's giant "Your Signature Shine" headline.
- **`ScentSelector`** — pill chips. Selected scent drives the ambient halo colors (Section 4).
- **`ShadeSelector`** — color dots; active dot has a ring + shows its name in italic. The "Request a custom shade" link is kept but de-emphasized.
- **`LabelInput`** — single-line input, 14-char max, live-updates the sleeve label on the tube preview.
- **`QuantitySelector`** — minus / number / plus, smaller visual weight than today.
- **`AddToBagButton`** — large bottom CTA showing the running line subtotal (`Add to bag · £48`). Disabled until the label has text. On click: spring-bounce, then mini-bag panel slides in.

### Removed from current code

`HowItWorks`, `Lookbook`, `Marquee` sections. The 8xl "Your Signature Shine" hero. The marketing paragraph "Bespoke high-viscosity gloss…" — its content becomes the popover behind "about". The inline `ConfirmationBanner` (it relocates to screen 2 as the post-pay state).

## 3. Mini-bag panel + Screen 2 (Review & Pay)

### Mini-bag panel

Triggered by **Add to bag** *and* by clicking the nav `Bag (n) · £X` indicator. Slide-in from the right edge as a `<motion.aside>` (`x: 100%` → `0`, ~350ms ease-out), with a fade-in backdrop behind it.

```
                                        ┌──────────────────────────┐
                                        │  Your bag                ✕│
                                        ├──────────────────────────┤
                                        │ ┌──┐ Cocoa · Vanilla     │
                                        │ │▮▮│ "Mum"   ×1   £24   │
                                        │ └──┘                  ✕ │
                                        │ ┌──┐ Praline · Berry    │
                                        │ │▮▮│ "Sister" ×2   £48  │
                                        │ └──┘                  ✕ │
                                        │ Subtotal          £72    │
                                        │ [ Continue customizing ] │
                                        │ [   Checkout · £72   ]   │
                                        └──────────────────────────┘
```

Each row shows a tiny tube thumbnail (the casing image at ~48px, gloss area tinted to the item's shade), the casing+scent line, the label text in italic, quantity, line total, and an ✕ to remove. **Continue customizing** closes the panel and leaves the customizer in its current state. **Checkout** closes the panel and updates the URL to `/?screen=review`, which triggers the horizontal-slide transition to screen 2.

### Screen 2 — Review & Pay

Triggered by `?screen=review`. The customizer slides out left and the review/pay layout slides in from the right (Framer `AnimatePresence`). The tube preview from screen 1 morphs (via shared `layoutId="tube"`) to a smaller position on the left of screen 2 for visual continuity.

```
┌────────────────────────────────────────────────────────────┐
│ BKEUT&Co.                       Products    Bag(2) · £72   │
├────────────────────────────────────────────────────────────┤
│  ← Back                Review your order                   │
│  ┌─────────┐   1 · Cocoa Slim · Vanilla                    │
│  │  tube   │       "Mum"           ×1        £24           │
│  │ preview │   ──────────────────────────────────          │
│  │ (first  │   2 · Praline Slim · Berry                   │
│  │ item)   │       "Sister"        ×2        £48           │
│  └─────────┘   Subtotal                       £72          │
│                Delivery                     Free UK        │
│                Total                          £72          │
│                [    Pay £72 with Monzo    ]                │
│                Secure payment via Monzo link               │
└────────────────────────────────────────────────────────────┘
```

- The preview on the left initially renders the **most recently added** bag item — this matches what screen 1's tube looked like at the moment of slide, so the shared-element `layoutId="tube"` morph from screen 1 → screen 2 is visually continuous (the tube doesn't "flip" to a different shade mid-slide). If multiple items are in the bag, a small dot-row under it (`• ○ ○`) lets the user cycle through previews of the other items.
- The summary on the right is a compact list with no per-item edit affordances — Back is the way to edit.
- **Back** removes the `screen` param and reverses the slide. Bag state is preserved.
- **Pay** opens the existing Monzo deep-link (`monzo.me/?amount=...&description=...`) in a new tab. The relocated `ConfirmationBanner` then renders inline, multi-item aware, showing the order id, the list of items, and a "Payment pending — complete in the Monzo tab" line.

Buyer contact form is intentionally out of scope. If Monzo doesn't capture buyer details and you later need them, a single email field above the Pay button can be added without changing the architecture.

## 4. Atmosphere — scent halos, casing crossfade, /shop, socials

### Scent → ambient glow shift

Each scent maps to a "mood" color. The two blurred halos already behind the tube in `TubePreview` carry the change. Only those two layers shift — the tube image, the shade fill, and the page chrome stay still. This is important: a user shopping a brown gloss should not see it appear pink because they chose Berry.

```ts
const SCENT_MOOD = {
  Unscented: { halo1: "rgba(245,230,224,0.25)", halo2: "rgba(62,36,24,0.10)" },
  Vanilla:   { halo1: "rgba(235,208,189,0.35)", halo2: "rgba(176,122,91,0.12)" },
  Mint:      { halo1: "rgba(178,209,193,0.30)", halo2: "rgba(60,90,75,0.10)" },
  Chocolate: { halo1: "rgba(92,58,42,0.30)",   halo2: "rgba(40,22,14,0.12)" },
  Coconut:   { halo1: "rgba(245,238,228,0.30)", halo2: "rgba(190,170,140,0.12)" },
  Berry:     { halo1: "rgba(180,90,120,0.28)", halo2: "rgba(110,40,60,0.12)" },
};
```

Animation: Framer Motion `animate={{ backgroundColor }}` on each halo, 800ms ease-in-out.

### Casing crossfade

`TubePreview` accepts a `casingId`. The tube `<img>` is wrapped in `<AnimatePresence mode="wait">` keyed on `casingId`, using `TRANSITIONS.crossfade` (250ms ease-in-out) — `mode="wait"` means the old image's exit animation completes before the new image's enter animation begins, totaling ~500ms. The sleeve label and halos sit *outside* the AnimatePresence so they remain continuous during the swap.

### `/shop` route

```
┌────────────────────────────────────────────────────────────┐
│ BKEUT&Co.                       Products    Bag(0) · £0    │
├────────────────────────────────────────────────────────────┤
│       Our range                                            │
│   ┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐        │
│   │  tube  │   │  ✦     │   │  ◯     │   │  ✧     │        │
│   └────────┘   └────────┘   └────────┘   └────────┘        │
│   Lipgloss    Perfume      Candle       Charm              │
│   from £24    Coming soon  Coming soon  Coming soon        │
└────────────────────────────────────────────────────────────┘
```

- Lipgloss tile links to `/`.
- Coming-soon tiles are 60% opacity, unclickable, each with a small "Follow for drops" line under the price that renders the IG and TikTok icons inline (same icons used in the footer/strip). No email capture.
- Tiles stagger-fade in on route enter (80ms stagger).
- Reuses the same `Nav` and `Footer` as `/`.

### Socials

- **Footer:** inline-SVG icon row (Instagram, TikTok, optionally Pinterest). Replaces the dead "Shipping / Ingredients / Contact" placeholder links currently in the footer.
- **Fixed edge strip (`SocialStrip`):** vertical column of 2–3 tiny social icons pinned to `right: 0.5rem; top: 50%`. `hidden md:flex`. Hidden on `/?screen=review` so it doesn't clutter the checkout. ~24px icons, 70% opacity, hover to 100%.

### Footer cleanup

- **Left column:** wordmark, one-sentence brand line, social icon row.
- **Right column:** `Products` link (→ `/shop`); drop the other dead links. If a `Contact` mailto exists, add it; otherwise omit the column.
- Bottom strip: `© 2026 BKEUT&Co. · Crafted in the Chocolate District` stays.

## 5. Animation system, component map, state, file changes

### Animation system

One library: **Framer Motion**. Centralized in `src/lib/motion.ts`:

```ts
export const TRANSITIONS = {
  slide:    { duration: 0.45, ease: [0.32, 0.72, 0, 1] },   // screen 1 ↔ screen 2
  crossfade:{ duration: 0.25, ease: "easeInOut" },          // casing swap
  halo:     { duration: 0.80, ease: "easeInOut" },          // scent mood shift
  panel:    { duration: 0.35, ease: [0.22, 1, 0.36, 1] },   // mini-bag slide-in
  spring:   { type: "spring", stiffness: 400, damping: 30 },// CTA bounce, thumb scale
};

export const STAGGER = { staggerChildren: 0.08, delayChildren: 0.05 };
```

Where each is applied:

- **Slide (screens):** wrapping screen-1 and screen-2 in `<AnimatePresence mode="popLayout">`, `initial/animate/exit` with `x: ±100%`. Tube uses `layoutId="tube"` for the shared-element morph.
- **Crossfade (casing):** `<AnimatePresence mode="wait">` keyed on `casingId` around the casing `<img>`.
- **Halo (scent):** `<motion.div animate={{ backgroundColor }}>` on the two halo divs.
- **Panel (mini-bag):** `<motion.aside>` with `x: "100%"` → `0`, plus a backdrop `<motion.div>` fading 0 → 1.
- **Spring (CTA + thumb):** `whileTap={{ scale: 0.97 }}` on buttons, `animate={{ scale: active ? 1.05 : 1 }}` on casing thumbs.
- **Stagger:** `/shop` tiles + the customizer's numbered step labels fade in on first paint.

`/shop` tile reveal uses Framer's `STAGGER` on mount (above-the-fold, no scroll trigger needed). The existing `useScrollReveal` hook becomes unused and is deleted along with `useScrollSpy`.

### Component map

```
src/
├── routes/
│   ├── index.tsx               ← thin: renders CustomizerScreen or ReviewScreen based on ?screen=
│   └── shop.tsx                ← NEW
├── components/
│   ├── layout/
│   │   ├── Nav.tsx             ← extracted, slim (3 items + bag indicator)
│   │   ├── Footer.tsx          ← extracted, slim, real socials
│   │   └── SocialStrip.tsx     ← NEW: fixed right-edge vertical icons
│   ├── customizer/
│   │   ├── CustomizerScreen.tsx← screen-1 orchestrator
│   │   ├── CasingPicker.tsx    ← NEW
│   │   ├── TubePreview.tsx     ← extracted; casingId + sleeve label + halo motion + layoutId
│   │   ├── ProductHeader.tsx   ← NEW (name + price + about popover)
│   │   ├── ScentSelector.tsx
│   │   ├── ShadeSelector.tsx
│   │   ├── LabelInput.tsx
│   │   └── QuantitySelector.tsx
│   ├── checkout/
│   │   ├── ReviewScreen.tsx    ← NEW: screen 2
│   │   ├── MiniBagPanel.tsx    ← NEW: slide-in panel
│   │   └── ConfirmationBanner.tsx ← relocated, multi-item aware
│   ├── shop/
│   │   └── ProductTile.tsx     ← NEW
│   └── ui/                     ← unchanged (shadcn primitives)
├── data/
│   ├── casings.ts              ← NEW: id, name, blurb, image (3 placeholder rows reusing tube PNG)
│   ├── shades.ts               ← extracted
│   ├── scents.ts               ← extracted + SCENT_MOOD mapping
│   └── products.ts             ← NEW: lipgloss + 3 coming-soon products
├── lib/
│   └── motion.ts               ← NEW: shared transitions/easings
├── hooks/
│   └── use-bag.ts              ← NEW: bag state + localStorage persistence
│   (use-scroll-reveal.ts deleted — both useScrollReveal and useScrollSpy go)
└── assets/
    ├── lipgloss-tube.png       ← kept, reused as placeholder for all 3 casings
    └── lookbook-1..4.jpg       ← DELETED
```

The current monolithic `GlossCustomizer.tsx` (461 lines) is deleted; its logic is split across the files above. The only importer is `routes/index.tsx`, so removal is clean.

### State model

A single bag store via a small hook + React context — no Redux or Zustand:

```ts
type BagItem = {
  id: string;              // uuid per added item
  casingId: string;
  shadeName: string;
  shadeHex: string;
  scentName: string;
  label: string;
  qty: number;
  unitPrice: number;       // snapshotted at add-time
};

type BagContext = {
  items: BagItem[];
  add: (item: Omit<BagItem, "id">) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
};
```

- Persisted to `localStorage` under `bkeut:bag:v1` (versioned key).
- The customizer's local UI state (current casing, shade, scent, label, qty being built) is separate component state. It only commits to the bag on **Add to bag**.
- After Monzo redirect, the confirmation banner shows; the bag is *not* auto-cleared (payment via Monzo link is async). It persists until the user clears it or starts a new order. If a Monzo webhook/return URL is added later, auto-clear can move there.

### Route-level transition

The slide between customizer ↔ review lives *inside* `routes/index.tsx`, not at the router level — both screens share `/` and differ only by `?screen=`. The router-managed `/` ↔ `/shop` transitions are plain TanStack route changes, no shared-element animation between them.

### Implementation order (preview for the plan stage)

1. Lift data (`casings.ts`, `shades.ts`, `scents.ts`, `products.ts`) and motion lib.
2. Add Framer Motion dependency; wire `lib/motion.ts`.
3. Bag context + `useBag` hook + localStorage persistence.
4. Extract `TubePreview` with sleeve label + halo motion + `layoutId`.
5. Build `CustomizerScreen` + sub-components.
6. Build `MiniBagPanel`.
7. Build `ReviewScreen` with shared `layoutId` tube morph.
8. Rebuild `Nav` (slim, bag indicator) and `Footer` (real socials).
9. `SocialStrip` fixed right-edge component.
10. New `/shop` route + `ProductTile`.
11. Delete old `GlossCustomizer.tsx`, lookbook assets, `use-scroll-reveal.ts` hook.

## Out of scope

- Buyer email/address capture (no form on screen 2).
- Real product images for additional casings (placeholders only).
- A confirmed-payment success route (deferred until Monzo webhook is wired).
- A second real product beyond Lipgloss (catalog tile + coming-soon affordance only).
- Email/SMS notify-me capture (the "Notify me" link defers to IG/TikTok follow).
