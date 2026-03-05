/* =========================================
   home/components/local.tsx
========================================= */
"use client";

import React from "react";

const BRAND = "#011b3c";
const AQUA = "#47c1e0";

function Icon({
  name,
  className,
}: {
  name: "pin" | "bell" | "chev";
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
        <path d="M10 21a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );

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
}

export default function Local({
  addressTitle = "Entregar em",
  addressText = "Rua Getúlio Vargas - 1075",
  onAddressClick,
  onBellClick,
  hasNotification = true,
}: {
  addressTitle?: string;
  addressText?: string;
  onAddressClick?: () => void;
  onBellClick?: () => void;
  hasNotification?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <button
        className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-4 py-3"
        style={{ background: BRAND, border: `2px solid ${AQUA}`, WebkitTapHighlightColor: "transparent" }}
        type="button"
        onClick={onAddressClick}
      >
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#012445] text-[#47c1e0]">
          <Icon name="pin" className="h-5 w-5" />
        </div>

        <div className="min-w-0 text-left">
          <div className="text-[12px] text-white/60">{addressTitle}</div>
          <div className="truncate text-[15px] font-semibold text-white">{addressText}</div>
        </div>

        <Icon name="chev" className="h-5 w-5 text-[#47c1e0]" />
      </button>

      <button
        className="relative grid h-15 w-15 place-items-center rounded-2xl"
        style={{ background: BRAND, border: `2px solid ${AQUA}`, WebkitTapHighlightColor: "transparent" }}
        type="button"
        onClick={onBellClick}
        aria-label="Notificações"
      >
        <Icon name="bell" className="h-6 w-6 text-[#47c1e0]" />
        {hasNotification && (
          <span className="absolute -right-1 -top-1 grid h-3.5 w-3.5 place-items-center rounded-full bg-[#47c1e0]" />
        )}
      </button>
    </div>
  );
}