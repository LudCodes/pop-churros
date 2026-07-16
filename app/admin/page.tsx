"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, [router]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-brand-gray p-8 text-brand-dark">
      <div className="mx-auto max-w-7xl rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Painel administrativo</h1>
        <p className="mt-2 text-sm text-brand-dark/70">Bem-vindo, {user.name}.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-black/10 bg-brand-gray p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-brand-red">Produtos</p>
            <p className="mt-3 text-3xl font-semibold">0</p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-brand-gray p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-brand-red">Clientes</p>
            <p className="mt-3 text-3xl font-semibold">0</p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-brand-gray p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-brand-red">Orçamentos</p>
            <p className="mt-3 text-3xl font-semibold">0</p>
          </div>
        </div>
      </div>
    </main>
  );
}
