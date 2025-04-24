import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import CartItem from '../components/CartItem';
import CartSummary from '../components/CartSummary';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  
  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 text-center py-10">
        <div className="inline-flex justify-center items-center w-20 h-20 bg-gray-100 rounded-full mb-4">
          <ShoppingCart className="h-10 w-10 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Your cart is empty</h2>
        <p className="text-gray-600 mb-5 text-sm">Looks like you haven't added any products to your cart yet.</p>
        <Link 
          to="/"
          className="px-5 py-3 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors inline-block"
        >
          Start Shopping
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Your Shopping Cart</h1>
      
      <div className="flex flex-col gap-5">
        {/* Cart Items */}
        <div className="w-full bg-white rounded-lg shadow-md p-4">
          <div className="hidden md:flex text-sm text-gray-500 border-b pb-3">
            <div className="w-1/2">Product</div>
            <div className="w-1/4 text-center">Quantity</div>
            <div className="w-1/4 text-right">Price</div>
          </div>
          
          <div className="divide-y">
            {cart.items.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <Link to="/" className="text-teal-500 hover:text-teal-700 transition-colors text-sm">
              ← Continue Shopping
            </Link>
            
            <div className="flex items-center text-xs text-gray-500">
              <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
              <span>Prices and availability are subject to change</span>
            </div>
          </div>
        </div>

        <div className="w-full space-y-4 sticky bottom-0 md:static">
          <CartSummary />
          
          <button
            onClick={() => navigate('/checkout')}
            className="w-full px-5 py-3 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors text-center"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;