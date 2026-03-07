"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type DeliveryType = "entrega" | "retirada";

export type CartItem = {
  id: string;
  name: string;
  price: number; // em reais (ex: 39.9)
  qty: number;
  image?: string;
  meta?: {
    tamanhoId?: "pequena" | "grande" | "familia";
    mode?: "salgada" | "doce";
    sabores?: string[];
    premium?: boolean;
    borda?: string;
    obs?: string;
  };
};

export type CartState = {
  storeId: string | null; // opcional (pra bloquear misturar lojas depois)
  items: CartItem[];
  deliveryType: DeliveryType;
  note: string;
};

export type CartApi = {
  state: CartState;

  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;

  itemsCount: number;
  subtotal: number;

  setStoreId: (id: string | null) => void;
  setDeliveryType: (t: DeliveryType) => void;
  setNote: (v: string) => void;

  addItem: (
    item: {
      id: string;
      name: string;
      price: number;
      image?: string;
      storeId?: string | null;
      meta?: {
        tamanhoId?: "pequena" | "grande" | "familia";
        mode?: "salgada" | "doce";
        sabores?: string[];
        premium?: boolean;
        borda?: string;
        obs?: string;
      };
    },
    opts?: { qty?: number }
  ) => void;
  decItem: (id: string) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "valefood_cart_v1";

const defaultState: CartState = {
  storeId: null,
  items: [],
  deliveryType: "entrega",
  note: "",
};

const CartCtx = createContext<CartApi | null>(null);

function clampInt(n: number, min: number, max: number) {
  const x = Math.floor(Number.isFinite(n) ? n : 0);
  return Math.max(min, Math.min(max, x));
}

function money2(n: number) {
  const x = Number.isFinite(n) ? n : 0;
  return Math.round(x * 100) / 100;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CartState>(defaultState);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // load localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<CartState>;
        if (parsed && typeof parsed === "object" && Array.isArray(parsed.items)) {
          setState({
            storeId: parsed.storeId ?? null,
            items: (parsed.items || []).map((it: any) => ({
              id: String(it.id),
              name: String(it.name || ""),
              price: money2(Number(it.price) || 0),
              qty: clampInt(Number(it.qty) || 0, 0, 999),
              image: it.image ? String(it.image) : undefined,
              meta:
                it.meta && typeof it.meta === "object"
                  ? {
                      tamanhoId:
                        it.meta.tamanhoId === "pequena" ||
                        it.meta.tamanhoId === "grande" ||
                        it.meta.tamanhoId === "familia"
                          ? it.meta.tamanhoId
                          : undefined,
                      mode:
                        it.meta.mode === "doce"
                          ? "doce"
                          : it.meta.mode === "salgada"
                            ? "salgada"
                            : undefined,
                      sabores: Array.isArray(it.meta.sabores)
                        ? it.meta.sabores.filter((x: unknown) => typeof x === "string")
                        : undefined,
                      premium: !!it.meta.premium,
                      borda: typeof it.meta.borda === "string" ? it.meta.borda : undefined,
                      obs: typeof it.meta.obs === "string" ? it.meta.obs : undefined,
                    }
                  : undefined,
            })),
            deliveryType: parsed.deliveryType === "retirada" ? "retirada" : "entrega",
            note: String(parsed.note || ""),
          });
        }
      }
    } catch {}
    setHydrated(true);
  }, []);

  // save localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state, hydrated]);

  const itemsCount = useMemo(
    () => state.items.reduce((acc, it) => acc + (Number.isFinite(it.qty) ? it.qty : 0), 0),
    [state.items]
  );

  const subtotal = useMemo(
    () => money2(state.items.reduce((acc, it) => acc + money2(it.price) * clampInt(it.qty, 0, 999), 0)),
    [state.items]
  );

  const api: CartApi = useMemo(
    () => ({
      state,

      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((v) => !v),

      itemsCount,
      subtotal,

      setStoreId: (id) => setState((s) => ({ ...s, storeId: id })),
      setDeliveryType: (t) => setState((s) => ({ ...s, deliveryType: t })),
      setNote: (v) => setState((s) => ({ ...s, note: v })),

      addItem: (item, opts) => {
        const addQty = clampInt(opts?.qty ?? 1, 1, 999);

        setState((s) => {
          const incomingStoreId = item.storeId ?? null;

          // trava mistura de lojas
          if (s.storeId && incomingStoreId && s.storeId !== incomingStoreId) {
            return s;
          }

          const nextStoreId = s.storeId ?? incomingStoreId;

          const idx = s.items.findIndex((x) => x.id === item.id);
          if (idx >= 0) {
            const next = [...s.items];
            const cur = next[idx];
            next[idx] = {
              ...cur,
              qty: clampInt(cur.qty + addQty, 1, 999),
              meta: item.meta ?? cur.meta,
            };
            return { ...s, storeId: nextStoreId, items: next };
          }

          return {
            ...s,
            storeId: nextStoreId,
            items: [
              ...s.items,
              {
                id: item.id,
                name: item.name,
                price: money2(item.price),
                qty: addQty,
                image: item.image,
                meta: item.meta,
              },
            ],
          };
        });
      },

      decItem: (id) => {
        setState((s) => {
          const idx = s.items.findIndex((x) => x.id === id);
          if (idx < 0) return s;

          const next = [...s.items];
          const cur = next[idx];
          const q = clampInt(cur.qty - 1, 0, 999);

          if (q <= 0) next.splice(idx, 1);
          else next[idx] = { ...cur, qty: q };

          return { ...s, items: next, storeId: next.length ? s.storeId : null };
        });
      },

      removeItem: (id) => {
        setState((s) => {
          const next = s.items.filter((x) => x.id !== id);
          return { ...s, items: next, storeId: next.length ? s.storeId : null };
        });
      },

      clear: () => setState(defaultState),
    }),
    [state, isOpen, itemsCount, subtotal]
  );

  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function brl(v: number) {
  const n = Number.isFinite(v) ? v : 0;
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}