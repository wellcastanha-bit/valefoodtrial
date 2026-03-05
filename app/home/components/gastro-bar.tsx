/* =========================================
   home/components/gastro-bar.tsx
========================================= */
"use client";

import React from "react";

const AQUA = "#47c1e0";

export type Chip = {
  key: string;
  label: string;
  imgSrc: string;
};

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

export default function GastroBar({
  items,
  activeKey,
  onPick,
}: {
  items: Chip[];
  activeKey: string;
  onPick: (k: string) => void;
}) {
  return (
    <div className="mt-4">
      <div className="flex gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((c) => {
          const active = activeKey === c.key;
          return (
            <button
              key={c.key}
              onClick={() => onPick(c.key)}
              className="shrink-0 text-center transition active:scale-[0.99]"
              style={{ WebkitTapHighlightColor: "transparent" }}
              aria-label={c.label}
              type="button"
            >
              <div
                className="mx-auto grid place-items-center"
                style={{
                  width: 96,
                  height: 72,
                  filter: active ? "drop-shadow(0 12px 18px rgba(0,0,0,0.16))" : "drop-shadow(0 9px 14px rgba(0,0,0,0.10))",
                  transform: active ? "translateY(-1px)" : "translateY(0)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.imgSrc} alt={c.label} className="h-full w-full object-contain select-none" draggable={false} />
              </div>

              <div className={cn("mt-2 text-[18px] font-medium tracking-[-0.02em]", active ? "text-black/90" : "text-black/70")}>
                {c.label}
              </div>

              {active && <div className="mx-auto mt-2 h-[4px] w-10 rounded-full" style={{ background: AQUA }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}