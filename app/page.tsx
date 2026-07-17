import Link from 'next/link';
import { SiteShell } from '@/app/components/site-shell';

export default function HomePage() {
  return (
    <SiteShell>
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-soft">
          <span className="inline-flex rounded-full bg-[var(--bg)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            Pop Churros • Promoções e Eventos
          </span>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Catálogo, carrinho e orçamento em uma experiência única.
          </h1>
          <p className="text-lg text-[var(--muted)]">
            Explore produtos, defina o período da locação e solicite seu orçamento diretamente pelo WhatsApp com a equipe.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/catalogo" className="btn-primary">
              Ver catálogo
            </Link>
            <Link href="/carrinho" className="btn-secondary">
              Abrir carrinho
            </Link>
          </div>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-soft">
          <h2 className="text-xl font-semibold">Funcionalidades</h2>
          <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            <li>• Catálogo público com categorias e busca</li>
            <li>• Carrinho com período de locação e WhatsApp</li>
            <li>• Painel administrativo com o mesmo tema</li>
            <li>• Orçamentos gravados no backend real</li>
          </ul>
        </div>
      </section>
    </SiteShell>
  );
}
