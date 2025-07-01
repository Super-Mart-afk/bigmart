import React from 'react';
import { useCategories } from '../hooks/useCategories';
import * as Icons from 'lucide-react';

interface CategoryGridProps {
  onCategoryClick: (categoryId: string) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ onCategoryClick }) => {
  const { categories, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-md animate-pulse">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-200 rounded-full mb-2 sm:mb-3 lg:mb-4"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-20 lg:w-24 mb-1 sm:mb-2"></div>
              <div className="h-2 sm:h-3 bg-gray-200 rounded w-12 sm:w-14 lg:w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 text-sm sm:text-base">Error loading categories: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
      {categories.map((category) => {
        const IconComponent = Icons[category.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
        
        return (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
            className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group active:scale-95"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-2 sm:mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300">
                {IconComponent ? (
                  <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                ) : (
                  <Icons.Package className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                )}
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors text-xs sm:text-sm lg:text-base leading-tight">
                {category.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-tight">
                {category.subcategories.length} items
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryGrid;