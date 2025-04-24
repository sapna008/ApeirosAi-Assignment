import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  
  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };
  
  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };
  
  return (
    <div className="flex items-center py-4 border-b last:border-b-0">
      <div className="w-20 h-20 flex-shrink-0 bg-transparent rounded-md overflow-hidden">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-contain p-2"
        />
      </div>
      
      <div className="ml-4 flex-grow">
        <Link 
          to={`/product/${item.id}`}
          className="font-medium text-gray-800 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors line-clamp-1"
        >
          {item.title}
        </Link>
        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">${item.price.toFixed(2)} each</div>
      </div>
      
      <div className="flex items-center ml-4">
        <button 
          onClick={handleDecrease}
          className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </button>
        
        <span className="mx-2 w-8 text-center text-gray-700 dark:text-gray-300">{item.quantity}</span>
        
        <button 
          onClick={handleIncrease}
          className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <div className="ml-4 w-20 text-right font-medium text-gray-900 dark:text-gray-100">
        ${(item.price * item.quantity).toFixed(2)}
      </div>
      
      <button 
        onClick={() => removeFromCart(item.id)}
        className="ml-4 p-1 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
        aria-label="Remove item"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
};

export default CartItem;