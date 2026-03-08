// app/p/[pizzablu]/components/cardapio.tsx
export type TabKey = "pizza" | "bebidas" | "porcoes";

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
  { key: "pizza" as const, label: "Pizzas" },
  { key: "bebidas" as const, label: "Bebidas" },
  { key: "porcoes" as const, label: "Porções" },
];

export const TAMANHOS = [
  { id: "pequena", nome: "Pizza Pequena", cm: 20, fatias: 6, preco: 38, maxSabores: 2 },
  { id: "grande", nome: "Pizza Grande", cm: 30, fatias: 12, preco: 64, maxSabores: 4 },
  { id: "familia", nome: "Pizza Família", cm: 40, fatias: 20, preco: 82, maxSabores: 4 },
] as const;

export const ADICIONAL_PREMIUM = 12;
export const PRECO_BORDA = 16;

export const BORDAS = [
  "Dois amores",
  "Chocolate branco",
  "Chocolate preto",
  "Nozes com chocolate branco",
  "Milho com bacon",
  "Requeijão cremoso",
  "Cheddar",
  "Cream cheese",
] as const;

export const SABORES_TRADICIONAIS = [
  "Calabresa",
  "4 queijos",
  "Frango com requeijão",
  "Mussarela",
  "Marguerita",
  "Milho",
  "Alho e óleo",
  "Bacon",
  "Alho poró",
  "Lombo",
  "Peito de peru",
  "Brócolis com bacon",
  "Portuguesa",
  "Tomate seco com rúcula",
  "Purê de batata com bacon",
  "Siciliana",
  "Brócolis",
  "Milho com bacon",
  "Vegetariana",
  "Capriccosa",
  "Diavola",
  "Pomodoro",
] as const;

export const SABORES_PREMIUM = [
  "Moda da casa",
  "Chicken pesto",
  "Estrogonofe de gado",
  "Estrogonofe de frango",
  "Banana crunch",
  "Prosciutto",
  "Filé com figos",
  "5 queijos",
  "Fish fries",
  "Picanha ao molho de cerveja preta",
  "Filé dueto",
  "Filé com fritas",
  "Ragú de costela",
  "Frango caipira",
  "Lombo com abacaxi",
  "Coração",
  "Mexicana",
  "Cogumelos ao molho fungi",
  "Panceta",
  "Bolonhesa",
  "Purê de abobora com costela",
  "Filé com doritos",
] as const;

export const DOCES_TRADICIONAIS = [
  "2 amores",
  "Sensação branca",
  "Sensação preta",
  "Beijinho",
  "Prestigio",
  "Chocolate branco",
  "Chocolate preto",
  "Brigadeiro",
  "Charge",
] as const;

export const DOCES_PREMIUM = [
  "Tiramisu",
  "3 chocolates",
  "Nozes",
  "Ouro branco",
  "Confete m&m",
  "2 amores especial",
  "Banana doce crocante",
  "Kinder bueno",
  "Dueto de uvas",
  "Floresta negra",
] as const;

function brlStr(v: number) {
  return `R$ ${v.toFixed(2).replace(".", ",")}`;
}

export const CARDAPIO: Record<TabKey, { title: string; items: Item[] }> = {
  pizza: {
    title: "Pizzas",
    items: [
      {
        id: "pizza_pequena",
        title: "Pizza Pequena",
        priceNum: 38,
        price: brlStr(38),
        subtitle: "20cm • 6 fatias • até 2 sabores",
        img: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?auto=format&fit=crop&w=600&q=70",
        section: "pizza",
      },
      {
        id: "pizza_grande",
        title: "Pizza Grande",
        priceNum: 64,
        price: brlStr(64),
        subtitle: "30cm • 12 fatias • até 4 sabores",
        img: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=600&q=70",
        section: "pizza",
      },
      {
        id: "pizza_familia",
        title: "Pizza Família",
        priceNum: 82,
        price: brlStr(82),
        subtitle: "40cm • 20 fatias • até 4 sabores",
        img: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=70",
        section: "pizza",
      },
    ],
  },

  bebidas: {
    title: "Bebidas",
    items: [
      { id: "coca_2l", title: "Coca-Cola 2L", price: brlStr(12), priceNum: 12, subtitle: "Refrigerante", icon: "🥤", section: "bebidas" },
      { id: "coca_lata", title: "Coca-Cola Lata", price: brlStr(6), priceNum: 6, subtitle: "350ml", icon: "🥤", section: "bebidas" },
      { id: "guarana_lata", title: "Guaraná Lata", price: brlStr(6), priceNum: 6, subtitle: "350ml", icon: "🥤", section: "bebidas" },
      { id: "agua_sem_gas", title: "Água sem gás", price: brlStr(4), priceNum: 4, subtitle: "500ml", icon: "💧", section: "bebidas" },
      { id: "agua_com_gas", title: "Água com gás", price: brlStr(5), priceNum: 5, subtitle: "500ml", icon: "💧", section: "bebidas" },
      { id: "heineken_long", title: "Heineken Long Neck", price: brlStr(10), priceNum: 10, subtitle: "330ml", icon: "🍺", section: "bebidas" },
      { id: "budweiser_long", title: "Budweiser Long Neck", price: brlStr(9), priceNum: 9, subtitle: "330ml", icon: "🍺", section: "bebidas" },
    ],
  },

  porcoes: {
    title: "Porções",
    items: [
      { id: "batata_frita", title: "Batata Frita", price: brlStr(22), priceNum: 22, subtitle: "Crocante", icon: "🍟", section: "porcoes" },
      { id: "onion_rings", title: "Onion Rings", price: brlStr(24), priceNum: 24, subtitle: "Empanado", icon: "🧅", section: "porcoes" },
      { id: "nuggets", title: "Nuggets", price: brlStr(26), priceNum: 26, subtitle: "10 unidades", icon: "🍗", section: "porcoes" },
      { id: "tiras_frango", title: "Tiras de Frango", price: brlStr(29), priceNum: 29, subtitle: "Empanadas", icon: "🍗", section: "porcoes" },

      { id: "polenta_frita", title: "Polenta Frita", price: brlStr(18), priceNum: 18, subtitle: "Sequinha e crocante", icon: "🟨", section: "porcoes" },
      { id: "mandioca_frita", title: "Mandioca Frita", price: brlStr(20), priceNum: 20, subtitle: "Dourada e macia", icon: "🥔", section: "porcoes" },
      { id: "calabresa_acebolada", title: "Calabresa Acebolada", price: brlStr(28), priceNum: 28, subtitle: "Fatiada na chapa", icon: "🥓", section: "porcoes" },
      { id: "frango_passarinho", title: "Frango a Passarinho", price: brlStr(32), priceNum: 32, subtitle: "Temperado e crocante", icon: "🍗", section: "porcoes" },
      { id: "file_tilapia", title: "Filé de Tilápia", price: brlStr(36), priceNum: 36, subtitle: "Empanado", icon: "🐟", section: "porcoes" },
      { id: "mini_pasteis", title: "Mini Pastéis", price: brlStr(27), priceNum: 27, subtitle: "Queijo e carne", icon: "🥟", section: "porcoes" },
    ],
  },
};

export const ALL_ITEMS: Item[] = [
  ...CARDAPIO.pizza.items,
  ...CARDAPIO.bebidas.items,
  ...CARDAPIO.porcoes.items,
];