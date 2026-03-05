/* =========================================
   home/components/promotion-bar.tsx
========================================= */
"use client";

import React from "react";

const BRAND = "#011b3c";
const AQUA = "#47c1e0";

export type Tile = {
  key: "promocoes" | "cupons" | "gratis" | "novidades";
  label: string;
  icon: "tag" | "ticket" | "truck" | "spark";
  badge?: string;
  ink: string;
};

function Icon({
  name,
  className,
}: {
  name: Tile["icon"];
  className?: string;
}) {
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
        <path
          d="M3 7h11v10H3V7Z"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
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

  // spark
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

export default function PromotionBar({ tiles }: { tiles: Tile[] }) {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-4 gap-4">
        {tiles.map((t) => (
          <MenuTile key={t.key} label={t.label} icon={t.icon} />
        ))}
      </div>
    </div>
  );
}