import React from 'react';
import { Star, ShoppingCart, ExternalLink } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Database } from '../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'] & {
  vendor_name?: string;
  category_name?: string;
  subcategory_name?: string;
};

interface ProductCardProps {
  product: Product;
  onViewProduct: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewProduct }) => {
  const { addToCart } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await addToCart(product.id);
  };

  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(product.purchase_url, '_blank');
  };

  // Calculate discount percentage
  const discountPercentage = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div
      onClick={() => onViewProduct(product.id)}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.images[0] || 'https://images.pexels.com/photos/441923/pexels-photo-441923.jpeg?w=400&h=300&fit=crop'}
          alt={product.title}
          className="w-full h-36 sm:h-40 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
            {discountPercentage}% OFF
          </div>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleExternalLink}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
            title="View on vendor site"
          >
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors text-sm sm:text-base leading-tight">
          {product.title}
        </h3>
        
        <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 leading-tight">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="text-base sm:text-lg font-bold text-green-600">
              ${Number(product.price).toFixed(2)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-xs sm:text-sm text-gray-500 line-through">
                ${Number(product.original_price).toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded truncate max-w-20 sm:max-w-none">
            {product.vendor_name || 'Unknown'}
          </span>
        </div>

        <div className="flex items-center justify-between mb-3 text-xs sm:text-sm">
          <span className="text-gray-600">
            Stock: {product.stock}
          </span>
          <span className="text-gray-600 truncate max-w-20 sm:max-w-none">
            {product.category_name}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-2 sm:py-2.5 px-4 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium active:scale-95"
        >
          <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;