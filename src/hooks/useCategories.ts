import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
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
      
      // Fetch categories with subcategories
      const { data: categoriesResult, error: categoriesError } = await supabase
        .from('categories')
        .select(`
          *,
          subcategories(*)
        `);

      if (categoriesError) {
        setError('Failed to fetch categories');
        console.error('Error fetching categories:', categoriesError);
        return;
      }

      setCategoriesData(categoriesResult || []);
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