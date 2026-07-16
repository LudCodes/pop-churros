'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { CatalogProduct } from '@/lib/catalog-data';

export type CartItem = {
  product: CatalogProduct;
  quantity: number;
};

export type EventInfo = {
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  whatsapp: string;
  email: string;
};

type CartContextValue = {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  eventInfo: EventInfo;
  hasEventInfo: boolean;
  isEventModalOpen: boolean;
  addItem: (product: CatalogProduct) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  updateEventInfo: (info: Partial<EventInfo>) => void;
  openEventModal: () => void;
  closeEventModal: () => void;
  isInCart: (productId: string) => boolean;
};

const emptyEvent: EventInfo = {
  pickupDate: '',
  pickupTime: '',
  returnDate: '',
  returnTime: '',
  whatsapp: '',
  email: '',
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [eventInfo, setEventInfo] = useState<EventInfo>(emptyEvent);
  const [hasEventInfo, setHasEventInfo] = useState(false);
  const [isEventModalOpen, setEventModalOpen] = useState(false);

  const addItem = useCallback(
    (product: CatalogProduct) => {
      setItems((current) => {
        const existing = current.find((item) => item.product.id === product.id);
        if (existing) {
          return current.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
          );
        }
        return [...current, { product, quantity: 1 }];
      });
      if (!hasEventInfo) setEventModalOpen(true);
    },
    [hasEventInfo],
  );

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setItems((current) =>
      current.flatMap((item) => {
        if (item.product.id !== productId) return [item];
        if (quantity <= 0) return [];
        return [{ ...item, quantity }];
      }),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const updateEventInfo = useCallback((info: Partial<EventInfo>) => {
    setEventInfo((current) => ({ ...current, ...info }));
    setHasEventInfo(true);
  }, []);

  const openEventModal = useCallback(() => setEventModalOpen(true), []);
  const closeEventModal = useCallback(() => setEventModalOpen(false), []);

  const isInCart = useCallback(
    (productId: string) => items.some((item) => item.product.id === productId),
    [items],
  );

  const totalCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items],
  );

  const value: CartContextValue = {
    items,
    totalCount,
    subtotal,
    eventInfo,
    hasEventInfo,
    isEventModalOpen,
    addItem,
    setQuantity,
    removeItem,
    clearCart,
    updateEventInfo,
    openEventModal,
    closeEventModal,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart deve ser usado dentro de CartProvider');
  return context;
}
