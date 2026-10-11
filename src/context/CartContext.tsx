import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariation } from '../types/cashpay';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedVariation?: ProductVariation | null) => void;
  removeFromCart: (productId: string, variationKey?: string) => void;
  updateQuantity: (productId: string, variationKey: string | undefined, newQty: number) => void;
  clearCart: () => void;
  totalItemsCount: number;
  totalAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'imagine_store_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Could not save cart:', e);
    }
  }, [items]);

  const getVariationKey = (variation?: ProductVariation | null) => {
    if (!variation) return 'default';
    return `${variation.color || ''}_${variation.size || ''}`;
  };

  const getEffectivePrice = (product: Product, quantity: number): number => {
    // Check if promotionalPackages apply
    if (product.promotionalPackages && product.promotionalPackages.length > 0) {
      // Find highest qualifying quantity package
      const sortedPackages = [...product.promotionalPackages].sort((a, b) => b.quantity - a.quantity);
      const pkg = sortedPackages.find((p) => quantity >= p.quantity);
      if (pkg && pkg.price < product.sellingPrice) {
        return pkg.price;
      }
    }
    return product.sellingPrice;
  };

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedVariation: ProductVariation | null = null
  ) => {
    setItems((prevItems) => {
      const varKey = getVariationKey(selectedVariation);
      const existingIndex = prevItems.findIndex(
        (i) => i.product.id === product.id && getVariationKey(i.selectedVariation) === varKey
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          pricePerUnit: getEffectivePrice(product, newQty),
        };
        return updated;
      } else {
        const item: CartItem = {
          product,
          quantity,
          selectedVariation,
          pricePerUnit: getEffectivePrice(product, quantity),
        };
        return [...prevItems, item];
      }
    });
  };

  const removeFromCart = (productId: string, variationKey?: string) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.product.id === productId && getVariationKey(i.selectedVariation) === (variationKey || 'default'))
      )
    );
  };

  const updateQuantity = (productId: string, variationKey: string | undefined, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(productId, variationKey);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && getVariationKey(item.selectedVariation) === (variationKey || 'default')) {
          return {
            ...item,
            quantity: newQty,
            pricePerUnit: getEffectivePrice(item.product, newQty),
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItemsCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce((sum, i) => sum + i.pricePerUnit * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        totalAmount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
