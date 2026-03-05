/* =========================================
   home/components/navbar.tsx
========================================= */
"use client";

import React from "react";
import Link from "next/link";

const BRAND = "#011b3c";
const AQUA = "#47c1e0";

export type TabKey = "inicio" | "buscar" | "pedidos" | "conta";

export type TabItem = {
  key: TabKey;
  label: string;
  icon: "home" | "search" | "receipt" | "user";
  href: string;
};

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

function Icon({
  name,
  className,
}: {
  name: TabItem["icon"];
  className?: string;
}) {
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
        <path d="M9 7h6M9 11h6M9 15h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );

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
}

export default function Navbar({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: readonly TabItem[];
  activeTab: TabKey;
  onTabChange: (k: TabKey) => void;
}) {
  return (
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
                  onClick={() => onTabChange(it.key)}
                  className="py-1.5 text-center transition active:scale-[0.97]"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  <div className="mx-auto grid h-8 w-8 place-items-center" style={{ color: isActive ? BRAND : "rgba(0,0,0,0.45)" }}>
                    <Icon name={it.icon} className="h-5 w-5" />
                  </div>

                  <div
                    className={cn("text-[12px]", isActive ? "font-extrabold" : "font-medium")}
                    style={{ color: isActive ? BRAND : "rgba(0,0,0,0.6)" }}
                  >
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
  );
}