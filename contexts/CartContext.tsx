import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Product } from '../types';

export interface CartItem extends Product {
  quantity: number;
  isSample?: boolean;
}

interface AddToCartOptions {
    quantity?: number;
    isSample?: boolean;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, options?: AddToCartOptions) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  hasPhysicalItems: boolean;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('trade_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('trade_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product: Product, options: AddToCartOptions = {}) => {
    const { quantity = 1, isSample = false } = options;

    setCartItems(prevItems => {
        // If it's a sample, it's always a new, unique item in the cart.
        if (isSample) {
            const sampleItem: CartItem = { 
                ...product, 
                price: product.samplePrice ?? product.price, // Use sample price if available
                id: `${product.id}-sample-${Date.now()}`, // Unique ID for sample
                quantity: 1, 
                isSample: true 
            };
            return [...prevItems, sampleItem];
        }

        // If it's a digital/service product, it's often a single purchase
        if (product.productType !== 'physical') {
             const existingItem = prevItems.find(item => item.id === product.id && !item.isSample);
             if (existingItem) {
                 alert("This service/digital product is already in your cart.");
                 return prevItems; // Don't add if it already exists
             }
             return [...prevItems, { ...product, quantity: 1 }];
        }

        // For regular physical products
        const existingItem = prevItems.find(item => item.id === product.id && !item.isSample);
        if (existingItem) {
            return prevItems.map(item =>
            item.id === product.id && !item.isSample
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
        }
        return [...prevItems, { ...product, quantity, isSample: false }];
    });
    openCart();
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems(prevItems => {
        const itemToUpdate = prevItems.find(item => item.id === productId);
        // Prevent quantity changes for samples or digital products
        if (itemToUpdate?.isSample || itemToUpdate?.productType !== 'physical') {
            return prevItems;
        }

        if (quantity <= 0) {
            return prevItems.filter(item => item.id !== productId);
        }
        
        return prevItems.map(item => (item.id === productId ? { ...item, quantity } : item));
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const subtotal = cartItems.reduce((total, item) => {
    const price = item.isSample ? (item.samplePrice ?? item.price) : item.price;
    return total + price * item.quantity;
  }, 0);

  const hasPhysicalItems = cartItems.some(item => item.productType === 'physical');

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        hasPhysicalItems,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
