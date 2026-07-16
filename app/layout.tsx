import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Tapiraí Festas | Aluguel para eventos em Brasília',
  description: 'Reserve online mesas, cadeiras e kits para o seu evento. Brasília · DF.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} bg-cream`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
