"use client";

import React, { useMemo, useState } from "react";

const BRAND = "#011b3c";
const AQUA = "#47c1e0";

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

function Icon({ name, className }: { name: "search" | "chev"; className?: string }) {
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
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Pill({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition active:scale-[0.99]",
        "border border-black/5 shadow-[0_10px_24px_rgba(0,0,0,0.06)]",
        active ? "bg-[#011b3c] text-white" : "bg-white text-black/70"
      )}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {children}
    </button>
  );
}

function ResultRow({
  title,
  subtitle,
  emoji,
  tag,
}: {
  title: string;
  subtitle: string;
  emoji: string;
  tag?: string;
}) {
  return (
    <button className="w-full text-left" style={{ WebkitTapHighlightColor: "transparent" }} onClick={() => {}}>
      <div
        className="flex items-center gap-4 px-4 py-4"
        style={{
          background: "#fff",
          border: "2px solid rgba(71,193,224,0.55)",
          borderRadius: 20,
          boxShadow: "0 8px 20px rgba(71,193,224,0.10)",
        }}
      >
        <div
          className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-[26px]"
          style={{
            background: "rgba(1,27,60,0.06)",
            border: "1px solid rgba(71,193,224,0.35)",
          }}
        >
          {emoji}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="truncate text-[18px] font-semibold" style={{ color: BRAND }}>
              {title}
            </div>
            {tag && (
              <span
                className="shrink-0 rounded-full px-2 py-1 text-[12px] font-semibold"
                style={{ background: "rgba(71,193,224,0.14)", color: BRAND }}
              >
                {tag}
              </span>
            )}
          </div>
          <div className="mt-1 truncate text-[14px] text-black/60">{subtitle}</div>
        </div>

        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full" style={{ background: BRAND, border: `2px solid ${AQUA}` }}>
          <Icon name="chev" className="h-5 w-5 text-[#47c1e0]" />
        </div>
      </div>
    </button>
  );
}

export default function Page() {
  const filters = useMemo(
    () => [
      { k: "todos", label: "Todos" },
      { k: "pizza", label: "Pizza" },
      { k: "marmita", label: "Marmita" },
      { k: "acai", label: "Açaí" },
      { k: "sushi", label: "Sushi" },
      { k: "burguer", label: "Burguer" },
    ],
    []
  );

  const samples = useMemo(
    () => [
      { title: "Pizza Blu", subtitle: "Pizza • 45 min • R$ 4,99", emoji: "🍕", tag: "Top" },
      { title: "Gostinho da Manhã", subtitle: "Café • 30 min • R$ 10,00", emoji: "🍳", tag: "Novo" },
      { title: "Sabor do Meio Dia", subtitle: "Marmita • 40 min • Grátis", emoji: "🍽️" },
      { title: "Havana", subtitle: "Burguer • 35 min • R$ 8,00", emoji: "🍔" },
      { title: "Velho Oeste", subtitle: "Churrasco • 50 min • R$ 6,00", emoji: "🥩" },
    ],
    []
  );

  const [q, setQ] = useState("");
  const [active, setActive] = useState("todos");

  const results = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return [];
    return samples.filter((x) => `${x.title} ${x.subtitle}`.toLowerCase().includes(qq));
  }, [q, samples]);

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(980px 580px at 80% -10%, rgb(255, 255, 255), transparent 60%), radial-gradient(900px 520px at -10% 10%, rgba(1,27,60,0.05), transparent 55%), linear-gradient(180deg,#f7f8fb,#f1f4f8 70%)",
      }}
    >
      <div className="mx-auto w-full max-w-[430px] px-3 pb-24 pt-4">
        {/* HEADER no padrão Conta */}
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
              Buscar
            </div>

            <div className="mt-1 text-[14px] text-black/60">Encontre lojas e pratos rapidamente</div>
          </div>
        </div>

        {/* Search */}
        <div
          className="mt-4 flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{
            background: "#fff",
            border: "2px solid rgba(71,193,224,0.55)",
            boxShadow: "0 12px 26px rgba(0,0,0,0.06)",
          }}
        >
          <div className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: "rgba(1,27,60,0.06)", color: BRAND }}>
            <Icon name="search" className="h-5 w-5" />
          </div>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por loja, prato, categoria..."
            className="w-full bg-transparent text-[15px] outline-none text-black placeholder:text-black/40"
          />
        </div>

        {/* Filters */}
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((f) => (
            <Pill key={f.k} active={active === f.k} onClick={() => setActive(f.k)}>
              {f.label}
            </Pill>
          ))}
        </div>

        {/* Results (só aparecem quando começar a escrever) */}
        <div className="mt-4 space-y-3">
          {results.map((r) => (
            <ResultRow key={r.title} title={r.title} subtitle={r.subtitle} emoji={r.emoji} tag={r.tag} />
          ))}
        </div>
      </div>
    </div>
  );
}