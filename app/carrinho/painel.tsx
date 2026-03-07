"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { brl, useCart, type CartItem } from "./provedor";

const BRAND = "#011b3c";
const AQUA = "#47c1e0";

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

function Icon({
  name,
  className,
}: {
  name: "x" | "minus" | "plus" | "bag";
  className?: string;
}) {
  const common = cn("inline-block", className);
  if (name === "x")
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none">
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  if (name === "minus")
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none">
        <path d="M6 12h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  if (name === "plus")
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none">
        <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none">
      <path d="M7 9V7a5 5 0 0110 0v2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path
        d="M6.5 9h11l1 12.5H5.5L6.5 9z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function appendQuery(url: string, key: string, value: string) {
  const hasQ = url.includes("?");
  const sep = hasQ ? "&" : "?";
  return `${url}${sep}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
}

// ✅ auxiliares para render do “builder” no carrinho (sem quebrar itens antigos)
type PizzaMeta = {
  tamanhoId?: "pequena" | "grande" | "familia";
  mode?: "salgada" | "doce";
  sabores?: string[];
  premium?: boolean;
  borda?: string;
  obs?: string;
};

function titleByTamanhoId(t?: PizzaMeta["tamanhoId"]) {
  if (t === "pequena") return "Pizza Pequena";
  if (t === "grande") return "Pizza Grande";
  if (t === "familia") return "Pizza Família";
  return null;
}

function normalizeBorda(b?: string) {
  if (!b) return "Sem borda";
  if (b.trim().toLowerCase() === "sem borda") return "Sem borda";
  return b;
}

function extractPizzaMeta(it: CartItem): PizzaMeta | null {
  const anyIt = it as unknown as { meta?: unknown };
  if (!anyIt || !anyIt.meta || typeof anyIt.meta !== "object") return null;

  const m = anyIt.meta as Partial<PizzaMeta>;
  const sabores = Array.isArray(m.sabores) ? m.sabores.filter((x) => typeof x === "string") : undefined;

  return {
    tamanhoId: m.tamanhoId,
    mode: m.mode,
    sabores,
    premium: !!m.premium,
    borda: typeof m.borda === "string" ? m.borda : undefined,
    obs: typeof m.obs === "string" ? m.obs : undefined,
  };
}

export default function PainelCarrinho({
  checkoutHref = "/checkout",
}: {
  checkoutHref?: string;
}) {
  const cart = useCart();
  const startYRef = useRef<number | null>(null);
  const draggingRef = useRef(false);

  const hasItems = cart.itemsCount > 0;
  const canGoCheckout = useMemo(() => hasItems, [hasItems]);

  // ✅ passa a rota atual como "from" (última loja visitada)
  const checkoutWithFrom = useMemo(() => {
    if (typeof window === "undefined") return checkoutHref;
    const from = window.location.pathname || "/";
    return appendQuery(checkoutHref, "from", from);
  }, [checkoutHref]);

  // ESC fecha
  useEffect(() => {
    if (!cart.isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cart.close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cart]);

  // trava scroll do body (iOS-like)
  useEffect(() => {
    if (!cart.isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [cart.isOpen]);

  if (!cart.isOpen) return null;

  // ✅ glass branco mais transparente (menos leitoso)
  const sheetGlass: React.CSSProperties = {
    background: "linear-gradient(180deg, rgba(255,255,255,0.56) 0%, rgba(255,255,255,0.38) 100%)",
    backdropFilter: "blur(22px) saturate(160%)",
    WebkitBackdropFilter: "blur(22px) saturate(160%)",
    border: "1px solid rgba(255,255,255,0.50)",
    boxShadow: "0 22px 60px rgba(0,0,0,0.18), 0 1px 0 rgba(255,255,255,0.55) inset",
  };

  // ✅ cards internos (mais claros, mas ainda bem transparentes)
  const itemGlass: React.CSSProperties = {
    background: "linear-gradient(180deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.28) 100%)",
    border: "1px solid rgba(255,255,255,0.40)",
    boxShadow: "0 10px 26px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.50) inset",
    backdropFilter: "blur(16px) saturate(150%)",
    WebkitBackdropFilter: "blur(16px) saturate(150%)",
  };

  // ✅ “chips” (botões +/- e close) glass claro
  const chipGlass: React.CSSProperties = {
    background: "rgba(255,255,255,0.34)",
    border: "1px solid rgba(255,255,255,0.45)",
    backdropFilter: "blur(14px) saturate(150%)",
    WebkitBackdropFilter: "blur(14px) saturate(150%)",
    boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
  };

  // ✅ footer glass (sem gradiente escuro)
  const footerGlass: React.CSSProperties = {
    background: "linear-gradient(180deg, rgba(255,255,255,0.40) 0%, rgba(255,255,255,0.22) 100%)",
    borderTop: "1px solid rgba(255,255,255,0.40)",
    backdropFilter: "blur(20px) saturate(160%)",
    WebkitBackdropFilter: "blur(20px) saturate(160%)",
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      style={{ WebkitTapHighlightColor: "transparent" }}
      aria-modal="true"
      role="dialog"
    >
      {/* backdrop */}
      <button
        aria-label="Fechar carrinho"
        className="absolute inset-0"
        onClick={cart.close}
        style={{
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      />

      {/* sheet */}
      <div
        className="relative w-full max-w-[480px] rounded-t-[28px]"
        style={sheetGlass}
        onTouchStart={(e) => {
          startYRef.current = e.touches[0]?.clientY ?? null;
          draggingRef.current = true;
        }}
        onTouchMove={(e) => {
          if (!draggingRef.current) return;
          const startY = startYRef.current;
          const y = e.touches[0]?.clientY ?? 0;
          if (startY != null && y - startY > 90) {
            draggingRef.current = false;
            cart.close();
          }
        }}
        onTouchEnd={() => {
          draggingRef.current = false;
          startYRef.current = null;
        }}
      >
        {/* grab */}
        <div className="mx-auto mt-3 h-1.5 w-14 rounded-full bg-white/40" />

        {/* header */}
        <div className="flex items-center justify-between px-4 pt-3">
          <div className="flex items-center gap-2">
            <span
              className="grid h-10 w-10 place-items-center rounded-2xl"
              style={{
                ...chipGlass,
                background: "linear-gradient(180deg, rgba(1,27,60,0.10), rgba(1,27,60,0.06))",
                border: "1px solid rgba(1,27,60,0.14)",
              }}
            >
              <Icon name="bag" className="h-5 w-5 text-[#47c1e0]" />
            </span>

            <div className="leading-tight">
              <div className="text-[15px] font-semibold" style={{ color: BRAND }}>
                Seu carrinho
              </div>
              <div className="text-[12px]" style={{ color: BRAND, opacity: 0.65 }}>
                {cart.itemsCount} itens
              </div>
            </div>
          </div>

          <button
            onClick={cart.close}
            className="grid h-10 w-10 place-items-center rounded-2xl active:scale-[0.98]"
            style={chipGlass}
            aria-label="Fechar"
          >
            <Icon name="x" className="h-5 w-5 text-[#47c1e0]" />
          </button>
        </div>

        {/* content */}
        <div className="max-h-[55vh] overflow-auto px-4 pb-3 pt-3">
          {!hasItems ? (
            <div
              className="rounded-2xl p-4 text-center"
              style={{
                ...itemGlass,
                color: BRAND,
                opacity: 0.75,
              }}
            >
              Carrinho vazio.
            </div>
          ) : (
            <div className="space-y-2">
              {cart.state.items.map((it: CartItem) => {
                const meta = extractPizzaMeta(it);

                // considera pizza se tiver meta.tamanhoId OU meta.sabores
                const isPizza = !!meta?.tamanhoId || (!!meta?.sabores && meta.sabores.length > 0);

                const pizzaTitle =
                  (meta?.tamanhoId ? titleByTamanhoId(meta.tamanhoId) : null) ||
                  (it.name?.toLowerCase().includes("pizza") ? it.name : null) ||
                  it.name;

                const sabores = meta?.sabores ?? [];
                const borda = normalizeBorda(meta?.borda);

                return (
                  <div
  key={it.id}
  className="flex items-center justify-between gap-3 rounded-2xl p-3"
  style={itemGlass}
>
  <div className="min-w-0 flex-1">
    {/* ✅ TÍTULO + PREÇO NA MESMA LINHA */}
    <div className="flex items-start justify-between gap-3">
      <div className="truncate text-[14px] font-extrabold" style={{ color: BRAND }}>
        {isPizza ? pizzaTitle : it.name}
      </div>

      <div
        className="shrink-0 text-[14px] font-extrabold whitespace-nowrap"
        style={{ color: BRAND }}
      >
        {brl(it.price)}
      </div>
    </div>

    {/* ✅ Sabores em linhas com " - " */}
    {isPizza && sabores.length > 0 && (
      <div className="mt-1 space-y-0.5 text-[12px] font-semibold" style={{ color: BRAND, opacity: 0.78 }}>
        {sabores.map((s, idx) => (
          <div key={`${it.id}_s_${idx}`} className="truncate">
            - {s}
          </div>
        ))}
      </div>
    )}

    {/* ✅ Borda inline */}
    {isPizza && (
      <div className="mt-2 text-[12px] font-semibold" style={{ color: BRAND, opacity: 0.78 }}>
        <span className="font-extrabold" style={{ color: BRAND, opacity: 0.9 }}>
          Borda:
        </span>{" "}
        {borda}
      </div>
    )}
  </div>

  <div className="flex items-center gap-2">
    <button
      onClick={() => cart.decItem(it.id)}
      className="grid h-9 w-9 place-items-center rounded-xl active:scale-[0.98]"
      style={chipGlass}
      aria-label="Diminuir"
    >
      <Icon name="minus" className="h-4 w-4 text-[#47c1e0]" />
    </button>

    <div className="min-w-[28px] text-center text-[14px] font-semibold" style={{ color: BRAND }}>
      {it.qty}
    </div>

    <button
      onClick={() =>
        cart.addItem({
          id: it.id,
          name: it.name,
          price: it.price,
          image: it.image,
          meta: it.meta,
        })
      }
      className="grid h-9 w-9 place-items-center rounded-xl active:scale-[0.98]"
      style={{
        ...chipGlass,
        background: "linear-gradient(180deg, rgba(71,193,224,0.26) 0%, rgba(71,193,224,0.14) 100%)",
        border: "1px solid rgba(71,193,224,0.35)",
      }}
      aria-label="Aumentar"
    >
      <Icon name="plus" className="h-4 w-4 text-[#47c1e0]" />
    </button>
  </div>
</div>
              );
            })}
          </div>
        )}

        {/* observação */}
        <div className="mt-3 rounded-2xl p-3" style={itemGlass}>
          <div className="text-[12px] font-semibold" style={{ color: BRAND, opacity: 0.75 }}>
            Observação
          </div>

          <textarea
            value={cart.state.note}
            onChange={(e) => cart.setNote(e.target.value)}
            rows={2}
            placeholder="Ex: sem cebola, ponto da carne, mandar cupom fiscal..."
            className="mt-2 w-full resize-none rounded-xl border px-3 py-2 text-[13px] outline-none"
            style={{
              background: "rgba(255,255,255,0.24)",
              borderColor: "rgba(1,27,60,0.12)",
              color: BRAND,
            }}
          />
        </div>
      </div>

      {/* footer */}
      <div className="sticky bottom-0 px-4 pt-3 pb-10" style={footerGlass}>
        <div className="mb-2 flex items-center justify-between text-[13px]" style={{ color: BRAND, opacity: 0.75 }}>
          <span>Subtotal</span>
          <span className="font-semibold" style={{ color: BRAND, opacity: 1 }}>
            {brl(cart.subtotal)}
          </span>
        </div>

        <a
          href={canGoCheckout ? checkoutWithFrom : "#"}
          onClick={(e) => {
            if (!canGoCheckout) e.preventDefault();
            else cart.close();
          }}
          className={cn(
            "block w-full rounded-2xl px-4 py-3 text-center text-[14px] font-extrabold tracking-wide transition active:scale-[0.99]",
            canGoCheckout ? "" : "pointer-events-none opacity-50"
          )}
          style={{
            background: "linear-gradient(180deg, rgba(71,193,224,0.92) 0%, rgba(71,193,224,0.70) 100%)",
            color: BRAND,
            boxShadow: "0 18px 40px rgba(71,193,224,0.18), 0 0 0 1px rgba(255,255,255,0.40) inset",
          }}
        >
          Finalizar compra
        </a>

        <button
          onClick={cart.close}
          className="mt-2 w-full rounded-2xl border px-4 py-2 text-[12px] font-semibold active:scale-[0.99]"
          style={{
            background: "rgba(255,255,255,0.25)",
            border: "1px solid rgba(255,255,255,0.40)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            color: BRAND,
          }}
        >
          Continuar comprando
        </button>
      </div>
    </div>
  </div>
);
}