"use client";

import Link from 'next/link';
import { SiteShell } from '@/app/components/site-shell';

export default function ClientPortalPage() {
  return (
    <SiteShell>
      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-soft">
        <h1 className="text-3xl font-semibold">Portal do cliente</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          Navegue pelo catálogo, defina o período da locação e envie seu orçamento diretamente para o WhatsApp da equipe.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/catalogo" className="btn-primary">Abrir catálogo</Link>
          <Link href="/carrinho" className="btn-secondary">Ver carrinho</Link>
        </div>
      </div>
    </SiteShell>
  );
}
