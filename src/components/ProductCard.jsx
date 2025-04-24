import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };
  
  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 duration-300 flex flex-col group w-full">
      <Link to={`/product/${product.id}`} className="block h-full flex flex-col">
        <div className="relative pt-[100%] overflow-hidden bg-transparent">
          <img 
            src={product.image} 
            alt={product.title} 
            className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        
        <div className="p-4 flex flex-col flex-grow backdrop-blur-sm">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1 line-clamp-2 text-base">
            {product.title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-2 flex-grow">
            {product.category}
          </p>
          <div className="flex justify-between items-center mt-2">
            <span className="font-semibold text-teal-600 dark:text-teal-400 text-lg">${product.price.toFixed(2)}</span>
            <button 
              onClick={handleAddToCart}
              className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white rounded-full p-3 transition-colors duration-300"
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;