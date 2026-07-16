import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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
        mustChangePassword: true,
      },
    });
  }

  const settings = await prisma.setting.findFirst();
  if (!settings) {
    await prisma.setting.create({
      data: {
        companyName: 'Pop Churros, Promoções e Eventos',
        cnpj: '00.000.000/0001-00',
        address: 'Rua Principal, 123',
        whatsapp: '(11) 99999-9999',
        email: 'contato@popchurros.com',
      },
    });
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
