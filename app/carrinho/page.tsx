"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2, ChevronRight, CalendarDays, ArrowRight } from 'lucide-react';
import { SiteShell, PageHeader } from '@/app/components/site-shell';

type CartItem = { productId: number; name: string; quantity: number; image?: string | null; unitPrice: number };
type DateForm = { pickupDate: string; pickupTime: string; returnDate: string; returnTime: string; whatsapp: string; email: string };

const initialDateForm = { pickupDate: '', pickupTime: '09:00', returnDate: '', returnTime: '18:00', whatsapp: '', email: '' };

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [dateForm, setDateForm] = useState<DateForm>(initialDateForm);
  const [statusMessage, setStatusMessage] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('client-cart');
    const savedDates = localStorage.getItem('client-dates');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedDates) setDateForm(JSON.parse(savedDates));
  }, []);

  useEffect(() => {
    localStorage.setItem('client-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('client-dates', JSON.stringify(dateForm));
  }, [dateForm]);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0), [cart]);
  const total = subtotal;

  const updateQuantity = (productId: number, delta: number) => {
    setCart((current) => current.flatMap((item) => item.productId === productId ? (item.quantity + delta > 0 ? [{ ...item, quantity: item.quantity + delta }] : []) : [item]));
  };

  const removeItem = (productId: number) => {
    setCart((current) => current.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    if (window.confirm('Deseja limpar o carrinho?')) {
      setCart([]);
      localStorage.removeItem('client-cart');
    }
  };

  const submitQuote = async () => {
    if (!dateForm.pickupDate || !dateForm.returnDate || cart.length === 0) {
      setStatusMessage('Informe o período e ao menos um item para solicitar o orçamento.');
      return;
    }

    const payload = {
      customer: {
        fullName: 'Cliente',
        document: '00000000000',
        phone: dateForm.whatsapp,
        whatsapp: dateForm.whatsapp,
        email: dateForm.email,
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
      },
      event: {
        location: 'Evento',
        deliveryDate: `${dateForm.pickupDate}T${dateForm.pickupTime}`,
        pickupDate: `${dateForm.returnDate}T${dateForm.returnTime}`,
        observations: 'Orçamento via portal do cliente',
      },
      items: cart.map((item) => ({ productId: item.productId, quantity: item.quantity })),
    };

    setStatusMessage('Enviando seu orçamento...');
    const response = await fetch('/api/quotes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json();
    if (result.success) {
      const message = `Olá! Gostaria de solicitar o orçamento ${result.quoteId}. Período: retirada ${dateForm.pickupDate} ${dateForm.pickupTime} até ${dateForm.returnDate} ${dateForm.returnTime}. Itens: ${cart.map((item) => `${item.name} x${item.quantity}`).join(', ')}. Subtotal: R$ ${subtotal.toFixed(2)}. Total: R$ ${total.toFixed(2)}.`;
      setStatusMessage('Orçamento enviado, você será redirecionado ao WhatsApp.');
      window.open(`https://wa.me/5561998456287?text=${encodeURIComponent(message)}`, '_blank');
    } else {
      setStatusMessage('Não foi possível enviar o orçamento.');
    }
  };

  return (
    <SiteShell cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}>
      <PageHeader title="Seu carrinho" subtitle="Revise os itens antes de continuar" breadcrumb={['Início', 'Carrinho']} />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <CalendarDays size={18} />
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">Período da locação</h2>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="rounded-[var(--radius-md)] border border-[var(--border)] p-3">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Data da retirada</span>
                <input type="date" value={dateForm.pickupDate} onChange={(e) => setDateForm({ ...dateForm, pickupDate: e.target.value })} className="w-full border-0 bg-transparent outline-none" />
              </label>
              <label className="rounded-[var(--radius-md)] border border-[var(--border)] p-3">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Hora da retirada</span>
                <select value={dateForm.pickupTime} onChange={(e) => setDateForm({ ...dateForm, pickupTime: e.target.value })} className="w-full border-0 bg-transparent outline-none">
                  <option value="08:00">08:00</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="12:00">12:00</option>
                </select>
              </label>
              <label className="rounded-[var(--radius-md)] border border-[var(--border)] p-3">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Data da devolução</span>
                <input type="date" value={dateForm.returnDate} onChange={(e) => setDateForm({ ...dateForm, returnDate: e.target.value })} className="w-full border-0 bg-transparent outline-none" />
              </label>
              <label className="rounded-[var(--radius-md)] border border-[var(--border)] p-3">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Hora da devolução</span>
                <select value={dateForm.returnTime} onChange={(e) => setDateForm({ ...dateForm, returnTime: e.target.value })} className="w-full border-0 bg-transparent outline-none">
                  <option value="17:00">17:00</option>
                  <option value="18:00">18:00</option>
                  <option value="19:00">19:00</option>
                  <option value="20:00">20:00</option>
                  <option value="21:00">21:00</option>
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">Seus dados</h2>
            <label className="mt-4 block rounded-[var(--radius-md)] border border-[var(--border)] p-3">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">E-mail</span>
              <input value={dateForm.email} onChange={(e) => setDateForm({ ...dateForm, email: e.target.value })} placeholder="seu@email.com" className="w-full border-0 bg-transparent outline-none" />
            </label>
            <label className="mt-4 block rounded-[var(--radius-md)] border border-[var(--border)] p-3">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">WhatsApp para retorno</span>
              <input value={dateForm.whatsapp} onChange={(e) => setDateForm({ ...dateForm, whatsapp: e.target.value })} placeholder="(61) 99999-9999" className="w-full border-0 bg-transparent outline-none" />
            </label>
          </section>

          <section className="space-y-3">
            {cart.map((item) => (
              <article key={item.productId} className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 overflow-hidden rounded-[var(--radius-md)] bg-[var(--bg)]">
                    {item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> : null}
                  </div>
                  <div>
                    <div className="inline-flex rounded-full bg-[var(--bg)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Kit · 1 item</div>
                    <h3 className="mt-2 font-semibold text-[var(--text)]">{item.name}</h3>
                    <p className="text-sm text-[var(--muted)]">R$ 0,00</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-full border border-[var(--border)] px-2 py-1">
                    <button onClick={() => updateQuantity(item.productId, -1)} className="rounded-full p-1"><Minus size={16} /></button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} className="rounded-full p-1"><Plus size={16} /></button>
                  </div>
                  <button onClick={() => removeItem(item.productId)} className="text-sm font-semibold text-[var(--muted)]">Remover</button>
                </div>
              </article>
            ))}
          </section>
        </div>

        <aside className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">Resumo do pedido</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between"><span>Subtotal</span><span>R$ {subtotal.toFixed(2)}</span></div>
            <div className="flex items-center justify-between"><span>Total</span><span className="text-lg font-semibold">R$ {total.toFixed(2)}</span></div>
          </div>
          <div className="mt-6 space-y-3">
            <button onClick={submitQuote} className="btn-primary w-full">Solicitar orçamento</button>
            <Link href="/catalogo" className="btn-secondary flex w-full items-center justify-center gap-2">Continuar comprando <ChevronRight size={16} /></Link>
            <button onClick={clearCart} className="w-full text-sm font-semibold text-[var(--muted)]">Cancelar carrinho</button>
          </div>
          {statusMessage && <p className="mt-4 rounded-[var(--radius-md)] bg-[var(--bg)] p-3 text-sm text-[var(--text)]">{statusMessage}</p>}
          <p className="mt-6 text-sm text-[var(--muted)]">Itens de locação são cobrados conforme o período selecionado. A confirmação final acontece após a checagem de disponibilidade.</p>
        </aside>
      </div>
    </SiteShell>
  );
}
