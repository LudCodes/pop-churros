import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const quote = await prisma.quote.findUnique({
    where: { id: Number(id) },
    include: {
      client: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return NextResponse.json(quote);
}