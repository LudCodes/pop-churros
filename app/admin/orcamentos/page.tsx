"use client";

import { useEffect, useState } from 'react';

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([]);

  const load = async () => {
    const res = await fetch('/api/quotes');
    setQuotes(await res.json());
  };

  useEffect(() => { load(); }, []);

  return (
    <main className="min-h-screen bg-brand-gray p-8 text-brand-dark">
      <div className="mx-auto max-w-7xl rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Orçamentos</h1>
        <div className="mt-6 space-y-3">
          {quotes.map((quote) => <div key={quote.id} className="rounded-2xl border border-black/10 bg-brand-gray p-4">#{quote.id} • Status: {quote.status}</div>)}
        </div>
      </div>
    </main>
  );
}
