"use client";

import React, { useEffect, useMemo, useState } from "react";
import { brl, useCart } from "../carrinho/provedor";

const BRAND = "#011b3c";
const AQUA = "#47c1e0";

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

function Icon({
  name,
  className,
  style,
}: {
  name: "x" | "back" | "pix" | "card" | "cash";
  className?: string;
  style?: React.CSSProperties;
}) {
  const common = cn("inline-block", className);

  if (name === "x")
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        style={{ color: AQUA, ...(style || {}) }}
        aria-hidden="true"
      >
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    );

  if (name === "back")
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        style={{ color: AQUA, ...(style || {}) }}
        aria-hidden="true"
      >
        <path
          d="M15 18l-6-6 6-6"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );

  if (name === "pix")
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        style={{ color: AQUA, ...(style || {}) }}
        aria-hidden="true"
      >
        <path
          d="M8.2 7.2c.8-.8 2.1-.8 2.9 0l.9.9.9-.9c.8-.8 2.1-.8 2.9 0l1.1 1.1c.8.8.8 2.1 0 2.9l-.9.9.9.9c.8.8.8 2.1 0 2.9l-1.1 1.1c-.8.8-2.1.8-2.9 0l-.9-.9-.9.9c-.8.8-2.1.8-2.9 0l-1.1-1.1c-.8-.8-.8-2.1 0-2.9l.9-.9-.9-.9c-.8-.8-.8-2.1 0-2.9l1.1-1.1z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );

  if (name === "card")
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        style={{ color: AQUA, ...(style || {}) }}
        aria-hidden="true"
      >
        <path
          d="M3.5 8.5h17"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M6 17h4.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M4.8 6.8h14.4a2 2 0 012 2v8.4a2 2 0 01-2 2H4.8a2 2 0 01-2-2V8.8a2 2 0 012-2z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      </svg>
    );

  // cash
  return (
    <svg
      className={common}
      viewBox="0 0 24 24"
      fill="none"
      style={{ color: AQUA, ...(style || {}) }}
      aria-hidden="true"
    >
      <path
        d="M6 8h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M12 10.2c1.2 0 2.2.7 2.2 1.8S13.2 13.8 12 13.8s-2.2.7-2.2 1.8.98 1.8 2.2 1.8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M12 9v6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const sheetGlass: React.CSSProperties = {
  background: "rgba(255,255,255,0.62)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.65)",
  boxShadow:
    "0 18px 48px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.75) inset",
};

const itemGlass: React.CSSProperties = {
  background: "rgba(255,255,255,0.40)",
  border: "1px solid rgba(1,27,60,0.10)",
  boxShadow: "0 10px 22px rgba(0,0,0,0.06)",
};

const inputGlass: React.CSSProperties = {
  background: "rgba(255,255,255,0.34)",
  border: "1px solid rgba(1,27,60,0.12)",
  color: BRAND,
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <div
        className="mb-1 text-[12px] font-semibold"
        style={{ color: BRAND, opacity: 0.75 }}
      >
        {label}
      </div>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-2xl px-4 text-[14px] outline-none placeholder:opacity-60"
        style={inputGlass}
      />
    </label>
  );
}

function PayOption({
  active,
  title,
  subtitle,
  icon,
  onClick,
}: {
  active: boolean;
  title: string;
  subtitle?: string;
  icon: "pix" | "card" | "cash";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition active:scale-[0.99]"
      style={{
        ...itemGlass,
        borderColor: active
          ? "rgba(71,193,224,0.55)"
          : "rgba(1,27,60,0.10)",
        background: active
          ? "rgba(71,193,224,0.16)"
          : "rgba(255,255,255,0.34)",
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="grid h-10 w-10 place-items-center rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.52)",
            border: "1px solid rgba(1,27,60,0.10)",
          }}
        >
          <Icon name={icon} className="h-5 w-5" />
        </span>

        <div className="leading-tight">
          <div className="text-[14px] font-extrabold" style={{ color: BRAND }}>
            {title}
          </div>
          {subtitle ? (
            <div
              className="text-[12px] font-semibold"
              style={{ color: BRAND, opacity: 0.55 }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>

      <span
        className="h-3.5 w-3.5 rounded-full"
        style={{
          border: `2px solid ${active ? AQUA : "rgba(1,27,60,0.22)"}`,
          background: active ? AQUA : "transparent",
          boxShadow: active ? "0 0 0 4px rgba(71,193,224,0.12)" : "none",
        }}
      />
    </button>
  );
}

function safeFrom(v: string | null) {
  const raw = (v || "").trim();
  if (!raw) return "/";
  if (!raw.startsWith("/")) return "/";
  if (raw.startsWith("//")) return "/";
  // evita loop pra checkout
  if (raw.startsWith("/checkout")) return "/";
  if (raw.startsWith("/valefood/checkout")) return "/";
  return raw;
}

export default function CheckoutPage() {
  const cart = useCart();

  // ✅ FIX HYDRATION: server e 1º render do client ficam iguais ("/"), e só depois atualiza pelo querystring
  const [backHref, setBackHref] = useState("/");

  useEffect(() => {
    const from = new URLSearchParams(window.location.search).get("from");
    setBackHref(safeFrom(from));
  }, []);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addr, setAddr] = useState("");
  const [ref, setRef] = useState("");

  const [pay, setPay] = useState<"pix" | "dinheiro" | "cartao_entrega">("pix");
  const [troco, setTroco] = useState("");

  const deliveryFee = useMemo(
    () => (cart.state.deliveryType === "entrega" ? 6 : 0),
    [cart.state.deliveryType]
  );
  const total = useMemo(
    () => cart.subtotal + deliveryFee,
    [cart.subtotal, deliveryFee]
  );

  const canSubmit = useMemo(() => {
    if (!cart.itemsCount) return false;
    if (!name.trim() || !phone.trim()) return false;
    if (cart.state.deliveryType === "entrega" && !addr.trim()) return false;
    if (
      pay === "dinheiro" &&
      troco.trim() &&
      Number(troco.replace(",", ".")) < total
    )
      return false;
    return true;
  }, [
    cart.itemsCount,
    name,
    phone,
    addr,
    pay,
    troco,
    total,
    cart.state.deliveryType,
  ]);

  function submit() {
    if (!canSubmit) return;

    const payload = {
      storeId: cart.state.storeId,
      items: cart.state.items,
      deliveryType: cart.state.deliveryType,
      note: cart.state.note,
      customer: {
        name,
        phone,
        addr: cart.state.deliveryType === "entrega" ? addr : "",
        ref,
      },
      payment: {
        method: pay,
        changeFor: pay === "dinheiro" ? troco : "",
      },
      pricing: { subtotal: cart.subtotal, deliveryFee, total },
      createdAt: new Date().toISOString(),
    };

    console.log("CHECKOUT_PAYLOAD", payload);

    cart.clear();
    window.location.href = "/valefood/success";
  }

  return (
    <div
      className="min-h-screen px-3 py-4"
      style={{
        paddingTop: "env(safe-area-inset-top)", // ✅ pega notch/top safe area
        background:
          "radial-gradient(1200px 700px at 50% -10%, rgba(71,193,224,0.20) 0%, rgba(0,0,0,0) 55%), linear-gradient(180deg, #f7fbff 0%, #eef6fb 100%)",
      }}
    >
      <div className="mx-auto w-full max-w-[520px]">
        {/* top */}
        <div className="mb-3 flex items-center justify-between px-1">
          <a
            href={backHref}
            className="grid h-11 w-11 place-items-center rounded-2xl active:scale-[0.98]"
            style={{
              background: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(1,27,60,0.10)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
            aria-label="Voltar"
          >
            <Icon name="back" className="h-6 w-6" />
          </a>

          <div className="text-right leading-tight">
            <div className="text-[16px] font-extrabold" style={{ color: BRAND }}>
              {/* sem texto */}
            </div>
            <div
              className="text-[12px] font-semibold"
              style={{ color: BRAND, opacity: 0.55 }}
            >
              {/* sem texto */}
            </div>
          </div>
        </div>

        {!cart.itemsCount ? (
          <div className="rounded-[28px] p-5 text-center" style={sheetGlass}>
            <div
              className="text-[14px] font-semibold"
              style={{ color: BRAND, opacity: 0.7 }}
            >
              Seu carrinho está vazio.
            </div>
          </div>
        ) : (
          <div className="rounded-[28px] p-4" style={sheetGlass}>
            {/* header like cart */}
            <div className="mb-3 flex items-center justify-between">
              <div className="leading-tight">
                <div className="text-[15px] font-extrabold" style={{ color: BRAND }}>
                  Finalizar compra
                </div>
                <div
                  className="text-[12px] font-semibold"
                  style={{ color: BRAND, opacity: 0.55 }}
                >
                  Confirme seus dados e pagamento
                </div>
              </div>

              <a
                href={backHref}
                className="grid h-10 w-10 place-items-center rounded-2xl active:scale-[0.98]"
                style={{
                  background: "rgba(255,255,255,0.52)",
                  border: "1px solid rgba(1,27,60,0.10)",
                }}
                aria-label="Fechar"
                title="Fechar"
              >
                <Icon name="x" className="h-5 w-5" />
              </a>
            </div>

            <div className="grid gap-3">
              {/* cliente */}
              <div className="rounded-2xl p-3" style={itemGlass}>
                <div className="mb-2 text-[13px] font-extrabold" style={{ color: BRAND }}>
                  Dados do cliente
                </div>

                <div className="grid gap-3">
                  <Field
                    label="Nome"
                    value={name}
                    onChange={setName}
                    placeholder="Seu nome"
                    autoComplete="name"
                  />
                  <Field
                    label="Telefone"
                    value={phone}
                    onChange={setPhone}
                    placeholder="(00) 00000-0000"
                    autoComplete="tel"
                  />

                  {cart.state.deliveryType === "entrega" ? (
                    <>
                      <Field
                        label="Endereço"
                        value={addr}
                        onChange={setAddr}
                        placeholder="Rua, número, bairro"
                        autoComplete="street-address"
                      />
                      <Field
                        label="Referência"
                        value={ref}
                        onChange={setRef}
                        placeholder="Ex: portão azul, perto do mercado"
                      />
                    </>
                  ) : null}
                </div>
              </div>

              {/* pagamento */}
              <div className="rounded-2xl p-3" style={itemGlass}>
                <div className="mb-2 text-[13px] font-extrabold" style={{ color: BRAND }}>
                  Pagamento
                </div>

                <div className="grid gap-2">
                  <PayOption
                    active={pay === "pix"}
                    title="PIX"
                    subtitle="Pague instantaneamente"
                    icon="pix"
                    onClick={() => setPay("pix")}
                  />
                  <PayOption
                    active={pay === "cartao_entrega"}
                    title="Cartão na entrega"
                    subtitle="Crédito/Débito na maquininha"
                    icon="card"
                    onClick={() => setPay("cartao_entrega")}
                  />
                  <PayOption
                    active={pay === "dinheiro"}
                    title="Dinheiro"
                    subtitle="Precisa de troco?"
                    icon="cash"
                    onClick={() => setPay("dinheiro")}
                  />

                  {pay === "dinheiro" ? (
                    <div className="mt-2">
                      <Field
                        label="Troco para quanto?"
                        value={troco}
                        onChange={setTroco}
                        placeholder="Ex: 100"
                        type="text"
                      />
                    </div>
                  ) : null}
                </div>
              </div>

              {/* resumo */}
              <div className="rounded-2xl p-3" style={itemGlass}>
                <div className="mb-2 text-[13px] font-extrabold" style={{ color: BRAND }}>
                  Resumo
                </div>

                <div
                  className="space-y-2 text-[13px] font-semibold"
                  style={{ color: BRAND, opacity: 0.75 }}
                >
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span style={{ color: BRAND, opacity: 1 }}>{brl(cart.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Taxa de entrega</span>
                    <span style={{ color: BRAND, opacity: 1 }}>{brl(deliveryFee)}</span>
                  </div>
                  <div className="h-px" style={{ background: "rgba(1,27,60,0.10)" }} />
                  <div className="flex items-center justify-between">
                    <span style={{ color: BRAND, opacity: 0.9 }}>Total</span>
                    <span className="text-[16px] font-extrabold" style={{ color: BRAND }}>
                      {brl(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* footer like cart */}
            <div
              className="mt-4 border-t px-1 pt-3 pb-8"
              style={{
                borderColor: "rgba(1,27,60,0.10)",
              }}
            >
              <button
                onClick={submit}
                disabled={!canSubmit}
                className="w-full rounded-2xl px-4 py-3 text-[14px] font-extrabold tracking-wide active:scale-[0.99] disabled:opacity-100"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(71,193,224,0.92) 0%, rgba(71,193,224,0.70) 100%)",
                  color: BRAND,
                  boxShadow:
                    "0 18px 40px rgba(71,193,224,0.18), 0 0 0 1px rgba(255,255,255,0.40) inset",
                }}
              >
                Finalizar pedido
              </button>

              <a
                href={backHref}
                className="mt-2 block w-full rounded-2xl border px-4 py-2 text-center text-[12px] font-semibold active:scale-[0.99]"
                style={{
                  background: "rgb(230, 230, 230)",
                  border: "1px solid rgba(255,255,255,0.40)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  color: BRAND,
                }}
              >
                Continuar comprando
              </a>

              <div
                className="mt-2 text-center text-[11px] font-semibold"
                style={{ color: BRAND, opacity: 0.45 }}
              >
                {/* sem texto */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}