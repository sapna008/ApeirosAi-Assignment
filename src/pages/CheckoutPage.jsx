import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard, Truck, Gift } from 'lucide-react';
import CartSummary from '../components/CartSummary';
import { useCart } from '../context/CartContext';
import { database } from '../firebase/config';
import { ref, push, set } from 'firebase/database';

const VALID_PROMO_CODES = {
  'WELCOME10': 10,
  'SUMMER20': 20,
  'FLASH25': 25
};

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState(5.99);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (cart.items.length === 0 && !isSubmitting) {
      navigate('/');
    }
  }, [cart.items, navigate, isSubmitting]);
  
  const handlePromoCodeApply = () => {
    const code = promoCode.trim().toUpperCase();
    
    if (code in VALID_PROMO_CODES) {
      const discount = (cart.totalAmount * VALID_PROMO_CODES[code]) / 100;
      setPromoDiscount(discount);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
      setPromoDiscount(0);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const errors = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) errors.fullName = 'Name is required';
      if (!formData.email.trim()) errors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
      if (!formData.phone.trim()) errors.phone = 'Phone is required';
      if (!formData.address.trim()) errors.address = 'Address is required';
      if (!formData.city.trim()) errors.city = 'City is required';
      if (!formData.state.trim()) errors.state = 'State is required';
      if (!formData.zipCode.trim()) errors.zipCode = 'ZIP code is required';
    }
    
  
    if (currentStep === 2) {
      if (!formData.cardNumber.trim()) errors.cardNumber = 'Card number is required';
      else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) 
        errors.cardNumber = 'Card number must be 16 digits';
      
      if (!formData.expiryDate.trim()) errors.expiryDate = 'Expiry date is required';
      else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) 
        errors.expiryDate = 'Use MM/YY format';
      
      if (!formData.cvv.trim()) errors.cvv = 'CVV is required';
      else if (!/^\d{3,4}$/.test(formData.cvv)) errors.cvv = 'CVV must be 3 or 4 digits';
    }
    
    return errors;
  };
  
  const handleNextStep = () => {
    const errors = validateForm();
    
    if (Object.keys(errors).length === 0) {
      setCurrentStep(prev => prev + 1);
    } else {
      setFormErrors(errors);
    }
  };
  
  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  const handleSubmitOrder = async () => {
    const errors = validateForm();
    
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      
      try {
        const total = cart.totalAmount + deliveryCharge - promoDiscount;

        const order = {
          customer: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode
          },
          items: cart.items.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity
          })),
          pricing: {
            subtotal: cart.totalAmount,
            deliveryCharge,
            promoDiscount,
            total
          },
          status: 'Pending',
          dateCreated: new Date().toISOString()
        };

        const ordersRef = ref(database, 'orders');
        const newOrderRef = push(ordersRef);
        await set(newOrderRef, order);

        localStorage.setItem('lastOrderId', newOrderRef.key);
        

        clearCart();

        navigate('/order-confirmation');
      } catch (error) {
        console.error('Error placing order:', error);
        alert('There was an error placing your order. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setFormErrors(errors);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Checkout</h1>
      
      <div className="flex mb-6">
        <div className={`flex-1 text-center ${currentStep >= 1 ? 'text-teal-500' : 'text-gray-400'}`}>
          <div className="relative">
            <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center border-2 ${
              currentStep >= 1 ? 'border-teal-500 bg-teal-500 text-white' : 'border-gray-300'
            }`}>
              {currentStep > 1 ? <Check className="h-3 w-3" /> : <span className="text-xs">1</span>}
            </div>
            <div className="mt-1 text-xs">Delivery</div>
        
            {currentStep > 1 && (
              <div className="absolute top-3 left-1/2 w-full h-0.5 bg-teal-500"></div>
            )}
          </div>
        </div>
        
        <div className={`flex-1 text-center ${currentStep >= 2 ? 'text-teal-500' : 'text-gray-400'}`}>
          <div className="relative">
            <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center border-2 ${
              currentStep >= 2 ? 'border-teal-500 bg-teal-500 text-white' : 'border-gray-300'
            }`}>
              {currentStep > 2 ? <Check className="h-3 w-3" /> : <span className="text-xs">2</span>}
            </div>
            <div className="mt-1 text-xs">Payment</div>
         
            {currentStep > 2 && (
              <div className="absolute top-3 left-1/2 w-full h-0.5 bg-teal-500"></div>
            )}
          </div>
        </div>
        
        <div className={`flex-1 text-center ${currentStep >= 3 ? 'text-teal-500' : 'text-gray-400'}`}>
          <div className="w-6 h-6 mx-auto rounded-full flex items-center justify-center border-2 border-gray-300">
            <span className="text-xs">3</span>
          </div>
          <div className="mt-1 text-xs">Review</div>
        </div>
      </div>
      
      <div className="flex flex-col gap-4">
        {/* form checkut */}
        <div className="w-full">
          {/*Delivery info */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-base font-semibold mb-3 flex items-center">
                <Truck className="h-4 w-4 mr-2 text-teal-500" />
                Delivery Information
              </h2>
              
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 outline-none ${
                      formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.fullName && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.fullName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 outline-none ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 outline-none ${
                      formErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.phone}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 outline-none ${
                      formErrors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.address && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.address}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 outline-none ${
                      formErrors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.city && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.city}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 outline-none ${
                        formErrors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.state && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.state}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 outline-none ${
                        formErrors.zipCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.zipCode && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.zipCode}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-5 flex justify-end">
                <button
                  onClick={handleNextStep}
                  className="px-5 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors text-sm"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}
          
          {/* Payment info */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-base font-semibold mb-3 flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-teal-500" />
                Payment Information
              </h2>
              
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 outline-none ${
                      formErrors.cardNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.cardNumber && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.cardNumber}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 outline-none ${
                        formErrors.expiryDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.expiryDate && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.expiryDate}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 outline-none ${
                        formErrors.cvv ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.cvv && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.cvv}</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                  <p className="text-xs text-gray-600 mb-2">We accept:</p>
                  <div className="flex flex-wrap gap-2">
                    <div className="px-2 py-1 bg-blue-900 text-white rounded text-xs">Visa</div>
                    <div className="px-2 py-1 bg-red-600 text-white rounded text-xs">Mastercard</div>
                    <div className="px-2 py-1 bg-teal-500 text-white rounded text-xs">American Express</div>
                    <div className="px-2 py-1 bg-yellow-400 text-black rounded text-xs">Discover</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-5 flex justify-between">
                <button
                  onClick={handlePrevStep}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors text-sm"
                >
                  Review Order
                </button>
              </div>
            </div>
          )}
          
          {/* Order ka Review */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-base font-semibold mb-3">Order Review</h2>
              
              <div className="space-y-3">
                <div className="border-b pb-3">
                  <h3 className="font-medium text-gray-700 mb-2 text-sm">Delivery Details</h3>
                  <p className="text-gray-600 text-xs">
                    {formData.fullName}<br />
                    {formData.email}<br />
                    {formData.phone}<br />
                    {formData.address}<br />
                    {formData.city}, {formData.state} {formData.zipCode}
                  </p>
                  <p className="mt-2 text-xs text-green-600 flex items-center">
                    <Truck className="h-3 w-3 mr-1" />
                    <span>Estimated delivery: 3-5 business days</span>
                  </p>
                </div>
                
                <div className="border-b pb-3">
                  <h3 className="font-medium text-gray-700 mb-2 text-sm">Order Items</h3>
                  <div className="space-y-2">
                    {cart.items.map(item => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="w-full h-full object-contain p-1"
                            />
                          </div>
                          <div className="ml-2 max-w-xs">
                            <p className="text-xs text-gray-800 line-clamp-1">{item.title}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-xs font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700 mb-2 text-sm">Payment</h3>
                  <p className="text-gray-600 flex items-center text-xs">
                    <CreditCard className="h-3 w-3 mr-2" />
                    Card ending in {formData.cardNumber.slice(-4)}
                  </p>
                </div>
              </div>
              
              <div className="mt-5 flex justify-between">
                <button
                  onClick={handlePrevStep}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors text-sm ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Order Summary */}
        <div className="w-full space-y-4">
          <CartSummary 
            promoCode={promoCode} 
            promoDiscount={promoDiscount} 
            deliveryCharge={deliveryCharge}
          />
          
          {/* Promo Code Section */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-medium text-gray-800 mb-2 flex items-center text-sm">
              <Gift className="h-4 w-4 mr-2 text-teal-500" />
              Apply Promo Code
            </h3>
            <div className="flex">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value);
                  setPromoError('');
                }}
                placeholder="Enter promo code"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:ring-teal-500 focus:border-teal-500 outline-none text-sm"
              />
              <button
                onClick={handlePromoCodeApply}
                className="px-3 py-2 bg-teal-500 text-white rounded-r-md hover:bg-teal-600 transition-colors text-sm"
              >
                Apply
              </button>
            </div>
            {promoError && <p className="mt-1 text-xs text-red-500">{promoError}</p>}
            {promoDiscount > 0 && (
              <p className="mt-1 text-xs text-green-600">
                Promo code applied! You saved ${promoDiscount.toFixed(2)}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Try codes: WELCOME10, SUMMER20, FLASH25
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;