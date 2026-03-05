// app/lojas/havana/components/burguer-builder.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * ✅ Builder (Hamburgueria) — layout no padrão do PizzaBuilder
 * ✅ Ajuste pedido: OBSERVAÇÃO em UMA única área (sempre visível) — sem “Adicionar observação” em outra “tela”.
 *
 * Regras:
 * - Grupos com maxTotal (ex: até 6 itens no total)
 * - Itens com maxEach (ex: máx 6 por item)
 * - Cálculo de subtotal = base + adicionais
 * - LocalStorage por item-base
 */

export type BurgerBaseItem = {
  id: string;
  title: string;
  priceNum: number;
  img?: string;
  subtitle?: string;
};

export type AddonItem = {
  id: string;
  name: string;
  priceNum: number;
  maxEach?: number; // ex: 6
};

export type AddonGroup = {
  id: string;
  title: string;
  subtitle?: string;
  maxTotal: number; // ex: 6 (total do grupo)
  items: AddonItem[];
};

export type ConfirmPayload = {
  id: string;
  name: string;
  price: number;
  image?: string;
  meta: {
    baseId: string;
    addons: Array<{ id: string; name: string; qty: number; unitPrice: number }>;
    obs?: string;
  };
};

const BRAND = "#011b3c";
const AQUA = "#4fdcff";

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

function brlNum(n: number) {
  return `R$ ${n.toFixed(2).replace(".", ",")}`;
}

function Icon({
  name,
  className,
  style,
}: {
  name: "x" | "lock" | "minus" | "plus" | "search";
  className?: string;
  style?: React.CSSProperties;
}) {
  const common = cn("inline-block", className);

  if (name === "x")
    return (
      <svg className={common} style={style} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );

  if (name === "lock")
    return (
      <svg className={common} style={style} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M7.5 11V8.7a4.5 4.5 0 0 1 9 0V11"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M6.5 11h11a1.8 1.8 0 0 1 1.8 1.8v6.9A1.8 1.8 0 0 1 17.5 21h-11A1.8 1.8 0 0 1 4.7 19.7v-6.9A1.8 1.8 0 0 1 6.5 11Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      </svg>
    );

  if (name === "minus")
    return (
      <svg className={common} style={style} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 12h12" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    );

  if (name === "search")
    return (
      <svg className={common} style={style} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );

  return (
    <svg className={common} style={style} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

type Draft = {
  qtyById: Record<string, number>;
  obs: string;
  q: string;
  updatedAt: number;
};

function safeParseDraft(raw: string | null): Draft | null {
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw) as Partial<Draft>;
    if (!obj || typeof obj !== "object") return null;

    const qtyById =
      obj.qtyById && typeof obj.qtyById === "object"
        ? Object.fromEntries(
            Object.entries(obj.qtyById as Record<string, unknown>)
              .filter(([, v]) => typeof v === "number" && Number.isFinite(v as number))
              .map(([k, v]) => [k, Math.max(0, Math.floor(v as number))])
          )
        : {};

    const obs = typeof obj.obs === "string" ? obj.obs : "";
    const q = typeof obj.q === "string" ? obj.q : "";
    const updatedAt = typeof obj.updatedAt === "number" ? obj.updatedAt : Date.now();

    return { qtyById, obs, q, updatedAt };
  } catch {
    return null;
  }
}

function norm(s: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export default function BurgerBuilder({
  open,
  baseItem,
  groups,
  onClose,
  onConfirm,
}: {
  open: boolean;
  baseItem: BurgerBaseItem | null;
  groups: AddonGroup[];
  onClose: () => void;
  onConfirm: (payload: ConfirmPayload) => void;
}) {
  // ✅ Hooks sempre no topo
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const [qtyById, setQtyById] = useState<Record<string, number>>({});
  const [obs, setObs] = useState("");
  const [q, setQ] = useState("");

  // localStorage por baseItem
  const draftKey = useMemo(() => {
    if (!baseItem?.id) return null;
    return `valefood_havana_burger_draft_${baseItem.id}`;
  }, [baseItem?.id]);

  // lock scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // load draft
  useEffect(() => {
    if (!open) return;
    if (!draftKey) return;

    const d = safeParseDraft(localStorage.getItem(draftKey));
    if (d) {
      setQtyById(d.qtyById);
      setObs(d.obs);
      setQ(d.q);
    } else {
      setQtyById({});
      setObs("");
      setQ("");
    }
  }, [open, draftKey]);

  // persist draft
  useEffect(() => {
    if (!open) return;
    if (!draftKey) return;

    const d: Draft = { qtyById, obs, q, updatedAt: Date.now() };
    localStorage.setItem(draftKey, JSON.stringify(d));
  }, [open, draftKey, qtyById, obs, q]);

  const basePrice = baseItem?.priceNum ?? 0;

  const flatItems = useMemo(() => {
    const out: Array<AddonItem & { groupId: string; groupTitle: string; groupMaxTotal: number }> = [];
    for (const g of groups) {
      for (const it of g.items) {
        out.push({ ...it, groupId: g.id, groupTitle: g.title, groupMaxTotal: g.maxTotal });
      }
    }
    return out;
  }, [groups]);

  const qtyTotalByGroup = useMemo(() => {
    const map: Record<string, number> = {};
    for (const g of groups) map[g.id] = 0;
    for (const it of flatItems) {
      const q = qtyById[it.id] ?? 0;
      map[it.groupId] = (map[it.groupId] ?? 0) + q;
    }
    return map;
  }, [qtyById, flatItems, groups]);

  const addonsPrice = useMemo(() => {
    let sum = 0;
    for (const it of flatItems) {
      const q = qtyById[it.id] ?? 0;
      if (q > 0) sum += q * it.priceNum;
    }
    return sum;
  }, [qtyById, flatItems]);

  const total = useMemo(() => basePrice + addonsPrice, [basePrice, addonsPrice]);

  const filteredGroups = useMemo(() => {
    const nq = norm(q);
    if (!nq) return groups;
    return groups.map((g) => ({
      ...g,
      items: g.items.filter((it) => norm(it.name).includes(nq)),
    }));
  }, [groups, q]);

  function inc(item: AddonItem, group: AddonGroup) {
    setQtyById((prev) => {
      const curr = prev[item.id] ?? 0;
      const maxEach = typeof item.maxEach === "number" ? item.maxEach : 99;

      const groupTotal = qtyTotalByGroup[group.id] ?? 0;
      if (groupTotal >= group.maxTotal) return prev;
      if (curr >= maxEach) return prev;

      return { ...prev, [item.id]: curr + 1 };
    });
  }

  function dec(item: AddonItem) {
    setQtyById((prev) => {
      const curr = prev[item.id] ?? 0;
      if (curr <= 0) return prev;
      const next = { ...prev, [item.id]: curr - 1 };
      if (next[item.id] <= 0) delete next[item.id];
      return next;
    });
  }

  const hasAnyAddon = useMemo(() => Object.values(qtyById).some((v) => v > 0), [qtyById]);

  function confirm() {
    if (!baseItem) return;

    const addons: Array<{ id: string; name: string; qty: number; unitPrice: number }> = [];
    for (const it of flatItems) {
      const q = qtyById[it.id] ?? 0;
      if (q > 0) addons.push({ id: it.id, name: it.name, qty: q, unitPrice: it.priceNum });
    }

    const payload: ConfirmPayload = {
      id: `burger_${baseItem.id}_${Date.now()}`,
      name: baseItem.title,
      price: total,
      image: baseItem.img,
      meta: {
        baseId: baseItem.id,
        addons,
        obs: obs.trim() ? obs.trim() : undefined,
      },
    };

    onConfirm(payload);

    if (draftKey) localStorage.removeItem(draftKey);
    setQtyById({});
    setObs("");
    setQ("");
  }

  // ✅ render condicional só aqui
  if (!open || !baseItem) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      <button
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.35)", WebkitTapHighlightColor: "transparent" }}
      />

      <div
        ref={sheetRef}
        className="absolute left-0 right-0 bottom-0 z-[201]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto w-full max-w-[600px] px-3 pb-3">
          <div
            className="overflow-hidden rounded-[34px] border"
            style={{
              borderColor: "rgba(1,27,60,0.12)",
              background: "rgba(255,255,255,0.86)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              boxShadow: "0 26px 70px rgba(0,0,0,0.16)",
            }}
          >
            <div className="pt-3">
              <div className="mx-auto h-[5px] w-[72px] rounded-full" style={{ background: "rgba(1,27,60,0.10)" }} />
            </div>

            {/* HEADER */}
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className="grid place-items-center overflow-hidden rounded-2xl"
                    style={{
                      width: 44,
                      height: 44,
                      background: "rgba(1,27,60,0.06)",
                      border: "1px solid rgba(1,27,60,0.10)",
                    }}
                  >
                    {baseItem.img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={baseItem.img} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Icon name="lock" className="h-6 w-6" style={{ color: AQUA }} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="text-[20px] font-extrabold tracking-[-0.02em]" style={{ color: BRAND }}>
                      {baseItem.title}
                    </div>

                    {baseItem.subtitle ? (
                      <div className="mt-0.5 text-[14px] font-semibold" style={{ color: "rgba(1,27,60,0.55)" }}>
                        {baseItem.subtitle}
                      </div>
                    ) : (
                      <div className="mt-0.5 text-[14px] font-semibold" style={{ color: "rgba(1,27,60,0.55)" }}>
                        Monte do seu jeito
                      </div>
                    )}

                    <div className="mt-1 text-[12px] font-bold" style={{ color: "rgba(1,27,60,0.55)" }}>
                      base {brlNum(basePrice)} • adicionais {brlNum(addonsPrice)} • total {brlNum(total)}
                    </div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="grid place-items-center rounded-2xl"
                  style={{
                    width: 44,
                    height: 44,
                    background: "rgba(255,255,255,0.88)",
                    border: "1px solid rgba(1,27,60,0.10)",
                    WebkitTapHighlightColor: "transparent",
                  }}
                  aria-label="Fechar"
                >
                  <Icon name="x" className="h-6 w-6" style={{ color: AQUA }} />
                </button>
              </div>

              {/* SEARCH */}
              <div className="mt-4">
                <div
                  className="flex items-center gap-2 rounded-2xl border px-4 py-3"
                  style={{
                    borderColor: "rgba(1,27,60,0.12)",
                    background: "rgba(255,255,255,0.92)",
                  }}
                >
                  <Icon name="search" className="h-5 w-5" style={{ color: "rgba(1,27,60,0.55)" }} />
                  <input
                    ref={searchRef}
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Pesquise pelo nome"
                    className="w-full bg-transparent text-[16px] font-semibold outline-none placeholder:text-gray-400"
                    style={{ color: "rgba(1,27,60,0.88)", WebkitTextFillColor: "rgba(1,27,60,0.88)" }}
                  />
                  {!!q && (
                    <button
                      onClick={() => setQ("")}
                      className="rounded-xl px-3 py-2 text-[14px] font-extrabold"
                      style={{ color: BRAND }}
                    >
                      Limpar
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* BODY */}
            <div className="px-4 pb-4">
              <div className="max-h-[52vh] overflow-auto pr-[2px]">
                <div className="space-y-4">
                  {filteredGroups.map((g) => {
                    const groupTotal = qtyTotalByGroup[g.id] ?? 0;

                    return (
                      <div key={g.id}>
                        {/* group header */}
                        <div
                          className="rounded-[22px] border px-4 py-4"
                          style={{
                            borderColor: "rgba(1,27,60,0.10)",
                            background: "rgba(255,255,255,0.78)",
                            boxShadow: "0 16px 32px rgba(0,0,0,0.06)",
                          }}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-[18px] font-extrabold tracking-[-0.02em]" style={{ color: BRAND }}>
                                {g.title}
                              </div>
                              <div className="mt-0.5 text-[13px] font-semibold" style={{ color: "rgba(1,27,60,0.55)" }}>
                                {g.subtitle ?? `Escolha até ${g.maxTotal} itens`}
                              </div>
                            </div>

                            <div
                              className="shrink-0 rounded-2xl px-3 py-2 text-[12px] font-extrabold"
                              style={{
                                background: "rgba(79,220,255,0.16)",
                                border: "1px solid rgba(79,220,255,0.35)",
                                color: "rgba(1,27,60,0.80)",
                              }}
                            >
                              {groupTotal}/{g.maxTotal}
                            </div>
                          </div>
                        </div>

                        {/* group items */}
                        <div className="mt-3 space-y-3">
                          {g.items.map((it) => {
                            const qty = qtyById[it.id] ?? 0;
                            const maxEach = typeof it.maxEach === "number" ? it.maxEach : 99;

                            const groupTotalNow = qtyTotalByGroup[g.id] ?? 0;
                            const canAdd = qty < maxEach && groupTotalNow < g.maxTotal;
                            const canRemove = qty > 0;

                            return (
                              <div
                                key={it.id}
                                className="rounded-[22px] border px-4 py-3"
                                style={{
                                  borderColor: "rgba(1,27,60,0.10)",
                                  background: "rgba(255,255,255,0.78)",
                                  boxShadow: "0 16px 32px rgba(0,0,0,0.06)",
                                }}
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div className="min-w-0">
                                    <div className="truncate text-[18px] font-extrabold tracking-[-0.02em]" style={{ color: BRAND }}>
                                      {it.name}
                                    </div>

                                    <div className="mt-0.5 flex items-center gap-2 text-[13px] font-semibold" style={{ color: "rgba(1,27,60,0.55)" }}>
                                      <span>{brlNum(it.priceNum)}</span>
                                      <span>•</span>
                                      <span>Máx {maxEach}</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <button
                                      onClick={() => dec(it)}
                                      disabled={!canRemove}
                                      className="grid place-items-center rounded-2xl"
                                      style={{
                                        width: 44,
                                        height: 44,
                                        background: "rgba(255,255,255,0.80)",
                                        border: "1px solid rgba(1,27,60,0.10)",
                                        opacity: canRemove ? 1 : 0.45,
                                        WebkitTapHighlightColor: "transparent",
                                      }}
                                      aria-label={`Remover ${it.name}`}
                                    >
                                      <Icon name="minus" className="h-5 w-5" style={{ color: AQUA }} />
                                    </button>

                                    <div className="w-6 text-center text-[16px] font-extrabold" style={{ color: BRAND }}>
                                      {qty}
                                    </div>

                                    <button
                                      onClick={() => inc(it, g)}
                                      disabled={!canAdd}
                                      className="grid place-items-center rounded-2xl"
                                      style={{
                                        width: 44,
                                        height: 44,
                                        background: "rgba(79,220,255,0.18)",
                                        border: "1px solid rgba(79,220,255,0.45)",
                                        opacity: canAdd ? 1 : 0.45,
                                        WebkitTapHighlightColor: "transparent",
                                      }}
                                      aria-label={`Adicionar ${it.name}`}
                                    >
                                      <Icon name="plus" className="h-5 w-5" style={{ color: AQUA }} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {!g.items.length && (
                            <div
                              className="rounded-[22px] border px-4 py-4 text-[14px] font-semibold"
                              style={{ borderColor: "rgba(1,27,60,0.10)", color: "rgba(1,27,60,0.55)" }}
                            >
                              Nenhum adicional encontrado.
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* ✅ OBSERVAÇÃO — sempre em uma única área (como sua imagem 2) */}
                  <div
                    className="rounded-[26px] border px-4 py-4"
                    style={{
                      borderColor: "rgba(1,27,60,0.10)",
                      background: "rgba(255,255,255,0.78)",
                      boxShadow: "0 16px 32px rgba(0,0,0,0.06)",
                    }}
                  >
                    <div className="text-[16px] font-extrabold" style={{ color: "rgba(1,27,60,0.75)" }}>
                      Observação
                    </div>

                    <textarea
                      value={obs}
                      onChange={(e) => setObs(e.target.value)}
                      placeholder="Ex: sem cebola, ponto da carne, tirar pimenta..."
                      className="mt-3 w-full resize-none rounded-2xl border px-4 py-3 text-[16px] font-semibold outline-none"
                      style={{
                        height: 140,
                        borderColor: "rgba(1,27,60,0.12)",
                        background: "rgba(255,255,255,0.92)",
                        color: "rgba(1,27,60,0.88)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div
              className="border-t px-4 pt-4 pb-4"
              style={{
                borderColor: "rgba(1,27,60,0.10)",
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold" style={{ color: "rgba(1,27,60,0.55)" }}>
                    Subtotal
                  </div>
                  <div className="truncate text-[18px] font-extrabold" style={{ color: BRAND }}>
                    {brlNum(total)}
                  </div>
                </div>

                <button
                  onClick={confirm}
                  className="w-[62%] rounded-[22px] px-5 py-4 text-[16px] font-extrabold transition active:scale-[0.99]"
                  style={{
                    background: `linear-gradient(180deg, rgba(79,220,255,0.85) 0%, rgba(79,220,255,0.55) 100%)`,
                    color: "rgba(1,27,60,0.92)",
                    border: "1px solid rgba(79,220,255,0.55)",
                    boxShadow: "0 18px 40px rgba(79,220,255,0.18)",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  Adicionar ao carrinho
                </button>
              </div>

              {!hasAnyAddon && (
                <div className="mt-2 text-[12px] font-semibold" style={{ color: "rgba(1,27,60,0.55)" }}>
                  Você pode turbinar seu lanche com adicionais (opcional).
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}