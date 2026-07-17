"use client";

import { useEffect, useState } from 'react';
import { ThemeShell } from '@/app/components/theme-shell';

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([]);

  const load = async () => {
    const res = await fetch('/api/quotes');
    setQuotes(await res.json());
  };

  useEffect(() => { load(); }, []);

  return (
    <ThemeShell>
      <main className="min-h-screen bg-[var(--bg)] p-8 text-[var(--text)]">
        <div className="mx-auto max-w-7xl rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-soft">
          <h1 className="text-2xl font-semibold">Orçamentos</h1>
          <div className="mt-6 space-y-3">
            {quotes.map((quote) => <div key={quote.id} className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] p-4">#{quote.id} • Status: {quote.status}</div>)}
          </div>
        </div>
      </main>
    </ThemeShell>
  );
}
