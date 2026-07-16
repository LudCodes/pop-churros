"use client";

import { useEffect, useState } from 'react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const load = async () => {
    const res = await fetch('/api/categories');
    setCategories(await res.json());
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, slug: name.toLowerCase().replace(/\s+/g, '-') }),
    });
    setName('');
    setDescription('');
    load();
  };

  return (
    <main className="min-h-screen bg-brand-gray p-8 text-brand-dark">
      <div className="mx-auto max-w-7xl rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Categorias</h1>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-black/10 bg-brand-gray p-4">
            <h2 className="font-semibold">Nova categoria</h2>
            <div className="mt-4 space-y-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" className="w-full rounded-lg border border-black/10 px-3 py-2" />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição" className="w-full rounded-lg border border-black/10 px-3 py-2" />
              <button onClick={save} className="rounded-lg bg-brand-red px-4 py-2 text-white">Salvar</button>
            </div>
          </div>
          <div className="rounded-2xl border border-black/10 bg-brand-gray p-4">
            <h2 className="font-semibold">Categorias cadastradas</h2>
            <div className="mt-4 space-y-2">
              {categories.map((category) => <div key={category.id} className="rounded-lg bg-white p-3">{category.name}</div>)}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
