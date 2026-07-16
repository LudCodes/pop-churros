import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-brand-gray text-brand-dark">
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-20 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-6">
          <span className="inline-flex rounded-full bg-brand-red/10 px-4 py-2 text-sm font-semibold text-brand-red">
            Pop Churros • Promoções e Eventos
          </span>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Sistema completo para catálogo, orçamento e gestão de eventos.
          </h1>
          <p className="text-lg text-brand-dark/80">
            Gerencie produtos, categorias, clientes, orçamentos, contratos e comunicações em uma única plataforma profissional.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/cliente" className="rounded-lg bg-brand-red px-6 py-3 font-semibold text-white">
              Acessar portal do cliente
            </Link>
            <Link href="/admin/login" className="rounded-lg border border-brand-red px-6 py-3 font-semibold text-brand-red">
              Acessar painel administrativo
            </Link>
          </div>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-xl">
          <h2 className="text-xl font-semibold">Funcionalidades</h2>
          <ul className="mt-4 space-y-3 text-sm text-brand-dark/80">
            <li>• Catálogo público com categorias e destaques</li>
            <li>• Carrinho de orçamento com solicitação real</li>
            <li>• Painel administrativo completo</li>
            <li>• Geração de PDF e WhatsApp</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
