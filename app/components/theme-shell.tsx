"use client";

import { ReactNode } from 'react';

export function ThemeShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">{children}</div>;
}
