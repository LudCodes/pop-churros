import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const category = await prisma.category.create({ data: { ...data, slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-') } });
  return NextResponse.json(category);
}
