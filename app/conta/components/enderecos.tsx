"use client";

import React, { useMemo, useState } from "react";

const BRAND = "#011b3c";
const AQUA = "#47c1e0";

function Icon({
  name,
  className,
}: {
  name: "plus" | "pin";
  className?: string;
}) {
  if (name === "plus")
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none">
        <path
          d="M12 5v14M5 12h14"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    );

  // pin
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 10.5a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AddressCard({
  title,
  line1,
  line2,
  tag,
  onEdit,
  onDelete,
}: {
  title: string;
  line1: string;
  line2?: string;
  tag?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div
      className="rounded-3xl px-5 py-5"
      style={{
        background: "#fff",
        border: "2px solid rgba(71,193,224,0.55)",
        boxShadow: "0 10px 22px rgba(71,193,224,0.08)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div
              className="truncate text-[18px] font-extrabold"
              style={{ color: BRAND }}
            >
              {title}
            </div>
            {tag && (
              <span
                className="shrink-0 rounded-full px-2 py-1 text-[12px] font-extrabold"
                style={{ background: "rgba(71,193,224,0.14)", color: BRAND }}
              >
                {tag}
              </span>
            )}
          </div>
          <div className="mt-2 text-[14px] text-black/70">{line1}</div>
          {line2 && <div className="mt-1 text-[13px] text-black/60">{line2}</div>}
        </div>

        <div
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full"
          style={{ background: BRAND, border: `2px solid ${AQUA}` }}
        >
          <Icon name="pin" className="h-6 w-6 text-[#47c1e0]" />
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 rounded-2xl px-4 py-3 text-[14px] font-extrabold transition active:scale-[0.99]"
          style={{
            background: BRAND,
            color: "white",
            border: `2px solid ${AQUA}`,
            WebkitTapHighlightColor: "transparent",
          }}
        >
          Editar
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="flex-1 rounded-2xl px-4 py-3 text-[14px] font-extrabold transition active:scale-[0.99]"
          style={{
            background: "#fff",
            color: "#991b1b",
            border: "2px solid rgba(239,68,68,0.35)",
            boxShadow: "0 10px 22px rgba(0,0,0,0.06)",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          Excluir
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="mt-4">
      <div
        className="text-[12px] font-extrabold tracking-[0.12em]"
        style={{ color: BRAND }}
      >
        {label.toUpperCase()}
      </div>

      <div
        className="mt-2 rounded-2xl px-4 py-3"
        style={{
          background: "#fff",
          border: "2px solid rgba(71,193,224,0.55)",
          boxShadow: "0 10px 22px rgba(0,0,0,0.06)",
        }}
      >
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-[15px] outline-none"
        />
      </div>
    </div>
  );
}

export default function Enderecos({
  onClose,
}: {
  onClose?: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [label, setLabel] = useState("Casa");
  const [street, setStreet] = useState("Rua Principal, 123");
  const [details, setDetails] = useState("Apto 202 • Centro");

  const [items, setItems] = useState(
    () =>
      [
        { title: "Casa", line1: "Rua Principal, 123", line2: "Apto 202 • Centro", tag: "Padrão" },
        { title: "Trabalho", line1: "Av. Central, 500", line2: "Sala 12 • Bairro Industrial" },
      ] as Array<{ title: string; line1: string; line2?: string; tag?: string }>
  );

  const openNew = () => {
    setEditingIndex(null);
    setLabel("Casa");
    setStreet("");
    setDetails("");
    setShowForm(true);
  };

  const openEdit = (i: number) => {
    const it = items[i];
    setEditingIndex(i);
    setLabel(it.title);
    setStreet(it.line1);
    setDetails(it.line2 ?? "");
    setShowForm(true);
  };

  const save = () => {
    const next = {
      title: label.trim() || "Endereço",
      line1: street.trim(),
      line2: details.trim() || undefined,
    };
    if (!next.line1) return alert("Preencha o endereço (rua/número).");

    setItems((old) => {
      if (editingIndex === null) return [...old, next];
      const copy = [...old];
      copy[editingIndex] = { ...copy[editingIndex], ...next };
      return copy;
    });

    setShowForm(false);
    setEditingIndex(null);
  };

  const remove = (i: number) => {
    setItems((old) => old.filter((_, idx) => idx !== i));
  };

  const subtitle = useMemo(() => "Casa, trabalho e outros", []);

  return (
    <div
      className="rounded-3xl px-3 py-3"
      style={{
        background: "rgba(255,255,255,0.60)",
        border: "2px solid rgba(71,193,224,0.35)",
        boxShadow: "0 10px 24px rgba(1,27,60,0.06)",
      }}
    >
      {/* Header interno do card (sem voltar) */}
      <div className="flex items-center justify-between gap-3 px-2 pt-2">
        <div className="min-w-0">
          <div className="text-[16px] font-extrabold" style={{ color: BRAND }}>
            Endereços
          </div>
          <div className="mt-1 text-[13px] text-black/60">{subtitle}</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openNew}
            className="grid h-11 w-11 place-items-center rounded-2xl transition active:scale-[0.98]"
            style={{
              background: BRAND,
              border: `2px solid ${AQUA}`,
              WebkitTapHighlightColor: "transparent",
            }}
            aria-label="Adicionar endereço"
          >
            <Icon name="plus" className="h-6 w-6 text-[#47c1e0]" />
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl px-3 py-2 text-[13px] font-extrabold transition active:scale-[0.98]"
              style={{
                background: "rgba(1,27,60,0.06)",
                color: BRAND,
                border: "2px solid rgba(71,193,224,0.35)",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              Fechar
            </button>
          )}
        </div>
      </div>

      {/* List */}
      {!showForm && (
        <div className="mt-4 space-y-3">
          {items.map((a, i) => (
            <AddressCard
              key={`${a.title}-${i}`}
              title={a.title}
              line1={a.line1}
              line2={a.line2}
              tag={a.tag}
              onEdit={() => openEdit(i)}
              onDelete={() => remove(i)}
            />
          ))}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="mt-4">
          <div
            className="rounded-3xl px-5 py-5"
            style={{
              background: "#fff",
              border: "2px solid rgba(71,193,224,0.55)",
              boxShadow: "0 10px 22px rgba(0,0,0,0.06)",
            }}
          >
            <div className="text-[18px] font-extrabold" style={{ color: BRAND }}>
              {editingIndex === null ? "Novo endereço" : "Editar endereço"}
            </div>
            <div className="mt-1 text-[13px] text-black/60">
              Preencha os dados para salvar
            </div>

            <Field
              label="Rótulo"
              value={label}
              onChange={setLabel}
              placeholder="Ex: Casa, Trabalho..."
            />
            <Field
              label="Endereço"
              value={street}
              onChange={setStreet}
              placeholder="Rua, número, bairro..."
            />
            <Field
              label="Complemento"
              value={details}
              onChange={setDetails}
              placeholder="Apto, bloco, referência..."
            />

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingIndex(null);
                }}
                className="flex-1 rounded-2xl px-4 py-3 text-[14px] font-extrabold transition active:scale-[0.99]"
                style={{
                  background: "#fff",
                  color: "rgba(0,0,0,0.75)",
                  border: "2px solid rgba(0,0,0,0.10)",
                  boxShadow: "0 10px 22px rgba(0,0,0,0.06)",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={save}
                className="flex-1 rounded-2xl px-4 py-3 text-[14px] font-extrabold transition active:scale-[0.99]"
                style={{
                  background: BRAND,
                  color: "white",
                  border: `2px solid ${AQUA}`,
                  boxShadow: "0 14px 30px rgba(1,27,60,0.22)",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}