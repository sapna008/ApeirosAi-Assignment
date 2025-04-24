import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home, ArrowRight } from 'lucide-react';
import { database } from '../firebase/config';
import { ref, get } from 'firebase/database';

const OrderConfirmationPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderId = localStorage.getItem('lastOrderId');
        
        if (orderId) {
          const orderRef = ref(database, `orders/${orderId}`);
          const snapshot = await get(orderRef);
          
          if (snapshot.exists()) {
            setOrder(snapshot.val());
          }
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h1>
        <p className="text-gray-600 mb-6">We couldn't find your order details.</p>
        <Link 
          to="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-block"
        >
          Return to Shop
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center py-8">
        <div className="inline-flex justify-center items-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">
          Thank you for your order. We've received your purchase and will process it shortly.
        </p>
      </div>
      
      {/* Order Tracking */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-6">Track Your Order</h2>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
          
          {/* Timeline steps */}
          <div className="space-y-8">
            <div className="relative pl-10">
              <div className="absolute left-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-medium">Order Placed</h3>
              <p className="text-sm text-gray-500">
                Your order has been confirmed and is being processed
              </p>
            </div>
            
            <div className="relative pl-10">
              <div className="absolute left-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-medium">Order Packed</h3>
              <p className="text-sm text-gray-500">
                Your items are being packed and prepared for shipping
              </p>
            </div>
            
            <div className="relative pl-10">
              <div className="absolute left-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Truck className="h-5 w-5 text-gray-600" />
              </div>
              <h3 className="font-medium text-gray-600">Out for Delivery</h3>
              <p className="text-sm text-gray-500">
                Estimated: {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>
            
            <div className="relative pl-10">
              <div className="absolute left-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Home className="h-5 w-5 text-gray-600" />
              </div>
              <h3 className="font-medium text-gray-600">Delivered</h3>
              <p className="text-sm text-gray-500">
                Estimated: {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2">
            <div>
              <h3 className="text-gray-500">Shipping Address:</h3>
              <p className="text-sm">
                {order.customer.fullName}<br />
                {order.customer.address}<br />
                {order.customer.city}, {order.customer.state} {order.customer.zipCode}
              </p>
            </div>
            <div>
              <h3 className="text-gray-500">Contact Information:</h3>
              <p className="text-sm">
                {order.customer.email}<br />
                {order.customer.phone}
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-medium mb-2">Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <span className="text-gray-800">{item.title}</span>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Subtotal</span>
              <span>${order.pricing.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-600">Shipping</span>
              <span>${order.pricing.deliveryCharge.toFixed(2)}</span>
            </div>
            {order.pricing.promoDiscount > 0 && (
              <div className="flex justify-between mb-1 text-green-600">
                <span>Discount</span>
                <span>-${order.pricing.promoDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>${order.pricing.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mb-10">
        <Link 
          to="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
        >
          Continue Shopping
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;