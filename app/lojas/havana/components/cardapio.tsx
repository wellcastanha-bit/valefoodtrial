// app/p/[pizzablu]/components/cardapio.tsx

export type TabKey = "hamburgers" | "porcoes" | "bebidas" | "sucos" | "cervejas";

export type Item = {
  id: string;
  title: string;
  priceNum: number;
  price: string;
  subtitle?: string;
  img?: string;
  icon?: string;
  section: TabKey;
};

export const BRAND = "#011b3c";
export const AQUA = "#4fdcff";

export const TABS = [
  { key: "hamburgers" as const, label: "Burgers" },
  { key: "porcoes" as const, label: "Porções" },
  { key: "bebidas" as const, label: "Bebidas" },
  { key: "sucos" as const, label: "Sucos" },
  { key: "cervejas" as const, label: "Cervejas" },
];

function brlStr(v: number) {
  return `R$ ${v.toFixed(2).replace(".", ",")}`;
}

export const CARDAPIO: Record<TabKey, { title: string; items: Item[] }> = {
  hamburgers: {
    title: "Burgers",
    items: [
      {
        id: "hav_mignon",
        title: "Havana Mignon",
        priceNum: 34,
        price: brlStr(34),
        subtitle: "Pão, molho da casa, alface, tomate, bifes de mignon e cebola.",
        img: "/havana/havana-mignon.webp",
        section: "hamburgers",
      },
      {
        id: "hav_piu_piu",
        title: "Havana Piu-Piu",
        priceNum: 27,
        price: brlStr(27),
        subtitle: "Pão, peito de frango grelhado, queijo mussarela, alface e tomate.",
        img: "/havana/havana-piupiu.webp",
        section: "hamburgers",
      },
      {
        id: "hav_burguer",
        title: "Havana Burguer",
        priceNum: 25,
        price: brlStr(25),
        subtitle: "Pão, molho da casa, hambúrguer e queijo mussarela.",
        img: "/havana/havana-burger.webp",
        section: "hamburgers",
      },
      {
        id: "hav_monstrao",
        title: "Havana Monstrão",
        priceNum: 49,
        price: brlStr(49),
        subtitle:
          "Pão, molho da casa, alface, 2 hambúrgueres, bifes de mignon, queijo cheddar e queijo mussarela.",
        img: "/havana/havana-monstrao.webp",
        section: "hamburgers",
      },
      {
        id: "hav_double",
        title: "Havana Doublé",
        priceNum: 37,
        price: brlStr(37),
        subtitle:
          "Pão, molho da casa, hambúrguer duplo, ovos, queijo cheddar, alface, tomate e cebola.",
        img: "/havana/havana-double.webp",
        section: "hamburgers",
      },
      {
        id: "hav_frango",
        title: "Havana Frango",
        priceNum: 29,
        price: brlStr(29),
        subtitle: "Pão, peito de frango empanado, queijo mussarela, alface e tomate.",
        img: "/havana/logo-havana.jpg",
        section: "hamburgers",
      },
      {
        id: "hav_double_smash",
        title: "Havana Double Smash",
        priceNum: 34,
        price: brlStr(34),
        subtitle: "Pão, molho da casa, cebola, 2 hambúrgueres e queijo cheddar.",
        img: "/havana/logo-havana.jpg",
        section: "hamburgers",
      },
      {
        id: "hav_costela",
        title: "Havana Costela",
        priceNum: 34,
        price: brlStr(34),
        subtitle:
          "Pão, hambúrguer de costela, bacon em tiras, queijo mussarela, alface e tomate.",
        img: "/havana/havana-costela.webp",
        section: "hamburgers",
      },
      {
        id: "hav_radite",
        title: "Havana Radite",
        priceNum: 36,
        price: brlStr(36),
        subtitle:
          "Pão, molho da casa, cebola, rúcula/radite, hambúrguer recheado com queijo e pedacinhos de mignon.",
        img: "/havana/havana-radite.webp",
        section: "hamburgers",
      },
      {
        id: "hav_picanha",
        title: "Havana Picanha",
        priceNum: 39,
        price: brlStr(39),
        subtitle:
          "Pão, molho da casa, hambúrguer, tiras de picanha, queijo, rúcula, tomate e cebola.",
        img: "/havana/havana-picanha.webp",
        section: "hamburgers",
      },
      {
        id: "hav_fire",
        title: "Havana Fire",
        priceNum: 42,
        price: brlStr(42),
        subtitle:
          "Pão, molho da casa, rúcula, hambúrguer, bacon trançado no queijo cheddar, cebola e geléia de pimenta.",
        img: "/havana/havana-fire.webp",
        section: "hamburgers",
      },
    ],
  },

  porcoes: {
    title: "Porções",
    items: [
      {
        id: "por_tilapia",
        title: "Porção de Tilápia",
        priceNum: 43,
        price: brlStr(43),
        subtitle: "Deliciosa porção de tilápia. Porção de 350g.",
        img: "/havana/tilapia.webp",
        section: "porcoes",
      },
      {
        id: "por_tabua_carnes",
        title: "Tábua de Carnes",
        priceNum: 84,
        price: brlStr(84),
        subtitle: "Frango, coraçãozinho, picanha e calabresa.",
        img: "/havana/tabua.webp",
        section: "porcoes",
      },
      {
        id: "por_tulipinhas",
        title: "Porção Tulipinhas",
        priceNum: 32,
        price: brlStr(32),
        subtitle: "14 unidades nessa porção saborosa.",
        img: "/havana/logo-havana.jpg",
        section: "porcoes",
      },
      {
        id: "por_fritas_molho",
        title: "Porção de Fritas com Molho",
        priceNum: 41,
        price: brlStr(41),
        subtitle: "Batatas fritas palito crocantes com molho da casa.",
        img: "/havana/batata-frita.webp",
        section: "porcoes",
      },
      {
        id: "por_frango_passarinho",
        title: "Frango à Passarinho",
        priceNum: 35,
        price: brlStr(35),
        subtitle: "Saborosa porção de frango à passarinho.",
        img: "/havana/frango-passarinho.webp",
        section: "porcoes",
      },
      {
        id: "por_batatas_fritas",
        title: "Porção de Batatas Fritas",
        priceNum: 36,
        price: brlStr(36),
        subtitle: "Batatas fritas crocantes.",
        img: "/havana/batata-frita.webp",
        section: "porcoes",
      },
    ],
  },

  bebidas: {
    title: "Bebidas",
    items: [
      {
        id: "beb_coca_350",
        title: "Coca-Cola Original 350ml",
        priceNum: 7,
        price: brlStr(7),
        subtitle: "Lata 350ml",
        img: "/bebidas/coca-lata.webp",
        section: "bebidas",
      },
      {
        id: "beb_coca_600",
        title: "Coca-Cola Original 600ml",
        priceNum: 9,
        price: brlStr(9),
        subtitle: "Garrafa 600ml",
        img: "/bebidas/coca-600.webp",
        section: "bebidas",
      },
      {
        id: "beb_coca_2l",
        title: "Coca-Cola 2L",
        priceNum: 16,
        price: brlStr(16),
        subtitle: "Garrafa 2L",
        img: "/bebidas/coca-2l.webp",
        section: "bebidas",
      },
      {
        id: "beb_agua_sem_gas",
        title: "Água sem Gás",
        priceNum: 4,
        price: brlStr(4),
        subtitle: "Garrafa 500ml",
        img: "/bebidas/agua-sem-gas.webp",
        section: "bebidas",
      },
      {
        id: "beb_agua_com_gas",
        title: "Água com Gás",
        priceNum: 4,
        price: brlStr(4),
        subtitle: "Garrafa 500ml",
        img: "/bebidas/agua-com-gas.webp",
        section: "bebidas",
      },
      {
        id: "beb_guarana_lata",
        title: "Guaraná Antárctica Lata",
        priceNum: 7,
        price: brlStr(7),
        subtitle: "Lata 350ml",
        img: "/bebidas/guarana-lata.webp",
        section: "bebidas",
      },
      {
        id: "beb_fanta_uva_lata",
        title: "Fanta Uva Lata",
        priceNum: 7,
        price: brlStr(7),
        subtitle: "Lata 350ml",
        img: "/bebidas/fanta-uva.webp",
        section: "bebidas",
      },
      {
        id: "beb_fanta_laranja_lata",
        title: "Fanta Laranja Lata",
        priceNum: 7,
        price: brlStr(7),
        subtitle: "Lata 350ml",
        img: "/bebidas/fanta-laranja.webp",
        section: "bebidas",
      },
      {
        id: "beb_itubaina_lata",
        title: "Itubaína Lata",
        priceNum: 7,
        price: brlStr(7),
        subtitle: "Lata 350ml",
        img: "/bebidas/itubaina.webp",
        section: "bebidas",
      },
      {
        id: "beb_sprite_lata",
        title: "Sprite Lata",
        priceNum: 7,
        price: brlStr(7),
        subtitle: "Lata 350ml",
        img: "/bebidas/sprite-lata.webp",
        section: "bebidas",
      },
      
    ],
  },

  sucos: {
    title: "Sucos",
    items: [
      {
        id: "suc_manga",
        title: "Suco Del Valle Manga",
        priceNum: 7,
        price: brlStr(7),
        subtitle: "290ml",
        img: "/havana/logo-havana.jpg",
        section: "sucos",
      },
      {
        id: "suc_goiaba",
        title: "Suco Del Valle Goiaba",
        priceNum: 7,
        price: brlStr(7),
        subtitle: "290ml",
        img: "/bebidas/delvalle-goiaba.webp",
        section: "sucos",
      },
      {
        id: "suc_pessego",
        title: "Suco Del Valle Pêssego",
        priceNum: 7,
        price: brlStr(7),
        subtitle: "290ml",
        img: "/bebidas/delvalle-pessego.webp",
        section: "sucos",
      },
      {
        id: "suc_uva",
        title: "Suco Del Valle Uva",
        priceNum: 7,
        price: brlStr(7),
        subtitle: "290ml",
        img: "/bebidas/delvalle-uva.webp",
        section: "sucos",
      },
    ],
  },

  cervejas: {
    title: "Cervejas",
    items: [
      {
        id: "cer_bud",
        title: "Budweiser 330ml",
        priceNum: 12,
        price: brlStr(12),
        subtitle: "Produto para maiores de 18 anos",
        img: "/bebidas/budweiser-long.webp",
        section: "cervejas",
      },
      {
        id: "cer_heineken",
        title: "Heineken 330ml",
        priceNum: 12,
        price: brlStr(12),
        subtitle: "Produto para maiores de 18 anos",
        img: "/bebidas/heineken-long.webp",
        section: "cervejas",
      },
      {
        id: "cer_corona",
        title: "Corona 330ml",
        priceNum: 12,
        price: brlStr(12),
        subtitle: "Produto para maiores de 18 anos",
        img: "/bebidas/corona-long.webp",
        section: "cervejas",
      },
      {
        id: "cer_sol",
        title: "Sol Premium 330ml",
        priceNum: 12,
        price: brlStr(12),
        subtitle: "Produto para maiores de 18 anos",
        img: "/bebidas/sol-long.webp",
        section: "cervejas",
      },
       {
        id: "cer_eisenbahn",
        title: "Eisenbahn 330ml",
        priceNum: 12,
        price: brlStr(12),
        subtitle: "Produto para maiores de 18 anos",
        img: "/bebidas/eisenbahn-long.webp",
        section: "cervejas",
      },
    ],
  },
};

export const ALL_ITEMS: Item[] = [
  ...CARDAPIO.hamburgers.items,
  ...CARDAPIO.porcoes.items,
  ...CARDAPIO.bebidas.items,
  ...CARDAPIO.sucos.items,
  ...CARDAPIO.cervejas.items,
];