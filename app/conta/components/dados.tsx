"use client";

import React, { useMemo, useState } from "react";

const BRAND = "#011b3c";
const AQUA = "#47c1e0";

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
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
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-[15px] outline-none"
        />
      </div>
    </div>
  );
}

function maskPhoneBR(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  const p1 = d.slice(0, 2);
  const p2 = d.slice(2, 7);
  const p3 = d.slice(7, 11);
  if (d.length <= 2) return p1 ? `(${p1}` : "";
  if (d.length <= 7) return `(${p1}) ${p2}`;
  return `(${p1}) ${p2}-${p3}`;
}

function maskCPF(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 9);
  const e = d.slice(9, 11);
  if (d.length <= 3) return a;
  if (d.length <= 6) return `${a}.${b}`;
  if (d.length <= 9) return `${a}.${b}.${c}`;
  return `${a}.${b}.${c}-${e}`;
}

function maskDateBR(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 8); // ddmmyyyy
  const dd = d.slice(0, 2);
  const mm = d.slice(2, 4);
  const yy = d.slice(4, 8);
  if (d.length <= 2) return dd;
  if (d.length <= 4) return `${dd}/${mm}`;
  return `${dd}/${mm}/${yy}`;
}

export default function Dados() {
  // ✅ 3 alterações:
  // 1) removeu o card azul (profile summary)
  // 2) removeu a seção Preferências (Endereços / Formas de pagamento)
  // 3) adicionou CPF e Data de nascimento

  const [name, setName] = useState("Seu Nome");
  const [phone, setPhone] = useState("(49) 9xxxx-xxxx");
  const [email, setEmail] = useState("seuemail@email.com");

  const [cpf, setCpf] = useState("");
  const [birth, setBirth] = useState("");

  const phoneMasked = useMemo(() => maskPhoneBR(phone), [phone]);
  const cpfMasked = useMemo(() => maskCPF(cpf), [cpf]);
  const birthMasked = useMemo(() => maskDateBR(birth), [birth]);

  return (
    <div
      className="rounded-3xl px-3 py-3"
      style={{
        background: "rgba(255,255,255,0.60)",
        border: "2px solid rgba(71,193,224,0.35)",
        boxShadow: "0 10px 24px rgba(1,27,60,0.06)",
      }}
    >
      {/* Form */}
      <Field
        label="Nome"
        value={name}
        onChange={setName}
        placeholder="Seu nome"
      />

      <Field
        label="Telefone"
        value={phoneMasked}
        onChange={setPhone}
        placeholder="(00) 00000-0000"
        type="tel"
      />

      <Field
        label="E-mail"
        value={email}
        onChange={setEmail}
        placeholder="seuemail@email.com"
        type="email"
      />

      <Field
        label="CPF"
        value={cpfMasked}
        onChange={setCpf}
        placeholder="000.000.000-00"
        type="text"
      />

      <Field
        label="Data de nascimento"
        value={birthMasked}
        onChange={setBirth}
        placeholder="DD/MM/AAAA"
        type="text"
      />

      {/* Save */}
      <button
        type="button"
        className="mt-5 w-full rounded-2xl px-4 py-3 font-extrabold transition active:scale-[0.99]"
        style={{
          background: BRAND,
          color: "white",
          border: `2px solid ${AQUA}`,
          boxShadow: "0 14px 30px rgba(1,27,60,0.22)",
          WebkitTapHighlightColor: "transparent",
        }}
        onClick={() => alert("Salvo (mock)")}
      >
        Salvar alterações
      </button>
    </div>
  );
}