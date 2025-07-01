import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { ProductWithRelations } from '../lib/database.types';

interface UseProductsOptions {
  categoryId?: string;
  subcategoryId?: string;
  vendorId?: string;
  status?: 'active' | 'inactive' | 'pending';
  limit?: number;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const [productsData, setProductsData] = useState<ProductWithRelations[]>([]);
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
          vendor:profiles!products_vendor_id_fkey(name),
          category:categories(name),
          subcategory:subcategories(name)
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

      query = query.order('created_at', { ascending: false });

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data: result, error: fetchError } = await query;

      if (fetchError) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', fetchError);
        return;
      }

      const formattedProducts = (result || []).map(product => ({
        ...product,
        vendor_name: product.vendor?.name || 'Unknown Vendor',
        category_name: product.category?.name || 'Unknown Category',
        subcategory_name: product.subcategory?.name || 'Unknown Subcategory',
      }));

      setProductsData(formattedProducts);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    products: productsData, 
    isLoading, 
    error, 
    refetch: fetchProducts 
  };
};