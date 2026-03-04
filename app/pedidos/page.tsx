"use client";

import React, { useMemo, useState } from "react";

const BRAND = "#011b3c";
const AQUA = "#47c1e0";

type OrderStatus = "em_producao" | "a_caminho" | "entregue" | "cancelado";

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

function Badge({ s }: { s: OrderStatus }) {
  const map: Record<OrderStatus, { label: string; bg: string; fg: string }> = {
    em_producao: { label: "Em produção", bg: "rgba(71,193,224,0.16)", fg: BRAND },
    a_caminho: { label: "A caminho", bg: "rgba(245,158,11,0.16)", fg: "#92400e" },
    entregue: { label: "Entregue", bg: "rgba(34,197,94,0.16)", fg: "#065f46" },
    cancelado: { label: "Cancelado", bg: "rgba(239,68,68,0.16)", fg: "#991b1b" },
  };
  const v = map[s];
  return (
    <span className="rounded-full px-3 py-1 text-[12px] font-extrabold" style={{ background: v.bg, color: v.fg }}>
      {v.label}
    </span>
  );
}

function OrderCard({
  store,
  items,
  total,
  status,
  when,
}: {
  store: string;
  items: string;
  total: string;
  status: OrderStatus;
  when: string;
}) {
  return (
    <div
      className="rounded-3xl p-4"
      style={{
        background: "#fff",
        border: "2px solid rgba(71,193,224,0.55)",
        boxShadow: "0 10px 22px rgba(71,193,224,0.10)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-[18px] font-extrabold" style={{ color: BRAND }}>
            {store}
          </div>
          <div className="mt-1 text-[13px] text-black/60">{when}</div>
        </div>
        <Badge s={status} />
      </div>

      <div className="mt-3 rounded-2xl px-4 py-3" style={{ background: "rgba(1,27,60,0.05)" }}>
        <div className="text-[14px] font-semibold" style={{ color: BRAND }}>
          Itens
        </div>
        <div className="mt-1 text-[14px] text-black/70">{items}</div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-[13px] text-black/60">Total</div>
        <div className="text-[18px] font-extrabold" style={{ color: BRAND }}>
          {total}
        </div>
      </div>

      <button
        className="mt-4 w-full rounded-2xl px-4 py-3 font-extrabold transition active:scale-[0.99]"
        style={{ background: BRAND, color: "white", border: `2px solid ${AQUA}`, WebkitTapHighlightColor: "transparent" }}
      >
        Ver detalhes
      </button>
    </div>
  );
}

export default function Page() {
  const tabs = useMemo(
    () => [
      { k: "ativos", label: "Ativos" },
      { k: "historico", label: "Histórico" },
    ],
    []
  );

  const [tab, setTab] = useState<"ativos" | "historico">("ativos");

  const orders = useMemo(
    () => [
      { store: "Pizza Blu", items: "1x Calabresa • 1x Coca 2L", total: "R$ 68,90", status: "em_producao" as const, when: "Hoje • 19:42" },
      { store: "Havana", items: "2x Smash • 1x Batata", total: "R$ 59,00", status: "a_caminho" as const, when: "Hoje • 18:15" },
      { store: "Sabor do Meio Dia", items: "1x Marmita • 1x Suco", total: "R$ 24,50", status: "entregue" as const, when: "Ontem • 12:10" },
      { store: "Gostinho da Manhã", items: "1x Café • 1x Pão na chapa", total: "R$ 16,00", status: "cancelado" as const, when: "Ontem • 09:02" },
    ],
    []
  );

  const filtered = useMemo(() => {
    if (tab === "ativos") return orders.filter((o) => o.status === "em_producao" || o.status === "a_caminho");
    return orders.filter((o) => o.status === "entregue" || o.status === "cancelado");
  }, [tab, orders]);

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(980px 580px at 80% -10%, rgb(255, 255, 255), transparent 60%), radial-gradient(900px 520px at -10% 10%, rgba(1,27,60,0.05), transparent 55%), linear-gradient(180deg,#f7f8fb,#f1f4f8 70%)",
      }}
    >
      <div className="mx-auto w-full max-w-[430px] px-3 pb-24 pt-4">
        {/* HEADER no padrão Conta (com botão voltar) */}
        <div className="flex items-start gap-3">
          <a
            href="/"
            className="grid h-11 w-11 place-items-center rounded-2xl transition active:scale-[0.98]"
            style={{
              background: BRAND,
              border: `2px solid ${AQUA}`,
              boxShadow: "0 14px 30px rgba(1,27,60,0.18)",
              WebkitTapHighlightColor: "transparent",
            }}
            aria-label="Voltar para início"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#47c1e0]" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          <div className="min-w-0">
            <div className="text-[22px] font-extrabold" style={{ color: BRAND }}>
              Pedidos
            </div>
            <div className="mt-1 text-[14px] text-black/60">Acompanhe seus pedidos e histórico</div>
          </div>
        </div>

        {/* Switch */}
        <div className="mt-4 flex gap-3">
          {tabs.map((t) => {
            const active = tab === t.k;
            return (
              <button
                key={t.k}
                onClick={() => setTab(t.k as any)}
                className={cn("flex-1 rounded-2xl px-4 py-3 text-[14px] font-extrabold transition active:scale-[0.99]")}
                style={{
                  background: active ? BRAND : "#fff",
                  color: active ? "white" : "rgba(0,0,0,0.7)",
                  border: active ? `2px solid ${AQUA}` : "2px solid rgba(71,193,224,0.40)",
                  boxShadow: active ? "0 12px 26px rgba(1,27,60,0.20)" : "0 10px 22px rgba(0,0,0,0.06)",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <div className="mt-4 space-y-3">
          {filtered.map((o) => (
            <OrderCard key={o.store + o.when} store={o.store} items={o.items} total={o.total} status={o.status} when={o.when} />
          ))}
        </div>
      </div>
    </div>
  );
}