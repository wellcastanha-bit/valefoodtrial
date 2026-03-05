/* =========================================
   home/page.tsx
========================================= */
"use client";

import React, { useMemo, useState } from "react";

import Local from "./components/local";
import PromotionBar, { type Tile } from "./components/promotion-bar";
import GastroBar, { type Chip } from "./components/gastro-bar";
import Lojas, { type Store } from "./components/lojas";
import Navbar, { type TabItem, type TabKey } from "./components/navbar";

export default function Page() {
  const tiles: Tile[] = useMemo(
    () => [
      { key: "promocoes", label: "Promoções", icon: "tag", badge: "Novo", ink: "rgb(236 72 68)" },
      { key: "cupons", label: "Cupons", icon: "ticket", ink: "rgb(155 81 224)" },
      { key: "gratis", label: "Entrega Grátis", icon: "truck", ink: "rgb(34 197 94)" },
      { key: "novidades", label: "Novidades", icon: "spark", ink: "rgb(59 130 246)" },
    ],
    []
  );

  const catChips: Chip[] = useMemo(
    () => [
      { key: "pizza", label: "Pizza", imgSrc: "/imagens/pizza.png" },
      { key: "burguer", label: "Burguer", imgSrc: "/imagens/burguer.png" },
      { key: "sushi", label: "Sushi", imgSrc: "/imagens/sushi.png" },
      { key: "acai", label: "Açaí", imgSrc: "/imagens/acai.png" },
      { key: "marmita", label: "Marmita", imgSrc: "/imagens/marmita.png" },
    ],
    []
  );

  const stores: Store[] = useMemo(
    () => [
      { id: "havana", name: "Havana", logoSrc: "/logo-havana.jpg", rating: 4.8, eta: "35 min", fee: "R$8,00", note: "" },
      { id: "sabordomeiodia", name: "Sabor do Meio Dia", logoSrc: "/logo-sabordomeiodia.jpg", rating: 4.6, eta: "40 min", fee: "Grátis" },
      { id: "gostinhodamanha", name: "Gostinho da Manhã", logoSrc: "/logo-gostinhodamanha.jpg", rating: 4.9, eta: "30 min", fee: "R$10,00" },
      { id: "pizzablu", name: "Pizza Blu", logoSrc: "/logo-pizzablu.png", rating: 4.8, eta: "45 min", fee: "R$ 4,99" },
      { id: "velhooeste", name: "Velho Oeste", logoSrc: "/logo-velhooeste.jpeg", rating: 4.7, eta: "50 min", fee: "R$6,00" },
    ],
    []
  );

  const tabs = useMemo(
    () =>
      [
        { key: "inicio", label: "Início", icon: "home" as const, href: "/" },
        { key: "buscar", label: "Buscar", icon: "search" as const, href: "/buscar" },
        { key: "pedidos", label: "Pedidos", icon: "receipt" as const, href: "/pedidos" },
        { key: "conta", label: "Conta", icon: "user" as const, href: "/conta" },
      ] as const satisfies readonly TabItem[],
    []
  );

  const [activeChip, setActiveChip] = useState<string>("pizza");
  const [activeTab, setActiveTab] = useState<TabKey>("inicio");

  // (por enquanto mantém igual ao seu original)
  const filteredStores = useMemo(() => stores, [stores, activeChip]);

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(980px 580px at 80% -10%, rgb(255, 255, 255), transparent 60%), radial-gradient(900px 520px at -10% 10%, rgba(1,27,60,0.05), transparent 55%), linear-gradient(180deg,#f7f8fb,#f1f4f8 70%)",
      }}
    >
      <div className="mx-auto w-full max-w-[430px] px-3 pb-24 pt-4">
        {/* 1) Endereço do cliente */}
        <Local />

        {/* 2) Filtro de promoções */}
        <PromotionBar tiles={tiles} />

        {/* 3) Filtro de gastronomia */}
        <GastroBar items={catChips} activeKey={activeChip} onPick={setActiveChip} />

        {/* 4) Lojas */}
        <Lojas stores={filteredStores} />
      </div>

      {/* 5) Nav bar */}
      <Navbar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}