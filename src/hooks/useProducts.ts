import { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { products, profiles, categories, subcategories } from '../lib/schema';
import { eq, and, desc } from 'drizzle-orm';
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
      
      let query = db
        .select({
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
        })
        .from(products)
        .leftJoin(profiles, eq(products.vendorId, profiles.id))
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id));

      // Apply filters
      const conditions = [];
      if (options.categoryId) {
        conditions.push(eq(products.categoryId, options.categoryId));
      }
      if (options.subcategoryId) {
        conditions.push(eq(products.subcategoryId, options.subcategoryId));
      }
      if (options.vendorId) {
        conditions.push(eq(products.vendorId, options.vendorId));
      }
      if (options.status) {
        conditions.push(eq(products.status, options.status));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      query = query.orderBy(desc(products.createdAt));

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const result = await query;

      const formattedProducts = result.map(product => ({
        ...product,
        vendor_name: product.vendor_name || 'Unknown Vendor',
        category_name: product.category_name || 'Unknown Category',
        subcategory_name: product.subcategory_name || 'Unknown Subcategory',
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