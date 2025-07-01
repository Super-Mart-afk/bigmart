import { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { categories, subcategories } from '../lib/schema';
import { eq } from 'drizzle-orm';
import type { CategoryWithSubcategories } from '../lib/database.types';

export const useCategories = () => {
  const [categoriesData, setCategoriesData] = useState<CategoryWithSubcategories[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      
      // Fetch categories
      const categoriesResult = await db.select().from(categories);
      
      // Fetch subcategories for each category
      const categoriesWithSubs = await Promise.all(
        categoriesResult.map(async (category) => {
          const subcategoriesResult = await db
            .select()
            .from(subcategories)
            .where(eq(subcategories.categoryId, category.id));
          
          return {
            ...category,
            subcategories: subcategoriesResult,
          };
        })
      );

      setCategoriesData(categoriesWithSubs);
    } catch (err) {
      setError('Failed to fetch categories');
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    categories: categoriesData, 
    isLoading, 
    error, 
    refetch: fetchCategories 
  };
};