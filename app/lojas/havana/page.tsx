// app/p/[pizzablu]/page.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PainelCarrinho from "../../carrinho/painel";
import { brl, useCart } from "../../carrinho/provedor";

import {
  ALL_ITEMS,
  CARDAPIO,
  TABS,
  type Item,
  type TabKey,
  AQUA,
  BRAND,
} from "./components/cardapio";

import BurgerBuilder, {
  type BurgerBaseItem,
  type AddonGroup,
} from "./components/burger-builder";

const ORANGE = "#f59e0b";
const TEXT = "#111827";
const MUTED = "#6b7280";
const LINE = "#e5e7eb";
const STORE_ID = "havana";

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

function Icon({
  name,
  className,
  style,
}: {
  name: "back" | "search" | "bag";
  className?: string;
  style?: React.CSSProperties;
}) {
  const common = cn("inline-block", className);
  switch (name) {
    case "back":
      return (
        <svg className={common} style={style} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "search":
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
    case "bag":
      return (
        <svg className={common} style={style} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M7 9V7a5 5 0 0110 0v2"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M6.5 9h11l1 12.5H5.5L6.5 9z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

function formatSectionTitle(key: TabKey) {
  return CARDAPIO[key]?.title ?? "Itens";
}

function norm(s: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export default function LojaPage() {
  const router = useRouter();
  const cart = useCart();

  useEffect(() => {
    if (cart.state.items.length > 0 && cart.state.storeId && cart.state.storeId !== STORE_ID) {
      cart.clear();
      cart.setStoreId(STORE_ID);
    } else if (!cart.state.storeId) {
      cart.setStoreId(STORE_ID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hamburgers = useMemo(() => CARDAPIO.hamburgers.items, []);
  const porcoes = useMemo(() => CARDAPIO.porcoes.items, []);
  const bebidas = useMemo(() => CARDAPIO.bebidas.items, []);
  const sucos = useMemo(() => CARDAPIO.sucos.items, []);
  const cervejas = useMemo(() => CARDAPIO.cervejas.items, []);

  const allItems = useMemo(() => ALL_ITEMS, []);

  const hamburgersRef = useRef<HTMLDivElement | null>(null);
  const porcoesRef = useRef<HTMLDivElement | null>(null);
  const bebidasRef = useRef<HTMLDivElement | null>(null);
  const sucosRef = useRef<HTMLDivElement | null>(null);
  const cervejasRef = useRef<HTMLDivElement | null>(null);

  const topbarRef = useRef<HTMLDivElement | null>(null);
  const tabsBarRef = useRef<HTMLDivElement | null>(null);

  const [active, setActive] = useState<TabKey>("hamburgers");

  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const itemEls = useRef<Record<string, HTMLElement | null>>({});

  const [scrollOffset, setScrollOffset] = useState(0);
  useEffect(() => {
    function recalc() {
      const topH = topbarRef.current?.getBoundingClientRect().height ?? 0;
      const tabsH = tabsBarRef.current?.getBoundingClientRect().height ?? 0;
      const searchH = searchOpen ? 64 : 0;
      setScrollOffset(Math.round(topH + tabsH + searchH));
    }
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [searchOpen]);

  useEffect(() => {
    if (searchOpen) requestAnimationFrame(() => searchInputRef.current?.focus());
    else setQ("");
  }, [searchOpen]);

  function getRef(k: TabKey) {
    if (k === "hamburgers") return hamburgersRef;
    if (k === "porcoes") return porcoesRef;
    if (k === "bebidas") return bebidasRef;
    if (k === "sucos") return sucosRef;
    return cervejasRef;
  }

  function scrollToSection(k: TabKey) {
    const el = getRef(k).current;
    if (!el) return;

    const EXTRA_GAP = 12;
    const top = el.getBoundingClientRect().top + window.scrollY - (scrollOffset + EXTRA_GAP);
    window.scrollTo({ top, behavior: "smooth" });
  }

  function scrollToItem(itemId: string, section: TabKey) {
    const el = itemEls.current[itemId];
    if (!el) {
      scrollToSection(section);
      return;
    }

    setSearchOpen(false);
    requestAnimationFrame(() => {
      const EXTRA_GAP = 12;
      const top = el.getBoundingClientRect().top + window.scrollY - (scrollOffset + EXTRA_GAP);
      window.scrollTo({ top, behavior: "smooth" });
    });
  }

  const results = useMemo(() => {
    const nq = norm(q);
    if (!nq) return [];
    return allItems
      .filter((it) => {
        const hay = norm(`${it.title} ${it.subtitle ?? ""}`);
        return hay.includes(nq);
      })
      .slice(0, 12);
  }, [q, allItems]);

  useEffect(() => {
    const sections: Array<{ key: TabKey; el: HTMLElement | null }> = [
      { key: "hamburgers", el: hamburgersRef.current },
      { key: "porcoes", el: porcoesRef.current },
      { key: "bebidas", el: bebidasRef.current },
      { key: "sucos", el: sucosRef.current },
      { key: "cervejas", el: cervejasRef.current },
    ];

    const valid = sections.filter((s) => s.el) as Array<{ key: TabKey; el: HTMLElement }>;
    if (!valid.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (visible) {
          const key = valid.find((v) => v.el === visible.target)?.key;
          if (key) setActive(key);
        }
      },
      {
        root: null,
        rootMargin: `-${scrollOffset + 12}px 0px -55% 0px`,
        threshold: [0.12, 0.25, 0.4, 0.6],
      }
    );

    valid.forEach((v) => obs.observe(v.el));
    return () => obs.disconnect();
  }, [scrollOffset]);

  const [burgerOpen, setBurgerOpen] = useState(false);
  const [burgerBase, setBurgerBase] = useState<BurgerBaseItem | null>(null);

  const TURBINAR_GROUPS: AddonGroup[] = useMemo(
    () => [
      {
        id: "turbinados",
        title: "Que tal turbinar seu lanche?",
        subtitle: "Escolha até 6 itens",
        maxTotal: 6,
        items: [
          { id: "molho_especial", name: "Adicional molho especial da casa", priceNum: 5, maxEach: 6 },
          { id: "bacon", name: "Adicional bacon", priceNum: 5, maxEach: 6 },
          { id: "ovo", name: "Adicional ovo", priceNum: 2, maxEach: 6 },
          { id: "geleia_pimenta", name: "Adicional geléia de pimenta", priceNum: 5, maxEach: 6 },
          { id: "hamburguer", name: "Adicional hambúrguer", priceNum: 10, maxEach: 6 },
          { id: "cheddar", name: "Adicional cheddar", priceNum: 6, maxEach: 6 },
        ],
      },
    ],
    []
  );

  function addToCart(it: Item) {
    if (it.section === "hamburgers") {
      setBurgerBase({
        id: it.id,
        title: it.title,
        priceNum: it.priceNum,
        img: it.img,
        subtitle: it.subtitle,
      });
      setBurgerOpen(true);
      return;
    }

    cart.addItem({
      id: it.id,
      name: it.title,
      price: it.priceNum,
      image: it.img,
      storeId: STORE_ID,
    });
  }

  return (
    <div className="min-h-screen w-full bg-white overflow-x-hidden">
      <div
        ref={topbarRef}
        className="sticky top-0 z-50 w-full"
        style={{ background: BRAND, paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="mx-auto w-full max-w-[600px]">
          <div className="relative flex h-16 items-center justify-center px-4">
            <button
              onClick={() => router.push("/")}
              className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-2xl transition active:scale-[0.96]"
              style={{ background: "#012642", border: `2px solid ${AQUA}` }}
              aria-label="Voltar"
            >
              <Icon name="back" className="h-6 w-6 text-white" />
            </button>

            <div className="text-[22px] sm:text-[25px] font-bold tracking-[-0.02em] text-white">
              Havana Hamburgueria
            </div>

            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                onClick={() => cart.open()}
                className="relative grid h-11 w-11 place-items-center rounded-2xl transition active:scale-[0.96]"
                style={{ background: "#012642", border: `2px solid ${AQUA}` }}
                aria-label="Abrir carrinho"
              >
                <Icon name="bag" className="h-6 w-6 text-white" />
                {cart.itemsCount > 0 && (
                  <span
                    className="absolute -right-1 -top-1 grid h-6 min-w-[24px] place-items-center rounded-full px-1 text-[12px] font-extrabold"
                    style={{ background: AQUA, color: BRAND, boxShadow: "0 10px 20px rgba(79,220,255,0.25)" }}
                  >
                    {cart.itemsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setSearchOpen((v) => !v)}
                className="grid h-11 w-11 place-items-center rounded-2xl transition active:scale-[0.96]"
                style={{ background: "#012642", border: `2px solid ${AQUA}` }}
                aria-label="Buscar"
              >
                <Icon name="search" className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>

          {searchOpen && (
            <div className="px-4 pb-3">
              <div
                className="rounded-2xl p-[2px]"
                style={{
                  background: "linear-gradient(180deg, rgba(79,220,255,0.55), rgba(79,220,255,0.12))",
                }}
              >
                <div className="rounded-2xl bg-white/95 backdrop-blur-md">
                  <div className="flex items-center gap-2 px-4 py-3">
                    <Icon name="search" className="h-5 w-5" style={{ color: BRAND }} />
                    <input
                      ref={searchInputRef}
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Buscar item no cardápio…"
                      className="w-full bg-transparent text-[16px] font-semibold outline-none placeholder:text-gray-400"
                      style={{ color: "#0b1220", WebkitTextFillColor: "#0b1220" }}
                    />
                    <button
                      onClick={() => {
                        setSearchOpen(false);
                        setQ("");
                      }}
                      className="shrink-0 rounded-xl px-3 py-2 text-[14px] font-extrabold"
                      style={{ color: BRAND }}
                    >
                      Fechar
                    </button>
                  </div>

                  {!!q && (
                    <div className="px-2 pb-2">
                      {results.length ? (
                        <div
                          className="max-h-[260px] overflow-auto rounded-2xl border"
                          style={{ borderColor: "rgba(1,27,60,0.12)" }}
                        >
                          {results.map((it) => (
                            <button
                              key={it.id}
                              onClick={() => scrollToItem(it.id, it.section)}
                              className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition active:scale-[0.99]"
                              style={{ borderBottom: "1px solid rgba(1,27,60,0.08)" }}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-[16px] font-extrabold" style={{ color: "#0b1220" }}>
                                  {it.title}
                                </div>
                                <div className="mt-0.5 flex items-center gap-2 text-[13px] font-semibold text-gray-500">
                                  <span>{formatSectionTitle(it.section)}</span>
                                  {it.subtitle ? <span className="truncate">• {it.subtitle}</span> : null}
                                </div>
                              </div>
                              <div className="shrink-0 text-[14px] font-extrabold" style={{ color: BRAND }}>
                                {it.price}
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div
                          className="rounded-2xl border px-4 py-4 text-[14px] font-semibold text-gray-600"
                          style={{ borderColor: "rgba(1,27,60,0.12)" }}
                        >
                          Nenhum item encontrado.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-[600px] bg-white">
        <div className="px-4 pt-8">
          <div className="flex items-start gap-4">
            <div className="relative -mt-4 shrink-0">
              <div
                className="flex items-center justify-center overflow-hidden rounded-2xl"
                style={{ width: 75, height: 75, background: BRAND }}
              >
                <img src="/havana/logo-havana.jpg" alt="Havana" className="h-full w-full object-cover" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
                <InfoBlock value="35-55" label="minutos" />
                <InfoBlock value="R$ 25,00" label="mínimo" />
                <RatingBlock rating="4.8" total="2.134" />
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-1 text-[16px] sm:text-[18px] font-semibold leading-snug text-black">
            <div className="flex gap-2">
              <span className="mt-[1px]">📍</span>
              <span className="min-w-0">Hambúrguer artesanal • porções • bebidas</span>
            </div>
            <div className="flex gap-2">
              <span className="mt-[1px]">🔥</span>
              <span className="min-w-0">Os mais pedidos: Costela, Fire e Picanha</span>
            </div>
            <div className="flex gap-2">
              <span className="mt-[1px]">🕒</span>
              <span className="min-w-0">Confira horário de funcionamento no perfil da loja</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex w-full" style={{ background: LINE, gap: "1px" }}>
            <PromoCardExpanded img="/havana/havana-fire.webp" />
            <PromoCardExpanded img="/havana/havana-piupiu.webp" />
            <PromoCardExpanded img="/havana/havana-monstrao.webp" />
          </div>
        </div>

        <div
          ref={tabsBarRef}
          className="sticky z-40 mt-3 top-[calc(env(safe-area-inset-top)+64px)] bg-white border-b"
          style={{ borderColor: LINE }}
        >
          <div className="flex px-4">
            {TABS.map((t) => {
              const isActive = t.key === active;
              return (
                <button
                  key={t.key}
                  onClick={() => scrollToSection(t.key)}
                  className="relative flex-1 py-3 text-center text-[20px] transition-all"
                  style={{ color: isActive ? TEXT : MUTED, fontWeight: 900 }}
                >
                  {t.label}
                  {isActive && (
                    <span className="absolute inset-x-6 bottom-0 h-[2px] rounded-full" style={{ background: "#4dd5f8" }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-0">
          <div ref={hamburgersRef}>
            <Section
              title={formatSectionTitle("hamburgers")}
              lineColor={LINE}
              items={hamburgers}
              onItemMount={(id, el) => (itemEls.current[id] = el)}
              onAdd={addToCart}
            />
          </div>

          <div ref={porcoesRef}>
            <Section
              title={formatSectionTitle("porcoes")}
              lineColor={LINE}
              items={porcoes}
              onItemMount={(id, el) => (itemEls.current[id] = el)}
              onAdd={addToCart}
            />
          </div>

          <div ref={bebidasRef}>
            <Section
              title={formatSectionTitle("bebidas")}
              lineColor={LINE}
              items={bebidas}
              onItemMount={(id, el) => (itemEls.current[id] = el)}
              onAdd={addToCart}
            />
          </div>

          <div ref={sucosRef}>
            <Section
              title={formatSectionTitle("sucos")}
              lineColor={LINE}
              items={sucos}
              onItemMount={(id, el) => (itemEls.current[id] = el)}
              onAdd={addToCart}
            />
          </div>

          <div ref={cervejasRef}>
            <Section
              title={formatSectionTitle("cervejas")}
              lineColor={LINE}
              items={cervejas}
              onItemMount={(id, el) => (itemEls.current[id] = el)}
              onAdd={addToCart}
            />
          </div>
        </div>

        <div className="h-10" />
      </div>

      <BurgerBuilder
        open={burgerOpen}
        baseItem={burgerBase}
        groups={TURBINAR_GROUPS}
        onClose={() => {
          setBurgerOpen(false);
          setBurgerBase(null);
        }}
        onConfirm={(p) => {
          cart.addItem({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image,
            meta: p.meta,
            storeId: STORE_ID,
          });
          setBurgerOpen(false);
          setBurgerBase(null);
          cart.open();
        }}
      />

      <PainelCarrinho checkoutHref="/checkout" />

      <div
        className="fixed left-0 right-0 z-[60] border-t"
        style={{
          bottom: "calc(0px + env(safe-area-inset-bottom))",
          borderColor: "rgba(1,27,60,0.10)",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        <div className="mx-auto w-full max-w-[600px] px-4 py-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[12px] font-bold text-gray-500">Total</div>
              <div className="truncate text-[16px] font-extrabold" style={{ color: BRAND }}>
                {brl(cart.subtotal)}
              </div>
            </div>

            <button
              onClick={() => cart.open()}
              className="rounded-2xl px-4 py-3 text-[14px] font-extrabold active:scale-[0.99]"
              style={{
                background: `linear-gradient(180deg, ${AQUA} 0%, rgba(79,220,255,0.72) 100%)`,
                color: BRAND,
                boxShadow:
                  "0 18px 40px rgba(79,220,255,0.18), 0 0 0 1px rgba(255,255,255,0.14) inset",
              }}
            >
              Ver carrinho ({cart.itemsCount})
            </button>
          </div>
        </div>
      </div>

      <div className="h-[92px]" />
    </div>
  );
}

function InfoBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-[18px] font-bold" style={{ color: BRAND }}>
        {value}
      </div>
      <div className="text-[15px] font-semibold" style={{ color: "#000000" }}>
        {label}
      </div>
    </div>
  );
}

function RatingBlock({ rating, total }: { rating: string; total: string }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center gap-2">
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill={ORANGE} aria-hidden="true">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
        <div className="text-[18px] font-bold" style={{ color: BRAND }}>
          {rating}
        </div>
      </div>
      <div className="text-[14px] font-semibold whitespace-nowrap" style={{ color: BRAND }}>
        {total} avaliações
      </div>
    </div>
  );
}

function PromoCardExpanded({ img }: { img: string }) {
  return (
    <div className="relative w-1/3 aspect-[3/4] overflow-hidden bg-gray-100">
      <img src={img} alt="" className="h-full w-full object-cover" />
    </div>
  );
}

function Section({
  title,
  lineColor,
  items,
  onItemMount,
  onAdd,
}: {
  title: string;
  lineColor: string;
  items: Item[];
  onItemMount: (id: string, el: HTMLElement | null) => void;
  onAdd: (it: Item) => void;
}) {
  return (
    <div className="px-0">
      <div className="px-4 pt-4 sm:pt-6">
        <div
          className="text-[22px] font-extrabold tracking-[-0.02em]"
          style={{ color: "#47c1e0" }}
        >
          {title}
        </div>
        <div className="mt-2 h-[1px] w-full" style={{ background: lineColor }} />
      </div>

      <div className="pb-2">
        {items.map((c, idx) => (
          <div
            key={c.id}
            className="px-4"
            ref={(el) => onItemMount(c.id, el as unknown as HTMLElement | null)}
          >
            <button
              type="button"
              onClick={() => onAdd(c)}
              className={cn(
                "w-full text-left transition-transform duration-150",
                "active:scale-[0.985]"
              )}
              style={{ WebkitTapHighlightColor: "transparent" }}
              aria-label={`Adicionar ${c.title} ao carrinho`}
            >
              <div className={cn("flex items-center justify-between gap-3 sm:gap-4 py-3 sm:py-3")}>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[20px] sm:text-[20px] font-semibold tracking-[-0.02em] text-black">
                    {c.title}
                  </div>

                  {c.subtitle && (
                    <div className="mt-1 text-[14px] sm:text-[15px] leading-snug text-gray-500">
                      {c.subtitle}
                    </div>
                  )}

                  <div className="mt-2">
                    <div className="whitespace-nowrap text-[18px] sm:text-[18px] font-bold text-black">
                      {c.price}
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <div className="h-[96px] w-[96px] sm:h-[112px] sm:w-[120px] overflow-hidden rounded-2xl bg-gray-100 grid place-items-center">
                    {c.img ? (
                      <img
                        src={c.img}
                        alt=""
                        className="h-30 w-30 object-contain object-center"
                        style={{ borderRadius: 16 }}
                      />
                    ) : (
                      <div className="text-[34px]">{c.icon ?? "🥤"}</div>
                    )}
                  </div>
                </div>
              </div>

              {idx !== items.length - 1 && (
                <div className="h-[1px] w-full" style={{ background: lineColor }} />
              )}
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        button:active > div {
          transform: translateY(1px);
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.92) inset,
            0 10px 22px rgba(0, 0, 0, 0.06) inset,
            0 1px 0 rgba(0, 0, 0, 0.03);
          background: rgba(1, 27, 60, 0.02);
        }
      `}</style>
    </div>
  );
}