import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const quotes = await prisma.quote.findMany({ include: { client: true }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(quotes);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const client = await prisma.client.create({
    data: {
      fullName: body.customer.fullName,
      document: body.customer.document,
      phone: body.customer.phone,
      whatsapp: body.customer.whatsapp,
      email: body.customer.email,
      cep: body.customer.cep,
      street: body.customer.street,
      number: body.customer.number,
      complement: body.customer.complement,
      neighborhood: body.customer.neighborhood,
      city: body.customer.city,
      state: body.customer.state,
    },
  });

  const quote = await prisma.quote.create({
    data: {
      clientId: client.id,
      eventLocation: body.event.location,
      deliveryDate: body.event.deliveryDate ? new Date(body.event.deliveryDate) : null,
      pickupDate: body.event.pickupDate ? new Date(body.event.pickupDate) : null,
      observations: body.event.observations,
      status: 'PENDENTE',
    },
  });

  await prisma.quoteItem.createMany({
    data: body.items.map((item: any) => ({
      quoteId: quote.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: 0,
      subtotal: 0,
    })),
  });

  await prisma.notification.create({
    data: {
      type: 'NOVO_ORCAMENTO',
      message: `Novo orçamento solicitado por ${client.fullName}`,
      quoteId: quote.id,
    },
  });

  return NextResponse.json({ success: true, quoteId: quote.id });
}
