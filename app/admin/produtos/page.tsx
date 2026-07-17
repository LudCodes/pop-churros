"use client";

import { useEffect, useState } from 'react';
import { ThemeShell } from '@/app/components/theme-shell';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<any[]>([]);

  const load = async () => {
    const [productsRes, categoriesRes] = await Promise.all([fetch('/api/products'), fetch('/api/categories')]);
    setProducts(await productsRes.json());
    setCategories(await categoriesRes.json());
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, categoryId: Number(categoryId), status: 'ACTIVE' }),
    });
    setName('');
    setDescription('');
    setCategoryId('');
    load();
  };

  return (
    <ThemeShell>
      <main className="min-h-screen bg-[var(--bg)] p-8 text-[var(--text)]">
        <div className="mx-auto max-w-7xl rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-soft">
          <h1 className="text-2xl font-semibold">Produtos</h1>
          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] p-4">
              <h2 className="font-semibold">Novo produto</h2>
              <div className="mt-4 space-y-3">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" className="w-full rounded-full border border-[var(--border)] px-3 py-2" />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição" className="w-full rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2" />
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full rounded-full border border-[var(--border)] px-3 py-2">
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
                <button onClick={save} className="btn-primary">Salvar</button>
              </div>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] p-4">
              <h2 className="font-semibold">Produtos cadastrados</h2>
              <div className="mt-4 space-y-2">
                {products.map((product) => <div key={product.id} className="rounded-[var(--radius-md)] bg-[var(--surface)] p-3">{product.name}</div>)}
              </div>
            </div>
          </div>
        </div>
      </main>
    </ThemeShell>
  );
}
