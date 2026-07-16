'use client';

import { useEffect, useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useCart } from './cart-context';

const times = Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, '0')}:00`);

export function EventModal() {
  const { isEventModalOpen, closeEventModal, updateEventInfo, eventInfo } = useCart();
  const [form, setForm] = useState({
    pickupDate: '',
    pickupTime: '',
    returnDate: '',
    returnTime: '',
    whatsapp: '',
  });

  useEffect(() => {
    if (isEventModalOpen) {
      setForm({
        pickupDate: eventInfo.pickupDate,
        pickupTime: eventInfo.pickupTime,
        returnDate: eventInfo.returnDate,
        returnTime: eventInfo.returnTime,
        whatsapp: eventInfo.whatsapp,
      });
    }
  }, [isEventModalOpen, eventInfo]);

  useEffect(() => {
    if (!isEventModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeEventModal();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isEventModalOpen, closeEventModal]);

  if (!isEventModalOpen) return null;

  const handleSave = () => {
    updateEventInfo(form);
    closeEventModal();
  };

  const fieldClass =
    'w-full rounded-[10px] border border-hairline bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-ink/30 focus:outline-none';
  const labelClass = 'mb-1.5 block text-xs font-medium text-muted';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
    >
      <button
        type="button"
        aria-label="Fechar"
        onClick={closeEventModal}
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
      />
      <div className="relative z-10 w-full max-w-lg rounded-[20px] bg-white p-7 shadow-2xl">
        <button
          type="button"
          onClick={closeEventModal}
          aria-label="Fechar"
          className="absolute right-5 top-5 text-muted transition hover:text-ink"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <h2 id="event-modal-title" className="text-xl font-bold text-ink text-balance">
          Quando é o seu evento?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
          Com as datas certas você vê preços e disponibilidade exatos — e com seu WhatsApp fica mais fácil te ajudarmos a fechar o pedido.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="pickup-date" className={labelClass}>Data da retirada</label>
            <input
              id="pickup-date"
              type="text"
              placeholder="DD/MM/AAAA"
              value={form.pickupDate}
              onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="pickup-time" className={labelClass}>Hora da retirada</label>
            <div className="relative">
              <select
                id="pickup-time"
                value={form.pickupTime}
                onChange={(e) => setForm({ ...form, pickupTime: e.target.value })}
                className={`${fieldClass} appearance-none pr-9`}
              >
                <option value="">–</option>
                {times.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            </div>
          </div>
          <div>
            <label htmlFor="return-date" className={labelClass}>Data da devolução</label>
            <input
              id="return-date"
              type="text"
              placeholder="DD/MM/AAAA"
              value={form.returnDate}
              onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="return-time" className={labelClass}>Hora da devolução</label>
            <div className="relative">
              <select
                id="return-time"
                value={form.returnTime}
                onChange={(e) => setForm({ ...form, returnTime: e.target.value })}
                className={`${fieldClass} appearance-none pr-9`}
              >
                <option value="">–</option>
                {times.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="whatsapp" className={labelClass}>Seu WhatsApp</label>
          <div className="flex items-stretch">
            <span className="inline-flex items-center gap-1.5 rounded-l-[10px] border border-r-0 border-hairline bg-cream px-3 text-sm text-ink">
              <span aria-hidden="true">🇧🇷</span> +55
              <ChevronDown className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
            </span>
            <input
              id="whatsapp"
              type="tel"
              placeholder="(DD) 99999-9999"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              className="w-full rounded-r-[10px] border border-hairline bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-ink/30 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={closeEventModal}
            className="rounded-full border border-hairline px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-cream"
          >
            Agora não
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white transition hover:bg-ink/90"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
