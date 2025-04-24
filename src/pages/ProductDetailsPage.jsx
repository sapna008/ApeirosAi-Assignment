import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Truck, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product);
      navigate('/checkout');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="flex flex-col gap-6">
          <div className="w-full bg-gray-200 rounded-lg h-64"></div>
          <div className="w-full space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="h-12 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p className="text-red-500 mb-4">Error loading product</p>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-4">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-4 flex items-center text-gray-600 hover:text-teal-500 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </button>
      
      <div className="flex flex-col gap-6">

        <div className="w-full bg-white rounded-lg p-4 flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.title} 
            className="max-h-60 object-contain mx-auto"
          />
        </div>
        

        <div className="w-full">
          <h1 className="text-xl font-bold text-gray-800 mb-2">{product.title}</h1>
          
          <div className="flex items-center mb-3">
            <div className="flex items-center mr-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < Math.round(product.rating?.rate || 0) 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'fill-gray-200 text-gray-200'}`} 
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating?.rate} ({product.rating?.count} reviews)
            </span>
          </div>
          
          <div className="text-xl font-bold text-teal-500 mb-3">
            ${product.price.toFixed(2)}
          </div>
          
          <p className="text-gray-600 text-sm mb-4">{product.description}</p>
          
          <div className="flex items-center text-green-600 mb-4 text-sm">
            <Truck className="h-4 w-4 mr-2" />
            <span>Free delivery available</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleAddToCart}
              className="px-3 py-2 border-2 border-teal-500 text-teal-500 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center text-sm"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="px-3 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors text-sm"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;