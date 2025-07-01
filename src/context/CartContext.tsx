import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../lib/db';
import { cartItems, products, profiles, categories, subcategories } from '../lib/schema';
import { eq, and } from 'drizzle-orm';
import { useAuth } from './AuthContext';
import type { CartItemWithProduct, ProductWithRelations } from '../lib/database.types';
import { nanoid } from 'nanoid';

interface CartContextType {
  items: CartItemWithProduct[];
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
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
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
      const result = await db
        .select({
          id: cartItems.id,
          userId: cartItems.userId,
          productId: cartItems.productId,
          quantity: cartItems.quantity,
          createdAt: cartItems.createdAt,
          updatedAt: cartItems.updatedAt,
          product: {
            id: products.id,
            vendorId: products.vendorId,
            title: products.title,
            description: products.description,
            price: products.price,
            originalPrice: products.originalPrice,
            images: products.images,
            categoryId: products.categoryId,
            subcategoryId: products.subcategoryId,
            purchaseUrl: products.purchaseUrl,
            stock: products.stock,
            tags: products.tags,
            status: products.status,
            createdAt: products.createdAt,
            updatedAt: products.updatedAt,
            vendor_name: profiles.name,
            category_name: categories.name,
            subcategory_name: subcategories.name,
          }
        })
        .from(cartItems)
        .leftJoin(products, eq(cartItems.productId, products.id))
        .leftJoin(profiles, eq(products.vendorId, profiles.id))
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
        .where(eq(cartItems.userId, user.id));

      const formattedItems = result.map(item => ({
        ...item,
        product: {
          ...item.product,
          vendor_name: item.product.vendor_name || 'Unknown Vendor',
          category_name: item.product.category_name || 'Unknown Category',
          subcategory_name: item.product.subcategory_name || 'Unknown Subcategory',
        }
      })) as CartItemWithProduct[];

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
      const existingItem = items.find(item => item.productId === productId);

      if (existingItem) {
        // Update quantity
        return await updateQuantity(productId, existingItem.quantity + quantity);
      } else {
        // Add new item
        await db.insert(cartItems).values({
          id: nanoid(),
          userId: user.id,
          productId,
          quantity,
        });

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
      await db
        .delete(cartItems)
        .where(and(
          eq(cartItems.userId, user.id),
          eq(cartItems.productId, productId)
        ));

      setItems(prev => prev.filter(item => item.productId !== productId));
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
      await db
        .update(cartItems)
        .set({ quantity })
        .where(and(
          eq(cartItems.userId, user.id),
          eq(cartItems.productId, productId)
        ));

      setItems(prev =>
        prev.map(item =>
          item.productId === productId ? { ...item, quantity } : item
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
      await db
        .delete(cartItems)
        .where(eq(cartItems.userId, user.id));

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
    return items.reduce((total, item) => total + (Number(item.product.price) * item.quantity), 0);
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