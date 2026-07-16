"use client";

import { useEffect, useState } from 'react';

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
    <main className="min-h-screen bg-brand-gray p-8 text-brand-dark">
      <div className="mx-auto max-w-7xl rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Produtos</h1>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-black/10 bg-brand-gray p-4">
            <h2 className="font-semibold">Novo produto</h2>
            <div className="mt-4 space-y-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" className="w-full rounded-lg border border-black/10 px-3 py-2" />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição" className="w-full rounded-lg border border-black/10 px-3 py-2" />
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full rounded-lg border border-black/10 px-3 py-2">
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
              <button onClick={save} className="rounded-lg bg-brand-red px-4 py-2 text-white">Salvar</button>
            </div>
          </div>
          <div className="rounded-2xl border border-black/10 bg-brand-gray p-4">
            <h2 className="font-semibold">Produtos cadastrados</h2>
            <div className="mt-4 space-y-2">
              {products.map((product) => <div key={product.id} className="rounded-lg bg-white p-3">{product.name}</div>)}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
