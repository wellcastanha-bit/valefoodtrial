/* =========================================
   home/components/lojas.tsx
========================================= */
"use client";

import React from "react";
import Link from "next/link";

const BRAND = "#011b3c";
const AQUA = "#47c1e0";

export type Store = {
  id: "gostinhodamanha" | "havana" | "pizzablu" | "sabordomeiodia" | "velhooeste";
  name: string;
  logoSrc: string;
  isNew?: boolean;
  rating: number;
  eta: string;
  fee: string;
  note?: string;
};

function StoreRow({ s }: { s: Store }) {
  return (
    <Link href={`/lojas/${s.id}`} className="block" style={{ WebkitTapHighlightColor: "transparent" }}>
      <div
        className="flex items-center gap-4 px-4 py-4 transition"
        style={{
          background: "#ffffff",
          border: "2px solid rgba(71,193,224,0.65)",
          borderRadius: 20,
          boxShadow: "0 8px 20px rgba(71,193,224,0.12)",
        }}
      >
        <div
          className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl"
          style={{
            background: "rgba(1,27,60,0.06)",
            border: "1px solid rgba(71,193,224,0.35)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.logoSrc} alt={`Logo ${s.name}`} className="h-full w-full object-contain select-none" draggable={false} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <div className="truncate text-[18px] font-semibold" style={{ color: BRAND }}>
              {s.name}
            </div>
            {s.isNew && <span className="shrink-0 text-[14px] font-semibold text-orange-600">novo!</span>}
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
      </div>

      <div className="h-3" />
    </Link>
  );
}

export default function Lojas({
  title = "Perto de você",
  stores,
}: {
  title?: string;
  stores: Store[];
}) {
  return (
    <>
      <div className="mt-5 text-[18px] font-semibold text-black/90">{title}</div>

      <div className="mt-3">
        {stores.map((s) => (
          <StoreRow key={s.id} s={s} />
        ))}
      </div>
    </>
  );
}