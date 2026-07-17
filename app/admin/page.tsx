"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeShell } from '@/app/components/theme-shell';

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
    <ThemeShell>
      <main className="min-h-screen bg-[var(--bg)] p-8 text-[var(--text)]">
        <div className="mx-auto max-w-7xl rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-soft">
          <h1 className="text-3xl font-semibold">Painel administrativo</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Bem-vindo, {user.name}.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">Produtos</p>
              <p className="mt-3 text-3xl font-semibold">0</p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">Clientes</p>
              <p className="mt-3 text-3xl font-semibold">0</p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">Orçamentos</p>
              <p className="mt-3 text-3xl font-semibold">0</p>
            </div>
          </div>
        </div>
      </main>
    </ThemeShell>
  );
}
