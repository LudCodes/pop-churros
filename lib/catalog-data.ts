export type KitComponent = {
  name: string;
  image: string;
  quantity: number;
};

export type CatalogProduct = {
  id: string;
  name: string;
  image: string;
  price: number;
  type: 'Aluguel' | 'Venda';
  categoryId: string;
  isKit?: boolean;
  kitComponents?: KitComponent[];
};

export type CatalogCategory = {
  id: string;
  name: string;
  count: number;
};

export const categories: CatalogCategory[] = [
  { id: 'all', name: 'Todas', count: 1347 },
  { id: 'tacas', name: 'Taças coloridas', count: 14 },
];

export const products: CatalogProduct[] = [
  {
    id: 'jogo-mesa-redonda',
    name: 'Jogo de mesa redonda (1,40m) com 8 cadeiras Tiffany imbuia',
    image: '/produtos/mesa-redonda-tiffany.png',
    price: 64,
    type: 'Aluguel',
    categoryId: 'all',
    isKit: true,
    kitComponents: [
      { name: 'Tampo de mesa 1,40m redonda sem suporte', image: '/produtos/tampo-mesa-redonda.png', quantity: 1 },
      { name: 'Cavalete de metal para base de mesa tampão', image: '/produtos/cavalete-metal.png', quantity: 1 },
      { name: 'Cadeira Tiffany madeira imbuia', image: '/produtos/cadeira-tiffany.png', quantity: 8 },
    ],
  },
  {
    id: 'pranchao-cavalete',
    name: 'Pranchão com cavalete (mesa de buffet)',
    image: '/produtos/pranchao-buffet.png',
    price: 30,
    type: 'Aluguel',
    categoryId: 'all',
  },
  {
    id: 'mesa-quadrada-demolicao',
    name: 'Mesa quadrada de demolição 1,40 x 1,40m',
    image: '/produtos/mesa-quadrada-demolicao.png',
    price: 90,
    type: 'Aluguel',
    categoryId: 'all',
  },
  {
    id: 'decoracao-lilas',
    name: 'Kit decoração de mesas tema lilás com toalhas',
    image: '/produtos/decoracao-evento.png',
    price: 120,
    type: 'Aluguel',
    categoryId: 'all',
  },
  {
    id: 'cadeira-tiffany',
    name: 'Cadeira Tiffany madeira imbuia',
    image: '/produtos/cadeira-tiffany.png',
    price: 8,
    type: 'Aluguel',
    categoryId: 'all',
  },
  {
    id: 'decoracao-jardim',
    name: 'Kit mesas para recepção ao ar livre',
    image: '/produtos/decoracao-evento.png',
    price: 150,
    type: 'Aluguel',
    categoryId: 'all',
  },
];

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
