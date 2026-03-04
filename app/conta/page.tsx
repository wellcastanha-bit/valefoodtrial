"use client";

import React, { useMemo, useState } from "react";

import Dados from "./components/dados";
import Enderecos from "./components/enderecos";
import Ajuda from "./components/ajuda";

const BRAND = "#011b3c";
const AQUA = "#47c1e0";

type Key = "dados" | "enderecos" | "ajuda";

function Chevron({ open }: { open: boolean }) {
  return (
    <div
      className="grid h-10 w-10 place-items-center rounded-full transition"
      style={{
        background: BRAND,
        border: `2px solid ${AQUA}`,
        transform: open ? "rotate(90deg)" : "rotate(0deg)", // aberto = seta pra baixo
      }}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#47c1e0]" fill="none">
        <path
          d="M9 18l6-6-6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function Row({
  title,
  subtitle,
  open,
  onToggle,
}: {
  title: string;
  subtitle?: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="block w-full text-left"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <div
        className="flex items-center justify-between gap-3 px-4 py-4 transition active:scale-[0.99]"
        style={{
          background: "#fff",
          border: "2px solid rgba(71,193,224,0.55)",
          borderRadius: 20,
          boxShadow: "0 8px 18px rgba(71,193,224,0.10)",
        }}
      >
        <div className="min-w-0">
          <div className="truncate text-[16px] font-extrabold" style={{ color: BRAND }}>
            {title}
          </div>
          {subtitle && (
            <div className="mt-1 truncate text-[13px] text-black/60">{subtitle}</div>
          )}
        </div>
        <Chevron open={open} />
      </div>
    </button>
  );
}

export default function Page() {
  const [openKey, setOpenKey] = useState<Key | null>(null);

  const items = useMemo(
    () => [
      { key: "dados" as const, title: "Meus dados", subtitle: "Nome, telefone e preferências" },
      { key: "enderecos" as const, title: "Endereços", subtitle: "Casa, trabalho e outros" },
      { key: "ajuda" as const, title: "Ajuda", subtitle: "Dúvidas e suporte" },
    ],
    []
  );

  function toggle(k: Key) {
    setOpenKey((cur) => (cur === k ? null : k));
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(980px 580px at 80% -10%, rgb(255, 255, 255), transparent 60%), radial-gradient(900px 520px at -10% 10%, rgba(1,27,60,0.05), transparent 55%), linear-gradient(180deg,#f7f8fb,#f1f4f8 70%)",
      }}
    >
        
      <div className="mx-auto w-full max-w-[430px] px-3 pb-24 pt-4">
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
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6 text-[#47c1e0]"
      fill="none"
    >
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
      Conta
    </div>

    <div className="mt-1 text-[14px] text-black/60">
      Gerencie seu perfil e preferências
    </div>
  </div>
</div>
       
        {/* Profile card */}
        <div
          className="mt-4 rounded-3xl px-5 py-5"
          style={{
            background: BRAND,
            border: `2px solid ${AQUA}`,
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="grid h-14 w-14 place-items-center rounded-2xl text-[22px]"
              style={{
                background: "#012445",
                border: `1.5px solid ${AQUA}`,
                color: AQUA,
              }}
            >
              
            </div>
            <div className="min-w-0">
              <div className="truncate text-[18px] font-extrabold text-white">Welton Castanha</div>
              <div className="mt-1 truncate text-[13px] text-white/60">(49) 98902-4624</div>
            </div>
          </div>

        </div>

        <div className="mt-4 space-y-3">
          {items.map((it) => {
            const isOpen = openKey === it.key;
            return (
              <div key={it.key}>
                <Row
                  title={it.title}
                  subtitle={it.subtitle}
                  open={isOpen}
                  onToggle={() => toggle(it.key)}
                />

                {isOpen && (
                  <div className="mt-2">
                    {it.key === "dados" && <Dados />}
                    {it.key === "enderecos" && <Enderecos />}
                    {it.key === "ajuda" && <Ajuda />}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}