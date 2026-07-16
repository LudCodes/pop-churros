"use client";

import { useEffect, useState } from 'react';

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
    <main className="min-h-screen bg-brand-gray p-8 text-brand-dark">
      <div className="mx-auto max-w-7xl rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Configurações</h1>
        <div className="mt-6 space-y-3">
          <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Nome da empresa" className="w-full rounded-lg border border-black/10 px-3 py-2" />
          <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="WhatsApp" className="w-full rounded-lg border border-black/10 px-3 py-2" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" className="w-full rounded-lg border border-black/10 px-3 py-2" />
          <button onClick={save} className="rounded-lg bg-brand-red px-4 py-2 text-white">Salvar</button>
        </div>
      </div>
    </main>
  );
}
