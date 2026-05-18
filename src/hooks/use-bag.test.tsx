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
