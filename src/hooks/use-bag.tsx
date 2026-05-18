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
