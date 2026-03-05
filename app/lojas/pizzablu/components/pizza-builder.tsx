"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * ✅ Regras implementadas (ATUALIZADO):
 * - Pequena: até 2 sabores | Grande/Família: até 4 sabores
 * - Premium: +12 (apenas 1x se tiver 1 ou mais premium)
 * - Borda: +16 (apenas 1 borda por pizza), inclui opção "Sem borda"
 * - Borda é uma etapa obrigatória APÓS completar a escolha de sabores (step)
 * - LocalStorage ÚNICO por tamanho (doce/salgada NÃO divide e NÃO zera)
 * - Abas (Salgadas/Doces) são só organização: seleção é única (não sobrescreve)
 * - Premium aparece nos itens premium (badge +R$ 12,00)
 * - Sem erro de hooks (    nenhum hook depois de return condicional)
 */

type Mode = "salgada" | "doce";
type Step = "sabores" | "borda";

export type PizzaBaseItem = {
  id: "pizza_pequena" | "pizza_grande" | "pizza_familia";
  title: string;
  priceNum: number;
  img?: string;
};

type ConfirmPayload = {
  id: string;
  name: string;
  price: number;
  image?: string;
  meta: {
    tamanhoId: "pequena" | "grande" | "familia";
    mode: Mode; // (mantido) só pra referência; seleção NÃO depende disso
    sabores: string[];
    premium: boolean;
    borda: string; // "Sem borda" ou nome
    obs?: string;
  };
};

const BRAND = "#011b3c";
const AQUA = "#4fdcff";

const ADICIONAL_PREMIUM = 12;
const PRECO_BORDA = 16;

// ✅ Bordas do cardápio
const BORDAS = [
  "Dois amores",
  "Chocolate branco",
  "Chocolate preto",
  "Nozes com chocolate branco",
  "Milho com bacon",
  "Requeijão cremoso",
  "Cheddar",
  "Cream cheese",
];

// ✅ Salgadas tradicionais
const SALGADAS_TRAD = [
  "Calabresa",
  "4 queijos",
  "Frango com requeijão",
  "Mussarela",
  "Marguerita",
  "Milho",
  "Alho e óleo",
  "Bacon",
  "Alho poró",
  "Lombo",
  "Peito de peru",
  "Brócolis com bacon",
  "Portuguesa",
  "Tomate seco com rúcula",
  "Purê de batata com bacon",
  "Siciliana",
  "Brócolis",
  "Milho com bacon",
  "Vegetariana",
  "Capriccosa",
  "Diavola",
  "Pomodoro",
];

// ✅ Salgadas premium
const SALGADAS_PREMIUM = [
  "Moda da casa",
  "Chicken pesto",
  "Estrogonofe de gado",
  "Estrogonofe de frango",
  "Banana crunch",
  "Proscuitto",
  "Filé com figos",
  "5 queijos",
  "Fish fries",
  "Picanha ao molho de cerveja preta",
  "Filé dueto",
  "Filé com fritas",
  "Ragú de costela",
  "Frango caipira",
  "Lombo com abacaxi",
  "Coração",
  "Mexicana",
  "Cogumelos ao molho fungi",
  "Pânceta",
  "Bolonhesa",
  "Purê de abobora com costela",
  "Filé com doritos",
];

// ✅ Doces tradicionais
const DOCES_TRAD = [
  "2 amores",
  "Sensação branca",
  "Sensação preta",
  "Beijinho",
  "Prestigio",
  "Chocolate branco",
  "Chocolate preto",
  "Brigadeiro",
  "Charge",
];

// ✅ Doces premium
const DOCES_PREMIUM = [
  "Tiramisu",
  "3 chocolates",
  "Nozes",
  "Ouro branco",
  "Confete m&m",
  "2 amores especial",
  "Banana dulce crocante",
  "Kinder bueno",
  "Dueto de uvas",
  "Floresta negra",
];

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
  name: "x" | "lock" | "minus" | "plus";
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

  return (
    <svg className={common} style={style} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

type Draft = {
  sabores: string[]; // ✅ único (não separa doce/salgada)
  borda: string; // "Sem borda" ou nome
  obs: string;
  step: Step;
  updatedAt: number;
};

function safeParseDraft(raw: string | null): Draft | null {
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw) as Partial<Draft>;
    if (!obj || typeof obj !== "object") return null;

    const sabores = Array.isArray(obj.sabores) ? obj.sabores.filter((x) => typeof x === "string") : [];
    const borda = typeof obj.borda === "string" ? obj.borda : "Sem borda";
    const obs = typeof obj.obs === "string" ? obj.obs : "";
    const step: Step = obj.step === "borda" ? "borda" : "sabores";
    const updatedAt = typeof obj.updatedAt === "number" ? obj.updatedAt : Date.now();

    return { sabores, borda, obs, step, updatedAt };
  } catch {
    return null;
  }
}

export default function PizzaBuilder({
  open,
  baseItem,
  onClose,
  onConfirm,
}: {
  open: boolean;
  baseItem: PizzaBaseItem | null;
  onClose: () => void;
  onConfirm: (payload: ConfirmPayload) => void;
}) {
  // ✅ Hooks SEMPRE no topo (pra não dar erro de ordem)
  const sheetRef = useRef<HTMLDivElement | null>(null);

  const [mode, setMode] = useState<Mode>("salgada");
  const [step, setStep] = useState<Step>("sabores");

  const [sabores, setSabores] = useState<string[]>([]);
  const [borda, setBorda] = useState<string>("Sem borda");
  const [obs, setObs] = useState<string>("");

  const tamanhoId = useMemo(() => {
    if (!baseItem) return null;
    if (baseItem.id === "pizza_pequena") return "pequena" as const;
    if (baseItem.id === "pizza_grande") return "grande" as const;
    if (baseItem.id === "pizza_familia") return "familia" as const;
    return null;
  }, [baseItem]);

  const maxSabores = useMemo(() => {
    if (!tamanhoId) return 4;
    if (tamanhoId === "pequena") return 2;
    return 4;
  }, [tamanhoId]);

  // ✅ Premium global (não depende da aba)
  const premiumSet = useMemo(() => {
    return new Set<string>([...SALGADAS_PREMIUM, ...DOCES_PREMIUM]);
  }, []);

  const isPremiumFlavor = useMemo(() => {
    return (name: string) => premiumSet.has(name);
  }, [premiumSet]);

  // ✅ Listas por aba (apenas filtro visual)
  const listTrad = useMemo(() => (mode === "salgada" ? SALGADAS_TRAD : DOCES_TRAD), [mode]);
  const listPremium = useMemo(() => (mode === "salgada" ? SALGADAS_PREMIUM : DOCES_PREMIUM), [mode]);

  const allFlavors = useMemo(() => {
    return [
      ...listTrad.map((name) => ({ name, premium: false as const, tag: "Tradicional" as const })),
      ...listPremium.map((name) => ({ name, premium: true as const, tag: "Premium" as const })),
    ];
  }, [listTrad, listPremium]);

  const hasPremium = useMemo(() => sabores.some((s) => premiumSet.has(s)), [sabores, premiumSet]);

  // ✅ LocalStorage ÚNICO por tamanho (não divide por aba)
  const draftKey = useMemo(() => {
    if (!tamanhoId) return null;
    return `valefood_pizzablu_pizza_draft_${tamanhoId}`;
  }, [tamanhoId]);

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

  // load draft (ao abrir e ao trocar tamanho)
  useEffect(() => {
    if (!open) return;
    if (!draftKey) return;

    const d = safeParseDraft(localStorage.getItem(draftKey));
    if (d) {
      setSabores(d.sabores);
      setBorda(d.borda);
      setObs(d.obs);
      setStep(d.step);
    } else {
      setSabores([]);
      setBorda("Sem borda");
      setObs("");
      setStep("sabores");
    }
  }, [open, draftKey]);

  // persist draft
  useEffect(() => {
    if (!open) return;
    if (!draftKey) return;

    const d: Draft = { sabores, borda, obs, step, updatedAt: Date.now() };
    localStorage.setItem(draftKey, JSON.stringify(d));
  }, [open, draftKey, sabores, borda, obs, step]);

  const basePrice = baseItem?.priceNum ?? 0;

  const bordaAdd = useMemo(() => (borda && borda !== "Sem borda" ? PRECO_BORDA : 0), [borda]);

  const total = useMemo(() => {
    const premiumAdd = hasPremium ? ADICIONAL_PREMIUM : 0;
    return basePrice + premiumAdd + bordaAdd;
  }, [basePrice, hasPremium, bordaAdd]);

  // ✅ agora é “após escolher os sabores” = completar (2/2 ou 4/4)
  const canGoBorda = sabores.length === maxSabores;
  const canConfirm = !!baseItem && !!tamanhoId && sabores.length === maxSabores;

  const bordaOptions = useMemo(() => ["Sem borda", ...BORDAS], []);

  function addFlavor(name: string) {
    setSabores((prev) => {
      if (prev.includes(name)) return prev;
      if (prev.length >= maxSabores) return prev;
      return [...prev, name];
    });
  }

  function removeFlavor(name: string) {
    setSabores((prev) => prev.filter((x) => x !== name));
  }

  function confirm() {
    if (!baseItem || !tamanhoId) return;

    const name = baseItem.title;

    const payload: ConfirmPayload = {
      id: `pizza_${tamanhoId}_${Date.now()}`,
      name,
      price: total,
      image: baseItem.img,
      meta: {
        tamanhoId,
        mode, // só referência (aba atual)
        sabores,
        premium: hasPremium,
        borda: borda || "Sem borda",
        obs: obs.trim() ? obs.trim() : undefined,
      },
    };

    onConfirm(payload);

    if (draftKey) localStorage.removeItem(draftKey);

    setStep("sabores");
    setSabores([]);
    setBorda("Sem borda");
    setObs("");
  }

  // ✅ Render condicional só aqui, depois de todos hooks
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
                    className="grid place-items-center rounded-2xl"
                    style={{
                      width: 44,
                      height: 44,
                      background: "rgba(1,27,60,0.06)",
                      border: "1px solid rgba(1,27,60,0.10)",
                    }}
                  >
                    <Icon name="lock" className="h-6 w-6" style={{ color: AQUA }} />
                  </div>

                  <div className="min-w-0">
                    <div className="text-[20px] font-extrabold tracking-[-0.02em]" style={{ color: BRAND }}>
                      Montar sua pizza
                    </div>
                    <div className="mt-0.5 text-[14px] font-semibold" style={{ color: "rgba(1,27,60,0.55)" }}>
                      {baseItem.title} • {maxSabores} sabores máx.
                    </div>

                    <div className="mt-1 text-[12px] font-bold" style={{ color: "rgba(1,27,60,0.55)" }}>
                      {sabores.length}/{maxSabores} •{" "}
                      {hasPremium ? `premium +${brlNum(ADICIONAL_PREMIUM)}` : "sem premium"} •{" "}
                      {borda !== "Sem borda" ? `borda +${brlNum(PRECO_BORDA)}` : "sem borda"}
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

              {/* DOCE / SALGADA */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMode("salgada")}
                  className="rounded-2xl px-4 py-3 text-[14px] font-extrabold"
                  style={{
                    background: mode === "salgada" ? "rgba(79,220,255,0.20)" : "rgba(255,255,255,0.70)",
                    border: `1px solid ${mode === "salgada" ? "rgba(79,220,255,0.55)" : "rgba(1,27,60,0.10)"}`,
                    color: BRAND,
                    boxShadow: mode === "salgada" ? "0 12px 26px rgba(79,220,255,0.18)" : "none",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  Salgadas
                </button>

                <button
                  onClick={() => setMode("doce")}
                  className="rounded-2xl px-4 py-3 text-[14px] font-extrabold"
                  style={{
                    background: mode === "doce" ? "rgba(79,220,255,0.20)" : "rgba(255,255,255,0.70)",
                    border: `1px solid ${mode === "doce" ? "rgba(79,220,255,0.55)" : "rgba(1,27,60,0.10)"}`,
                    color: BRAND,
                    boxShadow: mode === "doce" ? "0 12px 26px rgba(79,220,255,0.18)" : "none",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  Doces
                </button>
              </div>
            </div>

            {/* BODY */}
            <div className="px-4 pb-4">
              <div className="max-h-[52vh] overflow-auto pr-[2px]">
                {/* STEP SABORES */}
                {step === "sabores" && (
                  <div className="mt-1">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-[13px] font-extrabold" style={{ color: "rgba(1,27,60,0.70)" }}>
                        Sabores ({sabores.length}/{maxSabores})
                      </div>
                      <div className="text-[12px] font-bold" style={{ color: "rgba(1,27,60,0.55)" }}>
                        premium +{brlNum(ADICIONAL_PREMIUM)} (1x)
                      </div>
                    </div>

                    <div className="space-y-3">
                      {allFlavors.map((f) => {
                        const selected = sabores.includes(f.name);
                        const canAdd = !selected && sabores.length < maxSabores;
                        const canRemove = selected;

                        return (
                          <div
                            key={`${f.tag}_${f.name}`}
                            className="rounded-[22px] border px-4 py-3"
                            style={{
                              borderColor: "rgba(1,27,60,0.10)",
                              background: "rgba(255,255,255,0.78)",
                              boxShadow: "0 16px 32px rgba(0,0,0,0.06)",
                            }}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <div
                                  className="truncate text-[18px] font-extrabold tracking-[-0.02em]"
                                  style={{ color: BRAND }}
                                >
                                  {f.name}
                                </div>

                                <div
                                  className="mt-0.5 flex items-center gap-2 text-[13px] font-semibold"
                                  style={{ color: "rgba(1,27,60,0.55)" }}
                                >
                                  <span>{f.tag}</span>

                                  {/* ✅ Premium aparece nos sabores premium */}
                                  {isPremiumFlavor(f.name) && (
                                    <span
                                      className="rounded-full px-2 py-[2px] text-[12px] font-extrabold"
                                      style={{
                                        background: "rgba(79,220,255,0.20)",
                                        border: "1px solid rgba(79,220,255,0.45)",
                                        color: BRAND,
                                      }}
                                    >
                                      premium +{brlNum(ADICIONAL_PREMIUM)}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => removeFlavor(f.name)}
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
                                  aria-label={`Remover ${f.name}`}
                                >
                                  <Icon name="minus" className="h-5 w-5" style={{ color: AQUA }} />
                                </button>

                                <div className="w-4 text-center text-[16px] font-extrabold" style={{ color: BRAND }}>
                                  {selected ? 1 : 0}
                                </div>

                                <button
                                  onClick={() => addFlavor(f.name)}
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
                                  aria-label={`Adicionar ${f.name}`}
                                >
                                  <Icon name="plus" className="h-5 w-5" style={{ color: AQUA }} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={() => setStep("borda")}
                        disabled={!canGoBorda}
                        className="w-full rounded-[22px] px-5 py-4 text-[16px] font-extrabold transition active:scale-[0.99]"
                        style={{
                          background: canGoBorda
                            ? `linear-gradient(180deg, rgba(79,220,255,0.85) 0%, rgba(79,220,255,0.55) 100%)`
                            : "rgba(1,27,60,0.10)",
                          color: canGoBorda ? "rgba(1,27,60,0.92)" : "rgba(1,27,60,0.40)",
                          border: canGoBorda ? "1px solid rgba(79,220,255,0.55)" : "1px solid rgba(1,27,60,0.10)",
                          boxShadow: canGoBorda ? "0 18px 40px rgba(79,220,255,0.18)" : "none",
                          WebkitTapHighlightColor: "transparent",
                        }}
                      >
                        Continuar para bordas
                      </button>

                      {!canGoBorda && (
                        <div className="mt-2 text-[12px] font-semibold" style={{ color: "rgba(1,27,60,0.55)" }}>
                          Escolha {maxSabores - sabores.length} sabor(es) para continuar.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP BORDA */}
                {step === "borda" && (
                  <div className="mt-1">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-[13px] font-extrabold" style={{ color: "rgba(1,27,60,0.70)" }}>
                        Bordas recheadas (1 por pizza)
                      </div>
                      <div className="text-[12px] font-bold" style={{ color: "rgba(1,27,60,0.55)" }}>
                        +{brlNum(PRECO_BORDA)} (se escolher)
                      </div>
                    </div>

                    <div className="space-y-3">
                      {bordaOptions.map((b) => {
                        const selected = borda === b;
                        return (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setBorda(b)}
                            className="w-full text-left rounded-[22px] border px-4 py-3 transition active:scale-[0.99]"
                            style={{
                              borderColor: selected ? "rgba(79,220,255,0.65)" : "rgba(1,27,60,0.10)",
                              background: selected ? "rgba(79,220,255,0.14)" : "rgba(255,255,255,0.78)",
                              boxShadow: "0 16px 32px rgba(0,0,0,0.06)",
                              WebkitTapHighlightColor: "transparent",
                            }}
                            aria-label={`Selecionar ${b}`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <div
                                  className="truncate text-[18px] font-extrabold tracking-[-0.02em]"
                                  style={{ color: BRAND }}
                                >
                                  {b}
                                </div>
                                <div className="mt-0.5 text-[13px] font-semibold" style={{ color: "rgba(1,27,60,0.55)" }}>
                                  {b === "Sem borda" ? "Sem adicional" : `Adicional de ${brlNum(PRECO_BORDA)}`}
                                </div>
                              </div>

                              <div
                                className="grid place-items-center rounded-2xl"
                                style={{
                                  width: 44,
                                  height: 44,
                                  background: selected ? "rgba(79,220,255,0.18)" : "rgba(255,255,255,0.80)",
                                  border: selected ? "1px solid rgba(79,220,255,0.45)" : "1px solid rgba(1,27,60,0.10)",
                                }}
                              >
                                <div
                                  className="text-[14px] font-extrabold"
                                  style={{ color: selected ? "rgba(1,27,60,0.88)" : "rgba(1,27,60,0.40)" }}
                                >
                                  {selected ? "✓" : ""}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* OBS */}
                    <div className="mt-6">
                      <div
                        className="rounded-[26px] border px-4 py-4"
                        style={{
                          borderColor: "rgba(1,27,60,0.10)",
                          background: "rgba(255,255,255,0.78)",
                          boxShadow: "0 16px 32px rgba(0,0,0,0.06)",
                        }}
                      >
                        <div className="text-[14px] font-extrabold" style={{ color: "rgba(1,27,60,0.70)" }}>
                          Observação
                        </div>

                        <textarea
                          value={obs}
                          onChange={(e) => setObs(e.target.value)}
                          placeholder="Ex: sem cebola, cortar em quadrados..."
                          className="mt-3 w-full resize-none rounded-2xl border px-4 py-3 text-[16px] font-semibold outline-none"
                          style={{
                            height: 92,
                            borderColor: "rgba(1,27,60,0.12)",
                            background: "rgba(255,255,255,0.92)",
                            color: "rgba(1,27,60,0.88)",
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={() => setStep("sabores")}
                        className="w-full rounded-[22px] px-5 py-4 text-[15px] font-extrabold transition active:scale-[0.99]"
                        style={{
                          background: "rgba(255,255,255,0.75)",
                          color: "rgba(1,27,60,0.80)",
                          border: "1px solid rgba(1,27,60,0.10)",
                          WebkitTapHighlightColor: "transparent",
                        }}
                      >
                        Voltar para sabores
                      </button>
                    </div>
                  </div>
                )}
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
                  onClick={step === "sabores" ? () => setStep("borda") : confirm}
                  disabled={step === "sabores" ? !canGoBorda : !canConfirm}
                  className="w-[62%] rounded-[22px] px-5 py-4 text-[16px] font-extrabold transition active:scale-[0.99]"
                  style={{
                    background:
                      (step === "sabores" ? canGoBorda : canConfirm)
                        ? `linear-gradient(180deg, rgba(79,220,255,0.85) 0%, rgba(79,220,255,0.55) 100%)`
                        : "rgba(1,27,60,0.10)",
                    color:
                      (step === "sabores" ? canGoBorda : canConfirm) ? "rgba(1,27,60,0.92)" : "rgba(1,27,60,0.40)",
                    border:
                      (step === "sabores" ? canGoBorda : canConfirm)
                        ? "1px solid rgba(79,220,255,0.55)"
                        : "1px solid rgba(1,27,60,0.10)",
                    boxShadow:
                      (step === "sabores" ? canGoBorda : canConfirm) ? "0 18px 40px rgba(79,220,255,0.18)" : "none",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  {step === "sabores" ? "Continuar" : "Adicionar ao carrinho"}
                </button>
              </div>

              {step === "sabores" && !canGoBorda && (
                <div className="mt-2 text-[12px] font-semibold" style={{ color: "rgba(1,27,60,0.55)" }}>
                  Complete {maxSabores} sabor(es) para liberar as bordas.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}