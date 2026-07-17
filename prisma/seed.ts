import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categoryData = [
  { name: 'Mesas', slug: 'mesas', description: 'Mesas para todos os tipos de evento.', isFeatured: true },
  { name: 'Cadeiras', slug: 'cadeiras', description: 'Cadeiras confortáveis e elegantes.', isFeatured: true },
  { name: 'Kits completos', slug: 'kits-completos', description: 'Conjuntos prontos para o seu evento.', isFeatured: true, isPromotion: true },
  { name: 'Decoração', slug: 'decoracao', description: 'Itens de decoração e ambientação.', isPromotion: true },
];

const productData: Record<string, { name: string; description: string; image: string; type: string }[]> = {
  'kits-completos': [
    {
      name: 'Jogo de mesa redonda (1,40m) com 8 cadeiras Tiffany imbuia',
      description: 'Conjunto completo com tampo redondo de 1,40m, cavalete de metal e 8 cadeiras Tiffany de madeira imbuia.',
      image: '/produtos/mesa-redonda-tiffany.png',
      type: 'ALUGUEL',
    },
    {
      name: 'Kit mesas para recepção ao ar livre',
      description: 'Conjunto de mesas dispostas para recepção e área externa.',
      image: '/produtos/decoracao-evento.png',
      type: 'ALUGUEL',
    },
  ],
  mesas: [
    {
      name: 'Pranchão com cavalete (mesa de buffet)',
      description: 'Mesa retangular tipo pranchão com cavalete, ideal para buffet.',
      image: '/produtos/pranchao-buffet.png',
      type: 'ALUGUEL',
    },
    {
      name: 'Mesa quadrada de demolição 1,40 x 1,40m',
      description: 'Mesa quadrada em madeira de demolição, acabamento rústico.',
      image: '/produtos/mesa-quadrada-demolicao.png',
      type: 'ALUGUEL',
    },
    {
      name: 'Tampo de mesa 1,40m redonda sem suporte',
      description: 'Tampo redondo de 1,40m para montagem sobre cavalete.',
      image: '/produtos/tampo-mesa-redonda.png',
      type: 'ALUGUEL',
    },
  ],
  cadeiras: [
    {
      name: 'Cadeira Tiffany madeira imbuia',
      description: 'Cadeira Tiffany em madeira imbuia com assento estofado.',
      image: '/produtos/cadeira-tiffany.png',
      type: 'ALUGUEL',
    },
  ],
  decoracao: [
    {
      name: 'Kit decoração de mesas tema lilás com toalhas',
      description: 'Conjunto de toalhas e itens decorativos no tema lilás.',
      image: '/produtos/decoracao-evento.png',
      type: 'ALUGUEL',
    },
    {
      name: 'Cavalete de metal para base de mesa tampão',
      description: 'Base em metal dobrável para tampos de mesa.',
      image: '/produtos/cavalete-metal.png',
      type: 'ALUGUEL',
    },
  ],
};

async function main() {
  const adminEmail = 'topshops39@gmail.com';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    await prisma.user.create({
      data: {
        name: 'Administrador',
        email: adminEmail,
        password: await bcrypt.hash('123456', 10),
        role: 'ADMIN',
        mustChangePassword: false,
      },
    });
  }

  const settings = await prisma.setting.findFirst();
  if (!settings) {
    await prisma.setting.create({
      data: {
        companyName: 'Tapiraí Festas',
        cnpj: '00.000.000/0001-00',
        address: 'Brasília · DF',
        whatsapp: '(61) 99999-9999',
        email: 'contato@tapiraifestas.com',
      },
    });
  }

  for (const category of categoryData) {
    const savedCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        isFeatured: category.isFeatured ?? false,
        isPromotion: category.isPromotion ?? false,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        isFeatured: category.isFeatured ?? false,
        isPromotion: category.isPromotion ?? false,
      },
    });

    const products = productData[category.slug] ?? [];
    for (const product of products) {
      const already = await prisma.product.findFirst({ where: { name: product.name } });
      if (!already) {
        await prisma.product.create({
          data: {
            name: product.name,
            description: product.description,
            image: product.image,
            type: product.type,
            status: 'ACTIVE',
            categoryId: savedCategory.id,
          },
        });
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
