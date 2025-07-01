import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { Database } from '../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'] & {
  vendor_name?: string;
  category_name?: string;
  subcategory_name?: string;
};

type CartItem = Database['public']['Tables']['cart_items']['Row'] & {
  product: Product;
};

interface CartContextType {
  items: CartItem[];
  addToCart: (productId: string, quantity?: number) => Promise<boolean>;
  removeFromCart: (productId: string) => Promise<boolean>;
  updateQuantity: (productId: string, quantity: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setItems([]);
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products (
            *,
            vendor_name:profiles!products_vendor_id_fkey(name),
            category_name:categories(name),
            subcategory_name:subcategories(name)
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching cart items:', error);
        return;
      }

      const formattedItems = data?.map(item => ({
        ...item,
        product: {
          ...item.product,
          vendor_name: item.product.vendor_name?.name || 'Unknown Vendor',
          category_name: item.product.category_name?.name || 'Unknown Category',
          subcategory_name: item.product.subcategory_name?.name || 'Unknown Subcategory',
        }
      })) || [];

      setItems(formattedItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1): Promise<boolean> => {
    if (!user) return false;

    try {
      // Check if item already exists in cart
      const existingItem = items.find(item => item.product_id === productId);

      if (existingItem) {
        // Update quantity
        return await updateQuantity(productId, existingItem.quantity + quantity);
      } else {
        // Add new item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity,
          });

        if (error) {
          console.error('Error adding to cart:', error);
          return false;
        }

        await fetchCartItems();
        return true;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };

  const removeFromCart = async (productId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        console.error('Error removing from cart:', error);
        return false;
      }

      setItems(prev => prev.filter(item => item.product_id !== productId));
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  };

  const updateQuantity = async (productId: string, quantity: number): Promise<boolean> => {
    if (!user) return false;

    if (quantity <= 0) {
      return await removeFromCart(productId);
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        console.error('Error updating cart quantity:', error);
        return false;
      }

      setItems(prev =>
        prev.map(item =>
          item.product_id === productId ? { ...item, quantity } : item
        )
      );
      return true;
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      return false;
    }
  };

  const clearCart = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing cart:', error);
        return false;
      }

      setItems([]);
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  };

  const getTotalItems = (): number => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = (): number => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
};