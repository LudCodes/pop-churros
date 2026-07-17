"use client";

import { useEffect, useState } from 'react';
import { ThemeShell } from '@/app/components/theme-shell';

export default function AdminSettingsPage() {
  const [companyName, setCompanyName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');

  const load = async () => {
    const res = await fetch('/api/settings');
    const data = await res.json();
    if (data) {
      setCompanyName(data.companyName || '');
      setWhatsapp(data.whatsapp || '');
      setEmail(data.email || '');
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyName, whatsapp, email }),
    });
  };

  return (
    <ThemeShell>
      <main className="min-h-screen bg-[var(--bg)] p-8 text-[var(--text)]">
        <div className="mx-auto max-w-7xl rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-soft">
          <h1 className="text-2xl font-semibold">Configurações</h1>
          <div className="mt-6 space-y-3">
            <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Nome da empresa" className="w-full rounded-full border border-[var(--border)] px-3 py-2" />
            <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="WhatsApp" className="w-full rounded-full border border-[var(--border)] px-3 py-2" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" className="w-full rounded-full border border-[var(--border)] px-3 py-2" />
            <button onClick={save} className="btn-primary">Salvar</button>
          </div>
        </div>
      </main>
    </ThemeShell>
  );
}
