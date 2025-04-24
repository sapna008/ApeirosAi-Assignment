import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();
  
  return (
    <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md sticky top-0 z-50 transition-colors duration-200">
      <div className="mx-auto">
        <div className="flex justify-between items-center h-14 px-4">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-teal-600 dark:text-teal-400">SapnaStore</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative text-gray-700 dark:text-gray-200">
              <ShoppingCart className="h-6 w-6" />
              {cart.totalQuantity > 0 && (
                <div className="absolute -top-2 -right-2 bg-teal-600 dark:bg-teal-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.totalQuantity}
                </div>
              )}
            </Link>
            <ThemeToggle />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 dark:text-gray-200">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="py-2 space-y-1 px-4">
            <Link 
              to="/" 
              className="block py-2 px-4 text-gray-700 dark:text-gray-200 hover:bg-teal-50 dark:hover:bg-gray-700 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/" 
              className="block py-2 px-4 text-gray-700 dark:text-gray-200 hover:bg-teal-50 dark:hover:bg-gray-700 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;