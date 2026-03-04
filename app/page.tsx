"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

const BRAND = "#011b3c";
const AQUA = "#47c1e0";

type Tile = {
  key: "promocoes" | "cupons" | "gratis" | "novidades";
  label: string;
  icon: "tag" | "ticket" | "truck" | "spark";
  badge?: string;
  ink: string;
};

type Chip = {
  key: string;
  label: string;
  imgSrc: string;
};

type Store = {
  id: string;
  name: string;
  /** ✅ agora é logo (imagem), não emoji */
  logoSrc: string;
  isNew?: boolean;
  rating: number;
  eta: string;
  fee: string;
  note?: string;
};

type TabKey = "inicio" | "buscar" | "pedidos" | "conta";

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

function Icon({
  name,
  className,
}: {
  name:
    | "pin"
    | "bell"
    | "search"
    | "home"
    | "receipt"
    | "user"
    | "heart"
    | "chev"
    | "tag"
    | "ticket"
    | "truck"
    | "spark";
  className?: string;
}) {
  if (name === "pin")
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path
          d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 10.5a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );

  if (name === "bell")
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path
          d="M15 17H6a2 2 0 0 1-2-2c0-1.2 1-2 2-2V10a6 6 0 1 1 12 0v3c1 .1 2 .8 2 2a2 2 0 0 1-2 2h-1"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 21a2 2 0 0 0 4 0"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );

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

  if (name === "heart")
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path
          d="M12 21s-7-4.6-9.5-8.7C.7 8.8 2.3 6 5.3 5.3c1.8-.4 3.6.3 4.7 1.6 1.1-1.3 2.9-2 4.7-1.6 3 .7 4.6 3.5 2.8 7C19 16.4 12 21 12 21Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );

  if (name === "chev")
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path
          d="M9 18l6-6-6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );

  if (name === "home")
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path
          d="M3 11l9-8 9 8v10a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2V11Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );

  if (name === "receipt")
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path
          d="M7 2h10v20l-2-1-2 1-2-1-2 1-2-1-2 1V2Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 7h6M9 11h6M9 15h6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );

  if (name === "user")
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path
          d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );

  if (name === "tag")
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path
          d="M20 13l-7 7a2 2 0 0 1-2.83 0L3 12V4h8l9 9Z"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M7.5 7.5h.01" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
      </svg>
    );

  if (name === "ticket")
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path
          d="M4 9a2 2 0 0 0 2-2h12a2 2 0 0 0 2 2v6a2 2 0 0 0-2 2H6a2 2 0 0 0-2-2V9Z"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 7v10"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeDasharray="2.2 2.2"
        />
      </svg>
    );

  if (name === "truck")
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path d="M3 7h11v10H3V7Z" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M14 10h4l3 3v4h-7v-7Z"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M7 20a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 7 20Z" fill="currentColor" />
        <path d="M18 20a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 18 20Z" fill="currentColor" />
      </svg>
    );

  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M12 2l1.6 5.2L19 9l-5.4 1.8L12 16l-1.6-5.2L5 9l5.4-1.8L12 2Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path d="M5 19l1-1M19 19l-1-1M12 22v-1.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

/** tiles sem badge */
function MenuTile({ label, icon }: { label: string; icon: Tile["icon"] }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        className="grid h-16 w-16 place-items-center rounded-2xl active:scale-[0.99] transition"
        style={{ WebkitTapHighlightColor: "transparent" }}
        aria-label={label}
        type="button"
      >
        <div
          className="grid h-16 w-16 place-items-center rounded-2xl"
          style={{
            background: BRAND,
            color: AQUA,
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Icon name={icon} className="h-8 w-8" />
        </div>
      </button>

      <div className="text-[12px] font-semibold text-black/80">{label}</div>
    </div>
  );
}

/** ✅ CATEGORIAS IGUAL PRINT */
function CategoryStrip({
  items,
  activeKey,
  onPick,
}: {
  items: Chip[];
  activeKey: string;
  onPick: (k: string) => void;
}) {
  return (
    <div className="mt-4">
      <div className="flex gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((c) => {
          const active = activeKey === c.key;
          return (
            <button
              key={c.key}
              onClick={() => onPick(c.key)}
              className="shrink-0 text-center transition active:scale-[0.99]"
              style={{ WebkitTapHighlightColor: "transparent" }}
              aria-label={c.label}
              type="button"
            >
              <div
                className="mx-auto grid place-items-center"
                style={{
                  width: 96,
                  height: 72,
                  filter: active
                    ? "drop-shadow(0 12px 18px rgba(0,0,0,0.16))"
                    : "drop-shadow(0 9px 14px rgba(0,0,0,0.10))",
                  transform: active ? "translateY(-1px)" : "translateY(0)",
                }}
              >
                <img src={c.imgSrc} alt={c.label} className="h-full w-full object-contain select-none" draggable={false} />
              </div>

              <div className={cn("mt-2 text-[18px] font-medium tracking-[-0.02em]", active ? "text-black/90" : "text-black/70")}>
                {c.label}
              </div>

              {active && <div className="mx-auto mt-2 h-[4px] w-10 rounded-full" style={{ background: AQUA }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** ✅ STORE LIST row (sem coração, logo no lugar do ícone) */
function StoreRow({ s }: { s: Store }) {
  return (
    <a href={`/p/${s.id}`} className="block" style={{ WebkitTapHighlightColor: "transparent" }}>
      <div
        className="flex items-center gap-4 py-4 px-4 transition"
        style={{
          background: "#ffffff",
          border: "2px solid rgba(71,193,224,0.65)",
          borderRadius: 20,
          boxShadow: "0 8px 20px rgba(71,193,224,0.12)",
        }}
      >
        {/* ✅ LOGO da loja no lugar do emoji */}
        <div
          className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl"
          style={{
            background: "rgba(1,27,60,0.06)",
            border: "1px solid rgba(71,193,224,0.35)",
          }}
        >
          <img
  src={s.logoSrc}
  alt={`Logo ${s.name}`}
  className="h- w- object-contain select-none"
  draggable={false}
/>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <div className="truncate text-[18px] font-semibold" style={{ color: BRAND }}>
              {s.name}
            </div>
            {s.isNew && (
              <span className="shrink-0 text-[14px] font-semibold text-orange-600">
                novo!
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-[15px] text-black/60">
            <span className="inline-flex items-center gap-1">
              <span className="text-[#f59e0b]">★</span>
              <span className="font-semibold text-black/70">{s.rating.toFixed(1).replace(".", ",")}</span>
            </span>

            <span className="text-black/20">•</span>

            <span className="inline-flex items-center gap-1">
              <span style={{ color: AQUA }}>🛵</span>
              <span className={s.fee === "Grátis" ? "text-emerald-600 font-semibold" : ""}>{s.fee}</span>
            </span>

            <span className="text-black/20">•</span>

            <span>{s.eta}</span>
          </div>

          {s.note && (
            <div className="mt-1 truncate text-[14px] font-semibold" style={{ color: AQUA }}>
              {s.note}
            </div>
          )}
        </div>

        {/* ✅ removido o coração (o espaço some e o card fica limpo igual print) */}
      </div>

      <div className="h-3" />
    </a>
  );
}

export default function Page() {
  const tiles: Tile[] = useMemo(
    () => [
      { key: "promocoes", label: "Promoções", icon: "tag", badge: "Novo", ink: "rgb(236 72 68)" },
      { key: "cupons", label: "Cupons", icon: "ticket", ink: "rgb(155 81 224)" },
      { key: "gratis", label: "Entrega Grátis", icon: "truck", ink: "rgb(34 197 94)" },
      { key: "novidades", label: "Novidades", icon: "spark", ink: "rgb(59 130 246)" },
    ],
    []
  );

  const catChips: Chip[] = useMemo(
    () => [
      { key: "pizza", label: "Pizza", imgSrc: "/imagens/pizza.png" },
      { key: "burguer", label: "Burguer", imgSrc: "/imagens/burguer.png" },
      { key: "sushi", label: "Sushi", imgSrc: "/imagens/sushi.png" },
      { key: "acai", label: "Açaí", imgSrc: "/imagens/acai.png" },
      { key: "marmita", label: "Marmita", imgSrc: "/imagens/marmita.png" },
    ],
    []
  );

  const stores: Store[] = useMemo(
    () => [
      { id: "havana", name: "Havana", logoSrc: "/logo-havana.jpg", rating: 4.8, eta: "35 min", fee: "R$8,00", note: "" },
      { id: "sabor-do-meio-dia", name: "Sabor do Meio Dia", logoSrc: "/logo-sabordomeiodia.jpg", rating: 4.6, eta: "40min", fee: "Grátis" },
      { id: "gostinho-da-manha", name: "Gostinho da Manhã", logoSrc: "logo-gostinhodamanha.jpg", rating: 4.9, eta: "30min", fee: "R$10,00" },
      { id: "pizza-blu", name: "Pizza Blu", logoSrc: "/logo-pizzablu.png", rating: 4.8, eta: "45 min", fee: "R$ 4,99" },
      { id: "velho-oeste", name: "Velho Oeste", logoSrc: "/logo-velhooeste.jpeg", rating: 4.7, eta: "50 min", fee: "R$6,00" },
    ],
    []
  );

  const tabs = useMemo(
    () =>
      [
        { key: "inicio", label: "Início", icon: "home" as const, href: "/" },
        { key: "buscar", label: "Buscar", icon: "search" as const, href: "/buscar" },
        { key: "pedidos", label: "Pedidos", icon: "receipt" as const, href: "/pedidos" },
        { key: "conta", label: "Conta", icon: "user" as const, href: "/conta" },
      ] as const,
    []
  );

  const [activeChip, setActiveChip] = useState<string>("pizza");
  const [activeTab, setActiveTab] = useState<TabKey>("inicio");

  // ✅ essa tela é HOME (/) e lista lojas
  const filteredStores = useMemo(() => stores, [stores]);

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(980px 580px at 80% -10%, rgb(255, 255, 255), transparent 60%), radial-gradient(900px 520px at -10% 10%, rgba(1,27,60,0.05), transparent 55%), linear-gradient(180deg,#f7f8fb,#f1f4f8 70%)",
      }}
    >
      {/* ✅ HOME CONTENT (mantém tua tela atual aqui) */}
      <div className="mx-auto w-full max-w-[430px] px-3 pb-24 pt-4">
        {/* TOPBAR */}
        <div className="flex items-center justify-between gap-3">
          <button
            className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-4 py-3"
            style={{ background: BRAND, border: `2px solid ${AQUA}` }}
            type="button"
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#012445] text-[#47c1e0]">
              <Icon name="pin" className="h-5 w-5" />
            </div>

            <div className="min-w-0 text-left">
              <div className="text-[12px] text-white/60">Entregar em</div>
              <div className="truncate text-[15px] font-semibold text-white">Rua Getúlio Vargas - 1075</div>
            </div>

            <Icon name="chev" className="h-5 w-5 text-[#47c1e0]" />
          </button>

          <button
            className="relative grid h-15 w-15 place-items-center rounded-2xl"
            style={{ background: BRAND, border: `2px solid ${AQUA}` }}
            type="button"
          >
            <Icon name="bell" className="h-6 w-6 text-[#47c1e0]" />
            <span className="absolute -right-1 -top-1 grid h-3.5 w-3.5 place-items-center rounded-full bg-[#47c1e0]" />
          </button>
        </div>

        {/* 4 ICONS */}
        <div className="mt-4">
          <div className="grid grid-cols-4 gap-4">
            {tiles.map((t) => (
              <MenuTile key={t.key} label={t.label} icon={t.icon} />
            ))}
          </div>
        </div>

        {/* CATEGORIAS */}
        <CategoryStrip items={catChips} activeKey={activeChip} onPick={setActiveChip} />

        {/* TITLE */}
        <div className="mt-5 text-[18px] font-semibold text-black/90">Perto de você</div>

        {/* LISTA */}
        <div className="mt-3">
          {filteredStores.map((s) => (
            <StoreRow key={s.id} s={s} />
          ))}
        </div>
      </div>

      {/* ✅ BOTTOM NAV — agora vira ROTAS reais */}
      <div className="fixed bottom-0 left-0 right-0">
        <div className="mx-auto w-full max-w-[430px] px-4 pb-5">
          <div
            className="relative overflow-hidden rounded-[30px] px-3 py-2"
            style={{
              background: "rgba(255,255,255,0.38)",
              backdropFilter: "blur(28px) saturate(180%)",
              WebkitBackdropFilter: "blur(28px) saturate(180%)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
              border: "1px solid rgba(255,255,255,0.45)",
            }}
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.18) 55%, rgba(255,255,255,0.08))",
              }}
            />
            <div className="pointer-events-none absolute inset-0 rounded-[30px]" style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65)" }} />

            <div className="relative grid grid-cols-4">
              {tabs.map((it) => {
                const isActive = activeTab === it.key;

                return (
                  <Link
                    key={it.key}
                    href={it.href}
                    onClick={() => setActiveTab(it.key)}
                    className="py-1.5 text-center transition active:scale-[0.97]"
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    <div
                      className="mx-auto grid h-8 w-8 place-items-center"
                      style={{ color: isActive ? BRAND : "rgba(0,0,0,0.45)" }}
                    >
                      <Icon name={it.icon} className="h-5 w-5" />
                    </div>

                    <div className={cn("text-[12px]", isActive ? "font-extrabold" : "font-medium")} style={{ color: isActive ? BRAND : "rgba(0,0,0,0.6)" }}>
                      {it.label}
                    </div>

                    {isActive && <div className="mx-auto mt-1 h-[3px] w-8 rounded-full" style={{ background: AQUA }} />}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}