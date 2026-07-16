import { CartProvider } from '@/components/loja/cart-context';
import { StoreHeader } from '@/components/loja/store-header';
import { EventModal } from '@/components/loja/event-modal';

export default function LojaLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-cream text-ink">
        <StoreHeader />
        {children}
        <EventModal />
      </div>
    </CartProvider>
  );
}
