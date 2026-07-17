"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeShell } from '@/app/components/theme-shell';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('topshops39@gmail.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const router = useRouter();

  const login = async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || 'Erro ao entrar');
      return;
    }
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));
    router.push('/admin');
  };

  return (
    <ThemeShell>
      <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-6">
        <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-soft">
          <h1 className="text-2xl font-semibold">Acesso administrativo</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Entre com sua conta para gerenciar o sistema.</p>
          <div className="mt-6 space-y-3">
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-full border border-[var(--border)] px-4 py-3" placeholder="E-mail" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-full border border-[var(--border)] px-4 py-3" placeholder="Senha" />
            <button onClick={login} className="btn-primary w-full">Entrar</button>
            {error && <p className="text-sm text-[var(--muted)]">{error}</p>}
          </div>
        </div>
      </main>
    </ThemeShell>
  );
}
