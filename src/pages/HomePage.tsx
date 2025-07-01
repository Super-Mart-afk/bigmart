import React from 'react';
import { ArrowRight, TrendingUp, Shield, Truck } from 'lucide-react';
import CategoryGrid from '../components/CategoryGrid';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { products: featuredProducts, isLoading } = useProducts({ 
    status: 'active', 
    limit: 8 
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-blue-600 to-teal-700 text-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-recoleta mb-4 sm:mb-6 leading-tight">
              Welcome to <span className="text-yellow-300">SuperMarket</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-green-100 px-4 leading-relaxed">
              Your premier destination for quality products from trusted vendors worldwide
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <button
                onClick={() => onNavigate('categories')}
                className="bg-white text-green-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 active:scale-95"
              >
                <span>Shop Now</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={() => onNavigate('vendor-apply')}
                className="border-2 border-white text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors active:scale-95"
              >
                Become a Vendor
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-recoleta text-center text-gray-900 mb-8 sm:mb-12">
            Why Choose SuperMarket?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Trusted Vendors</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                All vendors are carefully vetted and approved by our admin team
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Truck className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Fast Shipping</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Quick and reliable shipping from vendors worldwide
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Best Prices</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Competitive prices with exclusive deals and discounts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold font-recoleta text-gray-900 mb-3 sm:mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              Discover thousands of products across all categories
            </p>
          </div>
          <CategoryGrid onCategoryClick={(categoryId) => onNavigate(`category/${categoryId}`)} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 sm:mb-12 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-recoleta text-gray-900 mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Latest products from our verified vendors
              </p>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="text-green-600 hover:text-green-800 font-semibold flex items-center space-x-1 self-start sm:self-auto"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md animate-pulse">
                  <div className="h-36 sm:h-40 lg:h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-3 sm:p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewProduct={(id) => onNavigate(`product/${id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-base sm:text-lg">No products available yet.</p>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">Check back soon for new arrivals!</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold font-recoleta mb-1 sm:mb-2">Live</div>
              <div className="text-green-200 text-sm sm:text-base">Platform</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold font-recoleta mb-1 sm:mb-2">Real</div>
              <div className="text-green-200 text-sm sm:text-base">Products</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold font-recoleta mb-1 sm:mb-2">Active</div>
              <div className="text-green-200 text-sm sm:text-base">Vendors</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold font-recoleta mb-1 sm:mb-2">24/7</div>
              <div className="text-green-200 text-sm sm:text-base">Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;