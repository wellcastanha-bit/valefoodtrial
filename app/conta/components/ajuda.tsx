"use client";

import React, { useMemo, useState } from "react";

const BRAND = "#011b3c";
const AQUA = "#47c1e0";

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

function Icon({
  name,
  className,
}: {
  name: "chev" | "search" | "msg";
  className?: string;
}) {
  if (name === "search")
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path
          d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );

  if (name === "msg")
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path
          d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 8h8M8 12h6"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      </svg>
    );

  // chev
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FaqRow({
  title,
  desc,
  open,
  onToggle,
}: {
  title: string;
  desc: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full text-left"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <div
        className="px-5 py-5"
        style={{
          background: "#fff",
          border: "2px solid rgba(71,193,224,0.55)",
          borderRadius: 22,
          boxShadow: "0 10px 22px rgba(71,193,224,0.08)",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div
              className="truncate text-[16px] font-extrabold"
              style={{ color: BRAND }}
            >
              {title}
            </div>
            <div className="mt-1 truncate text-[13px] text-black/60">
              {desc}
            </div>
          </div>

          <div
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full"
            style={{ background: BRAND, border: `2px solid ${AQUA}` }}
          >
            <Icon
              name="chev"
              className={cn("h-6 w-6 text-[#47c1e0] transition", open && "rotate-90")}
            />
          </div>
        </div>

        {open && (
          <div
            className="mt-4 rounded-2xl px-4 py-3 text-[14px] text-black/70"
            style={{ background: "rgba(1,27,60,0.05)" }}
          >
            {desc}
          </div>
        )}
      </div>
    </button>
  );
}

export default function Ajuda() {
  const faqs = useMemo(
    () => [
      {
        q: "Como funciona o ValeFood?",
        a: "Você escolhe a loja, monta seu pedido e acompanha o status. Este é um protótipo (mock), então algumas ações ainda não finalizam o pedido.",
      },
      {
        q: "Como altero meu endereço?",
        a: "Vá em Conta → Meus dados → Endereços. Lá você pode adicionar, editar ou excluir endereços.",
      },
      {
        q: "O que significa “Entrega grátis”?",
        a: "Depende da loja. Algumas oferecem frete grátis sempre; outras exigem valor mínimo ou promoções do dia.",
      },
      {
        q: "Meu pedido não apareceu",
        a: "Neste protótipo, os pedidos são exemplos. Quando conectarmos no backend, a lista virá do banco e ficará real.",
      },
    ],
    []
  );

  const [q, setQ] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return faqs;
    return faqs.filter((x) => `${x.q} ${x.a}`.toLowerCase().includes(qq));
  }, [q, faqs]);

  return (
    <div
      className="rounded-3xl px-3 py-3"
      style={{
        background: "rgba(255,255,255,0.60)",
        border: "2px solid rgba(71,193,224,0.35)",
        boxShadow: "0 10px 24px rgba(1,27,60,0.06)",
      }}
    >
      {/* Search */}
      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-3"
        style={{
          background: "#fff",
          border: "2px solid rgba(71,193,224,0.55)",
          boxShadow: "0 12px 26px rgba(0,0,0,0.06)",
        }}
      >
        <div
          className="grid h-9 w-9 place-items-center rounded-xl"
          style={{ background: "rgba(1,27,60,0.06)", color: BRAND }}
        >
          <Icon name="search" className="h-5 w-5" />
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Pesquisar dúvidas..."
          className="w-full bg-transparent text-[15px] outline-none"
        />
      </div>

      {/* Quick contact */}
      <div
        className="mt-4 rounded-3xl px-5 py-5"
        style={{
          background: BRAND,
          border: `2px solid ${AQUA}`,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div
              className="text-[11px] font-extrabold tracking-[0.18em]"
              style={{ color: AQUA }}
            >
              SUPORTE
            </div>
            <div className="mt-2 text-[17px] font-semibold text-white">
              Fale com a gente
            </div>
            <div className="mt-1 text-[13px] text-white/60">
              Atendimento rápido (mock)
            </div>
          </div>

          <div
            className="grid h-12 w-12 place-items-center rounded-2xl"
            style={{
              background: "#012445",
              border: `1.5px solid ${AQUA}`,
              color: AQUA,
            }}
          >
            <Icon name="msg" className="h-6 w-6" />
          </div>
        </div>

        <button
          type="button"
          className="mt-4 w-full rounded-2xl px-4 py-3 font-extrabold transition active:scale-[0.99]"
          style={{
            background: "rgba(255,255,255,0.12)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.22)",
            WebkitTapHighlightColor: "transparent",
          }}
          onClick={() => alert("Abrir chat (mock)")}
        >
          Abrir chat
        </button>
      </div>

      {/* FAQ */}
      <div className="mt-5">
        <div className="text-[16px] font-extrabold" style={{ color: BRAND }}>
          Perguntas frequentes
        </div>

        <div className="mt-3 space-y-3">
          {filtered.map((f, i) => {
            const open = openIdx === i;
            return (
              <FaqRow
                key={f.q}
                title={f.q}
                desc={f.a}
                open={open}
                onToggle={() => setOpenIdx(open ? null : i)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}