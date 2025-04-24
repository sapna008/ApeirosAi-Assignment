import React from 'react';
import { useCart } from '../context/CartContext';

const CartSummary = ({ promoCode = "", promoDiscount = 0, deliveryCharge = 5.99 }) => {
  const { cart } = useCart();
  
  const subtotal = cart.totalAmount;
  const total = subtotal + deliveryCharge - promoDiscount;
  
  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b pb-4 mb-4">Order Summary</h2>
      
      <div className="space-y-2">
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>Delivery</span>
          <span>${deliveryCharge.toFixed(2)}</span>
        </div>
        
        {promoDiscount > 0 && (
          <div className="flex justify-between text-teal-600 dark:text-teal-400">
            <span>Promo ({promoCode})</span>
            <span>-${promoDiscount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="border-t my-2 pt-2"></div>
        
        <div className="flex justify-between font-semibold text-lg text-gray-900 dark:text-gray-100">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;