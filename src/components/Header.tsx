import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X, LogOut, Settings, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const totalItems = getTotalItems();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const getUserMenuItems = () => {
    if (!user) return [];
    
    const baseItems = [
      { label: 'Profile', icon: User, action: () => onNavigate('profile') },
      { label: 'Orders', icon: Package, action: () => onNavigate('orders') },
      { label: 'Settings', icon: Settings, action: () => onNavigate('settings') },
    ];

    if (user.role === 'vendor') {
      baseItems.unshift({ label: 'Vendor Dashboard', icon: Package, action: () => onNavigate('vendor-dashboard') });
    } else if (user.role === 'admin') {
      baseItems.unshift({ label: 'Admin Dashboard', icon: Settings, action: () => onNavigate('admin-dashboard') });
    }

    baseItems.push({ label: 'Logout', icon: LogOut, action: logout });
    return baseItems;
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-xl sm:text-2xl font-bold font-recoleta bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
            >
              SuperMarket
            </button>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Icon - Mobile */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <Search className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Cart */}
            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-[10px] sm:text-xs">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name} className="h-6 w-6 sm:h-8 sm:w-8 rounded-full" />
                  ) : (
                    <User className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                  )}
                  <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-20 truncate">
                    {user.name}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {getUserMenuItems().map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          item.action();
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-2 sm:px-4 py-1 sm:py-2 text-green-600 hover:text-green-800 font-medium transition-colors text-sm"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="px-2 sm:px-4 py-1 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors text-sm"
                >
                  Signup
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-green-600"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                  autoFocus
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => {
                    onNavigate('home');
                    setIsMenuOpen(false);
                  }}
                  className="text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    onNavigate('categories');
                    setIsMenuOpen(false);
                  }}
                  className="text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Categories
                </button>
                <button
                  onClick={() => {
                    onNavigate('vendor-apply');
                    setIsMenuOpen(false);
                  }}
                  className="text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Become a Vendor
                </button>
                {user && (
                  <>
                    <button
                      onClick={() => {
                        onNavigate('orders');
                        setIsMenuOpen(false);
                      }}
                      className="text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      My Orders
                    </button>
                    {user.role === 'vendor' && (
                      <button
                        onClick={() => {
                          onNavigate('vendor-dashboard');
                          setIsMenuOpen(false);
                        }}
                        className="text-left px-4 py-3 text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium"
                      >
                        Vendor Dashboard
                      </button>
                    )}
                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          onNavigate('admin-dashboard');
                          setIsMenuOpen(false);
                        }}
                        className="text-left px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                      >
                        Admin Dashboard
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;