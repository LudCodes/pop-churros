"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type Category = { id: number; name: string; slug: string; isFeatured: boolean; isPromotion: boolean };
type Product = { id: number; name: string; description: string | null; image: string | null; category: Category; status: string };

type CartItem = { productId: number; name: string; quantity: number };

export default function ClientPortalPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState({ fullName: '', document: '', phone: '', whatsapp: '', email: '', cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', location: '', deliveryDate: '', pickupDate: '', observations: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then(setCategories);
    fetch('/api/products').then((r) => r.json()).then(setProducts);
  }, []);

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'all' || String(product.category.id) === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch && product.status === 'ACTIVE';
    });
  }, [products, selectedCategory, search]);

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) return current.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...current, { productId: product.id, name: product.name, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((current) => current.flatMap((item) => item.productId === productId ? (item.quantity + delta > 0 ? [{ ...item, quantity: item.quantity + delta }] : []) : [item]));
  };

  const submitQuote = async () => {
    const response = await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer, event: { location: customer.location, deliveryDate: customer.deliveryDate, pickupDate: customer.pickupDate, observations: customer.observations }, items: cart.map((item) => ({ productId: item.productId, quantity: item.quantity })) }),
    });
    const result = await response.json();
    if (result.success) {
      setMessage('Orçamento enviado com sucesso.');
      setCart([]);
      setCustomer({ fullName: '', document: '', phone: '', whatsapp: '', email: '', cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', location: '', deliveryDate: '', pickupDate: '', observations: '' });
    } else {
      setMessage('Não foi possível enviar o orçamento.');
    }
  };

  return (
    <main className="min-h-screen bg-brand-gray text-brand-dark">
      <nav className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-red">Pop Churros</p>
            <h1 className="text-xl font-bold">Portal do cliente</h1>
          </div>
          <Link href="/" className="text-sm font-semibold text-brand-red">Voltar ao início</Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">Catálogo</h2>
            <div className="mt-4 flex flex-col gap-3 md:flex-row">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar produto" className="w-full rounded-lg border border-black/10 px-4 py-3" />
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="rounded-lg border border-black/10 px-4 py-3">
                <option value="all">Todas as categorias</option>
                {categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}
              </select>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {visibleProducts.map((product) => (
                <div key={product.id} className="rounded-2xl border border-black/10 bg-brand-gray p-4">
                  <div className="h-32 rounded-xl bg-white" />
                  <h3 className="mt-4 font-semibold">{product.name}</h3>
                  <p className="text-sm text-brand-dark/70">{product.category.name}</p>
                  <button onClick={() => addToCart(product)} className="mt-4 rounded-lg bg-brand-red px-4 py-2 text-white">Adicionar ao orçamento</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Carrinho</h2>
            {cart.length === 0 ? <p className="mt-3 text-sm text-brand-dark/70">Nenhum item selecionado.</p> : <div className="mt-4 space-y-3">{cart.map((item) => <div key={item.productId} className="flex items-center justify-between rounded-lg bg-brand-gray p-3"><span>{item.name}</span><div className="flex items-center gap-2"><button onClick={() => updateQuantity(item.productId, -1)} className="rounded bg-brand-dark px-2 py-1 text-white">-</button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.productId, 1)} className="rounded bg-brand-red px-2 py-1 text-white">+</button></div></div>)}</div>}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Solicitar orçamento</h2>
            <div className="mt-4 space-y-3">
              <input value={customer.fullName} onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })} placeholder="Nome completo" className="w-full rounded-lg border border-black/10 px-3 py-2" />
              <input value={customer.document} onChange={(e) => setCustomer({ ...customer, document: e.target.value })} placeholder="CPF/CNPJ" className="w-full rounded-lg border border-black/10 px-3 py-2" />
              <input value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} placeholder="Telefone" className="w-full rounded-lg border border-black/10 px-3 py-2" />
              <input value={customer.whatsapp} onChange={(e) => setCustomer({ ...customer, whatsapp: e.target.value })} placeholder="WhatsApp" className="w-full rounded-lg border border-black/10 px-3 py-2" />
              <input value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} placeholder="E-mail" className="w-full rounded-lg border border-black/10 px-3 py-2" />
              <input value={customer.cep} onChange={(e) => setCustomer({ ...customer, cep: e.target.value })} placeholder="CEP" className="w-full rounded-lg border border-black/10 px-3 py-2" />
              <input value={customer.street} onChange={(e) => setCustomer({ ...customer, street: e.target.value })} placeholder="Rua" className="w-full rounded-lg border border-black/10 px-3 py-2" />
              <input value={customer.number} onChange={(e) => setCustomer({ ...customer, number: e.target.value })} placeholder="Número" className="w-full rounded-lg border border-black/10 px-3 py-2" />
              <input value={customer.complement} onChange={(e) => setCustomer({ ...customer, complement: e.target.value })} placeholder="Complemento" className="w-full rounded-lg border border-black/10 px-3 py-2" />
              <input value={customer.neighborhood} onChange={(e) => setCustomer({ ...customer, neighborhood: e.target.value })} placeholder="Bairro" className="w-full rounded-lg border border-black/10 px-3 py-2" />
              <input value={customer.city} onChange={(e) => setCustomer({ ...customer, city: e.target.value })} placeholder="Cidade" className="w-full rounded-lg border border-black/10 px-3 py-2" />
              <input value={customer.state} onChange={(e) => setCustomer({ ...customer, state: e.target.value })} placeholder="Estado" className="w-full rounded-lg border border-black/10 px-3 py-2" />
              <input value={customer.location} onChange={(e) => setCustomer({ ...customer, location: e.target.value })} placeholder="Local do evento" className="w-full rounded-lg border border-black/10 px-3 py-2" />
              <input type="date" value={customer.deliveryDate} onChange={(e) => setCustomer({ ...customer, deliveryDate: e.target.value })} className="w-full rounded-lg border border-black/10 px-3 py-2" />
              <input type="date" value={customer.pickupDate} onChange={(e) => setCustomer({ ...customer, pickupDate: e.target.value })} className="w-full rounded-lg border border-black/10 px-3 py-2" />
              <textarea value={customer.observations} onChange={(e) => setCustomer({ ...customer, observations: e.target.value })} placeholder="Observações" className="w-full rounded-lg border border-black/10 px-3 py-2" />
            </div>
            <button onClick={submitQuote} className="mt-4 w-full rounded-lg bg-brand-red px-4 py-3 font-semibold text-white">Enviar orçamento</button>
            {message && <p className="mt-3 text-sm text-brand-red">{message}</p>}
          </div>
        </div>
      </section>
    </main>
  );
}
