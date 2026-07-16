import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
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

  if (!quote) {
    return NextResponse.json(
      { error: 'Orçamento não encontrado' },
      { status: 404 }
    );
  }

  const doc = new PDFDocument({ margin: 40 });
  const chunks: Buffer[] = [];

  doc.on('data', (chunk) =>
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  );

  doc.fontSize(20).text('Orçamento Pop Churros', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Cliente: ${quote.client.fullName}`);
  doc.text(`Documento: ${quote.client.document}`);
  doc.text(`Telefone: ${quote.client.phone}`);
  doc.text(`E-mail: ${quote.client.email}`);
  doc.moveDown();
  doc.text('Itens:');

  quote.items.forEach((item) => {
    doc.text(`- ${item.product.name} | Quantidade: ${item.quantity}`);
  });

  doc.moveDown();
  doc.text(`Status: ${quote.status}`);

  doc.end();

  await new Promise<void>((resolve) => {
    doc.on('end', () => resolve());
  });

  const pdf = Buffer.concat(chunks);

  return new NextResponse(pdf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="orcamento-${quote.id}.pdf"`,
    },
  });
}