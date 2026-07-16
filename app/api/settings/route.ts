import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const settings = await prisma.setting.findFirst();
  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const existing = await prisma.setting.findFirst();
  const settings = existing ? await prisma.setting.update({ where: { id: existing.id }, data }) : await prisma.setting.create({ data });
  return NextResponse.json(settings);
}
