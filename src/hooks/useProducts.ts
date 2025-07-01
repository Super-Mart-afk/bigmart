import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'] & {
  vendor_name?: string;
  category_name?: string;
  subcategory_name?: string;
};

interface UseProductsOptions {
  categoryId?: string;
  subcategoryId?: string;
  vendorId?: string;
  status?: 'active' | 'inactive' | 'pending';
  limit?: number;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [options.categoryId, options.subcategoryId, options.vendorId, options.status, options.limit]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('products')
        .select(`
          *,
          vendor_name:profiles!products_vendor_id_fkey(name),
          category_name:categories(name),
          subcategory_name:subcategories(name)
        `);

      // Apply filters
      if (options.categoryId) {
        query = query.eq('category_id', options.categoryId);
      }
      if (options.subcategoryId) {
        query = query.eq('subcategory_id', options.subcategoryId);
      }
      if (options.vendorId) {
        query = query.eq('vendor_id', options.vendorId);
      }
      if (options.status) {
        query = query.eq('status', options.status);
      }

      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        setError(error.message);
        return;
      }

      const formattedProducts = data?.map(product => ({
        ...product,
        vendor_name: product.vendor_name?.name || 'Unknown Vendor',
        category_name: product.category_name?.name || 'Unknown Category',
        subcategory_name: product.subcategory_name?.name || 'Unknown Subcategory',
      })) || [];

      setProducts(formattedProducts);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { products, isLoading, error, refetch: fetchProducts };
};