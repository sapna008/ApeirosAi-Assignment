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
      <div className="text-center py-12">
        <div className="inline-flex justify-center items-center w-24 h-24 bg-gray-100 rounded-full mb-6">
          <ShoppingCart className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
        <Link 
          to="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-block"
        >
          Start Shopping
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cart Items */}
        <div className="lg:w-2/3 bg-white rounded-lg shadow-md p-6">
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
          
          <div className="mt-6 flex justify-between items-center">
            <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">
              ← Continue Shopping
            </Link>
            
            <div className="flex items-center text-sm text-gray-500">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>Prices and availability are subject to change</span>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3 space-y-4">
          <CartSummary />
          
          <button
            onClick={() => navigate('/checkout')}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;